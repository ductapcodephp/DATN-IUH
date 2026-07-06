<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * @property int $id
 * @property string $name VIP package name
 * @property numeric $price
 * @property int $duration_days Number of days VIP access
 * @property string|null $description
 * @property bool $is_active
 * @property string|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage ordered()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereDurationDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VipPackage whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class VipPackage extends Model
{
    use HasFactory;

    protected $table = 'vip_packages';

    protected $fillable = [
        'name',
        'price',
        'duration_days',
        'description',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // ===== SCOPES =====

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('price');
    }

    // ===== HELPERS =====

    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function getPriceFormatted(): string
    {
        return number_format($this->price, 0, '.', ',') . ' VND';
    }

    public function getDurationFormatted(): string
    {
        if ($this->duration_days >= 365) {
            $years = floor($this->duration_days / 365);
            return "{$years} năm";
        } elseif ($this->duration_days >= 30) {
            $months = floor($this->duration_days / 30);
            return "{$months} tháng";
        }
        return "{$this->duration_days} ngày";
    }
}
