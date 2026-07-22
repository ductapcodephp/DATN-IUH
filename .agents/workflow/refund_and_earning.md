# WORKFLOW: HOÀN TIỀN VÀ GIẢI PHÓNG THU NHẬP (REFUND & SELLER EARNINGS RELEASE)

Workflow này mô tả chi tiết luồng nghiệp vụ xử lý hoàn tiền khóa học cho Học viên và giải phóng thu nhập cho Giảng viên.

## 1. Tác nhân tham gia (Actors)
- **Học viên (Student):** Người mua khóa học, có quyền yêu cầu hoàn tiền.
- **Hệ thống (EduFlow System):** Bao gồm Background Worker chạy Cronjob và API xử lý logic.
- **Giảng viên (Seller):** Người nhận doanh thu chia sẻ sau khi hết hạn refund.

## 2. Các quy tắc nghiệp vụ cốt lõi (Business Rules)
1. Thời hạn hoàn tiền: Tối đa 3 ngày kể từ khi thanh toán.
2. Điều kiện tiêu thụ: Tiến độ xem khóa học (`watched_seconds` / `total_duration_seconds`) phải dưới 15%.
3. Giới hạn lạm dụng: Một tài khoản Học viên chỉ được phép hoàn tiền tối đa 3 lần/tháng.
4. Giam thu nhập (Escrow): Thu nhập từ mỗi đơn hàng được lưu dưới dạng `pending` trong 3 ngày.
5. Giải phóng thu nhập: Tự động chạy mỗi đêm lúc 1:00 AM (`seller:release-earnings`) để chuyển tiền từ `pending` sang `available`.

## 3. Sơ đồ Luồng Hoàn Tiền (Refund Process Workflow)

```mermaid
sequenceDiagram
    participant S as Học viên
    participant API as API (RefundService)
    participant DB as Database
    participant W as Ví Giảng viên (Wallet)

    S->>API: Gửi Yêu cầu Hoàn tiền (Order ID)
    API->>DB: Truy vấn thông tin Order & User
    
    Note over API,DB: 1. Kiểm tra thời hạn 3 ngày
    alt Vượt quá 3 ngày
        API-->>S: Trả lỗi (Vượt quá thời hạn 3 ngày)
    else Trong 3 ngày
        API->>DB: Truy vấn bảng `course_progress`
        Note over API,DB: 2. Kiểm tra tiến độ học
        alt Tiến độ > 15%
            API-->>S: Trả lỗi (Đã học quá nhiều, chặn hoàn tiền)
        else Tiến độ <= 15%
            API->>DB: Đếm số lần Refund trong tháng
            Note over API,DB: 3. Kiểm tra số lần lạm dụng
            alt Vượt quá 3 lần/tháng
                API-->>S: Trả lỗi (Đạt giới hạn tháng, cảnh báo khóa tài khoản)
            else Thỏa mãn tất cả
                API->>DB: Bắt đầu DB Transaction
                DB->>DB: Cập nhật Order status = 'refunded'
                DB->>DB: Cập nhật CourseEnrollment is_banned = true
                DB->>W: Xóa giao dịch `pending` của Giảng viên (status = failed)
                DB-->>API: Transaction Commit
                API-->>S: Thông báo hoàn tiền thành công!
            end
        end
    end
```

## 4. Sơ đồ Luồng Giải phóng Thu nhập (Release Earnings Workflow)

Quá trình giải phóng doanh thu diễn ra âm thầm, không cần tương tác của người dùng.

```mermaid
sequenceDiagram
    participant Cron as Cronjob (Laravel Scheduler)
    participant Cmd as ReleaseSellerEarnings
    participant DB as Database
    participant W as Seller Wallet

    Cron->>Cmd: Kích hoạt lúc 01:00 AM hàng ngày
    Cmd->>DB: Truy vấn wallet_transactions (type=earning, status=pending)
    
    loop Duyệt qua từng giao dịch pending
        Cmd->>DB: Lấy thông tin đơn hàng gốc (Order)
        alt Order bị Refunded (status == 'refunded')
            Cmd->>DB: Cập nhật transaction status = 'failed'
            Note right of Cmd: Giao dịch bị hủy do học viên đã hoàn tiền
        else Order hợp lệ
            Note right of Cmd: Kiểm tra ngày tạo (>= 3 ngày)
            alt Đã đủ 3 ngày chờ
                Cmd->>DB: Bắt đầu DB Transaction
                DB->>DB: Cập nhật transaction status = 'completed'
                DB->>W: Trừ `balance_pending` và Cộng `balance_available`
                DB-->>Cmd: Commit Transaction
                Note right of Cmd: Tiền đã sẵn sàng để Giảng viên rút
            end
        end
    end
    Cmd-->>Cron: Kết thúc phiên làm việc
```
