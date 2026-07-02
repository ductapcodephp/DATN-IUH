<?php
// === FILE: app/Models/QuizAnswer.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $quiz_question_id
 * @property string $answer
 * @property bool $is_correct
 * @property int $sort_order
 * @property QuizQuestion $question
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
