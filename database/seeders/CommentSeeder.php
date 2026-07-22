<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\User;
use Faker\Factory as Faker;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('vi_VN');
        
        // Lấy tất cả user ID để gán random
        $userIds = User::pluck('id')->toArray();
        
        if (empty($userIds)) {
            $this->command->warn('Không có user nào trong DB. Vui lòng seed users trước!');
            return;
        }

        $lessonId = 1;
        $this->command->info("Đang tạo comment cho lesson_id = {$lessonId}...");

        // Xóa comment cũ của lesson này để seed lại cho sạch (Tùy chọn, bạn có thể comment lại nếu muốn giữ)
        Comment::where('lesson_id', $lessonId)->forceDelete();

        // 1. Tạo 20 comment cấp 1 (Root comments)
        $rootComments = [];
        for ($i = 0; $i < 20; $i++) {
            $rootComments[] = Comment::create([
                'user_id' => $faker->randomElement($userIds),
                'lesson_id' => $lessonId,
                'content' => $faker->realText(rand(50, 150)),
                'is_hidden' => false,
                'likes_count' => rand(0, 50),
            ]);
        }

        // 2. Tạo 30 comment cấp 2 (Reply cho cấp 1)
        $level2Comments = [];
        for ($i = 0; $i < 30; $i++) {
            $parent = $faker->randomElement($rootComments);
            $level2Comments[] = Comment::create([
                'user_id' => $faker->randomElement($userIds),
                'lesson_id' => $lessonId,
                'content' => $parent ? 'Chào bạn, ' . $faker->realText(rand(30, 100)) : $faker->realText(50),
                'parent_id' => $parent->id,
                'is_hidden' => false,
                'likes_count' => rand(0, 20),
            ]);
        }

        // 3. Tạo 20 comment cấp 3 (Reply cho cấp 2)
        for ($i = 0; $i < 20; $i++) {
            $parent = $faker->randomElement($level2Comments);
            Comment::create([
                'user_id' => $faker->randomElement($userIds),
                'lesson_id' => $lessonId,
                'content' => 'Mình đồng ý, ' . $faker->realText(rand(20, 80)),
                'parent_id' => $parent->id,
                'is_hidden' => false,
                'likes_count' => rand(0, 10),
            ]);
        }

        // Fix lại NestedSet Tree để các cột _lft và _rgt được cập nhật đúng vị trí
        Comment::fixTree();

        $this->command->info("Đã tạo thành công 70 comments (cả cha lẫn con) cho lesson_id = {$lessonId}.");
    }
}
