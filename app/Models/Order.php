<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $course_id
 * @property int|null $coupon_id
 * @property numeric $amount_original Original course price
 * @property numeric $discount_amount Total discount from coupon
 * @property numeric $amount_paid Final amount paid
 * @property numeric $commission_rate Commission % at purchase time
 * @property numeric $commission_amount Commission for platform
 * @property numeric $seller_amount Amount paid to seller
 * @property string $status
 * @property string $payment_method wallet, vnpay, etc
 * @property Carbon|null $refunded_at
 * @property string|null $refund_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Coupon|null $coupon
 * @property-read Collection<int, CouponUsage> $couponUsages
 * @property-read int|null $coupon_usages_count
 * @property-read Course|null $course
 * @property-read User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order byCourse($courseId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order byPaymentMethod($method)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order byUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order refunded()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereAmountOriginal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereAmountPaid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCommissionAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCommissionRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereRefundReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereRefundedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereSellerAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereUserId($value)
 *
 * @mixin \Eloquent
 */
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'online_payment_id',
        'vip_package_id',
        'vip_subscription_id',
        'coupon_id',
        'amount_original',
        'discount_amount',
        'amount_paid',
        'commission_rate',
        'commission_amount',
        'seller_amount',
        'status',
        'payment_method',
        'refunded_at',
        'refund_reason',
    ];

    protected $casts = [
        'amount_original' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'seller_amount' => 'decimal:2',
        'refunded_at' => 'datetime',
    ];

    // ===== RELATIONSHIPS =====

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function onlinePayment(): BelongsTo
    {
        return $this->belongsTo(OnlinePayment::class);
    }

    public function vipPackage(): BelongsTo
    {
        return $this->belongsTo(VipPackage::class);
    }

    public function vipSubscription(): BelongsTo
    {
        return $this->belongsTo(VipSubscription::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function couponUsages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    // ===== SCOPES =====

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    public function scopeByPaymentMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    // ===== HELPERS =====

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    public function canRefund(): bool
    {
        return $this->isCompleted() && now()->diffInDays($this->created_at) <= 30;
    }
}
