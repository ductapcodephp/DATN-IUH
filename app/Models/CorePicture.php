<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CorePicture extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_picture';

    protected $fillable = [
        'gallery_id',
        'image',
        'image_mobile',
        'link',
        'sort_order',
        'url_video',
        'description',
        'name',
        'file_name',
        'original_name',
        'file_size',
        'mime_type',
        
    ];

    public function gallery()
    {
        return $this->belongsTo(CoreGallery::class, 'gallery_id');
    }

    public function galleries()
    {
        return $this->belongsToMany(CoreGallery::class, 'core_gallery_pictures', 'picture_id', 'gallery_id')
            ->withPivot('sort_order', 'image', 'link')
            ->orderByPivot('sort_order');
    }
}
