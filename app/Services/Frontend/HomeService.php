<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Home\HomeRepositoryInterface;
use App\Models\User;
use App\Enums\UserRole;

class HomeService
{
    protected $homeRepository;

    public function __construct(HomeRepositoryInterface $homeRepository)
    {
        $this->homeRepository = $homeRepository;
    }

    public function getVipCourses()
    {
        return $this->homeRepository->getVipCourses();
    }

    public function getTopInstructors()
    {
        return $this->homeRepository->getTopInstructors();
    }
}