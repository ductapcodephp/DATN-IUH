<?php

namespace App\Http\Controllers\CMS;

use App\DTO\CMS\ArticleData;
use App\Http\Controllers\Controller;
use App\Services\CMS\ArticleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService
    ) {
    }

    public function index()
    {
        $articles = $this->articleService->getArticlesPaginated();
            
        return Inertia::render('CMS/Article/Index', [
            'articles' => $articles
        ]);
    }

    public function create()
    {
        $categories = $this->articleService->getActiveCategories();
        return Inertia::render('CMS/Article/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'slug' => 'nullable|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'published' => 'required|in:publish,draft',
            'language' => 'required|string|max:10',
            'thumbnail' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'is_hot' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
        ]);

        $this->articleService->createArticle(ArticleData::fromRequest($request));

        return redirect()->route('cms.article.index')->with('success', 'Tạo bài viết thành công!');
    }

    public function edit($id)
    {
        $post = $this->articleService->getArticleById($id);
        $categories = $this->articleService->getActiveCategories();
        
        $articleData = [
            'id' => $post->id,
            'title' => $post->title,
            'category_id' => $post->category_id,
            'slug' => $post->slug,
            'sub_title' => $post->sub_title,
            'published' => $post->published,
            'thumbnail' => $post->thumbnail,
            'description' => $post->description,
            'content' => $post->content,
            'is_hot' => (bool) $post->is_hot,
            'is_new' => (bool) $post->is_new,
            'language' => $post->articles->first()->language ?? 'vi',
        ];

        return Inertia::render('CMS/Article/Edit', [
            'article' => $articleData,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'slug' => 'nullable|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'published' => 'required|in:publish,draft',
            'language' => 'required|string|max:10',
            'thumbnail' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'is_hot' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
        ]);

        $this->articleService->updateArticle($id, ArticleData::fromRequest($request));

        return redirect()->route('cms.article.index')->with('success', 'Cập nhật bài viết thành công!');
    }

    public function destroy($id)
    {
        $this->articleService->deleteArticle($id);

        return redirect()->route('cms.article.index')->with('success', 'Xóa bài viết thành công!');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'published' => 'required|in:publish,draft',
        ]);

        $this->articleService->updateStatus($id, $request->published);

        return redirect()->back()->with('success', 'Cập nhật trạng thái thành công!');
    }
}
