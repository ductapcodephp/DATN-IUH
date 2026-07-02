<?php
// === FILE: app/Models/VideoNote.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $lesson_id
 * @property int $timestamp_seconds
 * @property string $content
 * @property User $user
 * @property Lesson $lesson
 */
class VideoNote extends Model
{
    use HasFactory;

    protected $table = 'video_notes';

    protected $fillable = [
        'user_id',
        'lesson_id',
        'timestamp_seconds',
        'content',
    ];

    protected $casts = [
    ];

    // ===== RELATIONSHIPS =====

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    // ===== SCOPES =====

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByLesson($query, $lessonId)
    {
        return $query->where('lesson_id', $lessonId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('timestamp_seconds');
    }

    // ===== HELPERS =====

    public function getFormattedTimestamp(): string
    {
        $seconds = $this->timestamp_seconds;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
        }
        return sprintf('%02d:%02d', $minutes, $secs);
    }
}
