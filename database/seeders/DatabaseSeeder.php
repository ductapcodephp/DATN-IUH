<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Contact;
use App\Models\Conversation;
use App\Models\CoreBlockContent;
use App\Models\CorePage;
use App\Models\CoreQa;
use App\Models\Course;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\Message;
use App\Models\Report;
use App\Models\SellerProfile;
use App\Models\SystemSetting;
use App\Models\SystemWallet;
use App\Models\Topic;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletBonus;
use App\Models\Wishlist;
use App\Models\WithdrawalRequest;
use App\Notifications\DatabaseNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Schema;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seed toàn bộ dữ liệu cho hệ thống:
     * - Users (Admin, Sellers, Users)
     * - SystemSettings, SystemWallet
     * - Categories, Courses, Chapters, Lessons
     * - SellerProfiles, UserBankAccounts
     * - Topics, Contacts, Reports
     * - Conversations, Messages
     * - WalletBonuses, WithdrawalRequests
     * - Wishlists
     * - CMS: Pages, BlockContents, QA
     * - Notifications
     * → Rồi gọi VipPackageSeeder + OrderRevenueSeeder
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        $faker = Faker::create('vi_VN');

        // ══════════════════════════════════════════════════════════════
        // 1. SYSTEM SETTINGS & WALLETS
        // ══════════════════════════════════════════════════════════════
        SystemSetting::truncate();
        $settings = [
            ['key' => 'site_name', 'value' => 'TechEducation - Học trực tuyến'],
            ['key' => 'site_description', 'value' => 'Nền tảng học trực tuyến hàng đầu Việt Nam'],
            ['key' => 'platform_commission_rate', 'value' => '20'],
            ['key' => 'min_withdrawal_amount', 'value' => '100000'],
            ['key' => 'max_withdrawal_amount', 'value' => '50000000'],
            ['key' => 'earning_release_days', 'value' => '7'],
            ['key' => 'refund_deadline_days', 'value' => '30'],
            ['key' => 'contact_email', 'value' => 'support@techeducation.vn'],
            ['key' => 'contact_phone', 'value' => '1900-1234'],
        ];
        foreach ($settings as $s) {
            SystemSetting::create($s);
        }

        SystemWallet::truncate();
        SystemWallet::create(['balance' => 0]);

        // ══════════════════════════════════════════════════════════════
        // 2. USERS (Admin, Sellers, Users)
        // ══════════════════════════════════════════════════════════════
        User::truncate();
        Wallet::truncate();
        SellerProfile::truncate();
        UserBankAccount::truncate();
        $password = Hash::make('123');

        // Admin
        $admin = User::create([
            'name'              => 'Admin',
            'email'             => 'admin@gmail.com',
            'password'          => $password,
            'roles'             => ['admin'],
            'current_role'      => 'admin',
            'email_verified_at' => now(),
            'is_active'         => true,
        ]);
        Wallet::create(['user_id' => $admin->id, 'balance' => 0]);

        // Sellers (5 sellers with approved profiles + bank accounts)
        $sellers = [];
        $sellerNames = [
            'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường',
            'Phạm Minh Đức', 'Hoàng Thị Em',
        ];
        $specializations = [
            'Lập trình Web, Backend', 'Thiết kế UI/UX, Graphic Design',
            'Data Science, Machine Learning', 'DevOps, Cloud Computing',
            'Mobile Development, Flutter',
        ];
        for ($i = 0; $i < 5; $i++) {
            $seller = User::create([
                'name'              => $sellerNames[$i],
                'email'             => 'seller' . ($i + 1) . '@gmail.com',
                'password'          => $password,
                'roles'             => ['seller', 'user'],
                'current_role'      => 'seller',
                'email_verified_at' => now(),
                'is_active'         => true,
                'phone'             => '090' . rand(1000000, 9999999),
                'avatar'            => "https://i.pravatar.cc/150?img=" . ($i + 10),
            ]);
            Wallet::create([
                'user_id' => $seller->id,
                'balance' => 1000000,
                'balance_available' => 800000,
                'balance_pending' => 200000,
            ]);

            // Seller Profile
            SellerProfile::create([
                'user_id'             => $seller->id,
                'headline'            => 'Giảng viên ' . $specializations[$i],
                'bio'                 => $faker->paragraphs(2, true),
                'website'             => 'https://example.com/instructor-' . ($i + 1),
                'identity_card_front' => null,
                'identity_card_back'  => null,
                'tax_number'          => '0' . rand(100000000, 999999999),
                'status'              => 'approved',
            ]);

            // Bank Account for seller
            UserBankAccount::create([
                'user_id'        => $seller->id,
                'bank_name'      => $faker->randomElement(['Vietcombank', 'Techcombank', 'BIDV', 'VPBank', 'MB Bank']),
                'account_number' => (string) rand(1000000000, 9999999999),
                'account_name'   => strtoupper($sellerNames[$i]),
            ]);

            $sellers[] = $seller;
        }

        // Regular Users (20 users)
        $users = [];
        for ($i = 1; $i <= 20; $i++) {
            $user = User::create([
                'name'              => $faker->name,
                'email'             => "user{$i}@gmail.com",
                'password'          => $password,
                'roles'             => ['user'],
                'current_role'      => 'user',
                'email_verified_at' => now(),
                'is_active'         => true,
                'avatar'            => "https://i.pravatar.cc/150?img=" . ($i + 20),
            ]);
            Wallet::create(['user_id' => $user->id, 'balance' => rand(100000, 2000000)]);
            $users[] = $user;
        }

        // 1 pending seller application (để admin có cái duyệt)
        $pendingSeller = User::create([
            'name'              => 'Người đăng ký Seller',
            'email'             => 'pending-seller@gmail.com',
            'password'          => $password,
            'roles'             => ['user'],
            'current_role'      => 'user',
            'email_verified_at' => now(),
            'is_active'         => true,
        ]);
        Wallet::create(['user_id' => $pendingSeller->id, 'balance' => 0]);
        SellerProfile::create([
            'user_id'  => $pendingSeller->id,
            'headline' => 'Muốn trở thành giảng viên',
            'bio'      => 'Tôi có 5 năm kinh nghiệm trong lĩnh vực lập trình web.',
            'status'   => 'pending',
        ]);

        // ══════════════════════════════════════════════════════════════
        // 3. VIP PACKAGES
        // ══════════════════════════════════════════════════════════════
        $this->call([VipPackageSeeder::class]);
        Schema::disableForeignKeyConstraints();

        // ══════════════════════════════════════════════════════════════
        // 4. CATEGORIES
        // ══════════════════════════════════════════════════════════════
        Category::truncate();
        $categoriesData = [
            'Lập trình', 'Thiết kế', 'Marketing',
            'Ngoại ngữ', 'Kinh doanh', 'Kỹ năng mềm',
        ];
        $categories = [];
        foreach ($categoriesData as $index => $catName) {
            $categories[] = Category::create([
                'name'        => $catName,
                'slug'        => Str::slug($catName),
                'description' => 'Khóa học về ' . $catName,
                'is_active'   => true,
                'sort_order'  => $index,
            ]);
        }

        // ══════════════════════════════════════════════════════════════
        // 5. COURSES, CHAPTERS, LESSONS
        // ══════════════════════════════════════════════════════════════
        Course::truncate();
        Chapter::truncate();
        Lesson::truncate();

        $courses = [];
        $levels = ['beginner', 'intermediate', 'advanced'];
        // 90% published để đủ dữ liệu cho orders
        $statuses = ['published', 'published', 'published', 'published', 'published',
            'published', 'published', 'published', 'published', 'draft'];

        $courseTitles = [
            'Laravel từ cơ bản đến nâng cao', 'React & Next.js Masterclass',
            'Python cho Data Science', 'Docker & Kubernetes thực chiến',
            'Thiết kế UI/UX với Figma', 'Vue.js 3 toàn diện',
            'Node.js Backend Pro', 'Flutter Mobile App Development',
            'Machine Learning với Python', 'Java Spring Boot microservices',
            'AWS Cloud Practitioner', 'Digital Marketing từ A-Z',
            'SEO & Content Marketing', 'Tiếng Anh giao tiếp',
            'Kỹ năng thuyết trình', 'Quản lý dự án Agile/Scrum',
            'PHP & MySQL nâng cao', 'TypeScript cho Frontend',
            'GraphQL & Apollo', 'Golang Backend Development',
        ];

        foreach ($sellers as $sIndex => $seller) {
            $numCourses = rand(3, 5);
            for ($c = 0; $c < $numCourses; $c++) {
                $category = $faker->randomElement($categories);
                $titleIndex = ($sIndex * 5 + $c) % count($courseTitles);
                $title = $courseTitles[$titleIndex];
                $course = Course::create([
                    'seller_id'      => $seller->id,
                    'category_id'    => $category->id,
                    'title'          => $title,
                    'slug'           => Str::slug($title) . '-' . uniqid(),
                    'description'    => $faker->paragraphs(3, true),
                    'price'          => rand(10, 100) * 10000,
                    'original_price' => rand(120, 200) * 10000,
                    'level'          => $faker->randomElement($levels),
                    'status'         => $faker->randomElement($statuses),
                    'is_free'        => false,
                    'requirements'   => json_encode(['Kiến thức cơ bản về máy tính', 'Laptop/PC cá nhân']),
                    'outcomes'       => json_encode(['Hiểu và áp dụng được kiến thức', 'Xây dựng dự án thực tế']),
                ]);
                $courses[] = $course;

                // Chapters
                $numChapters = rand(3, 7);
                $totalLessons = 0;
                for ($ch = 1; $ch <= $numChapters; $ch++) {
                    $chapter = Chapter::create([
                        'course_id'    => $course->id,
                        'title'        => 'Chương ' . $ch . ': ' . $faker->sentence(4),
                        'description'  => $faker->paragraph,
                        'sort_order'   => $ch,
                        'is_published' => true,
                    ]);

                    $numLessons = rand(2, 6);
                    $totalLessons += $numLessons;
                    for ($l = 1; $l <= $numLessons; $l++) {
                        $lesson = Lesson::create([
                            'chapter_id'   => $chapter->id,
                            'course_id'    => $course->id,
                            'title'        => 'Bài ' . $l . ': ' . $faker->sentence(6),
                            'description'  => $faker->paragraph,
                            'sort_order'   => $l,
                            'type'         => $faker->randomElement(['video', 'document', 'quiz_only']),
                            'is_preview'   => ($ch == 1 && $l == 1),
                            'is_published' => true,
                        ]);

                        if ($lesson->type === 'video') {
                            \App\Models\Video::create([
                                'lesson_id' => $lesson->id,
                                'r2_key' => 'sample-video.mp4',
                                'duration_seconds' => rand(120, 1800),
                                'size_bytes' => rand(1024000, 50000000),
                                'mime_type' => 'video/mp4',
                                'status' => 'ready',
                            ]);
                        }
                    }
                }
                $course->update(['total_lessons' => $totalLessons]);
            }
        }

        // ══════════════════════════════════════════════════════════════
        // 6. TOPICS (cho Contacts & Reports)
        // ══════════════════════════════════════════════════════════════
        Topic::truncate();
        $topicsData = [
            ['name' => 'Lỗi thanh toán', 'type' => 'contact'],
            ['name' => 'Vấn đề về tài khoản', 'type' => 'contact'],
            ['name' => 'Khiếu nại khóa học', 'type' => 'contact'],
            ['name' => 'Góp ý cải thiện', 'type' => 'contact'],
            ['name' => 'Hỗ trợ kỹ thuật', 'type' => 'contact'],
            ['name' => 'Nội dung vi phạm', 'type' => 'report'],
            ['name' => 'Khóa học kém chất lượng', 'type' => 'report'],
            ['name' => 'Giảng viên có hành vi không phù hợp', 'type' => 'report'],
            ['name' => 'Đánh giá spam/giả mạo', 'type' => 'report'],
            ['name' => 'Vi phạm bản quyền', 'type' => 'report'],
        ];
        $topics = [];
        foreach ($topicsData as $t) {
            $topics[] = Topic::create($t);
        }

        // ══════════════════════════════════════════════════════════════
        // 7. CONTACTS (Liên hệ từ người dùng)
        // ══════════════════════════════════════════════════════════════
        Contact::truncate();
        $contactSubjects = [
            'Lỗi thanh toán VNPay',
            'Yêu cầu đổi email',
            'Khóa học lỗi video',
            'Yêu cầu hoàn tiền',
            'Website loading chậm',
            'Không tải được tài liệu',
            'Góp ý chức năng mới',
            'Feedback giao diện',
            'Giảng viên không phản hồi',
            'Yêu cầu xóa tài khoản',
        ];
        $contactMessages = [
            'Tôi không thể thanh toán bằng VNPay, xin hãy hỗ trợ.',
            'Tôi muốn đổi email đăng nhập.',
            'Khóa học bị lỗi video, không xem được.',
            'Tôi muốn yêu cầu hoàn tiền cho đơn hàng gần đây.',
            'Website hoạt động chậm, loading rất lâu.',
            'Tôi không thể tải tài liệu bài học.',
            'Có thể thêm chức năng bookmark bài giảng không?',
            'Tôi muốn feedback về giao diện mới.',
            'Giảng viên không phản hồi tin nhắn của tôi.',
            'Tôi muốn xóa tài khoản.',
        ];
        foreach ($contactMessages as $i => $msg) {
            $user = $faker->randomElement($users);
            Contact::create([
                'name'       => $user->name,
                'email'      => $user->email,
                'subject'    => $contactSubjects[$i],
                'message'    => $msg,
                'status'     => $faker->randomElement(['pending', 'pending', 'resolved']),
                'created_at' => now()->subDays(rand(1, 60)),
                'updated_at' => now()->subDays(rand(0, 30)),
            ]);
        }

        // ══════════════════════════════════════════════════════════════
        // 8. REPORTS (Báo cáo vi phạm)
        // ══════════════════════════════════════════════════════════════
        Report::truncate();
        $reportReasons = [
            'Nội dung khóa học sao chép từ YouTube',
            'Video bài giảng chất lượng kém, không rõ ràng',
            'Giảng viên sử dụng ngôn ngữ không phù hợp',
            'Đánh giá 5 sao giả mạo bằng nhiều tài khoản',
            'Khóa học không đúng với mô tả',
            'Giảng viên spam tin nhắn quảng cáo',
            'Nội dung có chứa thông tin sai lệch',
            'Vi phạm bản quyền hình ảnh',
        ];
        $publishedCourses = collect($courses)->where('status', 'published');
        foreach ($reportReasons as $reason) {
            $user = $faker->randomElement($users);
            $course = $publishedCourses->isNotEmpty() ? $publishedCourses->random() : null;
            Report::create([
                'reporter_id'       => $user->id,
                'reportable_type'   => Course::class,
                'reportable_id'     => $course ? $course->id : 1,
                'reason'            => $reason,
                'status'            => $faker->randomElement(['pending', 'pending', 'reviewed', 'dismissed']),
                'created_at'        => now()->subDays(rand(1, 90)),
                'updated_at'        => now()->subDays(rand(0, 30)),
            ]);
        }

        // ══════════════════════════════════════════════════════════════
        // 9. WALLET BONUSES (Khuyến mãi nạp ví)
        // ══════════════════════════════════════════════════════════════
        WalletBonus::truncate();
        $bonusData = [
            ['min_amount' => 200000, 'bonus_percentage' => 3.00, 'max_bonus_amount' => 50000, 'is_active' => true],
            ['min_amount' => 500000, 'bonus_percentage' => 5.00, 'max_bonus_amount' => 100000, 'is_active' => true],
            ['min_amount' => 1000000, 'bonus_percentage' => 8.00, 'max_bonus_amount' => 200000, 'is_active' => true],
            ['min_amount' => 2000000, 'bonus_percentage' => 10.00, 'max_bonus_amount' => 500000, 'is_active' => true],
        ];
        foreach ($bonusData as $b) {
            WalletBonus::create($b);
        }

        // ══════════════════════════════════════════════════════════════
        // 10. WITHDRAWAL REQUESTS (Yêu cầu rút tiền)
        // ══════════════════════════════════════════════════════════════
        WithdrawalRequest::truncate();
        foreach ($sellers as $i => $seller) {
            // Mỗi seller có 1-2 yêu cầu rút tiền
            $numWithdrawals = rand(1, 2);
            for ($w = 0; $w < $numWithdrawals; $w++) {
                WithdrawalRequest::create([
                    'user_id'        => $seller->id,
                    'amount'         => rand(100, 500) * 1000,
                    'bank_name'      => $faker->randomElement(['Vietcombank', 'Techcombank', 'BIDV', 'VPBank']),
                    'account_number' => (string) rand(1000000000, 9999999999),
                    'account_name'   => strtoupper($seller->name),
                    'status'         => $faker->randomElement(['pending', 'pending', 'approved', 'rejected']),
                    'admin_note'     => $w === 0 ? null : 'Đã xử lý',
                    'created_at'     => now()->subDays(rand(1, 30)),
                    'updated_at'     => now()->subDays(rand(0, 10)),
                ]);
            }
        }

        // ══════════════════════════════════════════════════════════════
        // 11. CONVERSATIONS & MESSAGES
        // ══════════════════════════════════════════════════════════════
        Conversation::truncate();
        Message::truncate();
        $messageContents = [
            'Chào thầy, em có thắc mắc về bài học hôm nay.',
            'Cảm ơn em đã liên hệ, thầy sẽ giải đáp ngay.',
            'Em không hiểu phần này, thầy giải thích thêm được không ạ?',
            'Phần này em cần xem lại video bài 3 nhé.',
            'Dạ em hiểu rồi ạ. Cảm ơn thầy!',
            'Em nên thực hành thêm bài tập ở cuối chương.',
            'Em có thể gửi bài tập qua đây không ạ?',
            'Được em, thầy sẽ review cho.',
        ];
        for ($i = 0; $i < min(10, count($users)); $i++) {
            $seller = $sellers[$i % count($sellers)];
            $conv = Conversation::create([
                'user_one_id' => $users[$i]->id,
                'user_two_id' => $seller->id,
                'created_at'  => now()->subDays(rand(1, 60)),
            ]);

            $numMessages = rand(3, 8);
            for ($m = 0; $m < $numMessages; $m++) {
                Message::create([
                    'conversation_id' => $conv->id,
                    'sender_id'       => ($m % 2 === 0) ? $users[$i]->id : $seller->id,
                    'content'         => $messageContents[array_rand($messageContents)],
                    'created_at'      => $conv->created_at->copy()->addMinutes($m * rand(5, 120)),
                ]);
            }
        }

        // ══════════════════════════════════════════════════════════════
        // 12. WISHLISTS
        // ══════════════════════════════════════════════════════════════
        Wishlist::truncate();
        foreach ($users as $user) {
            $numWishlist = rand(1, 4);
            $wishlistCourses = collect($courses)->where('status', 'published')->random(min($numWishlist, $publishedCourses->count()));
            foreach ($wishlistCourses as $course) {
                Wishlist::create([
                    'user_id'   => $user->id,
                    'course_id' => $course->id,
                ]);
            }
        }

        // ══════════════════════════════════════════════════════════════
        // 13. CMS CONTENT (Pages, Blocks, QA)
        // ══════════════════════════════════════════════════════════════
        CorePage::truncate();
        CoreBlockContent::truncate();
        CoreQa::truncate();

        // Trang tĩnh
        $pages = [
            ['name' => 'Giới thiệu', 'seo_url' => 'about', 'type' => 'page'],
            ['name' => 'Điều khoản sử dụng', 'seo_url' => 'terms', 'type' => 'page'],
            ['name' => 'Chính sách bảo mật', 'seo_url' => 'privacy', 'type' => 'page'],
        ];
        foreach ($pages as $p) {
            $post = \App\Models\CorePost::create([
                'title' => $p['name'],
                'slug' => $p['seo_url'],
                'content' => '<p>Nội dung trang ' . $p['name'] . '</p>',
                'published' => 'publish',
                'post_type' => 'page'
            ]);
            CorePage::create([
                'post_id' => $post->id,
                'name' => $p['name'],
                'seo_url' => $p['seo_url'],
                'type' => $p['type']
            ]);
        }

        // Block contents
        $blocks = [
            ['slug' => 'hero_banner', 'title' => 'Học mọi lúc, mọi nơi', 'content' => ['text' => 'Khám phá hàng nghìn khóa học từ giảng viên hàng đầu'], 'type' => 'hero', 'status' => 1, 'sort_order' => 1],
            ['slug' => 'featured_section', 'title' => 'Khóa học nổi bật', 'content' => ['text' => 'Những khóa học được yêu thích nhất'], 'type' => 'section', 'status' => 1, 'sort_order' => 2],
            ['slug' => 'stats_counter', 'title' => 'Thành tựu', 'content' => ['text' => '10000+ Học viên'], 'type' => 'counter', 'status' => 1, 'sort_order' => 3],
        ];
        foreach ($blocks as $b) {
            CoreBlockContent::create($b);
        }

        // Q&A
        $qas = [
            ['question' => 'Làm thế nào để đăng ký tài khoản?', 'answer' => 'Bạn có thể đăng ký bằng email hoặc tài khoản Google.'],
            ['question' => 'Tôi có thể hoàn tiền không?', 'answer' => 'Có, bạn có thể yêu cầu hoàn tiền trong vòng 30 ngày kể từ ngày mua.'],
            ['question' => 'Làm sao để trở thành giảng viên?', 'answer' => 'Đăng nhập và vào mục "Đăng ký Giảng viên" để nộp hồ sơ.'],
            ['question' => 'Gói VIP có lợi ích gì?', 'answer' => 'Gói VIP giúp bạn có huy hiệu đặc biệt và nhận nhiều ưu đãi.'],
            ['question' => 'Phí hoa hồng cho giảng viên là bao nhiêu?', 'answer' => 'Mặc định là 20%. Mua gói VIP Giảng viên để giảm xuống còn 10-18%.'],
        ];
        foreach ($qas as $qa) {
            CoreQa::create($qa);
        }

        // ══════════════════════════════════════════════════════════════
        // 14. NOTIFICATIONS (cho admin & sellers)
        // ══════════════════════════════════════════════════════════════
        DB::table('notifications')->truncate();
        $notificationData = [
            // Admin notifications
            ['user' => $admin, 'role' => 'Admin', 'type' => 'new_report', 'data' => ['message' => 'Có báo cáo vi phạm mới cần xử lý', 'url' => '/admin/reports']],
            ['user' => $admin, 'role' => 'Admin', 'type' => 'new_withdrawal_request', 'data' => ['message' => 'Có yêu cầu rút tiền mới cần duyệt', 'url' => '/admin/withdrawals']],
            ['user' => $admin, 'role' => 'Admin', 'type' => 'new_contact', 'data' => ['message' => 'Có liên hệ mới từ người dùng', 'url' => '/admin/contacts']],
        ];
        // Seller notifications
        foreach ($sellers as $seller) {
            $notificationData[] = ['user' => $seller, 'role' => 'Seller', 'type' => 'new_course_enrollment', 'data' => ['message' => 'Có học viên mới đăng ký khóa học của bạn', 'url' => '/seller/students']];
            $notificationData[] = ['user' => $seller, 'role' => 'Seller', 'type' => 'new_review', 'data' => ['message' => 'Khóa học của bạn nhận được đánh giá mới', 'url' => '/seller/reviews']];
        }
        foreach ($notificationData as $n) {
            DB::table('notifications')->insert([
                'id'              => Str::uuid(),
                'type'            => 'App\\Notifications\\' . $n['role'] . '\\' . Str::studly($n['type']) . 'Notification',
                'notifiable_type' => User::class,
                'notifiable_id'   => $n['user']->id,
                'data'            => json_encode($n['data']),
                'read_at'         => rand(0, 1) ? now()->subDays(rand(1, 5)) : null,
                'created_at'      => now()->subDays(rand(1, 15)),
                'updated_at'      => now(),
            ]);
        }

        Schema::enableForeignKeyConstraints();

        // ══════════════════════════════════════════════════════════════
        // 15. ORDERS, DOANH THU, REVIEWS (từ đầu năm 2026)
        // ══════════════════════════════════════════════════════════════
        $this->call([
            OrderRevenueSeeder::class,
        ]);
    }
}
