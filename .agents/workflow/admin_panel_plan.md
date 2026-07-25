## Mô tả mục tiêu (Goal Description)
Xây dựng phân hệ Quản trị viên (Admin Panel) cho hệ thống EduFlow, bao gồm giao diện tổng quan (Dashboard), quản lý người dùng (Học sinh & Giảng viên), quản lý giao dịch tài chính (Doanh thu, Rút tiền, Cài đặt hoa hồng/nạp tiền), quản lý gói VIP và xử lý các báo cáo vi phạm (Reports). Hệ thống phải tuân thủ nghiêm ngặt **Kiến trúc phân tầng (Layered Architecture)**, sử dụng **InertiaJS** kết hợp **Bootstrap 5** cho giao diện.

---

## Các thành phần thay đổi đề xuất (Proposed Changes)

### 1. Database & Models (Tầng Cơ sở Dữ liệu)
*   **SystemSetting Model & Migration**: Cần một bảng `system_settings` để lưu cấu hình (% hoa hồng, % thưởng nạp ví).
*   **Các Model hiện có**: Đảm bảo các model `User`, `Order`, `WithdrawalRequest`, `Report`, `VipPackage` đã có sẵn các relationship cần thiết.
*   **Thêm Scope/Query**: Cập nhật các Model hiện tại để hỗ trợ truy vấn thống kê theo thời gian (tuần/tháng/quý).

---

### 2. Định tuyến (Routes)
#### [MODIFY] `routes/web.php`
*   Thêm một group route cho Admin được bảo vệ bởi middleware xác thực và phân quyền (ví dụ: `auth`, `role:admin,root`).
*   Các route con dự kiến:
    *   `/admin/dashboard`: Thống kê doanh thu, số liệu tổng quan.
    *   `/admin/vip-packages`: Quản lý gói VIP.
    *   `/admin/users/students`: Quản lý học sinh.
    *   `/admin/users/sellers`: Quản lý giảng viên.
    *   `/admin/reports`: Quản lý báo cáo.
    *   `/admin/settings`: Cài đặt hệ thống (hoa hồng, thưởng nạp ví).
    *   `/admin/withdrawals`: Quản lý yêu cầu rút tiền.
    *   `/admin/revenues`: Quản lý chi tiết doanh thu.

---

### 3. Data Access Layer (Repositories)
#### [NEW] `app/Repositories/Admin/`
*   Tạo các Interface và Concrete Class để cô lập truy vấn:
    *   `AdminDashboardRepositoryInterface` & `AdminDashboardRepository`: Truy vấn thống kê tổng quan và doanh thu (sử dụng Redis cache nếu cần).
    *   `AdminUserRepositoryInterface` & `AdminUserRepository`: Truy vấn danh sách, khóa/mở khóa tài khoản học sinh, giảng viên.
    *   `AdminSettingRepositoryInterface` & `AdminSettingRepository`: Lưu và lấy cấu hình hệ thống.
    *   `AdminWithdrawalRepositoryInterface` & `AdminWithdrawalRepository`: Lấy danh sách yêu cầu rút tiền, cập nhật trạng thái duyệt.

---

### 4. Business Logic Layer (Services)
#### [NEW] `app/Services/Admin/`
*   Thực hiện toàn bộ nghiệp vụ quản lý:
    *   `DashboardService.php`: Tính toán doanh thu theo thời gian, tăng trưởng, xử lý cache.
    *   `UserManagementService.php`: Xử lý khóa tài khoản, gửi email cảnh báo.
    *   `SettingService.php`: Cập nhật cấu hình hoa hồng và tỷ lệ thưởng.
    *   `WithdrawalService.php`: Xử lý duyệt yêu cầu rút tiền, trừ tiền ví, tạo Transaction lịch sử, đẩy Event.

---

### 5. Presentation Layer (Controllers & DTOs)
#### [NEW] `app/Http/Controllers/Admin/`
*   Khởi tạo các Controller chỉ làm nhiệm vụ nhận Request, gọi Service và render View qua Inertia:
    *   `DashboardController.php`
    *   `VipPackageController.php`
    *   `UserController.php`
    *   `ReportController.php`
    *   `SettingController.php`
    *   `WithdrawalController.php`

#### [NEW] `app/DTO/Admin/`
*   Tạo các DTO `readonly class` để chuẩn hóa Request:
    *   `SettingData.php`: chứa thông tin cấu hình phần trăm hoa hồng.
    *   `FilterData.php`: chuẩn hóa các bộ lọc tìm kiếm và phân trang từ Admin.

---

### 6. Frontend Layer (UI/UX)
#### [NEW] `resources/js/Layouts/Admin/AdminLayout.jsx`
*   Giao diện bao bọc (Layout) chung sử dụng **Bootstrap 5**.
*   **Sidebar**: Chứa menu điều hướng với các icon trực quan (tương tự SellerLayout).
*   **Topbar**: Hiển thị thông tin Admin hiện tại, thanh tìm kiếm, và lối tắt đăng xuất.

#### [NEW] `resources/js/Pages/Admin/`
*   **Dashboard.jsx**: Vẽ biểu đồ doanh thu (dùng thư viện như Chart.js) và hiển thị các số liệu thống kê (Card UI).
*   **Users/StudentList.jsx & SellerList.jsx**: Bảng danh sách người dùng, tích hợp thanh tìm kiếm và nút chặn/mở chặn.
*   **Settings.jsx**: Form cài đặt hệ thống (Cài đặt % hoa hồng, % thưởng nạp).
*   **Withdrawals.jsx**: Danh sách yêu cầu rút tiền, cung cấp các nút Duyệt/Từ chối.
*   **Reports.jsx**: Danh sách các report để xử lý vi phạm.

---

## User Review Required
> [!IMPORTANT]
> Sếp vui lòng xác nhận các vấn đề sau trước khi em bắt đầu code:
> 1. **Biểu đồ thống kê**: Em sẽ tích hợp thư viện **Chart.js** (hoặc ApexCharts) qua npm để vẽ biểu đồ doanh thu trên Dashboard. Sếp đồng ý chứ ạ?
> 2. **Bảng System Settings**: Hiện tại database đã có bảng để lưu cấu hình hệ thống chưa ạ (ví dụ: `settings` hoặc `system_settings`), hay em cần tạo migration mới cho bảng này?
> 3. **Roles/Permissions**: Em sẽ sử dụng cơ chế kiểm tra `auth()->user()->role === 'admin'` để chặn route. Nếu sếp dùng Spatie Permission, em sẽ tích hợp theo Spatie.

---

## Kế hoạch triển khai (Verification Plan)
1.  **Bước 1**: Tạo Migration (nếu cần), tạo các Repositories và đăng ký bind trong `AppServiceProvider`.
2.  **Bước 2**: Tạo các Services và DTOs tương ứng.
3.  **Bước 3**: Tạo các Controllers và khai báo routes trong `routes/web.php`.
4.  **Bước 4**: Code `AdminLayout.jsx` chuẩn Bootstrap 5.
5.  **Bước 5**: Dựng lần lượt từng trang Frontend (từ Dashboard đến Settings).
6.  **Kiểm tra**: Vào bằng tài khoản admin, điều hướng các trang, xem biểu đồ, và thử cập nhật setting để đảm bảo API hoạt động đúng chuẩn.
