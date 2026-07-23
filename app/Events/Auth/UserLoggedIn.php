<?php

namespace App\Events\Auth;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserLoggedIn
{
    use Dispatchable, SerializesModels;

    public User $user;

    public array $context;

    public function __construct(User $user, array $context)
    {
        $this->user = $user;
        $this->context = $context;
    }
}
