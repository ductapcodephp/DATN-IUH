<?php

namespace App\Services\Seller\Courses;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Repositories\Seller\Courses\LessonRepository;

class LessonService
{
    protected $lessonRepository;

    // Inject LessonRepository vào Service để tương tác DB gián tiếp
    public function __construct(LessonRepository $lessonRepository)
    {
        $this->lessonRepository = $lessonRepository;
    }

    public function getLessonDetails(int $lessonId)
    {
        return $this->lessonRepository->findWithVideoAndQiz($lessonId);
    }

    public function createLesson(Course $course, Chapter $chapter, array $data)
    {
        // Kiểm tra tính hợp lệ logic giữa chapter và course
        if ($chapter->course_id !== $course->id) {
            abort(400, 'Chương này không thuộc khóa học này!');
        }

        // Gọi Repository lấy sort_order lớn nhất hiện tại
        $maxSort = $this->lessonRepository->getMaxSortOrder($chapter->id);

        // Chuẩn hóa dữ liệu nghiệp vụ trước khi ghi xuống DB
        $payload = [
            'chapter_id'   => $chapter->id,
            'course_id'    => $course->id,
            'title'        => $data['title'],
            'type'         => $data['type'],
            'sort_order'   => $maxSort + 1,
            'is_published' => false, // Mặc định tạo mới là Bản nháp
            'is_preview'   => false,
        ];

        return $this->lessonRepository->create($payload);
    }

    public function updateLesson(Lesson $lesson, array $data)
    {
        return $this->lessonRepository->update($lesson, $data);
    }

    public function deleteLesson(Lesson $lesson)
    {
        return $this->lessonRepository->delete($lesson);
    }

    public function reorderLessons(int $lessonId, int $targetChapterId, array $sortedIds)
    {
        // Cập nhật chương đích cho bài học được kéo thả (Trường hợp đổi chương)
        $this->lessonRepository->updateChapterId($lessonId, $targetChapterId);

        // Cập nhật lại số thứ tự index mới cho toàn bộ danh sách ID được gửi lên
        foreach ($sortedIds as $index => $id) {
            $this->lessonRepository->updateSortOrder($id, $index + 1);
        }
    }
}
