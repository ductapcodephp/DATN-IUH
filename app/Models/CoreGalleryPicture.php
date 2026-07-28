<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreGalleryPicture extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_gallery_pictures';

    protected $fillable = [
        'gallery_id',
        'picture_id',
        'image',
        'image_mobile',
        'link',
        'sort_order',
        'url_video',
        'title',
        'sub_title',
        'name',
        
    ];

    public function gallery()
    {
        return $this->belongsTo(CoreGallery::class, 'gallery_id');
    }

    public function picture()
    {
        return $this->belongsTo(CorePicture::class, 'picture_id');
    }
}
