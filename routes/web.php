<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Seller\CouponController;
use App\Http\Controllers\Seller\Courses\ChapterController;
use App\Http\Controllers\Seller\Courses\CurriculumController;
use App\Http\Controllers\Seller\Courses\LessonController;
use App\Http\Controllers\Seller\Courses\LessonVideoController;
use App\Http\Controllers\Seller\Courses\QuizController;
use App\Http\Controllers\Seller\Courses\SellerCourseController;
use App\Http\Controllers\Frontend\IndexController;
use App\Http\Controllers\Seller\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});


Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/profile', fn () => 'Profile edit page placeholder')->name('profile.edit');

    // --- SELLER ROUTES (Bọc trong prefix 'seller' và name 'seller.') ---
    Route::prefix('seller')->name('seller.')->group(function () {


        // 3. QUẢN LÝ KHÓA HỌC CHUNG (COURSES)
        Route::resource('courses', SellerCourseController::class)->except(['show']);

        // 4. QUẢN LÝ GIÁO TRÌNH (CURRICULUM)
        Route::prefix('courses/{course}/curriculum')->name('courses.curriculum.')->group(function () {

            // Xem danh sách giáo trình (Index)
            Route::get('/', [CurriculumController::class, 'index'])->name('index');

            // --- CHAPTERS (CHƯƠNG MỤC) ---
            Route::post('chapters', [ChapterController::class, 'store'])->name('chapters.store');
            Route::post('chapters/reorder', [ChapterController::class, 'reorder'])->name('chapters.reorder');
            Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
            Route::delete('chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');

            // --- LESSONS (BÀI HỌC) ---
            Route::post('chapters/{chapter}/lessons', [LessonController::class, 'store'])->name('chapters.lessons.store');

            // Chi tiết, Cập nhật, Xóa và Sắp xếp bài học
            Route::get('lessons/{lesson}', [LessonController::class, 'show'])->name('lessons.show');
            Route::put('lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
            Route::delete('lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');
            Route::post('lessons/reorder', [LessonController::class, 'reorder'])->name('lessons.reorder');

            Route::post('lessons/{lesson}/video/upload', [LessonVideoController::class, 'upload'])->name('lessons.video.upload');
            Route::get('lessons/{lesson}/video/check-chunk', [LessonVideoController::class, 'checkChunks'])->name('lessons.video.check-chunk');
            Route::post('quiz/{lesson}/questions', [QuizController::class, 'storeQuestion'])->name('quiz.store-question');
            Route::post('quiz/{lesson}/reorder', [QuizController::class, 'reorderQuizzes'])->name('quiz.reorder');
            Route::put('quiz/questions/{questionId}', [QuizController::class, 'updateQuestion'])->name('quiz.update-question');
            Route::delete('quiz/questions/{questionId}', [QuizController::class, 'destroyQuestion'])->name('quiz.delete-question');
        });

    });

});
