<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreBlockContent extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_block_content';

    protected $fillable = [
        'post_id',
        'sort_order',
        'config',
        'status',
        'slug',
        'image_icon',
        'image',
        'image_mobile',
        'background',
        'mobile_background',
        'type',
        'text_icon',
        'url',
        'location',
        'video_url',
        'kind',
        'title',
        'sub_title',
        'description',
        'content',
        'thumbnail',
        'button',
        'language',
        
    ];

    protected $casts = [
        'config' => 'array',
    ];

    public function post()
    {
        return $this->belongsTo(CorePost::class, 'post_id');
    }
}
