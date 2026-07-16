# Bức Tranh Toàn Cảnh: Kiến Trúc Upload Video Trực Tiếp Lên R2 (Direct Upload)

Thay vì cách cũ (Frontend -> đẩy file lên Laravel -> Laravel lưu tạm -> Laravel đẩy tiếp sang Cloudflare), kiến trúc mới này thông minh hơn rất nhiều: **Frontend nói chuyện trực tiếp với Cloudflare R2**. 

Dưới đây là câu chuyện toàn cảnh, diễn giải chi tiết từng bước từ lúc User bấm nút "Tải lên" trên màn hình React cho tới lúc File nằm gọn trong Database.

> 🎬 **NHÂN VẬT CHÍNH (FILE GIẢ LẬP ĐỂ MINH HỌA):**
> Để dễ hình dung đường đi của dữ liệu, ta sẽ mô phỏng việc User tải lên một file video với các thông số sau:
> - Tên file gốc trên máy tính: `react-co-ban.mp4`
> - Dung lượng file: **50MB** (Tương đương `52428800 bytes`)
> - Độ dài video: **125 giây** (2 phút 5 giây)
> - Up vào Bài học (Lesson ID): **5**
> - Thuộc Khóa học (Course ID): **10**

---

## CHẶNG 1: Gõ cửa xin "Vé Thông Hành" (Presigned URL)

Cloudflare R2 khóa cửa rất chặt, không cho người lạ vứt rác vào. Vì vậy, việc đầu tiên Trình duyệt (FE) cần làm là chạy đi xin Laravel (BE) một cái **vé vào cổng**.

### 1. Hành động trên Frontend (React)
User vừa chọn file video `react-co-ban.mp4`. React không đẩy file đi ngay mà chỉ lấy cái đuôi `.mp4` gửi cho Laravel.
```javascript
// Trích xuất React: Gọi API xin link
const presignedRes = await axios.post(
    route('seller.courses.curriculum.lessons.video.presigned-url', [10, 5]), 
    { extension: videoFile.name.split('.').pop() } 
);
const { url, key } = presignedRes.data;
```
> 📦 **Dữ liệu gửi đi (FE -> BE):**
> ```json
> {
>     "extension": "mp4"
> }
> ```

### 2. Laravel xử lý và trả Vé (Backend)
Khi Backend nhận được `{ "extension": "mp4" }`, dòng dữ liệu chảy qua các lớp:

**Tầng DTO (Lọc dữ liệu):** Nhận JSON và đúc thành khuôn chuẩn.
```php
$dto = PresignedUrlData::fromRequest($request); 
```
> 🧬 **Dữ liệu lúc này:** Object `$dto` mang giá trị `$dto->extension = 'mp4'`.

**Tầng Controller (Phân luồng):** Gọi Service làm việc.
```php
public function generatePresignedUrl(...) {
    $dto = PresignedUrlData::fromRequest($request);
    return response()->json($this->videoService->generatePresignedUrl($lesson, $dto));
}
```

**Tầng Service (Nghiệp vụ cốt lõi):** Tạo tên file mới và xin chữ ký từ AWS S3.
```php
public function generatePresignedUrl(Lesson $lesson, PresignedUrlData $dto) {
    // 1. Tạo tên file ngẫu nhiên dựa vào Lesson ID và chuỗi ngẫu nhiên
    $filename = 'lessons/lesson-' . $lesson->id . '-' . Str::random(10) . '.' . $dto->extension;
    // VD: $filename = 'lessons/lesson-5-AbCdEfGhIj.mp4'

    // 2. Lấy disk AWS S3 và xin 1 link upload sống được 30 phút
    /** @var \Illuminate\Filesystem\AwsS3V3Adapter $disk */
    $disk = Storage::disk('r2');
    $tempUrl = $disk->temporaryUploadUrl($filename, now()->addMinutes(30));

    // 3. Rút lấy link chuẩn và trả về dạng mảng
    $actualUrl = is_array($tempUrl) ? $tempUrl['url'] : (is_string($tempUrl) ? $tempUrl : '');
    return ['url' => $actualUrl, 'key' => $filename];
}
```

> 🎉 **KẾT THÚC CHẶNG 1 (Dữ liệu trả về cho React):** 
> Laravel ném về cho React một cục JSON chứa cái Vé Thông Hành:
> ```json
> {
>     "url": "https://<TÊN_BUCKET>.r2.cloudflarestorage.com/lessons/lesson-5-AbCdEfGhIj.mp4?X-Amz-Signature=CHỮ_KÝ_BÍ_MẬT...",
>     "key": "lessons/lesson-5-AbCdEfGhIj.mp4"
> }
> ```

---

## CHẶNG 2: Vận chuyển File siêu tốc (Client -> Cloudflare R2)

Có vé trong tay (`url`), Trình duyệt (FE) bây giờ mới chính thức vác cục file 50MB ném thẳng sang Cloudflare.

