<?php

namespace App\Services\CMS;

use App\Models\Faq;
use App\Models\Category;
use App\DTO\CMS\FaqData;
use App\DTO\CMS\FaqCategoryData;

class FaqService
{
    public function getCategoriesWithCount()
    {
        return Category::withCount('faqs')->where('type', 'faq')->orderBy('sort_order')->paginate(10);
    }

    public function getUncategorizedCount()
    {
        return Faq::whereNull('category_id')->count();
    }

    public function getFaqsByCategory($id)
    {
        if ($id === 'uncategorized') {
            return [
                'faqs' => Faq::whereNull('category_id')->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->paginate(10),
                'category' => null,
            ];
        }

        return [
            'category' => Category::findOrFail($id),
            'faqs' => Faq::where('category_id', $id)->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->paginate(10),
        ];
    }

    public function createFaq(FaqData $data)
    {
        return Faq::create([
            'category_id' => $data->category_id,
            'question' => $data->question,
            'answer' => $data->answer,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
        ]);
    }

    public function updateFaq($id, FaqData $data)
    {
        $faq = Faq::findOrFail($id);
        return $faq->update([
            'category_id' => $data->category_id,
            'question' => $data->question,
            'answer' => $data->answer,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
        ]);
    }

    public function deleteFaq($id)
    {
        return Faq::findOrFail($id)->delete();
    }

    public function toggleFaqStatus($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->is_active = !$faq->is_active;
        return $faq->save();
    }

    public function createCategory(FaqCategoryData $data)
    {
        return Category::create([
            'name' => $data->name,
            'icon' => $data->icon,
            'color' => $data->color,
            'sort_order' => $data->sort_order,
            'type' => 'faq',
            'is_active' => true,
        ]);
    }

    public function updateCategory($id, FaqCategoryData $data)
    {
        $category = Category::findOrFail($id);
        return $category->update([
            'name' => $data->name,
            'icon' => $data->icon,
            'color' => $data->color,
            'sort_order' => $data->sort_order,
        ]);
    }

    public function deleteCategory($id)
    {
        return Category::findOrFail($id)->delete();
    }
}
