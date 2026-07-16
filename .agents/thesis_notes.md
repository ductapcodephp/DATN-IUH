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
