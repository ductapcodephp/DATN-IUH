<?php

namespace App\Providers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserRegistered;
use App\Listeners\Auth\CreateUserWallet;
use App\Listeners\Auth\GenerateFirstSession;
use App\Listeners\Auth\IssueRefreshToken;
use App\Listeners\Auth\LogSuccessfulLogin;
use App\Repositories\Admin\AdminDashboardRepository;
use App\Repositories\Admin\AdminDashboardRepositoryInterface;
use App\Repositories\Admin\AdminUserRepository;
use App\Repositories\Admin\AdminUserRepositoryInterface;
use App\Repositories\Admin\TopicRepository;
use App\Repositories\Admin\TopicRepositoryInterface;
use App\Repositories\CMS\Block\BlockRepository;
use App\Repositories\CMS\Block\BlockRepositoryInterface;
use App\Repositories\CMS\Page\PageRepository;
use App\Repositories\CMS\Page\PageRepositoryInterface;
use App\Repositories\Finance\WalletRepository;
use App\Repositories\Finance\WalletRepositoryInterface;
use App\Repositories\Frontend\Blog\BlogRepository;
use App\Repositories\Frontend\Blog\BlogRepositoryInterface;
use App\Repositories\Frontend\Courses\CourseRepository;
use App\Repositories\Frontend\Courses\CourseRepositoryInterface;
use App\Repositories\Frontend\Dashboard\DashboardOverviewRepository;
use App\Repositories\Frontend\Dashboard\DashboardOverviewRepositoryInterface;
use App\Repositories\Frontend\Dashboard\OrderRepository;
use App\Repositories\Frontend\Dashboard\OrderRepositoryInterface;
use App\Repositories\Frontend\Dashboard\ProfileRepository;
use App\Repositories\Frontend\Dashboard\ProfileRepositoryInterface;
use App\Repositories\Frontend\Faq\FaqRepository;
use App\Repositories\Frontend\Faq\FaqRepositoryInterface;
use App\Repositories\Frontend\Instructor\InstructorRepository;
use App\Repositories\Frontend\Instructor\InstructorRepositoryInterface;
use App\Repositories\Seller\Comment\CommentRepository;
use App\Repositories\Seller\Comment\CommentRepositoryInterface;
use App\Repositories\Seller\Dashboard\DashboardRepository;
use App\Repositories\Seller\Dashboard\DashboardRepositoryInterface;
use App\Repositories\Seller\VipPackage\VipPackageRepository;
use App\Repositories\Seller\VipPackage\VipPackageRepositoryInterface;
use App\Repositories\Shared\NotificationRepository;
use App\Repositories\Shared\NotificationRepositoryInterface;
use App\Repositories\Shared\ReviewRepository;
use App\Repositories\Shared\ReviewRepositoryInterface;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
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

        $this->app->bind(
            AdminDashboardRepositoryInterface::class,
            AdminDashboardRepository::class
        );

        $this->app->bind(
            VipPackageRepositoryInterface::class,
            VipPackageRepository::class
        );

        $this->app->bind(
            TopicRepositoryInterface::class,
            TopicRepository::class
        );

        $this->app->bind(
            CommentRepositoryInterface::class,
            CommentRepository::class
        );

        $this->app->bind(
            AdminUserRepositoryInterface::class,
            AdminUserRepository::class
        );

        $this->app->bind(
            NotificationRepositoryInterface::class,
            NotificationRepository::class
        );

        $this->app->bind(
            PageRepositoryInterface::class,
            PageRepository::class
        );

        $this->app->bind(
            BlockRepositoryInterface::class,
            BlockRepository::class
        );

        $this->app->bind(
            BlogRepositoryInterface::class,
            BlogRepository::class
        );

        $this->app->bind(
            FaqRepositoryInterface::class,
            FaqRepository::class
        );

        // Đăng ký binding cho Course (dành cho Frontend / AI)
        $this->app->bind(
            CourseRepositoryInterface::class,
            CourseRepository::class
        );

        // Đăng ký binding cho Instructor
        $this->app->bind(
            InstructorRepositoryInterface::class,
            InstructorRepository::class
        );
    }

    public function boot(): void
    {
        // Tự động ép giao thức HTTPS khi chạy trên Production hoặc URL cấu hình HTTPS
        if ($this->app->environment('production') || str_contains((string) config('app.url'), 'https://')) {
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
        if (config('app.env') !== 'local' || isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
            URL::forceScheme('https');
        }
    }
    
}
