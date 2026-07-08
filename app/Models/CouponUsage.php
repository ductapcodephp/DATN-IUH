<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $coupon_id
 * @property int $user_id
 * @property int $order_id
 * @property float $discount_applied
 * @property Coupon $coupon
 * @property User $user
 * @property Order $order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage byCoupon($couponId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage byOrder($orderId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage byUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage recent()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereDiscountApplied($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CouponUsage whereUserId($value)
 * @mixin \Eloquent
 */
class CouponUsage extends Model
{
    use HasFactory;

    protected $table = 'coupon_usages';

    protected $fillable = [
        'coupon_id',
        'user_id',
        'order_id',
        'discount_applied',
    ];

    protected $casts = [
        'discount_applied' => 'decimal:2',
    ];

    // ===== RELATIONSHIPS =====

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ===== SCOPES =====

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByCoupon($query, $couponId)
    {
        return $query->where('coupon_id', $couponId);
    }

    public function scopeByOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
