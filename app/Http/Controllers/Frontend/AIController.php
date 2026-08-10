<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\DTO\Frontend\AI\AIChatData;
use App\Services\Frontend\AIService;
use Illuminate\Support\Facades\Log;
use Exception;

class AIController extends Controller
{
    public function __construct(
        private readonly AIService $aiService
    ) {}

    public function chat(Request $request)
    {
        try {
            $data = AIChatData::fromRequest($request);
            $reply = $this->aiService->getAnswer($data);

            return response()->json([
                'success' => true,
                'reply' => $reply,
            ]);
        } catch (Exception $e) {
            // Log lỗi thật để debug, nhưng KHÔNG lộ chi tiết lỗi ra frontend
            Log::error('[AIController] chat error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'reply' => 'Xin lỗi, hệ thống AI đang gặp sự cố. Bạn vui lòng thử lại sau ít phút nhé!',
            ], 200); // trả 200 kèm reply thân thiện, tránh axios nhảy vào catch chung chung ở frontend
        }
    }
}
