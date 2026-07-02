<?php
// === FILE: app/Models/QuizResult.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $quiz_id
 * @property int $score
 * @property int $total_questions
 * @property int $correct_answers
 * @property string|null $completed_at
 * @property User $user
 * @property Quiz $quiz
 */
class QuizResult extends Model
{
    use HasFactory;

    protected $table = 'quiz_results';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'total_questions',
        'correct_answers',
        'user_answers',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    // ===== RELATIONSHIPS =====

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    // ===== SCOPES =====

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByQuiz($query, $quizId)
    {
        return $query->where('quiz_id', $quizId);
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    public function scopePassed($query, $passThreshold = 70)
    {
        return $query->whereRaw('(correct_answers / total_questions * 100) >= ?', [$passThreshold]);
    }

    // ===== HELPERS =====

    public function getPercentageScore(): float
    {
        if ($this->total_questions == 0) return 0;
        return round(($this->correct_answers / $this->total_questions) * 100, 2);
    }

    public function isPassed($threshold = 70): bool
    {
        return $this->getPercentageScore() >= $threshold;
    }

    public function isPerfect(): bool
    {
        return $this->correct_answers === $this->total_questions;
    }

    public function getScoreFormatted(): string
    {
        return "{$this->correct_answers}/{$this->total_questions}";
    }
}
