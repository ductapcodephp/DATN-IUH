# MÔ HÌNH DOANH THU & KẾ HOẠCH PHÂN CHIA (REVENUE & BUSINESS MODEL)

Tài liệu này quy định chi tiết về luồng dòng tiền, các gói dịch vụ cho Giảng viên (Seller), cơ chế hoa hồng, tiếp thị liên kết (Affiliate) và các chính sách vận hành của nền tảng EduFlow. (Đã tối ưu cho mô hình Startup).

---

## 1. NGUỒN THU CỦA WEBSITE

**✅ Nguồn thu chính:**
1. Hoa hồng chiết khấu trên mỗi lượt bán khóa học thành công.
2. Tiền đăng ký gói Seller (Pro, Business).
3. Tiền bán quảng cáo (Banner, Slot khóa học nổi bật).
4. Chiết khấu Affiliate (Tiếp thị liên kết).

**❌ KHÔNG thu phí các hạng mục sau (để thu hút giảng viên):**
- Không thu phí Upload video.
- Không thu phí lưu trữ Cloud (R2).
- Không thu phí tạo/đăng khóa học.
*(Lưu ý: Có chính sách sử dụng hợp lý (Fair-use) để tránh việc Seller dùng nền tảng làm ổ đĩa lưu trữ cá nhân).*

---

## 2. CHÍNH SÁCH HOA HỒNG & GÓI SELLER (STARTUP MODEL)

Thay vì chỉ có Free -> Pro -> Premium rất nặng nề, mô hình được tinh chỉnh để dễ tiếp cận khách hàng hơn, chia thành 3 gói:

| Gói Seller | Phí duy trì | Phí sàn (Hoa hồng) | Đối tượng phù hợp | Quyền lợi đi kèm |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | **0đ** | **15%** | Giảng viên mới, muốn thử nghiệm | Tính năng cơ bản |
| **Pro** | **199.000đ/tháng** | **10%** | Giảng viên có doanh thu ổn định | Huy hiệu Pro, Hiển thị ưu tiên, Thống kê nâng cao, Hỗ trợ nhanh |
| **Business**| **499.000đ/tháng** | **7%** | Trung tâm, Giảng viên lớn | Top search, Banner riêng, Badge Premium, Thống kê AI, CSKH riêng |

**Ví dụ bài toán bán khóa học 500.000đ (Chưa tính phí cổng thanh toán):**
- **Gói Free (15%):** Nền tảng nhận `75.000đ` | Seller nhận `425.000đ`
- **Gói Pro (10%):** Nền tảng nhận `50.000đ` | Seller nhận `450.000đ`
- **Gói Business (7%):** Nền tảng nhận `35.000đ` | Seller nhận `465.000đ`

---

## 3. LUỒNG TIỀN (MONEY FLOW) VÀ RÚT TIỀN

Tất cả tiền học viên nạp vào sẽ chảy vào Ví hệ thống (System Wallet) trước, sau đó tự động phân chia.

**Quy trình chia tiền:**
1. **Khách hàng thanh toán:** 1.000.000đ (Ví dụ qua VNPAY).
2. **Trừ phí cổng thanh toán:** VNPAY trừ phí 1% = 10.000đ. Nền tảng nhận thực: 990.000đ.
3. **Phân chia doanh thu (Ví dụ Seller Free - 15%):**
   - Phí sàn (15% của 990k): `148.500đ` (Doanh thu của Admin).
   - Chuyển vào Ví Seller: `841.500đ`.
4. **Rút tiền & Xử lý Race Condition:**
   - Khi Ví Seller đủ hạn mức (vd: 2.350.000đ), Seller gửi "Yêu cầu rút tiền".
   - **Lưu ý Kỹ thuật (Race Condition):** Phải sử dụng khóa bi quan (`lockForUpdate()`) trong Laravel khi trừ tiền ví để tránh lỗi Seller spam request rút tiền cùng lúc làm x2 lệnh rút hợp lệ.
   - Admin duyệt yêu cầu -> Chuyển khoản ngân hàng thực tế -> Trừ số dư Ví Seller về 0.

> [!WARNING]
> **Quy định kiểu dữ liệu tiền tệ:**
> Mọi số tiền lưu trong Database TUYỆT ĐỐI không dùng `FLOAT` hay `DOUBLE` để tránh sai số thập phân khi tính % chiết khấu. Phải sử dụng kiểu `DECIMAL(15,2)` hoặc lưu số tiền ở đơn vị nhỏ nhất (Đồng) dưới dạng `BIGINT`.

---

## 4. TIẾP THỊ LIÊN KẾT & MÃ GIỚI THIỆU (AFFILIATE MARKETING)

Chính sách này nhằm tận dụng học viên cũ và giảng viên đi bán chéo khóa học cho nền tảng.

