<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CoreMenu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'core_menu';

    protected $fillable = [
        'parent_id',
        'author_id',
        'name',
        'position',
        'icon',
        'url',
        'display',
        'is_root',
        'sort_order',
        'language',
        
    ];

    public function parent()
    {
        return $this->belongsTo(CoreMenu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CoreMenu::class, 'parent_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
