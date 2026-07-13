<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Frontend\InstructorService;
use Inertia\Inertia;

class InstructorController extends Controller
{
    protected $instructorService;

    public function __construct(InstructorService $instructorService)
    {
        $this->instructorService = $instructorService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'sort']);
        $instructors = $this->instructorService->getAllInstructors($filters, 12);
        
        return Inertia::render('Frontend/Instructor/Index', [
            'instructors' => $instructors,
            'filters' => $filters
        ]);
    }

    public function show($id)
    {
        $instructor = $this->instructorService->getInstructorDetail($id);

        return Inertia::render('Frontend/Instructor/Detail', [
            'instructor' => $instructor
        ]);
    }
}
