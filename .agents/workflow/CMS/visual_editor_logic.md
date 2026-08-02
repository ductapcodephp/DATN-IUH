# Logic của Visual Editor (Block Preview) trong CMS

Tài liệu này giải thích cách hoạt động của tính năng Visual Editor (Live Edit), lấy `StoryBlock` làm ví dụ cụ thể để hiểu luồng dữ liệu từ Frontend đến Backend.

## 1. Bức tranh tổng thể (Luồng dữ liệu)

1. **Database & Config**: Backend lưu dữ liệu của block trong DB (title, description, và json `content`). `config/cms_blocks.php` định nghĩa block này sẽ dùng Form Component nào (ví dụ: `AboutStoryForm`).
2. **Controller**: Trả về giao diện Inertia (React) với prop là cục data của `block`.
3. **Form Component (`AboutStoryForm.jsx`)**: Nhận data, truyền vào một wrapper chung tên là `BaseBlockForm`.
4. **BaseBlockForm.jsx**: Đóng vai trò là "Cái vỏ" (khung viền, nút quay lại, thông báo auto-save) và chứa logic gọi API lưu dữ liệu. Nó render ra Component thật của block (ví dụ `StoryBlock`) và truyền xuống cờ `editable={true}` cùng với hàm `onChange`.
5. **Block Component (`StoryBlock.jsx`)**: Thành phần hiển thị thực tế. Dựa vào cờ `editable`, nó sẽ bật tính năng cho phép sửa trực tiếp (thông qua `InlineEditable`) hoặc hiển thị nút Thêm/Xóa danh sách.
6. **Lưu dữ liệu**: Khi người dùng sửa và bấm lưu (hoặc click ra ngoài), `onChange` được gọi -> truyền ngược lên `BaseBlockForm` -> gọi API lên backend -> Backend cập nhật DB.

---

## 2. Chi tiết các thành phần

### A. Cấu hình & Wrapper (`BaseBlockForm.jsx`)
`BaseBlockForm` nhận vào `PreviewComponent` (chính là `StoryBlock`).
Hàm `handleBlockChange` trong file này có nhiệm vụ gọi API:
```javascript
const handleBlockChange = async (property, value) => {
    // Gọi API updateProperty
    await axios.post(route('cms.block.updateProperty', block.id), { property, value });
};
```
Nó render component của bạn như sau:
```jsx
<PreviewComponent block={block} editable={true} onChange={handleBlockChange} />
```

### B. InlineEditable (`InlineEditable.jsx`)
Đây là một component "Phép thuật". Nó đóng vai trò như một thẻ HTML bình thường (h1, p, div) khi ở ngoài Frontend.
Nhưng khi có cờ `editable={true}`, nó sẽ thêm thuộc tính `contentEditable="true"`.
Khi người dùng gõ chữ và click chuột ra chỗ khác (`onBlur`), nó sẽ lấy text mới và gọi hàm `onSave(newText)`.

### C. Block Component (`StoryBlock.jsx`)

Trong `StoryBlock`, chúng ta xử lý 2 loại dữ liệu: **Dữ liệu đơn (Text/HTML)** và **Dữ liệu mảng (Listing / Array)**.

#### Xử lý Dữ liệu Đơn (như Title, SubTitle, Description)
Thay vì dùng thẻ `<h2>{block.title}</h2>`, chúng ta xài `InlineEditable`:
```jsx
<InlineEditable
    block={block}
    property="title"
    value={block?.title || "Mặc định"}
    as="h2"
    className="fw-bold display-5 mb-3"
    onSave={editable ? (val) => onChange && onChange('title', val) : null}
/>
```
- Khi user click vào thẻ H2 và sửa, `InlineEditable` sẽ bắt sự kiện và gọi `onChange('title', 'Nội dung mới')`.
- Hàm `onChange` này chính là `handleBlockChange` của `BaseBlockForm`, nó sẽ gọi API lưu ngay lập tức (Auto-save).

#### Xử lý Dữ liệu Mảng (Listing Item)
Ví dụ "Tầm nhìn" và "Giá trị cốt lõi" được lưu thành 1 mảng JSON trong cột `content.listingItem`. Auto-save từng chữ ở đây không hợp lý vì có thể gây lỗi hoặc call API quá nhiều khi thêm/xóa. Do đó, logic khác biệt một chút:

1. **Đưa vào State cục bộ**: 
   Khi block load lên, ta đưa mảng đó vào State của React.
   ```javascript
   const [items, setItems] = useState([]);
   useEffect(() => setItems(block?.content?.listingItem || []), [block]);
   ```
2. **Thay đổi State cục bộ**:
   Khi user gõ vào 1 ô, hoặc khi user chọn Icon từ `IconPicker`, ta chỉ cập nhật state `items` và bật cờ `isDirty = true` (Báo hiệu có thay đổi chưa lưu).
   ```javascript
   const handleItemChange = (index, key, newValue) => {
       const newItems = [...items];
       newItems[index][key] = newValue;
       setItems(newItems);
       setIsDirty(true); 
   };
   ```
3. **Nút Lưu Thủ Công**:
   Chỉ khi user bấm nút "Lưu thay đổi danh sách", ta mới đẩy toàn bộ mảng `items` lên `onChange`.
   ```jsx
   const handleSaveListing = () => {
       onChange('listing_item', items);
       setIsDirty(false);
   };
   ```
4. **Giao diện dành riêng cho Admin (Dựa vào cờ `editable`)**:
   Bạn sẽ thấy rất nhiều đoạn code kiểm tra `if (editable)`. Nếu là Admin đang sửa, ta sẽ render thêm các nút xóa (X), nút thêm (Thêm Listing), nút Lưu, khung viền đứt quãng (dashed border). Nếu ở ngoài trang chủ (`editable={false}`), các nút này bị giấu đi hoàn toàn.

---

## 3. Tóm lược quá trình tích hợp một Block mới vào Visual Editor

Nếu bạn muốn làm một Block mới (Ví dụ: `FAQBlock.jsx`), bạn cần làm theo các bước sau:
1. **Tạo Component Block**: Nhận props `block`, `editable`, `onChange`.
2. **Thay thẻ HTML bằng `<InlineEditable>`**: Các cục text tĩnh, hãy bọc lại bằng `<InlineEditable>`.
3. **Xử lý mảng (nếu có)**: Dùng `useState` để lưu mảng, map mảng ra giao diện. Gắn thêm nút Thêm/Xóa/Lưu mảng. 
4. **Tạo Form Wrapper**: Tạo file `FAQForm.jsx` gọi `<BaseBlockForm PreviewComponent={FAQBlock} />`.
5. **Khai báo vào Backend**: Đưa tên Block và Form vào `config/cms_blocks.php`. 

Bằng cách này, cùng một file `FAQBlock.jsx` có thể được tái sử dụng: Vừa làm giao diện hiển thị cho khách hàng ở frontend, vừa làm trình chỉnh sửa trực tiếp cực kỳ trực quan cho Admin ở backend.
