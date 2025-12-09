<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PhonePeService
{
    private string $merchantId;
    private string $saltKey;
    private int $saltIndex;
    private string $apiUrl;

    public function __construct()
    {
        $this->merchantId = config('services.phonepe.merchant_id');
        $this->saltKey = config('services.phonepe.salt_key');
        $this->saltIndex = config('services.phonepe.salt_index', 1);
        $this->apiUrl = config('services.phonepe.api_url');
    }

    public function initiatePayment(string $orderId, int $amount, string $redirectUrl): array
    {
        $data = [
            'merchantId' => $this->merchantId,
            'merchantTransactionId' => $orderId,
            'merchantUserId' => 'MUID' . time(),
            'amount' => $amount,
            'redirectUrl' => $redirectUrl,
            'redirectMode' => 'POST',
            'callbackUrl' => $redirectUrl,
            'paymentInstrument' => [
                'type' => 'PAY_PAGE'
            ]
        ];

        $encode = base64_encode(json_encode($data));
        $string = $encode . '/pg/v1/pay' . $this->saltKey;
        $sha256 = hash('sha256', $string);
        $xVerify = $sha256 . '###' . $this->saltIndex;

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-VERIFY' => $xVerify,
        ])->post($this->apiUrl . '/pg/v1/pay', [
            'request' => $encode
        ]);

        $result = $response->json();

        if (isset($result['success']) && $result['success'] && isset($result['data']['instrumentResponse']['redirectInfo']['url'])) {
            return [
                'success' => true,
                'redirect_url' => $result['data']['instrumentResponse']['redirectInfo']['url'],
                'order_id' => $orderId
            ];
        }

        return [
            'success' => false,
            'error' => $result['message'] ?? json_encode($result)
        ];
    }

    public function checkOrderStatus(string $orderId): array
    {
        $string = '/pg/v1/status/' . $this->merchantId . '/' . $orderId . $this->saltKey;
        $sha256 = hash('sha256', $string);
        $xVerify = $sha256 . '###' . $this->saltIndex;

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-VERIFY' => $xVerify,
            'X-MERCHANT-ID' => $this->merchantId,
        ])->get($this->apiUrl . '/pg/v1/status/' . $this->merchantId . '/' . $orderId);

        $result = $response->json();

        if (isset($result['success']) && $result['success']) {
            return [
                'success' => true,
                'state' => $result['data']['state'] ?? 'UNKNOWN',
                'response' => $result
            ];
        }

        return [
            'success' => false,
            'error' => $result['message'] ?? 'Status check failed'
        ];
    }
}