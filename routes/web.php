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
use App\Http\Controllers\Frontend\Dashboard\WalletController;
use App\Http\Controllers\Frontend\Dashboard\OrderController;
use App\Http\Controllers\Frontend\Dashboard\ProfileController as DashboardProfileController;
use App\Http\Controllers\Frontend\LearningController;
use App\Http\Controllers\Frontend\PaymentController;
use App\Http\Controllers\Frontend\WishlistController;
use App\Http\Controllers\Seller\CouponController;
use App\Http\Controllers\Seller\Courses\ChapterController;
use App\Http\Controllers\Seller\Courses\CurriculumController;
use App\Http\Controllers\Seller\Courses\LessonController;
use App\Http\Controllers\Seller\Courses\LessonVideoController;
use App\Http\Controllers\Seller\Courses\QuizController;
use App\Http\Controllers\Seller\Courses\SellerCourseController;
use App\Http\Controllers\Seller\ProfileController;
use App\Http\Controllers\Seller\StudentController;
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

        Route::get('/wallet', [WalletController::class, 'index'])->name('wallet');
        Route::get('/bank-accounts', [WalletController::class, 'bankAccounts'])->name('bank-accounts');
        Route::post('/bank-accounts', [WalletController::class, 'addBankAccount'])->name('bank-accounts.store');
        Route::put('/bank-accounts/{bankAccountId}', [WalletController::class, 'updateBankAccount'])->name('bank-accounts.update');
        Route::delete('/bank-accounts/{bankAccountId}', [WalletController::class, 'deleteBankAccount'])->name('bank-accounts.destroy');
        Route::patch('/bank-accounts/{bankAccountId}/set-default', [WalletController::class, 'setDefaultBankAccount'])->name('bank-accounts.set-default');

        Route::get('/profile', [DashboardProfileController::class, 'index'])->name('profile');
        Route::put('/profile', [DashboardProfileController::class, 'updateProfile'])->name('profile.update');
        Route::put('/profile/password', [DashboardProfileController::class, 'changePassword'])->name('profile.password');
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
        Route::put('profile/info', [ProfileController::class, 'updateInfo'])->name('profile.updateInfo');
        Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.updatePassword');
        Route::put('profile/payment', [ProfileController::class, 'updatePayment'])->name('profile.updatePayment');

        Route::get('/dashboard', fn () => Inertia::render('Seller/Dashboard'))->name('dashboard');
        Route::get('revenues', function () {
            return Inertia::render('Seller/Revenues');
        })->name('revenues.index');
        Route::get('reviews', function () {
            return Inertia::render('Seller/Reviews');
        })->name('reviews.index');

    });

});
Route::prefix('tech-education')->name('frontend.')->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
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
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/{course}', [CartController::class, 'add'])->name('cart.add');
        Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/checkout/process', [PaymentController::class, 'process'])->name('checkout.process');
        Route::post('/wallet/deposit', [PaymentController::class, 'deposit'])->name('wallet.deposit');
        Route::post('/payment/retry/{id}', [PaymentController::class, 'retry'])->name('payment.retry');
        Route::get('/payment/{gateway}/return', [PaymentController::class, 'gatewayReturn'])->name('payment.return');
        Route::get('/cart/course/{course}/coupons', [CartController::class, 'getCouponForCourse'])
            ->name('cart.course.coupons');
        Route::post('/cart/apply-coupons', [CartController::class, 'applyCoupons'])->name('cart.apply-coupons');
        // Wishlist route
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

        // Course Learn route
        Route::get('/courses/{slug}/learn', [LearningController::class, 'learn'])->name('course.learn');
        Route::post('/courses/{slug}/learn/quiz/{quiz}', [LearningController::class, 'submitQuiz'])->name('course.learn.submit-quiz')->middleware('auth');
        Route::post('/courses/{slug}/learn/lesson/{lessonId}/progress', [LearningController::class, 'updateVideoProgress'])
            ->name('course.update_video_progress');
    });
});
