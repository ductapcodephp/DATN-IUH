<?php
// === FILE: app/Models/Video.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $lesson_id
 * @property string|null $r2_key
 * @property string|null $url
 * @property int $duration_seconds
 * @property int|null $size_bytes
 * @property string|null $mime_type
 * @property string $status processing|ready|error
 * @property Lesson $lesson
 */
class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'r2_key',
        'url',
        'duration_seconds',
        'size_bytes',
        'mime_type',
        'status',
    ];

    protected $casts = [
    ];

    // ===== RELATIONSHIPS =====

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    // ===== ACCESSORS =====

    /**
     * 🔥 Không trả về giá trị 'url' lưu cứng trong DB nữa.
     * Thay vào đó tự generate Signed URL (có hạn 4 giờ) mỗi lần đọc,
     * ký trực tiếp vào S3 API endpoint của R2 -> không cần Public Access/Custom Domain,
     * và không bị lộ link vĩnh viễn ra ngoài.
     */
    public function getUrlAttribute($value)
    {
        if (!$this->r2_key) {
            return null;
        }

        return Storage::disk('r2')->temporaryUrl(
            $this->r2_key,
            now()->addHours(4)
        );
    }

    // ===== SCOPES =====

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeReady($query)
    {
        return $query->where('status', 'ready');
    }

    public function scopeError($query)
    {
        return $query->where('status', 'error');
    }

    // ===== HELPERS =====

    public function isReady(): bool
    {
        return $this->status === 'ready';
    }

    public function isProcessing(): bool
    {
        return $this->status === 'processing';
    }

    public function isError(): bool
    {
        return $this->status === 'error';
    }

    public function getDurationFormatted()
    {
        $seconds = $this->duration_seconds;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
        }
        return sprintf('%02d:%02d', $minutes, $secs);
    }
}