<?php

// === FILE: app/Models/QuizQuestion.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


/**
 * @property int $id
 * @property int $quiz_id
 * @property string $question
 * @property string $type single_choice, multiple_choice
 * @property int $points Trọng số điểm của câu hỏi này
 * @property string|null $explanation Giải thích sau khi chọn
 * @property int $sort_order
 * @property string|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\QuizAnswer> $answers
 * @property-read int|null $answers_count
 * @property-read \App\Models\Quiz $quiz
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion byQuiz($quizId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereExplanation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion wherePoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereQuestion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereQuizId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizQuestion whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class QuizQuestion extends Model
{
    use HasFactory;

    protected $table = 'quiz_questions';

    protected $fillable = [
        'quiz_id',
        'question',
        'type',            
        'points',          
        'explanation',     
        'sort_order',
    ];

    protected $casts = [
    ];

    // ===== RELATIONSHIPS =====

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class)->orderBy('sort_order');
    }

    // ===== SCOPES =====

    public function scopeByQuiz($query, $quizId)
    {
        return $query->where('quiz_id', $quizId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ===== HELPERS =====

    public function getTotalAnswers(): int
    {
        return $this->answers()->count();
    }

    public function getCorrectAnswers()
    {
        return $this->answers()->where('is_correct', true)->get();
    }

    public function hasMultipleCorrectAnswers(): bool
    {
        return $this->answers()->where('is_correct', true)->count() > 1;
    }
}
