import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import SweetAlert from '@/Components/SweetAlert';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Settings({ settings = [], flash }) {
    const [activeTab, setActiveTab] = useState('general');
    const [runningCron, setRunningCron] = useState(null);

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

        // Cronjob Schedules
        cron_payments_cancel_enabled: initialData.cron_payments_cancel_enabled ?? '1',
        cron_payments_cancel_freq: initialData.cron_payments_cancel_freq || 'everyMinute',

        cron_seller_release_enabled: initialData.cron_seller_release_enabled ?? '1',
        cron_seller_release_time: initialData.cron_seller_release_time || '01:00',

        cron_vip_check_enabled: initialData.cron_vip_check_enabled ?? '1',
        cron_vip_check_time: initialData.cron_vip_check_time || '02:00',

        cron_ads_reset_enabled: initialData.cron_ads_reset_enabled ?? '1',
        cron_ads_reset_time: initialData.cron_ads_reset_time || '00:00',

        cron_coupons_expire_enabled: initialData.cron_coupons_expire_enabled ?? '1',
        cron_coupons_expire_time: initialData.cron_coupons_expire_time || '00:00',

        cron_video_progress_sync_enabled: initialData.cron_video_progress_sync_enabled ?? '1',
        cron_video_progress_sync_freq: initialData.cron_video_progress_sync_freq || 'everyFiveMinutes',

        cron_vip_distribute_coupons_enabled: initialData.cron_vip_distribute_coupons_enabled ?? '1',
        cron_vip_distribute_coupons_time: initialData.cron_vip_distribute_coupons_time || '03:00',
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

    const handleRunCron = async (command, commandName) => {
        setRunningCron(command);
        try {
            const res = await axios.post(route('admin.settings.cron.run'), { command });
            if (res.data.success) {
                Swal.fire({
                    title: 'Thực thi thành công!',
                    html: `
                        <div class="text-start">
                            <p class="mb-2 text-muted">Lệnh: <code>php artisan ${command}</code></p>
                            <div class="p-3 bg-dark text-light rounded font-monospace small" style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${res.data.output}</div>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonColor: '#ea580c',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi thực thi',
                text: error.response?.data?.message || 'Có lỗi xảy ra khi chạy lệnh console.',
                icon: 'error',
                confirmButtonColor: '#ea580c',
            });
        } finally {
            setRunningCron(null);
        }
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
                        <li className="nav-item" role="presentation">
                            <button 
                                type="button"
                                className={`nav-link rounded-pill border-0 px-4 fw-bold ${activeTab === 'cron' ? 'active bg-primary text-white shadow-sm' : 'bg-white text-muted hover-bg-light'}`}
                                onClick={() => setActiveTab('cron')}
                                style={{ transition: 'all 0.3s' }}
                            >
                                <i className="fa-solid fa-clock-rotate-left me-2"></i> Tác vụ tự động (Cron Jobs)
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

                        {/* TAB 3: TÁC VỤ TỰ ĐỘNG / CRON JOBS */}
                        {activeTab === 'cron' && (
                            <div className="card border-0 shadow-sm rounded-4 p-4 animation-fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                    <div>
                                        <h5 className="fw-bold text-dark mb-1">
                                            <i className="fa-solid fa-clock-rotate-left text-primary me-2"></i>
                                            Quản lý Lịch trình tác vụ tự động (Cron Jobs)
                                        </h5>
                                        <p className="text-muted small mb-0">
                                            Tùy chỉnh thời gian chạy, bật/tắt hoặc kích hoạt chạy thử thủ công từng lệnh hệ thống.
                                        </p>
                                    </div>
                                    <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                        <i className="fa-solid fa-server me-1"></i> Laravel Task Scheduler
                                    </div>
                                </div>

                                <div className="row g-4">
                                    {/* 1. seller:release-earnings */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-success bg-opacity-10 text-success rounded-3">
                                                            <i className="fa-solid fa-money-bill-wave fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Giải phóng doanh thu Seller</h6>
                                                            <code className="small text-muted">seller:release-earnings</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_seller_release_enabled == '1'}
                                                            onChange={e => setData('cron_seller_release_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Tự động chuyển tiền doanh thu từ ví giam (pending) sang ví khả dụng (available) cho Giảng viên.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Giờ chạy hàng ngày</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control form-control-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_seller_release_time}
                                                        onChange={e => setData('cron_seller_release_time', e.target.value)}
                                                        disabled={data.cron_seller_release_enabled != '1'}
                                                    />
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                                        disabled={runningCron === 'seller:release-earnings'}
                                                        onClick={() => handleRunCron('seller:release-earnings', 'Giải phóng doanh thu')}
                                                    >
                                                        {runningCron === 'seller:release-earnings' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. vip:check-expiring */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3">
                                                            <i className="fa-solid fa-crown fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Quét hạn gói VIP Subscriptions</h6>
                                                            <code className="small text-muted">vip:check-expiring</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_vip_check_enabled == '1'}
                                                            onChange={e => setData('cron_vip_check_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Kiểm tra các gói VIP sắp hết hạn (3 ngày) để gửi thông báo và tự động hủy gói khi đã hết hạn.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Giờ chạy hàng ngày</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control form-control-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_vip_check_time}
                                                        onChange={e => setData('cron_vip_check_time', e.target.value)}
                                                        disabled={data.cron_vip_check_enabled != '1'}
                                                    />
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold d-flex align-items-center gap-1 text-dark"
                                                        disabled={runningCron === 'vip:check-expiring'}
                                                        onClick={() => handleRunCron('vip:check-expiring', 'Quét hạn gói VIP')}
                                                    >
                                                        {runningCron === 'vip:check-expiring' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. ads:reset-daily */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                                                            <i className="fa-solid fa-bullhorn fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Reset ngân sách ngày Quảng Cáo</h6>
                                                            <code className="small text-muted">ads:reset-daily</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_ads_reset_enabled == '1'}
                                                            onChange={e => setData('cron_ads_reset_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Reset số tiền đã tiêu trong ngày (`spent_today = 0`) và kích hoạt lại các chiến dịch ads tạm dừng do chạm limit ngày.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Giờ chạy hàng ngày</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control form-control-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_ads_reset_time}
                                                        onChange={e => setData('cron_ads_reset_time', e.target.value)}
                                                        disabled={data.cron_ads_reset_enabled != '1'}
                                                    />
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                                        disabled={runningCron === 'ads:reset-daily'}
                                                        onClick={() => handleRunCron('ads:reset-daily', 'Reset ngân sách Ads')}
                                                    >
                                                        {runningCron === 'ads:reset-daily' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. coupons:expire */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-danger bg-opacity-10 text-danger rounded-3">
                                                            <i className="fa-solid fa-tags fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Vô hiệu hóa Coupons hết hạn</h6>
                                                            <code className="small text-muted">coupons:expire</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_coupons_expire_enabled == '1'}
                                                            onChange={e => setData('cron_coupons_expire_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Tự động chuyển trạng thái các mã giảm giá (coupons) đã quá ngày kết thúc sang không kích hoạt.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Giờ chạy hàng ngày</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control form-control-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_coupons_expire_time}
                                                        onChange={e => setData('cron_coupons_expire_time', e.target.value)}
                                                        disabled={data.cron_coupons_expire_enabled != '1'}
                                                    />
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                                        disabled={runningCron === 'coupons:expire'}
                                                        onClick={() => handleRunCron('coupons:expire', 'Vô hiệu hóa Coupons')}
                                                    >
                                                        {runningCron === 'coupons:expire' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. payments:cancel-abandoned */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-info bg-opacity-10 text-info rounded-3">
                                                            <i className="fa-solid fa-ban fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Hủy đơn thanh toán treo</h6>
                                                            <code className="small text-muted">payments:cancel-abandoned</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_payments_cancel_enabled == '1'}
                                                            onChange={e => setData('cron_payments_cancel_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Tự động hủy các yêu cầu thanh toán trực tuyến (VNPay) bị bỏ dở hoặc quá hạn sau 15 phút.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Tần suất quét</label>
                                                    <select 
                                                        className="form-select form-select-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_payments_cancel_freq}
                                                        onChange={e => setData('cron_payments_cancel_freq', e.target.value)}
                                                        disabled={data.cron_payments_cancel_enabled != '1'}
                                                    >
                                                        <option value="everyMinute">Mỗi 1 phút (everyMinute)</option>
                                                        <option value="everyTwoMinutes">Mỗi 2 phút (everyTwoMinutes)</option>
                                                        <option value="everyFiveMinutes">Mỗi 5 phút (everyFiveMinutes)</option>
                                                        <option value="everyTenMinutes">Mỗi 10 phút (everyTenMinutes)</option>
                                                        <option value="everyFifteenMinutes">Mỗi 15 phút (everyFifteenMinutes)</option>
                                                        <option value="everyThirtyMinutes">Mỗi 30 phút (everyThirtyMinutes)</option>
                                                        <option value="hourly">Mỗi 1 giờ (hourly)</option>
                                                    </select>
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                                        disabled={runningCron === 'payments:cancel-abandoned'}
                                                        onClick={() => handleRunCron('payments:cancel-abandoned', 'Hủy đơn treo')}
                                                    >
                                                        {runningCron === 'payments:cancel-abandoned' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 6. video-progress:sync */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-dark bg-opacity-10 text-dark rounded-3">
                                                            <i className="fa-solid fa-arrows-rotate fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Đồng bộ tiến độ Video (Redis → DB)</h6>
                                                            <code className="small text-muted">video-progress:sync</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_video_progress_sync_enabled == '1'}
                                                            onChange={e => setData('cron_video_progress_sync_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Đồng bộ tiến độ học tập và xem video bị kẹt tạm thời từ cache Redis về cơ sở dữ liệu MySQL.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Tần suất đồng bộ</label>
                                                    <select 
                                                        className="form-select form-select-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_video_progress_sync_freq}
                                                        onChange={e => setData('cron_video_progress_sync_freq', e.target.value)}
                                                        disabled={data.cron_video_progress_sync_enabled != '1'}
                                                    >
                                                        <option value="everyMinute">Mỗi 1 phút (everyMinute)</option>
                                                        <option value="everyTwoMinutes">Mỗi 2 phút (everyTwoMinutes)</option>
                                                        <option value="everyFiveMinutes">Mỗi 5 phút (everyFiveMinutes)</option>
                                                        <option value="everyTenMinutes">Mỗi 10 phút (everyTenMinutes)</option>
                                                        <option value="everyFifteenMinutes">Mỗi 15 phút (everyFifteenMinutes)</option>
                                                        <option value="everyThirtyMinutes">Mỗi 30 phút (everyThirtyMinutes)</option>
                                                        <option value="hourly">Mỗi 1 giờ (hourly)</option>
                                                    </select>
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                                        disabled={runningCron === 'video-progress:sync'}
                                                        onClick={() => handleRunCron('video-progress:sync', 'Đồng bộ tiến độ Video')}
                                                    >
                                                        {runningCron === 'video-progress:sync' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 7. vip:distribute-coupons */}
                                    <div className="col-12 col-lg-6">
                                        <div className="p-4 bg-light rounded-4 h-100 border border-secondary border-opacity-10 d-flex flex-column justify-content-between" style={{ borderLeft: '4px solid #F59E0B' }}>
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3">
                                                            <i className="fa-solid fa-gift fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-0">Phát mã giảm giá VIP</h6>
                                                            <code className="small text-muted">vip:distribute-coupons</code>
                                                        </div>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                                                            checked={data.cron_vip_distribute_coupons_enabled == '1'}
                                                            onChange={e => setData('cron_vip_distribute_coupons_enabled', e.target.checked ? '1' : '0')}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Tự động phát mã giảm giá hàng tháng cho Học Viên VIP đang có subscription còn hiệu lực. Mỗi tháng mỗi học viên nhận 1 mã giảm 10%.
                                                </p>
                                            </div>

                                            <div className="pt-3 border-top d-flex justify-content-between align-items-center gap-3">
                                                <div className="flex-grow-1">
                                                    <label className="form-label small fw-bold text-dark mb-1">Giờ chạy hàng ngày</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control form-control-sm rounded-3 shadow-none bg-white"
                                                        value={data.cron_vip_distribute_coupons_time}
                                                        onChange={e => setData('cron_vip_distribute_coupons_time', e.target.value)}
                                                        disabled={data.cron_vip_distribute_coupons_enabled != '1'}
                                                    />
                                                </div>
                                                <div className="pt-3">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold d-flex align-items-center gap-1 text-dark"
                                                        disabled={runningCron === 'vip:distribute-coupons'}
                                                        onClick={() => handleRunCron('vip:distribute-coupons', 'Phát mã giảm giá VIP')}
                                                    >
                                                        {runningCron === 'vip:distribute-coupons' ? (
                                                            <><span className="spinner-border spinner-border-sm"></span> Đang chạy...</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play"></i> Chạy ngay</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
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
