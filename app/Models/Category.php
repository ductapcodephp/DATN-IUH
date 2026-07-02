<?php
// === FILE: app/Models/Category.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Kalnoy\Nestedset\NodeTrait; // 🚀 1. Khai báo thư viện cây chính chủ ở đây

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $image
 * @property int|null $parent_id
 * @property int $_lft
 * @property int $_rgt
 * @property bool $is_active
 * @property Category|null $parent
 * @property \Illuminate\Database\Eloquent\Collection $children
 * @property \Illuminate\Database\Eloquent\Collection $courses
 */
class Category extends Model
{
    use HasFactory, NodeTrait; // 🚀 2. Nạp Trait quyền lực này vào để kích hoạt cơ chế Cây

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id', // Vẫn giữ parent_id để định vị cha con
        // LƯU Ý: Không cho _lft và _rgt vào đây để tránh người dùng nạp bậy làm hỏng cây
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    // 🔴 CHÚ Ý: ĐÃ XÓA hàm parent() và children() cũ của ông.
    // Vì NodeTrait nó đã tự định nghĩa 2 hàm này bằng thuật toán tối ưu của nó rồi.
    // Ông giữ lại là nó bị xung đột code (Override) chạy lỗi liền đó.

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    // ===== SCOPES =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeParent($query)
    {
        // Thay vì dùng ->whereNull('parent_id'), thư viện cung cấp sẵn scope chuẩn chỉ này:
        return $query->whereIsRoot(); 
    }

    public function scopeOrdered($query)
    {
        // Thuật toán cây sắp xếp thứ tự dựa vào cột `_lft`, dùng hàm mặc định này của thư viện luôn
        return $query->defaultOrder(); 
    }

    // ===== HELPERS =====

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('name') && !$model->isDirty('slug')) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    /**
     * 🚀 HÀM PHÁ ĐẢO N+1 QUERY: Lấy toàn bộ cây con của danh mục hiện tại
     */
    public function getChildrenRecursive()
    {
        // Thay vì dùng hàm cũ chạy tốn RAM và dính lỗi N+1: $this->children()->with('children')->get();
        // Hàm này của NestedSet quét 1 phát ăn ngay toàn bộ con cháu chắt chút chít của nó
        return $this->descendants()->get()->toTree();
    }
}