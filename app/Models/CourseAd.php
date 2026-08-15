<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseAd extends Model
{
    protected $fillable = [
        'course_id',
        'user_id',
        'bid_price',
        'daily_budget',
        'campaign_balance',
        'spent_today',
        'clicks',
        'impressions',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
