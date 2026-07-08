<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_one_id
 * @property int $user_two_id
 * @property \Illuminate\Support\Carbon|null $last_message_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messages
 * @property-read int|null $messages_count
 * @property-read \App\Models\User|null $userOne
 * @property-read \App\Models\User|null $userTwo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation recent()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereLastMessageAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereUserOneId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereUserTwoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation withUser($userId)
 * @mixin \Eloquent
 */
class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    // ===== RELATIONSHIPS =====

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    // ===== SCOPES =====

    public function scopeWithUser($query, $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('user_one_id', $userId)
              ->orWhere('user_two_id', $userId);
        });
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('last_message_at', 'desc');
    }

    // ===== HELPERS =====

    public function getOtherUser($currentUserId)
    {
        return $this->user_one_id === $currentUserId ? $this->userTwo : $this->userOne;
    }

    public function getLastMessage()
    {
        return $this->messages()->latest()->first();
    }

    public function getUnreadCount($userId)
    {
        return $this->messages()
                   ->where('sender_id', '!=', $userId)
                   ->whereNull('read_at')
                   ->count();
    }

    public function markMessagesAsRead($userId)
    {
        $this->messages()
             ->where('sender_id', '!=', $userId)
             ->whereNull('read_at')
             ->update(['read_at' => now()]);
    }
}
