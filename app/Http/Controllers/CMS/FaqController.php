<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\DTO\CMS\FaqData;
use App\DTO\CMS\FaqCategoryData;
use App\Services\CMS\FaqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function __construct(private FaqService $faqService) {}

    public function index()
    {
        return Inertia::render('CMS/Faqs/Index', [
            'faqCategories' => $this->faqService->getCategoriesWithCount(),
            'uncategorizedCount' => $this->faqService->getUncategorizedCount()
        ]);
    }

    public function showCategory($id)
    {
        $data = $this->faqService->getFaqsByCategory($id);

        return Inertia::render('CMS/Faqs/Show', [
            'faqs' => $data['faqs'],
            'category' => $data['category'],
            'categoryId' => $id
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $this->faqService->createFaq(FaqData::fromRequest($request));

        return back()->with('success', 'Thêm FAQ thành công!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $this->faqService->updateFaq($id, FaqData::fromRequest($request));

        return back()->with('success', 'Cập nhật FAQ thành công!');
    }

    public function destroy($id)
    {
        $this->faqService->deleteFaq($id);
        return back()->with('success', 'Xóa FAQ thành công!');
    }

    public function toggleStatus($id)
    {
        $this->faqService->toggleFaqStatus($id);
        return back()->with('success', 'Cập nhật trạng thái thành công!');
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer'
        ]);

        $this->faqService->createCategory(FaqCategoryData::fromRequest($request));

        return back()->with('success', 'Thêm danh mục FAQ thành công!');
    }

    public function updateCategory(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer'
        ]);

        $this->faqService->updateCategory($id, FaqCategoryData::fromRequest($request));

        return back()->with('success', 'Cập nhật danh mục thành công!');
    }

    public function destroyCategory($id)
    {
        $this->faqService->deleteCategory($id);
        return back()->with('success', 'Xóa danh mục FAQ thành công!');
    }
}
