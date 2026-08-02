<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoreSetting;

class CoreSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $settings = [
            [
                'setting_key' => 'footer_brand',
                'setting_value' => 'Edu<span>Flow</span>',
                'setting_type' => 'text',
                'description' => 'Tên thương hiệu ở Footer'
            ],
            [
                'setting_key' => 'footer_description',
                'setting_value' => 'Nền tảng học tập trực tuyến hàng đầu, cung cấp các khoá học chất lượng cao giúp bạn thăng tiến trong sự nghiệp IT.',
                'setting_type' => 'textarea',
                'description' => 'Mô tả ngắn ở Footer (dưới Logo)'
            ],
            [
                'setting_key' => 'footer_address',
                'setting_value' => 'Quận 1, TP. Hồ Chí Minh',
                'setting_type' => 'text',
                'description' => 'Địa chỉ hiển thị ở Footer'
            ],
            [
                'setting_key' => 'footer_email',
                'setting_value' => 'support@eduflow.vn',
                'setting_type' => 'text',
                'description' => 'Email liên hệ ở Footer'
            ],
            [
                'setting_key' => 'footer_hotline',
                'setting_value' => '1900 1234',
                'setting_type' => 'text',
                'description' => 'Số Hotline / Điện thoại liên hệ'
            ],
            [
                'setting_key' => 'footer_copyright',
                'setting_value' => '© 2026 EduFlow. Nền tảng học lập trình thực chiến.',
                'setting_type' => 'text',
                'description' => 'Dòng chữ bản quyền (Copyright) cuối trang'
            ],
            [
                'setting_key' => 'footer_col_1_title',
                'setting_value' => 'Khám phá',
                'setting_type' => 'text',
                'description' => 'Tiêu đề cột 1'
            ],
            [
                'setting_key' => 'footer_col_1_links',
                'setting_value' => json_encode([
                    ['label' => 'Trang chủ', 'url' => '/'],
                    ['label' => 'Khóa học', 'url' => '/courses'],
                    ['label' => 'Blog', 'url' => '/blog']
                ], JSON_UNESCAPED_UNICODE),
                'setting_type' => 'json',
                'description' => 'Các link hiển thị ở cột 1'
            ],
            [
                'setting_key' => 'footer_col_2_title',
                'setting_value' => 'Hỗ trợ',
                'setting_type' => 'text',
                'description' => 'Tiêu đề cột 2'
            ],
            [
                'setting_key' => 'footer_col_2_links',
                'setting_value' => json_encode([
                    ['label' => 'Giới thiệu', 'url' => '/about'],
                    ['label' => 'Câu hỏi thường gặp', 'url' => '/faqs'],
                    ['label' => 'Liên hệ', 'url' => '/contact']
                ], JSON_UNESCAPED_UNICODE),
                'setting_type' => 'json',
                'description' => 'Các link hiển thị ở cột 2'
            ],
            [
                'setting_key' => 'footer_col_3_title',
                'setting_value' => 'Liên hệ',
                'setting_type' => 'text',
                'description' => 'Tiêu đề cột 3'
            ],
        ];

        foreach ($settings as $setting) {
            CoreSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                $setting
            );
        }
    }
}
