<?php

namespace App\Repositories\Frontend\Blog;

use App\Models\CoreArticle;
use App\Models\CorePost;

class BlogRepository implements BlogRepositoryInterface
{
    public function getPaginatedArticles(int $perPage = 9)
    {
        return CoreArticle::with(['post.category', 'author'])
            ->join('core_post', 'core_article.post_id', '=', 'core_post.id')
            ->where('core_post.published', 'publish')
            ->select('core_article.*')
            ->orderBy('core_post.sort_order', 'asc')
            ->paginate($perPage);
    }
    
    public function getArticleBySlug(string $slug)
    {
        $post = CorePost::where('slug', $slug)
            ->where('published', 'publish')
            ->firstOrFail();
            
        $article = CoreArticle::with(['post', 'author'])
            ->where('post_id', $post->id)
            ->firstOrFail();
            
        return [
            'post' => $post,
            'article' => $article
        ];
    }

    public function searchForAI($keyword, $limit = 3)
    {
        $query = CoreArticle::with(['post'])
            ->join('core_post', 'core_article.post_id', '=', 'core_post.id')
            ->where('core_post.published', 'publish')
            ->select('core_article.id', 'core_post.title', 'core_post.description as excerpt', 'core_post.slug', 'core_post.created_at');

        if (!empty(trim($keyword))) {
            $words = explode(' ', trim($keyword));
            $query->where(function($q) use ($words) {
                foreach ($words as $word) {
                    if (mb_strlen($word) > 1) {
                        $q->orWhere('core_post.title', 'like', "%{$word}%")
                          ->orWhere('core_post.description', 'like', "%{$word}%");
                    }
                }
            });
        }

        return $query->orderByDesc('core_post.created_at')
                     ->take($limit)
                     ->get();
    }
}
