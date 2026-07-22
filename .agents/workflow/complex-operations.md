# Tài Liệu Phân Tích Các Module Code Phức Tạp (Complex Operations)

Dự án này sử dụng kiến trúc **Domain-Driven Design (DDD)** kết hợp với **Service/Repository Pattern** rất chuyên nghiệp. Dưới đây là phân tích về các đoạn code và luồng xử lý phức tạp nhất trong hệ thống Backend (Laravel) này.

---

## 1. Xử Lý Thanh Toán (Payment Processing)
Vị trí: `app/Services/Finance/Payment/`

Hệ thống thanh toán được thiết kế với độ mở rộng cao, sử dụng nhiều Design Pattern:
- **Factory Pattern (`PaymentGatewayFactory.php`):** Dùng để khởi tạo cổng thanh toán động dựa trên lựa chọn của người dùng (Ví dụ: `VnpayGateway`, `StripeGateway`). Cả hai cổng này đều implement một `PaymentGatewayInterface` chung, giúp dễ dàng tích hợp thêm Momo, ZaloPay sau này mà không cần sửa code cũ.
- **Pipeline Pattern (`Pipes/Checkout`, `Pipes/Ipn`):** Quá trình Checkout (Thanh toán) được chia nhỏ thành các "Pipes" (ống dẫn). Ví dụ: Kiểm tra giỏ hàng -> Áp dụng mã giảm giá -> Trừ tiền ví -> Tạo Order -> Gọi cổng thanh toán. Điều này giúp chia nhỏ logic phức tạp thành các class độc lập, dễ test và bảo trì.

## 2. Upload Video Bằng Presigned URL (Direct to Cloud)
Vị trí: `app/Services/Seller/Courses/VideoService.php`

Thay vì upload file video nặng (có thể lên tới hàng GB) trực tiếp qua Server Laravel gây quá tải RAM và băng thông, hệ thống sử dụng cơ chế **Presigned URL**:
1. Frontend gửi yêu cầu xin URL tới `generatePresignedUrl`.
2. Backend giao tiếp với Cloud Storage (ở đây dùng **Cloudflare R2** tương thích với S3) tạo ra một link upload tạm thời có thời hạn (30 phút).
3. Frontend dùng link này để đẩy file thẳng lên R2.
4. Sau khi đẩy xong, Frontend gọi hàm `confirmDirectUpload` để backend lưu `r2_key` vào database.
*=> Tối ưu hóa cực tốt cho hệ thống EdTech có nhiều video.*

## 3. Xử Lý Bất Đồng Bộ (Asynchronous Jobs / Queues)
Vị trí: `app/Jobs/UpdateVideoProgressJob.php`

Trong quá trình học viên xem video, Frontend sẽ liên tục gửi request cập nhật tiến độ (progress). Nếu xử lý đồng bộ, Database sẽ bị "hành hạ" bởi hàng ngàn request mỗi giây.
- **Giải pháp:** Hệ thống đưa tiến trình này vào **Job Queue**. Khi user cập nhật tiến độ, request được phản hồi ngay lập tức, còn thao tác lưu trữ ghi vào DB sẽ được các "Worker" chạy ngầm xử lý sau (Background Processing).

## 4. Quản Lý Dữ Liệu Bằng DTO và Repository Pattern
Vị trí: `app/DTO/` và `app/Repositories/`
- **Data Transfer Object (DTO):** Các request thay vì truyền mảng dữ liệu lỏng lẻo (`$request->all()`) sẽ được map thành các Object cụ thể (như `ConfirmVideoUploadData`). Điều này đảm bảo **Type Hinting** và an toàn dữ liệu.
- **Repository Pattern:** Toàn bộ câu truy vấn (Query) tương tác với Eloquent Models (như `LessonVideoRepository`) được tách biệt hoàn toàn khỏi Service. Controller gọi Service -> Service xử lý Business Logic -> Service gọi Repository để lấy/ghi dữ liệu.

---
**Tổng kết:** Codebase được tổ chức theo tiêu chuẩn của một hệ thống Enterprise thu nhỏ. Việc phân tách logic rõ ràng giúp cho team nhiều người có thể làm việc chung mà không bị conflict, và dễ dàng scale server khi lượng user tăng cao.
