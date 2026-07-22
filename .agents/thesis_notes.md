# GHI CHÚ LUẬN ÁN TỐT NGHIỆP: PHÂN TÍCH KIẾN TRÚC HỆ THỐNG EDUFLOW

Tài liệu này lưu trữ các phân tích, góc nhìn kỹ thuật chuyên sâu và các quyết định kiến trúc (Architecture Decisions) để phục vụ cho việc viết báo cáo Khóa luận/Luận án tốt nghiệp.

---

## 1. Hệ thống EduFlow đang sử dụng kiến trúc gì?

Ban đầu nhìn vào source code, hệ thống có vẻ áp dụng "mỗi thứ một tí" từ nhiều mô hình khác nhau. Tuy nhiên, đây không phải là lỗi thiết kế, mà là một sự kết hợp có chủ đích (**Hybrid Architecture**) - một phương pháp rất phổ biến và chuyên nghiệp trong thực tế.

Cụ thể, EduFlow sử dụng kiến trúc: **Layered Monolith (Monolithic phân tầng) kết hợp với Event-Driven Architecture (Hướng sự kiện)**. 

Hệ thống kết hợp 3 mô hình sau ở 3 cấp độ khác nhau:

### A. Ở tầm vĩ mô (Đóng gói và Triển khai): MÔ HÌNH MONOLITHIC
- **Biểu hiện:** Toàn bộ ứng dụng (Backend Laravel và Frontend ReactJS/Inertia) nằm chung trong một codebase duy nhất, chạy trên cùng một máy chủ.
- **Lý do lựa chọn (Bảo vệ luận án):** Đối với một Startup hoặc dự án mới như EduFlow, việc sử dụng Microservices ngay từ đầu là sự lãng phí (Over-engineering). Kiến trúc Monolithic giúp team phát triển nhanh (Rapid Development), dễ dàng triển khai (Deploy), kiểm thử nguyên khối, và tiết kiệm tối đa chi phí hạ tầng Server cũng như tránh được các điểm nghẽn (bottleneck) về giao tiếp mạng giữa các services.

### B. Ở tầm cấu trúc Source Code: LAYERED ARCHITECTURE (Kiến trúc N-Tier / Phân tầng)
- **Biểu hiện:** Code không bị gom tất cả vào Controller (tránh Anti-pattern "Fat Controller"). Hệ thống chia rạch ròi thành các tầng cô lập:
  - `Presentation Layer (Controller)`: Nhận HTTP Request.
  - `Data Transfer Object (DTO)`: Đóng gói và chuẩn hóa dữ liệu.
  - `Business Logic Layer (Service)`: Xử lý nghiệp vụ lõi, tính toán doanh thu.
  - `Data Access Layer (Repository)`: Trừu tượng hóa câu lệnh truy vấn CSDL.
  - `Database Layer (Model)`.
- **Lý do lựa chọn (Bảo vệ luận án):** Dù là Monolith nhưng bên trong phải có cấu trúc tốt để dễ bảo trì. Việc phân tầng giúp đạt được nguyên lý **Separation of Concerns (SoC)**. Nếu tương lai cần đổi từ MySQL sang MongoDB, hoặc đổi UI từ Web sang Mobile App, ta chỉ cần thay đổi tầng Repository hoặc Presentation mà không phải đập bỏ tầng Service ở giữa.

### C. Ở luồng xử lý (Tối ưu hóa & Chống nghẽn): EVENT-DRIVEN ARCHITECTURE (Hướng sự kiện)
- **Biểu hiện:** Sử dụng hệ thống `Events` và `Listeners` của Laravel.
- **Lý do lựa chọn (Bảo vệ luận án):** Giải quyết bài toán tắc nghẽn (Blocking) của mô hình chạy đồng bộ (Synchronous). Ví dụ, trong luồng "Đăng ký User", thay vì bắt HTTP Request phải chờ tạo Ví (Wallet), tạo session, gửi Email chào mừng... (có thể mất 3-4s), hệ thống chỉ cần lưu User thành công và phát ra sự kiện `UserRegistered`. API lập tức trả về phản hồi cho người dùng (chỉ 0.2s), còn các tác vụ nặng sẽ được các `Listeners` (hoặc Queue) âm thầm xử lý ở background. Tăng cường trải nghiệm người dùng (UX) và khả năng chịu tải của hệ thống.

---

> **Kết luận cho Luận án:** 
> Kiến trúc của EduFlow là một sự lựa chọn thực dụng và linh hoạt. Lấy **Monolith** làm nền tảng để dễ khởi động và tiết kiệm chi phí; lấy **Layered Architecture** làm khung xương để code gọn gàng, dễ mở rộng (Scale); và lấy **Event-Driven** làm cơ chế giao tiếp ngầm để tối ưu hiệu suất. Đây là minh chứng cho việc thiết kế kiến trúc phần mềm không phải là chạy theo trend (như Microservices) mà là chọn công cụ phù hợp nhất cho bài toán và nguồn lực hiện tại.

---

