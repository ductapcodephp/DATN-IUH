<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WalletBonus extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'min_amount',
        'bonus_percentage',
        'max_bonus_amount',
        'is_active',
    ];
}
