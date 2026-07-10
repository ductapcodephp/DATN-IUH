import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';
import './settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Mock data
    const sellerInfo = {
        name: 'Trần Văn Demo',
        email: 'seller@example.com',
        phone: '0987654321',
        website: 'https://demo-academy.com',
        facebook: 'facebook.com/demo',
        linkedin: 'linkedin.com/in/demo',
        avatar: 'https://ui-avatars.com/api/?name=TVD&background=F97316&color=fff',
        isVip: true,
        storageUsed: 2,
        storageTotal: 50,
    };

    const handleSave = () => {
        setIsSaving(true);
        setIsSaved(false);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000); // Hide toast after 3s
        }, 800);
    };

    return (
        <SellerLayout>
            <Head title="Seller Settings" />
            
            <div className="settings-container">
                {/* Breadcrumb & Header */}
                <div className="settings-header">
                    <div className="breadcrumb">
                        <Link href="/seller/dashboard">Dashboard</Link>
                        <span className="separator"><i className="fas fa-chevron-right"></i></span>
                        <span className="current">Settings</span>
                    </div>
                    <h1 className="settings-title">Cài đặt tài khoản</h1>
                    <p className="settings-sub">Quản lý thông tin, thanh toán và bảo mật</p>
                </div>

                <div className="settings-body">
                    <div className="settings-tabs">
                        <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
                            <i className="fas fa-user"></i> General
                        </button>
                        <button className={`tab-btn ${activeTab === 'payout' ? 'active' : ''}`} onClick={() => setActiveTab('payout')}>
                            <i className="fas fa-credit-card"></i> Payout
                        </button>
                        <button className={`tab-btn ${activeTab === 'vip' ? 'active' : ''}`} onClick={() => setActiveTab('vip')}>
                            <i className="fas fa-gem"></i> VIP & Limits
                        </button>
                        <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                            <i className="fas fa-shield-alt"></i> Security
                        </button>
                    </div>

                    <div className="settings-content">
                        {activeTab === 'general' && (
                            <div className="tab-pane fade-in">
                                <h3>Thông tin chung</h3>
                                <div className="general-layout">
                                    <div className="avatar-section">
                                        <div className="avatar-wrapper">
                                            <img src={sellerInfo.avatar} alt="Avatar" className="avatar-preview" />
                                            <div className="avatar-overlay">
                                                <i className="fas fa-camera"></i>
                                            </div>
                                        </div>
                                        <button className="btn-upload">Tải ảnh lên</button>
                                        <p className="avatar-hint">Định dạng JPG, PNG. Tối đa 2MB.</p>
                                    </div>
                                    <div className="form-group-wrap">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Họ và tên</label>
                                                <div className="input-with-icon">
                                                    <i className="fas fa-user"></i>
                                                    <input type="text" defaultValue={sellerInfo.name} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <div className="input-with-icon">
                                                    <i className="fas fa-envelope"></i>
                                                    <input type="email" defaultValue={sellerInfo.email} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Số điện thoại</label>
                                                <div className="input-with-icon">
                                                    <i className="fas fa-phone-alt"></i>
                                                    <input type="text" defaultValue={sellerInfo.phone} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Website</label>
                                                <div className="input-with-icon">
                                                    <i className="fas fa-globe"></i>
                                                    <input type="url" defaultValue={sellerInfo.website} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Facebook</label>
                                                <div className="input-with-icon">
                                                    <i className="fab fa-facebook-f" style={{paddingLeft: '2px'}}></i>
                                                    <input type="text" defaultValue={sellerInfo.facebook} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>LinkedIn</label>
                                                <div className="input-with-icon">
                                                    <i className="fab fa-linkedin-in"></i>
                                                    <input type="text" defaultValue={sellerInfo.linkedin} className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Giới thiệu ngắn (Bio)</label>
                                            <div className="input-with-icon textarea-icon">
                                                <i className="fas fa-pen"></i>
                                                <textarea className="form-control" rows="4" defaultValue="Chào các bạn, mình là giảng viên Demo."></textarea>
                                            </div>
                                        </div>
                                        
                                        <div className="action-row">
                                            <button className="btn-primary-custom" onClick={handleSave} disabled={isSaving}>
                                                {isSaving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : 'Lưu thay đổi'}
                                            </button>
                                            {isSaved && <span className="save-status success"><i className="fas fa-check-circle"></i> Đã lưu thành công!</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payout' && (
                            <div className="tab-pane fade-in">
                                <h3>Thông tin nhận tiền (Payout)</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Ngân hàng</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-university"></i>
                                            <select className="form-control" defaultValue="Vietcombank">
                                                <option value="Vietcombank">Vietcombank</option>
                                                <option value="Techcombank">Techcombank</option>
                                                <option value="MB">MB Bank</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Chi nhánh</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-code-branch"></i>
                                            <input type="text" defaultValue="Hà Nội" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Số tài khoản</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-hashtag"></i>
                                            <input type="text" defaultValue="1234567890" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Tên chủ tài khoản</label>
                                        <div className="input-with-icon">
                                            <i className="fas fa-user-tag"></i>
                                            <input type="text" defaultValue={sellerInfo.name.toUpperCase()} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="action-row">
                                    <button className="btn-primary-custom" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : 'Lưu thông tin'}
                                    </button>
                                    {isSaved && <span className="save-status success"><i className="fas fa-check-circle"></i> Đã lưu thành công!</span>}
                                </div>
                            </div>
                        )}

                        {activeTab === 'vip' && (
                            <div className="tab-pane fade-in">
                                <h3>Tài khoản & Dung lượng</h3>
                                <div className="vip-badge-section animated-gradient">
                                    <div className="vip-badge pulse">
                                        <i className="fas fa-crown" style={{color: '#8B6508'}}></i> Seller VIP
                                    </div>
                                    <div className="vip-text-wrap">
                                        <h4>Đặc quyền VIP đã kích hoạt</h4>
                                        <p style={{margin: 0, color: '#5a4613', fontSize: '0.9rem'}}>Tài khoản của bạn đã được xác minh và có đặc quyền cao nhất.</p>
                                    </div>
                                </div>
                                
                                <div className="limit-section">
                                    <div className="limit-header">
                                        <h4><i className="fas fa-cloud-upload-alt text-fire" style={{marginRight: 8, color: 'var(--fire)'}}></i>Dung lượng lưu trữ (Video/Tài liệu)</h4>
                                        <span className="limit-percentage">{Math.round((sellerInfo.storageUsed / sellerInfo.storageTotal) * 100)}%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill striped-animated" style={{ width: `${(sellerInfo.storageUsed / sellerInfo.storageTotal) * 100}%` }}></div>
                                    </div>
                                    <p className="limit-text">{sellerInfo.storageUsed} GB / {sellerInfo.storageTotal} GB đã dùng</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="tab-pane fade-in">
                                <h3>Bảo mật tài khoản</h3>
                                <div className="form-group" style={{maxWidth: '500px'}}>
                                    <label>Mật khẩu hiện tại</label>
                                    <div className="input-with-icon">
                                        <i className="fas fa-unlock-alt"></i>
                                        <input type="password" placeholder="••••••••" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group" style={{maxWidth: '500px'}}>
                                    <label>Mật khẩu mới</label>
                                    <div className="input-with-icon">
                                        <i className="fas fa-lock"></i>
                                        <input type="password" placeholder="Mật khẩu mới" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group" style={{maxWidth: '500px'}}>
                                    <label>Xác nhận mật khẩu</label>
                                    <div className="input-with-icon">
                                        <i className="fas fa-check-circle"></i>
                                        <input type="password" placeholder="Xác nhận mật khẩu" className="form-control" />
                                    </div>
                                </div>
                                <div className="action-row">
                                    <button className="btn-primary-custom" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? <><i className="fas fa-spinner fa-spin"></i> Đang cập nhật...</> : 'Đổi mật khẩu'}
                                    </button>
                                    {isSaved && <span className="save-status success"><i className="fas fa-check-circle"></i> Cập nhật thành công!</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
