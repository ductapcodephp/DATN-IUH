<x-mail::message>
# Chào {{ $user->name }},

Rất tiếc phải thông báo rằng hồ sơ đăng ký làm Giảng viên của bạn trên **EduFlow** chưa thể được phê duyệt.

**Lý do từ chối:**
> {{ $reason }}

Bạn có thể đăng nhập vào hệ thống, truy cập lại trang Đăng ký Giảng viên để cập nhật lại thông tin hồ sơ và gửi yêu cầu xét duyệt lại.

<x-mail::button :url="route('apply-seller.show')">
Cập nhật lại Hồ sơ
</x-mail::button>

Trân trọng,<br>
Đội ngũ {{ config('app.name') }}
</x-mail::message>
