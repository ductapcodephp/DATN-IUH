<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $avatar
 * @property string|null $phone
 * @property UserRole $role
 * @property string|null $current_role
 * @property string|null $referral_code
 * @property int|null $referred_by
 * @property bool $is_active
 * @property User|null $referrer
 * @property Wallet $wallet
 * @property Collection $referredUsers
 * @property Collection $courses
 * @property Collection $orders
 * @property Collection $reviews
 * @property Collection $courseProgress
 * @property Collection $messages
 * @property Collection $comments
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

    public function blocks()
    {
        return $this->hasMany(SellerStudentBlock::class, 'student_id');
    }
    public function blockedBySellers(): HasMany
{
    return $this->hasMany(SellerStudentBlock::class, 'student_id');
}
}