## 2. BÀI TOÁN TÍCH HỢP THANH TOÁN (VNPAY) VÀ KIẾN TRÚC XỬ LÝ GIAO DỊCH AN TOÀN

### 2.1. Lỗ hổng bảo mật & Rủi ro thất thoát dữ liệu (Data Loss Vulnerability)
Trong các hệ thống thương mại điện tử sơ khai, lập trình viên thường đặt logic xử lý đơn hàng (mở khóa học, trừ kho, cộng tiền) tại **Return URL** (đường dẫn chuyển hướng người dùng sau khi thanh toán).
- **Rủi ro:** Khi người dùng thực hiện thanh toán thành công trên ứng dụng ngân hàng hoặc cổng VNPAY nhưng **tắt trình duyệt** hoặc **rớt mạng** trước khi bị chuyển hướng (redirect) về lại hệ thống EduFlow.
- **Hậu quả:** Hàm xử lý tại Return URL không bao giờ được kích hoạt. Tiền của khách hàng đã bị trừ, nhưng hệ thống EduFlow vẫn ghi nhận đơn hàng ở trạng thái `pending` (chờ thanh toán). Dẫn đến tranh chấp, khiếu nại và trải nghiệm người dùng rất tệ.

### 2.2. Giải pháp Kiến trúc: IPN Webhook (Internet Payment Notification)
Để khắc phục rủi ro trên, hệ thống EduFlow được thiết kế tách biệt luồng thanh toán thành 2 kênh độc lập:
1. **Return URL (Client-Side Redirect):** Chỉ đóng vai trò điều hướng giao diện người dùng (Hiển thị trang "Thanh toán thành công" hoặc "Thất bại").
2. **IPN Webhook (Server-to-Server):** Là kênh liên lạc ngầm giữa máy chủ VNPAY và máy chủ EduFlow. Bất chấp trạng thái trình duyệt của người dùng, ngay khi thanh toán hoàn tất, máy chủ VNPAY sẽ gọi API đến IPN Webhook của EduFlow. Đây là **nguồn chân lý duy nhất (Single Source of Truth)** để cập nhật cơ sở dữ liệu.

### 2.3. Cơ chế Dự phòng & Chống Race Condition (Fallback Mechanism)
Vì IPN và Return URL hoạt động bất đồng bộ, có thể xảy ra trường hợp trình duyệt của người dùng chuyển hướng về EduFlow *nhanh hơn* cả thời gian VNPAY gọi IPN.
- **Giải pháp xử lý:** Áp dụng cơ chế **Fallback**. Khi người dùng truy cập Return URL, hệ thống sẽ kiểm tra trạng thái đơn hàng. Nếu đơn hàng vẫn ở trạng thái `pending`, hệ thống chủ động gọi logic của IPN để xử lý ngay lập tức. Sau đó mới dọn dẹp Giỏ hàng (Cart). Điều này đảm bảo tính thời gian thực (Real-time) cho trải nghiệm người dùng.

### 2.4. Tối ưu hóa hiệu năng với Message Queue (Hàng đợi)
Quá trình xử lý sau thanh toán (Post-payment Processing) bao gồm nhiều tác vụ nặng:
- Mở khóa học (Nhanh).
- Gửi Email hóa đơn, Email cảm ơn (Chậm).
- Tính toán chia sẻ doanh thu (Revenue Sharing) cho Giảng viên (Phức tạp).
- Thông báo thời gian thực (Realtime Notifications).

Theo chuẩn giao tiếp của VNPAY, Server phải phản hồi IPN trong thời gian cực ngắn. Nếu đặt toàn bộ các tác vụ trên chạy đồng bộ (Synchronous), IPN sẽ bị Timeout (Hết thời gian chờ).
- **Thiết kế hệ thống áp dụng (Event-Driven Architecture):** Tại IPN, hệ thống chỉ cập nhật thay đổi trạng thái trong CSDL (Database) thành `completed` và phản hồi mã `00` ngay cho VNPAY. Toàn bộ các tác vụ còn lại được đóng gói thành các `Events` và đẩy vào **Background Queue** (Hàng đợi nền) để xử lý bất đồng bộ (Asynchronous), đảm bảo độ trễ thấp nhất cho luồng giao dịch.

---

## 3. PHÂN TÍCH CHIẾN LƯỢC SỬ DỤNG QUEUE TRONG HỆ THỐNG

Trong hệ thống EduFlow, Queue (Hàng đợi) được áp dụng cho nhiều bài toán khác nhau. Điển hình nhất là bài toán **Lưu tiến độ video** và **Gửi Email**. Mặc dù cả hai đều đẩy dữ liệu vào Queue, nhưng mục đích thiết kế và bản chất xử lý lại hoàn toàn khác biệt. Đây là một điểm nhấn quan trọng để phân tích trong luận án.

