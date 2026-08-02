<?php

namespace App\Repositories\Frontend\Faq;

use App\Models\Category;

class FaqRepository implements FaqRepositoryInterface
{
    public function getFaqCategoriesWithActiveFaqs()
    {
        return Category::with(['faqs' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order');
        }])->where('type', 'faq')->orderBy('sort_order')->get();
    }
}
