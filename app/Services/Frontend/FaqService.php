<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Faq\FaqRepositoryInterface;

class FaqService
{
    protected $faqRepository;

    public function __construct(FaqRepositoryInterface $faqRepository)
    {
        $this->faqRepository = $faqRepository;
    }

    public function getFaqCategories()
    {
        return $this->faqRepository->getFaqCategoriesWithActiveFaqs();
    }
}
