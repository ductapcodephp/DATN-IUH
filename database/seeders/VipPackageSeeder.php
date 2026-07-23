<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VipPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('vip_packages')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $packages = [
            // Gói cho Học viên (user)
            [
                'name' => 'Học Viên VIP (1 Tháng)',
                'role_type' => 'user',
                'package_type' => 'default',
                'price' => 49000,
                'duration_days' => 30,
                'max_storage_gb' => 0,
                'commission_rate' => null,
                'description' => 'Trải nghiệm huy hiệu Học viên VIP nổi bật và nhận 1 voucher giảm giá khóa học.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Học Viên VIP (6 Tháng)',
                'role_type' => 'user',
                'package_type' => 'default',
                'price' => 249000,
                'duration_days' => 180,
                'max_storage_gb' => 0,
                'commission_rate' => null,
                'description' => 'Sở hữu huy hiệu VIP lấp lánh trong 6 tháng, nhận voucher giảm giá hàng tháng.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Gói Mua Dung Lượng (Storage)
            [
                'name' => 'Gói Dung Lượng Cơ Bản (200GB / 1 Tháng)',
                'role_type' => 'seller',
                'package_type' => 'storage',
                'price' => 99000,
                'duration_days' => 30,
                'max_storage_gb' => 200,
                'commission_rate' => null,
                'description' => 'Mở rộng không gian lưu trữ thêm 200GB trong 30 ngày.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Dung Lượng Nâng Cao (500GB / 6 Tháng)',
                'role_type' => 'seller',
                'package_type' => 'storage',
                'price' => 499000,
                'duration_days' => 180,
                'max_storage_gb' => 500,
                'commission_rate' => null,
                'description' => 'Nâng cấp lưu trữ lên 500GB với chi phí tiết kiệm hơn cho 6 tháng.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Dung Lượng Chuyên Nghiệp (1TB / 1 Năm)',
                'role_type' => 'seller',
                'package_type' => 'storage',
                'price' => 899000,
                'duration_days' => 365,
                'max_storage_gb' => 1000,
                'commission_rate' => null,
                'description' => 'Không gian lưu trữ khổng lồ 1TB dành cho giảng viên lâu năm.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Gói VIP Giảm Phí Sàn (Commission)
            [
                'name' => 'Giảng Viên Nổi Bật (1 Tháng)',
                'role_type' => 'seller',
                'package_type' => 'commission',
                'price' => 299000,
                'duration_days' => 30,
                'max_storage_gb' => 0,
                'commission_rate' => 18,
                'description' => 'Gói trải nghiệm giảm phí sàn xuống còn 18% và huy hiệu uy tín.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Giảng Viên Uy Tín (6 Tháng)',
                'role_type' => 'seller',
                'package_type' => 'commission',
                'price' => 1499000,
                'duration_days' => 180,
                'max_storage_gb' => 0,
                'commission_rate' => 15,
                'description' => 'Duy trì danh hiệu uy tín, giảm phí sàn xuống còn 15% dài hạn.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Đối Tác Chiến Lược (1 Năm)',
                'role_type' => 'seller',
                'package_type' => 'commission',
                'price' => 2499000,
                'duration_days' => 365,
                'max_storage_gb' => 0,
                'commission_rate' => 10,
                'description' => 'Gói cao cấp nhất: giảm phí sàn xuống 10% và huy hiệu đối tác chiến lược.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        \App\Models\VipPackage::insert($packages);
    }
}
