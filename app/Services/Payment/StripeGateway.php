<?php

namespace App\Services\Payment;

use Illuminate\Http\Request;

class StripeGateway implements PaymentGatewayInterface
{
    public function getPaymentUrl(float $amount, string $transactionCode): string
    {
        $secretKey = env('STRIPE_SECRET');
        
        if (empty($secretKey)) {
            throw new \Exception('Chưa cấu hình STRIPE_SECRET trong file .env');
        }

        $response = \Illuminate\Support\Facades\Http::withToken($secretKey)
            ->asForm()
            ->post('https://api.stripe.com/v1/checkout/sessions', [
                'payment_method_types' => ['card'],
                'mode' => 'payment',
                'client_reference_id' => $transactionCode,
                'success_url' => route('frontend.payment.return', [
                    'gateway' => 'stripe',
                    'transaction_code' => $transactionCode,
                    'status' => 'success'
                ]),
                'cancel_url' => route('frontend.cart.index', [
                    'gateway' => 'stripe',
                    'transaction_code' => $transactionCode,
                    'status' => 'failed'
                ]),
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'vnd',
                            'product_data' => [
                                'name' => 'Thanh toán đơn hàng #' . $transactionCode,
                            ],
                            'unit_amount' => (int) $amount,
                        ],
                        'quantity' => 1,
                    ],
                ],
            ]);

        if ($response->successful()) {
            return $response->json('url');
        }

        throw new \Exception('Lỗi tạo link thanh toán Stripe: ' . $response->body());
    }

    public function handleCallback(Request $request): array
    {
        if ($request->isMethod('post') && $request->has('type')) {
            $payload = $request->all();
            
            if ($payload['type'] === 'checkout.session.completed') {
                $session = $payload['data']['object'];
                
                return [
                    'status' => 'success',
                    'transaction_code' => $session['client_reference_id'] ?? null,
                    'gateway_transaction_id' => $session['payment_intent'] ?? $session['id'],
                    'raw_response' => $payload,
                ];
            }
            
            return [
                'status' => 'failed',
                'transaction_code' => $payload['data']['object']['client_reference_id'] ?? null,
                'gateway_transaction_id' => null,
                'raw_response' => $payload,
            ];
        }

        $status = $request->input('status') === 'success' ? 'success' : 'failed';
        
        return [
            'status' => $status,
            'transaction_code' => $request->input('transaction_code'),
            'gateway_transaction_id' => null,
            'raw_response' => $request->all(),
        ];
    }
}
