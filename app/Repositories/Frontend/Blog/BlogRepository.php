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
}
