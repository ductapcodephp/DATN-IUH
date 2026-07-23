<?php

namespace App\Providers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserRegistered;
use App\Listeners\Auth\CreateUserWallet;
use App\Listeners\Auth\GenerateFirstSession;
use App\Listeners\Auth\IssueRefreshToken;
use App\Listeners\Auth\LogSuccessfulLogin;
use App\Repositories\Finance\WalletRepository;
use App\Repositories\Finance\WalletRepositoryInterface;
use App\Repositories\Frontend\Dashboard\DashboardOverviewRepository;
use App\Repositories\Frontend\Dashboard\DashboardOverviewRepositoryInterface;
use App\Repositories\Frontend\Dashboard\OrderRepository;
use App\Repositories\Frontend\Dashboard\OrderRepositoryInterface;
use App\Repositories\Frontend\Dashboard\ProfileRepository;
use App\Repositories\Frontend\Dashboard\ProfileRepositoryInterface;
use App\Repositories\Seller\Dashboard\DashboardRepository;
use App\Repositories\Seller\Dashboard\DashboardRepositoryInterface;
use App\Repositories\Shared\ReviewRepository;
use App\Repositories\Shared\ReviewRepositoryInterface;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );

        $this->app->bind(
            ReviewRepositoryInterface::class,
            ReviewRepository::class
        );

        $this->app->bind(
            DashboardOverviewRepositoryInterface::class,
            DashboardOverviewRepository::class
        );

        $this->app->bind(
            WalletRepositoryInterface::class,
            WalletRepository::class
        );

        $this->app->bind(
            OrderRepositoryInterface::class,
            OrderRepository::class
        );

        $this->app->bind(
            ProfileRepositoryInterface::class,
            ProfileRepository::class
        );

        $this->app->bind(
            DashboardRepositoryInterface::class,
            DashboardRepository::class
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
