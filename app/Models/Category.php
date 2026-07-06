<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Kalnoy\Nestedset\NodeTrait; 


/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $image Category thumbnail image
 * @property int $sort_order
 * @property bool $is_active
 * @property int $_lft
 * @property int $_rgt
 * @property int|null $parent_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property-read \Kalnoy\Nestedset\Collection<int, Category> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Course> $courses
 * @property-read int|null $courses_count
 * @property-read Category|null $parent
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category active()
 * @method static \Kalnoy\Nestedset\Collection<int, static> all($columns = ['*'])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category ancestorsAndSelf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category ancestorsOf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category applyNestedSetScope(?string $table = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category countErrors()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category d()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category defaultOrder(string $dir = 'asc')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category descendantsAndSelf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category descendantsOf($id, array $columns = [], $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category fixSubtree($root)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category fixTree($root = null)
 * @method static \Kalnoy\Nestedset\Collection<int, static> get($columns = ['*'])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category getNodeData($id, $required = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category getPlainNodeData($id, $required = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category getTotalErrors()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category hasChildren()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category hasParent()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category isBroken()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category leaves(array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category makeGap(int $cut, int $height)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category moveNode($key, $position)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category newModelQuery()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category newQuery()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category orWhereAncestorOf(bool $id, bool $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category orWhereDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category orWhereNodeBetween($values)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category orWhereNotDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category ordered()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category parent()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category query()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category rebuildSubtree($root, array $data, $delete = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category rebuildTree(array $data, $delete = false, $root = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category reversed()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category root(array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereAncestorOf($id, $andSelf = false, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereAncestorOrSelf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereCreatedAt($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereDeletedAt($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereDescendantOf($id, $boolean = 'and', $not = false, $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereDescendantOrSelf(string $id, string $boolean = 'and', string $not = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereDescription($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereId($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereImage($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereIsActive($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereIsAfter($id, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereIsBefore($id, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereIsLeaf()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereIsRoot()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereLft($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereName($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereNodeBetween($values, $boolean = 'and', $not = false, $query = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereNotDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereParentId($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereRgt($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereSlug($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereSortOrder($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category whereUpdatedAt($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category withDepth(string $as = 'depth')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Category withoutRoot()
 * @mixin \Eloquent
 */
class Category extends Model
{
    use HasFactory, NodeTrait; 
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id', 
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    // ===== SCOPES =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeParent($query)
    {
        // Thay vì dùng ->whereNull('parent_id'), thư viện cung cấp sẵn scope chuẩn chỉ này:
        return $query->whereIsRoot(); 
    }

    public function scopeOrdered($query)
    {
        // Thuật toán cây sắp xếp thứ tự dựa vào cột `_lft`, dùng hàm mặc định này của thư viện luôn
        return $query->defaultOrder(); 
    }

    // ===== HELPERS =====

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('name') && !$model->isDirty('slug')) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    public function getChildrenRecursive()
    {
        // Thay vì dùng hàm cũ chạy tốn RAM và dính lỗi N+1: $this->children()->with('children')->get();
        // Hàm này của NestedSet quét 1 phát ăn ngay toàn bộ con cháu chắt chút chít của nó
        return $this->descendants()->get()->toTree();
    }
}