<x-mail::message>
# Xin chào,

Ban quản trị hệ thống EduFlow thông báo rằng, **{{ $targetTypeLabel }}** của bạn với tiêu đề/nội dung:

> "{{ $targetName }}"

Đã bị **Gỡ Bỏ (Xóa)** khỏi hệ thống.

**Lý do từ Ban quản trị:** 
@if($resolveReason)
> {{ $resolveReason }}
@else
Nội dung của bạn đã nhận được các báo cáo vi phạm từ cộng đồng và sau khi xem xét, Ban quản trị nhận thấy nội dung này vi phạm Tiêu chuẩn Cộng đồng của chúng tôi (ngôn từ gây thù ghét, spam, hoặc nội dung không phù hợp).
@endif

Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.

Xin cảm ơn,
Ban quản trị {{ config('app.name') }}
</x-mail::message>
