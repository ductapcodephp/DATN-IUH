<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Home\HomeRepositoryInterface;

class HomeService
{
    protected $homeRepository;

    public function __construct(HomeRepositoryInterface $homeRepository)
    {
        $this->homeRepository = $homeRepository;
    }

    public function getSponsoredCourses()
    {
        return $this->homeRepository->getSponsoredCourses();
    }

    public function getTopInstructors()
    {
        return $this->homeRepository->getTopInstructors();
    }
}
