<x-mail::message>
# Chúc mừng {{ $user->name }}! 🎉

Hồ sơ đăng ký làm Giảng viên của bạn đã được **PHÊ DUYỆT**. Bạn đã chính thức trở thành Giảng viên trên **EduFlow**.

Bây giờ bạn đã có thể truy cập vào trang Quản lý Giảng viên để tạo khóa học đầu tiên của mình.

<x-mail::button :url="route('seller.dashboard')">
Truy cập Seller Dashboard
</x-mail::button>

Chúc bạn có những khóa học thật bùng nổ,<br>
Đội ngũ {{ config('app.name') }}
</x-mail::message>
