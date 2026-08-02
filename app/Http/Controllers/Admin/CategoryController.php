<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\User;
use App\Notifications\Admin\CategoryApprovedNotification;
use App\Notifications\Admin\CategoryRejectedNotification;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('type', 'course')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'type' => 'course',
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
            'icon' => $request->icon,
            'color' => $request->color,
        ]);

        return back()->with('success', 'Thêm danh mục thành công');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $category->update([
            'name' => $request->name,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
            'icon' => $request->icon,
            'color' => $request->color,
        ]);

        return back()->with('success', 'Cập nhật danh mục thành công');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Xóa danh mục thành công');
    }

    public function approve(Category $category)
    {
        $category->update(['is_approved' => true]);

        if ($category->requested_by) {
            $seller = User::find($category->requested_by);
            if ($seller) {
                // Send notification
                $seller->notify(new CategoryApprovedNotification($category));
            }
        }

        return back()->with('success', 'Đã duyệt danh mục thành công');
    }

    public function reject(Category $category)
    {
        $requestedBy = $category->requested_by;
        $categoryName = $category->name;

        $category->delete();

        if ($requestedBy) {
            $seller = User::find($requestedBy);
            if ($seller) {
                // Send notification
                $seller->notify(new CategoryRejectedNotification($categoryName));
            }
        }

        return back()->with('success', 'Đã từ chối và xóa danh mục');
    }
}
