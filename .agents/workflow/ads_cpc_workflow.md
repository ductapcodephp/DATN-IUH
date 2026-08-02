# QUY TRÌNH HỆ THỐNG QUẢNG CÁO CPC (COST PER CLICK)

## 1. MỤC ĐÍCH
Tối đa hóa doanh thu của hệ thống bằng cách cho phép hàng trăm Seller cùng đấu giá để hiển thị Khóa học của họ trên 5 vị trí nổi bật (Featured Slots) ở Trang chủ, thay vì bán đứt vị trí này.

## 2. DATABASE SCHEMA
Bảng `course_ads` lưu trữ chiến dịch quảng cáo của từng khóa học:
- `course_id`: ID khóa học.
- `bid_price`: Số tiền tối đa Seller sẵn sàng trả cho 1 Click (Tối thiểu theo cấu hình Admin).
- `daily_budget`: Ngân sách tối đa một ngày (Tối thiểu theo cấu hình Admin).
- `campaign_balance`: Số dư hiện tại của chiến dịch (Nạp từ Wallet sang).
- `spent_today`: Số tiền đã tiêu trong ngày hôm nay. Reset về 0 mỗi ngày.
- `clicks`: Tổng số click kiếm được.
- `impressions`: (Optional) Lượt hiển thị.
- `status`: 'active' (đang chạy), 'paused' (tạm dừng), 'out_of_budget' (hết ngân sách/tiền nạp).

## 3. LUỒNG NGƯỜI BÁN (SELLER WORKFLOW)
### Bước 3.1: Nạp tiền
1. Seller chọn "Đăng ký ADS".
2. Seller cấu hình Giá thầu (Bid) và Ngân sách ngày.
3. Nếu `campaign_balance` hết, Seller bấm "Nạp tiền".
4. Hệ thống trừ tiền từ bảng `wallets` của Seller.
5. Ghi log vào `wallet_transactions` với type = `ad_topup`.
6. Cộng số tiền tương ứng vào `course_ads.campaign_balance`.
7. Cập nhật `status = 'active'`.

## 4. LUỒNG THUẬT TOÁN XOAY VÒNG (WEIGHTED RANDOM)
Tại `HomeRepository.php` -> `getVipCourses()`:
- Điều kiện lọc: Khóa học đã Xuất bản, Ad có status = `active` và `spent_today < daily_budget`.
- Sắp xếp (Sort): Dùng thuật toán `ORDER BY (RAND() * course_ads.bid_price) DESC LIMIT 5`.
- Giải thích: Không lấy tuyệt đối 5 khóa bid cao nhất (vì sẽ làm nản lòng người mới). Thay vào đó, mỗi người sẽ quay ngẫu nhiên 1 số từ 0 -> 1, rồi nhân với Giá thầu của mình để ra Điểm.
- Điểm này đảm bảo người bid cao sẽ lọt Top thường xuyên hơn (VD: 80% thời gian), nhưng người bid thấp vẫn có cơ hội lọt Top (VD: 20%), tạo nên trang chủ liên tục thay đổi sinh động.

## 5. LUỒNG TRACKING VÀ TRỪ TIỀN
Tại `FeaturedCourses.jsx`:
- Nếu Khóa học có `ad_id`, Link Click không trỏ thẳng vào Detail Khóa Học, mà trỏ tới `/ads/click/{ad_id}`.

Tại `AdTrackingController`:
1. Nhận request, kiểm tra khóa quảng cáo.
2. Mở DB Transaction.
3. Nếu status = `active` và `campaign_balance` > 0:
   - Trừ tiền: `campaign_balance -= bid_price`.
   - Tăng tiền tiêu: `spent_today += bid_price`.
   - Nếu `campaign_balance <= 0` hoặc `spent_today >= daily_budget`, cập nhật status thành `out_of_budget`.
4. Chuyển hướng người dùng về trang `/course/{slug}` thật sự.

## 6. LUỒNG CRONJOB DỌN DẸP & RESET ĐÊM
Tại `routes/console.php` lúc 00:00 mỗi ngày:
- Thực hiện Reset `spent_today` về 0 cho tất cả quảng cáo.
- Dùng SQL tính toán lại status: `IF(campaign_balance > 0, 'active', 'out_of_budget')` để kích hoạt lại các chiến dịch đã dừng vì max daily_budget ngày hôm trước.
