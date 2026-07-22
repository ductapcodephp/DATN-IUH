<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyStatistic extends Model
{
    protected $fillable = [
        'seller_id',
        'date',
        'total_revenue',
        'total_orders'
    ];

    protected $casts = [
        'date' => 'date',
        'total_revenue' => 'decimal:2',
        'total_orders' => 'integer'
    ];
}
