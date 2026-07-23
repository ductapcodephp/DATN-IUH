<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $course_id
 * @property int $lesson_id
 * @property int $watched_seconds Seconds watched in this lesson
 * @property int $duration_seconds Total lesson duration
 * @property bool $is_completed Lesson fully watched
 * @property Carbon|null $last_watched_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Course|null $course
 * @property-read Lesson|null $lesson
 * @property-read User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress byCourse($courseId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress byUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress notCompleted()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereDurationSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereIsCompleted($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereLastWatchedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereLessonId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseProgress whereWatchedSeconds($value)
 *
 * @mixin \Eloquent
 */
class CourseProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'watched_seconds',
        'skipped_seconds',
        'duration_seconds',
        'is_completed',
        'last_watched_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'last_watched_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    public function scopeNotCompleted($query)
    {
        return $query->where('is_completed', false);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    public function getProgressPercentage(): float
    {
        if ($this->duration_seconds == 0) {
            return 0;
        }

        return round(($this->watched_seconds / $this->duration_seconds) * 100, 2);
    }

    public function updateWatchedAndSkippedSeconds($watchedSeconds, $skippedSeconds = 0)
    {
        $this->watched_seconds = max($this->watched_seconds, $watchedSeconds);
        $this->skipped_seconds = max($this->skipped_seconds ?? 0, $skippedSeconds);

        if ($this->duration_seconds > 0 && $this->getProgressPercentage() >= 70) {
            $this->is_completed = true;
        }

        $this->last_watched_at = now();
        $this->save();
    }
}
