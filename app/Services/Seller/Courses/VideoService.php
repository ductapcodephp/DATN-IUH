<?php

namespace App\Services\Seller\Courses;

use App\Jobs\ProcessVideoUpload;
use App\Models\Lesson;
use getID3;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// 🔥 Thêm thư viện Log

class VideoService
{
    public function handleChunkUpload(Lesson $lesson, UploadedFile $chunk, array $data)
    {
        try {
            $chunkIndex = (int) $data['chunk_index'];
            $totalChunks = (int) $data['total_chunks'];
            $fileUid = $data['file_uid'];
            $originalName = $data['filename'];

            $tempDir = storage_path("app/chunks/{$fileUid}");
            $metaPath = "{$tempDir}/.meta";

            if (! File::exists($tempDir)) {
                File::makeDirectory($tempDir, 0777, true, true);
            }

            // 🔧 FIX #1: Nếu thư mục tạm này đã từng được tạo cho một lượt upload
            // có total_chunks KHÁC với lần này (VD: test lại với fileUid trùng do
            // file cùng size/tên nhưng lần trước bị dở dang/lệch), thì dữ liệu cũ
            // trong đó là "rác" và sẽ làm count() ở dưới không bao giờ khớp
            // -> job không bao giờ được dispatch dù FE báo "thành công".
            // Giải pháp: ghi nhận total_chunks vào file .meta, nếu lệch thì xóa
            // sạch thư mục và bắt đầu lại từ đầu cho lượt upload hiện tại.
            if (File::exists($metaPath)) {
                $savedTotal = (int) trim(File::get($metaPath));
                if ($savedTotal !== $totalChunks) {
                    Log::warning("⚠️ Phát hiện chunk dir cũ lệch total_chunks (cũ: {$savedTotal}, mới: {$totalChunks}) cho fileUid {$fileUid}. Xóa và làm lại.");
                    File::deleteDirectory($tempDir);
                    File::makeDirectory($tempDir, 0777, true, true);
                }
            }
            File::put($metaPath, (string) $totalChunks);

            // Lưu mảnh hiện tại
            $chunk->move($tempDir, $chunkIndex);

            // 🔧 FIX #2: Đếm chunk theo INDEX THỰC TẾ (0..totalChunks-1), loại trừ
            // file .meta, thay vì đếm "tất cả file trong thư mục" như cũ.
            // Cách đếm cũ (count(File::files($tempDir))) sẽ tính luôn file .meta
            // hoặc bất kỳ file rác nào lọt vào thư mục, khiến con số không bao
            // giờ đúng bằng totalChunks thật.
            $existingIndexes = [];
            foreach (File::files($tempDir) as $file) {
                $name = $file->getFilename();
                if ($name === '.meta') {
                    continue;
                }
                if (ctype_digit($name)) {
                    $existingIndexes[(int) $name] = true;
                }
            }
            $uploadedChunks = count($existingIndexes);

            // 🔥 NẾU ĐÃ NHẬN ĐỦ CÁC MẢNH CHUNK
            if ($uploadedChunks === $totalChunks) {

                // 🔧 FIX #3: Chống dispatch trùng job. Nếu 2 request gần như đồng
                // thời (network retry / double click) cùng thấy đủ chunk, tránh
                // bắn 2 job xử lý cùng 1 video.
                $existingVideo = $lesson->video()->first();
                if ($existingVideo && $existingVideo->status === 'processing') {
                    return [
                        'status' => 'processing',
                        'message' => 'Video đã được đưa vào hàng đợi xử lý ngầm.',
                    ];
                }

                // 1. Cập nhật trạng thái video
                $lesson->video()->updateOrCreate(
                    ['lesson_id' => $lesson->id],
                    ['status' => 'processing']
                );

                // 2. Đẩy vào hàng đợi
                ProcessVideoUpload::dispatch($lesson, $fileUid, $originalName, $totalChunks);

                Log::info("✅ Đã dispatch ProcessVideoUpload cho Lesson #{$lesson->id}, fileUid={$fileUid}, totalChunks={$totalChunks}");

                return [
                    'status' => 'processing',
                    'message' => 'Tải lên thành công! Video đã được đưa vào hàng đợi xử lý ngầm.',
                ];
            }

            return [
                'status' => 'chunk_saved',
                'uploaded_chunks' => $uploadedChunks,
                'total_chunks' => $totalChunks,
                'message' => "Mảnh số {$chunkIndex} đã lưu xong ({$uploadedChunks}/{$totalChunks}).",
            ];

        } catch (\Exception $e) {
            // 🔥 NẾU CÓ BẤT KỲ LỖI GÌ XẢY RA, GHI THẲNG VÀO LOG KÈM DÒNG LỖI!
            Log::error('❌ LỖI UPLOAD CHUNK TẠI VIDEO SERVICE: '.$e->getMessage().' | File: '.$e->getFile().' | Dòng: '.$e->getLine());

            // Ném lỗi ngược ra Controller để Frontend biết đường mà báo đỏ
            abort(500, 'Lỗi Server: '.$e->getMessage());
        }
    }

