import React, { useState } from 'react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AdsIndex({ courses, wallet, auth }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getThumbnailUrl = (thumbnail) => {
        if (!thumbnail) return '/assets/frontend/img/default-course.png';
        if (thumbnail.startsWith('http') || thumbnail.startsWith('/')) return thumbnail;
        return `/storage/${thumbnail}`;
    };

    // Lấy ngày hôm nay dạng YYYY-MM-DD để set min cho input date
    const getTodayString = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [actionType, setActionType] = useState(''); // 'config' or 'topup'

    const configForm = useForm({
        course_id: '',
        bid_price: 1000,
        daily_budget: 50000,
        start_date: '',
        end_date: '',
    });

    const topUpForm = useForm({
        course_id: '',
        amount: 50000,
    });

    const openConfigModal = (course) => {
        setSelectedCourse(course);
        setActionType('config');
        const ad = course.ads?.length > 0 ? course.ads[0] : null;
        configForm.setData({
            course_id: course.id,
            bid_price: ad ? Number(ad.bid_price) : 1000,
            daily_budget: ad ? Number(ad.daily_budget) : 50000,
            start_date: ad?.start_date ? ad.start_date.split('T')[0] : getTodayString(),
            end_date: ad?.end_date ? ad.end_date.split('T')[0] : '',
        });
        configForm.clearErrors();
    };

    const openTopUpModal = (course) => {
        setSelectedCourse(course);
        setActionType('topup');
        topUpForm.setData({
            course_id: course.id,
            amount: 50000,
        });
        topUpForm.clearErrors();
    };

    const closeAdModal = () => {
        const closeBtn = document.querySelector('#adModal .btn-close');
        if (closeBtn) closeBtn.click();
    };

    const submitConfig = (e) => {
        e.preventDefault();
        configForm.post(route('seller.ads.store'), {
            onSuccess: () => {
                closeAdModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã lưu cấu hình Quảng Cáo',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const submitTopUp = (e) => {
        e.preventDefault();
        topUpForm.post(route('seller.ads.top-up'), {
            onSuccess: () => {
                closeAdModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã nạp tiền vào chiến dịch Quảng Cáo',
                    timer: 1500,
                    showConfirmButton: false
                });
            },
            onError: (errors) => {
                if(errors.error) {
                    Swal.fire('Lỗi', errors.error, 'error');
                }
            }
        });
    };

    const toggleStatus = (courseId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        router.patch(route('seller.ads.toggle-status'), {
            course_id: courseId,
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Đã cập nhật trạng thái',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            onError: (errors) => {
                if (errors.error) {
                    Swal.fire('Lỗi', errors.error, 'error');
                }
            }
        });
    };

    return (
        <SellerLayout>
            <Head title="Quản lý Quảng Cáo" />
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 text-gray-800">Quản lý Quảng Cáo (Sponsored Courses)</h1>
                </div>


                <div className="row g-4">
                    {courses.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <i className="fa-solid fa-bullhorn fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">Chưa có khóa học nào đã xuất bản để chạy Quảng cáo.</h5>
                        </div>
                    ) : (
                        courses.map(course => {
                            const ad = course.ads?.length > 0 ? course.ads[0] : null;
                            
                            let adStatusBadge = <span className="badge bg-secondary rounded-pill px-3 py-2"><i className="fa-solid fa-power-off me-1"></i> Chưa chạy</span>;
                            if (ad) {
                                if (ad.status === 'active') {
                                    adStatusBadge = <span className="badge bg-success rounded-pill px-3 py-2"><i className="fa-solid fa-circle-play me-1"></i> Đang chạy</span>;
                                } else if (ad.status === 'paused') {
                                    adStatusBadge = <span className="badge bg-warning text-dark rounded-pill px-3 py-2"><i className="fa-solid fa-pause me-1"></i> Tạm dừng</span>;
                                } else if (ad.status === 'out_of_budget') {
                                    adStatusBadge = <span className="badge bg-danger rounded-pill px-3 py-2"><i className="fa-solid fa-ban me-1"></i> Hết ngân sách</span>;
                                } else if (ad.status === 'expired') {
                                    adStatusBadge = <span className="badge bg-dark rounded-pill px-3 py-2"><i className="fa-solid fa-clock me-1"></i> Hết hạn</span>;
                                }
                            }

                            return (
                                <div className="col-12 col-md-6 col-xl-4" key={course.id}>
                                    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                        <div className="position-relative">
                                            <img 
                                                src={getThumbnailUrl(course.thumbnail)} 
                                                alt={course.title} 
                                                className="card-img-top object-fit-cover" 
                                                style={{ height: '160px' }}
                                                onError={(e) => { e.target.src = '/assets/frontend/img/default-course.png'; }}
                                            />
                                            <div className="position-absolute top-0 end-0 p-3">
                                                {adStatusBadge}
                                            </div>
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title text-truncate fw-bold text-dark mb-3" title={course.title}>
                                                {course.title}
                                            </h5>
                                            
                                            <div className="row g-2 mb-3 flex-grow-1">
                                                <div className="col-6">
                                                    <div className="p-3 bg-light rounded text-center h-100">
                                                        <div className="text-muted small mb-1">Ngân sách dư</div>
                                                        <div className="fw-bold text-primary">{ad ? formatCurrency(ad.campaign_balance) : '0 ₫'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 bg-light rounded text-center h-100">
                                                        <div className="text-muted small mb-1">Đã tiêu h.nay</div>
                                                        <div className="fw-bold text-danger">{ad ? formatCurrency(ad.spent_today) : '0 ₫'}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>/ {ad ? formatCurrency(ad.daily_budget) : '0 ₫'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="p-2 bg-light rounded d-flex justify-content-between align-items-center px-3">
                                                        <span className="text-muted small">Giá thầu (CPC):</span>
                                                        <span className="fw-bold text-success">{ad ? formatCurrency(ad.bid_price) : '0 ₫'}</span>
                                                    </div>
                                                </div>
                                                {/* Hiển thị thời hạn chạy quảng cáo */}
                                                {ad && (ad.start_date || ad.end_date) && (
                                                    <div className="col-12">
                                                        <div className="p-2 bg-light rounded d-flex justify-content-between align-items-center px-3">
                                                            <span className="text-muted small"><i className="fa-regular fa-calendar me-1"></i>Thời hạn:</span>
                                                            <span className="fw-bold small" style={{ color: ad.status === 'expired' ? '#dc3545' : '#0d6efd' }}>
                                                                {formatDate(ad.start_date)} → {formatDate(ad.end_date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-auto gap-2">
                                                <button 
                                                    className="btn btn-light border flex-fill fw-bold"
                                                    style={{ color: '#4b5563' }}
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#adModal"
                                                    onClick={() => openConfigModal(course)}
                                                >
                                                    <i className="fa-solid fa-gear me-1"></i> Cấu hình
                                                </button>
                                                <button 
                                                    className="btn btn-primary btn-gradient-orange border-0 flex-fill fw-bold"
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#adModal"
                                                    onClick={() => openTopUpModal(course)}
                                                >
                                                    <i className="fa-solid fa-wallet me-1"></i> Nạp tiền
                                                </button>
                                                {ad && (
                                                    <button 
                                                        className={`btn flex-fill fw-bold text-white ${ad.status === 'active' ? 'bg-secondary border-secondary' : 'bg-success border-success'}`}
                                                        onClick={() => toggleStatus(course.id, ad.status)}
                                                    >
                                                        {ad.status === 'active' ? (
                                                            <><i className="fa-solid fa-pause me-1"></i> Tạm Dừng</>
                                                        ) : (
                                                            <><i className="fa-solid fa-play me-1"></i> Bật Kích Hoạt</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal for Config & Top Up */}
            <div className="modal fade" id="adModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {actionType === 'config' && (
                            <form onSubmit={submitConfig}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Cấu hình Quảng Cáo</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-muted mb-3">Khóa học: <strong>{selectedCourse?.title}</strong></p>
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Giá thầu CPC (VNĐ / Click)</label>
                                        <input 
                                            type="number" 
                                            className={`form-control ${configForm.errors.bid_price ? 'is-invalid' : ''}`}
                                            value={configForm.data.bid_price}
                                            onChange={e => configForm.setData('bid_price', e.target.value)}
                                            min="1000"
                                            step="500"
                                        />
                                        <div className="form-text">Số tiền bạn sẵn sàng trả cho 1 lượt click. Tối thiểu 1,000đ. Giá thầu càng cao, tỉ lệ xuất hiện trang chủ càng lớn.</div>
                                        {configForm.errors.bid_price && <div className="invalid-feedback">{configForm.errors.bid_price}</div>}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Ngân sách ngày (VNĐ)</label>
                                        <input 
                                            type="number" 
                                            className={`form-control ${configForm.errors.daily_budget ? 'is-invalid' : ''}`}
                                            value={configForm.data.daily_budget}
                                            onChange={e => configForm.setData('daily_budget', e.target.value)}
                                            min="10000"
                                            step="5000"
                                        />
                                        <div className="form-text">Số tiền tối đa quảng cáo tiêu mỗi ngày. Hết tiền sẽ tự động tạm dừng. Tối thiểu 10,000đ.</div>
                                        {configForm.errors.daily_budget && <div className="invalid-feedback">{configForm.errors.daily_budget}</div>}
                                    </div>

                                    {/* Chọn thời hạn chạy quảng cáo */}
                                    <hr className="my-3" />
                                    <h6 className="fw-bold mb-3"><i className="fa-regular fa-calendar-check me-1"></i> Thời hạn chạy quảng cáo</h6>
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label className="form-label">Từ ngày</label>
                                            <input 
                                                type="date" 
                                                className={`form-control ${configForm.errors.start_date ? 'is-invalid' : ''}`}
                                                value={configForm.data.start_date}
                                                onChange={e => configForm.setData('start_date', e.target.value)}
                                                min={getTodayString()}
                                            />
                                            {configForm.errors.start_date && <div className="invalid-feedback">{configForm.errors.start_date}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Đến ngày</label>
                                            <input 
                                                type="date" 
                                                className={`form-control ${configForm.errors.end_date ? 'is-invalid' : ''}`}
                                                value={configForm.data.end_date}
                                                onChange={e => configForm.setData('end_date', e.target.value)}
                                                min={configForm.data.start_date || getTodayString()}
                                            />
                                            {configForm.errors.end_date && <div className="invalid-feedback">{configForm.errors.end_date}</div>}
                                        </div>
                                    </div>
                                    <div className="form-text mt-2">Quảng cáo sẽ tự động chạy trong khoảng thời gian này và tự động tắt khi hết hạn.</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                    <button type="submit" className="btn btn-primary" disabled={configForm.processing}>
                                        {configForm.processing ? 'Đang lưu...' : 'Lưu cấu hình'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {actionType === 'topup' && (
                            <form onSubmit={submitTopUp}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Nạp tiền vào chiến dịch</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-muted mb-2">Khóa học: <strong>{selectedCourse?.title}</strong></p>
                                    <div className="alert alert-info mb-3">
                                        Số dư Ví khả dụng: <strong>{formatCurrency(wallet?.balance_available || 0)}</strong>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Số tiền nạp (VNĐ)</label>
                                        <input 
                                            type="number" 
                                            className={`form-control ${topUpForm.errors.amount ? 'is-invalid' : ''}`}
                                            value={topUpForm.data.amount}
                                            onChange={e => topUpForm.setData('amount', e.target.value)}
                                            min="10000"
                                            step="10000"
                                        />
                                        <div className="form-text">Số tiền này sẽ được trừ trực tiếp từ Ví điện tử của bạn vào ngân sách chiến dịch khóa học này.</div>
                                        {topUpForm.errors.amount && <div className="invalid-feedback">{topUpForm.errors.amount}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                    <button type="submit" className="btn btn-success" disabled={topUpForm.processing}>
                                        {topUpForm.processing ? 'Đang xử lý...' : 'Xác nhận nạp'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
