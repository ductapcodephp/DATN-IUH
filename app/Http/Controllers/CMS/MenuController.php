<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\DTO\CMS\MenuData;
use App\Services\CMS\MenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function __construct(private MenuService $menuService) {}

    public function index()
    {
        $menus = $this->menuService->getMenus();

        return Inertia::render('CMS/Menu/Index', [
            'menus' => $menus
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'parent_id' => 'nullable|integer',
            'display' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $this->menuService->createMenu(MenuData::fromRequest($request));

        return back()->with('success', 'Thêm menu thành công!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'display' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $this->menuService->updateMenu($id, MenuData::fromRequest($request));

        return back()->with('success', 'Cập nhật menu thành công!');
    }

    public function destroy($id)
    {
        $this->menuService->deleteMenu($id);

        return back()->with('success', 'Xóa menu thành công!');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.sort_order' => 'required|integer',
        ]);

        $this->menuService->reorderMenus($request->items);

        return back()->with('success', 'Cập nhật thứ tự thành công!');
    }
}
