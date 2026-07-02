<?php
// === FILE: app/Models/Comment.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Kalnoy\Nestedset\NodeTrait; // 🚀 1. Nạp vũ khí tối tân vào đây

/**
 * @property int $id
 * @property int $user_id
 * @property int $lesson_id
 * @property int|null $parent_id
 * @property int $_lft
 * @property int $_rgt
 * @property string $content
 * @property bool $is_hidden
 * @property User $user
 * @property Lesson $lesson
 * @property Comment|null $parent
 * @property \Illuminate\Database\Eloquent\Collection $children
 */
class Comment extends Model
{
    use HasFactory, SoftDeletes, NodeTrait; // 🚀 2. Kích hoạt tính năng Cây cho Bình luận

    protected $fillable = [
        'user_id',
        'lesson_id',
        'parent_id', // Vẫn giữ để định vị quan hệ
        'content',
        'is_hidden',
    ];

    protected $casts = [
        'is_hidden' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    // 🔴 CHÚ Ý: ĐÃ XÓA hàm parent() và replies() cũ của ông.
    // Thư viện NodeTrait đã tự lo hàm parent() và children() rồi.
    // Lát nữa ở Frontend React, mớ bình luận con sẽ tự động nằm trong key đặt tên là `children` luôn nhé!

    // ===== SCOPES =====

    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeHidden($query)
    {
        return $query->where('is_hidden', true);
    }

    public function scopeTopLevel($query)
    {
        // Thay vì whereNull('parent_id'), dùng hàm chuẩn của thư viện để lấy các bình luận gốc
        return $query->whereIsRoot();
    }

    public function scopeReplies($query)
    {
        // Lấy tất cả các bình luận là câu trả lời
        return $query->whereIsChild();
    }

    public function scopeByLesson($query, $lessonId)
    {
        return $query->where('lesson_id', $lessonId);
    }

    // ===== HELPERS =====

    public function isReply(): bool
    {
        // Nếu không phải là gốc (Root) thì chắc chắn nó là bình luận phản hồi
        return !$this->isRoot();
    }

    public function countReplies(): int
    {
        // Đếm số câu trả lời trực tiếp cấp dưới của bình luận này
        return $this->children()->count();
    }
    
    /**
     * 🚀 ĐẾM TỔNG CỘNG TẤT CẢ PHẢN HỒI (Gồm cả con, cháu, chắt...)
     * Cái này cực kỳ hữu ích để hiển thị dạng: "35 bình luận" ở phía ngoài UI
     */
    public function countAllDescendants(): int
    {
        return $this->descendants()->count();
    }
}