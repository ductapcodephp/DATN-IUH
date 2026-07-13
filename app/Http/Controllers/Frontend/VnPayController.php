<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VnPayController extends Controller
{
    /**
     * Tạo URL thanh toán VNPAY và trả về cho frontend
     */
    public function createPayment(Request $request)
    {
        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_Url = env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
        $vnp_Returnurl = route('frontend.vnpay.return');

        // Tạo mã đơn hàng ngẫu nhiên (nếu chưa có đơn hàng thật)
        $vnp_TxnRef = date("YmdHis"); 
        $vnp_OrderInfo = "Thanh toan don hang " . $vnp_TxnRef;
        $vnp_OrderType = "billpayment";
        
        // Mặc định lấy amount từ request, nếu không có thì set 10000. VNPAY yêu cầu nhân 100
        $amount = $request->input('amount', 10000);
        $vnp_Amount = $amount * 100; 
        
        $vnp_Locale = "vn";
        $vnp_BankCode = $request->input('bank_code', ''); 
        $vnp_IpAddr = $request->ip();

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        // Trả về JSON, FE (Inertia, React, Vue) sẽ dùng response này để redirect window.location.href = data.url
        return response()->json([
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        ]);
    }

    /**
     * Xử lý kết quả trả về từ VNPAY
     */
    public function vnpayReturn(Request $request)
    {
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');

        $inputData = array();
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);
        
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        
        if ($secureHash == $vnp_SecureHash) {
            if ($request->input('vnp_ResponseCode') == '00') {
                // Giao dịch thành công
                // TODO: Xử lý lưu database hoặc update status đơn hàng ở đây
                
                return redirect()->route('frontend.home')->with('success', 'Thanh toán thành công qua VNPAY.');
            } else {
                // Giao dịch lỗi
                return redirect()->route('frontend.home')->with('error', 'Thanh toán qua VNPAY bị lỗi hoặc đã hủy.');
            }
        } else {
            // Chữ ký không hợp lệ
            return redirect()->route('frontend.home')->with('error', 'Chữ ký VNPAY không hợp lệ.');
        }
    }
}
