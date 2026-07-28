## Goal Description
Thiết kế lại cơ sở dữ liệu và kiến trúc cho hệ thống CMS dựa trên cấu trúc mẫu từ `data.sql` (loại bỏ các bảng không cần thiết như `topic`, `core_ticket_request`, `core_category`, `amz_feedback`, `core_user`). CMS này cho phép quản lý Page, Article thông qua một thực thể chung là Post, và mỗi Page/Post có thể chứa nhiều Block. Hệ thống hỗ trợ Realtime Preview cho Block, Quản lý thư viện ảnh/Gallery, Quản lý Menu (Node tree) và Settings. 

## User Review Required
> [!IMPORTANT]
> **Về bảng `core_post`**: Trong `data.sql`, các bảng `core_page`, `core_article`, `core_block_content` đều liên kết với một bảng trung tâm là `core_post` (thông qua `post_id`). Tuy nhiên, trong các file migration sếp vừa tạo chưa có file migration cho `core_post`. Em đề xuất **tạo thêm file migration cho `core_post`** để lưu trữ thông tin chung (title, description, content, slug, thumbnail, v.v.) của Page và Article. Nếu sếp đồng ý, em sẽ tạo file migration này.

> [!WARNING]
> **Về Khóa ngoại (Foreign Keys)**: Trong `data.sql`, các cột liên kết như `post_id`, `parent_id`, `gallery_id`, `picture_id` đang dùng kiểu `int(11)`. Trong Laravel, để làm khóa ngoại chuẩn liên kết với cột `id` (`bigint unsigned`), ta cần đổi chúng sang `$table->unsignedBigInteger('...')` hoặc `$table->foreignId('...')->constrained()`. Mong sếp xác nhận để em sửa toàn bộ các file migration cho đồng bộ.

## Proposed Changes

### 1. Cấu trúc Database (Dựa theo `data.sql`)

Dựa theo `data.sql`, ta sẽ cập nhật các file migrations hiện có để chuẩn hóa các cột.

#### `core_post` (Bảng trung tâm cần tạo thêm)
- **[NEW]** Tạo migration `create_core_post_table`. Bảng này lưu các thông tin cốt lõi: `title`, `slug`, `content`, `thumbnail`, `category_id` (liên kết category có sẵn), v.v.

#### `core_page` & `core_article`
- Cả hai bảng này đều đóng vai trò là phần mở rộng (metadata) cho `core_post`.
- **`core_page`**: Sửa cột `post_id` thành `unsignedBigInteger` và đặt khóa ngoại tham chiếu `core_post.id`. Giữ nguyên `parent_id`, `name`, `type`, `seo_url`, `css`, `custom_css`.
- **`core_article`**: Sửa cột `post_id` thành `unsignedBigInteger` tham chiếu `core_post.id`. Đổi `author_id` thành `unsignedBigInteger` tham chiếu đến bảng `users` có sẵn.

#### `core_block_content`
- Là các khối nội dung cấu thành nên một trang (hoặc một bài viết).
- **[MODIFY]**: Sửa `post_id` thành `unsignedBigInteger` tham chiếu `core_post.id`. (Một Page/Post có thể có nhiều Block).
- Giữ nguyên các trường phong phú từ `data.sql`: `config`, `image`, `background`, `type`, `title`, `content`, `language`...

#### `core_gallery` & `core_picture` & `core_gallery_pictures` (Thư viện Ảnh)
- **`core_gallery`**: Thư mục ảnh. Sửa `parent_id` thành `unsignedBigInteger` tham chiếu chính nó.
- **`core_picture`**: Chi tiết file ảnh. Thêm cột `gallery_id` (nếu ảnh nằm trong 1 thư mục mặc định).
- **`core_gallery_pictures`**: Bảng Pivot. Sửa `gallery_id` và `picture_id` thành `unsignedBigInteger` tham chiếu đến `core_gallery` và `core_picture`. Thêm các cột bổ sung từ `data.sql` như `image`, `link`, `sort_order`.

#### `core_menu`
- **[MODIFY]**: Sửa `parent` thành `parent_id` (tham chiếu `core_menu.id`) để tạo Nodetree. Sửa `author_id` (tham chiếu `users.id`).

#### `core_social_sharing`
- **[MODIFY]**: Đổi cột `post` thành `post_id` (tham chiếu `core_post.id`) và đúng kiểu dữ liệu.

---

### 2. Kế hoạch Kiến trúc Chức năng (CMS Admin)

#### 2.1. Quản lý Page, Article & Block (Kết hợp Realtime Preview)
- **Logic**: Khi tạo Page, hệ thống tạo 1 record trong `core_post` (chứa tiêu đề) và 1 record trong `core_page`. Page này sẽ chứa các Block (`core_block_content` có `post_id` bằng id của `core_post`).
- **Giao diện Editor (Inertia React)**:
  - Danh sách Block bên trái (Sortable list - kéo thả để đổi `sort_order`).
  - Màn hình Preview bên phải (render components dựa trên data JSON trả về).
- **Realtime Preview**:
  - Dữ liệu các Block lưu dưới dạng React State (`blocks`). Khi Edit 1 Block trong Modal (đổi Text, đổi Ảnh), State cập nhật lập tức -> Component bên phải Re-render Realtime.
  - Bấm "Save" thì gọi Axios gửi toàn bộ mảng `blocks` lên `BlockController` để update Database.

#### 2.2. Quản lý Thư viện Ảnh (Media & Modal Picker)
- Khi đang chỉnh sửa Block (ở chế độ Preview), bấm "Chọn ảnh" sẽ pop-up **MediaPicker Modal**.
- Modal này gọi API lấy danh sách ảnh từ `core_picture` và các thư mục từ `core_gallery`.
- Chức năng: Upload ảnh mới (lưu vào disk và `core_picture`), hoặc chọn ảnh cũ.
- Khi chọn, trả URL về Form của Block và trigger Realtime Preview.

#### 2.3. Quản lý Gallery (Slick Slider)
- Quản lý các bộ sưu tập ảnh tại bảng `core_gallery`.
- Gắn nhiều ảnh vào 1 Gallery thông qua `core_gallery_pictures`.
- Khi edit Block (loại Slider), user chỉ việc nhập/chọn ID của Gallery. Backend sẽ fetch list ảnh và Frontend gắn vào `react-slick`.

#### 2.4. Quản lý Menu (Node Tree)
- Giao diện kéo-thả để lồng ghép menu (Sử dụng thư viện Tree UI hoặc dnd-kit trong React).
- API update đồng loạt cấu trúc mảng lồng nhau, convert thành `parent_id` và `sort_order` lưu xuống `core_menu`.

## Verification Plan
1. **Migrations**: Xóa, tạo mới và sửa đổi các file migration để đảm bảo 100% Khóa Ngoại hợp lệ. Chạy `php artisan migrate:refresh`.
2. **Models**: Tạo đầy đủ Eloquent Models với các Relationship (`hasMany`, `belongsTo`, `belongsToMany`).
3. **UI/UX**: Đảm bảo tuân thủ Bootstrap 5 + `frontend.css` (Không dùng Tailwind). Xây dựng layout Admin CMS cho Page, Block, Media.
