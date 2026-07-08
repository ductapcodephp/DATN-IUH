<?php

declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Seller\Course\Lesson\VideoChunkData;
use App\Jobs\ProcessVideoUpload;
use App\Models\Lesson;
use App\Repositories\Seller\Courses\LessonVideoRepository;
use getID3;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoService
{
    public function __construct(
        protected LessonVideoRepository $videoRepository
    ) {}

    /**
     * Kiểm tra danh sách các chunk đã tải lên để phục vụ tính năng Resume Upload
     */
    public function getUploadedChunks(?string $fileUid): array
    {
        if (!$fileUid) {
            return [];
        }

        $chunksRoot = storage_path('app/chunks');
        if (!File::exists($chunksRoot)) {
            File::makeDirectory($chunksRoot, 0777, true, true);
        }

        $tempDir = "{$chunksRoot}/{$fileUid}";
        $uploadedChunks = [];

        if (File::exists($tempDir)) {
            // TỐI ƯU 1: Dùng scandir thay vì File::files để giảm tải I/O ổ cứng
            $files = array_diff(scandir($tempDir), ['.', '..', '.meta']);

            foreach ($files as $name) {
                if (ctype_digit($name)) {
                    $uploadedChunks[] = (int) $name;
                }
            }
        }

        return $uploadedChunks;
    }

    /**
     * Xử lý lưu trữ mảnh chunk vào Storage tạm
     */
    public function handleChunkUpload(Lesson $lesson, UploadedFile $chunk, VideoChunkData $dto): array
    {
        try {
            $tempDir = storage_path("app/chunks/{$dto->fileUid}");
            $metaPath = "{$tempDir}/.meta";

            if (!File::exists($tempDir)) {
                File::makeDirectory($tempDir, 0777, true, true);
            }

            // Kiểm tra lệch total_chunks để xóa rác lượt cũ
            if (File::exists($metaPath)) {
                $savedTotal = (int) trim(file_get_contents($metaPath));
                if ($savedTotal !== $dto->totalChunks) {
                    Log::warning("⚠️ Phát hiện chunk dir cũ lệch total_chunks (cũ: {$savedTotal}, mới: {$dto->totalChunks}) cho fileUid {$dto->fileUid}. Xóa và làm lại.");
                    File::deleteDirectory($tempDir);
                    File::makeDirectory($tempDir, 0777, true, true);
                }
            }
            file_put_contents($metaPath, (string) $dto->totalChunks);

            // FIX LỖI KIỂU DỮ LIỆU: Ép kiểu chunkIndex sang chuỗi (string) để hàm move() không báo lỗi
            $chunk->move($tempDir, (string) $dto->chunkIndex);

            // TỐI ƯU 2: Đếm chunk thực tế siêu tốc bằng scandir
            $files = array_diff(scandir($tempDir), ['.', '..', '.meta']);
            $uploadedChunks = 0;

            foreach ($files as $name) {
                if (ctype_digit($name)) {
                    $uploadedChunks++;
                }
            }

            // NẾU ĐÃ NHẬN ĐỦ CÁC MẢNH CHUNK
            if ($uploadedChunks === $dto->totalChunks) {

                // TỐI ƯU 3: Dùng Cache Lock chặn tạo Job trùng lặp khi request dồn dập
                $lock = Cache::lock("upload_video_{$dto->fileUid}", 10);

                if ($lock->get()) {
                    // Cập nhật trạng thái và đẩy vào Queue
                    $this->videoRepository->updateOrCreateStatus($lesson, 'processing');
                    ProcessVideoUpload::dispatch($lesson, $dto->fileUid, $dto->filename, $dto->totalChunks);

                    Log::info("✅ Đã dispatch ProcessVideoUpload cho Lesson #{$lesson->id}, fileUid={$dto->fileUid}, totalChunks={$dto->totalChunks}");

                    return [
                        'status'  => 'processing',
                        'message' => 'Tải lên thành công! Video đã được đưa vào hàng đợi xử lý ngầm.',
                    ];
                }

                // Trả về processing nếu request khác đã lấy lock và đang xử lý
                return [
                    'status'  => 'processing',
                    'message' => 'Video đã được đưa vào hàng đợi xử lý ngầm.',
                ];
            }

            return [
                'status'          => 'chunk_saved',
                'uploaded_chunks' => $uploadedChunks,
                'total_chunks'    => $dto->totalChunks,
                'message'         => "Mảnh số {$dto->chunkIndex} đã lưu xong ({$uploadedChunks}/{$dto->totalChunks}).",
            ];
        } catch (\Exception $e) {
            Log::error('❌ LỖI UPLOAD CHUNK TẠI VIDEO SERVICE: ' . $e->getMessage() . ' | File: ' . $e->getFile() . ' | Dòng: ' . $e->getLine());
            abort(500, 'Lỗi Server: ' . $e->getMessage());
        }
    }

    /**
     * Chạy trong Queue: Gộp file và đẩy lên R2
     */
    public function mergeAndUploadVideoFromQueue(Lesson $lesson, string $fileUid, string $originalName, int $totalChunks): void
    {
        $tempDir = storage_path("app/chunks/{$fileUid}");
        $finalPath = storage_path("app/chunks/{$fileUid}_{$originalName}");

        try {
            if (!File::exists($tempDir)) {
                $this->videoRepository->updateOrCreateStatus($lesson, 'error');
                return;
            }

            // TỐI ƯU 4: Chống tràn RAM bằng luồng stream_copy_to_stream
            $fileHandle = fopen($finalPath, 'ab');
            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkPath = "{$tempDir}/{$i}";
                if (File::exists($chunkPath)) {
                    $chunkHandle = fopen($chunkPath, 'rb');
                    stream_copy_to_stream($chunkHandle, $fileHandle);
                    fclose($chunkHandle);
                }
            }
            fclose($fileHandle);

            File::deleteDirectory($tempDir);

            // Giả lập UploadedFile
            $finalUploadedFile = new UploadedFile(
                $finalPath,
                $originalName,
                File::mimeType($finalPath),
                null,
                true
            );

            $this->uploadVideoForLesson($lesson, $finalUploadedFile);
        } catch (\Exception $e) {
            Log::error('❌ LỖI GỘP/UPLOAD R2 TRONG QUEUE: ' . $e->getMessage() . ' | Dòng: ' . $e->getLine());
            $this->videoRepository->updateOrCreateStatus($lesson, 'error');
            throw $e;
        } finally {
            if (File::exists($finalPath)) {
                File::delete($finalPath);
            }
        }
    }

    /**
     * Đẩy file lên Cloudflare R2 và lấy metadata (thời lượng, kích thước)
     */
    public function uploadVideoForLesson(Lesson $lesson, UploadedFile $file): mixed
    {
        $existingVideo = $this->videoRepository->getByLesson($lesson);
        if ($existingVideo && $existingVideo->r2_key) {
            Storage::disk('r2')->delete($existingVideo->r2_key);
        }

        $extension = $file->getClientOriginalExtension();
        $filename = 'lessons/lesson-' . $lesson->id . '-' . Str::random(10) . '.' . $extension;

        Storage::disk('r2')->putFileAs('', $file, $filename);

        $getID3 = new getID3;
        $fileInfo = $getID3->analyze($file->getPathname());
        $duration = isset($fileInfo['playtime_seconds']) ? (int) round($fileInfo['playtime_seconds']) : 0;

        return $this->videoRepository->updateOrCreateStatus($lesson, 'ready', [
            'r2_key'           => $filename,
            'duration_seconds' => $duration,
            'size_bytes'       => $file->getSize(),
            'mime_type'        => $file->getMimeType(),
        ]);
    }
}
