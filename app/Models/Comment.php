<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Kalnoy\Nestedset\Collection;
use Kalnoy\Nestedset\NodeTrait;

/**
 * @property int $id
 * @property int $user_id
 * @property int $lesson_id
 * @property int|null $parent_id
 * @property string $content
 * @property bool $is_hidden Hidden by instructor
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Comment> $children
 * @property-read int|null $children_count
 * @property-read Lesson|null $lesson
 * @property-read Comment|null $parent
 * @property-read User|null $user
 *
 * @method static \Kalnoy\Nestedset\Collection<int, static> all($columns = ['*'])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment ancestorsAndSelf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment ancestorsOf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment applyNestedSetScope(?string $table = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment byLesson($lessonId)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment countErrors()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment d()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment defaultOrder(string $dir = 'asc')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment descendantsAndSelf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment descendantsOf($id, array $columns = [], $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment fixSubtree($root)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment fixTree($root = null)
 * @method static \Kalnoy\Nestedset\Collection<int, static> get($columns = ['*'])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment getNodeData($id, $required = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment getPlainNodeData($id, $required = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment getTotalErrors()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment hasChildren()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment hasParent()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment hidden()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment isBroken()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment leaves(array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment makeGap(int $cut, int $height)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment moveNode($key, $position)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment newModelQuery()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment onlyTrashed()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment orWhereAncestorOf(bool $id, bool $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment orWhereDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment orWhereNodeBetween($values)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment orWhereNotDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment query()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment rebuildSubtree($root, array $data, $delete = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment rebuildTree(array $data, $delete = false, $root = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment replies()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment reversed()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment root(array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment topLevel()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment visible()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereAncestorOf($id, $andSelf = false, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereAncestorOrSelf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereContent($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereCreatedAt($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereDescendantOf($id, $boolean = 'and', $not = false, $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereDescendantOrSelf(string $id, string $boolean = 'and', string $not = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereId($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereIsAfter($id, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereIsBefore($id, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereIsHidden($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereIsLeaf()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereIsRoot()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereLessonId($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereNodeBetween($values, $boolean = 'and', $not = false, $query = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereNotDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereParentId($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereUpdatedAt($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment whereUserId($value)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment withDepth(string $as = 'depth')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment withTrashed(bool $withTrashed = true)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Comment withoutRoot()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment withoutTrashed()
 *
 * @mixin \Eloquent
 */
class Comment extends Model
{
    use HasFactory, NodeTrait, SoftDeletes;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'parent_id',
        'content',
        'is_hidden',
    ];

    protected $casts = [
        'is_hidden' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeHidden($query)
    {
        return $query->where('is_hidden', true);
    }

    public function scopeTopLevel($query)
    {
        return $query->whereIsRoot();
    }

    public function scopeReplies($query)
    {
        return $query->whereIsChild();
    }

    public function scopeByLesson($query, $lessonId)
    {
        return $query->where('lesson_id', $lessonId);
    }

    public function isReply(): bool
    {
        return ! $this->isRoot();
    }

    public function countReplies(): int
    {
        return $this->children()->count();
    }

    /**
     * 🚀 ĐẾM TỔNG CỘNG TẤT CẢ PHẢN HỒI (Gồm cả con, cháu, chắt...)
     * Cái này cực kỳ hữu ích để hiển thị dạng: "35 bình luận" ở phía ngoài UI
     */
    public function countAllDescendants(): int
    {
        return $this->descendants()->count();
    }
}
