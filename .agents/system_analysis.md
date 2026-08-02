# Phân Tích Hệ Thống Nền Tảng Học Trực Tuyến (E-Learning Platform)

## 1. Giới thiệu tổng quan hệ thống
Hệ thống là một nền tảng giáo dục trực tuyến (E-Learning / LMS) phát triển trên nền tảng **Laravel (Backend)** kết hợp với **React/Inertia (Frontend)**. Đây là một nền tảng học tập đa chiều, không chỉ cho phép học viên mua và học các khóa học, mà còn tích hợp mô hình **C2C (Consumer-to-Consumer) hoặc Marketplace**, cho phép người dạy (Seller) đăng tải khóa học và nhận doanh thu.

Hệ thống được thiết kế hướng tới quy mô lớn với đầy đủ các nghiệp vụ thực tế như thanh toán trực tuyến, quản lý ví điện tử, hệ thống đánh giá, thi trắc nghiệm và gói hội viên (VIP).

## 2. Phân tích các phân hệ (Modules) chức năng cốt lõi

Dựa trên cấu trúc cơ sở dữ liệu và các Entity (Models), hệ thống được chia thành 7 phân hệ chính như sau:

### 2.1. Phân hệ Người dùng & Định danh (User & Identity Management)
- **Quản lý tài khoản (User):** Lưu trữ thông tin người dùng, hỗ trợ đăng nhập truyền thống và đăng nhập qua mạng xã hội (Google, Facebook).
- **Hồ sơ giảng viên (SellerProfile):** Định danh người dùng có quyền bán khóa học, chứa thông tin cá nhân và chứng thực.
- **Bảo mật & Theo dõi:** Quản lý token (RefreshToken), theo dõi lịch sử đăng nhập (LoginAttempt) để bảo mật tài khoản.

### 2.2. Phân hệ Quản lý Khóa học & Nội dung (Course & Content Management)
- **Cấu trúc chương trình học:** Khóa học được phân loại theo danh mục (Category) và chủ đề (Topic). Mỗi khóa học (Course) bao gồm nhiều chương (Chapter), mỗi chương có nhiều bài học (Lesson).
- **Lưu trữ Video (Video):** Quản lý luồng video bài giảng của hệ thống.
- **Tương tác nội dung:** Học viên có thể thêm vào danh sách yêu thích (Wishlist).

### 2.3. Phân hệ Trải nghiệm Học tập (Learning Experience)
- **Ghi danh & Tiến độ:** Quản lý việc ghi danh khóa học (CourseEnrollment) và theo dõi tiến độ học tập chi tiết của từng bài học (CourseProgress).
- **Ghi chú cá nhân (VideoNote):** Tính năng đặc biệt cho phép học viên ghi chú trực tiếp tại một mốc thời gian cụ thể của video bài giảng.

### 2.4. Phân hệ Đánh giá & Kiểm tra (Assessment & Quizzes)
- **Hệ thống bài thi (Quiz):** Cho phép tạo các bài kiểm tra với nhiều câu hỏi (QuizQuestion) và các đáp án (QuizAnswer).
- **Lưu trữ kết quả (QuizResult):** Lưu lại lịch sử làm bài và điểm số của học viên.

### 2.5. Phân hệ Thương mại điện tử (E-commerce & Orders)
- **Giỏ hàng (Cart & CartItem):** Cho phép người dùng thêm nhiều khóa học vào giỏ để thanh toán cùng lúc.
- **Quản lý Đơn hàng (Order):** Xử lý quy trình tạo đơn hàng, trạng thái thanh toán.
- **Thanh toán trực tuyến (OnlinePayment):** Tích hợp cổng thanh toán (như VNPay, Momo, v.v.).
- **Khuyến mãi (Coupon & CouponUsage):** Hệ thống mã giảm giá, giới hạn số lần sử dụng và điều kiện áp dụng.

### 2.6. Phân hệ Tài chính & Ví điện tử (Finance & Wallet System)
- **Ví cá nhân (Wallet & WalletTransaction):** Mỗi người dùng/giảng viên có một ví điện tử để nhận doanh thu hoặc nạp tiền mua khóa học. Theo dõi biến động số dư chi tiết.
- **Ví hệ thống (SystemWallet & SystemWalletTransaction):** Theo dõi doanh thu tổng của nền tảng (hoa hồng giữ lại từ các giao dịch bán khóa học).
- **Yêu cầu rút tiền (WithdrawalRequest):** Giảng viên có thể yêu cầu rút tiền từ ví ra tài khoản ngân hàng thực tế (UserBankAccount).
- **Thưởng (WalletBonus):** Hệ thống cấp phát tiền thưởng cho người dùng.

### 2.7. Phân hệ Tương tác & Xã hội (Social & Communication)
- **Thảo luận & Đánh giá (Comment, Review):** Đánh giá sao cho khóa học và bình luận dưới mỗi bài giảng.
- **Nhắn tin trực tiếp (Conversation & Message):** Hệ thống chat nội bộ giữa học viên và giảng viên hoặc giữa các người dùng.
- **Báo cáo (Report):** Cho phép người dùng report các nội dung vi phạm, bình luận xấu.
- **Hỗ trợ (Contact):** Gửi liên hệ hỗ trợ đến quản trị viên.

### 2.8. Phân hệ Gói Hội viên (VIP Subscription)
- **Gói VIP (VipPackage & VipSubscription):** Mô hình kinh doanh dạng Subscription, cho phép người dùng mua các gói VIP để học toàn bộ hoặc một nhóm khóa học đặc quyền trong một khoảng thời gian nhất định (tháng/năm).

## 3. Kiến trúc kỹ thuật nổi bật
1. **Ví điện tử nội bộ (E-Wallet):** Giúp giữ chân dòng tiền trong hệ thống. Việc mua bán diễn ra ngay lập tức thông qua số dư ví, giảm tải gọi API qua cổng thanh toán bên thứ ba cho từng giao dịch lẻ tẻ.
2. **Kiến trúc Multi-tenant (Seller vs Admin):** Phân quyền rạch ròi giữa người học, người bán (Seller) và quản trị viên (Admin). Admin thu phí hoa hồng trên mỗi giao dịch.
3. **Tracking chi tiết:** Theo dõi từ tiến độ xem video (Progress), nỗ lực làm bài test (QuizResult) cho đến hành vi đăng nhập (LoginAttempt), giúp phân tích dữ liệu học viên dễ dàng.

---
*Tài liệu này dùng để đính kèm vào báo cáo chuyên đề / Đồ án tốt nghiệp nhằm mô tả quy mô và các module chức năng của dự án.*
