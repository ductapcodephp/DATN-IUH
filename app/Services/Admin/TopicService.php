<?php

namespace App\Services\Admin;

use App\DTO\Admin\TopicData;
use App\Repositories\Admin\TopicRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TopicService
{
    public function __construct(
        protected TopicRepositoryInterface $topicRepository
    ) {}

    public function getAllPaginated(int $perPage = 10, ?string $type = null)
    {
        return $this->topicRepository->getAllPaginated($perPage, $type);
    }

    public function createTopic(TopicData $data)
    {
        return DB::transaction(function () use ($data) {
            return $this->topicRepository->create($data->toArray());
        });
    }

    public function updateTopic(int $id, TopicData $data)
    {
        return DB::transaction(function () use ($id, $data) {
            return $this->topicRepository->update($id, $data->toArray());
        });
    }

    public function deleteTopic(int $id)
    {
        return DB::transaction(function () use ($id) {
            return $this->topicRepository->delete($id);
        });
    }
}
