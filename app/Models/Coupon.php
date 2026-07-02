<?php
// === FILE: app/Models/Coupon.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int|null $seller_id
 * @property string $code
 * @property string $type percent|fixed
 * @property float $value
 * @property float|null $min_order_amount
 * @property float|null $max_discount_amount
 * @property int|null $max_uses
 * @property int $used_count
 * @property int|null $course_id
 * @property string|null $starts_at
 * @property string|null $expires_at
 * @property bool $is_active
 * @property User|null $seller
 * @property Course|null $course
 * @property \Illuminate\Database\Eloquent\Collection $usages
 */
class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'code',
        'type',
        'value',
        'min_order_amount',
        'max_discount_amount',
        'max_uses',
        'used_count',
        'course_id',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // ===== RELATIONSHIPS =====

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    // ===== SCOPES =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePercent($query)
    {
        return $query->where('type', 'percent');
    }

    public function scopeFixed($query)
    {
        return $query->where('type', 'fixed');
    }

    public function scopeForCourse($query, $courseId)
    {
        return $query->where(function ($q) use ($courseId) {
            $q->whereNull('course_id')
              ->orWhere('course_id', $courseId);
        });
    }

    public function scopeValidNow($query)
    {
        return $query->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('starts_at')
                          ->orWhere('starts_at', '<=', now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>=', now());
                    });
    }

    public function scopeAvailable($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('max_uses')
              ->orWhereRaw('used_count < max_uses');
        });
    }

    // ===== HELPERS =====

    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        
        if ($this->starts_at && $this->starts_at > now()) return false;
        if ($this->expires_at && $this->expires_at < now()) return false;
        
        if ($this->max_uses && $this->used_count >= $this->max_uses) return false;
        
        return true;
    }

    public function canUse(): bool
    {
        return $this->isValid();
    }

    public function hasReachedMaxUses(): bool
    {
        return $this->max_uses && $this->used_count >= $this->max_uses;
    }

    public function calculateDiscount($orderAmount)
    {
        if (!$this->isValid()) {
            return 0;
        }

        if ($this->min_order_amount && $orderAmount < $this->min_order_amount) {
            return 0;
        }

        $discount = 0;
        if ($this->type === 'percent') {
            $discount = ($orderAmount * $this->value) / 100;
        } else {
            $discount = $this->value;
        }

        // Cap discount at max_discount_amount
        if ($this->max_discount_amount) {
            $discount = min($discount, $this->max_discount_amount);
        }

        return $discount;
    }

    public function use()
    {
        if ($this->canUse()) {
            $this->increment('used_count');
        }
    }
}