### Hành động trên Frontend (React)
React dựng 1 thẻ video ảo để đếm xem video dài bao nhiêu giây. Đếm xong, nó dùng lệnh `PUT` để bơm thẳng dữ liệu nhị phân (Binary) sang đường link Cloudflare.
```javascript
// 1. Mẹo lách luật: Đọc nhanh độ dài video
const duration = await readVideoDuration(videoFile); 
// Kết quả: duration = 125 (giây)

// 2. Bơm cục file 50MB thẳng sang Cloudflare (Không dính dáng gì tới Laravel)
await axios.put(url, videoFile, {
    headers: { 'Content-Type': videoFile.type }, // 'video/mp4'
    onUploadProgress: (progressEvent) => {
        // Cập nhật thanh % UI
    }
});
```

> 🚀 **KẾT THÚC CHẶNG 2 (Dữ liệu luân chuyển):**
> Một dòng thác dữ liệu nhị phân (Binary Stream) nặng 50MB chạy thẳng từ máy tính học viên sang hệ thống máy chủ Cloudflare. Khi file bơm xong 100%, Cloudflare kiểm tra vé (Chữ ký điện tử) hợp lệ, lưu file lại và trả về cho React mã `HTTP 200 OK`. (Laravel đang ngủ kỹ ở bước này).

---

## CHẶNG 3: Báo cáo thành tích & Lưu Database

File đã nằm yên vị trên Cloudflare R2, nhưng Database của ta vẫn chưa biết gì cả. React phải làm thao tác cuối: Chạy về báo cáo với Laravel.

### 1. Hành động trên Frontend (React)
Gửi toàn bộ thông số gom được ở bước trên về cho Laravel.
```javascript
await axios.post(
    route('seller.courses.curriculum.lessons.video.confirm', [10, 5]), 
    {
        key: key,                           
        duration_seconds: duration,         
        size_bytes: videoFile.size,         
        mime_type: videoFile.type           
    }
);
```

> 📦 **Dữ liệu gửi đi (FE -> BE):**
> ```json
> {
>     "key": "lessons/lesson-5-AbCdEfGhIj.mp4",
>     "duration_seconds": 125,
>     "size_bytes": 52428800,
>     "mime_type": "video/mp4"
> }
> ```

### 2. Laravel xử lý và ghi Database (Backend)
Khi Backend nhận được bản báo cáo, nó thực hiện bước cuối cùng:

**Tầng DTO:** Gò dữ liệu vào khuôn.
```php
$dto = ConfirmVideoUploadData::fromRequest($request);
```
> 🧬 **Dữ liệu lúc này:** Khởi tạo thành công Object `$dto` mạnh mẽ (Strongly Typed).
> - `$dto->r2Key` = `'lessons/lesson-5-AbCdEfGhIj.mp4'`
> - `$dto->durationSeconds` = `125`
> - `$dto->sizeBytes` = `52428800`
> - `$dto->mimeType` = `'video/mp4'`

**Tầng Service:** Dọn dẹp nhà cửa và Lưu Database.
```php
public function confirmDirectUpload(Lesson $lesson, ConfirmVideoUploadData $dto) {
    // 1. Xóa file cũ trên Cloudflare (Nếu bài học này trước đó đã up video)
    $existingVideo = $this->videoRepository->getByLesson($lesson);
    if ($existingVideo && $existingVideo->r2_key) {
        Storage::disk('r2')->delete($existingVideo->r2_key);
    }

    // 2. Ra lệnh cho Repository update Database
    $this->videoRepository->updateOrCreateStatus($lesson, 'ready', [
        'r2_key'           => $dto->r2Key,
        'duration_seconds' => $dto->durationSeconds,
        'size_bytes'       => $dto->sizeBytes,
        'mime_type'        => $dto->mimeType,
    ]);
}
```

> 💾 **KẾT THÚC CHẶNG 3 (Dữ liệu trong Database):**
> Dòng lệnh cuối cùng chạy xong. Nhìn vào Database (bảng `lesson_videos`), tại dòng dữ liệu của Lesson ID số `5`, mọi thứ đã được lấp đầy:
> | lesson_id | r2_key | duration_seconds | size_bytes | mime_type | status |
> |-----------|--------|------------------|------------|-----------|--------|
> | 5 | lessons/lesson-5-AbCdEfGhIj.mp4 | 125 | 52428800 | video/mp4 | ready |

React nhận được chữ "Thành công", hiển thị SweetAlert màu xanh lá. **Hoàn tất 100% vòng đời của File!** 🚀

---

## TẠI SAO LÀM THẾ NÀY LẠI XỊN HƠN? (Senior Architect Insight)
- **Cứu sống Server:** Nếu 10 học viên up file 1GB cùng lúc theo cách cũ, Server Laravel sẽ quá tải RAM, đứt cáp, sập nguồn. Ở cách mới, Server chỉ tốn 0.1s để "cấp vé", băng thông 10GB đó do Cloudflare hứng chịu.
- **Bỏ được của nợ `getID3`:** Việc đếm số giây video trên Server PHP rất tốn CPU và lỗi vặt. Ở cách mới, dùng Javascript trên Frontend đếm số giây mất chưa tới 1 phần nghìn giây.
- **Tốc độ:** Trực tiếp Client -> Cloudflare luôn nhanh hơn đi đường vòng Client -> Server -> Cloudflare.
