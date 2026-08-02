# Phân Tích Kiến Trúc Hệ Thống - EduFlow E-Learning Platform

## 1. Tổng quan kiến trúc

Hệ thống là một nền tảng giáo dục trực tuyến theo mô hình **Marketplace (C2C)** phát triển trên nền tảng **Laravel 12 + ReactJS/InertiaJS**. Hệ thống cho phép Giảng viên (Seller) đăng tải khóa học, Học viên (User) mua và học, Admin quản trị toàn bộ nền tảng.

### Kiến trúc tổng thể
```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                            │
│                    ReactJS + InertiaJS (SPA)                        │
├─────────────┬──────────────────────────────┬────────────────────────┤
│             │                              │                        │
│   Inertia   │    REST API (Progress,       │   Direct Upload PUT    │
│   Request   │    Cart, Checkout...)        │   (Video → R2)         │
│             │                              │                        │
├─────────────▼──────────────────────────────▼────────────────────────┤
│                     Laravel Application Server                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                             │   │
│  │  ├─ CheckDeviceSession (Redis Single-Device Auth)            │   │
│  │  ├─ ThrottleRequests (Redis Rate Limiting)                   │   │
│  │  └─ Auth / CORS / CSRF                                      │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  Controller → DTO → Service → Repository → Eloquent         │   │
│  │  (Layered Architecture + Repository Pattern)                 │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  Event/Listener System (Event-Driven Architecture)           │   │
│  │  Pipeline Pattern (Payment Processing)                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────┤
│                     Infrastructure Layer                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │   MySQL     │  │   Redis    │  │Cloudflare  │  │ VNPay / Momo │  │
│  │  Database   │  │  (Cache +  │  │    R2      │  │  Payment     │  │
│  │            │  │  Queue +   │  │  (Object   │  │  Gateway     │  │
│  │            │  │  Session)  │  │  Storage)  │  │              │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Kiến trúc Lưu trữ Đám mây - Cloudflare R2 (Direct Upload Architecture)

### 2.1. Vấn đề giải quyết
Video bài giảng có dung lượng lớn (hàng trăm MB → vài GB). Nếu upload qua server Laravel:
- Server PHP bị nghẽn RAM/CPU khi nhận file lớn.
- Tốn băng thông gấp đôi (Client → Server → R2).
- Timeout cho request dài.

### 2.2. Giải pháp: Direct Upload via Presigned URL
Hệ thống triển khai kiến trúc **Client-Side Direct Upload** bỏ qua hoàn toàn Application Server:

```
┌──────────┐    1. Request Presigned URL     ┌──────────────┐
│  Browser  │ ──────────────────────────────► │ Laravel API  │
│ (React)   │ ◄────────────────────────────── │              │
│           │    2. Return {url, key}         │  ┌─────────┐ │
│           │                                 │  │ Quota   │ │
│           │                                 │  │ Check   │ │
│           │                                 │  └─────────┘ │
│           │    3. PUT Binary (Video)        └──────────────┘
│           │ ──────────────────────────────────────────────────►┌──────────┐
│           │                                                    │Cloudflare│
│           │                                                    │    R2    │
│           │    4. Confirm Upload                               └──────────┘
│           │ ──────────────────────────────► ┌──────────────┐
│           │                                 │ Laravel API  │
│           │                                 │ Save metadata│
│           │                                 │ to MySQL     │
└──────────┘                                  └──────────────┘
```

**Quy trình chi tiết:**
1. **Step 1 - Generate Presigned URL**: Frontend gửi `POST /seller/courses/{course}/lessons/{lesson}/video/presigned-url` kèm `{extension, size_bytes}`.
2. **Step 2 - Quota Check + URL Generation**: Server kiểm tra dung lượng đã dùng vs giới hạn VIP tier (`getSellerStorageLimitBytes()`), sau đó sinh Presigned Upload URL (TTL: 30 phút) bằng `Storage::disk('r2')->temporaryUploadUrl()`.
3. **Step 3 - Direct Upload**: Browser gửi `PUT` binary trực tiếp lên Cloudflare R2, **không đi qua server PHP**.
4. **Step 4 - Confirm Upload**: Frontend gọi `POST .../video/confirm` với metadata (`r2_key, duration_seconds, size_bytes, mime_type`). Server lưu vào DB, xóa video cũ trên R2 nếu có.

### 2.3. Signed URL cho Video Streaming (Chống hotlink)
Video không được public. Khi học viên xem bài giảng, URL video được sinh **động** qua Model Accessor:
```php
// Video Model - getUrlAttribute()
Storage::disk('r2')->temporaryUrl($this->r2_key, now()->addHours(4));
```
- URL tự hết hạn sau **4 giờ**, chống copy link / hotlink.
- Mỗi lần load trang học = sinh URL mới.

### 2.4. Seller Storage Quota
Mỗi Seller có giới hạn dung lượng upload theo gói VIP:
- **`getSellerStorageLimitBytes()`**: Lấy từ VIP subscription hiện tại (`max_storage_gb * 1024^3`), mặc định 5MB nếu không có VIP.
- **`getSellerStorageUsedBytes()`**: `SUM(videos.size_bytes)` qua JOIN `videos → lessons → chapters → courses WHERE seller_id`.

---

## 3. Kiến trúc Redis (Multi-Purpose Infrastructure)

Redis không chỉ là cache — nó là **backbone hạ tầng** phục vụ **5 mục đích khác nhau**:

### 3.1. Session Storage (`SESSION_DRIVER=redis`)
Toàn bộ HTTP session lưu trên Redis, không lưu file/database → giảm I/O disk, tăng tốc middleware auth.

### 3.2. Queue Backend (`QUEUE_CONNECTION=redis`)
Tất cả background jobs (email, progress flush, statistics) đều đẩy vào Redis queue → xử lý bất đồng bộ bởi queue workers.

### 3.3. Single-Device Session Enforcement
**Middleware `CheckDeviceSession`** - chống đăng nhập nhiều thiết bị cùng lúc:
- **Key**: `user_session:{user_id}` — TTL: 86,400s (24 giờ).
- **Data**: `{id, device_id, token (SHA-256), is_revoked, expires_at, last_used_at, last_sync_db}`.
- Mỗi request, middleware kiểm tra device_id + token hash trong Redis thay vì query DB.
- **Lazy DB Sync**: Chỉ ghi `last_used_at` vào MySQL khi đã qua **>600 giây (10 phút)** kể từ lần sync cuối → giảm DB writes đáng kể.
- **Invalidation**: `Redis::del("user_session:{id}")` được gọi khi logout, login mới, hoặc đăng ký.

### 3.4. Video Progress Buffering (Write-Behind Cache)
Chi tiết tại mục 4 bên dưới.

### 3.5. Rate Limiting (`throttle:X,Y`)
Laravel sử dụng Redis atomic `INCR` + `EXPIRE` cho rate limiting trên các endpoint nhạy cảm:

| Endpoint | Giới hạn | Mục đích |
|---|---|---|
| `/login` | 5 req / 1 phút | Chống brute-force |
| `/register` | 3 req / 60 phút | Chống spam account |
| `/seller/apply` | 3 req / 1 phút | Chống spam đăng ký seller |
| `/wallet/withdraw` | 2 req / 10 phút | Bảo vệ giao dịch tài chính |
| `/checkout/process` | 5 req / 1 phút | Chống double-purchase |
| `/cart/apply-coupons` | 5 req / 1 phút | Chống abuse coupon |
| `/courses/search-suggestions` | 60 req / 1 phút | Chống DDoS search |
| `/contact` | 3 req / 10 phút | Chống spam liên hệ |

---

## 4. Hệ thống Theo dõi Tiến độ Học tập (Write-Behind Cache + Anti-Cheat)

Đây là điểm kỹ thuật phức tạp nhất của hệ thống, giải quyết 3 bài toán cùng lúc:
1. **High-frequency writes**: Frontend gửi progress mỗi 10-30 giây → hàng nghìn writes/phút nếu ghi thẳng DB.
2. **Anti-Cheat**: Học viên có thể hack skip video để lấy chứng chỉ.
3. **Realtime UX**: User phải thấy progress mới nhất ngay lập tức.

### 4.1. Luồng xử lý End-to-End

```
Frontend (mỗi ~15 giây gửi progress)
    │
    ▼