### 3.1. Bài toán 1: Lưu tiến độ video liên tục (Video Progress Tracking)
- **Bối cảnh:** Khi học viên xem video, frontend (player) sẽ liên tục gọi API lên server (ví dụ mỗi 10 giây) để cập nhật xem học viên đã xem đến giây thứ bao nhiêu.
- **Vấn đề rủi ro (Write-Heavy Bottleneck):** Nếu mỗi request này đều thực hiện lệnh `UPDATE` trực tiếp vào Database, Database sẽ bị quá tải (I/O Bottleneck) bởi hàng ngàn câu lệnh ghi liên tục từ nhiều học viên cùng lúc.
- **Giải pháp Kiến trúc (Cache + Queue Batching):**
  - Khi request tiến độ gửi lên, hệ thống không ghi vào DB ngay, mà ghi đè vào **Redis Cache** (tốc độ cực nhanh, lưu trữ in-memory).
  - Đồng thời, một Job (tiến trình) được đẩy vào **Queue** để xử lý ngầm (hoặc dùng cơ chế Cron/Batching). Worker chạy dưới nền sẽ định kỳ lấy dữ liệu mới nhất từ Cache và thực hiện một lệnh ghi duy nhất (Bulk Update) xuống Database.

### 3.2. Bài toán 2: Gửi Email (Xác nhận, Hóa đơn)
- **Bối cảnh:** Khi học viên đăng ký hoặc mua khóa học thành công, hệ thống cần gửi email thông báo.
- **Vấn đề rủi ro (Latency / Blocking):** Gửi email yêu cầu Server gọi kết nối ra bên ngoài (SMTP Server như Gmail, SendGrid). Quá trình này tốn nhiều thời gian (từ 2-5 giây). Nếu để luồng chính chờ gửi xong email mới trả kết quả, giao diện của người dùng sẽ bị treo cứng (Lag).
- **Giải pháp Kiến trúc (Asynchronous Task):**
  - Hệ thống đóng gói thông tin cần gửi vào một Job và ném vào **Email Queue**. API lập tức trả về phản hồi "Thành công" cho người dùng. Worker sẽ âm thầm gửi email ở dưới nền mà không bắt người dùng phải chờ đợi.

### 3.3. Sự khác biệt cốt lõi giữa 2 chiến lược đẩy Queue (Điểm ăn điểm cho Luận án)

| Tiêu chí | Tiến độ Video (Video Progress Queue) | Gửi Email (Email Queue) |
| :--- | :--- | :--- |
| **Mục tiêu Kiến trúc** | **Write-Behind / Write Buffer:** Giảm tải I/O (chống sập) cho Database. | **Asynchronous Processing:** Giảm độ trễ (Latency) cho API, tách tác vụ I/O ngoại vi. |
| **Bản chất dữ liệu** | **Có thể Ghi đè (Mergeable/Overwritable):** Hệ thống chỉ quan tâm giá trị giây *cuối cùng*. Hàng chục request của 1 user có thể gộp lại thành 1 lệnh update DB duy nhất. | **Độc lập (Discrete/Non-mergeable):** Mỗi email là một thực thể riêng biệt. Không thể gộp email đăng ký và email hóa đơn làm một. |
| **Tần suất & Ưu tiên** | Tần suất cực cao (High Throughput), độ ưu tiên ghi DB thấp (Low Priority). | Tần suất thấp hơn, độ ưu tiên cực cao (High Priority). |
| **Xử lý lỗi (Retry)** | Nếu rớt vài giây vào DB không quá nghiêm trọng. Thường bỏ qua hoặc xử lý nhẹ để tiết kiệm tài nguyên hệ thống. | **Bắt buộc (Guaranteed Delivery):** Lỗi mạng kết nối SMTP phải tự động Retry (3-5 lần). Nếu thất bại hẳn phải đưa vào Dead Letter Queue (DLQ) để điều tra. |

> **Kết luận cho Luận án:** Việc dùng Queue không chỉ đơn giản là "ném tác vụ chạy ngầm cho nhanh". Hiểu rõ bản chất luồng dữ liệu để cấu hình Queue phù hợp (cái nào cần Batching, cái nào cần Fire-and-Forget, cái nào cần Retry) mới thể hiện tư duy thiết kế hệ thống chuyên sâu của một Kỹ sư phần mềm.

---

## 4. Xử lý "Đơn hàng bị bỏ hoang" (Abandoned Cart) & Hoàn trả tài nguyên

### 4.1. Bài toán: Khách hàng "Tạo đơn - Nhập mã giảm giá" nhưng không thanh toán
Trong các hệ thống E-commerce (ví dụ: mua khóa học), khi user click "Thanh toán", hệ thống sẽ tạo một đơn hàng (trạng thái `pending`) và **tạm trừ (giam) số lượng mã giảm giá**.
**Vấn đề phát sinh:**
- Nếu user tắt trình duyệt (abandoned cart) hoặc hủy giao dịch trên cổng thanh toán (VNPAY/Stripe), đơn hàng sẽ bị kẹt mãi ở trạng thái `pending`.
- Mã giảm giá bị "giam" vĩnh viễn, người dùng khác không thể áp mã dù mã chưa thực sự được dùng.
- Khóa Unique Key trên database (ví dụ: một User chỉ được có 1 đơn hàng cho 1 Khóa học) khiến khách hàng không thể tạo lại đơn thanh toán cho chính khóa học đó.

