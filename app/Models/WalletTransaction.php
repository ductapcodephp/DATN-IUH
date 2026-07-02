<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class WalletTransaction extends Model
{
    use HasFactory;

    // =========================================================================
    // CONSTANTS (Chuẩn hóa Enum cho các chuỗi dữ liệu, tránh gõ sai string)
    // =========================================================================
    public const TYPE_DEPOSIT = 'deposit';
    public const TYPE_PURCHASE = 'purchase';
    public const TYPE_REFUND = 'refund';
    public const TYPE_COMMISSION = 'commission';
    public const TYPE_VIP_PAYMENT = 'vip_payment';

    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'uuid', // Thêm UUID bảo mật định danh giao dịch
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

    // =========================================================================
    // BOOT METHOD (Tự động hóa hành vi an toàn hệ thống)
    // =========================================================================
    protected static function boot()
    {
        parent::boot();

        // 1. Tự động sinh chuỗi UUID ngẫu nhiên không thể đoán trước khi tạo giao dịch
        static::creating(function (self $transaction) {
            if (empty($transaction->uuid)) {
                $transaction->uuid = (string) Str::uuid();
            }
        });

        // 2. CƠ CHẾ KHÓA DỮ LIỆU TỐI CAO (Immutable Giao dịch)
        // Nếu giao dịch đã hoàn thành hoặc thất bại, chặn đứng mọi hành vi update thủ công sau đó.
        static::updating(function (self $transaction) {
            $originalStatus = $transaction->getOriginal('status');

            if (in_array($originalStatus, [self::STATUS_COMPLETED, self::STATUS_FAILED], true)) {
                throw new \Exception('Security Exception: Không thể chỉnh sửa giao dịch tài chính đã đóng băng!');
            }
        });

        // 3. Chặn đứng hành vi xóa lịch sử tài chính (Kể cả xóa nhầm)
        static::deleting(function (self $transaction) {
            throw new \Exception('Security Exception: Tuyệt đối không được xóa lịch sử giao dịch tài chính!');
        });
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // =========================================================================
    // SCOPES (Đã được viết lại ngắn gọn bằng Constants)
    // =========================================================================
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

    // =========================================================================
    // ENTERPRISE HELPERS (Các hàm tiện ích định dạng dữ liệu)
    // =========================================================================

    /**
     * Trả về số tiền được format đẹp theo đơn vị tiền tệ (Ví dụ: 500,000đ hoặc $500.00)
     */
    public function getFormattedAmount(): string
    {
        // number_format($số, $số_thập_phân, $dấu_ngăn_cách_thập_phân, $dấu_ngăn_cách_hàng_nghìn)
        return number_format((float) $this->amount, 0, ',', '.') . ' đ';
    }
    /**
     * Kiểm tra nhanh trạng thái giao dịch
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Trích xuất nhanh dữ liệu từ cổng thanh toán trong Metadata (Ví dụ: mã giao dịch Momo/VNPAY)
     */
    public function getGatewayTransactionId(): ?string
    {
        return $this->metadata['gateway_transaction_id'] ?? null;
    }
}