LearningController::updateVideoProgress()
    │ Validate → VideoProgressData DTO
    ▼
LearningService::updateVideoProgress()
    │
    ├─► [1] Đọc progress cũ từ Redis: Redis::get("video_progress:{userId}:{lessonId}")
    │
    ├─► [2] Anti-Cheat Validation:
    │       - Tính $videoTimeJump = $newWatched - $oldWatched
    │       - Nếu $videoTimeJump > 25 giây → REJECT, giữ nguyên $oldWatched
    │       - Lần ping đầu tiên nếu $newWatched > 25 → reset về 0
    │
    ├─► [3] Ghi vào Redis: Redis::setex($redisKey, 3600, $payload)
    │       - TTL: 1 giờ
    │       - Data: {watched_seconds, skipped_seconds, duration_seconds, updated_at}
    │
    ├─► [4] Dispatch Job (delay 30s):
    │       UpdateVideoProgressJob::dispatch(...)->delay(now()->addSeconds(30))
    │
    └─► [5] Return JSON ngay lập tức (không chờ DB)
              {"success": true, "queued": true, "watched_seconds": 120}

    ═══════════════════════════════════════════════════
    [Sau 30 giây - Queue Worker xử lý]

UpdateVideoProgressJob (ShouldBeUnique, uniqueFor=3600)
    │
    ├─► Đọc progress mới nhất từ Redis
    ├─► Upsert vào CourseProgress table
    ├─► Nếu lesson hoàn thành (watched/duration ≥ 70%):
    │       ├─► Tính lại % hoàn thành khóa học
    │       └─► Update CourseEnrollment.progress
    └─► Nếu course 100% → Cấp chứng chỉ
