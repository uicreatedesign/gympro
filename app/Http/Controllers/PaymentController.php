<?php

namespace App\Http\Controllers;

use App\Services\PhonePeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function __construct(private PhonePeService $phonePeService) {}

    public function initiatePayment(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'order_id' => 'required|string',
        ]);

        $orderId = $request->order_id;
        $amount = (int) ($request->amount * 100); // Convert to paise
        $redirectUrl = route('payment.callback');

        $result = $this->phonePeService->initiatePayment($orderId, $amount, $redirectUrl);

        return response()->json($result);
    }

    public function callback(Request $request): RedirectResponse
    {
        $orderId = $request->query('order_id');
        
        if ($orderId) {
            $status = $this->phonePeService->checkOrderStatus($orderId);
            
            if ($status['success']) {
                return redirect()->route('payment.success')->with('status', $status);
            }
        }

        return redirect()->route('payment.failed');
    }

    public function webhook(Request $request): JsonResponse
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $headerKey = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
                $headers[$headerKey] = $value;
            }
        }

        $requestBody = $request->getContent();
        $result = $this->phonePeService->verifyCallback($headers, $requestBody);

        return response()->json($result);
    }

    public function checkStatus(Request $request): JsonResponse
    {
        $request->validate(['order_id' => 'required|string']);
        
        $result = $this->phonePeService->checkOrderStatus($request->order_id);
        return response()->json($result);
    }

    public function refund(Request $request): JsonResponse
    {
        $request->validate([
            'refund_id' => 'required|string',
            'original_order_id' => 'required|string',
            'amount' => 'required|numeric|min:1',
        ]);

        $amount = (int) ($request->amount * 100); // Convert to paise
        
        $result = $this->phonePeService->initiateRefund(
            $request->refund_id,
            $request->original_order_id,
            $amount
        );

        return response()->json($result);
    }
}