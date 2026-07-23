## Goal Description
Áp dụng mô hình **Bán Gói Khoán (Flat-rate Subscription)** cho Giảng viên (Seller). 
Seller mua gói VIP sẽ được cấp một dung lượng lưu trữ (Storage Limit). Hệ thống sẽ theo dõi tổng dung lượng video mà Seller đã tải lên Cloudflare R2 và chặn upload nếu vượt quá giới hạn. Đồng thời, hiển thị thanh tiến trình (Progress Bar) dung lượng ở trang quản lý bài học để Seller dễ dàng theo dõi và nâng cấp gói.

## User Review Required
> [!IMPORTANT]
> **Các mốc dung lượng đề xuất (Max Storage):**
> - Gói VIP Trải Nghiệm / Tiêu chuẩn (User): 0 GB (Vì học viên không được up video).
> - Gói Mặc định (Free Seller): 5 GB.
> - Gói Giảng Viên Nổi Bật (Pro): 200 GB.
> - Gói Giảng Viên Uy Tín (Business): 1000 GB (1TB).
> Sếp vui lòng xác nhận các thông số dung lượng này nhé.

## Proposed Changes

### Database & Migrations
Tạo migration thêm cột dung lượng giới hạn vào bảng `vip_packages`.
#### [NEW] database/migrations/2026_07_23_xxxxxx_add_max_storage_gb_to_vip_packages_table.php
```php
Schema::table('vip_packages', function (Blueprint $table) {
    $table->integer('max_storage_gb')->default(5)->after('duration_days')->comment('Max storage quota in GB');
});
```

### Backend Models & Services
Thêm các phương thức tính toán và cấu hình các thuộc tính.
#### [MODIFY] app/Models/VipPackage.php
```diff
     protected $fillable = [
         'name',
         'role_type',
         'price',
         'duration_days',
+        'max_storage_gb',
         'description',
         'is_active',
     ];
```

#### [MODIFY] app/Models/User.php
Thêm 2 hàm helper để lấy limit và dung lượng đã dùng:
```php
public function getSellerStorageLimitBytes(): int
{
    $activeSub = $this->vipSubscriptions()
        ->whereHas('vipPackage', fn($q) => $q->where('role_type', 'seller'))
        ->active()
        ->with('vipPackage')
        ->first();

    // Nếu không có gói VIP -> dùng mặc định 5GB
    $limitGb = $activeSub ? $activeSub->vipPackage->max_storage_gb : 5;
    return $limitGb * 1024 * 1024 * 1024; // Chuyển sang Bytes
}

public function getSellerStorageUsedBytes(): int
{
    // Đếm dung lượng video của toàn bộ các khóa học của seller
    return \Illuminate\Support\Facades\DB::table('videos')
        ->join('lessons', 'videos.lesson_id', '=', 'lessons.id')
        ->join('chapters', 'lessons.chapter_id', '=', 'chapters.id')
        ->join('courses', 'chapters.course_id', '=', 'courses.id')
        ->where('courses.user_id', $this->id)
        ->whereNotNull('videos.r2_key')
        ->sum('videos.size_bytes');
}
```

#### [MODIFY] app/Http/Middleware/HandleInertiaRequests.php
Đẩy dữ liệu storage ra frontend cho seller:
```php
'auth' => [
    'user' => $request->user(),
    'isUserVip' => $request->user() ? $request->user()->isUserVip() : false,
    'isSellerVip' => $request->user() ? $request->user()->isSellerVip() : false,
    'seller_storage_limit' => $request->user() && $request->user()->role === 'seller' ? $request->user()->getSellerStorageLimitBytes() : 0,
    'seller_storage_used' => $request->user() && $request->user()->role === 'seller' ? $request->user()->getSellerStorageUsedBytes() : 0,
    // ...
]
```

### Video Upload Validation (Presigned URL)
Chặn lấy URL upload trực tiếp lên R2 nếu seller đã hết dung lượng. Cập nhật DTO để nhận thêm thông số `size_bytes` từ client.
#### [MODIFY] app/DTO/Seller/Course/Lesson/PresignedUrlData.php
```php
public function __construct(
    public string $extension,
    public int $sizeBytes,
) {}
```
#### [MODIFY] app/Services/Seller/Courses/VideoService.php
```php
public function generatePresignedUrl(Lesson $lesson, PresignedUrlData $dto): array
{
    $user = auth()->user();
    $usedBytes = $user->getSellerStorageUsedBytes();
    $limitBytes = $user->getSellerStorageLimitBytes();

    // Check quota
    if (($usedBytes + $dto->sizeBytes) > $limitBytes) {
        throw \Illuminate\Validation\ValidationException::withMessages([
            'video' => 'Bạn đã vượt quá dung lượng lưu trữ của gói VIP. Vui lòng nâng cấp gói để tiếp tục tải lên.'
        ]);
    }
    // ... generate URL
}
```

### Frontend UI (React)
Tích hợp UI báo cáo dung lượng và thanh tiến trình.
#### [MODIFY] resources/js/Pages/Seller/Curriculum/Index.jsx
- Import thông tin `seller_storage_limit` và `seller_storage_used` từ biến `auth` của Inertia.
- Render Progress Bar hiển thị số GB đã dùng / tổng số GB.
- Gắn nút "Nâng cấp gói" nếu dung lượng đã đạt trên 90%.

#### [MODIFY] resources/js/Pages/Seller/Curriculum/UploadVideoModal.jsx
- Bổ sung việc gửi thông số `size_bytes: file.size` lúc gọi request xin Presigned URL.
- Hiển thị thông báo dung lượng còn lại ngay trong Modal upload. Vô hiệu hóa nút Tải lên nếu video có dung lượng lớn hơn phần còn lại.

## Verification Plan
### Automated Tests
1. Chạy Artisan Migrate và `php artisan db:seed --class=VipPackageSeeder`.
2. Truy cập Frontend Seller UI để kiểm tra sự xuất hiện của thanh Progress Bar dung lượng.

### Manual Verification
1. Sếp đăng nhập tài khoản Seller, vào trang Quản lý giáo trình (Curriculum) và thấy thanh Storage.
2. Thử tải lên một video. 
3. Giả lập quá dung lượng bằng cách hạ max_storage_gb xuống 0 (hoặc thấp) trong Database, sau đó thử xin upload video mới. Kết quả kỳ vọng: Giao diện bắn lỗi từ chối sinh URL.