**Kịch bản 1: Học viên / Seller A giới thiệu người B mua khóa học (Bất kỳ)**
- Người B nhập Mã giới thiệu của A và mua khóa học giá 500.000đ.
- A nhận hoa hồng Affiliate (ví dụ 5% = 25.000đ). Tiền này được cộng thẳng vào ví của A.
- Phí 25.000đ này được trích từ phần doanh thu của Seller khóa học đó (hoặc từ phần của Admin, tùy cấu hình tỷ lệ hệ thống, hiện tại quy định: Seller vẫn nhận đúng % theo gói, Admin sẽ trích lợi nhuận chia cho Affiliate).

**Kịch bản 2: Tự Seller dùng mã giới thiệu để bán CHÍNH khóa học của mình**
- Nếu Seller tự kéo được khách bên ngoài vào web mua khóa học của mình bằng mã riêng (REF-SELLER).
- Nền tảng áp dụng mức phí sàn cực thấp (Ví dụ chỉ thu 3% thay vì 15% như thông thường, chỉ để bù đắp phí server và VNPAY).
- Mục đích: Kích thích Seller tự bỏ tiền chạy quảng cáo mang học viên về nền tảng.

---

## 5. CƠ CHẾ HOÀN TIỀN (REFUND POLICY)

Để bảo vệ quyền lợi học viên, hệ thống cung cấp chính sách hoàn tiền trong vòng X ngày (ví dụ 7 ngày).

**Ví dụ quy trình:**
- Ngày 1: Bán được khóa 500k -> Seller (Free) được cộng `425.000đ` vào Ví.
- Ngày 5: Khách hàng Yêu cầu Hoàn tiền (Refund) và được duyệt.
- Xử lý hệ thống:
  - Admin hoàn trả `500.000đ` cho khách.
  - Hệ thống tự động **TRỪ 425.000đ** từ Ví của Seller.
- **Xử lý nợ (Ví âm):**
  - Nếu trước đó Seller đã rút sạch tiền, Ví của Seller sẽ bị âm (`-425.000đ`).
  - Seller không thể rút thêm tiền, và mọi doanh thu phát sinh sau đó sẽ được đắp vào khoản âm này cho đến khi Ví lớn hơn 0 mới được rút tiếp.

---

## 6. DỊCH VỤ GIÁ TRỊ GIA TĂNG (QUẢNG CÁO NỘI BỘ)

Đây là nguồn doanh thu thuần của nền tảng, không chia sẻ với ai.
1. **Banner quảng cáo (Trang chủ/Dashboard):**
   - 7 ngày: `200.000đ`
   - 30 ngày: `600.000đ`
2. **Gắn Tag Khóa học nổi bật (Top List):**
   - Ưu tiên Top Trang chủ: `150.000đ/tuần`.
   - Ưu tiên Top Danh mục (Category): `80.000đ/tuần`.

---

## 7. CHÍNH SÁCH QUẢN LÝ TÀI NGUYÊN & NỘI DUNG (CHỐNG LẠM DỤNG R2)

1. **Xóa khóa học:**
   - **Tuyệt đối KHÔNG cho phép Xóa** khóa học nếu đã có học viên mua và đang học.
   - Nếu Seller không muốn bán nữa: Chỉ cho phép chuyển trạng thái sang **Ngừng bán / Ẩn khóa học** (Unpublish). Người đã mua vẫn được quyền truy cập học bình thường vĩnh viễn.
2. **Dung lượng & Lưu trữ Video (Cloud R2):**
   - Không giới hạn dung lượng tổng, nhưng giới hạn dung lượng **tối đa 2GB/file**.
   - Chỉ được phép Upload video dùng cho mục đích bài giảng. Nghiêm cấm sử dụng Cloud R2 của hệ thống như ổ đĩa lưu trữ cá nhân (Google Drive riêng).
   - **Cơ chế kiểm soát tự động:** Hệ thống có Script đếm tổng băng thông (Bandwidth) stream của video. Nếu phát hiện Video đã được upload lên 2 tháng mà số lượt play = 0 (tức là không được đưa vào bất kỳ bài giảng nào), hệ thống sẽ tự động **cắm cờ (Flag)** cảnh báo cho Admin để kiểm tra và xử lý vi phạm.

---

## 8. SCALE HỆ THỐNG (CHỊU TẢI)
1. **Số lượng người & Hành vi:**
   - Hệ thống scale cho khoảng 20 nghìn người sử dụng. Giờ cao điểm sẽ là 19h-23h, ước lượng khoảng 67-70% số lượng người dùng sẽ online.
2. **Giải pháp Caching (Bắt buộc):**
   - Trong giờ cao điểm, các tính năng gọi query nặng như "Gắn Tag Khóa học nổi bật" (`ORDER BY is_top DESC`) trên Trang chủ và Trang Danh mục sẽ làm nghẽn cổ chai DB.
   - **Bắt buộc áp dụng Redis Cache** để lưu trữ danh sách khóa học đã sắp xếp sẵn. Chỉ load lại từ Database và nạp vào Redis khi có biến động thực tế (ví dụ: Seller mua thêm gói QC, có khóa học mới).