<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'reporter_id',
        'reportable_type',
        'reportable_id',
        'reason',
        'details',
        'status',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function reportable()
    {
        return $this->morphTo();
    }

    protected $appends = [
        'target_type_label',
        'target_name',
        'target_content',
        'target_url'
    ];

    public function getTargetTypeLabelAttribute()
    {
        $type = class_basename($this->reportable_type);
        return match($type) {
            'Comment' => 'Bình luận',
            'Review' => 'Đánh giá',
            'Course' => 'Khóa học',
            'User' => 'Người dùng',
            default => $type
        };
    }

    public function getTargetNameAttribute()
    {
        if (!$this->reportable) return null;
        
        $type = class_basename($this->reportable_type);
        if ($type === 'Course') return $this->reportable->title ?? $this->reportable->name ?? 'Không rõ khóa học';
        if ($type === 'User') return $this->reportable->name ?? 'Không rõ người dùng';
        if ($type === 'Review' || $type === 'Comment') {
            return $this->reportable->user->name ?? 'Người dùng vô danh';
        }
        return 'Đối tượng không xác định';
    }

    public function getTargetContentAttribute()
    {
        if (!$this->reportable) return null;
        
        $type = class_basename($this->reportable_type);
        if ($type === 'Comment') return $this->reportable->content ?? null;
        if ($type === 'Review') return $this->reportable->comment ?? $this->reportable->content ?? null;
        return null;
    }

    public function getTargetUrlAttribute()
    {
        // Có thể bổ sung link URL tới đối tượng ở đây nếu cần, hiện tại trả về rỗng để an toàn
        return null;
    }
}
