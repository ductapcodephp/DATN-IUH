# Dự án Tốt nghiệp: EduFlow - Nền tảng Học trực tuyến (E-Learning Marketplace)

## 1. Thông tin tổng quan
- **Tên dự án**: EduFlow - Nền tảng chia sẻ và học tập trực tuyến
- **Mô hình**: Monolithic Application (Monolith hiện đại) theo mô hình Marketplace (C2C)
- **Công nghệ cốt lõi**:
  - **Backend**: Laravel 12 (PHP 8.2), MySQL, Redis (Predis)
  - **Frontend**: ReactJS (kết nối qua InertiaJS), Bootstrap 5
  - **Cloud Storage**: Cloudflare R2 (S3-compatible Object Storage)
  - **Payment Gateway**: VNPay
  - **Kiến trúc**: Layered Architecture, Repository Pattern, Event-Driven, Pipeline Pattern, DTO Pattern, Write-Behind Cache
- **Vai trò tham gia**: Fullstack Developer / Software Engineer

---

## 2. Các điểm kỹ thuật nổi bật (Technical Highlights cho CV)

### ⚡ 2.1. Direct Upload Architecture — Cloudflare R2 Object Storage
> **Bài toán**: Video bài giảng dung lượng lớn (hàng trăm MB → GB). Upload qua server PHP sẽ nghẽn RAM, tốn băng thông gấp đôi, và timeout.

- Thiết kế kiến trúc **Client-Side Direct Upload** bỏ qua hoàn toàn Application Server.
- Server chỉ sinh **Presigned Upload URL** (TTL 30 phút) bằng `Storage::disk('r2')->temporaryUploadUrl()` — browser gửi `PUT` binary trực tiếp lên Cloudflare R2.
- Sau khi upload xong, frontend gọi API **Confirm Upload** để server lưu metadata (`r2_key`, `duration_seconds`, `size_bytes`, `mime_type`) vào MySQL.
- Triển khai **Seller Storage Quota**: Mỗi Seller có giới hạn dung lượng upload theo gói VIP (`SUM(videos.size_bytes) vs max_storage_gb`), kiểm tra trước khi sinh Presigned URL.
- **Signed URL Streaming**: Video không public, mỗi lần học viên xem bài sẽ sinh URL tạm (TTL 4 giờ) qua `temporaryUrl()` trên Model Accessor — chống hotlink/copy link trái phép.

### ⚡ 2.2. Redis Write-Behind Cache — Video Progress Tracking + Anti-Cheat
> **Bài toán**: Frontend gửi progress mỗi 10-30 giây/user. Hàng nghìn DB writes/phút nếu ghi thẳng MySQL. Đồng thời cần chống gian lận tiến độ.

- Áp dụng **Write-Behind (Write-Back) Cache Pattern**: Progress updates ghi vào Redis trước (`Redis::setex()`, TTL 1 giờ), sau đó dispatch `UpdateVideoProgressJob` **delay 30 giây** để batch-persist xuống MySQL.
- **Anti-Cheat Validation** ngay tại Service layer:
  - Mỗi lần ping, progress chỉ được tăng tối đa **25 giây** (`$maxJumpAllowed = 25`). Nếu user hack gửi `watched_seconds` lớn → bị reject, giữ nguyên giá trị cũ.
  - Ping đầu tiên nếu `watched > 25s` → reset về 0 (chống skip-to-end).
  - Lesson phải xem ≥ **70%** video mới tính hoàn thành. Quiz phải đúng **100%** câu hỏi mới pass.
- **ShouldBeUnique**: Job implement `ShouldBeUnique` với `uniqueId = "{userId}_{lessonId}"` và `uniqueFor = 3600` → dù frontend gửi 100 pings, chỉ **1 job duy nhất** chạy cho mỗi user-lesson.
- **Dual-Read Strategy**: `getProgress()` đọc Redis trước (data mới nhất), fallback DB nếu Redis miss → UX mượt, user luôn thấy progress realtime.

