<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\Order;
use App\Models\CourseEnrollment;
use App\Models\Review;
use App\Models\Wallet;
use App\Models\VipPackage;
use App\Models\SystemWallet;
use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        $faker = Faker::create('vi_VN');

        // 1. System Settings & Wallets
        SystemSetting::truncate();
        SystemSetting::create([
            'key' => 'site_name',
            'value' => 'Hệ thống học trực tuyến',
        ]);
        
        SystemWallet::truncate();
        SystemWallet::create([
            'balance' => 0
        ]);

        // 2. Users (Admin, Sellers, Users)
        User::truncate();
        Wallet::truncate();
        $password = Hash::make('123');

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => $password,
            'roles' => ['admin'],
            'current_role' => 'admin',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        Wallet::create(['user_id' => $admin->id, 'balance' => 0]);

        $sellers = [];
        for ($i = 1; $i <= 5; $i++) {
            $seller = User::create([
                'name' => $faker->name,
                'email' => "seller{$i}@gmail.com",
                'password' => $password,
                'roles' => ['seller', 'user'],
                'current_role' => 'seller',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
            Wallet::create(['user_id' => $seller->id, 'balance' => 1000000]);
            $sellers[] = $seller;
        }

        $users = [];
        for ($i = 1; $i <= 20; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'email' => "user{$i}@gmail.com",
                'password' => $password,
                'roles' => ['user'],
                'current_role' => 'user',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
            Wallet::create(['user_id' => $user->id, 'balance' => 500000]);
            $users[] = $user;
        }

        // 3. VIP Packages
        $this->call([
            VipPackageSeeder::class,
        ]);

        // 4. Categories
        // Category::truncate();
        $categoriesData = ['Lập trình', 'Thiết kế', 'Marketing', 'Ngoại ngữ', 'Kinh doanh', 'Kỹ năng mềm'];
        $categories = [];
        foreach ($categoriesData as $index => $catName) {
            $categories[] = Category::create([
                'name' => $catName,
                'slug' => Str::slug($catName),
                'description' => 'Khóa học về ' . $catName,
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // 5. Courses, Chapters, Lessons
        Course::truncate();
        Chapter::truncate();
        Lesson::truncate();
        Review::truncate();
        
        $courses = [];
        $levels = ['beginner', 'intermediate', 'advanced'];
        $statuses = ['published', 'published', 'draft']; // higher chance of published

        foreach ($sellers as $seller) {
            $numCourses = rand(3, 5);
            for ($c = 0; $c < $numCourses; $c++) {
                $category = $faker->randomElement($categories);
                $title = 'Khóa học ' . $faker->catchPhrase;
                $course = Course::create([
                    'seller_id' => $seller->id,
                    'category_id' => $category->id,
                    'title' => $title,
                    'slug' => Str::slug($title) . '-' . uniqid(),
                    'description' => $faker->paragraphs(3, true),
                    'price' => rand(10, 100) * 10000,
                    'original_price' => rand(120, 200) * 10000,
                    'level' => $faker->randomElement($levels),
                    'status' => $faker->randomElement($statuses),
                    'is_free' => false,
                    'requirements' => json_encode(['Yêu cầu 1', 'Yêu cầu 2']),
                    'outcomes' => json_encode(['Kết quả 1', 'Kết quả 2']),
                ]);
                $courses[] = $course;

                // Chapters
                $numChapters = rand(3, 7);
                $totalLessons = 0;
                for ($ch = 1; $ch <= $numChapters; $ch++) {
                    $chapter = Chapter::create([
                        'course_id' => $course->id,
                        'title' => 'Chương ' . $ch . ': ' . $faker->sentence(4),
                        'description' => $faker->paragraph,
                        'sort_order' => $ch,
                        'is_published' => true,
                    ]);

                    // Lessons
                    $numLessons = rand(2, 6);
                    $totalLessons += $numLessons;
                    for ($l = 1; $l <= $numLessons; $l++) {
                        Lesson::create([
                            'chapter_id' => $chapter->id,
                            'course_id' => $course->id,
                            'title' => 'Bài ' . $l . ': ' . $faker->sentence(6),
                            'description' => $faker->paragraph,
                            'sort_order' => $l,
                            'type' => $faker->randomElement(['video', 'document', 'quiz_only']),
                            'is_preview' => ($ch == 1 && $l == 1) ? true : false,
                            'is_published' => true,
                        ]);
                        // Skipping Videos as requested
                    }
                }
                
                $course->update(['total_lessons' => $totalLessons]);
                
                // Reviews for published courses
                if ($course->status == 'published') {
                    $numReviews = rand(2, 5);
                    $reviewUsers = collect($users)->random($numReviews);
                    foreach ($reviewUsers as $user) {
                        $order = Order::create([
                            'user_id' => $user->id,
                            'course_id' => $course->id,
                            'amount_original' => $course->price,
                            'amount_paid' => $course->price,
                            'commission_rate' => 10,
                            'status' => 'completed',
                        ]);

                        CourseEnrollment::create([
                            'course_id' => $course->id,
                            'student_id' => $user->id,
                            'seller_id' => $course->seller_id,
                        ]);

                        Review::create([
                            'course_id' => $course->id,
                            'user_id' => $user->id,
                            'order_id' => $order->id,
                            'rating' => rand(4, 5),
                            'content' => $faker->sentence,
                        ]);
                    }
                }
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
