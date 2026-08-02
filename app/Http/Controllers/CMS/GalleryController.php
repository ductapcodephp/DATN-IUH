<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Services\CMS\GalleryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    public function __construct(
        private readonly GalleryService $galleryService
    ) {}

    public function index()
    {
        return Inertia::render('CMS/Gallery/Index', [
            'galleries' => $this->galleryService->getPaginatedGalleries(),
        ]);
    }

    public function show(int $id)
    {
        return Inertia::render('CMS/Gallery/Show', [
            'gallery' => $this->galleryService->getGalleryById($id),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:50',
            'parent_id' => 'nullable|integer|exists:core_gallery,id',
            'sort' => 'nullable|integer',
        ]);

        $this->galleryService->createGallery($validated);

        return redirect()->back()->with('success', 'Gallery created successfully');
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'nullable|string|max:50',
            'parent_id' => 'nullable|integer|exists:core_gallery,id',
            'sort' => 'nullable|integer',
        ]);

        $this->galleryService->updateGallery($id, $validated);

        return redirect()->back()->with('success', 'Gallery updated successfully');
    }

    public function destroy(int $id)
    {
        $this->galleryService->deleteGallery($id);

        return redirect()->back()->with('success', 'Gallery deleted successfully');
    }

    public function addPictures(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'picture_ids' => 'required|array',
            'picture_ids.*' => 'integer|exists:core_picture,id',
        ]);

        $this->galleryService->addPicturesToGallery($id, $validated['picture_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Pictures added to gallery successfully'
        ]);
    }

    public function removePicture(int $id, int $pictureId): JsonResponse
    {
        $this->galleryService->removePictureFromGallery($id, $pictureId);

        return response()->json([
            'success' => true,
            'message' => 'Picture removed from gallery successfully'
        ]);
    }
}
