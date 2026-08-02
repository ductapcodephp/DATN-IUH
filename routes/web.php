<?php

use App\Http\Controllers\Frontend\Dashboard\UserVipController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VipPackageController as AdminVipPackageController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\WalletBonusController;
use App\Http\Controllers\Admin\WithdrawalController;
use App\Http\Controllers\Admin\ReportController;

use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\AdminSellerController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Frontend\BlogController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\CourseController;
use App\Http\Controllers\Frontend\InstructorController;
use App\Http\Controllers\Frontend\PageController;
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
use App\Http\Controllers\Seller\NotificationController as SellerNotificationController;
use App\Http\Controllers\Shared\NotificationController;
use App\Http\Controllers\Seller\RevenueController;
use App\Http\Controllers\Seller\VipPackageController;
use App\Http\Controllers\Frontend\CommentController;
use App\Http\Controllers\Seller\SellerProfileController;
use App\Http\Controllers\CMS\CategoryController as CMSCategoryController;
use App\Http\Controllers\CMS\PageController as CMSPageController;
use App\Http\Controllers\CMS\ArticleController as CMSArticleController;
use App\Http\Controllers\CMS\MenuController as CMSMenuController;
use App\Http\Controllers\CMS\TopicController as CMSTopicController;
use App\Http\Controllers\CMS\BlockController as CMSBlockController;
use App\Http\Controllers\CMS\MediaController as CMSMediaController;
use App\Http\Controllers\CMS\GalleryController as CMSGalleryController;
use App\Http\Controllers\CMS\FaqController as CMSFaqController;
use App\Http\Controllers\Frontend\AdTrackingController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Seller\AdController as SellerAdController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('', function () {
    return redirect('/tech-education/trang-chu.html');
});
Route::get('/', function () {
    return redirect('/tech-education/trang-chu.html');
});
Route::get('/home', function () {
    return redirect('/tech-education/trang-chu.html');
});
// ROUTES CHO KHÁCH (CHƯA ĐĂNG NHẬP)



Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:3,60');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Google Auth Routes
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// ROUTES YÊU CẦU ĐĂNG NHẬP (AUTH)
Route::get('/seller/settings-test', fn () => Inertia::render('Seller/Settings'))->name('seller.settings.test');

