<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Kalnoy\Nestedset\Collection;

/**
 * @property int $id
 * @property int $chapter_id
 * @property int $course_id
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property string $type
 * @property bool $is_preview Free preview, no purchase needed
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Chapter|null $chapter
 * @property-read Collection<int, Comment> $comments
 * @property-read int|null $comments_count
 * @property-read Course|null $course
 * @property-read \Illuminate\Database\Eloquent\Collection<int, VideoNote> $notes
 * @property-read int|null $notes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, CourseProgress> $progressRecords
 * @property-read int|null $progress_records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Quiz> $quizzes
 * @property-read int|null $quizzes_count
 * @property-read Video|null $video
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson accessible()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson document()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson preview()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson published()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson quizOnly()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson video()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereIsPreview($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereIsPublished($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson withoutTrashed()
 *
 * @mixin \Eloquent
 */
class Lesson extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'chapter_id',
        'course_id',
        'title',
        'description',
        'sort_order',
        'type',
        'is_preview',
        'is_published',
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'is_published' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function video(): HasOne
    {
        return $this->hasOne(Video::class);
    }

    public function progressRecords(): HasMany
    {
        return $this->hasMany(CourseProgress::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(VideoNote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    // ===== SCOPES =====

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopePreview($query)
    {
        return $query->where('is_preview', true);
    }

    public function scopeVideo($query)
    {
        return $query->where('type', 'video');
    }

    public function scopeDocument($query)
    {
        return $query->where('type', 'document');
    }

    public function scopeQuizOnly($query)
    {
        return $query->where('type', 'quiz_only');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function scopeAccessible($query)
    {
        return $query->where(function ($q) {
            $q->where('is_preview', true)
                ->orWhere('is_published', true);
        });
    }
}
