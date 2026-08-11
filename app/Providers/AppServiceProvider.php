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
use App\Repositories\Admin\AdminDashboardRepository;
use App\Repositories\Admin\AdminDashboardRepositoryInterface;
use App\Repositories\Shared\NotificationRepository;
use App\Repositories\Shared\NotificationRepositoryInterface;
use App\Repositories\CMS\Page\PageRepository;
use App\Repositories\CMS\Page\PageRepositoryInterface;
use App\Repositories\CMS\Block\BlockRepository;
use App\Repositories\CMS\Block\BlockRepositoryInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

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

        $this->app->bind(
            AdminDashboardRepositoryInterface::class,
            AdminDashboardRepository::class
        );

        $this->app->bind(
            \App\Repositories\Seller\VipPackage\VipPackageRepositoryInterface::class,
            \App\Repositories\Seller\VipPackage\VipPackageRepository::class
        );

        $this->app->bind(
            \App\Repositories\Admin\TopicRepositoryInterface::class,
            \App\Repositories\Admin\TopicRepository::class
        );

        $this->app->bind(
            \App\Repositories\Seller\Comment\CommentRepositoryInterface::class,
            \App\Repositories\Seller\Comment\CommentRepository::class
        );

        $this->app->bind(
            \App\Repositories\Admin\AdminUserRepositoryInterface::class,
            \App\Repositories\Admin\AdminUserRepository::class
        );

        $this->app->bind(
            NotificationRepositoryInterface::class,
            NotificationRepository::class
        );

        $this->app->bind(
            \App\Repositories\CMS\Page\PageRepositoryInterface::class,
            \App\Repositories\CMS\Page\PageRepository::class
        );

        $this->app->bind(
            \App\Repositories\CMS\Block\BlockRepositoryInterface::class,
            \App\Repositories\CMS\Block\BlockRepository::class
        );

        $this->app->bind(
            \App\Repositories\Frontend\Blog\BlogRepositoryInterface::class,
            \App\Repositories\Frontend\Blog\BlogRepository::class
        );

        $this->app->bind(
            \App\Repositories\Frontend\Faq\FaqRepositoryInterface::class,
            \App\Repositories\Frontend\Faq\FaqRepository::class
        );

        // Đăng ký binding cho Course (dành cho Frontend / AI)
        $this->app->bind(
            \App\Repositories\Frontend\Courses\CourseRepositoryInterface::class,
            \App\Repositories\Frontend\Courses\CourseRepository::class
        );

        // Đăng ký binding cho Instructor
        $this->app->bind(
            \App\Repositories\Frontend\Instructor\InstructorRepositoryInterface::class,
            \App\Repositories\Frontend\Instructor\InstructorRepository::class
        );
    }

    public function boot(): void
    {
        if (config('app.url')) {
            URL::forceRootUrl(config('app.url'));
        }
        if (str_contains(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

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
