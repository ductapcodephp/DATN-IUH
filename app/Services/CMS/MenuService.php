<?php

namespace App\Services\CMS;

use App\Models\CoreMenu;
use App\DTO\CMS\MenuData;
use Illuminate\Support\Facades\Auth;

class MenuService
{
    public function getMenus()
    {
        return CoreMenu::whereNull('parent_id')
            ->orWhere('parent_id', 0)
            ->with(['children' => function($q) {
                $q->orderBy('sort_order', 'asc');
            }])
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    public function createMenu(MenuData $data)
    {
        $isRoot = empty($data->parent_id) ? 1 : 0;

        return CoreMenu::create([
            'name' => $data->name,
            'url' => $data->url,
            'icon' => $data->icon,
            'position' => $data->position,
            'parent_id' => $data->parent_id,
            'display' => $data->display,
            'is_root' => $isRoot,
            'sort_order' => $data->sort_order,
            'language' => 'vi',
            'author_id' => Auth::id() ?: 1,
        ]);
    }

    public function updateMenu($id, MenuData $data)
    {
        $menu = CoreMenu::findOrFail($id);
        
        return $menu->update([
            'name' => $data->name,
            'url' => $data->url,
            'icon' => $data->icon,
            'position' => $data->position,
            'display' => $data->display,
            'sort_order' => $data->sort_order,
        ]);
    }

    public function deleteMenu($id)
    {
        $menu = CoreMenu::findOrFail($id);
        
        CoreMenu::where('parent_id', $menu->id)->delete();
        
        return $menu->delete();
    }

    public function reorderMenus(array $items)
    {
        foreach ($items as $item) {
            CoreMenu::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
    }
}
