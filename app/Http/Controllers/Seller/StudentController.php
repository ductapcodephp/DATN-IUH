<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Services\Seller\Courses\StudentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function index(Request $request)
    {
        $sellerId = auth()->id();
        $data = $this->studentService->getStudentsIndexData($sellerId, $request->all());

        return Inertia::render('Seller/Students/Index', [
            'students'    => $data['students'],
            'coursesList' => $data['coursesList'],
            'filters'     => $request->only(['search', 'course_id', 'per_page']),
        ]);
    }

    public function block(Request $request, $id)
    {
        $this->studentService->blockStudent(auth()->id(), $id, $request->input('reason'));

        return redirect()->back()->with('success', 'Đã chặn học viên thành công! 🚫');
    }
}