### 4.2. Giải pháp Kiến trúc (Background Cronjob & Auto-Reclaim)
Để giải quyết, hệ thống cần một **Background Worker (Cronjob)** chạy định kỳ (vd: mỗi 1 phút) để rà quét và dọn dẹp các đơn rác.
**Workflow dọn dẹp:**
1. Quét tìm toàn bộ các giao dịch (`online_payments`) có trạng thái `pending` và vượt quá ngưỡng timeout (ví dụ: quá 1 phút/15 phút).
2. Duyệt qua các `orders` thuộc giao dịch đó. Nếu order có chứa `coupon_id`, tiến hành **hoàn trả (decrement `used_count`)** vào bảng `coupons`.
3. Xóa sổ vĩnh viễn (Hard Delete) hoặc cập nhật (Soft Delete/Refunded) các đơn `orders` này để **giải phóng Unique Key**, cho phép user mua lại.
4. Đánh dấu `online_payments` thành `failed`.

### 4.3. Kinh nghiệm sâu sắc về Laravel Task Scheduling (Điểm cộng cho Luận án)
Khi triển khai Cronjob dọn dẹp, việc lựa chọn kiến trúc chạy lệnh ngầm (Schedule) cực kỳ quan trọng. Laravel cung cấp 2 phương pháp phổ biến nhưng có cơ chế hoạt động hoàn toàn khác nhau:

| Tiêu chí | `Schedule::call(function() { ... })` (Closure) | `Schedule::command('tên-command')` (Artisan Command) |
| :--- | :--- | :--- |
| **Vị trí viết code** | Trực tiếp trong file `routes/console.php` hoặc `Kernel.php` | Tách riêng thành một class độc lập (vd: `CancelAbandonedPayments.php`) |
| **Cơ chế nạp vào RAM (Lifecycle)** | Load **1 lần duy nhất** khi khởi chạy worker (`schedule:work`). Đoạn code bị đóng băng (cached) trong RAM của tiến trình worker đó suốt vòng đời. | Tạo ra một **tiến trình PHP mới hoàn toàn (New Process)** mỗi lần được kích hoạt. Đọc lại file từ ổ cứng tại thời điểm chạy. |
| **Bảo trì & Hot-Reload** | **Lỗi Chí mạng:** Nếu sửa code, thay đổi sẽ KHÔNG có hiệu lực trừ khi tắt nóng (kill process) và khởi động lại worker. Rất dễ sinh lỗi âm thầm do chạy code cũ. | **An Toàn:** Sửa code là có tác dụng ở lần chạy tiếp theo của phút tới mà không cần can thiệp hệ thống. |
| **Tính đóng gói (Clean Code)** | Gây "phình to" file config, trộn lẫn cấu hình và business logic. Khó test độc lập. | Chuẩn OOP, logic được đóng gói độc lập. Có thể gọi test thủ công trên terminal dễ dàng. |

**👉 Nhận định kiến trúc:** Việc sử dụng `Schedule::command()` không chỉ là vấn đề cú pháp mà là tư duy **tách biệt tiến trình (Process Isolation)** và **dễ dàng bảo trì (Maintainability)**. Dù tốn thêm chi phí siêu nhỏ khởi tạo tiến trình hệ điều hành, nhưng đảm bảo tính đúng đắn và an toàn cho dữ liệu (đặc biệt là tiền bạc, mã giảm giá) trong môi trường production.

---

## 5. PHÂN TÍCH 6 CẤP ĐỘ THIẾT KẾ PHẦN MỀM CỦA EDUFLOW

Hệ thống EduFlow được đánh giá qua 6 cấp độ thiết kế phần mềm, xếp theo thứ tự từ **vi mô (code-level)** đến **vĩ mô (system-level)**:

```
1. Programming Paradigm (Mô hình lập trình)
│
├── OOP ⭐⭐⭐⭐⭐
│   ├── Class
│   ├── Object
│   ├── Interface
│   ├── Abstract Class
│   ├── Trait
│   ├── Namespace
│   ├── Encapsulation
│   ├── Inheritance
│   ├── Polymorphism
│   └── Abstraction
│
└── (Functional, Procedural...)
        │
        ▼
2. Design Principles (Nguyên tắc thiết kế)
│
├── SOLID ⭐⭐⭐⭐⭐
├── DRY
├── KISS
├── YAGNI
└── Dependency Injection (DI)
        │
        ▼
3. Design Patterns (Mẫu thiết kế)
│
├── Repository
├── Factory
├── Strategy
├── Observer
├── Singleton
├── Builder
├── Adapter
├── Facade
└── Command
        │
        ▼
4. Application Architecture (Kiến trúc ứng dụng)
│
├── MVC
├── Layered Architecture
├── Clean Architecture
├── Hexagonal
└── Onion
        │
        ▼
5. System Architecture (Kiến trúc hệ thống)
│
├── Monolithic
├── Microservices
├── SOA
├── Event-Driven
└── Serverless
        │
        ▼
6. Coding Standards (Chuẩn code)
│
├── PSR-12
├── PHPDoc
├── Naming Convention
└── Git Convention
```

