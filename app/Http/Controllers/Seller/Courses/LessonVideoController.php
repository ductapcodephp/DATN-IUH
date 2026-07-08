<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller\Courses;

use App\DTO\Seller\Course\Lesson\VideoChunkData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Course\Video\CheckVideoChunksRequest;
use App\Http\Requests\Seller\Course\Video\UploadVideoChunkRequest;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Seller\Courses\VideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class LessonVideoController extends Controller
{
    public function __construct(
        protected VideoService $videoService
    ) {}

    public function upload(UploadVideoChunkRequest $request, Course $course, Lesson $lesson): JsonResponse
    {
        $dto = VideoChunkData::fromRequest($request);

        $result = $this->videoService->handleChunkUpload(
            $lesson,
            $request->file('video_chunk'),
            $dto
        );

        return response()->json($result);
    }

    public function checkChunks(CheckVideoChunksRequest $request, Course $course, Lesson $lesson): JsonResponse
    {
        try {
            $uploadedChunks = $this->videoService->getUploadedChunks(
                $request->query('file_uid')
            );

            return response()->json([
                'uploaded_chunks' => $uploadedChunks,
            ]);
        } catch (\Exception $e) {
            Log::error('Lỗi Check Chunk: ' . $e->getMessage());
            return response()->json(['uploaded_chunks' => []]);
        }
    }
}
