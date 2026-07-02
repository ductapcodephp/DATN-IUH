<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerStudentBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'student_id',
        'reason'
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}