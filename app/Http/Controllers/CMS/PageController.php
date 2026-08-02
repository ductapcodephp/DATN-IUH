<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Services\CMS\PageService;
use App\DTO\CMS\PageData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function __construct(
        private readonly PageService $pageService
    ) {
    }

    public function index()
    {
        $pages = $this->pageService->getPaginatedPages();
        return Inertia::render('CMS/Page/Index', [
            'pages' => $pages
        ]);
    }

    public function create()
    {
        return Inertia::render('CMS/Page/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255', // Removed unique validation from slug because the user cannot enter it anymore
            'sub_title' => 'nullable|string|max:255',
            'published' => 'required|in:publish,draft',
            'language' => 'required|string|max:10',
            'google_title' => 'nullable|string|max:255',
            'facebook_title' => 'nullable|string|max:255',
            'is_hot' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'keep_slug' => 'nullable|boolean'
        ]);

        $data = PageData::fromRequest($request);
        $this->pageService->createPage($data);

        return redirect()->route('cms.page.index')->with('success', 'Tạo trang thành công!');
    }

    public function edit($id)
    {
        $page = $this->pageService->getPageById($id);
        
        return Inertia::render('CMS/Page/Edit', [
            'pageData' => $page
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'published' => 'required|in:publish,draft',
            'language' => 'required|string|max:10',
            'google_title' => 'nullable|string|max:255',
            'facebook_title' => 'nullable|string|max:255',
            'is_hot' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'keep_slug' => 'nullable|boolean'
        ]);

        $data = PageData::fromRequest($request);
        
        // Enforce keep_slug for non-root users
        $user = auth()->user();
        if ($user->current_role !== \App\Enums\UserRole::ROOT) {
            $data = new PageData(
                name: $data->name,
                title: $data->title,
                slug: $data->slug,
                sub_title: $data->sub_title,
                description: $data->description,
                content: $data->content,
                thumbnail: $data->thumbnail,
                published: $data->published,
                tags: $data->tags,
                language: $data->language,
                css: $data->css,
                custom_css: $data->custom_css,
                google_title: $data->google_title,
                google_description: $data->google_description,
                facebook_title: $data->facebook_title,
                facebook_description: $data->facebook_description,
                facebook_thumbnail: $data->facebook_thumbnail,
                google_tag: $data->google_tag,
                is_hot: $data->is_hot,
                is_new: $data->is_new,
                keep_slug: true
            );
        }

        $this->pageService->updatePage($id, $data);

        return redirect()->route('cms.page.index')->with('success', 'Cập nhật trang thành công!');
    }

    public function destroy($id)
    {
        $this->pageService->deletePage($id);
        
        return redirect()->route('cms.page.index')->with('success', 'Xóa trang thành công!');
    }
}
