<?php

namespace App\Services\CMS;

use App\DTO\CMS\ArticleData;
use App\Models\CorePost;
use App\Models\CoreArticle;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ArticleService
{
    public function getArticlesPaginated(int $perPage = 10)
    {
        return CorePost::whereHas('articles')
            ->with('articles') 
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getActiveCategories()
    {
        return Category::where('type', 'article')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function createArticle(ArticleData $data)
    {
        return DB::transaction(function () use ($data) {
            $slug = $data->slug ?: Str::slug($data->title);

            $post = CorePost::create([
                'title' => $data->title,
                'category_id' => $data->categoryId,
                'slug' => $slug,
                'sub_title' => $data->subTitle,
                'post_type' => 'article',
                'published' => $data->published,
                'thumbnail' => $data->thumbnail,
                'description' => $data->description,
                'content' => $data->content,
                'is_hot' => $data->isHot,
                'is_new' => $data->isNew,
            ]);

            CoreArticle::create([
                'post_id' => $post->id,
                'language' => $data->language,
                'author_id' => Auth::id() ?: 1,
            ]);

            return $post;
        });
    }

    public function getArticleById(int $id)
    {
        return CorePost::whereHas('articles')->with('articles')->findOrFail($id);
    }

    public function updateArticle(int $id, ArticleData $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $post = CorePost::whereHas('articles')->findOrFail($id);
            
            $slug = $data->slug ?: Str::slug($data->title);

            $post->update([
                'title' => $data->title,
                'category_id' => $data->categoryId,
                'slug' => $slug,
                'sub_title' => $data->subTitle,
                'published' => $data->published,
                'thumbnail' => $data->thumbnail,
                'description' => $data->description,
                'content' => $data->content,
                'is_hot' => $data->isHot,
                'is_new' => $data->isNew,
            ]);

            if ($coreArticle = $post->articles->first()) {
                $coreArticle->update([
                    'language' => $data->language,
                ]);
            } else {
                CoreArticle::create([
                    'post_id' => $post->id,
                    'language' => $data->language,
                    'author_id' => Auth::id() ?: 1,
                ]);
            }
            
            return $post;
        });
    }

    public function deleteArticle(int $id): void
    {
        DB::transaction(function () use ($id) {
            $post = CorePost::whereHas('articles')->findOrFail($id);
            CoreArticle::where('post_id', $post->id)->delete();
            $post->delete();
        });
    }

    public function updateStatus(int $id, string $published): void
    {
        $post = CorePost::whereHas('articles')->findOrFail($id);
        $post->update(['published' => $published]);
    }
}
