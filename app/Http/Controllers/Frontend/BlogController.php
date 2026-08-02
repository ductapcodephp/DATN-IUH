<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\BlogService;
use Inertia\Inertia;

class BlogController extends Controller
{
    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }



    public function show($slug)
    {
        $data = $this->blogService->getArticleBySlug($slug);

        return Inertia::render('Frontend/Blog/Detail', [
            'article' => $data['article'],
            'post' => $data['post']
        ]);
    }
}
