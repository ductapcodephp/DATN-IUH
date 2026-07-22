<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VipPackagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vip_packages')->insert([
            [
                'name' => 'Pro',
                'price' => 199000.00,
                'duration_days' => 30,
                'description' => 'Huy hiệu Pro, Hiển thị ưu tiên, Thống kê nâng cao, Hỗ trợ nhanh. Hoa hồng bán khóa học chỉ còn 10%.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Business',
                'price' => 499000.00,
                'duration_days' => 30,
                'description' => 'Top search, Banner riêng, Badge Premium, Thống kê AI, CSKH riêng. Hoa hồng bán khóa học chỉ còn 7%.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