### 5.1. Tầng 1 – Programming Paradigm: OOP (⭐⭐⭐⭐⭐ – 5/5)

EduFlow sử dụng mô hình lập trình hướng đối tượng (OOP) xuyên suốt toàn bộ hệ thống.

| Khái niệm OOP | Mức độ áp dụng | Ví dụ cụ thể trong EduFlow |
| :--- | :--- | :--- |
| **Class / Object** | ✅ Rất nhiều | Service, Repository, DTO, Model, Controller – mỗi thành phần là 1 class độc lập |
| **Interface** | ✅ | `CourseRepositoryInterface`, `PayableContract` – định nghĩa hợp đồng giữa các tầng |
| **Abstract Class** | ✅ (Ngầm) | Laravel base classes: `Illuminate\Database\Eloquent\Model`, `Controller` |
| **Trait** | ✅ | `HasFactory`, `SoftDeletes`, `Notifiable` – tái sử dụng hành vi xuyên class |
| **Namespace** | ✅ | `App\Services\Payment\PaymentService`, `App\DTO\Seller\Course\CourseData` – phân vùng code rõ ràng |
| **Encapsulation** | ✅ | `readonly class` DTO (PHP 8.2+) – dữ liệu chỉ gán 1 lần, không thể sửa từ bên ngoài |
| **Inheritance** | ✅ | Model extends `Eloquent\Model`, Controller extends `BaseController` |
| **Polymorphism** | ✅ | `payable_type/payable_id` (Polymorphic Relations), `PayableContract::fulfill()` – 1 hàm, nhiều hành vi |
| **Abstraction** | ✅ | Repository Interface ẩn toàn bộ chi tiết Eloquent/Query Builder khỏi tầng Service |

> **Nhận xét:** OOP được áp dụng rất bài bản. Đặc biệt, việc sử dụng Polymorphism trong module thanh toán (cho phép 1 luồng VNPAY xử lý đa dạng loại giao dịch: Mua khóa học, Mua gói Seller, Nạp ví...) là điểm sáng thể hiện tư duy OOP chuyên sâu.

### 5.2. Tầng 2 – Design Principles (⭐⭐⭐⭐ – 4/5)

Hệ thống tuân thủ các nguyên tắc thiết kế phần mềm cốt lõi, đặc biệt là bộ nguyên tắc SOLID:

