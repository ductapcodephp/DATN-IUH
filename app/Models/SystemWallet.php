<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemWallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'balance',
    ];

    /**
     * Helper để lấy ví hệ thống (luôn luôn là ID 1)
     */
    public static function getInstance(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            ['balance' => 0]
        );
    }

    public function addTransaction($amount, $type, $referenceType = null, $referenceId = null, $description = null)
    {
        if ($type === 'in') {
            $this->balance += (float) $amount;
        } elseif ($type === 'out') {
            $this->balance -= (float) $amount;
        }
        $this->save();

        SystemWalletTransaction::create([
            'amount' => $amount,
            'type' => $type,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'description' => $description,
        ]);
    }
}
