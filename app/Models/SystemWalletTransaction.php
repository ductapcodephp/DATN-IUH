<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemWalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'type',
        'reference_type',
        'reference_id',
        'description',
    ];
}
