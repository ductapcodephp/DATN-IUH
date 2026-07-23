<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $seller_id
 * @property string $title
 * @property string $slug
 * @property string $description Course full description
 * @property string|null $thumbnail
 * @property numeric $price
 * @property numeric|null $original_price Price before discount
 * @property string $level
 * @property string $status
 * @property bool $is_free
 * @property int $total_lessons
 * @property int $total_duration_seconds
 * @property bool $is_vip Only VIP members can view
 * @property string|null $vip_expires_at VIP access expiration
 * @property array<array-key, mixed>|null $requirements Prerequisites array
 * @property array<array-key, mixed>|null $outcomes Learning outcomes array
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Category|null $category
 * @property-read Collection<int, Chapter> $chapters
 * @property-read int|null $chapters_count
 * @property-read Collection<int, Coupon> $coupons
 * @property-read int|null $coupons_count
 * @property-read Collection<int, CourseEnrollment> $enrollments
 * @property-read int|null $enrollments_count
 * @property-read Collection<int, Lesson> $lessons
 * @property-read int|null $lessons_count
 * @property-read Collection<int, Order> $orders
 * @property-read int|null $orders_count
 * @property-read Collection<int, CourseProgress> $progressRecords
 * @property-read int|null $progress_records_count
 * @property-read Collection<int, Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read User|null $seller
 * @property-read Collection<int, User> $students
 * @property-read int|null $students_count
 * @property-read Collection<int, Wishlist> $wishlists
 * @property-read int|null $wishlists_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course byCategory($categoryId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course bySeller($sellerId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course draft()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course free()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course hidden()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course level($level)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course paid()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course published()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course search($keyword)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course vip()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereIsFree($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereIsVip($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereOriginalPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereOutcomes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereRequirements($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereSellerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereThumbnail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereTotalDurationSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereTotalLessons($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereVipExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course withoutTrashed()
 *
 * @mixin \Eloquent
 */
class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'description', 'thumbnail', 'price',
        'original_price', 'level', 'status', 'is_free', 'is_vip',
        'requirements', 'outcomes', 'seller_id', 'category_id',
        'total_revenue', 'students_count',
    ];

    protected $casts = [
        'requirements' => 'array',
        'outcomes' => 'array',
        'is_free' => 'boolean',
        'is_vip' => 'boolean',
        'total_revenue' => 'decimal:2',
    ];

    /**
     * Khóa học thuộc về một Người bán (Seller)
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Khóa học thuộc về một Danh mục
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Danh sách các lượt đăng ký học của khóa học này
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class, 'course_id');
    }

    /**
     * Danh sách các Học viên đang tham gia khóa học này (Quan hệ nhiều - nhiều với User)
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_enrollments', 'course_id', 'student_id')
            ->withPivot(['progress', 'is_banned', 'ban_reason', 'banned_at'])
            ->withTimestamps();
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
