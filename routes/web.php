<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\BlogController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\CourseController;
use App\Http\Controllers\Frontend\FaqController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\InstructorController;
use App\Http\Controllers\Frontend\Dashboard\DashboardOverviewController;
use App\Http\Controllers\Finance\WalletController;
use App\Http\Controllers\Frontend\Dashboard\OrderController;
use App\Http\Controllers\Frontend\Dashboard\ProfileController as DashboardProfileController;
use App\Http\Controllers\Frontend\LearningController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\Frontend\WishlistController;
use App\Http\Controllers\Shared\ReviewController;
use App\Http\Controllers\Seller\CouponController;
use App\Http\Controllers\Seller\Courses\ChapterController;
use App\Http\Controllers\Seller\Courses\CurriculumController;
use App\Http\Controllers\Seller\Courses\LessonController;
use App\Http\Controllers\Seller\Courses\LessonVideoController;
use App\Http\Controllers\Seller\Courses\QuizController;
use App\Http\Controllers\Seller\Courses\SellerCourseController;
use App\Http\Controllers\Seller\ProfileController;
use App\Http\Controllers\Seller\StudentController;
use App\Http\Controllers\Seller\SellerDashboardController;
use App\Http\Controllers\Shared\NotificationController;
use App\Http\Controllers\Finance\RevenueController;
use App\Http\Controllers\Seller\VipPackageController;
use App\Http\Controllers\Frontend\CommentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ROUTES CHO KHÁCH (CHƯA ĐĂNG NHẬP)
Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ROUTES YÊU CẦU ĐĂNG NHẬP (AUTH)
Route::get('/seller/settings-test', fn () => Inertia::render('Seller/Settings'))->name('seller.settings.test');

