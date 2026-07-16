<?php
declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Seller\Course\Lesson\ConfirmVideoUploadData;
use App\DTO\Seller\Course\Lesson\PresignedUrlData;
use App\Models\Lesson;
use App\Repositories\Seller\Courses\LessonVideoRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoService
{
    public function __construct(
        protected LessonVideoRepository $videoRepository
    ) {}

    public function generatePresignedUrl(Lesson $lesson, PresignedUrlData $dto): array
    {
        $filename = 'lessons/lesson-' . $lesson->id . '-' . Str::random(10) . '.' . $dto->extension;

        /** @var \Illuminate\Filesystem\AwsS3V3Adapter $disk */
        $disk = Storage::disk('r2');

        $tempUrl = $disk->temporaryUploadUrl(
            $filename, 
            now()->addMinutes(30)
        );

        $actualUrl = is_array($tempUrl) ? $tempUrl['url'] : (is_string($tempUrl) ? $tempUrl : '');

        return [
            'url' => $actualUrl,
            'key' => $filename,
        ];
    }

    public function confirmDirectUpload(Lesson $lesson, ConfirmVideoUploadData $dto): void
    {
        $existingVideo = $this->videoRepository->getByLesson($lesson);
        
        if ($existingVideo && $existingVideo->r2_key) {
            Storage::disk('r2')->delete($existingVideo->r2_key);
        }

        $this->videoRepository->updateOrCreateStatus($lesson, 'ready', [
            'r2_key'           => $dto->r2Key,
            'duration_seconds' => $dto->durationSeconds,
            'size_bytes'       => $dto->sizeBytes,
            'mime_type'        => $dto->mimeType,
        ]);
    }
}
