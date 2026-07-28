<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CorePost extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_post';

    protected $fillable = [
        'category_id',
        'gallery_id',
        'url',
        'slug',
        'sort_order',
        'is_hot',
        'is_new',
        'post_type',
        'published',
        'tags',
        'config',
        'title',
        'sub_title',
        'thumbnail',
        'description',
        'content',
        
    ];

    protected $casts = [
        'tags' => 'array',
        'config' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function gallery()
    {
        return $this->belongsTo(CoreGallery::class, 'gallery_id');
    }

    public function blocks()
    {
        return $this->hasMany(CoreBlockContent::class, 'post_id');
    }

    public function pages()
    {
        return $this->hasMany(CorePage::class, 'post_id');
    }

    public function articles()
    {
        return $this->hasMany(CoreArticle::class, 'post_id');
    }

    public function socialSharing()
    {
        return $this->hasOne(CoreSocialSharing::class, 'post_id');
    }
}
