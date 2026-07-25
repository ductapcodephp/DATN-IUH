# Dự án Tốt nghiệp: Hệ thống Nền tảng Học trực tuyến (E-Learning Platform) - EduFlow

## 1. Thông tin tổng quan
- **Tên dự án**: EduFlow - Nền tảng chia sẻ và học tập trực tuyến
- **Mô hình**: Monolithic Application (Monolith hiện đại)
- **Công nghệ cốt lõi**:
  - **Backend**: Laravel 12 (PHP 8.2), MySQL, Redis
  - **Frontend**: ReactJS (kết nối qua InertiaJS), Bootstrap 5, Vanilla CSS
  - **Kiến trúc**: Layered Architecture, Repository Pattern, Event-Driven, Pipeline Pattern, DTO (Data Transfer Object).
- **Vai trò tham gia**: Fullstack Developer / Software Engineer

## 2. Các điểm "Ăn tiền" (Technical Highlights) đưa vào CV
Dự án được xây dựng với tư duy kỹ thuật chuẩn Enterprise, giải quyết các bài toán thực tế của hệ thống lớn:

1. **Kiến trúc Monolith hiện đại với InertiaJS**: 
   - Hợp nhất hoàn hảo sức mạnh Routing, Middleware, Authentication của Laravel với trải nghiệm Single Page Application (SPA) mượt mà của ReactJS mà không cần xây dựng RESTful API công khai, giảm thiểu độ trễ (latency).
2. **Kiến trúc Phân tầng (Layered Architecture) & Repository Pattern**: 
   - Tách biệt rõ ràng 4 tầng: `Presentation (Controller)` -> `Business Logic (Service)` -> `Data Access (Repository)` -> `Database (Eloquent)`. Đảm bảo code lỏng lẻo (loose coupling), dễ dàng bảo trì và mở rộng hoặc thay thế Database Engine mà không ảnh hưởng logic.
3. **Data Transfer Object (DTO) Pattern với PHP 8.2 Readonly Class**: 
   - Xóa bỏ việc truyền Array thô trong hệ thống. Dữ liệu từ Request được đóng gói chặt chẽ qua DTO trước khi đẩy vào Service, đảm bảo Type Safety và tính toàn vẹn dữ liệu.
4. **Chống Race Condition & Xử lý Giao dịch Tài chính An toàn**: 
   - Xây dựng hệ thống Ví điện tử (Wallet) và tính năng Rút tiền (Withdrawal) an toàn tuyệt đối. Áp dụng Pessimistic Locking (`lockForUpdate()`) kết hợp Database Transactions (`DB::transaction`) để giải quyết triệt để lỗi Double-spending khi có nhiều request đồng thời (Concurrency).
5. **Event-Driven Architecture & Queue (Kiến trúc Hướng Sự Kiện)**:
   - Các tác vụ nặng hoặc phụ trợ (Gửi Email thông báo vi phạm, Cộng tiền ví, Ghi Log) được tách hoàn toàn khỏi luồng chính bằng mô hình Observer (Event/Listener). Sử dụng Laravel Queue để xử lý bất đồng bộ, giúp tốc độ phản hồi của API đạt mức mili-giây.
6. **Pipeline Pattern cho Xử lý Thanh toán**:
   - Chia nhỏ quy trình thanh toán (Check số dư -> Trừ tiền -> Tạo đơn -> Lưu lịch sử) thành các bước (Pipes) nối tiếp nhau, dễ dàng thêm/bớt luồng xử lý (ví dụ: áp dụng Coupon) mà vẫn đảm bảo mã nguồn tuân thủ Single Responsibility (SRP).
7. **Bảo mật & Tối ưu hiệu năng (Performance Optimization)**:
   - Áp dụng Soft Delete để bảo toàn dữ liệu lịch sử. Eager Loading (N+1 Query prevention) được áp dụng triệt để. Cấu hình Redis Caching cho các truy vấn nặng tại Trang chủ. 

## 3. Mô tả Nghiệp vụ Hệ thống (Business Logic)
Hệ thống cung cấp một hệ sinh thái học tập hoàn chỉnh với 3 phân hệ người dùng chính: **Admin (Quản trị viên)**, **Seller (Giảng viên)**, và **User (Học viên)**.

### 3.1. Phân hệ Học viên (User)
- **Học tập & Tương tác**: Đăng ký tham gia khóa học miễn phí/trả phí. Theo dõi tiến trình học (Progress), tham gia bài giảng Video, làm bài tập trắc nghiệm. Đánh giá (Review) và Bình luận (Comment) tương tác.
- **Thanh toán & Ví**: Tích hợp Ví cá nhân. Mua khóa học bằng số dư, nhập mã giảm giá (Coupon).
- **Gói VIP (Subscription)**: Mua gói VIP (có thời hạn) để học thả ga các khóa học độc quyền không cần mua lẻ.

### 3.2. Phân hệ Giảng viên (Seller)
- **Quản lý Khóa học**: Dashboard chuyên nghiệp. Tạo mới, thiết kế lộ trình (Chương, Bài học, Video), định giá và phát hành khóa học.
- **Báo cáo Doanh thu & Rút tiền**: Theo dõi tổng doanh thu, số dư thực nhận sau khi chia sẻ hoa hồng (Commission) với nền tảng. Yêu cầu rút tiền về tài khoản ngân hàng.
- **Tương tác**: Phản hồi bình luận học viên, quản lý khuyến mãi (Coupons) cho khóa học của mình.

### 3.3. Phân hệ Quản trị (Admin)
- **Kiểm duyệt & Quản lý**: Kiểm duyệt các khóa học mới trước khi publish. Quản lý toàn bộ danh sách User, Seller. Cài đặt các tham số hệ thống.
- **Hệ thống Gói VIP**: Quản lý, cấu hình giá, thời hạn, đặc quyền của từng Gói VIP.
- **Xử lý Báo cáo Vi phạm (Report System)**: 
  - Cộng đồng có thể báo cáo (Report) khóa học, bình luận, đánh giá vi phạm (Spam, bản quyền).
  - Admin duyệt báo cáo: Chấp nhận (Xóa mềm hoặc xóa cứng đối tượng, đồng thời hệ thống tự động gửi Email cảnh báo cho tác giả) hoặc Từ chối (gửi Email giải thích cho người báo cáo). Toàn bộ xử lý bất đồng bộ qua Queue.
- **Duyệt Rút tiền**: Xét duyệt yêu cầu rút tiền của Seller, đảm bảo đối soát đúng số dư ví trước khi giải ngân.

---
*Bản tóm tắt này đã cô đọng những yếu tố thể hiện bạn là một lập trình viên có tư duy phân tích hệ thống lớn, quan tâm đến kiến trúc phần mềm, bảo mật dữ liệu và hiệu năng.*
