<?php

// === FILE: app/Models/Course.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $seller_id
 * @property int $category_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string|null $thumbnail
 * @property float $price
 * @property float|null $original_price
 * @property float $total_revenue <-- Thêm vào Docblock để gợi ý code tốt hơn
 * @property string $level beginner|intermediate|advanced
 * @property string $status draft|published|hidden
 * @property bool $is_free
 * @property int $total_lessons
 * @property int $total_duration_seconds
 * @property bool $is_vip
 * @property string|null $vip_expires_at
 * @property array|null $requirements
 * @property array|null $outcomes
 * @property User $seller
 * @property Category $category
 * @property Collection $chapters
 * @property Collection $lessons
 * @property Collection $orders
 * @property Collection $reviews
 * @property Collection $coupons
 */
class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'description', 'thumbnail', 'price',
        'original_price', 'level', 'status', 'is_free', 'is_vip',
        'requirements', 'outcomes', 'seller_id', 'category_id',
        'total_revenue', // <-- Sửa lỗi cú pháp: Phải bọc trong dấu nháy đơn hoặc kép
    ];

    protected $casts = [
        'requirements' => 'array',
        'outcomes' => 'array',
        'is_free' => 'boolean',
        'is_vip' => 'boolean',
        'total_revenue' => 'decimal:2', // <-- Ép kiểu thành số thập phân khi lấy ra
    ];

    // ===== RELATIONSHIPS =====

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->orderBy('sort_order');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }

    public function progressRecords(): HasMany
    {
        return $this->hasMany(CourseProgress::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    // ===== SCOPES =====

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeHidden($query)
    {
        return $query->where('status', 'hidden');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFree($query)
    {
        return $query->where('is_free', true);
    }

    public function scopePaid($query)
    {
        return $query->where('is_free', false);
    }

    // Sửa 1 nơi, cả hệ thống tự động chạy theo logic mới!
    public function scopeVip($query)
    {
        return $query->where('is_vip', true)
            ->where(function ($q) {
                $q->whereNull('vip_expires_at')
                    ->orWhere('vip_expires_at', '>', now());
            });
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeBySeller($query, $sellerId)
    {
        return $query->where('seller_id', $sellerId);
    }

    public function scopeLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    public function scopeSearch($query, $keyword)
    {
        return $query->where('title', 'LIKE', "%{$keyword}%")
            ->orWhere('description', 'LIKE', "%{$keyword}%");
    }

    // ===== HELPERS =====

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('title') && ! $model->isDirty('slug')) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

    public function getAverageRating()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    public function getStudentCount()
    {
        return $this->orders()->where('status', 'completed')->count();
    }

    /**
     * 🚀 Hàm lấy doanh thu siêu tốc từ cột lưu trữ sẵn
     */
    public function getTotalRevenue()
    {
        return $this->total_revenue ?? 0;
    }

    public function isDiscounted()
    {
        return $this->original_price && $this->original_price > $this->price;
    }

    public function getDiscountPercentage()
    {
        if (! $this->isDiscounted()) {
            return 0;
        }

        return round((($this->original_price - $this->price) / $this->original_price) * 100);
    }
}
