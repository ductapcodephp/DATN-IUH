# Workflow Học Tập (Video & Quiz)

Tài liệu này mô tả chi tiết luồng xử lý (Workflow) của hệ thống học tập hiện tại, bao gồm cơ chế xem Video (tích hợp chống tua, đồng bộ tiến trình) và cơ chế làm bài trắc nghiệm Quiz.

---

## 1. Luồng Học Video (Video Lesson Workflow)

Hệ thống kết hợp cả **Frontend (UI/UX)** và **Backend (Redis + Queue + Database)** để đảm bảo trải nghiệm mượt mà, hạn chế gian lận và tối ưu hiệu năng ghi.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant FE as Frontend (Learn.jsx)
    participant API as Backend API
    participant Redis as Redis Cache
    participant Queue as Worker (Job)
    participant DB as MySQL Database

    Student->>FE: Bấm Play xem Video
    loop Mỗi 10 giây (Throttle)
        FE->>FE: Cập nhật `maxWatchedTime`
        FE->>API: POST /update-progress (watched_seconds, skipped_seconds)
    end
    
    API->>API: (Service) Validate chống hack (kiểm tra bước nhảy thời gian > 25s)
    API->>Redis: Lưu tạm progress vào Cache (tránh query DB nhiều)
    API->>Queue: Dispatch `UpdateVideoProgressJob` (Delay 30s, Unique)
    API-->>FE: Trả về HTTP 200 (Success)
    
    Note over Queue: Sau 30s hoặc khi Video kết thúc
    Queue->>Redis: Lấy progress mới nhất
    Queue->>DB: Cập nhật `watched_seconds`, `skipped_seconds` vào `course_progress`
    
    opt Nếu watched_seconds >= 70% duration
        Queue->>DB: Set `is_completed = true` (Đánh dấu hoàn thành)
        Queue->>DB: Tính toán & Cập nhật `% tiến độ` cho `course_enrollments`
    end

    opt Nếu Student cố tình Tua (Seek)
        Student->>FE: Kéo thanh thời gian (Seek)
        FE->>FE: Kiểm tra thời gian tua có > `maxWatchedTime`?
        alt Tua hợp lệ (<= 20s hoặc < 10% tổng thời lượng)
            FE->>FE: Cho phép, cộng dồn vào `skipped_seconds`
        else Tua quá giới hạn
            FE->>Student: Bật Modal Cảnh Báo "Không được tua"
            FE->>FE: Ép thanh thời gian quay về `maxWatchedTime`
        end
    end
```

### Các điểm nhấn kỹ thuật (Video):
- **Debounce / Throttle:** Frontend chỉ gọi API 10s/lần. 
- **Queue & ShouldBeUnique:** Backend chỉ tạo 1 Job duy nhất chờ 30 giây mới chạy (giảm tải 80% truy vấn UPDATE vào Database).
- **Anti-Cheat (Chống gian lận):** 
  - Frontend dùng biến `maxWatchedTime` (đồng bộ từ DB) để chặn kéo thanh tua lên phía trước quá giới hạn cho phép.
  - Hỗ trợ cho phép tua tối đa 20s hoặc 10% bài học cho mục đích "bỏ qua đoạn giới thiệu ngắn".
  - Bắt lỗi bước nhảy thời gian lớn ở phía Backend Service.

---

## 2. Luồng Làm Trắc Nghiệm (Quiz Workflow)

Hệ thống Quiz đảm bảo bảo mật tuyệt đối: Frontend không bao giờ biết đáp án đúng, mọi thứ được chấm tại Backend.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant FE as Frontend (Learn.jsx)
    participant API as Backend API
    participant DB as MySQL Database

    Student->>FE: Trả lời các câu hỏi
    Student->>FE: Bấm "Nộp Bài"
    FE->>API: POST /submit-quiz (Gửi JSON `answers`)
    
    API->>DB: Fetch câu hỏi & đáp án đúng (`is_correct`)
    API->>API: So sánh logic & Chấm điểm (Chỉ cần 1 câu sai là trượt)
    
    API->>DB: Lưu/Cập nhật bảng `quiz_results` (Lưu lịch sử chọn, điểm số)
    
    alt Pass (Đúng 100%)
        API->>DB: firstOrNew bảng `course_progress` (Khởi tạo default watched_seconds = 0)
        API->>DB: Set `is_completed = true` cho bài Quiz
        API->>DB: Tính toán & Cập nhật `% tiến độ khóa học` trong `course_enrollments`
        API-->>FE: HTTP 200 (Success - isPassed: true)
        FE->>FE: Cập nhật state `localCompleted`
        FE->>Student: Mở khóa bài tiếp theo ngay lập tức (Realtime UX)
    else Fail (Sai ít nhất 1 câu)
        API-->>FE: HTTP 200 (Success - isPassed: false)
        FE->>Student: Thông báo lỗi, yêu cầu làm lại
    end
```

### Các điểm nhấn kỹ thuật (Quiz):
- **Bảo mật đáp án:** Cột `is_correct` hoàn toàn được giấu trong các Response tải trang. Backend tự lôi ra để chấm.
- **Xử lý linh hoạt CourseProgress:** Vì bài Quiz không có thời lượng (duration) nên hệ thống tự động gán các chỉ số thời gian về `0` khi Insert vào bảng `course_progress` để tránh lỗi SQL Strict Mode, đồng thời bật flag `is_completed = 1` để qua bài.
- **Trải nghiệm tức thì:** Không giống Video (phải dùng Queue 30s), Quiz trả về kết quả ngay lập tức để học viên biết đỗ hay trượt và đi tiếp.
