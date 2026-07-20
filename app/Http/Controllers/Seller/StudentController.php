<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller;

use App\DTO\Seller\Student\BanStudentData;
use App\DTO\Seller\Student\StudentFilterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Students\BanStudentRequest;
use App\Http\Requests\Seller\Students\StudentIndexRequest;
use App\Http\Resources\Seller\StudentResource;
use App\Services\Seller\Students\StudentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct(
        protected StudentService $studentService
    ) {}

    public function index(StudentIndexRequest $request): Response
    {
        $filterDto = StudentFilterData::fromRequest($request);
        
        $data = $this->studentService->getStudentsIndexData((int) auth()->id(), $filterDto);

        return Inertia::render('Seller/Students/Index', [
            'students'    => StudentResource::collection($data['students']),
            'coursesList' => $data['coursesList'],
            'filters'     => $filterDto->toArray(),
        ]);
    }

    public function ban(BanStudentRequest $request, int $enrollmentId): RedirectResponse
    {
        $dto = BanStudentData::fromRequest($request);

        $this->studentService->banStudent((int) auth()->id(), $enrollmentId, $dto);

        return back()->with('success', 'Đã cấm học viên khỏi khóa học thành công! 🚫');
    }

    public function unban(int $enrollmentId): RedirectResponse
    {
        $this->studentService->unbanStudent((int) auth()->id(), $enrollmentId);

        return back()->with('success', 'Đã gỡ cấm cho học viên! ✅');
    }
}