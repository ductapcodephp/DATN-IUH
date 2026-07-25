import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/Frontend/DashboardLayout';

function AvatarUpload({ currentAvatar, onAvatarChange }) {
    const [preview, setPreview] = useState(currentAvatar || '/assets/frontend/img/default-avatar.jpg');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
        onAvatarChange(file);
    };

    return (
        <div className="d-flex align-items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative' }}>
                <img
                    src={preview}
                    alt="Avatar"
                    className="rounded-circle object-fit-cover border border-3"
                    style={{ width: '90px', height: '90px', borderColor: '#EA580C' }}
                    onError={(e) => { e.target.src = '/assets/frontend/img/default-avatar.jpg'; }}
                />
                <label
                    htmlFor="avatarInput"
                    style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: '#EA580C', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(234,88,12,0.4)',
                        border: '2px solid #fff',
                    }}
                >
                    <i className="fa-solid fa-camera" style={{ fontSize: '0.7rem' }}></i>
                </label>
                <input type="file" id="avatarInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <div>
                <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem' }}>Ảnh đại diện</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '4px' }}>JPG, PNG tối đa 2MB</div>
                <label
                    htmlFor="avatarInput"
                    className="btn btn-sm fw-semibold mt-2"
                    style={{ borderRadius: '8px', background: '#fff7ed', color: '#EA580C', border: '1px solid #fed7aa', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    <i className="fa-solid fa-upload me-1"></i>Thay ảnh
                </label>
            </div>
        </div>
    );
}

function TabButton({ label, icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className="d-flex align-items-center gap-2 fw-semibold"
            style={{
                background: active ? '#fff7ed' : 'transparent',
                color: active ? '#EA580C' : '#6B7280',
                border: active ? '1px solid #fed7aa' : '1px solid transparent',
                borderRadius: '10px', padding: '8px 16px',
                fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease',
            }}
        >
            <i className={icon}></i>{label}
        </button>
    );
}