### ⚡ 2.3. Redis — Unified Infrastructure Backbone (5 mục đích)
> Redis không chỉ là cache — nó là **trung tâm hạ tầng** phục vụ 5 concern khác nhau:

1. **Cache Layer** (`CACHE_STORE=redis`): Giảm tải query nặng.
2. **Queue Backend** (`QUEUE_CONNECTION=redis`): Xử lý bất đồng bộ toàn bộ background jobs.
3. **Session Storage** (`SESSION_DRIVER=redis`): Lưu HTTP session, giảm I/O disk.
4. **Single-Device Session Enforcement** (`user_session:{id}`, TTL 24h): Middleware `CheckDeviceSession` kiểm tra device_id + token hash mỗi request qua Redis thay vì query DB. Chỉ sync `last_used_at` vào MySQL mỗi **10 phút** → giảm cực kỳ nhiều DB writes.
5. **Rate Limiting** (`throttle:X,Y`): Redis atomic `INCR` + `EXPIRE` bảo vệ login (5/phút), register (3/60 phút), checkout (5/phút), withdraw (2/10 phút), search (60/phút).

### ⚡ 2.4. Event-Driven Architecture + Laravel Queue (Named Queue Isolation)
> **Bài toán**: Tách side-effects ra khỏi luồng chính, đảm bảo API response nhanh mili-giây.

- **7 Events** (`PaymentCompleted`, `ReportResolved`, `ReportDismissed`, `SellerApplied`, `SellerApproved`, `SellerRejected`, `UserRegistered`, `UserLoggedIn`) trigger **12+ Queued Listeners** xử lý bất đồng bộ.
- Ví dụ fan-out: `PaymentCompleted` → đồng thời gửi email xác nhận + tạo enrollment notification + cập nhật statistics.
- **6 Queued Notifications** (database channel) cho Admin: Report mới, Withdrawal request mới, Contact mới, Comment report mới.
- **6 Mailables** gửi email qua Queue: Payment success, Report resolved/dismissed, Seller application received/approved/rejected.
- **Scheduled Commands**:
  - `everyMinute()`: Hủy payment pending >1 phút, hoàn coupon usage.
  - `dailyAt('01:00')`: Giải ngân earnings Seller sau thời gian chờ (chống refund).
  - `dailyAt('02:00')`: Cảnh báo VIP sắp hết hạn (3 ngày trước).

### ⚡ 2.5. Pipeline Pattern — Payment Processing (VNPay IPN)
> **Bài toán**: Quy trình thanh toán nhiều bước, cần dễ mở rộng và tuân thủ SRP.

- Chia quy trình xử lý IPN callback thành các **Pipes** nối tiếp: `ValidateSignature → FindPayment → CheckDuplicate → CompletePayment → UpdateStatus`.
- Mỗi Pipe chỉ làm 1 việc (Single Responsibility). Thêm/bớt bước dễ dàng (ví dụ: thêm Fraud Detection Pipe) mà không sửa code cũ.
- Pipe `CompleteOrderPayment` / `CompleteDepositPayment` xử lý cộng tiền ví, tạo enrollment, chia hoa hồng, fire `PaymentCompleted` event.

### ⚡ 2.6. Chống Race Condition — Pessimistic Locking cho Giao dịch Tài chính
> **Bài toán**: Nhiều request đồng thời trừ tiền ví → double-spending.

- Tất cả giao dịch ví (mua khóa học, rút tiền, cộng thưởng, chia hoa hồng) sử dụng `lockForUpdate()` + `DB::transaction()`.
- Wallet bị khóa row-level trong MySQL → request đồng thời phải chờ → chống triệt để lỗi double-spending.
- Hệ thống Wallet kép: **User Wallet** (nạp/mua) + **System Wallet** (hoa hồng nền tảng) + **Seller Wallet** (doanh thu bán khóa).

### ⚡ 2.7. Layered Architecture + Repository Pattern + DTO
- Phân tầng rõ ràng: `Controller → DTO → Service → Repository → Eloquent Model`.
- **DTO Pattern** (PHP 8.2 `readonly class`): Dữ liệu từ Request đóng gói chặt chẽ qua DTO trước khi vào Service — đảm bảo Type Safety, không truyền array thô.
- **Repository Pattern**: Tách Data Access khỏi Business Logic — có thể swap database engine mà không ảnh hưởng Service layer.

