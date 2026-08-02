# Quy Trình Tích Hợp CMS (Trang & Block Động)

Tài liệu này mô tả chi tiết quy trình (workflow) để tạo mới, cấu hình và tích hợp một trang hoặc một block (khối nội dung) vào hệ thống CMS của EduFlow.

---

## 1. Tạo Frontend Component cho Block
Tạo React component cho block tại thư mục tương ứng với trang.
- **Đường dẫn**: `resources/js/Pages/Frontend/{Tên_Trang}/{Tên_Block}.jsx`
- **Lưu ý**: Component nên nhận prop `block` (chứa cấu hình tĩnh từ CMS như title, sub_title, description, image, button, url, ...) và các prop phụ (`extraData`) nếu cần dữ liệu động từ Controller (như mảng `courses`, `instructors`).
- Code component sử dụng `block?.title` thay vì fix cứng text để có thể thay đổi được từ CMS.

## 2. Đăng Ký Block trong Cấu Hình CMS
Khai báo block mới để hệ thống CMS nhận diện được.
- **File**: `config/cms_blocks.php`
- **Cách làm**:
  ```php
  'ten_type_cua_block' => [
      'name' => 'Tên hiển thị trong Admin (VD: Trang chủ: Khóa học nổi bật)',
      'kind' => 'static', // hoặc 'dynamic' nếu là danh sách lặp (như FAQ, Features)
      'backend' => 'CMS/BlockForms/GenericForm', // Form hiển thị trong admin lúc edit, có thể dùng form chung hoặc form riêng (ví dụ: CMS/BlockForms/Home/HomeHeroForm)
      'frontend' => 'Frontend/Trang/TenComponent', // Alias gợi nhớ, không bắt buộc đúng path vật lý
      'fields' => ['title', 'sub_title', 'description', 'image', 'button', 'url', 'listing_item'], // Khai báo các field sẽ dùng
  ],
  ```

## 3. Cập Nhật Block Renderer
`BlockRenderer` là trái tim của hệ thống CMS Frontend, nó làm nhiệm vụ ánh xạ từ `type` trong Database sang React Component thực tế.
- **File**: `resources/js/Pages/Frontend/Blocks/BlockRenderer.jsx`
- **Cách làm**:
  1. `import` component bạn vừa tạo ở bước 1 vào file này.
  2. Map key của block (giống trong `cms_blocks.php`) với Component ở mảng `blockComponents`.
  ```javascript
  import TenComponent from '@/Pages/Frontend/Trang/TenComponent';
  const blockComponents = {
      'ten_type_cua_block': TenComponent,
  };
  ```

## 4. Tích Hợp Vào Controller Của Trang (Frontend)
Đổ dữ liệu từ Database ra trang Frontend (hiển thị cho user).
- **File**: `app/Http/Controllers/Frontend/{Trang}Controller.php` (VD: `HomeController.php`, `AboutController.php`)
- **Cách làm**:
  1. Query `CorePage` theo `name` hoặc `slug` để lấy page, gọi kèm relations `post.blocks` đã active và order by `sort_order`.
  2. Nếu block cần dữ liệu động từ DB (không phải field tĩnh trong CMS), hãy query dữ liệu đó trong controller.
  3. Xử lý hàm map `$blocks` để đính kèm `listing_item` (cho các block dạng danh sách).
  4. Trả tất cả về Inertia.
Nhận dữ liệu từ Controller và render ra màn hình.
- **File**: `resources/js/Pages/Frontend/{Trang}/Index.jsx`
- **Cách làm**:
  ```javascript
  import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";

  export default function Index({ blocks = [], dynamicData1, dynamicData2 }) {
      return (
          <>
              {blocks.map(block => (
                  <BlockRenderer 
                      key={block.id} 
                      block={block} 
                      // extraData là nơi nhồi dữ liệu động từ Controller vào Component
                      extraData={{ dynamicData1, dynamicData2 }} 
                  />
              ))}
          </>
      );
  }
  ```

## 6. Cấu Hình CMS Preview (Cho Live Preview Trong Admin)
Nếu Component của block **bắt buộc phải có dữ liệu động từ Controller** (ví dụ: cần truyền mảng `courses` để render danh sách khóa học) thì Preview trong CMS sẽ bị lỗi nếu thiếu data này.
- **File**: `app/Http/Controllers/CMS/BlockController.php` (hàm `edit`)
- **Cách làm**:
  Kiểm tra `block->type`, nếu đúng type cần data, thực hiện query data đó và nhét vào biến `$extraData`.
  ```php
  $extraData = [];
  if ($block->type === 'ten_type_cua_block') {
      $extraData['dynamicData1'] = FetchDataFromService();
  }
  
  return Inertia::render($backendView, [
      'block' => $block,
      'isEditMode' => true,
      'extraData' => $extraData // Đẩy extraData xuống GenericForm/Preview
  ]);
  ```

## 7. Chạy Lại Build
Vì React (Vite) cần biên dịch lại các import mới. Mỗi khi đổi cấu trúc thư mục, thêm/bớt Component hoặc cấu hình import, **luôn luôn** phải chạy lệnh:
```bash
npm run build
```
Nếu build báo `✓ built in...` là mọi cấu hình đường dẫn đều chính xác. Lên giao diện test chức năng.

## 8. Xử Lý Chọn Ảnh & Media (Live Preview)
Để hệ thống CMS có thể chọn ảnh từ Media Library và tự động cập nhật Live Preview cũng như lưu thẳng vào Database, bạn KHÔNG cần tự code tay. Hệ thống đã có sẵn component `InlineEditableImage`.

- **Thành phần**: Sử dụng component `InlineEditableImage` thay cho thẻ `<img>` thông thường.
- **Cách sử dụng**:
  ```javascript
  import InlineEditableImage from '@/Components/CMS/InlineEditableImage';

  // Bên trong component:
  <InlineEditableImage 
      block={block} 
      property="image" // field name trong cột block_content tương ứng (image, image_2, ...)
      className="img-fluid" 
  />
  ```
- **Luồng hoạt động (Workflow)**:
  1. Trong Frontend (chế độ thường): Component tự động render thành thẻ `<img src="...">`. Nếu `src` trống, nó sẽ ẩn hoặc dùng ảnh mặc định.
  2. Trong Admin CMS (chế độ sửa): 
     - Nếu đã có ảnh: Component hiển thị ảnh kèm lớp phủ "Đổi Ảnh" khi hover.
     - Nếu chưa có ảnh: Component tự biến thành khung bấm "Thêm ảnh" nét đứt.
  3. Bấm vào ảnh/khung: Hiện Modal Media Library (component `MediaPickerModal`).
  4. Sau khi chọn/upload ảnh từ modal: 
     - Ảnh lập tức thay thế hiển thị thực tế trên màn hình Preview (DOM update).
     - Component tự động gửi request Axios về API `cms.block.updateProperty` để lưu link ảnh vào thẳng database, hiển thị thông báo Toast thành công.
