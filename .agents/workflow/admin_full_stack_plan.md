## Mô tả mục tiêu (Goal Description)
Tiến hành tích hợp giao diện HTML/CSS/JS (đã thiết kế trong `public/admin-demo`) vào hệ thống React (Frontend) và Laravel (Backend). Phân hệ Quản trị viên (Admin Panel) sẽ quản lý: Dashboard, Người dùng, Gói VIP, Rút tiền, Cài đặt hệ thống, Báo cáo vi phạm và **Quản lý Liên hệ (Contacts)**.

## User Review Required
> [!IMPORTANT]
> Sếp vui lòng xem xét và duyệt qua các điểm sau trước khi em bắt tay vào code:
> 1. **Kiến trúc FE**: Em sẽ chuyển toàn bộ cấu trúc từ `admin-demo/index.html` sang `AdminLayout.jsx`. File `style.css` sẽ được đưa vào `resources/css/admin-style.css` và import global vào app. Sếp đồng ý chứ ạ?
> 2. **Trang Liên hệ (Contact)**: Bảng `contacts` (để lưu form liên hệ từ khách) đã có trong Database chưa ạ? Nếu chưa, em sẽ tạo Migration cho `Contact` model gồm các trường: `name`, `email`, `phone`, `subject`, `message`, `status`.
> 3. **Tích hợp Chart.js**: Các biểu đồ doanh thu và donut chart em sẽ dùng `chart.js` trong React (`react-chartjs-2` hoặc gọi trực tiếp instance). Em sẽ cài thêm thư viện này nếu project chưa có.

## Open Questions
> [!WARNING]
> Sếp dùng Spatie Permission để phân quyền hay chỉ check cứng `role === 'admin'` trong Middleware ạ?

---

## Proposed Changes

### 1. Database & Models (Tầng Cơ sở Dữ liệu)
Sẽ bổ sung và chỉnh sửa các Model cần thiết.
#### [NEW] `database/migrations/xxxx_xx_xx_create_contacts_table.php`
* Bảng lưu trữ thông tin liên hệ từ người dùng (User Contact Form).
#### [NEW] `app/Models/Contact.php`
* Model tương tác với bảng contacts.
#### [NEW] `app/Models/SystemSetting.php`
* Bảng `system_settings` lưu cấu hình hoa hồng, thưởng nạp ví.

---

### 2. Routes
Khai báo toàn bộ API / Page Navigation cho Admin.
#### [MODIFY] `routes/web.php`
```php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/vip-packages', [VipPackageController::class, 'index'])->name('vip-packages');
    Route::get('/settings', [SettingController::class, 'index'])->name('settings');
    Route::get('/withdrawals', [WithdrawalController::class, 'index'])->name('withdrawals');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts');
});
```

---

### 3. Backend Logic (Repositories, Services, Controllers)
Triển khai kiến trúc phân tầng chuẩn.
#### [NEW] `app/Repositories/Admin/`
* `AdminContactRepository`: Lấy danh sách liên hệ, cập nhật trạng thái đã phản hồi.
* `AdminDashboardRepository`, `AdminUserRepository`...

#### [NEW] `app/Services/Admin/`
* `ContactService.php`: Xử lý nghiệp vụ phân loại và đánh dấu phản hồi liên hệ.
* `DashboardService.php`, `UserManagementService.php`...

#### [NEW] `app/Http/Controllers/Admin/`
* `ContactController.php`: Fetch list contacts gửi xuống Inertia.
* Cùng các Controllers khác: `DashboardController`, `SettingController`...

---

### 4. Frontend Layer (React / Inertia)
Chuyển đổi toàn bộ HTML Template sang React Components.

#### [NEW] `resources/css/admin-style.css`
* Copy CSS từ `public/admin-demo/style.css`.

#### [MODIFY] `resources/js/Layouts/Admin/AdminLayout.jsx`
* Render cấu trúc Sidebar, Topbar. Tích hợp thanh menu Active theo Route hiện tại.

#### [NEW] `resources/js/Pages/Admin/Contacts.jsx`
* Giao diện quản lý các Liên hệ (Contacts) với các bộ lọc và bảng dữ liệu (từ `contacts.html`).

#### [NEW] `resources/js/Pages/Admin/Settings.jsx`
* Giao diện chỉnh sửa Setting từ `settings.html`.

#### [NEW] `resources/js/Pages/Admin/Withdrawals.jsx`
* Giao diện duyệt Rút tiền từ `withdrawals.html`.

#### [NEW] `resources/js/Pages/Admin/Reports.jsx`
* Giao diện duyệt Báo cáo từ `reports.html`.

#### [NEW] `resources/js/Pages/Admin/VipPackages.jsx`
* Giao diện Gói VIP từ `vip-packages.html`.

#### [NEW] `resources/js/Pages/Contact.jsx`
* Giao diện Form liên hệ dành cho End User (Guest/User) từ `contact.html`.

---

## Verification Plan

### Automated Tests
1. Chạy `php artisan test` nếu dự án có sẵn Unit Tests.
2. Kiểm tra `php artisan route:list | grep admin` để xác nhận các route đã được đăng ký thành công.

### Manual Verification
1. Đăng nhập tài khoản Admin, mở `/admin/dashboard` để kiểm tra Sidebar và Biểu đồ hiển thị.
2. Chuyển qua các trang Users, Contacts, Settings xem dữ liệu render có khớp không.
3. Ra ngoài trang chủ `/contact` xem form liên hệ có hiển thị đúng giao diện Glassmorphism không.
