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
            Route::post('lessons/{lesson}/video/upload', [LessonVideoController::class, 'upload'])->name('lessons.upload');
            Route::get('lessons/{lesson}/video/check-chunk', [LessonVideoController::class, 'checkChunks'])->name('lessons.upload.check');
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

    // Cart routes (Requires Authentication)
    Route::middleware('auth')->group(function () {
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/{course}', [CartController::class, 'add'])->name('cart.add');
        Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/checkout/process', [\App\Http\Controllers\Frontend\PaymentController::class, 'process'])->name('checkout.process');
        Route::get('/payment/{gateway}/return', [\App\Http\Controllers\Frontend\PaymentController::class, 'gatewayReturn'])->name('payment.return');
        Route::get('/cart/course/{course}/coupons', [CartController::class, 'getCouponForCourse'])
            ->name('cart.course.coupons');
        Route::post('/cart/apply-coupons', [CartController::class, 'applyCoupons'])->name('cart.apply-coupons');
        // Wishlist route
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    });
});
