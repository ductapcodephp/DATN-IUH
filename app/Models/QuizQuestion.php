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
 * @property int $sort_order
 * @property Quiz $quiz
 * @property Collection $answers
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
