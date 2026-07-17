# LUỒNG THANH TOÁN VNPAY THỰC TẾ TRONG MÃ NGUỒN (CURRENT FLOW)

Tài liệu này giải thích chi tiết toàn bộ luồng đi của dữ liệu từ lúc bấm thanh toán trên màn hình Frontend cho đến khi tiền về và khóa học được mở, dựa trên đúng **source code hiện tại** của hệ thống.

*Lưu ý: Trong mã nguồn hiện tại, hệ thống **chưa sử dụng** tính đa hình (Polymorphism). Bảng `online_payments` đang khóa cứng cột `order_id` liên kết trực tiếp với bảng `orders`.*

---

## Bước 1: Khởi nguồn từ Frontend (React/Inertia)
- Học viên vào trang Giỏ hàng (Cart) và bấm nút **"Thanh toán"**.
- Trình duyệt bắn một HTTP POST request đến route `/tech-education/checkout/process` (tên route: `frontend.checkout.process`).
- Request này mang theo các dữ liệu cần thiết từ phiên làm việc (như mã giảm giá đang áp dụng).

## Bước 2: Tiếp nhận tại `PaymentController`
**File:** `app/Http/Controllers/Frontend/PaymentController.php` (Hàm `process`)

- Controller chỉ làm nhiệm vụ "Lễ tân":
  1. Lấy thông tin `user_id` hiện tại.
  2. Xác định phương thức thanh toán (gateway mặc định đang là `vnpay`).
  3. Gọi hàm `processCheckout()` của tầng Service để xử lý nghiệp vụ.

## Bước 3: Xử lý nghiệp vụ tại `PaymentService` (Lưu Database)
**File:** `app/Services/Payment/PaymentService.php` (Hàm `processCheckout`)

Đây là trung tâm xử lý dữ liệu. Hệ thống sẽ làm các việc sau:
1. **Lấy giỏ hàng & Tính tiền**: Kiểm tra trong database/session giỏ hàng của user, cộng tổng tiền các khóa học và trừ đi số tiền được giảm giá (nếu có coupon), tính ra biến `$totalAmount`.
2. **Sinh mã giao dịch gốc**: Tạo tự động một chuỗi mã giao dịch độc nhất (Ví dụ: `VNPAY_1690001111_A1B2C`).
3. **Lưu trữ xuống DB (Tạo Đơn hàng pending)**:
   - Hệ thống lặp qua từng khóa học trong giỏ hàng.
   - Với mỗi khóa học, tạo một bản ghi `Order` với trạng thái `pending`.
   - Ngay sau đó, tạo một bản ghi `OnlinePayment` (với `order_id` nối trực tiếp đến Order vừa tạo). Cột `transaction_code` được gán bằng mã gốc thêm hậu tố (VD: `VNPAY_...-1`). Trạng thái payment cũng là `pending`.
4. **Gọi Gateway**: Truyền tổng tiền `$totalAmount` và mã `$transactionCode` gốc sang lớp `VnpayGateway`.

## Bước 4: Tạo Link Thanh Toán tại `VnpayGateway`
**File:** `app/Services/Payment/VnpayGateway.php` (Hàm `getPaymentUrl`)

- Hệ thống nạp các cấu hình bảo mật từ file `.env` (như `vnp_TmnCode`, `vnp_HashSecret`).
- Định dạng lại số tiền (phải nhân 100 theo chuẩn hệ thống VNPAY).
- **Ký điện tử**: Tạo một mã băm (`vnp_SecureHash`) dùng thuật toán `hash_hmac('sha512', ...)` để đảm bảo dọc đường không ai có thể can thiệp sửa đổi số tiền.
- Trả về nguyên 1 chuỗi URL dài dẫn tới hệ thống thanh toán của VNPAY.

## Bước 5: Chuyển hướng người dùng (Redirect)
- Sau khi nhận được URL từ Service, `PaymentController` dùng lệnh `Inertia::location($paymentUrl)` để cưỡng chế trình duyệt của người dùng thoát khỏi web EduFlow và nhảy sang trang của VNPAY.
- Học viên tiến hành quẹt thẻ, quét mã QR trên hệ thống VNPAY.

## Bước 6: VNPAY Callback trả kết quả (Return IPN)
- Sau khi giao dịch kết thúc (thành công hoặc thất bại), VNPAY tự động chuyển hướng người dùng quay trở lại trang web của ta thông qua URL đã đăng ký: `GET /tech-education/payment/vnpay/return`.
- Lệnh này mang theo các tham số kết quả trên thanh địa chỉ URL (như mã lỗi `vnp_ResponseCode`, mã giao dịch `vnp_TxnRef`).
- Route này đưa request vào hàm `gatewayReturn()` trong `PaymentController`.

## Bước 7: Xác thực Chữ Ký và Trả Khóa Học
- **Kiểm tra an ninh**: `PaymentController` khởi tạo lại `VnpayGateway` và gọi hàm `handleCallback()`. Hệ thống lấy `vnp_HashSecret` để băm lại các tham số VNPAY vừa gửi về. Nếu chuỗi băm khớp với chữ ký của VNPAY, chứng tỏ đây là giao dịch thật, không phải hacker giả mạo gọi API.
- **Mở khóa học**: Sau khi an toàn, code gọi `PaymentService->handleGatewayReturn()`.
  1. Dùng mã `vnp_TxnRef` tìm kiếm (`LIKE`) các bản ghi `OnlinePayment` vừa tạo ở Bước 3.
  2. Nếu VNPAY báo thành công (`ResponseCode == '00'`), hệ thống cập nhật `status` của `online_payments` và `orders` thành `completed`.
  3. Ghi lại mã `gateway_transaction_id` thực tế từ ngân hàng.
  4. Tạo bản ghi vào bảng `course_enrollments` để chính thức cấp quyền cho học viên vào học.
  5. Dọn dẹp (Xóa sạch giỏ hàng, xóa mã giảm giá).
- **Kết thúc**: Redirect học viên về trang chủ kèm thông báo "Thanh toán thành công".

---

**TÓM TẮT ĐỂ DỄ NHỚ:**
1. Khách bấm nút -> FE gọi BE.
2. BE tạo Đơn Hàng (Order) nháp -> Sinh ra link có gắn khóa bảo mật -> Đá khách sang VNPAY.
3. Khách trả tiền xong -> VNPAY đá khách về lại BE kèm tin nhắn.
4. BE kiểm tra tin nhắn xem có bị làm giả không -> Báo thành công thì gạch nợ Đơn hàng -> Cấp khóa học.
