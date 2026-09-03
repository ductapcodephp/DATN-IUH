<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class DistributedCoupon extends Model
{
    use HasFactory;

    protected $table = 'distributed_coupons';

    protected $fillable = [
        'coupon_id',
        'user_id',
        'vip_package_id',
        'vip_subscription_id',
        'code',
        'is_used',
        'used_at',
        'order_id',
        'expires_at',
        'distributed_at',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'used_at' => 'datetime',
        'expires_at' => 'datetime',
        'distributed_at' => 'datetime',
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

    public function vipPackage(): BelongsTo
    {
        return $this->belongsTo(VipPackage::class);
    }

    public function vipSubscription(): BelongsTo
    {
        return $this->belongsTo(VipSubscription::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ===== SCOPES =====

    public function scopeUnused($query)
    {
        return $query->where('is_used', false);
    }

    public function scopeUsed($query)
    {
        return $query->where('is_used', true);
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    public function scopeValid($query)
    {
        return $query->where('is_used', false)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            });
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ===== HELPERS =====

    public function isValid(): bool
    {
        if ($this->is_used) {
            return false;
        }

        if ($this->expires_at && $this->expires_at < now()) {
            return false;
        }

        return true;
    }

    public function markAsUsed(int $orderId): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => now(),
            'order_id' => $orderId,
        ]);
    }

    /**
     * Tạo mã code ngẫu nhiên duy nhất
     */
    public static function generateUniqueCode(string $prefix = 'VIP'): string
    {
        do {
            $code = $prefix . '-' . strtoupper(Str::random(8));
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
