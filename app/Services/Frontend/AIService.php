<?php

namespace App\Services\Frontend;

use App\DTO\Frontend\AI\AIChatData;
use App\Repositories\Frontend\Courses\CourseRepositoryInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;
use Exception;

class AIService
{
    protected $courseRepository;

    private const REFUSAL_MESSAGE = "Xin lỗi, tôi là AI tư vấn của EduFlow nên chỉ có thể hỗ trợ các thông tin liên quan đến EduFlow tại đây. Mong bạn thông cảm!";

    private const ALIASES = [
        'js' => 'javascript', 'ts' => 'typescript', 'php' => 'php', 'py' => 'python',
        'react' => 'reactjs', 'vue' => 'vuejs', 'node' => 'nodejs', 'laravel' => 'laravel php',
        'html' => 'html', 'css' => 'css', 'sql' => 'sql database', 'db' => 'database',
        'ai' => 'artificial intelligence machine learning', 'ml' => 'machine learning ai',
        'c#' => 'csharp', 'c++' => 'cpp',
    ];

    private const STOP_WORDS = [
        'tao', 'mày', 'tôi', 'bạn', 'mình', 'có', 'không', 'về', 'học', 'muốn', 'khóa', 'đấy', 'này', 'kia',
        'làm', 'cái', 'gì', 'thế', 'nào', 'ở', 'đâu', 'cho', 'xin', 'hỏi', 'biết', 'ai', 'dạy', 'được', 'rồi',
        'chưa', 'nha', 'nhé', 'ạ', 'với', 'thì', 'là', 'mà', 'tìm', 'kiếm', 'xem', 'cần', 'những', 'các', 'để',
    ];

