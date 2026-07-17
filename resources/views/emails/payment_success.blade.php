<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận thanh toán thành công</title>
    <style>
        /* 
           LƯU Ý: Email Client (Gmail, Outlook) cực kỳ kén CSS. 
           Không dùng được Grid, Flexbox hỗ trợ kém, Animations (@keyframes) bị chặn. 
           Bắt buộc dùng Table và Inline/Internal CSS cơ bản nhưng tối ưu tinh tế.
        */
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            min-height: 100vh;
            table-layout: fixed;
            background-color: #f3f4f6;
            padding-top: 40px;
            padding-bottom: 40px;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .main-container {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 10;
        }
        /* Header có Gradient xịn xò */
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            color: #e0e7ff;
            margin: 10px 0 0 0;
            font-size: 15px;
        }
        /* Body content */
        
        /* Chìu sếp 100%: Minions chạy tung tăng quanh viền Mail */
        @keyframes minionRunAround {
            0% { top: -60px; left: -60px; transform: scaleX(1); }
            24% { top: -60px; left: 100%; transform: scaleX(1); }
            25% { top: -60px; left: 100%; transform: scaleX(-1); }
            49% { top: 100%; left: 100%; transform: scaleX(-1); }
            50% { top: 100%; left: 100%; transform: scaleX(1); }
            74% { top: 100%; left: -60px; transform: scaleX(1); }
            75% { top: 100%; left: -60px; transform: scaleX(-1); }
            99% { top: -60px; left: -60px; transform: scaleX(-1); }
            100% { top: -60px; left: -60px; transform: scaleX(1); }
        }
        
        .minion-runner {
            position: absolute;
            width: 80px;
            height: 80px;
            z-index: 99;
            animation: minionRunAround 12s linear infinite;
            pointer-events: none;
            /* Đổ bóng cho giống 3D bay lơ lửng */
            filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3));
        }
        
        .content {
            padding: 35px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 25px;
            font-weight: 600;
        }
        .message {
            font-size: 15px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        /* Bảng hóa đơn */
        .receipt-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .receipt-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 1px;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .receipt-table {
            width: 100%;
            border-collapse: collapse;
        }
        .receipt-table td {
            padding: 12px 0;
            border-bottom: 1px dashed #cbd5e1;
            color: #334155;
            font-size: 15px;
        }
        .receipt-table tr:last-child td {
            border-bottom: none;
        }
        .receipt-table .item-name {
            font-weight: 500;
            padding-right: 15px;
        }
        .receipt-table .item-price {
            text-align: right;
            font-weight: 600;
            white-space: nowrap;
        }
        .total-row {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }
        /* Nút Call-to-action */
        .cta-container {
            text-align: center;
            margin: 40px 0 20px 0;
        }
        .btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 36px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        /* Footer */
        .footer {
            background-color: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 0;
            color: #94a3b8;
            font-size: 13px;
            line-height: 1.5;
        }
        .social-links {
            margin-top: 15px;
        }
        .social-links a {
            color: #64748b;
            text-decoration: none;
            margin: 0 8px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main-container">
            <!-- Đội quân Minions chạy vòng quanh khối Mail -->
            <img src="https://i.pinimg.com/originals/30/ee/d8/30eed800dfa42a0339d1b091fcf3b0bc.gif" alt="Minion Running" class="minion-runner">
            
            <!-- Header -->
            <div class="header" style="border-radius: 16px 16px 0 0;">
                <div class="header-icon" style="font-size: 50px; margin-bottom: 10px; display: inline-block; animation: phoenixWrap 3s infinite;">🎓</div>
                <h1 style="position: relative; z-index: 2;">Thanh toán thành công!</h1>
                <p style="position: relative; z-index: 2;">Mã giao dịch: #{{ $payments->first()->transaction_code ?? 'VNPAY_XXXXX' }}</p>
            </div>

            <!-- Body -->
            <div class="content">
                <div class="greeting">Chào {{ $user->name }},</div>
                <div class="message">
                    Cảm ơn bạn đã tin tưởng và lựa chọn nền tảng giáo dục EduFlow. Giao dịch mua khóa học của bạn đã được xử lý hoàn tất. Khóa học đã được mở khóa tự động vào tài khoản của bạn.
                </div>

                <!-- Receipt -->
                <div class="receipt-box">
                    <div class="receipt-title">Chi tiết đơn hàng</div>
                    <table class="receipt-table">
                        @php $total = 0; @endphp
                        @foreach($payments as $payment)
                            @php $total += $payment->amount; @endphp
                            <tr>
                                <td class="item-name">📚 {{ $payment->order->course->title ?? 'Khóa học lập trình' }}</td>
                                <td class="item-price">{{ number_format($payment->amount, 0, ',', '.') }} đ</td>
                            </tr>
                        @endforeach
                    </table>
                    
                    <div class="total-row">
                        <span>Tổng cộng:</span>
                        <span style="color: #4f46e5;">{{ number_format($total, 0, ',', '.') }} đ</span>
                    </div>
                </div>

                <div class="message" style="text-align: center; margin-bottom: 0;">
                    Hãy bắt đầu hành trình nâng cấp bản thân ngay bây giờ!
                </div>

                <!-- CTA Button -->
                <div class="cta-container">
                    <a href="{{ config('app.url') }}/tech-education/home" class="btn">🚀 Vào Lớp Học Ngay</a>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>EduFlow - Nền tảng học trực tuyến chất lượng cao</p>
                <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ <a href="mailto:support@eduflow.vn" style="color:#4f46e5; text-decoration:none;">support@eduflow.vn</a></p>
                <div class="social-links">
                    <a href="#">Website</a> • <a href="#">Facebook</a> • <a href="#">Youtube</a>
                </div>
            </div>

        </div>
    </div>
</body>
</html>
