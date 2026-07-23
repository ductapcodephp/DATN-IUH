## Goal Description
Kế hoạch này thiết kế tính năng VIP cho **CẢ 2 ĐỐI TƯỢNG**: Học viên (User) và Giảng viên (Seller), đồng thời định hình rõ **tên các gói VIP** và **luồng quản lý của Admin**. 

Vì hệ thống đã có sẵn bảng `vip_packages` trong database, chúng ta sẽ tận dụng tối đa cơ sở dữ liệu này để Admin có toàn quyền tạo, sửa, xóa, hoặc thay đổi giá/thời hạn của các gói VIP mà không cần can thiệp vào code.

---

## Tên Gói VIP Đề Xuất (Admin có thể tự đổi sau)

### 1. Gói VIP cho Học viên (Role: User)
Các gói này chỉ hiển thị khi Học viên truy cập trang Mua VIP.
- **VIP Trải Nghiệm (1 Tháng):** 
  - Giá: 49,000 VND / 30 ngày.
  - Phù hợp cho người dùng muốn thử nghiệm huy hiệu VIP và nhận 1 voucher giảm giá tháng đầu.
- **VIP Tiêu Chuẩn (6 Tháng):**
  - Giá: 249,000 VND / 180 ngày.
  - Tặng kèm voucher hàng tháng, ưu đãi tiết kiệm hơn so với mua lẻ.
- **VIP Đam Mê (1 Năm):**
  - Giá: 399,000 VND / 365 ngày.
  - Mức giá hời nhất, giữ danh hiệu VIP lấp lánh nguyên năm.

### 2. Gói VIP cho Giảng viên (Role: Seller)
Các gói này chỉ hiển thị khi Giảng viên truy cập trang Mua VIP.
- **Giảng Viên Nổi Bật (1 Tháng):**
  - Giá: 299,000 VND / 30 ngày.
  - Giúp đẩy khóa học lên top 1 tháng trong đợt ra mắt khóa học mới.
- **Giảng Viên Uy Tín (6 Tháng):**
  - Giá: 1,499,000 VND / 180 ngày.
  - Phù hợp cho Seller có doanh thu ổn định, cần duy trì nhãn "Uy tín" dài hạn.
- **Đối Tác Chiến Lược (1 Năm):**
  - Giá: 2,499,000 VND / 365 ngày.
  - Gói cao cấp nhất với đầy đủ thống kê phân tích nâng cao (Advanced Analytics).

---

## Quản Lý Của Admin (Admin Panel)

Vì database đã có bảng `vip_packages`, Admin sẽ được cung cấp một giao diện quản lý (CRUD) để kiểm soát các gói này:

- **Thêm gói mới:** Bổ sung gói sự kiện (Ví dụ: "VIP Sinh Nhật Sàn" bán trong 3 ngày).
- **Chỉnh sửa (Edit):** Thay đổi tên gói, giá tiền, thời hạn (`duration_days`), phần mô tả (`description`).
- **Tắt/Mở (Toggle Active):** Sử dụng cột `is_active`. Nếu gói nào không muốn bán nữa, Admin chỉ cần gạt nút Tắt, lập tức gói đó sẽ ẩn khỏi Frontend.
- **Gán Role (`role_type`):** Khi tạo gói, Admin sẽ chọn gói này bán cho `User` hay `Seller`.

---

## Proposed Changes (Code)

### 1. Database (Migrations)
#### [MODIFY] `database/migrations/2024_01_01_000017_create_vip_packages_table.php`
Thêm cột `role_type` để Admin phân loại gói:
```php
Schema::table('vip_packages', function (Blueprint $table) {
    // Enum: 'user', 'seller'
    $table->string('role_type', 20)->default('user')->after('name');
});
```

### 2. Quản lý Admin (Backend)
#### [NEW] `app/Http/Controllers/Admin/VipPackageAdminController.php` (Nếu chưa có)
Tạo bộ Controller cho Admin để thực hiện các thao tác thêm/sửa/xóa gói VIP.
```php
public function store(Request $request) {
    VipPackage::create($request->only(['name', 'role_type', 'price', 'duration_days', 'description', 'is_active']));
    // ...
}
```

### 3. Frontend (UI)
- **Admin VIP Management Page:** Bảng danh sách các gói VIP, có bộ lọc theo `role_type` (User/Seller) và nút tắt/mở (Active/Inactive).
- **Trang mua VIP (User/Seller):** Gọi API lấy các gói `is_active = true` và đúng `role_type` để hiển thị ra thành các Card đẹp mắt cho người dùng bấm mua.

## Verification Plan
1. Admin đăng nhập vào trang quản trị, tạo thử 1 gói "VIP Test" giá 10k cho Học viên.
2. Đăng nhập bằng tài khoản Học viên, vào trang mua VIP -> Thấy gói "VIP Test" hiển thị.
3. Đăng nhập bằng tài khoản Giảng viên -> Không thấy gói "VIP Test".
4. Admin gạt nút tắt (Deactivate) gói "VIP Test" -> Học viên load lại trang sẽ không thấy gói này nữa.
