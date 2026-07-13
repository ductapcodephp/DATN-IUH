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

        // Coupons bindings
        $this->app->bind(
            \App\Repositories\Seller\Coupons\CouponRepositoryInterface::class,
            \App\Repositories\Seller\Coupons\CouponRepository::class
        );

        // Students bindings
        $this->app->bind(
            \App\Repositories\Seller\Students\StudentRepositoryInterface::class,
            \App\Repositories\Seller\Students\StudentRepository::class
        );

        // User bindings
        $this->app->bind(
            \App\Repositories\User\UserRepositoryInterface::class,
            \App\Repositories\User\UserRepository::class
        );

        // Frontend Home bindings
        $this->app->bind(
            \App\Repositories\Frontend\Home\HomeRepositoryInterface::class,
            \App\Repositories\Frontend\Home\HomeRepository::class
        );
        $this->app->bind(
            \App\Repositories\Frontend\Courses\CourseRepositoryInterface::class,
            \App\Repositories\Frontend\Courses\CourseRepository::class
        );
        $this->app->bind(
            \App\Repositories\Frontend\Instructor\InstructorRepositoryInterface::class,
            \App\Repositories\Frontend\Instructor\InstructorRepository::class
        );
        $this->app->bind(
            \App\Repositories\Frontend\Wishlist\WishlistRepositoryInterface::class,
            \App\Repositories\Frontend\Wishlist\WishlistRepository::class
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
