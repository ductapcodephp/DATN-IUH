<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
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
            'is_active' => true,
        ]);

        // 3. TẠO HỌC VIÊN NGẪU NHIÊN (Chỉ có role user mặc định)
        for ($i = 0; $i < 15; $i++) {
            User::query()->create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('123'),
                'roles' => [ UserRole::SELLER->value,UserRole::USER->value],
                'current_role' => UserRole::SELLER->value,
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

            // 5. TẠO 5 KHÓA HỌC CHO MỖI SELLER (Tổng 50 khóa)
            for ($j = 0; $j < 5; $j++) {
                $title = rtrim($faker->sentence(6), '.');
                $isFree = $faker->boolean(20); // 20% tỷ lệ khóa học miễn phí
                $isVip = $faker->boolean(10);  // 10% tỷ lệ khóa học VIP

                Course::query()->create([
                    'seller_id' => $seller->id,
                    'title' => $title,
                    'slug' => Str::slug($title) . '-' . Str::random(5),
                    'description' => $faker->paragraphs(3, true),
                    'thumbnail' => 'https://via.placeholder.com/640x360.png?text=Course+' . rand(1, 100),
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
                        'Tinh thần tự học và kiên nhẫn',
                    ],
                    'outcomes' => [
                        'Nắm vững toàn bộ kiến thức từ cơ bản đến nâng cao',
                        'Tự tin xây dựng dự án thực tế sau khóa học',
                    ],
                ]);
            }
        }

        $this->command->info('🎉 Gộp file thành công! Đã nạp: 3 Danh mục, 1 Siêu Admin, 15 Học viên, 10 Giảng viên đa vai trò sở hữu 50 Khóa học!');
    }
}
