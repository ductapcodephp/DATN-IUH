<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\HomeRepository;
use App\Models\User;
use App\Enums\UserRole;

class HomeService
{
    protected $homeRepository;

    public function __construct(HomeRepository $homeRepository)
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