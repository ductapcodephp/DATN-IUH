<?php
// === FILE: app/Models/VipPackage.php ===

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property float $price
 * @property int $duration_days
 * @property string|null $description
 * @property bool $is_active
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
