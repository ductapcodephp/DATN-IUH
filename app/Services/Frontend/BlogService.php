<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Blog\BlogRepositoryInterface;

class BlogService
{
    protected $blogRepository;

    public function __construct(BlogRepositoryInterface $blogRepository)
    {
        $this->blogRepository = $blogRepository;
    }

    public function getPaginatedArticles(int $perPage = 9)
    {
        return $this->blogRepository->getPaginatedArticles($perPage);
    }
    
    public function getArticleBySlug(string $slug)
    {
        return $this->blogRepository->getArticleBySlug($slug);
    }
}
