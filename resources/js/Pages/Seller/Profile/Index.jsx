import React, { useState } from 'react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ProfileIndex({ user }) {
    const [activeTab, setActiveTab] = useState('info');

    const infoForm = useForm({
        name: user.name || '',
        phone: user.phone || '',
        avatar: null,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const paymentForm = useForm({
        bank_name: user.bank_name || '',
        bank_account_no: user.bank_account_no || '',
        bank_account_name: user.bank_account_name || '',
    });

    const submitInfo = (e) => {
        e.preventDefault();
        infoForm.post(route('seller.profile.updateInfo'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                alert('Cập nhật thông tin thành công!');
            }
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('seller.profile.updatePassword'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                alert('Cập nhật mật khẩu thành công!');
            }
        });
    };

    const submitPayment = (e) => {
        e.preventDefault();
        paymentForm.put(route('seller.profile.updatePayment'), {
            preserveScroll: true,
            onSuccess: () => {
                alert('Cập nhật thông tin thanh toán thành công!');
            }
        });
    };

    return (
        <SellerLayout>
            <Head title="Quản lý Profile" />

            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <h2>Quản lý Profile chi tiết</h2>
                    </div>

                    <div className="profile-tabs">
                        <button 
                            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Thông tin cá nhân
                        </button>
                        <button 
                            className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            Đổi mật khẩu
                        </button>
                        <button 
                            className={`profile-tab ${activeTab === 'payment' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment')}
                        >
                            Cấu hình thanh toán
                        </button>
                    </div>

                    {activeTab === 'info' && (
                        <form onSubmit={submitInfo}>
                            <div className="profile-avatar-wrap">
                                <img 
                                    src={user.avatar ? `/storage/${user.avatar}` : '/assets/frontend/img/avatar.png'} 
                                    alt="Avatar" 
                                    className="profile-avatar-preview" 
                                />
                                <div className="profile-avatar-upload">
                                    <label>Đổi ảnh đại diện</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => infoForm.setData('avatar', e.target.files[0])}
                                    />
                                    {infoForm.errors.avatar && <div className="text-red-500 text-sm">{infoForm.errors.avatar}</div>}
                                </div>
                            </div>

                            <div className="profile-form-group">
                                <label>Họ và tên</label>
                                <input 
                                    type="text" 
                                    className="profile-form-control" 
                                    value={infoForm.data.name}
                                    onChange={e => infoForm.setData('name', e.target.value)}
                                />
                                {infoForm.errors.name && <div className="text-red-500 text-sm">{infoForm.errors.name}</div>}
                            </div>

                            <div className="profile-form-group">
                                <label>Số điện thoại</label>
                                <input 
                                    type="text" 
                                    className="profile-form-control" 
                                    value={infoForm.data.phone}
                                    onChange={e => infoForm.setData('phone', e.target.value)}
                                />
                                {infoForm.errors.phone && <div className="text-red-500 text-sm">{infoForm.errors.phone}</div>}
                            </div>

                            <button type="submit" className="profile-btn-primary" disabled={infoForm.processing}>
                                {infoForm.processing ? 'Đang lưu...' : 'Lưu thông tin'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={submitPassword}>
                            <div className="profile-form-group">
                                <label>Mật khẩu hiện tại</label>
                                <input 
                                    type="password" 
                                    className="profile-form-control" 
                                    value={passwordForm.data.current_password}
                                    onChange={e => passwordForm.setData('current_password', e.target.value)}
                                />
                                {passwordForm.errors.current_password && <div className="text-red-500 text-sm">{passwordForm.errors.current_password}</div>}
                            </div>

                            <div className="profile-form-group">
                                <label>Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    className="profile-form-control" 
                                    value={passwordForm.data.password}
                                    onChange={e => passwordForm.setData('password', e.target.value)}
                                />
                                {passwordForm.errors.password && <div className="text-red-500 text-sm">{passwordForm.errors.password}</div>}
                            </div>

                            <div className="profile-form-group">
                                <label>Xác nhận mật khẩu</label>
                                <input 
                                    type="password" 
                                    className="profile-form-control" 
                                    value={passwordForm.data.password_confirmation}
                                    onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <button type="submit" className="profile-btn-primary" disabled={passwordForm.processing}>
                                {passwordForm.processing ? 'Đang lưu...' : 'Lưu mật khẩu'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'payment' && (
                        <form onSubmit={submitPayment}>
                            <div className="profile-form-group">
                                <label>Tên ngân hàng</label>
                                <input 
                                    type="text" 
                                    className="profile-form-control" 
                                    placeholder="VD: Vietcombank, MB Bank..."
                                    value={paymentForm.data.bank_name}
                                    onChange={e => paymentForm.setData('bank_name', e.target.value)}
                                />
                                {paymentForm.errors.bank_name && <div className="text-red-500 text-sm">{paymentForm.errors.bank_name}</div>}
                            </div>

                            <div className="profile-form-group">
                                <label>Số tài khoản</label>
                                <input 
                                    type="text" 
                                    className="profile-form-control" 
                                    value={paymentForm.data.bank_account_no}
                                    onChange={e => paymentForm.setData('bank_account_no', e.target.value)}
                                />
                                {paymentForm.errors.bank_account_no && <div className="text-red-500 text-sm">{paymentForm.errors.bank_account_no}</div>}
                            </div>

                            <div className="profile-form-group">
                                <label>Chủ tài khoản</label>
                                <input 
                                    type="text" 
                                    className="profile-form-control" 
                                    value={paymentForm.data.bank_account_name}
                                    onChange={e => paymentForm.setData('bank_account_name', e.target.value)}
                                />
                                {paymentForm.errors.bank_account_name && <div className="text-red-500 text-sm">{paymentForm.errors.bank_account_name}</div>}
                            </div>

                            <button type="submit" className="profile-btn-primary" disabled={paymentForm.processing}>
                                {paymentForm.processing ? 'Đang lưu...' : 'Lưu thanh toán'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
