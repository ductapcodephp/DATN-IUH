<?php

namespace App\Events\Auth;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserRegistered
{
    use Dispatchable, SerializesModels;

    public User $user;

    public array $requestData;

    public function __construct(User $user, array $requestData)
    {
        $this->user = $user;
        $this->requestData = $requestData;
    }
}
