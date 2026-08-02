<?php

namespace App\Http\Controllers\CMS;

use App\DTO\CMS\BlockData;
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
        $blockTypes = config('cms_blocks', []);

        return Inertia::render('CMS/Block/Index', [
            'page' => $page,
            'blocks' => $blocks,
            'blockTypes' => $blockTypes
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

    public function edit($id)
    {
        $block = $this->blockService->getBlockById($id);
        
        $block->page = $this->blockService->getPageForBlock($block);

        $typeConfig = config("cms_blocks.{$block->type}");

        $backendView = ($typeConfig && isset($typeConfig['backend'])) 
            ? $typeConfig['backend'] 
            : 'CMS/BlockForms/GenericForm';

        $extraData = $this->blockService->getExtraDataForBlock($block);

        return Inertia::render($backendView, [
            'block' => $block,
            'isEditMode' => true,
            'extraData' => $extraData
        ]);
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

   
    public function updateWithDTO(Request $request, $id)
    {
        $dto = BlockData::fromRequest($request);
        $this->blockService->updateBlockWithDTO($id, $dto);

        return redirect()->back()->with('success', 'Cập nhật Block thành công!');
    }

    public function updateProperty(Request $request, $id)
    {
        $request->validate([
            'property' => 'required|string',
            'value' => 'nullable',
        ]);

        $block = $this->blockService->updateBlockProperty(
            $id,
            $request->input('property'),
            $request->input('value')
        );

        return response()->json([
            'message' => 'Cập nhật property thành công!',
            'block' => $block
        ]);
    }

   


   
    public function addItem(Request $request, $id)
    {
        $request->validate([
            'item' => 'required|array',
        ]);

        $block = $this->blockService->addItemToBlock($id, $request->input('item'));

        return response()->json([
            'message' => 'Thêm item thành công!',
            'block' => $block
        ]);
    }

   
    public function removeItem(Request $request, $id)
    {
        $request->validate([
            'index' => 'required|integer|min:0',
        ]);

        $block = $this->blockService->removeItemFromBlock($id, $request->input('index'));

        return response()->json([
            'message' => 'Xóa item thành công!',
            'block' => $block
        ]);
    }
}
