# Tài liệu Workflow Hệ Thống (DATN Backend API)

Dựa trên cấu trúc routing của dự án (Laravel Backend), hệ thống được chia thành 2 luồng thao tác chính (workflow) dành cho **User (Khách hàng/Học viên)** và **Seller (Giảng viên/Người bán khóa học)**.

---

## 1. Workflow của User (Học viên / Khách hàng)

### A. Khám phá và Tìm kiếm
- **Khách vãng lai (Guest):** Truy cập trang chủ, xem danh sách khóa học, chi tiết khóa học, danh sách giảng viên, blog, FAQs, thông tin liên hệ.
- **Đăng ký / Đăng nhập:** Tạo tài khoản mới hoặc đăng nhập vào hệ thống.

### B. Mua sắm và Giao dịch
- **Giỏ hàng (Cart):** Thêm khóa học vào giỏ, xóa khỏi giỏ, áp dụng mã giảm giá (Coupon).
- **Yêu thích (Wishlist):** Lưu các khóa học quan tâm để xem lại sau.
- **Thanh toán (Checkout & Payment):** 
  - Đăng ký nhận khóa học miễn phí (Enroll Free).
  - Thanh toán qua cổng thanh toán (tích hợp VNPAY).
  - Nạp tiền vào ví điện tử cá nhân (Wallet Deposit).

### C. Quá trình Học tập (Learning)
- **Vào học:** Truy cập nội dung khóa học đã mua.
- **Tiến độ:** Cập nhật tiến độ xem video bài học.
- **Kiểm tra:** Làm và nộp bài tập trắc nghiệm (Quiz).
- **Tương tác:** Bình luận (Comment) trong từng bài học, hỏi đáp.
- **Đánh giá (Review):** Để lại đánh giá, nhận xét (Rate & Review) cho khóa học, có thể chỉnh sửa hoặc xóa đánh giá.

### D. Quản lý Tài khoản (User Dashboard - `my-account`)
- Xem tổng quan (Overview), danh sách khóa học của tôi (My Courses), Chứng chỉ (Certificates).
- Xem lịch sử đơn hàng (Orders).
- Quản lý hồ sơ cá nhân, đổi mật khẩu.
- **Tài chính:** Quản lý ví (Wallet), thiết lập tài khoản ngân hàng (thêm, sửa, xóa, đặt mặc định), thực hiện rút tiền (nếu có số dư).
- Nhận và đánh dấu thông báo đã đọc.

---

## 2. Workflow của Seller (Giảng viên / Người bán)

### A. Quản lý Khóa học (Course Management)
- **Tạo & Cập nhật Khóa học:** Khởi tạo thông tin chung của khóa học.
- **Quản lý Giáo trình (Curriculum):**
  - **Chương (Chapters):** Tạo, sửa, xóa, và sắp xếp thứ tự các chương.
  - **Bài học (Lessons):** Tạo, sửa, xóa, và sắp xếp thứ tự bài học trong chương.
  - **Video Bài học:** Upload video an toàn thông qua Presigned URL (ví dụ: upload thẳng lên AWS S3) và xác nhận.
  - **Câu hỏi trắc nghiệm (Quiz):** Tạo, cập nhật, xóa và sắp xếp câu hỏi cho các bài kiểm tra.

### B. Quản lý Khách hàng / Học viên
- Xem danh sách học viên đang tham gia khóa học của mình.
- **Chặn (Block):** Có quyền chặn học viên có hành vi không chuẩn mực.
- **Phản hồi Đánh giá (Reviews):** Xem đánh giá của học viên về khóa học, trả lời (reply) hoặc báo cáo (report) nếu đánh giá tiêu cực/spam.

### C. Quản lý Marketing & Khuyến mãi
- **Mã giảm giá (Coupons):** Tạo mã giảm giá riêng cho khóa học của mình, cập nhật, xóa, hoặc bật/tắt (toggle status) mã giảm giá để thu hút học viên.

### D. Quản lý Doanh thu & Tài chính
- **Thống kê Doanh thu:** Xem báo cáo doanh thu (`revenues`).
- **Rút tiền (Withdraw):** Yêu cầu rút tiền doanh thu từ hệ thống về tài khoản ngân hàng.

### E. Quản lý Gói VIP (VIP Packages)
- Seller có thể mua các "Gói VIP" (thanh toán qua VNPAY) để nhận các đặc quyền như: tăng hiển thị khóa học, huy hiệu nổi bật, hoặc các tính năng nâng cao khác trên hệ thống.

### F. Quản lý Hồ sơ Seller
- Cập nhật thông tin cá nhân, mật khẩu.
- Cài đặt thông tin thanh toán (để nhận tiền từ hệ thống).
- Xem thống kê tổng quan (Seller Dashboard) và thông báo.
