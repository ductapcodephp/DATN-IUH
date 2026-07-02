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
 * @property float $balance
 * @property User $user
 * @property \Illuminate\Database\Eloquent\Collection $transactions
 */
class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'balance',
    ];

    protected $casts = [
        'balance' => 'decimal:2', // Đảm bảo độ chính xác tuyệt đối, không dùng float gây sai số
    ];

    // ===== RELATIONSHIPS =====

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    // ===== SCOPES =====

    public function scopeWithBalance($query, $minBalance)
    {
        return $query->where('balance', '>=', $minBalance);
    }

    // ===== HELPERS ĐẲNG CẤP ENTERPRISE =====

    /**
     * Nạp tiền vào ví
     */
    public function deposit($amount, $description = null, $referenceCode = null)
    {
        // Bọc vào Transaction để đảm bảo tính toàn vẹn dữ liệu
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
            // Đẳng cấp ở đây: lockForUpdate() sẽ khóa hàng này trong DB lại.
            // Không một request nào khác được phép đọc số dư cho đến khi transaction này kết thúc.
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

        // Luôn lấy dữ liệu số dư mới nhất từ DB đã được lock
        $lockedWallet = self::where('id', $this->id)->lockForUpdate()->first();

        $balanceBefore = (float) $lockedWallet->balance;
        $amount = (float) $amount;

        // Sửa lại logic toán học bị loạn ở file cũ bằng cấu trúc Switch-Case tường minh
        switch ($type) {
            case WalletTransaction::TYPE_PURCHASE:
                $balanceAfter = $balanceBefore - $amount;
                break;

            case WalletTransaction::TYPE_DEPOSIT:
            case WalletTransaction::TYPE_REFUND: // Hoàn tiền thì phải CỘNG tiền lại cho user
            case WalletTransaction::TYPE_COMMISSION: // Tiền hoa hồng tiếp thị liên kết
            case WalletTransaction::TYPE_VIP_PAYMENT:
                $balanceAfter = $balanceBefore + $amount;
                break;

            default:
                throw new \InvalidArgumentException('Loại giao dịch không được hệ thống hỗ trợ: ' . $type);
        }

        // Cập nhật số dư mới vào ví
        $lockedWallet->update(['balance' => $balanceAfter]);

        // Ghi lại lịch sử biến động số dư (Audit Trail)
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
