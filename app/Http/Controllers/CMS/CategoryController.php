<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\DTO\CMS\CategoryData;
use App\Services\CMS\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $categoryService) {}

    public function index()
    {
        $categories = $this->categoryService->getArticleCategories();
        
        return Inertia::render('CMS/Category/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $this->categoryService->createCategory(CategoryData::fromRequest($request));

        return back()->with('success', 'Thêm danh mục thành công');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $this->categoryService->updateCategory($id, CategoryData::fromRequest($request));

        return back()->with('success', 'Cập nhật danh mục thành công');
    }

    public function destroy($id)
    {
        $this->categoryService->deleteCategory($id);
        return back()->with('success', 'Xóa danh mục thành công');
    }
}
