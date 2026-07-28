<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreGallery extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_gallery';

    protected $fillable = [
        'name',
        'type',
        'parent_id',
        'sort',
        
    ];

    public function parent()
    {
        return $this->belongsTo(CoreGallery::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CoreGallery::class, 'parent_id');
    }

    public function pictures()
    {
        return $this->belongsToMany(CorePicture::class, 'core_gallery_pictures', 'gallery_id', 'picture_id');
    }
}
