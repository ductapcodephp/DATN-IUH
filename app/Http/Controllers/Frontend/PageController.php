<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CorePost;
use App\Models\CorePage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    
    public function show($slug)
    {
        $data = $this->getPageData($slug);

        if (!$data) {
            abort(404);
        }

        $inertiePage = $this->resolveInertiaPage($data['post']->slug);

        if ($inertiePage === 'Frontend/Home/Index') {
            $homeService = app(\App\Services\Frontend\HomeService::class);
            $data['sponsoredCourses'] = $homeService->getSponsoredCourses();
            $data['topInstructors'] = $homeService->getTopInstructors();
            $data['enrolledCourseIds'] = auth()->check() ? \App\Models\CourseEnrollment::where('student_id', auth()->id())->pluck('course_id')->toArray() : [];
        }

        if ($inertiePage === 'Frontend/Faq/Index') {
            $faqService = app(\App\Services\Frontend\FaqService::class);
            $data['faqCategories'] = $faqService->getFaqCategories();
        }

        if ($inertiePage === 'Frontend/Blog/Index') {
            $blogService = app(\App\Services\Frontend\BlogService::class);
            $data['articles'] = $blogService->getPaginatedArticles(9);
            $data['categories'] = \App\Models\Category::where('type', 'article')->where('is_active', true)->orderBy('sort_order', 'asc')->get();
        }

        if ($inertiePage === 'Frontend/Course/Index') {
            $courseService = app(\App\Services\Frontend\CourseService::class);
            $filters = request()->only(['search', 'category', 'price', 'rating', 'sort']);
            $data['courses'] = $courseService->getAllPublishedCourses($filters, 12);
            $data['categories'] = $courseService->getActiveCategories();
            $data['enrolledCourseIds'] = $courseService->getEnrolledCourseIds(auth()->id());
            $data['filters'] = $filters;
        }

        if ($inertiePage === 'Frontend/Instructor/Index') {
            $instructorService = app(\App\Services\Frontend\InstructorService::class);
            $filters = request()->only(['search', 'sort']);
            $data['instructors'] = $instructorService->getAllInstructors($filters, 12);
            $data['filters'] = $filters;
        }

        return Inertia::render($inertiePage, $data);
    }

  
    public function getPageData($slug)
    {
        $slug = preg_replace('/\.html$/', '', $slug);

        $post = CorePost::where('slug', $slug)
            ->where(function($q) {
                $q->where('published', 'publish')->orWhere('published', 1);
            })
            ->with(['blocks' => function ($query) {
                $query->where(function($q) {
                    $q->where('status', 'active')->orWhere('status', 1);
                })->orderBy('sort_order', 'asc');
            }])
            ->first();

        if (!$post) {
            return null;
        }

        $page = CorePage::where('post_id', $post->id)->first();

        if (!$page) {
            return null;
        }

        $blockTypesConfig = config('cms_blocks', []);

        $blocks = $post->blocks->map(function ($block) {
            $data = $block->toArray();
            $data['listing_item'] = $block->getListingItems();
            $data['listing_item_extra'] = $block->getListingItemExtras();
            return $data;
        });

        return [
            'post' => $post,
            'page' => $page,
            'blocks' => $blocks,
            'blockTypesConfig' => $blockTypesConfig,
        ];
    }

  
    private function resolveInertiaPage(string $slug): string
    {
   
        $pageMap = [
            've-chung-toi'         => 'Frontend/About/Index',
            'faq'                  => 'Frontend/Faq/Index',
            'lien-he'              => 'Frontend/Contact/Index',
            'trang-chu'            => 'Frontend/Home/Index',
            'blog'                 => 'Frontend/Blog/Index',
            'gio-hang'             => 'Frontend/Cart/Index',
            'danh-sach-giang-vien' => 'Frontend/Instructor/Index',
            'danh-sach-khoa-hoc'   => 'Frontend/Course/Index',
        ];

        $slug = strtolower(trim($slug));

        if (isset($pageMap[$slug])) {
            return $pageMap[$slug];
        }

        return 'Frontend/Page/Index';
    }
}
