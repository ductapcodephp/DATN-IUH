<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletBonus extends Model
{
    protected $fillable = [
        'min_amount',
        'bonus_percentage',
        'max_bonus_amount',
        'is_active',
    ];
}
