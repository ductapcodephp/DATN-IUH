<?php
// === FILE: app/Models/CourseProgress.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $course_id
 * @property int $lesson_id
 * @property int $watched_seconds
 * @property int $duration_seconds
 * @property bool $is_completed
 * @property string|null $last_watched_at
 * @property User $user
 * @property Course $course
 * @property Lesson $lesson
 */
class CourseProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'watched_seconds',
        'duration_seconds',
        'is_completed',
        'last_watched_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'last_watched_at' => 'datetime',
    ];

    // ===== RELATIONSHIPS =====

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

    // ===== SCOPES =====

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

    // ===== HELPERS =====

    public function getProgressPercentage(): float
    {
        if ($this->duration_seconds == 0) {
            return 0;
        }
        return round(($this->watched_seconds / $this->duration_seconds) * 100, 2);
    }

    public function updateWatchedSeconds($seconds)
    {
        $this->watched_seconds = max($this->watched_seconds, $seconds);
        
        // Mark as completed if watched >= 90% of duration
        if ($this->duration_seconds > 0 && $this->getProgressPercentage() >= 90) {
            $this->is_completed = true;
        }

        $this->last_watched_at = now();
        $this->save();
    }
}
