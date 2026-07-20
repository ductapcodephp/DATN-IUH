<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $wallet_id
 * @property int $user_id
 * @property string $type Transaction type
 * @property numeric $amount Transaction amount in VND
 * @property numeric $balance_before Balance before transaction
 * @property numeric $balance_after Balance after transaction
 * @property string|null $description
 * @property string|null $reference_code Reference code (VNPay, order ID, etc)
 * @property string $status
 * @property array<array-key, mixed>|null $metadata Additional data like VNPay response
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @property-read \App\Models\Wallet $wallet
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction byType(string $type)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction commissions()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction deposits()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction failed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction refunds()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereBalanceAfter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereBalanceBefore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereReferenceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereWalletId($value)
 * @mixin \Eloquent
 */
class WalletTransaction extends Model
{
    use HasFactory;

    public const TYPE_DEPOSIT = 'deposit';
    public const TYPE_PURCHASE = 'purchase';
    public const TYPE_REFUND = 'refund';
    public const TYPE_COMMISSION = 'commission';
    public const TYPE_VIP_PAYMENT = 'vip_payment';

    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'wallet_id',
        'user_id',
        'type',
        'amount',
        'balance_before',
        'balance_after',
        'description',
        'reference_code',
        'status',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'json',
    ];

    protected static function boot()
    {
        parent::boot();

        static::updating(function (self $transaction) {
            $originalStatus = $transaction->getOriginal('status');

            if (in_array($originalStatus, [self::STATUS_COMPLETED, self::STATUS_FAILED], true)) {
                throw new \Exception('Security Exception: Không thể chỉnh sửa giao dịch tài chính đã đóng băng!');
            }
        });

        static::deleting(function (self $transaction) {
            throw new \Exception('Security Exception: Tuyệt đối không được xóa lịch sử giao dịch tài chính!');
        });
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    public function scopeDeposits($query)
    {
        return $query->where('type', self::TYPE_DEPOSIT);
    }

    public function scopeCommissions($query)
    {
        return $query->where('type', self::TYPE_COMMISSION);
    }

    public function scopeRefunds($query)
    {
        return $query->where('type', self::TYPE_REFUND);
    }


    public function getFormattedAmount(): string
    {
        return number_format((float) $this->amount, 0, ',', '.') . ' đ';
    }
   
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getGatewayTransactionId(): ?string
    {
        return $this->metadata['gateway_transaction_id'] ?? null;
    }
}
