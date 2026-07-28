<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CorePage extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_page';

    protected $fillable = [
        'post_id',
        'parent_id',
        'name',
        'type',
        'seo_url',
        'css',
        'custom_css',
        'language',
        
    ];

    public function post()
    {
        return $this->belongsTo(CorePost::class, 'post_id');
    }

    public function parent()
    {
        return $this->belongsTo(CorePage::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CorePage::class, 'parent_id');
    }
}
