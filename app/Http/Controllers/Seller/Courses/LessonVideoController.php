<?php

namespace App\Http\Controllers\Seller\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Seller\Courses\VideoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LessonVideoController extends Controller
{
    protected $videoService;

    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    private function authorizeSeller(Course $course, Lesson $lesson)
    {
        if ($course->seller_id !== auth()->id()) {
            abort(403, 'Mày không có quyền truy cập khóa học này!');
        }
        if ($lesson->course_id !== $course->id) {
            abort(404, 'Bài học không tồn tại trong khóa học này!');
        }
    }

    public function upload(Request $request, Course $course, Lesson $lesson)
    {
        // 1. Phân quyền bảo mật chặt chẽ
        $this->authorizeSeller($course, $lesson);

        // 2. Validate cấu trúc payload của từng mảnh chunk nhỏ gửi lên
        $request->validate([
            'video_chunk' => 'required|file',
            'chunk_index' => 'required|integer',
            'total_chunks' => 'required|integer',
            'file_uid' => 'required|string',
            'filename' => 'required|string',
        ]);

        // 3. Ủy thác hoàn toàn việc xử lý file thô sang Service
        $result = $this->videoService->handleChunkUpload(
            $lesson,
            $request->file('video_chunk'),
            $request->only(['chunk_index', 'total_chunks', 'file_uid', 'filename'])
        );

        // 4. Trả kết quả mượt mà về cho Axios xử lý tiến độ ở Frontend
        return response()->json($result);
    }

    // Thêm hàm này vào trong file LessonVideoController.php của mày:

public function checkChunks(Request $request, Course $course, Lesson $lesson)
{
    try {
        if ($course->seller_id !== auth()->id() || $lesson->course_id !== $course->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $fileUid = $request->query('file_uid');
        if (!$fileUid) {
            return response()->json(['uploaded_chunks' => []]);
        }

        // Đảm bảo thư mục cha 'chunks' luôn luôn tồn tại
        $chunksRoot = storage_path("app/chunks");
        if (!File::exists($chunksRoot)) {
            File::makeDirectory($chunksRoot, 0777, true, true);
        }

        $tempDir = "{$chunksRoot}/{$fileUid}";
        $uploadedChunks = [];

        if (File::exists($tempDir)) {
            $files = File::files($tempDir);
            foreach ($files as $file) {
                $name = $file->getFilename();

                // 🔧 FIX: bỏ qua file .meta (dùng để lưu total_chunks ở VideoService).
                // Nếu không loại trừ, "(int) '.meta'" sẽ ra 0 và bị tính nhầm
                // thành "đã upload chunk số 0", làm sai logic resume upload.
                if ($name === '.meta') {
                    continue;
                }
                if (!ctype_digit($name)) {
                    continue;
                }

                $uploadedChunks[] = (int) $name;
            }
        }

        return response()->json([
            'uploaded_chunks' => $uploadedChunks,
        ]);

    } catch (\Exception $e) {
        // Nếu lỗi, ghi thẳng vào log để mở laravel.log ra cứu hộ cho dễ
        \Log::error("Lỗi Check Chunk: " . $e->getMessage());
        return response()->json(['uploaded_chunks' => []]); // Trả về mảng rỗng để cho up lại từ đầu thay vì văng lỗi gãy giao diện
    }
}
}
