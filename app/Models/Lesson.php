<?php
// === FILE: app/Models/Lesson.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $chapter_id
 * @property int $course_id
 * @property string $title
 * @property string|null $description
 * @property int $sort_order
 * @property string $type video|document|quiz_only
 * @property bool $is_preview
 * @property bool $is_published
 * @property Chapter $chapter
 * @property Course $course
 * @property Video|null $video
 * @property \Illuminate\Database\Eloquent\Collection $progressRecords
 * @property \Illuminate\Database\Eloquent\Collection $notes
 * @property \Illuminate\Database\Eloquent\Collection $comments
 * @property \Illuminate\Database\Eloquent\Collection $quizzes
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