```

### 4.2. Anti-Cheat Logic
- **Max Jump**: Mỗi lần ping, progress chỉ được tăng tối đa **25 giây**. Nếu user hack gửi `watched_seconds=3600` (1 tiếng) trong 1 lần → bị reject.
- **First Ping Guard**: Ping đầu tiên nếu `watched > 25s` → reset về 0 (chống skip-to-end).
- **70% Completion Threshold**: Phải xem ≥70% video mới tính hoàn thành.
- **Quiz 100%**: Bài kiểm tra phải đúng 100% câu hỏi mới pass.

### 4.3. ShouldBeUnique - Chống duplicate job
`UpdateVideoProgressJob` implement `ShouldBeUnique` với:
- `$uniqueFor = 3600` (lock 1 giờ)
- `uniqueId() = "{userId}_{lessonId}"`

→ Dù frontend gửi 100 progress pings, chỉ có **1 job duy nhất** chạy cho mỗi user-lesson trong 1 giờ.

---

## 5. Kiến trúc Queue & Event-Driven

### 5.1. Named Queue Isolation
Hệ thống phân tách workload vào các queue riêng biệt:

| Queue | Jobs | Ý nghĩa |
|---|---|---|
| `default` | UpdateVideoProgressJob | Progress DB persistence |
| `notifications` | Gửi email (Report, Seller, Payment...) | Thông báo |

### 5.2. Event-Driven Fan-Out
Một business event trigger nhiều side-effects độc lập:

```
CoursePurchased Event
    ├──► Listener: Tạo WalletTransaction (chia hoa hồng)
    ├──► Listener: Gửi Enrollment Notification cho Seller
    └──► Listener: Cập nhật Course Statistics

ReportResolved Event
    └──► Queued Listener: Gửi email cảnh báo cho tác giả vi phạm

SellerApplied/Approved/Rejected Events
    └──► Queued Listeners: Gửi email tương ứng cho Seller
