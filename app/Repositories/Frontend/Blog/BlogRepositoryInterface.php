<?php

namespace App\Repositories\Frontend\Blog;

interface BlogRepositoryInterface
{
    public function getPaginatedArticles(int $perPage = 9);
    
    public function getArticleBySlug(string $slug);

    public function searchForAI($keyword, $limit = 3);
}