| Nguyên tắc | Mức độ | Minh chứng trong EduFlow |
| :--- | :--- | :--- |
| **S – Single Responsibility** | ✅ | Controller chỉ điều phối (nhận Request, gọi Service, trả Response). Service chỉ xử lý logic nghiệp vụ. Repository chỉ truy vấn CSDL. Mỗi class đúng 1 trách nhiệm duy nhất. |
| **O – Open/Closed** | ✅ | `PayableContract` interface cho phép mở rộng thêm loại thanh toán mới (Livestream, Ebook...) mà không cần sửa code luồng VNPAY/Stripe hiện tại. |
| **L – Liskov Substitution** | ✅ | Có thể hoán đổi `CourseRepository` thành `CachedCourseRepository` qua Interface mà Service không cần biết sự thay đổi. |
| **I – Interface Segregation** | ✅ | Interface được tách riêng theo domain (`CourseRepositoryInterface`, `PaymentRepositoryInterface`...), không ép 1 class phải implement các method không liên quan. |
| **D – Dependency Inversion** | ✅ | Service không phụ thuộc vào class cụ thể mà phụ thuộc vào Interface. Mọi binding được khai báo trong `AppServiceProvider`. |
| **DRY (Don't Repeat Yourself)** | ✅ | Components Frontend dùng chung (`Buttons`, `Modals`, `Cards`), Layouts tái sử dụng (`FrontendLayout`, `SellerLayout`). |
| **KISS (Keep It Simple)** | ⚠️ | Một số luồng phức tạp (Payment + IPN + Fallback) là do bản chất bài toán tài chính đòi hỏi, không phải over-engineer. |
| **YAGNI (You Aren't Gonna Need It)** | ✅ | Chọn Monolith thay vì Microservices = đúng tinh thần "không làm cái chưa cần". |
| **Dependency Injection (DI)** | ✅ | Constructor Injection xuyên suốt: Controller inject Service, Service inject Repository Interface. |

> **Nhận xét:** SOLID được áp dụng tốt ở cả 5 nguyên tắc. Điểm trừ nhẹ là chưa có bộ Unit Test đầy đủ để chứng minh lợi ích thực tế của DI/Interface Segregation trong môi trường kiểm thử.

### 5.3. Tầng 3 – Design Patterns (⭐⭐⭐⭐⭐ – 5/5 – Điểm mạnh nhất)

EduFlow áp dụng **8 Design Patterns** thực tế trong source code:

| Pattern | Vị trí áp dụng | Mục đích giải quyết |
| :--- | :--- | :--- |
| **Repository Pattern** | `app/Repositories/` – Interface + Concrete class | Trừu tượng hóa truy vấn DB, tách biệt tầng Data Access khỏi Business Logic. |
| **Static Factory Method** | `DTO::fromRequest()` trong các lớp DTO | Chuẩn hóa quy trình khởi tạo DTO từ HTTP Request, thay vì gọi constructor trực tiếp. |
| **Model Factory** | `database/factories/` | Sinh dữ liệu mẫu (mock data) phục vụ Seeding và Testing. |
| **Strategy Pattern** | `VnpayGateway`, `StripeGateway` | Đa cổng thanh toán hoán đổi được. Core System không cần biết đang dùng cổng nào. |
| **Observer / Event-Driven** | `app/Events/` + `app/Listeners/` | Tách tác vụ phụ trợ (gửi mail, tạo ví, tính doanh thu) khỏi luồng chính. |
| **Facade Pattern** | `Route::`, `Event::`, `Storage::`, `Inertia::` | Cung cấp interface tĩnh đơn giản che giấu hệ thống phức tạp bên dưới Service Container. |
| **Active Record** | `app/Models/` (Eloquent ORM) | Mỗi Model tương ứng trực tiếp với 1 bảng DB, chứa cả dữ liệu và phương thức truy vấn. |
| **DTO Pattern** | `app/DTO/` – `readonly class` PHP 8.2+ | Đóng gói dữ liệu đầu vào với kiểu dữ liệu tường minh (Strongly Typed), loại bỏ mảng thô. |

> **Nhận xét:** 8 patterns được áp dụng thực tế (không phải lý thuyết suông) trong 1 dự án tốt nghiệp là rất ấn tượng. Đặc biệt, sự kết hợp giữa **Strategy Pattern** (đa cổng thanh toán) và **Observer Pattern** (Event-Driven xử lý hậu thanh toán) cho thấy khả năng lựa chọn pattern phù hợp với từng bài toán cụ thể.

### 5.4. Tầng 4 – Application Architecture (⭐⭐⭐⭐ – 4/5)

| Kiến trúc | Mức độ áp dụng | Ghi chú |
| :--- | :--- | :--- |
| **MVC** | ✅ (Nền tảng) | Laravel bản chất là framework MVC. EduFlow kế thừa cấu trúc này. |
| **Layered Architecture** | ✅✅ (Chính) | Mở rộng MVC thành 4 tầng rõ ràng: `Presentation (Controller)` → `DTO` → `Business Logic (Service)` → `Data Access (Repository)` → `Database (Model)`. |
| Clean Architecture | ⚠️ Một phần | Có tách tầng và dependency inversion, nhưng chưa đến mức Domain Layer thuần túy (Entities/Use Cases). |
| Hexagonal / Onion | ❌ | Không áp dụng – và cũng không cần thiết cho scope dự án Startup/DATN. |

> **Nhận xét:** Layered Architecture (Kiến trúc phân tầng) là lựa chọn rất phù hợp. Nó đủ mạnh để đảm bảo Separation of Concerns mà không quá phức tạp như Clean Architecture hay Hexagonal. Đây là mức kiến trúc ứng dụng tối ưu cho quy mô DATN.

### 5.5. Tầng 5 – System Architecture (⭐⭐⭐⭐ – 4/5)

| Kiến trúc | Mức độ áp dụng | Ghi chú |
| :--- | :--- | :--- |
| **Monolithic** | ✅ (Chính) | 1 codebase duy nhất: Laravel 12 (BE) + ReactJS/Inertia (FE), deploy trên cùng 1 server. |
| **Event-Driven** | ✅ (Bổ trợ) | Events/Listeners + Redis Queue xử lý bất đồng bộ các tác vụ nặng. |
| Microservices | ❌ | Không áp dụng – đúng quyết định tránh over-engineering cho giai đoạn Startup. |
| SOA | ❌ | Không áp dụng. |
| **Serverless** | ⚠️ (Một phần) | Kiến trúc Direct Upload lên Cloudflare R2 (Client upload trực tiếp, Server chỉ cấp Presigned URL) mang hơi hướng tư duy Serverless – offload xử lý nặng sang hạ tầng Cloud. |

> **Nhận xét:** Mô hình Hybrid **"Monolith + Event-Driven"** là sự kết hợp thực dụng. Monolith giữ cho hệ thống đơn giản, tiết kiệm chi phí. Event-Driven bổ sung khả năng xử lý bất đồng bộ và chống nghẽn. Kiến trúc Direct Upload R2 thể hiện thêm tư duy Serverless trong việc tối ưu băng thông server.

### 5.6. Tầng 6 – Coding Standards (⭐⭐⭐ – 3/5 – Tầng cần cải thiện)

| Chuẩn | Mức độ | Ghi chú |
| :--- | :--- | :--- |
| **PSR-12** | ⚠️ (Tự động) | Tuân thủ nhờ Laravel framework, nhưng chưa cấu hình công cụ kiểm tra tự động như PHP CS Fixer hoặc Laravel Pint. |
| **PHPDoc** | ⚠️ (Không đồng đều) | Một số Service/Repository có docblock, một số chưa có. Chưa đạt mức coverage đồng đều. |
| **Naming Convention** | ✅ | Đặt tên file, class, method theo chuẩn Laravel (PascalCase cho class, camelCase cho method, snake_case cho DB columns). |
| **Git Convention** | ⚠️ | Có quy tắc không tự ý commit/push, nhưng chưa áp dụng quy ước commit message chuẩn (Conventional Commits: `feat:`, `fix:`, `refactor:`...). |

> **Nhận xét:** Đây là tầng yếu nhất trong 6 tầng. Tuy nhiên, Coding Standards mang tính chất **cross-cutting concern** – nó không phải kỹ năng thiết kế cao siêu mà là quy tắc vệ sinh code cần duy trì xuyên suốt. Việc bổ sung PHPDoc đồng đều và Git Conventional Commits sẽ nâng cao tính chuyên nghiệp cho dự án.

### 5.7. Bảng Tổng hợp Đánh giá 6 Cấp Độ

| Cấp Độ | Tên | Đánh giá | Nhận xét ngắn |
| :--- | :--- | :--- | :--- |
| 1 | Programming Paradigm (OOP) | ⭐⭐⭐⭐⭐ | Rất vững, Polymorphism trong thanh toán là điểm sáng |
| 2 | Design Principles (SOLID) | ⭐⭐⭐⭐ | Áp dụng tốt cả 5 nguyên tắc, thiếu Unit Test chứng minh |
| 3 | Design Patterns | ⭐⭐⭐⭐⭐ | **Điểm mạnh nhất** – 8 patterns thực tế |
| 4 | Application Architecture | ⭐⭐⭐⭐ | Layered Architecture chuẩn, phù hợp scope DATN |
| 5 | System Architecture | ⭐⭐⭐⭐ | Hybrid Monolith + Event-Driven, thực dụng |
| 6 | Coding Standards | ⭐⭐⭐ | Tầng cần cải thiện nhất (PHPDoc, Git Convention) |

> **Kết luận cho Luận án:**
> Hệ thống EduFlow thể hiện năng lực thiết kế phần mềm toàn diện qua 6 cấp độ, từ nền tảng lập trình hướng đối tượng (OOP) đến kiến trúc hệ thống (System Architecture). Điểm mạnh nổi bật là khả năng lựa chọn và áp dụng **8 Design Patterns** phù hợp với từng bài toán thực tế, kết hợp kiến trúc **Hybrid Monolith + Event-Driven** đảm bảo tính thực dụng cho giai đoạn Startup. Đây là minh chứng cho tư duy thiết kế phần mềm không chạy theo xu hướng mà tập trung vào việc chọn công cụ phù hợp nhất cho bài toán và nguồn lực hiện có.

---

## 6. KIẾN TRÚC PIPELINE TRONG BÀI TOÁN THANH TOÁN (PIPELINE PATTERN)

Trong hệ thống EduFlow, quy trình thanh toán (Checkout) và xử lý callback (IPN) chứa rất nhiều nghiệp vụ phức tạp phải thực hiện đồng thời trong một Database Transaction (Validate giỏ hàng, Kiểm tra khóa học đã sở hữu, Áp dụng mã giảm giá, Tính tổng tiền, Tạo đơn hàng, Tính hoa hồng...).

- **Vấn đề ban đầu (God Method / Anti-pattern):** Việc nhồi nhét tất cả logic này vào một phương thức `processCheckout()` duy nhất dẫn đến việc class bị phình to (hơn 150 dòng code), vi phạm nguyên tắc Single Responsibility (SRP), cực kỳ khó đọc, khó bảo trì và không thể Unit Test từng phần.
- **Giải pháp Kiến trúc (Pipeline Pattern):** Áp dụng mẫu thiết kế Pipeline (được hỗ trợ sẵn bởi `Illuminate\Pipeline\Pipeline` của Laravel).
  - Biến toàn bộ dữ liệu đầu vào thành một DTO (ví dụ `CheckoutData`).
  - Tách mỗi bước xử lý nghiệp vụ thành một class độc lập (Pipe) với duy nhất một phương thức `handle()`. Ví dụ: `ValidateCart`, `ApplyCoupons`, `CalculateTotal`, `CreateOrders`.
  - Kết nối chúng lại thành một luồng (pipeline) liền mạch.

**Lợi ích đem lại (Bảo vệ luận án):**
1. **Tuân thủ tuyệt đối SRP (Single Responsibility Principle):** Mỗi Pipe chỉ làm đúng 1 việc. Class `PaymentService` giờ đây cực kỳ gọn nhẹ (chỉ khoảng 20 dòng orchestration), chỉ làm nhiệm vụ điều phối luồng chảy dữ liệu.
2. **Khả năng mở rộng (Extensibility - OCP):** Dễ dàng thêm, bớt hoặc thay đổi thứ tự các bước xử lý chỉ bằng cách thêm/xóa tên class trong mảng `through([])` mà không lo chạm hỏng các logic đang chạy ổn định.
3. **Đảm bảo tính vẹn toàn dữ liệu (Data Integrity):** Toàn bộ pipeline vẫn chạy trong cùng một vòng đời DB Transaction. Nếu bất kỳ Pipe nào throw Exception, toàn bộ quá trình sẽ được Rollback.
4. **Tăng cường khả năng kiểm thử (Testability):** Có thể viết Unit Test cho từng Pipe độc lập với mock data (DTO) riêng rẽ, thay vì phải setup môi trường khổng lồ để test toàn bộ God Method.

---

## 7. KIẾN TRÚC BẢO VỆ DOANH THU & CHÍNH SÁCH HOÀN TIỀN (REFUND POLICY) AN TOÀN

### 7.1. Bài toán rủi ro kinh doanh (Business Risk) trong giáo dục trực tuyến
Với đặc thù sản phẩm số (digital product) như khóa học video trực tuyến, một số nền tảng cho phép học viên hoàn tiền vô điều kiện trong vòng N ngày. Tuy nhiên, điều này sinh ra một rủi ro lạm dụng rất lớn: Học viên có thể mua khóa học, sử dụng phần mềm quay màn hình (screen record) hoặc cày cuốc liên tục ngày đêm để tải toàn bộ kiến thức, sau đó yêu cầu hoàn tiền.
Nếu hệ thống tự động hoàn tiền mà không có cơ chế kiểm soát, Giảng viên (Seller) sẽ bị thiệt hại trắng trợn chất xám và nền tảng (Platform) cũng thất thoát doanh thu.

### 7.2. Giải pháp Kiến trúc Logic Hoàn Tiền (Refund Anti-Abuse System)
Để giải quyết bài toán trên, EduFlow áp dụng một thiết kế rào cản nhiều lớp (Multi-layer Defense) tại file `RefundService.php`:

1. **Rào cản Thời gian (Time Barrier):**
   - Rút ngắn chu kỳ chờ giải phóng doanh thu cho Giảng viên (từ 7 ngày xuống còn 3 ngày qua `ReleaseSellerEarnings`). Hệ thống quy định học viên chỉ được phép yêu cầu hoàn tiền trong đúng 3 ngày (72 giờ) sau khi thanh toán.

2. **Rào cản Khối lượng tiêu thụ (Consumption Barrier - Best Practice):**
   - Thay vì cấp quyền hoàn tiền mù quáng, hệ thống sẽ thực hiện đối chiếu chéo (Cross-reference) với hệ thống **Video Progress Tracking** (bảng `course_progress`).
   - Tổng thời gian học viên đã xem (`watched_seconds`) được đem chia cho tổng thời lượng toàn bộ khóa học (`total_duration_seconds`).
   - Nếu tiến độ học > **15%**, yêu cầu hoàn tiền sẽ bị từ chối tự động bằng logic cứng (Hard Block). Đảm bảo sự công bằng tuyệt đối cho Giảng viên.

3. **Rào cản Hành vi Lạm dụng (Behavioral Barrier):**
   - Giới hạn số lần Refund của một tài khoản: Tối đa 3 lần / 1 tháng. Nếu một user liên tục hoàn tiền, hệ thống sẽ từ chối và hiển thị cảnh báo cấm tài khoản vĩnh viễn (Permanent Ban Warning).

4. **Rào cản Kỹ thuật (Technical Barrier) - Hoàn tiền vào Ví nội bộ (Wallet-based Refund):**
   - Thay vì gọi API của Cổng thanh toán (VNPAY/Stripe) để hoàn tiền thẳng về thẻ/ngân hàng của người dùng (rất phức tạp, tốn phí giao dịch và mất từ 3-14 ngày làm việc), hệ thống được thiết kế để hoàn tiền ngay lập tức vào **Ví nội bộ (EduFlow Wallet)**.
   - **Lợi ích kép:**
     - **Về kỹ thuật:** Giao dịch hoàn tiền trở thành một Database Transaction nội bộ siêu nhanh (giảm độ trễ), không lệ thuộc vào độ ổn định của API bên thứ ba.
     - **Về kinh doanh:** Giữ dòng tiền ở lại hệ thống (Retention). Học viên có xu hướng dùng số dư trong Ví để mua một khóa học khác thay vì làm lệnh Rút tiền về Ngân hàng, giúp tối ưu hóa doanh thu cho Platform.

**👉 Kết luận cho Luận án:**
Việc xử lý hoàn tiền không chỉ là một nghiệp vụ `CRUD` đơn thuần (đổi trạng thái `order` thành `refunded`), mà nó phản ánh **Business Logic** và **Domain Knowledge** sâu sắc của đội ngũ thiết kế. Sự kết hợp giữa giới hạn thời gian, đối soát tiến độ (`course_progress`), giới hạn tần suất hành vi, và kiến trúc **Ví nội bộ (Wallet)** đã tạo ra một hệ thống phòng thủ tự động toàn diện, chống thất thoát doanh thu và tối ưu hóa chi phí vận hành trong môi trường kinh doanh E-learning đầy tính rủi ro.
  