<?php

namespace App\Providers;

use App\Repositories\Seller\Coupons\CouponRepository;
use App\Repositories\Seller\Coupons\CouponRepositoryInterface;
use App\Repositories\Seller\Courses\CourseRepository;
use App\Repositories\Seller\Courses\CourseRepositoryInterface;
use App\Repositories\Seller\Students\StudentRepository;
use App\Repositories\Seller\Students\StudentRepositoryInterface;
use App\Repositories\SellerProfile\SellerProfileRepository;
use App\Repositories\SellerProfile\SellerProfileRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class SellerRepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
        $this->app->bind(CouponRepositoryInterface::class, CouponRepository::class);
        $this->app->bind(StudentRepositoryInterface::class, StudentRepository::class);
        $this->app->bind(
            SellerProfileRepositoryInterface::class,
            SellerProfileRepository::class
        );
    }
}