### ⚡ 2.8. OAuth 2.0 + Custom Token Management + Single-Device Auth
- Đăng nhập một chạm qua **Google/Facebook** (Laravel Socialite + OAuth 2.0).
- Hệ thống **Refresh Token/Access Token** tự xây dựng (không dùng Passport/Sanctum token).
- **Single-Device Login**: Middleware `CheckDeviceSession` dùng Redis lưu session hiện tại → đăng nhập thiết bị mới sẽ revoke session cũ. Verify mỗi request chỉ tốn **O(1) Redis GET** thay vì database query.

### ⚡ 2.9. DevOps & Deployment thực tế
- Tự cấu hình và deploy lên **Ubuntu Server** (VPS thực tế).
- Setup: Nginx, PHP-FPM, MySQL, Redis, SSL/HTTPS, Supervisor (queue workers).
- Build frontend assets (Vite) trên production.
- Cấu hình CORS, environment variables, log rotation.

---

## 3. Mô tả Nghiệp vụ Hệ thống

### 3.1. Phân hệ Học viên (User)
- Đăng ký/đăng nhập (truyền thống + OAuth Google/Facebook).
- Duyệt, tìm kiếm, mua khóa học (Ví nội bộ / VNPay). Áp mã Coupon.
- Xem video streaming (Signed URL từ R2). Theo dõi tiến độ realtime (Redis cache).
- Làm Quiz. Nhận chứng chỉ khi hoàn thành 100%.
- Đánh giá (≥80% progress), bình luận, ghi chú video, báo cáo vi phạm.
- Mua gói VIP học thả ga.

### 3.2. Phân hệ Giảng viên (Seller)
- Đăng ký Seller → Admin duyệt (queued email thông báo).
- Dashboard quản lý khóa học: Tạo Course → Chapter → Lesson → Upload video trực tiếp lên R2.
- Quản lý dung lượng storage (quota theo VIP tier).
- Theo dõi doanh thu, chia hoa hồng với nền tảng. Yêu cầu rút tiền → Admin duyệt.
- Tạo/quản lý Coupon.

### 3.3. Phân hệ Quản trị (Admin)
- Kiểm duyệt khóa học, Seller application (approve/reject).
- Xử lý Report vi phạm → Resolve (xóa + email cảnh báo) / Dismiss (email giải thích). Toàn bộ qua Queue.
- Quản lý VIP Packages, System Wallet, Commission settings.
- Duyệt Withdrawal Request → đối soát số dư → giải ngân.
- Dashboard thống kê toàn nền tảng.

---

## 4. Tóm tắt Stack kỹ thuật cho CV

| Hạng mục | Công nghệ / Pattern |
|---|---|
| **Backend Framework** | Laravel 12, PHP 8.2 |
| **Frontend** | ReactJS, InertiaJS |
| **Database** | MySQL (Pessimistic Locking, Transactions) |
| **Cache/Queue/Session** | Redis (Predis) — unified backbone |
| **Object Storage** | Cloudflare R2 (S3-compatible, Presigned URL, Signed URL) |
| **Payment** | VNPay (Pipeline Pattern IPN Processing) |
| **Auth** | OAuth 2.0 (Google/Facebook), Custom JWT-like Token, Single-Device Enforcement |
| **Architecture** | Layered, Repository Pattern, Event-Driven, Pipeline, Write-Behind Cache, DTO |
| **DevOps** | Ubuntu Server, Nginx, Supervisor, SSL/HTTPS, Vite Build |
| **Anti-Cheat** | Redis-buffered progress + time-jump validation |
| **Performance** | Eager Loading (N+1 prevention), Redis caching, Queue async processing, Lazy DB sync |

---
*Bản tóm tắt thể hiện tư duy kiến trúc hệ thống lớn, xử lý concurrency, tối ưu hiệu năng, và giải quyết bài toán thực tế ở quy mô production.*
