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
        'balance_available',
        'balance_pending',
    ];

    protected $casts = [
        'balance'           => 'decimal:2',
        'balance_available' => 'decimal:2',
        'balance_pending'   => 'decimal:2',
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
    public function withdraw($amount, $description = null, $type = WalletTransaction::TYPE_PURCHASE)
    {
        return DB::transaction(function () use ($amount, $description, $type) {
            $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

            if ((float) $lockedWallet->balance < (float) $amount) {
                throw new \Exception('Số dư tài khoản không đủ để thực hiện giao dịch.');
            }

            return $lockedWallet->addTransaction($type, $amount, $description, WalletTransaction::STATUS_COMPLETED);
        });
    }

    /**
     * [SELLER] Ghi nhận tiền thu nhập đang chờ giải phóng (sau khi khách mua khóa học)
     * Tiền vào balance_pending, chưa cộng vào balance chính.
     */
    public function addPendingEarning(float $amount, int $orderId, string $description = null): WalletTransaction
    {
        return DB::transaction(function () use ($amount, $orderId, $description) {
            $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

            // Cộng vào balance_pending
            $lockedWallet->increment('balance_pending', $amount);
            $lockedWallet->refresh();

            return WalletTransaction::create([
                'wallet_id'      => $lockedWallet->id,
                'order_id'       => $orderId,
                'user_id'        => $lockedWallet->user_id,
                'type'           => WalletTransaction::TYPE_EARNING,
                'amount'         => $amount,
                'balance_before' => (float) $lockedWallet->balance_pending - $amount,
                'balance_after'  => (float) $lockedWallet->balance_pending,
                'description'    => $description ?? 'Thu nhập từ bán khóa học (đang chờ giải phóng)',
                'reference_code' => 'EARN_ORDER_' . $orderId,
                'status'         => WalletTransaction::STATUS_PENDING,
            ]);
        });
    }

    /**
     * [SELLER] Giải phóng tiền pending → available (sau 7 ngày, trừ hoa hồng)
     * Được gọi bởi scheduled command ReleaseSellerEarnings.
     *
     * @param WalletTransaction $pendingTx  Giao dịch earning đang pending
     * @param float             $commissionAmount Số tiền hoa hồng cần trừ (lấy từ orders.commission_amount)
     * @param float             $sellerAmount     Số tiền thực seller nhận (orders.seller_amount)
     */
    public function releaseEarning(WalletTransaction $pendingTx, float $commissionAmount, float $sellerAmount): void
    {
        DB::transaction(function () use ($pendingTx, $commissionAmount, $sellerAmount) {
            $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

            // Trừ khỏi balance_pending
            $lockedWallet->decrement('balance_pending', (float) $pendingTx->amount);

            // Cộng seller_amount vào balance_available và balance chính
            $availableBefore = (float) $lockedWallet->fresh()->balance_available;
            $lockedWallet->increment('balance_available', $sellerAmount);
            $lockedWallet->increment('balance', $sellerAmount);

            $walletAfterRelease = $lockedWallet->fresh();

            // Đánh dấu giao dịch earning gốc là completed
            // Lưu ý: WalletTransaction có guard chống update khi completed,
            // nên ta dùng DB::table để bypass guard an toàn cho trường hợp này.
            DB::table('wallet_transactions')
                ->where('id', $pendingTx->id)
                ->update([
                    'status'     => WalletTransaction::STATUS_COMPLETED,
                    'updated_at' => now(),
                    'metadata'   => json_encode([
                        'commission_amount' => $commissionAmount,
                        'seller_amount'     => $sellerAmount,
                        'released_at'       => now()->toISOString(),
                    ]),
                ]);
        });
    }

    /**
     * [SELLER] Rút tiền từ balance_available
     */
    public function withdrawAvailable(float $amount, string $description = null): WalletTransaction
    {
        return DB::transaction(function () use ($amount, $description) {
            $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

            if ((float) $lockedWallet->balance_available < $amount) {
                throw new \Exception('Số dư khả dụng không đủ để thực hiện yêu cầu rút tiền.');
            }

            $balanceBefore = (float) $lockedWallet->balance;

            $lockedWallet->decrement('balance_available', $amount);
            $lockedWallet->decrement('balance', $amount);

            $lockedWallet->refresh();

            return WalletTransaction::create([
                'wallet_id'      => $lockedWallet->id,
                'user_id'        => $lockedWallet->user_id,
                'type'           => WalletTransaction::TYPE_WITHDRAWAL,
                'amount'         => $amount,
                'balance_before' => $balanceBefore,
                'balance_after'  => (float) $lockedWallet->balance,
                'description'    => $description ?? 'Rút tiền về tài khoản ngân hàng',
                'status'         => WalletTransaction::STATUS_COMPLETED,
            ]);
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
            case WalletTransaction::TYPE_VIP_PAYMENT:
                $balanceAfter = $balanceBefore - $amount;
                $lockedWallet->decrement('balance_available', $amount);
                break;

            case WalletTransaction::TYPE_DEPOSIT:
            case WalletTransaction::TYPE_REFUND:
                $balanceAfter = $balanceBefore + $amount;
                $lockedWallet->increment('balance_available', $amount);
                break;
                
            case WalletTransaction::TYPE_COMMISSION:
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
