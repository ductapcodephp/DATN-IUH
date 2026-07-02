<?php

// === FILE: app/Models/Quiz.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $lesson_id
 * @property string $title
 * @property int $trigger_seconds
 * @property bool $is_required
 * @property Lesson $lesson
 * @property Collection $questions
 * @property Collection $results
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
