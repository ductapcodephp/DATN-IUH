<?php

namespace App\Repositories\Frontend\Instructor;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InstructorRepository implements InstructorRepositoryInterface
{
    public function getAllInstructors($filters = [], $perPage = 12)
    {
        $now = Carbon::now();
        $activeVips = DB::table('vip_subscriptions')
            ->join('vip_packages', 'vip_packages.id', '=', 'vip_subscriptions.vip_package_id')
            ->where('vip_subscriptions.status', 'active')
            ->where('vip_subscriptions.expires_at', '>', $now)
            ->where('vip_packages.package_type', 'commission')
            ->select(
                'vip_subscriptions.user_id',
                DB::raw('MAX(vip_packages.priority_level) as vip_priority'),
                DB::raw('MAX(vip_subscriptions.expires_at) as vip_expires_at'),
                DB::raw('MAX(vip_packages.badge_text) as vip_badge_text')
            )
            ->groupBy('vip_subscriptions.user_id');

        $query = User::query()
            ->select('users.*', 'active_vips.vip_badge_text', 'active_vips.vip_priority', 'active_vips.vip_expires_at')
            ->selectRaw('IF(active_vips.user_id IS NOT NULL, 1, 0) as is_vip_seller')
            ->leftJoinSub($activeVips, 'active_vips', function ($join) {
                $join->on('users.id', '=', 'active_vips.user_id');
            })
            ->sellers()
            ->active()
            ->withCount(['authoredCourses as courses_count' => function ($query) {
                $query->published();
            }]);

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('active_vips.vip_priority')->orderByDesc('active_vips.vip_expires_at')->orderByDesc('total_students');
                break;
            case 'most_courses':
                $query->orderByDesc('active_vips.vip_priority')->orderByDesc('active_vips.vip_expires_at')->orderByDesc('courses_count');
                break;
            case 'newest':
            default:
                $query->orderByDesc('active_vips.vip_priority')->orderByDesc('active_vips.vip_expires_at')->latest();
                break;
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getInstructorDetail($id)
    {
        return User::query()
            ->sellers()
            ->active()
            ->withCount(['authoredCourses as courses_count' => function ($query) {
                $query->published();
            }])
            ->with(['authoredCourses' => function ($query) {
                $query->published()->with('category:id,name')->withAvg('reviews', 'rating');
            }])
            ->findOrFail($id);
    }

    public function searchForAI($keyword, $limit = 3)
    {
        $query = User::sellers()
            ->active()
            ->select('id', 'name', 'bio', 'total_students');

        if (!empty(trim($keyword))) {
            $words = explode(' ', trim($keyword));
            $query->where(function($q) use ($words) {
                foreach ($words as $word) {
                    if (mb_strlen($word) > 1) {
                        $q->orWhere('name', 'like', "%{$word}%")
                          ->orWhere('bio', 'like', "%{$word}%");
                    }
                }
            });
        }

        return $query->orderByDesc('total_students')
                     ->take($limit)
                     ->get();
    }
}
