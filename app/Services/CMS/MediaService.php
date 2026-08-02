<?php

namespace App\Services\CMS;

use App\Models\CorePicture;
use App\Models\CoreGallery;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class MediaService
{
    public function getPaginatedPictures(int $perPage = 24, ?int $galleryId = null): LengthAwarePaginator
    {
        $query = CorePicture::query()->latest();

        if ($galleryId) {
            $query->whereHas('galleries', function ($q) use ($galleryId) {
                $q->where('core_gallery.id', $galleryId);
            });
        }

        return $query->paginate($perPage);
    }

    public function getAllGalleries(): Collection
    {
        return CoreGallery::orderBy('name')->get();
    }

    public function uploadPicture(UploadedFile $file, ?int $galleryId = null): CorePicture
    {
        $path = $file->store('cms/media', 'public');

        $picture = CorePicture::create([
            'image' => $path,
            'file_name' => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'gallery_id' => $galleryId,
        ]);

        if ($galleryId && method_exists($picture, 'galleries')) {
            $picture->galleries()->attach($galleryId);
        }

        return $picture;
    }

    public function deletePicture(int $id): void
    {
        $picture = CorePicture::findOrFail($id);

        if ($picture->image && Storage::disk('public')->exists($picture->image)) {
            Storage::disk('public')->delete($picture->image);
        }

        if (method_exists($picture, 'galleries')) {
            $picture->galleries()->detach();
        }

        $picture->delete();
    }
}
