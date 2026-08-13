<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\DTO\Admin\TopicData;
use App\Services\Admin\TopicService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TopicController extends Controller
{
    public function __construct(
        protected TopicService $topicService
    ) {}

    public function index()
    {
        $topics = $this->topicService->getAllPaginated(10, 'report');
        
        return Inertia::render('Admin/Topics/Index', [
            'topics' => $topics
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:contact,report',
        ]);

        $data = TopicData::fromRequest($request);
        $this->topicService->createTopic($data);

        return back()->with('success', 'Tạo chủ đề thành công');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:contact,report',
        ]);

        $data = TopicData::fromRequest($request);
        $this->topicService->updateTopic($id, $data);

        return back()->with('success', 'Cập nhật chủ đề thành công');
    }

    public function destroy($id)
    {
        $this->topicService->deleteTopic($id);
        
        return back()->with('success', 'Xóa chủ đề thành công');
    }
}