    /**
     * Hàm này sẽ được thực thi NẰM TRONG HÀNG ĐỢI QUEUE (Chạy ngầm background)
     */
    public function mergeAndUploadVideoFromQueue(Lesson $lesson, string $fileUid, string $originalName, int $totalChunks)
    {
        try {
            $tempDir = storage_path("app/chunks/{$fileUid}");
            $finalPath = storage_path("app/chunks/{$fileUid}_{$originalName}");

            if (! File::exists($tempDir)) {
                $lesson->video()->update(['status' => 'error']);

                return;
            }

            // Tiến hành gộp file từ các mảnh nhỏ
            $fileHandle = fopen($finalPath, 'ab');
            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkPath = "{$tempDir}/{$i}";
                if (File::exists($chunkPath)) {
                    $chunkContent = file_get_contents($chunkPath);
                    fwrite($fileHandle, $chunkContent);
                    unset($chunkContent);
                }
            }
            fclose($fileHandle);

            // Xóa thư mục chứa mảnh tạm (gồm cả .meta)
            File::deleteDirectory($tempDir);

            // Giả lập UploadedFile
            $finalUploadedFile = new UploadedFile(
                $finalPath,
                $originalName,
                File::mimeType($finalPath),
                null,
                true
            );

            // Đẩy lên Cloudflare R2
            $this->uploadVideoForLesson($lesson, $finalUploadedFile);

        } catch (\Exception $e) {
            // 🔥 LOG LỖI KHI GỘP HOẶC UP R2 BỊ SẬP TRONG QUEUE
            Log::error('❌ LỖI GỘP/UPLOAD R2 TRONG QUEUE: '.$e->getMessage().' | Dòng: '.$e->getLine());
            $lesson->video()->update(['status' => 'error']);
            throw $e; // Ném ra để bảng failed_jobs ghi nhận
        } finally {
            if (File::exists($finalPath)) {
                File::delete($finalPath);
            }
        }
    }

    /**
     * Logic gốc đẩy file lên Cloudflare R2
     */
    public function uploadVideoForLesson(Lesson $lesson, UploadedFile $file)
    {
        if ($lesson->video && $lesson->video->r2_key) {
            Storage::disk('r2')->delete($lesson->video->r2_key);
        }

        $extension = $file->getClientOriginalExtension();
        $filename = 'lessons/lesson-'.$lesson->id.'-'.Str::random(10).'.'.$extension;

        Storage::disk('r2')->putFileAs('', $file, $filename);

        $getID3 = new getID3;
        $fileInfo = $getID3->analyze($file->getPathname());
        $duration = isset($fileInfo['playtime_seconds']) ? round($fileInfo['playtime_seconds']) : 0;

        $video = $lesson->video()->updateOrCreate(
            ['lesson_id' => $lesson->id],
            [
                'r2_key' => $filename,
                'duration_seconds' => $duration,
                'size_bytes' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'status' => 'ready',
            ]
        );

        return $video;
    }
}
