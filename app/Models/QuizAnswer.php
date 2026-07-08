<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $quiz_question_id
 * @property string $answer
 * @property bool $is_correct
 * @property string|null $deleted_at
 * @property int $sort_order
 * @property-read \App\Models\QuizQuestion $question
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer byQuestion($questionId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer correct()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer incorrect()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer whereIsCorrect($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer whereQuizQuestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizAnswer whereSortOrder($value)
 * @mixin \Eloquent
 */
class QuizAnswer extends Model
{
    use HasFactory;

    protected $table = 'quiz_answers';

    public $timestamps = false;

    protected $fillable = [
        'quiz_question_id',
        'answer',
        'is_correct',
        'sort_order',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }

    // ===== SCOPES =====

    public function scopeCorrect($query)
    {
        return $query->where('is_correct', true);
    }

    public function scopeIncorrect($query)
    {
        return $query->where('is_correct', false);
    }

    public function scopeByQuestion($query, $questionId)
    {
        return $query->where('quiz_question_id', $questionId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
