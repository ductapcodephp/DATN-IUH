# Hướng dẫn tạo lại Database Seeder và Dữ liệu giả lập

Tài liệu này lưu trữ quy trình và logic để AI có thể tự động quét và xây dựng lại bộ seeders cho database, đặc biệt hữu ích khi dự án được tái sử dụng vào các năm sau hoặc khi cần tạo mới toàn bộ dữ liệu mẫu một cách ngẫu nhiên nhưng phải thực tế.

## 1. Mẫu Prompt Tái Sử Dụng
Khi cần AI thực hiện lại công việc này, hãy copy câu lệnh dưới đây, thay đổi biến thời gian và gửi cho AI:

> "Hãy quét toàn bộ cấu trúc các bảng trong database (models, migrations) và các routes admin/seller hiện tại của dự án. 
> 
> Nhiệm vụ của bạn là viết lại `DatabaseSeeder.php` và tạo/cập nhật `OrderRevenueSeeder.php` (hoặc tương tự) để nạp dữ liệu giả lập cho toàn bộ các chức năng.
> 
> **Yêu cầu quan trọng về mặt thời gian và số liệu:**
> - Hãy tạo dữ liệu đơn hàng, đánh giá, ghi danh khóa học, nạp ví, giao dịch hệ thống, và doanh thu bắt đầu từ ngày **01/01/2027** cho đến **thời điểm hiện tại**.
> - Phải áp dụng thuật toán tăng trưởng tự nhiên (tháng 1 ít, các tháng sau tăng dần theo hệ số).
> - Giảm 30% số lượng giao dịch vào các ngày cuối tuần (Thứ 7, CN) và tăng đột biến x1.8 vào các ngày lễ (Ví dụ: Tết, 8/3, 30/4, 1/5...).
> 
> **Yêu cầu về độ bao phủ:**
> - Phải đảm bảo mọi chức năng bên trong Sidebar của Admin và Seller đều có dữ liệu để hiển thị (Dashboard thống kê biểu đồ, quản lý Users, VIP Packages, Rút tiền, Report, Liên hệ, CMS Pages/Blocks, Notifications, Conversations, ...).
> - Đảm bảo fix các lỗi liên quan đến ràng buộc khóa ngoại (Foreign Keys) hoặc `Unique Constraint` bằng cách thêm đủ lượng User, Course cần thiết trước khi random.
> - Lưu ý đúng không gian tên (namespace) của Notifications để không bị lỗi truy vấn."

---

## 2. Các Bước Kỹ Thuật (Dành cho AI hoặc Developer)

### B1: Xóa trắng cơ sở dữ liệu
Trong quá trình phát triển, nếu thay đổi kiểu dữ liệu (đặc biệt là ENUM của các bảng transactions) dẫn đến lỗi khi rollback, hãy sử dụng lệnh Wipe thay vì Refresh thông thường:
```bash
php artisan db:wipe
```

### B2: Chạy lại Migration & Seeder
Sau khi viết xong các file seeders (DatabaseSeeder, VipPackageSeeder, OrderRevenueSeeder), hãy chạy:
```bash
php artisan migrate:fresh --seed
```

### B3: Kiến trúc Seeders Khuyến nghị
- **DatabaseSeeder**: Nơi khởi tạo các dữ liệu "gốc" (Master Data) ít biến động. 
  - Khởi tạo SystemSetting, SystemWallet.
  - Tạo tài khoản Admin, Sellers (kèm SellerProfile, BankAccount), Users mặc định.
  - Tạo Categories, Topics, CMS (Pages, Posts, Blocks, QA).
  - Khởi tạo Courses, Chapters, Lessons.
  - Sinh một số lượng Contacts, Reports, Withdrawals, Conversations, Notifications cơ bản cho Admin/Seller.
- **OrderRevenueSeeder** (Được gọi ở cuối DatabaseSeeder): Nơi sinh dữ liệu "dòng chảy" liên quan đến thời gian và logic phức tạp.
  - Lặp qua từng ngày từ `Ngày Bắt Đầu` đến `Ngày Hiện Tại`.
  - Sinh ngẫu nhiên: Order (Course / VIP), Payment (VNPay / Wallet), Ghi danh (CourseEnrollment / VipSubscription), Hoa hồng (WalletTransaction / SystemWalletTransaction).
  - Tỷ lệ ngẫu nhiên cho Coupon Usage, Reviews (đánh giá sao và comments) và Refunds (hoàn tiền).
  - Lưu kết quả vào `DailyStatistics` để phục vụ Dashboard.

---

## 3. Một số Lỗi Thường Gặp Cần Chú Ý
1. **Lỗi `UniqueConstraintViolationException`**:
   - Thường xảy ra ở bảng `orders` có index `(user_id, course_id)` hoặc `wishlists`.
   - **Cách fix**: AI cần đảm bảo khởi tạo một mảng `users` giả đủ lớn (ví dụ tạo thêm 100 faker users) so với số vòng lặp tạo đơn hàng, đồng thời dùng thuật toán sinh ngẫu nhiên có kiểm tra trùng lặp hoặc trộn mảng để không gán cùng 1 user mua 1 khóa học 2 lần.
2. **Lỗi Namespace cho Polymorphic Notifications**:
   - Khi insert dữ liệu giả vào bảng `notifications` của Laravel bằng `DB::table('notifications')->insert(...)`, chú ý cột `type` phải khớp tuyệt đối với tên Class đã được khai báo.
   - Ví dụ: `App\Notifications\Admin\NewReportNotification` chứ không phải `App\Notifications\NewReportNotification`. Nếu sai, Frontend (dùng Eloquent Relationship) sẽ không truy vấn ra được dữ liệu.
3. **Lỗi Missing Columns trong CMS Models**:
   - Một số Models như `CorePage` không chứa các cột như `title` hay `content`, mà các cột này nằm ở `CorePost`. AI cần đọc kỹ định nghĩa Models và Migrations trước khi viết logic `create()` thay vì tự suy diễn các cột.
