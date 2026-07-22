<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DailyStatisticSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sellerId = 38;
        $days = 365; // Fake dữ liệu 1 năm qua

        for ($i = $days; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            
            // Random doanh thu từ 500.000 đến 10.000.000
            $revenue = rand(5, 100) * 100000;
            
            // Random số lượng đơn hàng từ 1 đến 20
            $orders = rand(1, 20);

            // Có vài ngày ngẫu nhiên bán ế không có đơn nào
            if (rand(1, 10) > 8) {
                $revenue = 0;
                $orders = 0;
            }

            \App\Models\DailyStatistic::updateOrCreate(
                [
                    'seller_id' => $sellerId,
                    'date' => $date,
                ],
                [
                    'total_revenue' => $revenue,
                    'total_orders' => $orders,
                ]
            );
        }
    }
}
