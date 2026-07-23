<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $course_id
 * @property int $seller_id
 * @property int $student_id
 * @property int $progress
 * @property bool $is_banned
 * @property string|null $ban_reason
 * @property Carbon|null $banned_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Course|null $course
 * @property-read User|null $seller
 * @property-read User|null $student
 *
 * @method static Builder<static>|CourseEnrollment active()
 * @method static Builder<static>|CourseEnrollment banned()
 * @method static Builder<static>|CourseEnrollment forSeller(int $sellerId)
 * @method static Builder<static>|CourseEnrollment newModelQuery()
 * @method static Builder<static>|CourseEnrollment newQuery()
 * @method static Builder<static>|CourseEnrollment onlyTrashed()
 * @method static Builder<static>|CourseEnrollment query()
 * @method static Builder<static>|CourseEnrollment whereBanReason($value)
 * @method static Builder<static>|CourseEnrollment whereBannedAt($value)
 * @method static Builder<static>|CourseEnrollment whereCourseId($value)
 * @method static Builder<static>|CourseEnrollment whereCreatedAt($value)
 * @method static Builder<static>|CourseEnrollment whereDeletedAt($value)
 * @method static Builder<static>|CourseEnrollment whereId($value)
 * @method static Builder<static>|CourseEnrollment whereIsBanned($value)
 * @method static Builder<static>|CourseEnrollment whereProgress($value)
 * @method static Builder<static>|CourseEnrollment whereSellerId($value)
 * @method static Builder<static>|CourseEnrollment whereStudentId($value)
 * @method static Builder<static>|CourseEnrollment whereUpdatedAt($value)
 * @method static Builder<static>|CourseEnrollment withTrashed(bool $withTrashed = true)
 * @method static Builder<static>|CourseEnrollment withoutTrashed()
 *
 * @mixin \Eloquent
 */
class CourseEnrollment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'seller_id',
        'student_id',
        'progress',
        'is_banned',
        'ban_reason',
        'banned_at',
    ];

    protected $casts = [
        'is_banned' => 'boolean',
        'progress' => 'integer',
        'banned_at' => 'datetime',
    ];

    /**
     * Lượt đăng ký này thuộc về Khóa học nào
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Lượt đăng ký này thuộc về Người bán (Seller) nào sở hữu
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Lượt đăng ký này thuộc về Học viên (Student) nào
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function scopeBanned(Builder $query): Builder
    {
        return $query->where('is_banned', true);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_banned', false);
    }

    public function scopeForSeller(Builder $query, int $sellerId): Builder
    {
        return $query->where('seller_id', $sellerId);
    }
}
