<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Kalnoy\Nestedset\Collection;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string|null $password
 * @property string|null $remember_token
 * @property string|null $google_id
 * @property string|null $google_token
 * @property string|null $google_refresh_token
 * @property string|null $avatar
 * @property string|null $phone
 * @property string|null $bio
 * @property array<array-key, mixed> $roles
 * @property UserRole $current_role
 * @property string|null $referral_code
 * @property int|null $referred_by
 * @property bool $is_active
 * @property string|null $last_login_at
 * @property string|null $last_login_ip
 * @property string|null $last_login_country
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Course> $authoredCourses
 * @property-read int|null $authored_courses_count
 * @property-read Collection<int, Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Conversation> $conversationsAsUserOne
 * @property-read int|null $conversations_as_user_one_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Conversation> $conversationsAsUserTwo
 * @property-read int|null $conversations_as_user_two_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, CouponUsage> $couponUsages
 * @property-read int|null $coupon_usages_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Coupon> $coupons
 * @property-read int|null $coupons_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, CourseProgress> $courseProgress
 * @property-read int|null $course_progress_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Course> $courses
 * @property-read int|null $courses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Course> $enrolledCourses
 * @property-read int|null $enrolled_courses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, CourseEnrollment> $enrollments
 * @property-read int|null $enrollments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Message> $messages
 * @property-read int|null $messages_count
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Order> $orders
 * @property-read int|null $orders_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, QuizResult> $quizResults
 * @property-read int|null $quiz_results_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $referees
 * @property-read int|null $referees_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $referredUsers
 * @property-read int|null $referred_users_count
 * @property-read User|null $referrer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, CourseEnrollment> $sellerEnrollments
 * @property-read int|null $seller_enrollments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, VideoNote> $videoNotes
 * @property-read int|null $video_notes_count
 * @property-read Wallet|null $wallet
 * @property-read \Illuminate\Database\Eloquent\Collection<int, WalletTransaction> $walletTransactions
 * @property-read int|null $wallet_transactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Wishlist> $wishlists
 * @property-read int|null $wishlists_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User active()
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User regularUsers()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User rootAdmins()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User sellers()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCurrentRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGoogleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGoogleRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGoogleToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastLoginAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastLoginCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastLoginIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereReferralCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereReferredBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRoles($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutTrashed()
 *
 * @mixin \Eloquent
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'roles',
        'current_role',
        'referral_code',
        'referred_by',
        'is_active',
        'bank_name',
        'bank_account_no',
        'bank_account_name',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'roles' => 'array',
        'current_role' => UserRole::class,
    ];

    // ===== RELATIONSHIPS =====
    /**
     * Danh sách khóa học do Người dùng này tạo ra (Nếu họ là Seller)
     */
    public function authoredCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'seller_id');
    }

    /**
     * Danh sách các bản ghi đăng ký học của người dùng này (Nếu họ là Học viên)
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class, 'student_id');
    }

    /**
     * Danh sách các khóa học mà Học viên này ĐÃ ĐĂNG KÝ học (Thông qua bảng trung gian CourseEnrollment)
     */
    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_enrollments', 'student_id', 'course_id')
            ->withPivot(['progress', 'is_banned', 'ban_reason', 'banned_at'])
            ->withTimestamps();
    }

    /**
     * Danh sách học viên đăng ký mua khóa học từ Seller này (Nếu họ là Seller)
     */
    public function sellerEnrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class, 'seller_id');
    }

    /**
     * Danh sách những người được User này giới thiệu
     */
    public function referees(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referredUsers(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function bankAccounts(): HasMany
    {
        return $this->hasMany(UserBankAccount::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_user')
            ->withPivot('progress', 'created_at')
            ->withTimestamps();
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function receivedReviews()
    {
        return $this->hasManyThrough(Review::class, Course::class, 'seller_id', 'course_id', 'id', 'id');
    }

    public function courseProgress(): HasMany
    {
        return $this->hasMany(CourseProgress::class);
    }

    public function videoNotes(): HasMany
    {
        return $this->hasMany(VideoNote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function quizResults(): HasMany
    {
        return $this->hasMany(QuizResult::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function conversationsAsUserOne(): HasMany
    {
        return $this->hasMany(Conversation::class, 'user_one_id');
    }

    public function conversationsAsUserTwo(): HasMany
    {
        return $this->hasMany(Conversation::class, 'user_two_id');
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class, 'seller_id');
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function couponUsages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    public function vipSubscriptions(): HasMany
    {
        return $this->hasMany(VipSubscription::class);
    }

    public function onlinePayments(): HasMany
    {
        return $this->hasMany(OnlinePayment::class);
    }

    public function isVipActive(): bool
    {
        return $this->vipSubscriptions()
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->exists();
    }

    public function isUserVip(): bool
    {
        return $this->vipSubscriptions()
            ->whereHas('vipPackage', fn ($q) => $q->where('role_type', 'user'))
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->exists();
    }

    public function isSellerVip(): bool
    {
        return $this->vipSubscriptions()
            ->whereHas('vipPackage', fn ($q) => $q->where('role_type', 'seller'))
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->exists();
    }

    public function getSellerStorageLimitBytes(): int
    {
        $activeSub = $this->vipSubscriptions()
            ->whereHas('vipPackage', fn ($q) => $q->where('role_type', 'seller')->where('package_type', 'storage'))
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->with('vipPackage')
            ->orderBy('expires_at', 'desc')
            ->first();

        // Trả về theo bytes. Nếu không có VIP thì mặc định là 5MB (để sếp test)
        if ($activeSub) {
            return $activeSub->vipPackage->max_storage_gb * 1024 * 1024 * 1024;
        }

        return 5 * 1024 * 1024; // 5MB default for testing
    }

    public function getSellerStorageUsedBytes(): int
    {
        return DB::table('videos')
            ->join('lessons', 'videos.lesson_id', '=', 'lessons.id')
            ->join('chapters', 'lessons.chapter_id', '=', 'chapters.id')
            ->join('courses', 'chapters.course_id', '=', 'courses.id')
            ->where('courses.seller_id', $this->id)
            ->whereNotNull('videos.r2_key')
            ->sum('videos.size_bytes');
    }

    // ===== SCOPES =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSellers($query)
    {
        return $query->where('current_role', UserRole::SELLER);
    }

    public function scopeRegularUsers($query)
    {
        return $query->where('current_role', UserRole::USER);
    }

    public function scopeRootAdmins($query)
    {
        return $query->where('current_role', UserRole::ROOT);
    }

    // ===== HELPERS =====

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            if (
                empty($model->referral_code)
                && $model->current_role === UserRole::SELLER
            ) {
                $model->referral_code = static::generateReferralCode();
            }

        });
    }

    public static function generateReferralCode(): string
    {
        do {

            $code = strtoupper(substr(md5(rand()), 0, 8));

        } while (
            static::where('referral_code', $code)->exists()
        );

        return $code;
    }

    public function redirectRoute(): string
    {
        return $this->current_role->redirectRoute();
    }

    public function isSeller(): bool
    {
        return $this->current_role->isSeller();
    }

    public function isAdmin(): bool
    {
        return $this->current_role->isAdmin();
    }
}
