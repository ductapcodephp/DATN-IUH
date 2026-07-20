<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;


/**
 * @property int $id
 * @property int $user_id
 * @property numeric $balance Wallet balance in VND
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletTransaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet withBalance($minBalance)
 * @mixin \Eloquent
 */
class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'balance',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }


    public function scopeWithBalance($query, $minBalance)
    {
        return $query->where('balance', '>=', $minBalance);
    }


    /**
     * Nạp tiền vào ví
     */
    public function deposit($amount, $description = null, $referenceCode = null)
    {
        return DB::transaction(function () use ($amount, $description, $referenceCode) {
            return $this->addTransaction(WalletTransaction::TYPE_DEPOSIT, $amount, $description, WalletTransaction::STATUS_COMPLETED, $referenceCode);
        });
    }

    /**
     * Rút tiền / Thanh toán mua hàng (Bảo mật chống Race Condition)
     */
    public function withdraw($amount, $description = null)
    {
        return DB::transaction(function () use ($amount, $description) {
            $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

            if ((float) $lockedWallet->balance < (float) $amount) {
                throw new \Exception('Số dư tài khoản không đủ để thực hiện giao dịch.');
            }

            return $lockedWallet->addTransaction(WalletTransaction::TYPE_PURCHASE, $amount, $description, WalletTransaction::STATUS_COMPLETED);
        });
    }

    /**
     * Hàm xử lý biến động số dư lõi - Chính xác và an toàn tuyệt đối
     */
    public function addTransaction($type, $amount, $description = null, $status = 'pending', $referenceCode = null)
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Số tiền giao dịch phải lớn hơn 0.');
        }

        $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

        $balanceBefore = (float) $lockedWallet->balance;
        $amount = (float) $amount;

        switch ($type) {
            case WalletTransaction::TYPE_PURCHASE:
                $balanceAfter = $balanceBefore - $amount;
                break;

            case WalletTransaction::TYPE_DEPOSIT:
            case WalletTransaction::TYPE_REFUND:
            case WalletTransaction::TYPE_COMMISSION:
            case WalletTransaction::TYPE_VIP_PAYMENT:
                $balanceAfter = $balanceBefore + $amount;
                break;

            default:
                throw new \InvalidArgumentException('Loại giao dịch không được hệ thống hỗ trợ: ' . $type);
        }

        $lockedWallet->update(['balance' => $balanceAfter]);

        return WalletTransaction::create([
            'wallet_id' => $lockedWallet->id,
            'user_id' => $lockedWallet->user_id,
            'type' => $type,
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $balanceAfter,
            'description' => $description,
            'reference_code' => $referenceCode,
            'status' => $status,
        ]);
    }
}
