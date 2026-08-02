<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\DailyStatistic;
use App\Models\OnlinePayment;
use App\Models\Order;
use App\Models\Review;
use App\Models\SystemWallet;
use App\Models\SystemWalletTransaction;
use App\Models\User;
use App\Models\VipPackage;
use App\Models\VipSubscription;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class OrderRevenueSeeder extends Seeder
{
    /**
     * Seed dữ liệu đơn hàng (Order) và doanh thu từ 01/01/2026 đến hiện tại.
     *
     * Seeder này tạo ra:
     * - Orders (mua khóa học + VIP packages)
     * - OnlinePayments (thanh toán qua VNPay/MoMo)
     * - WalletTransactions (cho cả buyer & seller)
     * - CourseEnrollments (ghi danh sau khi mua)
     * - VipSubscriptions (khi mua gói VIP)
     * - CouponUsages (khi dùng mã giảm giá)
     * - DailyStatistics (thống kê theo ngày cho seller)
     * - SystemWalletTransactions (hoa hồng hệ thống)
     * - Reviews (đánh giá khóa học sau mua)
     */
    public function run(): void
    {
        $this->command->info('🚀 Bắt đầu seed dữ liệu Orders & Doanh thu...');

        Schema::disableForeignKeyConstraints();

        // Truncate các bảng liên quan
        $this->truncateTables();

        // Lấy dữ liệu hiện có
        $sellers = User::whereJsonContains('roles', 'seller')->get();
        $users = User::where('current_role', 'user')
            ->whereJsonDoesntContain('roles', 'seller')
            ->whereJsonDoesntContain('roles', 'admin')
            ->get();
        $courses = Course::where('status', 'published')->get();
        $vipPackages = VipPackage::where('is_active', true)->get();
        $categories = Category::all();

        if ($sellers->isEmpty() || $users->isEmpty() || $courses->isEmpty()) {
            $this->command->error('❌ Cần có sellers, users và courses trước. Hãy chạy DatabaseSeeder trước.');
            return;
        }

        // ── Tạo thêm users để đủ dữ liệu (cần ít nhất 100 users) ──────
        $faker = \Faker\Factory::create('vi_VN');
        $password = \Illuminate\Support\Facades\Hash::make('123');
        $existingUserCount = $users->count();
        $targetUserCount = 100;

        if ($existingUserCount < $targetUserCount) {
            $newUsersNeeded = $targetUserCount - $existingUserCount;
            $this->command->info("👥 Tạo thêm {$newUsersNeeded} users để đủ dữ liệu...");

            $startIndex = $existingUserCount + 1;
            for ($i = $startIndex; $i < $startIndex + $newUsersNeeded; $i++) {
                $user = User::create([
                    'name'              => $faker->name,
                    'email'             => "fakeuser{$i}@gmail.com",
                    'password'          => $password,
                    'roles'             => ['user'],
                    'current_role'      => 'user',
                    'email_verified_at' => now(),
                    'is_active'         => true,
                    'created_at'        => Carbon::create(2026, 1, 1)->addDays(rand(0, 180)),
                    'updated_at'        => now(),
                ]);
                Wallet::create(['user_id' => $user->id, 'balance' => rand(200000, 2000000)]);
            }

            // Refresh users collection
            $users = User::where('current_role', 'user')
                ->whereJsonDoesntContain('roles', 'seller')
                ->whereJsonDoesntContain('roles', 'admin')
                ->get();
        }

        $this->command->info("📊 Tìm thấy: {$sellers->count()} sellers, {$users->count()} users, {$courses->count()} courses, {$vipPackages->count()} VIP packages");

        // ── Tạo Coupons cho sellers ─────────────────────────────────────
        $coupons = $this->createCoupons($sellers, $courses);
        $this->command->info("🎟️  Đã tạo {$coupons->count()} coupons");

        // ── Khởi tạo System Wallet ──────────────────────────────────────
        $systemWallet = SystemWallet::getInstance();

        // ── Phạm vi ngày: 01/01/2026 → hôm nay ─────────────────────────
        $startDate = Carbon::create(2026, 1, 1);
        $endDate = Carbon::now();
        $totalDays = $startDate->diffInDays($endDate);

        $this->command->info("📅 Seed dữ liệu từ {$startDate->format('d/m/Y')} đến {$endDate->format('d/m/Y')} ({$totalDays} ngày)");

        // Tracking đã mua để tránh trùng (unique user_id + course_id)
        $purchasedMap = [];
        // Track daily stats per seller
        $dailyStats = [];

        $totalOrders = 0;
        $totalRevenue = 0;
        $totalVipOrders = 0;

        // ── Lặp theo từng ngày ──────────────────────────────────────────
        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            $dayOfYear = $date->dayOfYear;
            $monthIndex = $date->month;

            // Tính số đơn hàng mỗi ngày theo xu hướng tăng trưởng
            // Tháng 1: ít (2-4), tăng dần, tháng 7: nhiều (8-15)
            $baseOrders = $this->getOrdersForDay($date, $monthIndex, $dayOfYear);

            // Cuối tuần giảm 30%
            if ($date->isWeekend()) {
                $baseOrders = max(1, (int) ($baseOrders * 0.7));
            }

            // Ngày đặc biệt: Tết, 8/3, 30/4, 1/5... tăng mạnh
            if ($this->isSpecialDay($date)) {
                $baseOrders = (int) ($baseOrders * 1.8);
            }

            $dayRevenue = 0;
            $dayOrders = 0;
            $dayRevenuePerSeller = [];

            for ($i = 0; $i < $baseOrders; $i++) {
                // 88% mua khóa học, 12% mua VIP
                $isVipOrder = (rand(1, 100) <= 12) && $vipPackages->isNotEmpty();

                if ($isVipOrder) {
                    $result = $this->createVipOrder(
                        $users, $vipPackages, $coupons, $date, $systemWallet
                    );
                    if ($result) {
                        $totalVipOrders++;
                        $dayRevenue += $result['revenue'];
                        $dayOrders++;
                        $totalOrders++;
                        $totalRevenue += $result['revenue'];
                    }
                } else {
                    $result = $this->createCourseOrder(
                        $users, $courses, $sellers, $coupons, $date,
                        $purchasedMap, $systemWallet
                    );
                    if ($result) {
                        $dayRevenue += $result['revenue'];
                        $dayOrders++;
                        $totalOrders++;
                        $totalRevenue += $result['revenue'];

                        // Track per seller
                        $sellerId = $result['seller_id'];
                        if (!isset($dayRevenuePerSeller[$sellerId])) {
                            $dayRevenuePerSeller[$sellerId] = ['revenue' => 0, 'orders' => 0];
                        }
                        $dayRevenuePerSeller[$sellerId]['revenue'] += $result['seller_amount'];
                        $dayRevenuePerSeller[$sellerId]['orders']++;
                    }
                }
            }

            // ── Tạo DailyStatistic cho mỗi seller ──────────────────────
            foreach ($dayRevenuePerSeller as $sellerId => $stats) {
                DailyStatistic::create([
                    'seller_id'     => $sellerId,
                    'date'          => $date->toDateString(),
                    'total_revenue' => $stats['revenue'],
                    'total_orders'  => $stats['orders'],
                    'created_at'    => $date,
                    'updated_at'    => $date,
                ]);
            }

            // Hiển thị tiến trình mỗi tháng
            if ($date->day === 1) {
                $this->command->info("  📆 Tháng {$date->format('m/Y')}: đang xử lý...");
            }
        }

        // ── Random refunds (3-5% orders) ────────────────────────────────
        $refundCount = $this->createRefunds($systemWallet);

        Schema::enableForeignKeyConstraints();

        $this->command->info('');
        $this->command->info('✅ Seed hoàn tất!');
        $this->command->info("   📦 Tổng orders: {$totalOrders}");
        $this->command->info("   🎓 Orders khóa học: " . ($totalOrders - $totalVipOrders));
        $this->command->info("   👑 Orders VIP: {$totalVipOrders}");
        $this->command->info("   💰 Tổng doanh thu: " . number_format($totalRevenue, 0, ',', '.') . ' VND');
        $this->command->info("   🔄 Đơn hoàn tiền: {$refundCount}");
        $this->command->info("   💳 System Wallet: " . number_format($systemWallet->fresh()->balance, 0, ',', '.') . ' VND');
    }

    /**
     * Truncate các bảng liên quan để seed lại.
     */
    private function truncateTables(): void
    {
        // Chỉ truncate các bảng do seeder này quản lý
        Order::truncate();
        OnlinePayment::truncate();
        WalletTransaction::truncate();
        CourseEnrollment::truncate();
        VipSubscription::truncate();
        CouponUsage::truncate();
        DailyStatistic::truncate();
        Review::truncate();

        // Reset system wallet transactions
        SystemWalletTransaction::truncate();

        // Reset system wallet balance
        DB::table('system_wallets')->update(['balance' => 0]);

        // Reset wallet balances
        DB::table('wallets')->update([
            'balance'           => 0,
            'balance_available' => 0,
            'balance_pending'   => 0,
        ]);

        // Truncate coupons
        Coupon::truncate();

        $this->command->info('🗑️  Đã xóa dữ liệu cũ');
    }

    /**
     * Tính số đơn hàng theo ngày, tăng trưởng theo tháng.
     */
    private function getOrdersForDay(Carbon $date, int $month, int $dayOfYear): int
    {
        // Xu hướng: tháng 1 ít, tăng dần đến tháng 7
        $monthMultipliers = [
            1 => 1.0,   // Tết, ít mua
            2 => 1.3,   // Sau Tết, bắt đầu tăng
            3 => 1.6,   // Mùa tuyển sinh
            4 => 1.8,   // Tăng trưởng
            5 => 2.0,   // Mùa hè bắt đầu
            6 => 2.3,   // Mùa hè
            7 => 2.5,   // Peak season
        ];

        $multiplier = $monthMultipliers[$month] ?? 2.5;
        $base = rand(3, 6);

        return (int) ($base * $multiplier);
    }

    /**
     * Kiểm tra ngày đặc biệt (lễ, sự kiện).
     */
    private function isSpecialDay(Carbon $date): bool
    {
        $specialDays = [
            '01-01', // Tết dương lịch
            '01-28', '01-29', '01-30', '01-31', // Tết âm lịch (giả lập)
            '02-14', // Valentine
            '03-08', // Ngày phụ nữ
            '04-30', // Giải phóng
            '05-01', // Lao động
            '06-01', // Quốc tế thiếu nhi
            '07-20', // Sale mùa hè
        ];

        return in_array($date->format('m-d'), $specialDays);
    }

    /**
     * Tạo coupons cho sellers.
     */
    private function createCoupons($sellers, $courses): \Illuminate\Support\Collection
    {
        $coupons = collect();

        // Mỗi seller tạo 2-3 coupon
        foreach ($sellers as $seller) {
            $sellerCourses = $courses->where('seller_id', $seller->id);

            // Coupon giảm theo %
            $coupon1 = Coupon::create([
                'seller_id'          => $seller->id,
                'code'               => 'SALE' . strtoupper(Str::random(4)),
                'type'               => 'percent',
                'value'              => rand(10, 30),
                'min_order_amount'   => 100000,
                'max_discount_amount' => rand(50000, 200000),
                'max_uses'           => rand(50, 200),
                'used_count'         => 0,
                'course_id'          => null, // applies to all seller courses
                'starts_at'          => Carbon::create(2026, 1, 1),
                'expires_at'         => Carbon::create(2026, 12, 31),
                'is_active'          => true,
            ]);
            $coupons->push($coupon1);

            // Coupon giảm cố định
            $coupon2 = Coupon::create([
                'seller_id'          => $seller->id,
                'code'               => 'FLAT' . strtoupper(Str::random(4)),
                'type'               => 'fixed',
                'value'              => rand(20000, 100000),
                'min_order_amount'   => 200000,
                'max_discount_amount' => null,
                'max_uses'           => rand(30, 100),
                'used_count'         => 0,
                'course_id'          => $sellerCourses->isNotEmpty() ? $sellerCourses->random()->id : null,
                'starts_at'          => Carbon::create(2026, 1, 1),
                'expires_at'         => Carbon::create(2026, 12, 31),
                'is_active'          => true,
            ]);
            $coupons->push($coupon2);
        }

        return $coupons;
    }

    /**
     * Tạo đơn hàng mua khóa học.
     */
    private function createCourseOrder(
        $users, $courses, $sellers, $coupons, Carbon $date,
        array &$purchasedMap, $systemWallet
    ): ?array {
        $user = $users->random();
        $course = $courses->random();

        // Kiểm tra đã mua chưa (unique constraint)
        $key = $user->id . '-' . $course->id;
        if (isset($purchasedMap[$key])) {
            return null;
        }
        $purchasedMap[$key] = true;

        $sellerId = $course->seller_id;
        $originalPrice = $course->price;

        // 30% chance dùng coupon
        $discountAmount = 0;
        $usedCoupon = null;
        if (rand(1, 100) <= 30 && $coupons->isNotEmpty()) {
            $sellerCoupons = $coupons->where('seller_id', $sellerId);
            if ($sellerCoupons->isNotEmpty()) {
                $coupon = $sellerCoupons->random();
                if ($coupon->max_uses === null || $coupon->used_count < $coupon->max_uses) {
                    $discountAmount = $coupon->calculateDiscount($originalPrice);
                    if ($discountAmount > 0) {
                        $usedCoupon = $coupon;
                    }
                }
            }
        }

        $amountPaid = max(0, $originalPrice - $discountAmount);

        // Commission: default 20%, VIP sellers có thể thấp hơn
        $commissionRate = 20;
        $commissionAmount = round($amountPaid * $commissionRate / 100, 2);
        $sellerAmount = $amountPaid - $commissionAmount;

        // Payment method: 50% wallet, 30% vnpay, 20% momo
        $paymentMethods = ['wallet', 'wallet', 'wallet', 'wallet', 'wallet',
            'vnpay', 'vnpay', 'vnpay', 'momo', 'momo'];
        $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

        // Tạo OnlinePayment nếu thanh toán online
        $onlinePaymentId = null;
        if (in_array($paymentMethod, ['vnpay', 'momo'])) {
            $onlinePayment = OnlinePayment::create([
                'user_id'                => $user->id,
                'payment_gateway'        => $paymentMethod,
                'transaction_code'       => strtoupper($paymentMethod) . '-' . Str::random(12),
                'gateway_transaction_id' => strtoupper(Str::random(16)),
                'amount'                 => $amountPaid,
                'status'                 => 'completed',
                'raw_response'           => json_encode(['status' => 'success', 'gateway' => $paymentMethod]),
                'paid_at'                => $date->copy()->addMinutes(rand(1, 30)),
                'created_at'             => $date,
                'updated_at'             => $date,
            ]);
            $onlinePaymentId = $onlinePayment->id;
        }

        // Tạo Order
        $order = Order::create([
            'user_id'            => $user->id,
            'course_id'          => $course->id,
            'vip_package_id'     => null,
            'vip_subscription_id' => null,
            'online_payment_id'  => $onlinePaymentId,
            'amount_original'    => $originalPrice,
            'discount_amount'    => $discountAmount,
            'amount_paid'        => $amountPaid,
            'commission_rate'    => $commissionRate,
            'commission_amount'  => $commissionAmount,
            'seller_amount'      => $sellerAmount,
            'status'             => 'completed',
            'payment_method'     => $paymentMethod,
            'created_at'         => $date,
            'updated_at'         => $date,
        ]);

        // Tạo CouponUsage nếu dùng coupon
        if ($usedCoupon) {
            CouponUsage::create([
                'coupon_id'        => $usedCoupon->id,
                'user_id'          => $user->id,
                'order_id'         => $order->id,
                'discount_applied' => $discountAmount,
                'created_at'       => $date,
                'updated_at'       => $date,
            ]);
            $usedCoupon->increment('used_count');
        }

        // Tạo CourseEnrollment
        CourseEnrollment::create([
            'course_id'  => $course->id,
            'seller_id'  => $sellerId,
            'student_id' => $user->id,
            'progress'   => rand(0, 100),
            'created_at' => $date,
            'updated_at' => $date,
        ]);

        // Tạo WalletTransaction cho buyer (purchase)
        $buyerWallet = Wallet::where('user_id', $user->id)->first();
        if ($buyerWallet && $paymentMethod === 'wallet') {
            WalletTransaction::create([
                'wallet_id'      => $buyerWallet->id,
                'user_id'        => $user->id,
                'order_id'       => $order->id,
                'type'           => 'purchase',
                'amount'         => $amountPaid,
                'balance_before' => $buyerWallet->balance,
                'balance_after'  => $buyerWallet->balance - $amountPaid,
                'description'    => "Mua khóa học: {$course->title}",
                'reference_code' => 'PUR-' . Str::random(10),
                'status'         => 'completed',
                'created_at'     => $date,
                'updated_at'     => $date,
            ]);
        }

        // Tạo WalletTransaction cho seller (earning - pending)
        $sellerWallet = Wallet::where('user_id', $sellerId)->first();
        if ($sellerWallet) {
            WalletTransaction::create([
                'wallet_id'      => $sellerWallet->id,
                'user_id'        => $sellerId,
                'order_id'       => $order->id,
                'type'           => 'earning',
                'amount'         => $sellerAmount,
                'balance_before' => $sellerWallet->balance,
                'balance_after'  => $sellerWallet->balance + $sellerAmount,
                'description'    => "Thu nhập từ khóa học: {$course->title}",
                'reference_code' => 'ERN-' . Str::random(10),
                'status'         => 'completed',
                'created_at'     => $date,
                'updated_at'     => $date,
            ]);
            $sellerWallet->increment('balance', $sellerAmount);
            $sellerWallet->increment('balance_available', $sellerAmount);
        }

        // System wallet nhận commission
        DB::table('system_wallets')->where('id', $systemWallet->id)->increment('balance', $commissionAmount);
        SystemWalletTransaction::create([
            'amount'         => $commissionAmount,
            'type'           => 'in',
            'reference_type' => 'Order',
            'reference_id'   => $order->id,
            'description'    => "Hoa hồng đơn #{$order->id} - {$course->title}",
            'created_at'     => $date,
            'updated_at'     => $date,
        ]);

        // 40% chance tạo review (chỉ khi đã mua)
        if (rand(1, 100) <= 40) {
            Review::create([
                'user_id'    => $user->id,
                'course_id'  => $course->id,
                'order_id'   => $order->id,
                'rating'     => $this->weightedRating(),
                'content'    => $this->randomReviewContent(),
                'is_hidden'  => false,
                'created_at' => $date->copy()->addDays(rand(1, 7)),
                'updated_at' => $date->copy()->addDays(rand(1, 7)),
            ]);
        }

        // Update course stats
        $course->increment('students_count');
        $course->increment('total_revenue', $sellerAmount);

        return [
            'revenue'       => $amountPaid,
            'seller_id'     => $sellerId,
            'seller_amount' => $sellerAmount,
        ];
    }

    /**
     * Tạo đơn hàng VIP package.
     */
    private function createVipOrder(
        $users, $vipPackages, $coupons, Carbon $date, $systemWallet
    ): ?array {
        $user = $users->random();
        $package = $vipPackages->random();
        $originalPrice = $package->price;
        $amountPaid = $originalPrice;

        // VIP orders không tính commission cho seller, 100% vào hệ thống
        $commissionRate = 100;
        $commissionAmount = $amountPaid;
        $sellerAmount = 0;

        $paymentMethods = ['wallet', 'wallet', 'vnpay', 'momo'];
        $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

        // Online payment
        $onlinePaymentId = null;
        if (in_array($paymentMethod, ['vnpay', 'momo'])) {
            $onlinePayment = OnlinePayment::create([
                'user_id'                => $user->id,
                'payment_gateway'        => $paymentMethod,
                'transaction_code'       => 'VIP-' . strtoupper(Str::random(12)),
                'gateway_transaction_id' => strtoupper(Str::random(16)),
                'amount'                 => $amountPaid,
                'status'                 => 'completed',
                'raw_response'           => json_encode(['status' => 'success']),
                'paid_at'                => $date->copy()->addMinutes(rand(1, 15)),
                'created_at'             => $date,
                'updated_at'             => $date,
            ]);
            $onlinePaymentId = $onlinePayment->id;
        }

        // Tạo VipSubscription
        $subscription = VipSubscription::create([
            'user_id'        => $user->id,
            'vip_package_id' => $package->id,
            'starts_at'      => $date,
            'expires_at'     => $date->copy()->addDays($package->duration_days),
            'status'         => $date->copy()->addDays($package->duration_days)->isFuture() ? 'active' : 'expired',
            'created_at'     => $date,
            'updated_at'     => $date,
        ]);

        // Tạo Order
        $order = Order::create([
            'user_id'            => $user->id,
            'course_id'          => null,
            'vip_package_id'     => $package->id,
            'vip_subscription_id' => $subscription->id,
            'online_payment_id'  => $onlinePaymentId,
            'amount_original'    => $originalPrice,
            'discount_amount'    => 0,
            'amount_paid'        => $amountPaid,
            'commission_rate'    => $commissionRate,
            'commission_amount'  => $commissionAmount,
            'seller_amount'      => $sellerAmount,
            'status'             => 'completed',
            'payment_method'     => $paymentMethod,
            'created_at'         => $date,
            'updated_at'         => $date,
        ]);

        // Wallet transaction cho buyer
        $buyerWallet = Wallet::where('user_id', $user->id)->first();
        if ($buyerWallet && $paymentMethod === 'wallet') {
            WalletTransaction::create([
                'wallet_id'      => $buyerWallet->id,
                'user_id'        => $user->id,
                'order_id'       => $order->id,
                'type'           => 'vip_payment',
                'amount'         => $amountPaid,
                'balance_before' => $buyerWallet->balance,
                'balance_after'  => $buyerWallet->balance - $amountPaid,
                'description'    => "Mua gói VIP: {$package->name}",
                'reference_code' => 'VIP-' . Str::random(10),
                'status'         => 'completed',
                'created_at'     => $date,
                'updated_at'     => $date,
            ]);
        }

        // System wallet nhận toàn bộ
        DB::table('system_wallets')->where('id', $systemWallet->id)->increment('balance', $amountPaid);
        SystemWalletTransaction::create([
            'amount'         => $amountPaid,
            'type'           => 'in',
            'reference_type' => 'Order',
            'reference_id'   => $order->id,
            'description'    => "Thu nhập gói VIP: {$package->name}",
            'created_at'     => $date,
            'updated_at'     => $date,
        ]);

        return [
            'revenue' => $amountPaid,
        ];
    }

    /**
     * Tạo refunds ngẫu nhiên (3-5% đơn hàng).
     */
    private function createRefunds($systemWallet): int
    {
        $completedOrders = Order::where('status', 'completed')
            ->whereNotNull('course_id')
            ->inRandomOrder()
            ->limit((int) (Order::count() * 0.04))
            ->get();

        $count = 0;
        foreach ($completedOrders as $order) {
            $refundDate = Carbon::parse($order->created_at)->addDays(rand(1, 15));

            // Chỉ refund nếu trong 30 ngày
            if ($refundDate->diffInDays($order->created_at) > 30) {
                continue;
            }

            $order->update([
                'status'        => 'refunded',
                'refunded_at'   => $refundDate,
                'refund_reason' => $this->randomRefundReason(),
            ]);

            // Hoàn tiền cho buyer
            $buyerWallet = Wallet::where('user_id', $order->user_id)->first();
            if ($buyerWallet) {
                WalletTransaction::create([
                    'wallet_id'      => $buyerWallet->id,
                    'user_id'        => $order->user_id,
                    'order_id'       => $order->id,
                    'type'           => 'refund',
                    'amount'         => $order->amount_paid,
                    'balance_before' => $buyerWallet->balance,
                    'balance_after'  => $buyerWallet->balance + $order->amount_paid,
                    'description'    => "Hoàn tiền đơn #{$order->id}",
                    'reference_code' => 'REF-' . Str::random(10),
                    'status'         => 'completed',
                    'created_at'     => $refundDate,
                    'updated_at'     => $refundDate,
                ]);
                $buyerWallet->increment('balance', $order->amount_paid);
            }

            // Trừ khỏi system wallet
            DB::table('system_wallets')->where('id', $systemWallet->id)
                ->decrement('balance', $order->commission_amount);
            SystemWalletTransaction::create([
                'amount'         => $order->commission_amount,
                'type'           => 'out',
                'reference_type' => 'Order',
                'reference_id'   => $order->id,
                'description'    => "Hoàn hoa hồng đơn #{$order->id}",
                'created_at'     => $refundDate,
                'updated_at'     => $refundDate,
            ]);

            // Xóa enrollment
            CourseEnrollment::where('course_id', $order->course_id)
                ->where('student_id', $order->user_id)
                ->delete();

            // Xóa review nếu có
            Review::where('user_id', $order->user_id)
                ->where('course_id', $order->course_id)
                ->delete();

            $count++;
        }

        return $count;
    }

    /**
     * Rating có trọng số (thiên về 4-5 sao).
     */
    private function weightedRating(): int
    {
        $weights = [1 => 2, 2 => 5, 3 => 15, 4 => 38, 5 => 40];
        $rand = rand(1, 100);
        $cumulative = 0;

        foreach ($weights as $rating => $weight) {
            $cumulative += $weight;
            if ($rand <= $cumulative) {
                return $rating;
            }
        }

        return 4;
    }

    /**
     * Nội dung review ngẫu nhiên bằng tiếng Việt.
     */
    private function randomReviewContent(): string
    {
        $reviews = [
            'Khóa học rất hay và bổ ích. Giảng viên giảng dạy dễ hiểu.',
            'Nội dung chất lượng, đáng đồng tiền bát gạo.',
            'Tôi đã học được rất nhiều từ khóa học này. Cảm ơn giảng viên!',
            'Khóa học tốt nhưng cần thêm bài tập thực hành.',
            'Giảng viên nhiệt tình, nội dung cập nhật mới nhất.',
            'Rất hài lòng với khóa học. Sẽ giới thiệu cho bạn bè.',
            'Nội dung khá ổn, phù hợp cho người mới bắt đầu.',
            'Video chất lượng cao, âm thanh rõ ràng. Rất chuyên nghiệp!',
            'Mình đã áp dụng được kiến thức vào công việc thực tế.',
            'Khóa học xứng đáng với giá tiền. 5 sao!',
            'Giảng viên giải đáp thắc mắc nhanh chóng.',
            'Tuyệt vời! Đây là khóa học tốt nhất mình từng học.',
            'Cần bổ sung thêm phần lý thuyết, chỉ tập trung thực hành thôi.',
            'Khóa học giúp mình hiểu sâu hơn về lĩnh vực này.',
            'Nội dung phong phú, bài giảng sinh động.',
            'Hơi khó cho người mới nhưng rất đáng học.',
            'Mình học xong và đã tìm được việc làm mới. Cảm ơn!',
            'Khóa học OK, nhưng mong muốn có thêm case study thực tế.',
            'Giảng viên có kinh nghiệm, chia sẻ nhiều kinh nghiệm quý báu.',
            'Đáng để đầu tư thời gian và tiền bạc.',
        ];

        return $reviews[array_rand($reviews)];
    }

    /**
     * Lý do hoàn tiền ngẫu nhiên.
     */
    private function randomRefundReason(): string
    {
        $reasons = [
            'Nội dung không đúng mô tả',
            'Không phù hợp với trình độ của tôi',
            'Đã mua nhầm khóa học',
            'Chất lượng video không tốt',
            'Không còn nhu cầu học',
            'Giảng viên giảng dạy khó hiểu',
            'Khóa học quá cơ bản so với mong đợi',
            'Lý do cá nhân',
        ];

        return $reasons[array_rand($reasons)];
    }
}
