<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Services\CMS\BlockService;
use App\Services\CMS\PageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlockController extends Controller
{
    public function __construct(
        private readonly BlockService $blockService,
        private readonly PageService $pageService
    ) {
    }

    public function index($pageId)
    {
        $page = $this->pageService->getPageById($pageId);
        $blocks = $this->blockService->getBlocksByPageId($pageId);

        return Inertia::render('CMS/Block/Index', [
            'page' => $page,
            'blocks' => $blocks
        ]);
    }

    public function store(Request $request, $pageId)
    {
        $request->validate([
            'type' => 'required|string',
            'title' => 'nullable|string',
            'status' => 'nullable|string'
        ]);

        $this->blockService->createBlockForPage($pageId, $request->all());

        return redirect()->back()->with('success', 'Thêm Block thành công!');
    }

    public function update(Request $request, $id)
    {
        $this->blockService->updateBlock($id, $request->all());

        return redirect()->back()->with('success', 'Cập nhật Block thành công!');
    }

    public function destroy($id)
    {
        $this->blockService->deleteBlock($id);

        return redirect()->back()->with('success', 'Xóa Block thành công!');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.sort_order' => 'required|integer',
        ]);

        $this->blockService->reorderBlocks($request->items);

        return response()->json(['message' => 'Cập nhật thứ tự thành công!']);
    }
}
