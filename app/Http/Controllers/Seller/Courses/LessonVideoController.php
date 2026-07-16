<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller\Courses;

use App\DTO\Seller\Course\Lesson\ConfirmVideoUploadData;
use App\DTO\Seller\Course\Lesson\PresignedUrlData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Courses\Lesson\ConfirmVideoUploadRequest;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Seller\Courses\VideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonVideoController extends Controller
{
    public function __construct(
        protected VideoService $videoService
    ) {}

    public function generatePresignedUrl(Request $request, Course $course, Lesson $lesson): JsonResponse
    {
        $dto = PresignedUrlData::fromRequest($request);
        $result = $this->videoService->generatePresignedUrl($lesson, $dto);

        return response()->json($result);
    }

    public function confirmUpload(ConfirmVideoUploadRequest $request, Course $course, Lesson $lesson): JsonResponse
    {

        $dto = ConfirmVideoUploadData::fromRequest($request);
        $this->videoService->confirmDirectUpload($lesson, $dto);

        return response()->json(['message' => 'Lưu video thành công']);
    }
}
