<?php

namespace App\Repositories\CMS\Page;

use App\DTO\CMS\PageData;
use App\Models\CorePage;
use App\Models\CorePost;
use App\Models\CoreSocialSharing;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PageRepository implements PageRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return CorePage::with(['post'])->orderByDesc('id')->paginate($perPage);
    }

    public function findById(int $id): ?CorePage
    {
        return CorePage::with(['post.socialSharing'])->where('id', $id)->firstOrFail();
    }

    private function generateUniqueSlug(string $name, ?int $ignorePostId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        $query = CorePost::where('slug', $slug);
        if ($ignorePostId) {
            $query->where('id', '!=', $ignorePostId);
        }

        while ($query->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
            $query = CorePost::where('slug', $slug);
            if ($ignorePostId) {
                $query->where('id', '!=', $ignorePostId);
            }
        }

        return $slug;
    }

    public function store(PageData $data): CorePage
    {
        return DB::transaction(function () use ($data) {
            $slug = $this->generateUniqueSlug($data->name);
            
            $post = CorePost::create([
                'title' => $data->title,
                'sub_title' => $data->sub_title,
                'slug' => $slug,
                'description' => $data->description,
                'content' => $data->content,
                'thumbnail' => $data->thumbnail,
                'published' => $data->published,
                'tags' => $data->tags,
                'post_type' => 'page',
                'is_hot' => $data->is_hot,
                'is_new' => $data->is_new,
            ]);

            CoreSocialSharing::create([
                'post_id' => $post->id,
                'google_title' => $data->google_title,
                'google_description' => $data->google_description,
                'google_tag' => $data->google_tag,
                'facebook_title' => $data->facebook_title,
                'facebook_description' => $data->facebook_description,
                'facebook_thumbnail' => $data->facebook_thumbnail,
            ]);

            return CorePage::create([
                'post_id' => $post->id,
                'name' => $data->name,
                'language' => $data->language,
                'css' => $data->css,
                'custom_css' => $data->custom_css,
            ]);
        });
    }

    public function update(CorePage $page, PageData $data): CorePage
    {
        return DB::transaction(function () use ($page, $data) {
            $post = $page->post;
            
            if (!$data->keep_slug) {
                $slug = $this->generateUniqueSlug($data->name, $post->id);
            } else {
                $slug = $post->slug;
            }

            $post->update([
                'title' => $data->title,
                'sub_title' => $data->sub_title,
                'slug' => $slug,
                'description' => $data->description,
                'content' => $data->content,
                'thumbnail' => $data->thumbnail,
                'published' => $data->published,
                'tags' => $data->tags,
                'is_hot' => $data->is_hot,
                'is_new' => $data->is_new,
            ]);

            $social = CoreSocialSharing::firstOrCreate(['post_id' => $post->id]);
            $social->update([
                'google_title' => $data->google_title,
                'google_description' => $data->google_description,
                'google_tag' => $data->google_tag,
                'facebook_title' => $data->facebook_title,
                'facebook_description' => $data->facebook_description,
                'facebook_thumbnail' => $data->facebook_thumbnail,
            ]);

            $page->update([
                'name' => $data->name,
                'language' => $data->language,
                'css' => $data->css,
                'custom_css' => $data->custom_css,
            ]);

            return $page;
        });
    }

    public function delete(CorePage $page): void
    {
        DB::transaction(function () use ($page) {
            $post = $page->post;
            if ($post) {
                // Rename slug to free it up before soft deleting
                $deletedSlug = $post->slug . '-deleted-' . time();
                $post->update([
                    'slug' => $deletedSlug
                ]);
                
                if ($post->socialSharing) {
                    $post->socialSharing->delete();
                }
                $post->delete();
            }
            $page->delete();
        });
    }
}