```

### 5.3. Scheduled Commands (Cron Jobs)

| Schedule | Command | Tác dụng |
|---|---|---|
| `everyMinute()` | `payments:cancel-abandoned` | Hủy đơn thanh toán pending >1 phút, hoàn coupon |
| `dailyAt('01:00')` | `seller:release-earnings` | Giải ngân earnings sau thời gian chờ (chống refund) |
| `dailyAt('02:00')` | `vip:check-expiring` | Cảnh báo VIP sắp hết hạn (3 ngày trước) |

---

## 6. Pipeline Pattern - Xử lý Thanh toán VNPay IPN

Quy trình thanh toán phức tạp được chia nhỏ thành các **Pipes** nối tiếp:

```
VNPay IPN Callback
    │
    ▼
Pipeline::send($data)
    │
    ├──► Pipe 1: ValidateSignature (xác thực chữ ký VNPay)
    ├──► Pipe 2: FindPayment (tìm đơn thanh toán)
    ├──► Pipe 3: CheckDuplicate (chống xử lý trùng)
    ├──► Pipe 4: CompleteDepositPayment / CompleteOrderPayment
    │       ├─ Cộng tiền ví (lockForUpdate + DB::transaction)
    │       ├─ Tạo enrollment nếu mua khóa học
    │       ├─ Chia hoa hồng cho Seller
    │       └─ event(new PaymentCompleted(...))
    └──► Pipe 5: UpdatePaymentStatus
```

Mỗi Pipe tuân thủ **Single Responsibility**, có thể thêm/bớt bước dễ dàng (ví dụ: thêm Pipe kiểm tra Fraud Detection).

---

## 7. Chống Race Condition - Pessimistic Locking

Giao dịch tài chính sử dụng **Pessimistic Lock** để chống double-spending:
```php
DB::transaction(function () {
    $wallet = Wallet::where('user_id', $userId)->lockForUpdate()->first();
    // Kiểm tra số dư
    // Trừ tiền
    // Tạo WalletTransaction
});
```
- `lockForUpdate()`: Khóa row trong MySQL → request đồng thời phải chờ.
- Áp dụng cho: Mua khóa học, Rút tiền, Cộng tiền thưởng, Chia hoa hồng.

---

## 8. Các phân hệ nghiệp vụ

### 8.1. Người dùng & Xác thực
- OAuth 2.0 qua Google/Facebook (Laravel Socialite)
- Hệ thống Refresh Token / Access Token thủ công
- Single-Device Enforcement qua Redis middleware
- Theo dõi LoginAttempt (IP, User-Agent, thời gian)

### 8.2. Quản lý Khóa học & Nội dung
- Cấu trúc: Category → Topic → Course → Chapter → Lesson → Video
- Video upload Direct to R2 + Signed URL streaming
- Course thumbnail lưu local storage

### 8.3. Học tập & Tiến độ
- Write-Behind Cache cho video progress (Redis → MySQL delay 30s)
- Anti-Cheat validation (max 25s jump, 70% threshold)
- Quiz system (100% correct to pass)
- Certificate tự động khi course progress = 100%
- Review cho phép khi progress ≥ 80%

### 8.4. E-Commerce & Thanh toán
- Giỏ hàng (Cart + CartItem)
- Coupon system (giới hạn sử dụng, điều kiện áp dụng)
- VNPay integration + Pipeline Pattern IPN processing
- Auto-cancel abandoned payments (scheduled 1 phút)

### 8.5. Tài chính & Ví điện tử
- Wallet nội bộ cho User + Seller + System
- Commission split (Seller % vs Platform %)
- Withdrawal request → Admin duyệt → Giải ngân
- Delayed earnings release (chống refund, scheduled daily)
- Pessimistic Locking cho tất cả giao dịch

### 8.6. VIP Subscription
- Gói VIP theo thời hạn (tháng/năm)
- Xác định Storage Quota cho Seller
- Auto-check expiring subscriptions (scheduled daily)

### 8.7. Social & Communication
- Comment/Review system
- Report system (resolve/dismiss → queued email)
- Contact form
- Database notifications cho Admin (queued)

---
*Tài liệu phân tích kiến trúc kỹ thuật chi tiết cho Đồ án tốt nghiệp.*
