<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\HomeRepository;

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
}