<?php
// === FILE: app/Models/Order.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int $course_id
 * @property int|null $coupon_id
 * @property float $amount_original
 * @property float $discount_amount
 * @property float $amount_paid
 * @property float $commission_rate
 * @property float $commission_amount
 * @property float $seller_amount
 * @property string $status pending|completed|refunded
 * @property string $payment_method
 * @property string|null $refunded_at
 * @property string|null $refund_reason
 * @property User $user
 * @property Course $course
 * @property Coupon|null $coupon
 * @property \Illuminate\Database\Eloquent\Collection $couponUsages
 */
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
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
