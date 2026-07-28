<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreSetting extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_setting';

    protected $fillable = [
        'setting_key',
        'setting_value',
        'setting_type',
        'description',
        
    ];
}
