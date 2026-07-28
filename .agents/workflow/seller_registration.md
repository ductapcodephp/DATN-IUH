# Quy trình Đăng ký Trở thành Giảng viên (Seller)

## 1. Tổng quan
Trong các hệ thống nền tảng học trực tuyến (EdTech) lớn (như Udemy, Coursera, Edumall), quy trình đăng ký làm Giảng viên (Seller) thường yêu cầu xác thực danh tính, chuyên môn và thông tin thanh toán khắt khe hơn so với người dùng thông thường để đảm bảo chất lượng nội dung giảng dạy.

## 2. Quy trình Chi tiết (User Flow)

### Bước 1: Khởi tạo Yêu cầu (Dành cho Học viên / User thông thường)
- User bắt buộc phải đăng nhập vào hệ thống.
- Truy cập vào trang landing page "Trở thành Giảng viên" và bấm nút **"Đăng ký ngay"**.
- Hệ thống kiểm tra: Nếu User đã là Giảng viên (`role = SELLER`) hoặc đang có đơn đăng ký chờ duyệt thì chặn lại và hiển thị thông báo tương ứng.

### Bước 2: Điền Hồ sơ Giảng viên (Form Đăng ký)
Form đăng ký nên chia làm các bước (Wizard form) để tránh làm user bị ngợp thông tin:
1. **Thông tin Cơ bản & Chuyên môn:**
   - Tiêu đề chuyên môn (VD: Kỹ sư phần mềm, Chuyên gia Marketing).
   - Giới thiệu bản thân (Bio).
   - Các lĩnh vực dự định giảng dạy.
   - Link hồ sơ cá nhân (LinkedIn, Facebook, Website cá nhân).
2. **Xác minh Danh tính (Bắt buộc cho hệ thống có thu phí):**
   - Ảnh chụp CCCD/CMND (mặt trước & sau).
   - Mã số thuế cá nhân / Doanh nghiệp (để xử lý thuế thu nhập).
3. **Thông tin Thanh toán (Payout):**
   - Ngân hàng thụ hưởng.
   - Số tài khoản.
   - Tên chủ tài khoản.
4. **Cam kết & Điều khoản:**
   - Người dùng đọc và tick chọn đồng ý với "Điều khoản Dịch vụ dành cho Giảng viên".

### Bước 3: Gửi và Chờ Duyệt (Pending Status)
- Dữ liệu được lưu vào bảng `seller_profiles` với trạng thái là `pending`.
- Hệ thống gửi Email tự động cho User xác nhận: "Hồ sơ của bạn đã được tiếp nhận và đang trong quá trình xét duyệt".
- Gửi Notification/Email cho Admin báo có người dùng mới đăng ký làm Giảng viên.

### Bước 4: Admin Xét Duyệt (Review Process)
- Admin vào màn hình Quản trị (Admin Dashboard).
- Xem xét hồ sơ, kiểm tra độ tin cậy của thông tin chuyên môn và CCCD.
- **Nếu Duyệt (Approve):**
  - Trạng thái profile chuyển thành `approved`.
  - Hệ thống tự động đổi `role` của User thành `SELLER` trong bảng `users`.
  - Gửi Email chúc mừng và đính kèm link hướng dẫn truy cập `Seller Dashboard`.
- **Nếu Từ chối (Reject):**
  - Trạng thái profile chuyển thành `rejected` (bắt buộc kèm theo lý do từ chối: VD "Hình ảnh CCCD mờ", "Chưa cung cấp đủ thông tin chuyên môn").
  - Gửi Email thông báo lý do từ chối để User có thể vào hệ thống cập nhật lại hồ sơ và gửi duyệt lại.

---

## 3. Kiến trúc Dữ liệu Đề xuất (Database Schema)

**Bảng `seller_profiles` (hoặc `instructor_profiles`)**
- `id`: Khóa chính
- `user_id`: Khóa ngoại liên kết tới bảng `users` (Unique)
- `headline`: Tiêu đề chuyên môn (Vd: Senior Fullstack Developer)
- `bio`: Giới thiệu chi tiết (Text)
- `website`: Link website/linkedin cá nhân (Nullable)
- `identity_card_front`: Đường dẫn lưu ảnh CCCD mặt trước
- `identity_card_back`: Đường dẫn lưu ảnh CCCD mặt sau
- `tax_number`: Mã số thuế (Nullable)
- `status`: Enum (`'pending'`, `'approved'`, `'rejected'`)
- `reject_reason`: Lý do từ chối (Text, Nullable)
- `created_at`, `updated_at`

---

## 4. Các API Backend Cần Xây Dựng

1. **`POST /api/seller/apply`**: User gửi form đăng ký làm Giảng viên.
2. **`GET /api/seller/my-profile`**: User xem lại trạng thái hồ sơ hiện tại của mình (đang chờ duyệt, bị từ chối hay đã duyệt).
3. **`PUT /api/seller/apply`**: User cập nhật lại hồ sơ nếu bị Admin từ chối.
4. **`GET /api/admin/sellers/pending`**: Admin lấy danh sách các hồ sơ đang chờ xét duyệt.
5. **`POST /api/admin/sellers/{id}/approve`**: Admin duyệt hồ sơ (trigger logic đổi role User sang SELLER).
6. **`POST /api/admin/sellers/{id}/reject`**: Admin từ chối hồ sơ (truyền theo body `reject_reason`).

---

## 5. Mở rộng (Nâng cao cho hệ thống Lớn)
- **Tự động OCR:** Tích hợp AI để đọc ảnh CCCD tự động so khớp thông tin đăng ký (giảm tải cho Admin).
- **Video Sample:** Yêu cầu Giảng viên upload 1 đoạn video dạy học ngắn (3-5 phút) để Admin đánh giá chất lượng ghi hình và âm thanh trước khi duyệt.
- **Ký hợp đồng điện tử:** Tích hợp e-Contract (ký điện tử) cho các thỏa thuận chia sẻ doanh thu (Revenue Share Agreement) sau khi được duyệt.