Route::middleware('auth')->group(function () {

    // Các route cơ bản
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', function () {
        return redirect()->route(auth()->user()->current_role->redirectRoute());
    })->name('dashboard');
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
        Route::get('/vip-packages', [UserVipController::class, 'index'])->name('vip.index');
        Route::post('/vip-packages/buy', [UserVipController::class, 'buy'])->name('vip.buy');
    });

    // Seller Application
    Route::prefix('apply-seller')->name('apply-seller.')->group(function () {
        Route::get('/', [SellerProfileController::class, 'showApplyForm'])->name('show');
        Route::post('/', [SellerProfileController::class, 'apply'])->name('submit')->middleware('throttle:3,1');
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
        Route::post('/wallet/withdraw', [WalletController::class, 'withdraw'])->name('wallet.withdraw')->middleware('throttle:2,10');
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
        Route::post('categories/request', [SellerCourseController::class, 'requestCategory'])->name('categories.request');

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
        Route::get('notifications', [SellerNotificationController::class, 'index'])->name('notifications.index');
        Route::get('profile/settings', [ProfileController::class, 'notifications'])->name('profile.notifications'); // Trang setting email notification
        Route::put('profile/info', [ProfileController::class, 'updateInfo'])->name('profile.updateInfo');
        Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.updatePassword');
        Route::put('profile/payment', [ProfileController::class, 'updatePayment'])->name('profile.updatePayment');

        Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
        Route::get('revenues', [RevenueController::class, 'index'])->name('revenues.index');
        Route::post('revenues/withdraw', [RevenueController::class, 'withdraw'])->name('revenues.withdraw')->middleware('throttle:2,10');
        Route::get('courses/{course}/reviews', [ReviewController::class, 'index'])->name('courses.reviews.index');
        Route::patch('reviews/{review}/report', [ReviewController::class, 'report'])->name('reviews.report');
        Route::post('reviews/{review}/reply', [ReviewController::class, 'reply'])->name('reviews.reply');

        // ADS
        Route::get('ads', [SellerAdController::class, 'index'])->name('ads.index');
        Route::post('ads', [SellerAdController::class, 'store'])->name('ads.store');
        Route::post('ads/top-up', [SellerAdController::class, 'topUp'])->name('ads.top-up');
        Route::patch('ads/toggle-status', [SellerAdController::class, 'toggleStatus'])->name('ads.toggle-status');

        // VIP Packages
        Route::get('vip-packages', [VipPackageController::class, 'index'])->name('vip.index');
        Route::post('vip-packages/buy', [VipPackageController::class, 'buy'])->name('vip.buy');
        Route::get('vip-packages/vnpay-return', [VipPackageController::class, 'vnpayReturn'])->name('vip.vnpay.return');

    });

});
Route::prefix('tech-education')->name('frontend.')->group(function () {
    Route::get('/home', function () {
        return redirect('/tech-education/trang-chu.html');
    })->name('home');
    Route::get('/s/search-suggestions', [CourseController::class, 'searchSuggestions'])->name('course.search-suggestions')->middleware('throttle:60,1');
    Route::get('/courses', function (Illuminate\Http\Request $request) {
        $queryString = $request->getQueryString();
        return redirect('/tech-education/danh-sach-khoa-hoc.html' . ($queryString ? '?' . $queryString : ''));
    })->name('course.index');
    Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('course.detail');
    Route::get('/instructors', function (Illuminate\Http\Request $request) {
        $queryString = $request->getQueryString();
        return redirect('/tech-education/danh-sach-giang-vien.html' . ($queryString ? '?' . $queryString : ''));
    })->name('instructor.index');
    Route::get('/instructors/{id}', [InstructorController::class, 'show'])->name('instructor.detail');
    Route::get('/blog', function () {
        return redirect('/tech-education/blog.html');
    })->name('blog.index');
    Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.detail');
    Route::get('/about', function () {
        return redirect('/tech-education/ve-chung-toi.html');
    })->name('about.index');
    Route::get('/faqs', function () {
        return redirect('/tech-education/faq.html');
    })->name('faq.index');
    Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store')->middleware('throttle:3,10');

    Route::get('/{slug}.html', [PageController::class, 'show'])->name('page.show')->where('slug', '[a-zA-Z0-9\-]+');

    // Ads Tracking
    Route::get('/ads/click/{id}', [AdTrackingController::class, 'trackClick'])->name('ads.click');

    Route::get('/payment/{gateway}/ipn', [PaymentController::class, 'gatewayIpn'])->name('payment.ipn');

    Route::middleware('auth')->group(function () {
        Route::post('/courses/{slug}/enroll-free', [CourseController::class, 'enrollFreeCourse'])->name('course.enroll-free');
        Route::post('/courses/{slug}/review', [ReviewController::class, 'submitReview'])->name('course.review')->middleware('throttle:15,1');
        Route::put('/courses/reviews/{review}', [ReviewController::class, 'updateReview'])->name('course.review.update');
        Route::delete('/courses/reviews/{review}', [ReviewController::class, 'deleteReview'])->name('course.review.delete');
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/{course}', [CartController::class, 'add'])->name('cart.add');
        Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/checkout/process', [PaymentController::class, 'process'])->name('checkout.process')->middleware('throttle:5,1');
        Route::get('/checkout/success', [PaymentController::class, 'success'])->name('checkout.success');
        Route::post('/wallet/deposit', [PaymentController::class, 'deposit'])->name('wallet.deposit');
        Route::post('/payment/retry/{id}', [PaymentController::class, 'retry'])->name('payment.retry');
        Route::get('/payment/{gateway}/return', [PaymentController::class, 'gatewayReturn'])->name('payment.return');
        Route::post('/cart/apply-coupons', [CartController::class, 'applyCoupons'])->name('cart.apply-coupons')->middleware('throttle:5,1');
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
        Route::post('/courses/{slug}/learn/lesson/{lessonId}/comments', [CommentController::class, 'addComment'])->name('course.comments.add')->middleware('throttle:15,1');
 });
});
// Admin routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin,root'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/chart-data', [DashboardController::class, 'getChartData'])->name('dashboard.chart-data');
    Route::patch('categories/{category}/approve', [AdminCategoryController::class, 'approve'])->name('categories.approve');
    Route::delete('categories/{category}/reject', [AdminCategoryController::class, 'reject'])->name('categories.reject');
    Route::resource('categories', AdminCategoryController::class)->except(['create', 'show', 'edit']);
    
    // Seller Approval
    Route::prefix('sellers')->name('sellers.')->group(function () {
        Route::get('/pending', [AdminSellerController::class, 'indexPending'])->name('pending');
        Route::post('/{id}/approve', [AdminSellerController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [AdminSellerController::class, 'reject'])->name('reject');
    });

    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{id}/chart-data', [UserController::class, 'getChartData'])->name('users.chart-data');
    Route::post('/users/{id}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::get('/vip-packages', [AdminVipPackageController::class, 'index'])->name('vip-packages');
    Route::post('/vip-packages', [AdminVipPackageController::class, 'store'])->name('vip-packages.store');
    Route::put('/vip-packages/{id}', [AdminVipPackageController::class, 'update'])->name('vip-packages.update');
    Route::delete('/vip-packages/{id}', [AdminVipPackageController::class, 'destroy'])->name('vip-packages.destroy');
    Route::post('/vip-packages/{id}/toggle-status', [AdminVipPackageController::class, 'toggleStatus'])->name('vip-packages.toggle-status');
    Route::get('/settings', [SettingController::class, 'index'])->name('settings');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    
    // Wallet Bonuses
    Route::prefix('wallet-bonuses')->name('wallet-bonuses.')->group(function () {
        Route::get('/', [WalletBonusController::class, 'index'])->name('index');
        Route::post('/', [WalletBonusController::class, 'store'])->name('store');
        Route::put('/{id}', [WalletBonusController::class, 'update'])->name('update');
        Route::delete('/{id}', [WalletBonusController::class, 'destroy'])->name('destroy');
        Route::post('/{id}/toggle-status', [WalletBonusController::class, 'toggleActive'])->name('toggle-status');
    });
    Route::get('/withdrawals', [WithdrawalController::class, 'index'])->name('withdrawals');
    Route::post('/withdrawals/{id}/approve', [WithdrawalController::class, 'approve'])->name('withdrawals.approve');
    Route::post('/withdrawals/{id}/reject', [WithdrawalController::class, 'reject'])->name('withdrawals.reject');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    Route::get('/reports/{id}', [ReportController::class, 'show'])->name('reports.show');
    Route::post('/reports/{id}/resolve', [ReportController::class, 'resolve'])->name('reports.resolve');
    Route::post('/reports/{id}/dismiss', [ReportController::class, 'dismiss'])->name('reports.dismiss');
    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts');
    Route::get('/notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
});

// CMS Routes
Route::prefix('cms')->name('cms.')->middleware(['auth', 'current_role:admin,root,cms'])->group(function () {
    Route::resource('categories', CMSCategoryController::class)->except(['create', 'show', 'edit']);
    // --- Pages ---
    Route::resource('page', CMSPageController::class);
    
    // --- Settings ---
    Route::get('settings', [\App\Http\Controllers\CMS\CoreSettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [\App\Http\Controllers\CMS\CoreSettingController::class, 'update'])->name('settings.update');

    // --- Articles ---
    Route::put('article/{article}/status', [CMSArticleController::class, 'updateStatus'])->name('article.status');
    Route::resource('article', CMSArticleController::class);
    
    // --- Menus ---
    Route::get('menu', [CMSMenuController::class, 'index'])->name('menu.index');
    Route::post('menu', [CMSMenuController::class, 'store'])->name('menu.store');
    Route::put('menu/{id}', [CMSMenuController::class, 'update'])->name('menu.update');
    Route::delete('menu/{id}', [CMSMenuController::class, 'destroy'])->name('menu.destroy');
    Route::post('menu/reorder', [CMSMenuController::class, 'reorder'])->name('menu.reorder');
    
    // --- Topics ---
    Route::get('/topics', [CMSTopicController::class, 'index'])->name('topics.index');
    Route::post('/topics', [CMSTopicController::class, 'store'])->name('topics.store');
    Route::put('/topics/{id}', [CMSTopicController::class, 'update'])->name('topics.update');
    Route::delete('/topics/{id}', [CMSTopicController::class, 'destroy'])->name('topics.destroy');
    
    // --- Blocks ---
    Route::get('page/{page}/blocks', [CMSBlockController::class, 'index'])->name('block.index');
    Route::post('page/{page}/blocks', [CMSBlockController::class, 'store'])->name('block.store');
    Route::get('blocks/{block}/edit', [CMSBlockController::class, 'edit'])->name('block.edit');
    Route::put('blocks/{block}', [CMSBlockController::class, 'update'])->name('block.update');
    Route::put('blocks/{block}/dto', [CMSBlockController::class, 'updateWithDTO'])->name('block.updateDTO');
    Route::delete('blocks/{block}', [CMSBlockController::class, 'destroy'])->name('block.destroy');

    // Block AJAX endpoints
    Route::post('blocks/reorder', [CMSBlockController::class, 'reorder'])->name('block.reorder');
    Route::post('blocks/{block}/property', [CMSBlockController::class, 'updateProperty'])->name('block.updateProperty');
    Route::post('blocks/{block}/add-item', [CMSBlockController::class, 'addItem'])->name('block.addItem');
    Route::post('blocks/{block}/remove-item', [CMSBlockController::class, 'removeItem'])->name('block.removeItem');

    // --- Media Library ---
    Route::get('media', [CMSMediaController::class, 'index'])->name('media.index');
    Route::post('media/upload', [CMSMediaController::class, 'upload'])->name('media.upload');
    Route::get('media/ajax', [CMSMediaController::class, 'ajaxList'])->name('media.ajax');
    Route::get('media/galleries/ajax', [CMSMediaController::class, 'ajaxGalleries'])->name('media.galleries.ajax');
    Route::delete('media/{id}', [CMSMediaController::class, 'destroy'])->name('media.destroy');

    // --- Gallery ---
    Route::resource('gallery', CMSGalleryController::class)->names('gallery');
    Route::post('gallery/{id}/pictures', [CMSGalleryController::class, 'addPictures'])->name('gallery.addPictures');
    Route::delete('gallery/{galleryId}/picture/{pictureId}', [CMSGalleryController::class, 'removePicture'])->name('gallery.removePicture');
    
    // FAQs
    Route::get('/faqs', [CMSFaqController::class, 'index'])->name('faqs');
    Route::get('/faqs/categories/{id}', [CMSFaqController::class, 'showCategory'])->name('faqs.categories.show');
    Route::post('/faqs', [CMSFaqController::class, 'store'])->name('faqs.store');
    Route::put('/faqs/{faq}', [CMSFaqController::class, 'update'])->name('faqs.update');
    Route::delete('/faqs/{faq}', [CMSFaqController::class, 'destroy'])->name('faqs.destroy');
    Route::post('/faqs/{faq}/toggle-status', [CMSFaqController::class, 'toggleStatus'])->name('faqs.toggle-status');
    
    Route::post('/faqs/categories', [CMSFaqController::class, 'storeCategory'])->name('faqs.categories.store');
    Route::put('/faqs/categories/{category}', [CMSFaqController::class, 'updateCategory'])->name('faqs.categories.update');
    Route::delete('/faqs/categories/{category}', [CMSFaqController::class, 'destroyCategory'])->name('faqs.categories.destroy');
});

