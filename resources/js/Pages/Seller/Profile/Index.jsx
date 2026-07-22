import React, { useState } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';
import '@/Pages/Seller/Settings/master.css';

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

function FloatingInput({ type = 'text', label, value, onChange, placeholder = ' ', disabled = false, required = false, minLength, error }) {
    return (
        <div className="floating-label-group mb-3">
            {type === 'textarea' ? (
                <textarea 
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    rows="4"
                    maxLength={1000}
                ></textarea>
            ) : (
                <input 
                    type={type} 
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange} 
                    disabled={disabled}
                    required={required}
                    minLength={minLength}
                />
            )}
            <label>{label}</label>
            {error && <div className="invalid-feedback d-block text-start">{error}</div>}
        </div>
    );
}

function TabButton({ label, icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`d-flex align-items-center gap-2 fw-semibold px-4 py-2 ${active ? 'active-pill' : 'inactive-pill'}`}
            style={{
                background: active ? '#EA580C' : 'transparent',
                color: active ? '#fff' : '#6B7280',
                borderRadius: '24px',
                border: active ? 'none' : '1px solid transparent',
                fontSize: '0.9rem', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
            }}
        >
            <i className={icon}></i>{label}
        </button>
    );
}

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
            <div>
                <div className="fw-semibold text-dark">{label}</div>
                <div className="text-muted small mt-1">{description}</div>
            </div>
            <div className="form-check form-switch fs-4 m-0">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    checked={checked} 
                    onChange={onChange} 
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}

export default function Profile({ profile }) {
    const { user } = usePage().props.auth;
    const [activeTab, setActiveTab] = useState('info');
    const [previewAvatar, setPreviewAvatar] = useState(null);

    const infoForm = useForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: null,
        _method: 'put'
    });

    // Password Form
    const pwForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        infoForm.post(route('seller.profile.updateInfo'), {
            preserveScroll: true,
            onSuccess: () => setPreviewAvatar(null),
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        pwForm.put(route('seller.profile.updatePassword'), {
            onSuccess: () => pwForm.reset(),
        });
    };

    return (
        <SellerLayout>
            <Head title="Hồ sơ & Bảo mật" />

            <div className="page">
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
            <div className="d-flex gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
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
                <div className="fade-in">
                    <h2 className="settings-title">Hồ sơ cá nhân</h2>
                    <p className="settings-subtitle">Quản lý thông tin hiển thị công khai trên hồ sơ của bạn.</p>

                    <div className="avatar-upload-zone">
                        <div className="avatar-preview-wrap">
                            <img src={previewAvatar || (profile?.avatar ? `/storage/${profile.avatar}` : `https://ui-avatars.com/api/?name=${user.name}&background=EA580C&color=fff`)} alt="Avatar" />
                            <label className="avatar-upload-btn">
                                <i className="fa-solid fa-camera fs-6"></i>
                                <input type="file" hidden accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        infoForm.setData('avatar', file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => setPreviewAvatar(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                        <div>
                            <div className="fw-semibold text-dark mb-1">Ảnh đại diện</div>
                            <div className="text-muted small">JPG, PNG hoặc GIF. Tối đa 2MB.</div>
                        </div>
                    </div>

                    <form onSubmit={handleInfoSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <FloatingInput 
                                    label="Họ và tên hiển thị" 
                                    value={infoForm.data.name} 
                                    onChange={(e) => infoForm.setData('name', e.target.value)} 
                                    error={infoForm.errors.name}
                                />
                            </div>
                            <div className="col-md-6">
                                <FloatingInput 
                                    label="Số điện thoại" 
                                    value={infoForm.data.phone} 
                                    onChange={(e) => infoForm.setData('phone', e.target.value)} 
                                />
                            </div>
                            <div className="col-12 position-relative">
                                <i className="fa-solid fa-lock position-absolute text-muted" style={{top: '32px', left: '20px', zIndex: 10}}></i>
                                <div style={{marginLeft: '10px'}}>
                                    <FloatingInput 
                                        label="Địa chỉ Email (Không thể thay đổi)" 
                                        value={profile?.email ?? ''} 
                                        onChange={() => {}} 
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="col-12 position-relative">
                                <FloatingInput 
                                    type="textarea"
                                    label="Tiểu sử giới thiệu" 
                                    value={infoForm.data.bio} 
                                    onChange={(e) => infoForm.setData('bio', e.target.value)} 
                                />
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', position: 'absolute', bottom: '35px', right: '30px' }}>
                                    {infoForm.data.bio?.length ?? 0}/1000
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4 mt-2 border">
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center border" style={{width: '40px', height: '40px'}}>
                                <i className="fa-regular fa-calendar text-muted"></i>
                            </div>
                            <div>
                                <div className="text-muted small">Ngày tham gia</div>
                                <div className="fw-semibold text-dark">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn-save-settings" disabled={infoForm.processing}>
                                {infoForm.processing ? <i className="fa-solid fa-spinner fa-spin me-2"></i> : <i className="fa-solid fa-floppy-disk me-2"></i>}
                                {infoForm.processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="fade-in">
                    <h2 className="settings-title">Bảo mật & Đăng nhập</h2>
                    <p className="settings-subtitle">Đảm bảo tài khoản của bạn luôn được bảo vệ an toàn.</p>

                    <form onSubmit={handlePasswordSubmit}>
                        <h5 className="fw-semibold mb-4 pb-2 border-bottom">Đổi mật khẩu</h5>
                        
                        <FloatingInput 
                            type="password" 
                            label="Mật khẩu hiện tại" 
                            value={pwForm.data.current_password} 
                            onChange={(e) => pwForm.setData('current_password', e.target.value)} 
                            error={pwForm.errors.current_password}
                            required
                        />

                        <div className="row">
                            <div className="col-md-6">
                                <FloatingInput 
                                    type="password" 
                                    label="Mật khẩu mới (Tối thiểu 8 ký tự)" 
                                    value={pwForm.data.new_password} 
                                    onChange={(e) => pwForm.setData('new_password', e.target.value)} 
                                    error={pwForm.errors.new_password}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="col-md-6">
                                <FloatingInput 
                                    type="password" 
                                    label="Xác nhận mật khẩu mới" 
                                    value={pwForm.data.new_password_confirmation} 
                                    onChange={(e) => pwForm.setData('new_password_confirmation', e.target.value)} 
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-5">
                            <button type="submit" className="btn-save-settings" disabled={pwForm.processing}>
                                {pwForm.processing ? <i className="fa-solid fa-spinner fa-spin me-2"></i> : <i className="fa-solid fa-shield-halved me-2"></i>}
                                {pwForm.processing ? 'Đang cập nhật...' : 'Cập nhật bảo mật'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            </div>
        </SellerLayout>
    );
}
