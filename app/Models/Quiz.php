<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $lesson_id
 * @property string $title
 * @property string|null $description
 * @property int $passing_score
 * @property int $trigger_seconds Timestamp in video to trigger quiz
 * @property bool $is_required Must complete to continue
 * @property int $sort_order Sắp xếp quiz trong lesson
 * @property string|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Lesson|null $lesson
 * @property-read Collection<int, QuizQuestion> $questions
 * @property-read int|null $questions_count
 * @property-read Collection<int, QuizResult> $results
 * @property-read int|null $results_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz byLesson($lessonId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz optional()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz required()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereIsRequired($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereLessonId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz wherePassingScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereTriggerSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quiz whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'description',
        'passing_score',
        'trigger_seconds',
        'is_required',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('sort_order');
    }

    public function results(): HasMany
    {
        return $this->hasMany(QuizResult::class);
    }

    // ===== SCOPES =====

    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    public function scopeOptional($query)
    {
        return $query->where('is_required', false);
    }

    public function scopeByLesson($query, $lessonId)
    {
        return $query->where('lesson_id', $lessonId);
    }

    // 🔥 [Agent] Scope để sắp xếp quiz theo sort_order (dùng cho drag/drop)
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ===== HELPERS =====

    public function getTotalQuestions(): int
    {
        return $this->questions()->count();
    }

    public function getAverageScore(): float
    {
        return $this->results()->avg('score') ?? 0;
    }

    public function getPassRate(): float
    {
        $totalResults = $this->results()->count();
        if ($totalResults == 0) {
            return 0;
        }

        $passThreshold = 70; // 70% correct
        $passCount = $this->results()
            ->whereRaw('(correct_answers / total_questions * 100) >= ?', [$passThreshold])
            ->count();

        return ($passCount / $totalResults) * 100;
    }
}
