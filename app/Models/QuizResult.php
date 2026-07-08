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
 * @property int $score User score
 * @property int $total_questions
 * @property int $correct_answers
 * @property string|null $user_answers Lưu lịch sử các đáp án user đã chọn để review lại
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property string|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Quiz $quiz
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult byQuiz($quizId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult byUser($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult passed($passThreshold = 70)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereCorrectAnswers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereQuizId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereTotalQuestions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereUserAnswers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizResult whereUserId($value)
 * @mixin \Eloquent
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
