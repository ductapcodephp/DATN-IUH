<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $email
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property bool $successful
 * @property string|null $failure_reason
 * @property string $country
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereFailureReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereSuccessful($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoginAttempt whereUserAgent($value)
 * @mixin \Eloquent
 */
class LoginAttempt extends Model
{
    protected $fillable = [
        'email', 'ip_address', 'user_agent',
        'successful', 'failure_reason', 'country',
    ];

    protected $casts = ['successful' => 'boolean'];
}
