<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WalletBonus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletBonusController extends Controller
{
    public function index(Request $request)
    {
        $walletBonuses = WalletBonus::latest()->paginate(10);
        return Inertia::render('Admin/WalletBonuses/Index', [
            'walletBonuses' => $walletBonuses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'min_amount' => 'required|numeric|min:0',
            'bonus_percentage' => 'required|numeric|min:0|max:100',
            'max_bonus_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        WalletBonus::create($validated);

        return back()->with('success', 'Thêm phần thưởng ví thành công');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'min_amount' => 'required|numeric|min:0',
            'bonus_percentage' => 'required|numeric|min:0|max:100',
            'max_bonus_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $walletBonus = WalletBonus::findOrFail($id);
        $walletBonus->update($validated);

        return back()->with('success', 'Cập nhật phần thưởng ví thành công');
    }

    public function toggleActive($id)
    {
        $walletBonus = WalletBonus::findOrFail($id);
        $walletBonus->is_active = !$walletBonus->is_active;
        $walletBonus->save();

        return back()->with('success', 'Thay đổi trạng thái thành công');
    }

    public function destroy($id)
    {
        $walletBonus = WalletBonus::findOrFail($id);
        $walletBonus->delete();

        return back()->with('success', 'Xóa phần thưởng ví thành công');
    }
}