Route::middleware('auth')->group(function () {

    // Các route cơ bản
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/profile', fn () => 'Profile edit page placeholder')->name('profile.edit');

    // DASHBOARD ROUTES (Học viên)
    Route::prefix('my-account')->name('dashboard.')->group(function () {
        Route::get('/', [DashboardOverviewController::class, 'index'])->name('index');
        Route::get('/my-courses', [DashboardOverviewController::class, 'myCourses'])->name('my-courses');
        Route::get('/certificates', [DashboardOverviewController::class, 'certificates'])->name('certificates');

        Route::get('/orders', [OrderController::class, 'index'])->name('orders');
        Route::get('/orders/{orderId}', [OrderController::class, 'show'])->name('orders.detail');

        Route::get('/profile', [DashboardProfileController::class, 'index'])->name('profile');
        Route::put('/profile', [DashboardProfileController::class, 'updateProfile'])->name('profile.update');
        Route::put('/profile/password', [DashboardProfileController::class, 'changePassword'])->name('profile.password');

        Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');

        // VIP Packages for User
        Route::get('/vip-packages', [\App\Http\Controllers\Frontend\Dashboard\UserVipController::class, 'index'])->name('vip.index');
        Route::post('/vip-packages/buy', [\App\Http\Controllers\Frontend\Dashboard\UserVipController::class, 'buy'])->name('vip.buy');
    });

    // SHARED FINANCE ROUTES
    Route::prefix('finance')->name('finance.')->middleware('auth')->group(function () {
        Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');
        Route::get('/bank-accounts', [WalletController::class, 'bankAccounts'])->name('bank-accounts.index');
        Route::post('/bank-accounts', [WalletController::class, 'addBankAccount'])->name('bank-accounts.store');
        Route::put('/bank-accounts/{bankAccountId}', [WalletController::class, 'updateBankAccount'])->name('bank-accounts.update');
        Route::delete('/bank-accounts/{bankAccountId}', [WalletController::class, 'deleteBankAccount'])->name('bank-accounts.destroy');
        Route::patch('/bank-accounts/{bankAccountId}/set-default', [WalletController::class, 'setDefaultBankAccount'])->name('bank-accounts.set-default');
        Route::post('/wallet/activate', [WalletController::class, 'activate'])->name('wallet.activate');
        Route::post('/wallet/withdraw', [WalletController::class, 'withdraw'])->name('wallet.withdraw');
    });

    // SELLER ROUTES
    Route::prefix('seller')->name('seller.')->middleware('role:seller,admin,root')->group(function () {

        // 1. QUẢN LÝ MÃ GIẢM GIÁ (COUPONS)
        Route::get('coupons', [CouponController::class, 'index'])->name('coupons.index');
        Route::post('coupons/store', [CouponController::class, 'store'])->name('coupons.store');
        Route::put('coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
        Route::delete('coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');
        Route::patch('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->name('coupons.toggle-status');

        // 2. QUẢN LÝ HỌC VIÊN (STUDENTS)
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::patch('students/{id}/block', [StudentController::class, 'block'])->name('students.block');

        // 3. QUẢN LÝ KHÓA HỌC CHUNG (COURSES)
        Route::resource('courses', SellerCourseController::class)->except(['show']);

        // 4. QUẢN LÝ GIÁO TRÌNH CHUYÊN SÂU
        Route::prefix('courses/{course}/curriculum')->name('courses.curriculum.')->group(function () {

            Route::get('/', [CurriculumController::class, 'index'])->name('index');

            // CHAPTERS (CHƯƠNG MỤC)
            Route::post('chapters', [ChapterController::class, 'store'])->name('chapters.store');
            Route::post('chapters/reorder', [ChapterController::class, 'reorder'])->name('chapters.reorder');
            Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
            Route::delete('chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');

            // LESSONS (BÀI HỌC)
            Route::post('chapters/{chapter}/lessons', [LessonController::class, 'store'])->name('chapters.lessons.store');
            Route::post('lessons/reorder', [LessonController::class, 'reorder'])->name('lessons.reorder');
            Route::get('lessons/{lesson}', [LessonController::class, 'show'])->name('lessons.show');
            Route::put('lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
            Route::delete('lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');

            // VIDEO TRONG BÀI HỌC
            Route::post('lessons/{lesson}/video/presigned-url', [LessonVideoController::class, 'generatePresignedUrl'])->name('lessons.video.presigned-url');
            Route::post('lessons/{lesson}/video/confirm', [LessonVideoController::class, 'confirmUpload'])->name('lessons.video.confirm');

            // QUIZ (CÂU HỎI TRẮC NGHIỆM)
            Route::post('quiz/{lesson}/questions', [QuizController::class, 'storeQuestion'])->name('quiz.store-question');
            Route::post('quiz/{lesson}/reorder', [QuizController::class, 'reorderQuizzes'])->name('quiz.reorder');
            Route::put('quiz/questions/{questionId}', [QuizController::class, 'updateQuestion'])->name('quiz.update-question');
            Route::delete('quiz/questions/{questionId}', [QuizController::class, 'destroyQuestion'])->name('quiz.delete-question');
        });
        // 5. QUẢN LÝ PROFILE SELLER
        Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::get('profile/notifications', [ProfileController::class, 'notifications'])->name('profile.notifications');
        Route::put('profile/info', [ProfileController::class, 'updateInfo'])->name('profile.updateInfo');
        Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.updatePassword');
        Route::put('profile/payment', [ProfileController::class, 'updatePayment'])->name('profile.updatePayment');

        Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
        Route::get('revenues', [RevenueController::class, 'index'])->name('revenues.index');
        Route::post('revenues/withdraw', [RevenueController::class, 'withdraw'])->name('revenues.withdraw');
        Route::get('courses/{course}/reviews', [ReviewController::class, 'index'])->name('courses.reviews.index');
        Route::patch('reviews/{review}/report', [ReviewController::class, 'report'])->name('reviews.report');
        Route::post('reviews/{review}/reply', [ReviewController::class, 'reply'])->name('reviews.reply');

        // VIP Packages
        Route::get('vip-packages', [VipPackageController::class, 'index'])->name('vip.index');
        Route::post('vip-packages/buy', [VipPackageController::class, 'buy'])->name('vip.buy');
        Route::get('vip-packages/vnpay-return', [VipPackageController::class, 'vnpayReturn'])->name('vip.vnpay.return');

    });

});
Route::prefix('tech-education')->name('frontend.')->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/courses/search-suggestions', [CourseController::class, 'searchSuggestions'])->name('course.search-suggestions');
    Route::get('/courses', [CourseController::class, 'index'])->name('course.index');
    Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('course.detail');
    Route::get('/instructors', [InstructorController::class, 'index'])->name('instructor.index');
    Route::get('/instructors/{id}', [InstructorController::class, 'show'])->name('instructor.detail');
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/about', [AboutController::class, 'index'])->name('about.index');
    Route::get('/faqs', [FaqController::class, 'index'])->name('faq.index');
    Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');

    // VNPAY IPN Webhook (Server-to-Server) - BẮT BUỘC ĐỂ NGOÀI AUTH VÌ VNPAY KHÔNG CÓ SESSION
    Route::get('/payment/{gateway}/ipn', [PaymentController::class, 'gatewayIpn'])->name('payment.ipn');

    // Cart routes (Requires Authentication)
    Route::middleware('auth')->group(function () {
        Route::post('/courses/{slug}/enroll-free', [CourseController::class, 'enrollFreeCourse'])->name('course.enroll-free');
        Route::post('/courses/{slug}/review', [ReviewController::class, 'submitReview'])->name('course.review');
        Route::put('/courses/reviews/{review}', [ReviewController::class, 'updateReview'])->name('course.review.update');
        Route::delete('/courses/reviews/{review}', [ReviewController::class, 'deleteReview'])->name('course.review.delete');
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/{course}', [CartController::class, 'add'])->name('cart.add');
        Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/checkout/process', [PaymentController::class, 'process'])->name('checkout.process');
        Route::post('/wallet/deposit', [PaymentController::class, 'deposit'])->name('wallet.deposit');
        Route::post('/payment/retry/{id}', [PaymentController::class, 'retry'])->name('payment.retry');
        Route::get('/payment/{gateway}/return', [PaymentController::class, 'gatewayReturn'])->name('payment.return');
        Route::post('/cart/apply-coupons', [CartController::class, 'applyCoupons'])->name('cart.apply-coupons');
        // Wishlist route
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

        // Course Learn route
        Route::get('/courses/{slug}/learn', [LearningController::class, 'learn'])->name('course.learn');
        Route::post('/courses/{slug}/learn/quiz/{quiz}', [LearningController::class, 'submitQuiz'])->name('course.learn.submit-quiz')->middleware('auth');
        Route::post('/courses/{slug}/learn/lesson/{lessonId}/progress', [LearningController::class, 'updateVideoProgress'])
            ->name('course.update_video_progress');

        // Course Comments
        Route::get('/courses/{slug}/learn/lesson/{lessonId}/comments', [CommentController::class, 'getComments'])->name('course.comments.get');
        Route::post('/courses/{slug}/learn/lesson/{lessonId}/comments', [CommentController::class, 'addComment'])->name('course.comments.add');
 });
});
