<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('vi_VN');

        // 1. TẠO DANH MỤC MẪU (Sửa lỗi thiếu category_id của khóa học)
        $categories = collect();
        $categoryNames = ['Lập trình Web', 'Thiết kế đồ họa', 'Marketing Online'];

        foreach ($categoryNames as $name) {
            $categories->push(Category::query()->create([
                'name' => $name,
                'slug' => Str::slug($name) . '-' . uniqid(),
                'is_active' => true,
            ]));
        }

        // 2. TẠO TÀI KHOẢN ADMIN: MANG TẤT CẢ CÁC ROLE TRONG HỆ THỐNG
        User::query()->create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123'),
            'roles' => [
                UserRole::ROOT->value,
                UserRole::ADMIN->value,
                UserRole::SELLER->value,
                UserRole::USER->value
            ],
            'current_role' => UserRole::ROOT->value,
            'avatar'=>'/assets/frontend/img/default-avatar.jpg',
            'is_active' => true,
        ]);

        // 3. TẠO HỌC VIÊN NGẪU NHIÊN (Chỉ có role user mặc định)
        for ($i = 0; $i < 30; $i++) {
            User::query()->create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('123'),
                'roles' => [UserRole::USER->value],
                'current_role' => UserRole::USER->value,
                'avatar'=>'/assets/frontend/img/default-avatar.jpg',
                'is_active' => true,
            ]);
        }

        // 4. TẠO 10 SELLER (Mỗi người mang cả 2 role: USER và SELLER)
        for ($i = 0; $i < 10; $i++) {
            $seller = User::query()->create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('123'),
                'roles' => [UserRole::USER->value, UserRole::SELLER->value], // Đủ cả 2 quyền để switch
                'current_role' => UserRole::SELLER->value,
                'is_active' => true,
            ]);

            // Chuẩn bị danh sách tiêu đề khóa học thực tế
            $courseTopics = [
                'Lập trình Web Frontend với ReactJS và TailwindCSS',
                'Khóa học Fullstack Laravel & VueJS Thực chiến',
                'Mastering UI/UX Design cho người mới bắt đầu',
                'Digital Marketing Toàn tập: Từ con số 0 đến Chuyên gia',
                'Lập trình Python cơ bản đến phân tích dữ liệu',
                'SEO Thực chiến: Đưa Website lên top Google nhanh chóng',
                'Thiết kế đồ họa chuyên nghiệp với Adobe Illustrator',
                'Xây dựng API bảo mật cao với Node.js và Express',
                'Phát triển ứng dụng Mobile với React Native',
                'Nghệ thuật giao tiếp và thuyết trình trước đám đông'
            ];

            // 5. TẠO 5 KHÓA HỌC CHO MỖI SELLER (Tổng 50 khóa)
            for ($j = 0; $j < 5; $j++) {
                $baseTitle = $faker->randomElement($courseTopics);
                $title = $baseTitle . ' - Phần ' . rand(1, 5);
                $isFree = $faker->boolean(20); // 20% tỷ lệ khóa học miễn phí
                $isVip = $faker->boolean(10);  // 10% tỷ lệ khóa học VIP
                
                $thumbnails = [
                    '/assets/img/course-1.jpg',
                    '/assets/img/course-2.jpg',
                    '/assets/img/course-3.jpg',
                    '/assets/frontend/img/default-course.png'
                ];

                Course::query()->create([
                    'seller_id' => $seller->id,
                    'title' => $title,
                    'slug' => Str::slug($title) . '-' . Str::random(5),
                    'description' => 'Đây là khóa học tuyệt vời giúp bạn nắm vững các kiến thức cốt lõi và ứng dụng thực tế. Nội dung được biên soạn bài bản, chi tiết, phù hợp với mọi đối tượng học viên mong muốn nâng cao kỹ năng thực chiến.',
                    'thumbnail' => $faker->randomElement($thumbnails),
                    'price' => $isFree ? 0 : $faker->randomElement([299000, 499000, 999000]),
                    'original_price' => $isFree ? null : $faker->randomElement([1200000, 1500000, 2000000]),
                    'level' => $faker->randomElement(['beginner', 'intermediate', 'advanced']),
                    'status' => 'published',
                    'is_free' => $isFree,
                    'total_lessons' => rand(10, 50),
                    'total_duration_seconds' => rand(3600, 36000),
                    'is_vip' => $isVip,
                    'vip_expires_at' => $isVip ? now()->addDays(rand(3, 14)) : null,
                    'requirements' => [
                        'Máy tính có kết nối Internet ổn định',
                        'Tinh thần tự học, kiên nhẫn và đam mê',
                        'Không yêu cầu quá nhiều kiến thức đầu vào'
                    ],
                    'outcomes' => [
                        'Nắm vững toàn bộ kiến thức từ cơ bản đến nâng cao',
                        'Tự tin xây dựng dự án thực tế và đi làm ngay',
                        'Có tư duy giải quyết vấn đề độc lập'
                    ],
                ]);
            }
        }

        $this->call(ReviewSeeder::class);

        // 6. TẠO MÃ GIẢM GIÁ MẪU
        Coupon::query()->create([
            'code' => 'GIAM200K',
            'type' => 'fixed',
            'value' => 200000,
            'min_order_amount' => 500000,
            'max_uses' => 100,
            'used_count' => 0,
            'starts_at' => now(),
            'expires_at' => now()->addDays(30),
            'is_active' => true,
        ]);

        Coupon::query()->create([
            'code' => 'GIAM10PT',
            'type' => 'percent',
            'value' => 10,
            'max_discount_amount' => 500000,
            'min_order_amount' => 0,
            'max_uses' => 50,
            'used_count' => 0,
            'starts_at' => now(),
            'expires_at' => now()->addDays(30),
            'is_active' => true,
        ]);

        $this->command->info('🎉 Gộp file thành công! Đã nạp: 3 Danh mục, 1 Siêu Admin, 30 Học viên, 10 Giảng viên đa vai trò sở hữu 50 Khóa học và 2 Mã giảm giá!');
    }
}
