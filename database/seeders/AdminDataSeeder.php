<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Contact;
use App\Models\Report;
use App\Models\WithdrawalRequest;
use App\Models\SystemSetting;
use App\Models\VipPackage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AdminDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo System Settings
        SystemSetting::updateOrCreate(
            ['key' => 'commission_rate'],
            ['value' => '15', 'description' => 'Phần trăm hoa hồng chiết khấu (%)']
        );
        SystemSetting::updateOrCreate(
            ['key' => 'wallet_bonus_rate'],
            ['value' => '5', 'description' => 'Phần trăm thưởng nạp ví (%)']
        );

        // 2. Tạo Vip Packages
        VipPackage::updateOrCreate(
            ['name' => 'Gói Pro 1 Tháng'],
            [
                'price' => 199000,
                'duration_days' => 30,
                'description' => 'Phù hợp cho người mới bắt đầu',
                'role_type' => 'seller',
                'max_storage_gb' => 5, // 5GB
                'commission_rate' => 10,
                'package_type' => 'subscription',
                'badge_text' => 'HOT',
                'priority_level' => 1,
            ]
        );

        VipPackage::updateOrCreate(
            ['name' => 'Gói Pro 6 Tháng'],
            [
                'price' => 899000,
                'duration_days' => 180,
                'description' => 'Gói tiết kiệm, đăng khóa học không giới hạn',
                'role_type' => 'seller',
                'max_storage_gb' => 20, // 20GB
                'commission_rate' => 5,
                'package_type' => 'subscription',
                'badge_text' => 'BEST VALUE',
                'priority_level' => 2,
            ]
        );

        // 3. Đảm bảo có ít user mẫu (Giảng viên, Học sinh)
        for ($i = 1; $i <= 5; $i++) {
            User::firstOrCreate(
                ['email' => "student{$i}@gmail.com"],
                [
                    'name' => "Học Sinh $i",
                    'password' => Hash::make('password'),
                    'roles' => ['user'],
                    'current_role' => 'user',
                    'is_active' => true,
                    'created_at' => Carbon::now()->subDays(rand(1, 30))
                ]
            );

            User::firstOrCreate(
                ['email' => "teacher{$i}@gmail.com"],
                [
                    'name' => "Giảng Viên $i",
                    'password' => Hash::make('password'),
                    'roles' => ['user', 'seller'],
                    'current_role' => 'seller',
                    'is_active' => true,
                    'created_at' => Carbon::now()->subDays(rand(1, 30))
                ]
            );
        }

        // Lấy danh sách ID
        $studentIds = User::whereJsonContains('roles', 'user')->where('current_role', 'user')->pluck('id')->toArray();
        $teacherIds = User::whereJsonContains('roles', 'seller')->pluck('id')->toArray();

        // 4. Tạo các Contacts
        if (Contact::count() === 0) {
            Contact::insert([
                [
                    'name' => 'Nguyễn Văn A',
                    'email' => 'nguyenvana@gmail.com',
                    'phone' => '0912345678',
                    'subject' => 'tu_van',
                    'message' => 'Tôi muốn tư vấn về khóa học lập trình web',
                    'status' => 'pending',
                    'created_at' => Carbon::now()->subDays(2),
                    'updated_at' => Carbon::now()->subDays(2),
                ],
                [
                    'name' => 'Trần Thị B',
                    'email' => 'tranthib@gmail.com',
                    'phone' => '0987654321',
                    'subject' => 'bao_loi',
                    'message' => 'Hệ thống video bị giật lag vào buổi tối',
                    'status' => 'resolved',
                    'created_at' => Carbon::now()->subDays(5),
                    'updated_at' => Carbon::now()->subDays(1),
                ],
            ]);
        }

        // 5. Tạo các Reports
        if (Report::count() === 0 && count($studentIds) > 0) {
            Report::insert([
                [
                    'reporter_id' => $studentIds[0],
                    'reportable_type' => 'App\Models\Course',
                    'reportable_id' => 1, // Giả sử
                    'reason' => 'Nội dung không phù hợp',
                    'details' => 'Khóa học này dạy những thứ không đúng với mô tả.',
                    'status' => 'pending',
                    'created_at' => Carbon::now()->subHours(5),
                    'updated_at' => Carbon::now()->subHours(5),
                ],
                [
                    'reporter_id' => $studentIds[1] ?? $studentIds[0],
                    'reportable_type' => 'App\Models\Comment',
                    'reportable_id' => 1,
                    'reason' => 'Spam / Ngôn từ đả kích',
                    'details' => 'Người dùng này comment chửi thề.',
                    'status' => 'pending',
                    'created_at' => Carbon::now()->subDays(1),
                    'updated_at' => Carbon::now()->subDays(1),
                ]
            ]);
        }

        // 6. Tạo Yêu cầu Rút tiền (Withdrawal Requests)
        if (WithdrawalRequest::count() === 0 && count($teacherIds) > 0) {
            WithdrawalRequest::insert([
                [
                    'user_id' => $teacherIds[0],
                    'amount' => 5000000,
                    'bank_name' => 'Vietcombank',
                    'account_number' => '1023456789',
                    'account_name' => 'NGUYEN VAN GIANG VIEN',
                    'status' => 'pending',
                    'admin_note' => null,
                    'created_at' => Carbon::now()->subDays(1),
                    'updated_at' => Carbon::now()->subDays(1),
                ],
                [
                    'user_id' => $teacherIds[1] ?? $teacherIds[0],
                    'amount' => 2000000,
                    'bank_name' => 'Techcombank',
                    'account_number' => '1903456789011',
                    'account_name' => 'LE THI GIANG VIEN',
                    'status' => 'approved',
                    'admin_note' => 'Đã chuyển khoản thành công',
                    'created_at' => Carbon::now()->subDays(4),
                    'updated_at' => Carbon::now()->subDays(2),
                ]
            ]);
        }

        // Tạo WalletTransaction / Order để có Doanh thu (Tuỳ thuộc logic tính revenue của Dashboard)
        // DashboardService cần dữ liệu từ Orders hoặc WalletTransactions
        // (Do phức tạp, tạm thời có thể dựa vào mock data ở Frontend nếu chưa có table chuẩn)
    }
}