    public function __construct(CourseRepositoryInterface $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function getAnswer(AIChatData $data): string
    {
        $question = trim($data->question);
        if (empty($question)) {
            return "Vui lòng nhập câu hỏi.";
        }

        $searchKeyword = $this->extractKeywords($question);

        // Lấy link tìm kiếm từ DB (core_menu)
        $searchPageUrl = \Illuminate\Support\Facades\DB::table('core_menu')
            ->where('name', 'like', '%khóa học%')
            ->whereNotNull('url')
            ->value('url') ?? (rtrim(config('app.url'), '/') . '/tech-education/danh-sach-khoa-hoc.html');

        $linkWhitelist = [$searchPageUrl];

        [$courseInfo, $courseFound, $usedFallback] = $this->searchCoursesWith3Tiers($searchKeyword, $linkWhitelist);

        if (!$courseFound && !$usedFallback && empty($searchKeyword)) {
            return self::REFUSAL_MESSAGE;
        }

        $prompt = $this->buildPrompt($question, $courseInfo, $usedFallback, $searchPageUrl);

        try {
            $rawReply = $this->callOllama($prompt);
        } catch (Throwable $e) {
            Log::warning('[AIService] Ollama call failed: ' . $e->getMessage());
            return $this->buildFallbackAnswer($courseInfo, $courseFound || $usedFallback);
        }

        return $this->sanitizeReply($rawReply, $linkWhitelist);
    }

    /* ================= 3-TIER COURSE SEARCH ================= */

    private function searchCoursesWith3Tiers(string $keyword, array &$linkWhitelist): array
    {
        // Tầng 1: search chính xác
        try {
            $courses = $this->courseRepository->searchForAI($keyword, 5);
        } catch (Throwable $e) {
            Log::error('[AIService] Course exact search error: ' . $e->getMessage());
            $courses = collect();
        }

        if ($courses->isNotEmpty()) {
            return [$this->formatCourseList($courses, $linkWhitelist), true, false];
        }

        // Tầng 2: search fuzzy
        try {
            $fuzzyCourses = $this->courseRepository->searchForAIFuzzy($keyword, 5);
        } catch (Throwable $e) {
            Log::error('[AIService] Course fuzzy search error: ' . $e->getMessage());
            $fuzzyCourses = collect();
        }

        if ($fuzzyCourses->isNotEmpty()) {
            return [$this->formatCourseList($fuzzyCourses, $linkWhitelist), true, false];
        }

        // Tầng 3: fallback - chỉ đưa danh sách TÊN, không link chi tiết
        try {
            $allTitles = $this->courseRepository->getAllTitlesForFallback(100);
        } catch (Throwable $e) {
            Log::error('[AIService] Course fallback list error: ' . $e->getMessage());
            $allTitles = collect();
        }

        if ($allTitles->isEmpty()) {
            return ["Không tìm thấy khóa học nào phù hợp trong hệ thống.\n", false, false];
        }

        $titleList = $allTitles->pluck('title')->implode(', ');
        $text = "Không tìm thấy khóa học khớp chính xác từ khóa. Đây là danh sách TÊN khóa học hiện có trong hệ thống (CHỈ DÙNG ĐỂ THAM KHẢO XEM CÓ TÊN NÀO GẦN GIỐNG, KHÔNG ĐƯỢC TỰ TẠO LINK CHI TIẾT):\n{$titleList}\n";

        return [$text, false, true];
    }

    private function formatCourseList($courses, array &$linkWhitelist): string
    {
        $text = "Danh sách khóa học phù hợp:\n";
        $appUrl = rtrim(config('app.url'), '/');
        foreach ($courses as $course) {
            $link = $appUrl . route('frontend.course.detail', $course->slug, false);
            $linkWhitelist[] = $link;
            $text .= "- Khóa học: {$course->title} (Giá: " . number_format($course->price) . " VND). Mô tả: {$course->description}. Link: {$link}\n";
        }
        return $text;
    }

    /* ================= KEYWORD EXTRACTION ================= */

    private function extractKeywords(string $question): string
    {
        $questionStr = mb_strtolower($question);
        $words = preg_split('/[\s,\.\?!]+/', $questionStr, -1, PREG_SPLIT_NO_EMPTY);

        $keywords = [];
        foreach ($words as $word) {
            if (mb_strlen($word) < 2 || in_array($word, self::STOP_WORDS)) {
                continue;
            }
            $keywords[] = self::ALIASES[$word] ?? $word;
        }

        return implode(' ', array_unique($keywords));
    }

    /* ================= PROMPT ================= */

    private function buildPrompt(string $question, string $courseInfo, bool $usedFallback, string $searchPageUrl): string
    {
        $fallbackRule = $usedFallback
            ? "- Vì không tìm thấy khóa học khớp chính xác, nếu thấy tên nào trong danh sách tham khảo gần giống câu hỏi, hãy nhắc tên đó và gợi ý khách truy cập trang tìm kiếm: [Tìm kiếm khóa học](" . $searchPageUrl . "). TUYỆT ĐỐI KHÔNG tự tạo link chi tiết riêng cho khóa học đó.\n"
            : "";

        return <<<PROMPT
Bạn là trợ lý tư vấn của EduFlow. Dưới đây là dữ liệu THẬT lấy từ hệ thống — nguồn DUY NHẤT được phép dùng:

--- THÔNG TIN HỆ THỐNG ---
{$courseInfo}
--------------------------

QUY TẮC:
- Chỉ dùng đúng tên, giá, link ở trên. Nếu ghi "Không tìm thấy", hãy nói rõ chưa có kết quả.
- Khi nhắc một khóa học CÓ LINK CỤ THỂ ở trên, chèn Markdown [Tên](Link), copy y nguyên link, không tự sửa.
{$fallbackRule}- Trả lời ngắn gọn, lịch sự, bằng tiếng Việt.

Câu hỏi khách hàng: "{$question}"
PROMPT;
    }

    private function callOllama(string $prompt): string
    {
        $response = Http::timeout(config('services.ollama.timeout', 120))
            ->post(rtrim(config('services.ollama.base_url'), '/') . '/api/generate', [
                'model'  => config('services.ollama.model', 'qwen2.5:3b'),
                'prompt' => $prompt,
                'stream' => false,
            ]);

        if (!$response->successful()) {
            throw new Exception('Ollama API error: HTTP ' . $response->status());
        }

        return $response->json()['response'] ?? '';
    }

    /* ================= POST-PROCESSING ================= */

    private function sanitizeReply(string $reply, array $linkWhitelist): string
    {
        $reply = trim($reply);
        if ($reply === '') {
            return "Xin lỗi, mình chưa tổng hợp được câu trả lời, bạn thử lại nhé.";
        }

        return preg_replace_callback('/\[([^\]]+)\]\(([^)]+)\)/', function ($m) use ($linkWhitelist) {
            return in_array(trim($m[2]), $linkWhitelist, true) ? $m[0] : $m[1];
        }, $reply);
    }

    private function buildFallbackAnswer(string $courseInfo, bool $hasAnyData): string
    {
        if (!$hasAnyData) {
            return "Xin lỗi, hiện tại mình chưa thể kết nối AI. Bạn vui lòng thử lại sau ít phút nhé!";
        }
        return "Hệ thống AI đang tạm bận, đây là kết quả tìm kiếm trực tiếp:\n\n" . $courseInfo;
    }
}
