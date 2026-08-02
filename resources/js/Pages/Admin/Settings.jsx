import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import SweetAlert from '@/Components/SweetAlert';

export default function Settings({ settings = [], flash }) {
    const [activeTab, setActiveTab] = useState('general');

    // Convert settings array to object for easier handling
    const initialData = {};
    settings.forEach(s => {
        initialData[s.key] = s.value;
    });

    const { data, setData, post, processing } = useForm({
        // Default values in case they don't exist in DB
        commission_rate: initialData.commission_rate || '15',
        wallet_bonus_rate: initialData.wallet_bonus_rate || '5',
        default_storage_gb: initialData.default_storage_gb || '2',
        ad_min_bid_price: initialData.ad_min_bid_price || '1000',
        ad_min_daily_budget: initialData.ad_min_daily_budget || '10000',
        notify_new_report: initialData.notify_new_report || '1',
        notify_new_contact: initialData.notify_new_contact || '1',
        notify_new_withdrawal: initialData.notify_new_withdrawal || '1',
    });

    const [alert, setAlert] = useState({ show: false, type: 'success', title: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            onSuccess: () => {
                setAlert({ show: true, type: 'success', title: 'Đã lưu thay đổi thành công!' });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Cài đặt hệ thống" />
            <SweetAlert
                show={alert.show}
                type="toast"
                icon={alert.type}
                title={alert.title}
                onClose={() => setAlert({ show: false, type: 'success', title: '' })}
            />

            <div className="content-area">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up mb-4">
                        <div>
                            <h3 className="m-0 fw-bold text-dark">Cài đặt hệ thống</h3>
                            <p className="text-muted mb-0">Cấu hình các thông số cốt lõi và thông báo</p>
                        </div>
                        <button type="submit" disabled={processing} className="btn btn-glass-primary fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm">
                            <i className="fa-solid fa-save"></i> 
                            {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>

                    <ul className="nav nav-tabs border-0 mb-4 stagger-fade-up gap-2" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button 
                                type="button"
                                className={`nav-link rounded-pill border-0 px-4 fw-bold ${activeTab === 'general' ? 'active bg-primary text-white shadow-sm' : 'bg-white text-muted hover-bg-light'}`}
                                onClick={() => setActiveTab('general')}
                                style={{ transition: 'all 0.3s' }}
                            >
                                <i className="fa-solid fa-sliders me-2"></i> Cài đặt chung
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                type="button"
                                className={`nav-link rounded-pill border-0 px-4 fw-bold ${activeTab === 'notifications' ? 'active bg-primary text-white shadow-sm' : 'bg-white text-muted hover-bg-light'}`}
                                onClick={() => setActiveTab('notifications')}
                                style={{ transition: 'all 0.3s' }}
                            >
                                <i className="fa-solid fa-bell me-2"></i> Thông báo hệ thống
                            </button>
                        </li>
                    </ul>
                    
                    <div className="tab-content stagger-fade-up">
                        {/* TAB 1: CÀI ĐẶT CHUNG */}
                        {activeTab === 'general' && (
                            <div className="card border-0 shadow-sm rounded-4 p-4 animation-fade-in">
                                <h5 className="fw-bold mb-4 text-dark"><i className="fa-solid fa-percent text-primary me-2"></i>Cấu hình Mặc định</h5>
                                
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100">
                                            <label className="form-label text-dark fw-bold mb-1">Tỉ lệ ăn chia mặc định</label>
                                            <p className="text-muted small mb-3">Phần trăm hoa hồng mà nền tảng giữ lại từ doanh thu của khóa học.</p>
                                            <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                                <input 
                                                    type="number" 
                                                    className="form-control border-0 px-3" 
                                                    value={data.commission_rate}
                                                    onChange={e => setData('commission_rate', e.target.value)}
                                                    min="0" max="100"
                                                />
                                                <span className="input-group-text border-0 bg-white text-muted fw-bold">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100">
                                            <label className="form-label text-dark fw-bold mb-1">Dung lượng lưu trữ mặc định</label>
                                            <p className="text-muted small mb-3">Giới hạn dung lượng kho lưu trữ video cho Giảng viên chưa mua gói VIP.</p>
                                            <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                                <input 
                                                    type="number" 
                                                    className="form-control border-0 px-3" 
                                                    value={data.default_storage_gb}
                                                    onChange={e => setData('default_storage_gb', e.target.value)}
                                                    min="0"
                                                />
                                                <span className="input-group-text border-0 bg-white text-muted fw-bold">GB</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Keep bonus rate if needed */}
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100">
                                            <label className="form-label text-dark fw-bold mb-1">Thưởng nạp ví</label>
                                            <p className="text-muted small mb-3">Phần trăm tiền thưởng cộng thêm khi người dùng nạp tiền vào ví.</p>
                                            <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                                <input 
                                                    type="number" 
                                                    className="form-control border-0 px-3" 
                                                    value={data.wallet_bonus_rate}
                                                    onChange={e => setData('wallet_bonus_rate', e.target.value)}
                                                    min="0" max="100"
                                                />
                                                <span className="input-group-text border-0 bg-white text-muted fw-bold">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AD SETTINGS */}
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100 border border-primary border-opacity-25">
                                            <label className="form-label text-primary fw-bold mb-1">
                                                <i className="fa-solid fa-rectangle-ad me-1"></i> Giá thầu Quảng Cáo tối thiểu
                                            </label>
                                            <p className="text-muted small mb-3">Số tiền tối thiểu Seller phải trả cho mỗi lượt click (CPC).</p>
                                            <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                                <input 
                                                    type="number" 
                                                    className="form-control border-0 px-3 text-success fw-bold" 
                                                    value={data.ad_min_bid_price}
                                                    onChange={e => setData('ad_min_bid_price', e.target.value)}
                                                    min="0" step="500"
                                                />
                                                <span className="input-group-text border-0 bg-white text-muted fw-bold">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100 border border-primary border-opacity-25">
                                            <label className="form-label text-primary fw-bold mb-1">
                                                <i className="fa-solid fa-wallet me-1"></i> Ngân sách Quảng Cáo ngày tối thiểu
                                            </label>
                                            <p className="text-muted small mb-3">Số tiền tối thiểu Seller phải đặt làm ngân sách chạy mỗi ngày.</p>
                                            <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                                <input 
                                                    type="number" 
                                                    className="form-control border-0 px-3 text-success fw-bold" 
                                                    value={data.ad_min_daily_budget}
                                                    onChange={e => setData('ad_min_daily_budget', e.target.value)}
                                                    min="0" step="5000"
                                                />
                                                <span className="input-group-text border-0 bg-white text-muted fw-bold">VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: THÔNG BÁO */}
                        {activeTab === 'notifications' && (
                            <div className="card border-0 shadow-sm rounded-4 p-4 animation-fade-in">
                                <h5 className="fw-bold mb-4 text-dark"><i className="fa-regular fa-bell text-warning me-2"></i>Nhận thông báo qua hệ thống</h5>
                                <p className="text-muted mb-4">Lựa chọn các sự kiện mà Ban quản trị (Admin) sẽ nhận được thông báo.</p>
                                
                                <div className="list-group list-group-flush border-top">
                                    <div className="list-group-item bg-transparent py-4 px-0 border-bottom d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="fw-bold mb-1">Yêu cầu rút tiền</h6>
                                            <p className="text-muted small mb-0">Nhận thông báo khi Giảng viên gửi yêu cầu rút doanh thu mới.</p>
                                        </div>
                                        <div className="form-check form-switch form-switch-lg">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                checked={data.notify_new_withdrawal == '1'}
                                                onChange={e => setData('notify_new_withdrawal', e.target.checked ? '1' : '0')}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="list-group-item bg-transparent py-4 px-0 border-bottom d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="fw-bold mb-1">Báo cáo vi phạm</h6>
                                            <p className="text-muted small mb-0">Nhận thông báo khi có người dùng báo cáo nội dung xấu (khóa học, đánh giá).</p>
                                        </div>
                                        <div className="form-check form-switch form-switch-lg">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                checked={data.notify_new_report == '1'}
                                                onChange={e => setData('notify_new_report', e.target.checked ? '1' : '0')}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="list-group-item bg-transparent py-4 px-0 border-bottom d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="fw-bold mb-1">Liên hệ / Hỗ trợ</h6>
                                            <p className="text-muted small mb-0">Nhận thông báo khi có khách hàng gửi form liên hệ cần hỗ trợ.</p>
                                        </div>
                                        <div className="form-check form-switch form-switch-lg">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                checked={data.notify_new_contact == '1'}
                                                onChange={e => setData('notify_new_contact', e.target.checked ? '1' : '0')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
