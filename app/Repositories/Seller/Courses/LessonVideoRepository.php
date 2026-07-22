<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Courses;

use App\Models\Lesson;

class LessonVideoRepository
{
    public function updateOrCreateStatus(Lesson $lesson, string $status, array $extraData = []): mixed
    {
        $payload = array_merge(['status' => $status], $extraData);

        return $lesson->video()->updateOrCreate(
            ['lesson_id' => $lesson->id],
            $payload
        );
    }

    public function getByLesson(Lesson $lesson): mixed
    {
        return $lesson->video()->first();
    }
}
