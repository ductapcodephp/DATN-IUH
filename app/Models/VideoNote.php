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
 * @property int $timestamp_seconds Timestamp in the video where note was taken
 * @property string $content Note content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Lesson|null $lesson
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote byLesson($lessonId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote byUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereLessonId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereTimestampSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VideoNote whereUserId($value)
 * @mixin \Eloquent
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
