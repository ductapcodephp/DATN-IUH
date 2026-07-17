# LUỒNG THANH TOÁN VNPAY VÀ TÍNH ĐA HÌNH (POLYMORPHISM)

Tài liệu này giải thích chi tiết về quy trình thanh toán qua cổng VNPAY trong dự án EduFlow, và cách ứng dụng "Tính đa hình" (Polymorphism) để một luồng xử lý duy nhất có thể phục vụ nhiều mục đích thanh toán khác nhau.

## 1. Tính Đa Hình trong Thanh Toán là gì?

Trong EduFlow, người dùng có thể thực hiện thanh toán qua VNPAY cho nhiều mục đích khác nhau:
1. **Mua một khóa học lẻ** (Course).
2. **Thanh toán giỏ hàng nhiều khóa học** (Cart/Order).
3. **Mua gói dịch vụ Seller** (Subscription - Pro/Business).
4. **Nạp tiền vào ví** (Wallet Deposit) (nếu có).

Nếu không dùng tính đa hình, sếp sẽ phải tạo ra 4 bảng giao dịch khác nhau (`course_transactions`, `cart_transactions`, `subscription_transactions`) và 4 luồng xử lý VNPAY IPN riêng biệt. Điều này khiến code bị lặp lại rất nhiều và rất khó bảo trì.

**Giải pháp (Tính Đa Hình):** 
Sử dụng **Polymorphic Relationships** của Laravel. Chúng ta chỉ dùng một bảng `transactions` duy nhất với 2 cột đặc biệt:
- `payable_type`: Lưu tên của Model đại diện cho loại đối tượng thanh toán (Ví dụ: `App\Models\Course` hoặc `App\Models\Subscription`).
- `payable_id`: Lưu ID của bản ghi tương ứng.

---

## 2. Cấu trúc Database (Bảng Transactions)

```sql
CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED, -- Người thực hiện thanh toán
    amount DECIMAL(15, 2),   -- Số tiền
    status VARCHAR(50),      -- pending, success, failed
    transaction_code VARCHAR(100), -- Mã tham chiếu gửi sang VNPAY (vnp_TxnRef)
    
    -- Hai cột Đa hình (Polymorphic Columns)
    payable_type VARCHAR(255), -- Ví dụ: 'App\Models\Course'
    payable_id BIGINT UNSIGNED, -- Ví dụ: 10 (ID khóa học)
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

Trong Eloquent Model `Transaction.php`, ta định nghĩa mối quan hệ:
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public function payable()
    {
        return $this->morphTo(); // Mối quan hệ đa hình
    }
}
```

---

## 3. Luồng Thanh Toán VNPAY (Workflow Step-by-Step)

### Bước 1: Khởi tạo thanh toán (Create Payment)
Khi người dùng bấm "Thanh toán", Controller sẽ tạo một bản ghi `Transaction` ở trạng thái `pending`. 
Hệ thống lấy thông tin đối tượng đang thanh toán để điền vào `payable_type` và `payable_id`. Sau đó, tạo URL VNPAY bằng cách sử dụng thư viện hoặc mã code tự viết, kèm theo `vnp_TxnRef` chính là mã giao dịch, và redirect người dùng sang VNPAY.

### Bước 2: Người dùng thanh toán trên VNPAY
Người dùng nhập thông tin thẻ, quét mã QR trên màn hình của cổng thanh toán VNPAY.

### Bước 3: VNPAY Callback (IPN - InterNet-Banking Payment Notification)
Sau khi thanh toán hoàn tất (thành công hoặc thất bại), VNPAY sẽ gọi ngầm về server EduFlow thông qua một API URL webhook (đã đăng ký trên VNPAY Merchant). URL này sẽ mang theo kết quả thanh toán.

### Bước 4: Xử lý Đa hình tại IPN Webhook
Đây là lúc "Tính Đa Hình" phát huy sức mạnh. Thay vì dùng khối lệnh `if-else` khổng lồ kiểm tra xem user vừa mua cái gì, hệ thống chỉ cần gọi `Transaction` và ủy quyền xử lý cho đối tượng.

```php
// Bên trong VnpayService hoặc IPN Controller
public function handleIPN(array $vnpayData)
{
    // 1. Tìm giao dịch qua mã tham chiếu vnp_TxnRef
    $transaction = Transaction::where('transaction_code', $vnpayData['vnp_TxnRef'])->first();
    
    // 2. Xác thực chữ ký VNPAY để chống giả mạo
    // ... logic verify signature
    
    // 3. Nếu giao dịch thành công
    if ($vnpayData['vnp_ResponseCode'] == '00' && $transaction->status !== 'success') {
        $transaction->update(['status' => 'success']);
        
        // --- SỰ KỲ DIỆU CỦA ĐA HÌNH NẰM Ở ĐÂY ---
        // $transaction->payable sẽ tự động trả về 1 instance của Course HOẶC Subscription
        // dựa vào payable_type đã lưu.
        $payableTarget = $transaction->payable; 
        
        // Chúng ta yêu cầu các đối tượng này đều implement một Interface chung, 
        // ví dụ: PayableContract có hàm fulfill()
        if ($payableTarget instanceof \App\Contracts\PayableContract) {
            $payableTarget->fulfill($transaction); 
        }
        // ----------------------------------------
        
        return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
    }
}
```

---

## 4. Triển khai Logic Nghiệp Vụ Cụ Thể (Fulfill)

Để luồng VNPAY không cần biết chi tiết bên trong sẽ làm gì (bảo đảm nguyên tắc Open/Closed), ta tạo ra một Interface.

**Interface:**
```php
namespace App\Contracts;
use App\Models\Transaction;

interface PayableContract {
    public function fulfill(Transaction $transaction): void;
}
```

**Model Course (Mua khóa học) thực thi Interface:**
```php
namespace App\Models;

use App\Contracts\PayableContract;
use Illuminate\Database\Eloquent\Model;

class Course extends Model implements PayableContract {
    
    public function fulfill(Transaction $transaction): void {
        // 1. Thêm user vào danh sách học viên của khóa học
        $this->students()->attach($transaction->user_id);
        
        // 2. Kích hoạt tính toán chia sẻ doanh thu theo gói của Seller
        // Bắn Event: CoursePurchased($this, $transaction)
        event(new \App\Events\CoursePurchased($this, $transaction));
    }
}
```

**Model Subscription (Mua gói Seller) thực thi Interface:**
```php
namespace App\Models;

use App\Contracts\PayableContract;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model implements PayableContract {

    public function fulfill(Transaction $transaction): void {
        $user = \App\Models\User::find($transaction->user_id);
        
        // 1. Cấp quyền Pro/Business cho Seller
        $user->update(['role' => 'seller_pro']);
        
        // 2. Gia hạn thời gian sử dụng thêm 30 ngày
        // ...
    }
}
```

---

## 5. Tóm lược Lợi ích

1. **Gọn gàng (Clean Code):** Không có những câu lệnh `if (type == 'course') { ... } else if (type == 'subscription') { ... }` dài lê thê trong Controller xử lý VNPAY.
2. **Dễ mở rộng (Scalability):** Tháng sau sếp muốn bán thêm "Vé xem Livestream", sếp chỉ cần tạo Model `Livestream` và cho nó `implements PayableContract`, viết hàm `fulfill()`. Code tích hợp VNPAY cũ **không cần sửa một dòng nào**.
3. **Tuân thủ Chuẩn mực (Design Patterns):** Kết hợp hoàn hảo giữa **Polymorphic Database Pattern** và **Strategy Pattern**.
