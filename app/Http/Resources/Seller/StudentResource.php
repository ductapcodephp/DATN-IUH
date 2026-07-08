<?php

declare(strict_types=1);

namespace App\Http\Resources\Seller;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'enrollment_id' => $this->id,
            'student_id'    => $this->student_id,
            'name'          => $this->student->name ?? 'N/A',
            'email'         => $this->student->email ?? 'N/A',
            'avatar'        => $this->student->avatar,
            'course_id'     => $this->course_id,
            'course_name'   => $this->course->title ?? 'N/A',
            'progress'      => (float) $this->progress,
            'joined_at'     => $this->created_at->format('d/m/Y'),
            
            // Trạng thái cấm học viên
            'is_banned'     => (bool) $this->is_banned,
            'ban_reason'    => $this->ban_reason,
            'banned_at'     => $this->banned_at?->format('d/m/Y H:i'),
        ];
    }
}