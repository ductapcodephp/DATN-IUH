<?php

namespace App\Repositories\Admin;

use App\Models\Topic;

class TopicRepository implements TopicRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10)
    {
        return Topic::latest()->paginate($perPage);
    }

    public function create(array $data)
    {
        return Topic::create($data);
    }

    public function update(int $id, array $data)
    {
        $topic = Topic::findOrFail($id);
        $topic->update($data);
        return $topic;
    }

    public function delete(int $id)
    {
        $topic = Topic::findOrFail($id);
        return $topic->delete();
    }
}
