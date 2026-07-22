import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';
import './master.css';

function FloatingInput({ type = 'text', label, value, onChange, placeholder = ' ' }) {
    return (
        <div className="floating-label-group">
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
            <label>{label}</label>
        </div>
    );
}

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
            <div>
                <div className="fw-semibold text-dark">{label}</div>
                <div className="text-muted small mt-1">{description}</div>
            </div>
            <label className="toggle-switch">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className="toggle-slider"></span>
            </label>
        </div>
    );
}

export default function MasterSettings() {
    const { user } = usePage().props.auth;
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const handleMockSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showToast('Đã lưu thay đổi thành công!');
        }, 800);
    };

    return (
        <SellerLayout>
            <Head title="Cài đặt tài khoản" />
            
            <div className="settings-page">
                <div className="settings-container">
                    
                    {/* Left Sidebar (Grouped Navigation) */}
                    <div className="settings-sidebar">
                        <div className="settings-nav-group">
                            <div className="settings-nav-title">Tài khoản</div>
                            <button className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                                <i className="ri-user-smile-line fs-5"></i> Hồ sơ cá nhân
                            </button>
                            <button className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                                <i className="ri-shield-keyhole-line fs-5"></i> Bảo mật & Đăng nhập
                            </button>
                            <button className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                                <i className="ri-notification-3-line fs-5"></i> Cài đặt Thông báo
                            </button>
                            <button className={`settings-nav-item ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
                                <i className="ri-lock-2-line fs-5"></i> Quyền riêng tư
                            </button>
                        </div>

                        <div className="settings-nav-group">
                            <div className="settings-nav-title">Tài chính</div>
                            <button className={`settings-nav-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
                                <i className="ri-wallet-3-line fs-5"></i> Quản lý Ví điện tử
                            </button>
                            <button className={`settings-nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
                                <i className="ri-bank-card-line fs-5"></i> Phương thức thanh toán
                            </button>
                        </div>

                        <div className="settings-nav-group">
                            <div className="settings-nav-title">Nâng cao</div>
                            <button className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
                                <i className="ri-palette-line fs-5"></i> Giao diện
                            </button>
                            <button className={`settings-nav-item ${activeTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveTab('integrations')}>
                                <i className="ri-apps-2-line fs-5"></i> Ứng dụng liên kết
                            </button>
                        </div>

                        <div className="settings-nav-group mt-5 pt-3 border-top">
                            <button className="settings-nav-item danger">
                                <i className="ri-delete-bin-line fs-5"></i> Vô hiệu hóa tài khoản
                            </button>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="settings-content">
                        {activeTab === 'profile' && (
                            <div className="fade-in">
                                <h2 className="settings-title">Hồ sơ cá nhân</h2>
                                <p className="settings-subtitle">Quản lý thông tin hiển thị công khai trên hồ sơ của bạn.</p>

                                <div className="avatar-upload-zone">
                                    <div className="avatar-preview-wrap">
                                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=EA580C&color=fff`} alt="Avatar" />
                                        <label className="avatar-upload-btn">
                                            <i className="ri-camera-fill fs-6"></i>
                                            <input type="file" hidden accept="image/*" />
                                        </label>
                                    </div>
                                    <div>
                                        <div className="fw-semibold text-dark mb-1">Ảnh đại diện</div>
                                        <div className="text-muted small">JPG, PNG hoặc GIF. Tối đa 2MB.</div>
                                    </div>
                                </div>

                                <form onSubmit={handleMockSave}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FloatingInput label="Họ và tên hiển thị" value={user.name} onChange={()=>{}} />
                                        </div>
                                        <div className="col-md-6">
                                            <FloatingInput label="Chức danh (VD: Giảng viên cấp cao)" value="" onChange={()=>{}} />
                                        </div>
                                        <div className="col-md-6">
                                            <FloatingInput label="Địa chỉ Email" value={user.email} onChange={()=>{}} />
                                        </div>
                                        <div className="col-md-6">
                                            <FloatingInput label="Số điện thoại" value={user.phone || ''} onChange={()=>{}} />
                                        </div>
                                    </div>
                                    <div className="floating-label-group">
                                        <textarea rows="4" placeholder=" " defaultValue="Xin chào, tôi là một chuyên gia với hơn 10 năm kinh nghiệm..."></textarea>
                                        <label>Tiểu sử giới thiệu</label>
                                    </div>

                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="submit" className="btn-save-settings" disabled={isSaving}>
                                            {isSaving ? <i className="ri-loader-4-line ri-spin"></i> : <i className="ri-save-3-line"></i>}
                                            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="fade-in">
                                <h2 className="settings-title">Bảo mật & Đăng nhập</h2>
                                <p className="settings-subtitle">Đảm bảo tài khoản của bạn luôn được bảo vệ an toàn.</p>

                                <form onSubmit={handleMockSave}>
                                    <h5 className="fw-semibold mb-4 pb-2 border-bottom">Đổi mật khẩu</h5>
                                    <FloatingInput type="password" label="Mật khẩu hiện tại" value="" onChange={()=>{}} />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FloatingInput type="password" label="Mật khẩu mới" value="" onChange={()=>{}} />
                                        </div>
                                        <div className="col-md-6">
                                            <FloatingInput type="password" label="Xác nhận mật khẩu mới" value="" onChange={()=>{}} />
                                        </div>
                                    </div>
                                    
                                    <h5 className="fw-semibold mt-5 mb-4 pb-2 border-bottom">Xác thực 2 lớp (2FA)</h5>
                                    <ToggleRow 
                                        label="Bật xác thực 2 lớp qua Email" 
                                        description="Mỗi lần đăng nhập trên thiết bị mới, chúng tôi sẽ gửi mã OTP vào email của bạn."
                                        checked={true}
                                        onChange={()=>{}}
                                    />

                                    <div className="d-flex justify-content-end mt-5">
                                        <button type="submit" className="btn-save-settings" disabled={isSaving}>
                                            {isSaving ? <i className="ri-loader-4-line ri-spin"></i> : <i className="ri-shield-check-line"></i>}
                                            Cập nhật bảo mật
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="fade-in">
                                <h2 className="settings-title">Cài đặt thông báo</h2>
                                <p className="settings-subtitle">Quản lý cách chúng tôi liên hệ và thông báo cho bạn.</p>

                                <h5 className="fw-semibold mb-4 mt-4">Thông báo qua Email</h5>
                                <div className="p-4 bg-light rounded-3 mb-4">
                                    <ToggleRow label="Có học viên mới đăng ký" description="Nhận email khi có ai đó mua khóa học của bạn." checked={true} onChange={()=>{}} />
                                    <ToggleRow label="Học viên đặt câu hỏi (Q&A)" description="Nhận thông báo để hỗ trợ học viên kịp thời." checked={true} onChange={()=>{}} />
                                    <ToggleRow label="Đánh giá mới" description="Email khi nhận được review 1-5 sao." checked={false} onChange={()=>{}} />
                                    <ToggleRow label="Tiền về ví thành công" description="Nhận biên lai thanh toán tự động." checked={true} onChange={()=>{}} />
                                </div>
                            </div>
                        )}

                        {/* Placeholders for others */}
                        {(['privacy', 'wallet', 'billing', 'appearance', 'integrations'].includes(activeTab)) && (
                            <div className="fade-in d-flex flex-column align-items-center justify-content-center text-center" style={{minHeight: '400px'}}>
                                <i className="ri-tools-line text-muted mb-3" style={{fontSize: '4rem', opacity: 0.5}}></i>
                                <h3 className="fw-bold text-dark">Tính năng đang phát triển</h3>
                                <p className="text-muted">Khu vực quản lý <strong>{activeTab.toUpperCase()}</strong> này sẽ được tích hợp trong phiên bản tới theo cấu trúc hiện đại.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Toast */}
            {toastMsg && (
                <div style={{
                    position: 'fixed', bottom: '32px', right: '32px',
                    background: '#10B981', color: 'white', padding: '12px 24px',
                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500,
                    zIndex: 9999, animation: 'fadeInUp 0.3s ease'
                }}>
                    <i className="ri-checkbox-circle-fill fs-5"></i> {toastMsg}
                </div>
            )}
            
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .fade-in { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </SellerLayout>
    );
}
