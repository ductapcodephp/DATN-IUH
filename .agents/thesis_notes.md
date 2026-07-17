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
