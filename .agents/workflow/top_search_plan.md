## Mục Tiêu Tính Năng
Thực hiện tính năng "Top Search" (Ưu tiên hiển thị tìm kiếm) cho các khóa học thuộc về giảng viên đang sở hữu **Gói VIP Phí Sàn** (Commission VIP Package) còn hiệu lực.
Khi người dùng tìm kiếm khóa học hoặc duyệt các danh mục trên trang chủ, các khóa học của giảng viên VIP này sẽ được ưu tiên hiển thị ở trên cùng của danh sách, đứng trước các khóa học của giảng viên thường. Điều này đáp ứng chính xác quyền lợi đã mô tả trong file quy tắc kinh doanh VIP.

## Câu Hỏi Cần Sếp Phê Duyệt
> [!IMPORTANT]
> **Hành vi Sắp xếp khi người dùng chủ động chọn Bộ lọc:**
> Hiện tại, hệ thống cho phép người dùng sắp xếp theo `Mới nhất`, `Phổ biến nhất`, `Giá thấp đến cao`, `Giá cao đến thấp`.
> Em đề xuất rằng **Quyền ưu tiên VIP** sẽ LUÔN LUÔN được ưu tiên hơn `Mới nhất` và `Phổ biến nhất`. Tuy nhiên, mình cần chốt xem nó có nên đè lên cả bộ lọc `Giá` không.
> - **Đề xuất của em**: Luôn đưa khóa học VIP lên đầu khi duyệt mặc định (`Mới nhất`, `Phổ biến nhất`) và khi Tìm kiếm theo từ khóa. Nhưng nếu người dùng đã cố tình bấm lọc "Giá thấp đến cao", thì mình nên tôn trọng thứ tự giá tiền thật sự (không đẩy 1 khóa học VIP giá 1 triệu lên trên 1 khóa học thường giá 100k).

> [!TIP]
> **Giao diện Badge (Nhãn dán) VIP:**
> Để làm nổi bật lý do vì sao các khóa học này lại được nằm trên cùng, em định sẽ gắn thêm một nhãn "Đề xuất" (Recommended) hoặc "Top" nhỏ trên góc hình ảnh Khóa học ở ngoài trang người dùng nếu khóa học đó là của giảng viên VIP.

## Chi Tiết Thay Đổi Kỹ Thuật

### 1. Lớp Cấu trúc dữ liệu (Xử lý logic Tìm kiếm Backend)
Chỉnh sửa file `app/Repositories/Frontend/Courses/CourseRepository.php`.


#### [SỬA CODE] CourseRepository.php
Cập nhật hàm `getAllPublishedCourses` để chèn t                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            hêm câu truy vấn phụ (subquery) giúp đẩy giảng viên VIP lên trước.

```php
        $now = \Carbon\Carbon::now();
        $vipSubQuery = '(SELECT COUNT(*) FROM vip_subscriptions 
                         INNER JOIN vip_packages ON vip_packages.id = vip_subscriptions.vip_package_id 
                         WHERE vip_subscriptions.user_id = courses.seller_id 
                         AND vip_subscriptions.status = \'active\' 
                         AND vip_subscriptions.expires_at > ? 
                         AND vip_packages.package_type = \'commission\') > 0';

        $query = Course::query()
            ->select('courses.*')
            ->selectRaw("$vipSubQuery as is_vip_seller", [$now])
            ->with(['seller:id,name,avatar', 'category:id,name'])
            ->withAvg('reviews', 'rating')
            ->withCount('students')
            ->published();
            
        // ... (Các câu lệnh lọc theo từ khóa, danh mục giữ nguyên) ...

        // Lấy điều kiện sắp xếp
        $sort = $filters['sort'] ?? 'newest';

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderByDesc('is_vip_seller')->orderByDesc('students_count');
                break;
            case 'newest':
            default:
                // Mặc định: Giảng viên VIP lên đầu, sau đó mới tính đến mới nhất
                $query->orderByDesc('is_vip_seller')->latest();
                break;
        }

        return $query->paginate($perPage)->withQueryString();
    }
```

### 2. Tối Ưu Database (Migration)
Thêm migration để tạo indexes tối ưu cho truy vấn phụ (correlated subquery):
- Tạo index trên bảng `vip_subscriptions` cho các cột: `user_id`, `status`, `expires_at`.
- Tạo index trên bảng `vip_packages` cho cột: `package_type`.

### 3. Giao diện Frontend (Tùy chọn)
Chỉnh sửa Component `CourseCard` để hiển thị nhãn dán "Đề xuất" nếu khóa học thuộc về giảng viên VIP. 
Vì dữ liệu query ở Bước 1 đã trả về thêm trường `is_vip_seller` nên Frontend có thể lấy trực tiếp dữ liệu này từ object course mà không bị lỗi N+1 queries.

## Kế Hoạch Kiểm Thử

### Automated Tests (Feature Tests)
Viết Feature test đảm bảo các logic sau chạy đúng:
- Giảng viên VIP active hiển thị đầu tiên ở `sort=newest` và `sort=popular`.
- Ở `sort=price_asc`/`price_desc`, giá thấp/cao vẫn xếp chuẩn bất kể ai là VIP.
- Giảng viên VIP nhưng đã hết hạn (expires_at < now) thì KHÔNG được ưu tiên.
- Giảng viên mua gói VIP lưu trữ (package_type = storage) KHÔNG được ưu tiên Top Search.
- Gõ search (không truyền sort) thì VIP vẫn được ưu tiên ở top 1.

### Kiểm thử Thủ công
1. Mở trang danh sách khóa học dành cho học viên `http://127.0.0.1:8000/courses`.
2. Kiểm tra lại việc đổi hàm `NOW()` trong raw SQL sang dùng `\Carbon\Carbon::now()` binding: Đảm bảo khi test ở môi trường Local hay Production khác múi giờ DB thì hệ thống vẫn nhận chuẩn xác giờ hiện tại thay vì bị lệch.
