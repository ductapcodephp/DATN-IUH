<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Services\CMS\MediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    public function __construct(
        private readonly MediaService $mediaService
    ) {}

    public function index(Request $request)
    {
        $galleryId = $request->input('gallery_id') ? (int) $request->input('gallery_id') : null;
        return Inertia::render('CMS/Media/Index', [
            'pictures' => $this->mediaService->getPaginatedPictures(8, $galleryId),
            'galleries' => $this->mediaService->getAllGalleries(),
        ]);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|max:10240',
            'gallery_id' => 'nullable|integer|exists:core_gallery,id',
        ]);

        $picture = $this->mediaService->uploadPicture(
            $request->file('file'),
            $request->input('gallery_id')
        );

        return response()->json([
            'id' => $picture->id,
            'path' => $picture->image,
            'url' => asset('storage/' . $picture->image),
            'name' => $picture->name,
        ]);
    }

    public function ajaxList(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 8);
        $galleryId = $request->input('gallery_id') ? (int) $request->input('gallery_id') : null;
        
        $pictures = $this->mediaService->getPaginatedPictures($perPage, $galleryId);
        
        return response()->json($pictures);
    }

    public function ajaxGalleries(): JsonResponse
    {
        return response()->json($this->mediaService->getAllGalleries());
    }

    public function destroy(int $id): JsonResponse
    {
        $this->mediaService->deletePicture($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Picture deleted successfully'
        ]);
    }
}
