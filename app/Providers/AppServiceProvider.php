<?php

namespace App\Providers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserRegistered;
use App\Listeners\Auth\CreateUserWallet;
use App\Listeners\Auth\GenerateFirstSession;
use App\Listeners\Auth\IssueRefreshToken;
use App\Listeners\Auth\LogSuccessfulLogin;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Seller\Courses\CourseRepositoryInterface::class,
            \App\Repositories\Seller\Courses\CourseRepository::class
        );
        $this->app->bind(
            \App\Services\Seller\Courses\CourseServiceInterface::class,
            \App\Services\Seller\Courses\CourseService::class
        );

        // Coupons bindings
        $this->app->bind(
            \App\Repositories\Seller\Coupons\CouponRepositoryInterface::class,
            \App\Repositories\Seller\Coupons\CouponRepository::class
        );
        $this->app->bind(
            \App\Services\Seller\Coupons\CouponServiceInterface::class,
            \App\Services\Seller\Coupons\CouponService::class
        );

        // Students bindings
        $this->app->bind(
            \App\Repositories\Seller\Students\StudentRepositoryInterface::class,
            \App\Repositories\Seller\Students\StudentRepository::class
        );
        $this->app->bind(
            \App\Services\Seller\Students\StudentServiceInterface::class,
            \App\Services\Seller\Students\StudentService::class
        );
    }

    public function boot(): void
    {
        Event::listen(
            UserRegistered::class,
            CreateUserWallet::class
        );
        Event::listen(
            UserRegistered::class,
            GenerateFirstSession::class
        );

        Event::listen(
            UserLoggedIn::class,
            LogSuccessfulLogin::class
        );
        Event::listen(
            UserLoggedIn::class,
            IssueRefreshToken::class
        );
    }
}
