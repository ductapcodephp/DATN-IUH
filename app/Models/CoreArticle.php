<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreArticle extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_article';

    protected $fillable = [
        'author_id',
        'post_id',
        'language',
        
    ];

    public function post()
    {
        return $this->belongsTo(CorePost::class, 'post_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
