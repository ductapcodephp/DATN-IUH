<?php

namespace App\Jobs;

use App\Models\Lesson;
use App\Services\Seller\Courses\VideoService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Log;

class ProcessVideoUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $lesson;
    protected $fileUid;
    protected $originalName;
    protected $totalChunks;

    // 🔥 Tăng thời gian tối đa Job được phép chạy lên 30 phút (thoải mái cho file 1GB)
    public $timeout = 1800;

    public function __construct(Lesson $lesson, string $fileUid, string $originalName, int $totalChunks)
    {
        $this->lesson = $lesson;
        $this->fileUid = $fileUid;
        $this->originalName = $originalName;
        $this->totalChunks = $totalChunks;
    }

    public function handle(VideoService $videoService)
    {
        try {
            // Gọi hàm xử lý gộp và đẩy lên mây từ Service
            $videoService->mergeAndUploadVideoFromQueue(
                $this->lesson,
                $this->fileUid,
                $this->originalName,
                $this->totalChunks
            );
        } catch (\Exception $e) {
            // Nếu lỗi thảm khốc xảy ra, chuyển trạng thái video thành error để giao diện hiển thị báo lỗi
            $this->lesson->video()->update(['status' => 'error']);
            Log::error("Lỗi khi xử lý hàng đợi Video ID {$this->lesson->id}: " . $e->getMessage());
            throw $e;
        }
    }
}
