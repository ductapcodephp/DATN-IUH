<?php

namespace App\Providers;

use App\Repositories\Frontend\Home\HomeRepositoryInterface;
use App\Repositories\Frontend\Home\HomeRepository;
use App\Repositories\Frontend\Courses\CourseRepositoryInterface;
use App\Repositories\Frontend\Courses\CourseRepository;
use App\Repositories\Frontend\Instructor\InstructorRepositoryInterface;
use App\Repositories\Frontend\Instructor\InstructorRepository;
use App\Repositories\Frontend\Wishlist\WishlistRepositoryInterface;
use App\Repositories\Frontend\Wishlist\WishlistRepository;
use App\Repositories\Frontend\Cart\CartRepositoryInterface;
use App\Repositories\Frontend\Cart\CartRepository;
use App\Repositories\Frontend\Learning\LearningRepositoryInterface;
use App\Repositories\Frontend\Learning\LearningRepository;
use Illuminate\Support\ServiceProvider;

class FrontendRepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Frontend bindings
        $this->app->bind(HomeRepositoryInterface::class, HomeRepository::class);
        $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
        $this->app->bind(InstructorRepositoryInterface::class, InstructorRepository::class);
        $this->app->bind(WishlistRepositoryInterface::class, WishlistRepository::class);
        $this->app->bind(CartRepositoryInterface::class, CartRepository::class);
        $this->app->bind(LearningRepositoryInterface::class, LearningRepository::class);
    }
}
