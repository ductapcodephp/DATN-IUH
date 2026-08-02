<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\InstructorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstructorController extends Controller
{
    protected $instructorService;

    public function __construct(InstructorService $instructorService)
    {
        $this->instructorService = $instructorService;
    }



    public function show($id)
    {
        $instructor = $this->instructorService->getInstructorDetail($id);

        return Inertia::render('Frontend/Instructor/Detail', [
            'instructor' => $instructor,
        ]);
    }
}
