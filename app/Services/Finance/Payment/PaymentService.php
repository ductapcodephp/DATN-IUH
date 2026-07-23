<?php

namespace App\Services\Finance\Payment;

use App\DTO\Payment\CheckoutData;
use App\DTO\Payment\IpnData;
use App\Exceptions\PaymentException;
use App\Models\OnlinePayment;
use App\Models\Wallet;
use App\Services\Finance\Payment\Pipes\Checkout\ApplyCoupons;
use App\Services\Finance\Payment\Pipes\Checkout\CalculateTotal;
use App\Services\Finance\Payment\Pipes\Checkout\CreateOnlinePayment;
use App\Services\Finance\Payment\Pipes\Checkout\CreateOrders;
use App\Services\Finance\Payment\Pipes\Checkout\ValidateCart;
use App\Services\Finance\Payment\Pipes\Ipn\CompleteDepositPayment;
use App\Services\Finance\Payment\Pipes\Ipn\CompleteOrderPayment;
use App\Services\Finance\Payment\Pipes\Ipn\HandleFailedPayment;
use App\Services\Finance\Payment\Pipes\Ipn\ValidateIpnPayment;
use Exception;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function processCheckout(CheckoutData $data): string
    {
        DB::beginTransaction();
        try {
            /** @var CheckoutData $data */
            $data = app(Pipeline::class)
                ->send($data)
                ->through([
                    ValidateCart::class,
                    ApplyCoupons::class,
                    CalculateTotal::class,
                    CreateOnlinePayment::class,
                    CreateOrders::class,
                ])
                ->thenReturn();

            if ($data->gatewayName === 'wallet') {
                $wallet = Wallet::where('user_id', $data->userId)->lockForUpdate()->first();
                if (! $wallet || $wallet->balance_available < $data->finalAmount) {
                    throw new Exception('Số dư ví không đủ. Vui lòng nạp thêm tiền!');
                }

                // Deduct from wallet
                $wallet->withdraw($data->finalAmount, 'Thanh toán đơn hàng '.$data->transactionCode);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }

        if ($data->gatewayName === 'wallet') {
            // Run IPN pipeline manually to complete the order and split revenue
            $ipnData = new IpnData($data->onlinePayment, [
                'status' => 'success',
                'gateway_transaction_id' => 'WALLET_'.time(),
                'raw_response' => 'Wallet internal payment',
            ]);
            $this->handleGatewayIpn('wallet', $ipnData);

            // Redirect to success page or cart with success flag (let frontend handle the redirect or we can redirect to a specific success route)
            return url('/?payment=success');
        }

        $gateway = PaymentGatewayFactory::create($data->gatewayName);

        return $gateway->getPaymentUrl($data->finalAmount, $data->transactionCode);
    }

    public function handleGatewayIpn(string $gatewayName, IpnData $data): bool
    {

        return DB::transaction(function () use ($data) {
            /** @var IpnData $data */
            $data = app(Pipeline::class)
                ->send($data)
                ->through([
                    ValidateIpnPayment::class,
                    CompleteDepositPayment::class,
                    CompleteOrderPayment::class,
                    HandleFailedPayment::class,
                ])
                ->thenReturn();

            return $data->isSuccess;
        });
    }

    public function handleGatewayReturn(string $gatewayName, array $callbackData): bool
    {
        if (isset($callbackData['status']) && $callbackData['status'] === 'invalid_signature') {
            throw new PaymentException('Chữ ký không hợp lệ.', PaymentException::INVALID_SIGNATURE);
        }

        $txnRef = $callbackData['transaction_code'] ?? null;
        if (! $txnRef) {
            throw new Exception('Không tìm thấy mã giao dịch gốc.');
        }

        $payment = OnlinePayment::where('transaction_code', $txnRef)->first();

        if (! $payment) {
            throw new Exception('Không tìm thấy giao dịch trong hệ thống.');
        }

        // Nếu IPN chưa xử lý kịp thì chạy bổ sung
        if ($payment->status === 'pending') {
            try {
                $ipnDto = IpnData::fromCallback($callbackData);
                $this->handleGatewayIpn($gatewayName, $ipnDto);
            } catch (PaymentException $e) {
                \Log::error('Payment Exception in Return: '.$e->getMessage());
                throw $e;
            } catch (Exception $e) {
                \Log::error('Exception in Return: '.$e->getMessage());
                throw $e;
            }
        }

        $payment->refresh();

        if ($payment->status === 'completed') {
            session()->forget('applied_coupons');

            return true;
        }

        return false;
    }
}
