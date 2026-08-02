<?php

namespace App\Services\CMS;

use App\Models\Category;
use App\DTO\CMS\CategoryData;
use Illuminate\Support\Str;

class CategoryService
{
    public function getArticleCategories()
    {
        return Category::where('type', 'article')->orderBy('sort_order')->get();
    }

    public function createCategory(CategoryData $data)
    {
        return Category::create([
            'name' => $data->name,
            'slug' => Str::slug($data->name),
            'type' => 'article',
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
            'icon' => $data->icon,
            'color' => $data->color,
        ]);
    }

    public function updateCategory($id, CategoryData $data)
    {
        $category = Category::findOrFail($id);
        return $category->update([
            'name' => $data->name,
            'is_active' => $data->is_active,
            'sort_order' => $data->sort_order,
            'icon' => $data->icon,
            'color' => $data->color,
        ]);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        return $category->delete();
    }
}
