<?php

namespace App\Services\CMS;

use App\Models\CoreGallery;
use Illuminate\Pagination\LengthAwarePaginator;

class GalleryService
{
    public function getPaginatedGalleries(int $perPage = 15): LengthAwarePaginator
    {
        return CoreGallery::with('parent')
            ->withCount('pictures')
            ->latest()
            ->paginate($perPage);
    }

    public function getGalleryById(int $id): CoreGallery
    {
        return CoreGallery::with(['pictures', 'children'])->findOrFail($id);
    }

    public function createGallery(array $data): CoreGallery
    {
        return CoreGallery::create($data);
    }

    public function updateGallery(int $id, array $data): CoreGallery
    {
        $gallery = CoreGallery::findOrFail($id);
        $gallery->update($data);
        return $gallery;
    }

    public function deleteGallery(int $id): void
    {
        $gallery = CoreGallery::findOrFail($id);
        if (method_exists($gallery, 'pictures')) {
            $gallery->pictures()->detach();
        }
        $gallery->delete();
    }

    public function addPicturesToGallery(int $galleryId, array $pictureIds): void
    {
        $gallery = CoreGallery::findOrFail($galleryId);
        
        $syncData = [];
        $maxSort = 0;
        
        if (method_exists($gallery, 'pictures')) {
            $maxSort = $gallery->pictures()->max('sort_order') ?? 0;
        }
        
        foreach ($pictureIds as $index => $pictureId) {
            $syncData[$pictureId] = ['sort_order' => $maxSort + $index + 1];
        }

        if (method_exists($gallery, 'pictures')) {
            $gallery->pictures()->syncWithoutDetaching($syncData);
        }
    }

    public function removePictureFromGallery(int $galleryId, int $pictureId): void
    {
        $gallery = CoreGallery::findOrFail($galleryId);
        if (method_exists($gallery, 'pictures')) {
            $gallery->pictures()->detach($pictureId);
        }
    }
}
