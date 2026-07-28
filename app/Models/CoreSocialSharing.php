<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreSocialSharing extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_social_sharing';

    protected $fillable = [
        'post_id',
        'google_title',
        'google_description',
        'google_tag',
        'facebook_title',
        'facebook_description',
        'facebook_thumbnail',
        
    ];

    protected $casts = [
        'google_tag' => 'array',
    ];

    public function post()
    {
        return $this->belongsTo(CorePost::class, 'post_id');
    }
}