export default function Profile({ profile }) {
    const [activeTab, setActiveTab] = useState('info');

    // Profile Form
    const infoForm = useForm({
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        bio: profile?.bio ?? '',
    });

    // Password Form
    const pwForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        infoForm.transform((data) => ({
            ...data,
            _method: 'put',
        }));
        infoForm.post(route('dashboard.profile.update'));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        pwForm.put(route('dashboard.profile.password'), {
            onSuccess: () => pwForm.reset(),
        });
    };

    return (
        <DashboardLayout title="Hồ sơ cá nhân" activeKey="profile">

            {/* Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                    <i className="fa-solid fa-user-pen me-2" style={{ color: '#EA580C' }}></i>
                    Hồ sơ cá nhân
                </h4>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                    Quản lý thông tin tài khoản và bảo mật
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="d-flex gap-2 mb-4">
                <TabButton
                    label="Thông tin cá nhân"
                    icon="fa-solid fa-user me-1"
                    active={activeTab === 'info'}
                    onClick={() => setActiveTab('info')}
                />
                <TabButton
                    label="Đổi mật khẩu"
                    icon="fa-solid fa-lock me-1"
                    active={activeTab === 'password'}
                    onClick={() => setActiveTab('password')}
                />
            </div>

            {/* Info Tab */}
            {activeTab === 'info' && (
                <div className="db-profile-box">
                    <AvatarUpload
                        currentAvatar={profile?.avatar ? (profile.avatar.startsWith('http') || profile.avatar.startsWith('/') ? profile.avatar : `/storage/${profile.avatar}`) : null}
                        onAvatarChange={(file) => infoForm.setData('avatar', file)}
                    />

                    <form onSubmit={handleInfoSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${infoForm.errors.name ? 'is-invalid' : ''}`}
                                    value={infoForm.data.name}
                                    onChange={(e) => infoForm.setData('name', e.target.value)}
                                    style={{ borderRadius: '10px' }}
                                />
                                {infoForm.errors.name && <div className="invalid-feedback">{infoForm.errors.name}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={infoForm.data.phone}
                                    onChange={(e) => infoForm.setData('phone', e.target.value)}
                                    style={{ borderRadius: '10px' }}
                                    placeholder="0901234567"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                    Địa chỉ Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={profile?.email ?? ''}
                                    readOnly
                                    style={{ borderRadius: '10px', background: '#f8fafc', color: '#9CA3AF' }}
                                />
                                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '4px' }}>
                                    <i className="fa-solid fa-lock me-1"></i>Email không thể thay đổi
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                    Giới thiệu bản thân
                                </label>
                                <textarea
                                    className="form-control"
                                    value={infoForm.data.bio}
                                    onChange={(e) => infoForm.setData('bio', e.target.value)}
                                    rows={4}
                                    style={{ borderRadius: '10px', resize: 'vertical' }}
                                    placeholder="Chia sẻ một chút về bản thân bạn..."
                                    maxLength={1000}
                                />
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'right' }}>
                                    {infoForm.data.bio?.length ?? 0}/1000
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="p-3 mb-4" style={{ background: '#f8fafc', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', marginBottom: '8px' }}>
                                <i className="fa-solid fa-circle-info me-2" style={{ color: '#6B7280' }}></i>
                                Thông tin tài khoản
                            </div>
                            <div className="row g-2">
                                <div className="col-sm-6">
                                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Ngày tham gia</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937' }}>
                                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn fw-semibold text-white px-4"
                            disabled={infoForm.processing}
                            style={{ background: 'linear-gradient(135deg,#EA580C,#C2410C)', borderRadius: '10px', border: 'none' }}
                        >
                            {infoForm.processing
                                ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Đang lưu...</>
                                : <><i className="fa-solid fa-floppy-disk me-2"></i>Lưu thay đổi</>
                            }
                        </button>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="db-profile-box" style={{ maxWidth: '540px' }}>
                    <div className="mb-4">
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: '#fff7ed', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', marginBottom: '16px',
                        }}>
                            <i className="fa-solid fa-lock" style={{ fontSize: '1.3rem', color: '#EA580C' }}></i>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Đổi mật khẩu</h6>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                            Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh (ít nhất 8 ký tự)
                        </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                Mật khẩu hiện tại <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="password"
                                className={`form-control ${pwForm.errors.current_password ? 'is-invalid' : ''}`}
                                value={pwForm.data.current_password}
                                onChange={(e) => pwForm.setData('current_password', e.target.value)}
                                style={{ borderRadius: '10px' }}
                                required
                            />
                            {pwForm.errors.current_password && <div className="invalid-feedback">{pwForm.errors.current_password}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                Mật khẩu mới <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="password"
                                className={`form-control ${pwForm.errors.new_password ? 'is-invalid' : ''}`}
                                value={pwForm.data.new_password}
                                onChange={(e) => pwForm.setData('new_password', e.target.value)}
                                style={{ borderRadius: '10px' }}
                                placeholder="Tối thiểu 8 ký tự"
                                required
                                minLength={8}
                            />
                            {pwForm.errors.new_password && <div className="invalid-feedback">{pwForm.errors.new_password}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                Xác nhận mật khẩu mới <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                value={pwForm.data.new_password_confirmation}
                                onChange={(e) => pwForm.setData('new_password_confirmation', e.target.value)}
                                style={{ borderRadius: '10px' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn fw-semibold text-white px-4"
                            disabled={pwForm.processing}
                            style={{ background: 'linear-gradient(135deg,#EA580C,#C2410C)', borderRadius: '10px', border: 'none' }}
                        >
                            {pwForm.processing
                                ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Đang lưu...</>
                                : <><i className="fa-solid fa-lock me-2"></i>Đổi mật khẩu</>
                            }
                        </button>
                    </form>
                </div>
            )}
        </DashboardLayout>
    );
}
