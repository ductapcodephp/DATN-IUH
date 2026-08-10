<?php

namespace App\Repositories\Frontend\Instructor;

interface InstructorRepositoryInterface
{
    public function getAllInstructors($filters = [], $perPage = 12);

    public function getInstructorDetail($id);

    public function searchForAI($keyword, $limit = 3);
}
