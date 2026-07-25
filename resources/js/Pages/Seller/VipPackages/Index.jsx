import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";

export default function VipPackages({ packages, activeSubscriptions }) {
    const { auth } = usePage().props;
    const walletBalance = auth?.wallet?.balance_available || 0;
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [activeTab, setActiveTab] = useState('all');

    const getActiveSub = (type) => activeSubscriptions?.find(sub => (sub.vip_package?.package_type || sub.vipPackage?.package_type) === type);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const handleBuyClick = (pkg) => {
        setSelectedPackage(pkg);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = () => {
        router.post(route('seller.vip.buy'), { 
            package_id: selectedPackage.id,
            payment_method: paymentMethod
        }, {
            onSuccess: () => setShowPaymentModal(false)
        });
    };

    return (
        <>
            <Head title="Nâng cấp gói VIP" />

            <div className="page">
                <div className="page-header">
                    <div className="page-title">Gói dịch vụ Seller VIP</div>
                    <div className="page-sub text-muted">Nâng cấp tài khoản để tận hưởng phí sàn thấp hơn và các đặc quyền ưu tiên</div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => setActiveTab('all')} 
                        style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'all' ? '2px solid #f97316' : '2px solid transparent', color: activeTab === 'all' ? '#f97316' : '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '-2px' }}
                    >
                        Tất cả gói
                    </button>
                    <button 
                        onClick={() => setActiveTab('commission')} 
                        style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'commission' ? '2px solid #f97316' : '2px solid transparent', color: activeTab === 'commission' ? '#f97316' : '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '-2px' }}
                    >
                        Gói VIP Phí Sàn
                    </button>
                    <button 
                        onClick={() => setActiveTab('storage')} 
                        style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'storage' ? '2px solid #f97316' : '2px solid transparent', color: activeTab === 'storage' ? '#f97316' : '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '-2px' }}
                    >
                        Gói Mua Dung Lượng
                    </button>
                    <button 
                        onClick={() => setActiveTab('combo')} 
                        style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'combo' ? '2px solid #f97316' : '2px solid transparent', color: activeTab === 'combo' ? '#f97316' : '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '-2px' }}
                    >
                        Gói Combo
                    </button>
                </div>

                {getActiveSub(activeTab) && (
                    <div className="alert alert-success mt-4 d-flex align-items-center gap-3" style={{ borderRadius: '12px', border: 'none', background: '#dcfce7', color: '#166534' }}>
                        <i className="fa-solid fa-crown fs-4 text-warning"></i>
                        <div>
                            <strong>Bạn đang sử dụng {getActiveSub(activeTab).vip_package?.name || getActiveSub(activeTab).vipPackage?.name}</strong>
                            <div style={{ fontSize: '0.85rem' }}>
                                Thời hạn: {new Date(getActiveSub(activeTab).starts_at).toLocaleDateString('vi-VN')} - {new Date(getActiveSub(activeTab).expires_at).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-4 mt-2">
                    {(activeTab === 'all' || activeTab === 'commission') && (
                        <div className="col-md-6 col-xl-4">
                            <div className="card h-100 position-relative overflow-hidden border-0" style={{ borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div className="position-absolute top-0 end-0 p-3 z-1">
                                    <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2 fw-bold">Mặc định</span>
                                </div>
                                <div className="card-body p-4 d-flex flex-column position-relative z-1 mt-3">
                                    <div className="d-flex align-items-center justify-content-center mb-3 gap-2">
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1"><i className="fa-solid fa-layer-group me-1"></i> commission</span>
                                    </div>
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold text-dark mb-2">Miễn phí</h4>
                                        <h2 className="fw-bold text-dark my-3">
                                            0<span className="fs-5 text-muted fw-normal">₫</span>
                                        </h2>
                                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fs-6">
                                            <i className="fa-solid fa-infinity text-muted me-2"></i> Vĩnh viễn
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4 flex-grow-1 bg-light rounded-4 p-3 border">
                                        <h6 className="fw-bold text-dark mb-3 fs-7 text-uppercase tracking-wide border-bottom pb-2">Đặc quyền bao gồm:</h6>
                                        <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                                            <li className="d-flex align-items-start gap-2">
                                                <i className="fa-solid fa-circle-check text-secondary fs-5 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-dark">Chiết khấu hoa hồng 20%</strong>
                                                    <small className="text-muted">Tính năng bán hàng cơ bản</small>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start gap-2 opacity-50">
                                                <i className="fa-solid fa-xmark text-danger fs-5 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-dark text-decoration-line-through">Huy hiệu ưu tiên</strong>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start gap-2 opacity-50">
                                                <i className="fa-solid fa-xmark text-danger fs-5 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-dark text-decoration-line-through">Thống kê nâng cao</strong>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="mt-auto pt-2">
                                        <button className="btn btn-light w-100 fw-bold border" disabled style={{ borderRadius: '8px', padding: '10px' }}>
                                            {!getActiveSub('commission') && !getActiveSub('combo') ? 'Gói hiện tại' : 'Gói mặc định'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {(activeTab === 'all' || activeTab === 'storage') && (
                        <div className="col-md-6 col-xl-4">
                            <div className="card h-100 position-relative overflow-hidden border-0" style={{ borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div className="position-absolute top-0 end-0 p-3 z-1">
                                    <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2 fw-bold">Mặc định</span>
                                </div>
                                <div className="card-body p-4 d-flex flex-column position-relative z-1 mt-3">
                                    <div className="d-flex align-items-center justify-content-center mb-3 gap-2">
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1"><i className="fa-solid fa-layer-group me-1"></i> storage</span>
                                    </div>
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold text-dark mb-2">Cơ bản</h4>
                                        <h2 className="fw-bold text-dark my-3">
                                            0<span className="fs-5 text-muted fw-normal">₫</span>
                                        </h2>
                                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fs-6">
                                            <i className="fa-solid fa-infinity text-muted me-2"></i> Vĩnh viễn
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4 flex-grow-1 bg-light rounded-4 p-3 border">
                                        <h6 className="fw-bold text-dark mb-3 fs-7 text-uppercase tracking-wide border-bottom pb-2">Đặc quyền bao gồm:</h6>
                                        <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                                            <li className="d-flex align-items-start gap-2">
                                                <i className="fa-solid fa-cloud text-secondary fs-5 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-dark">Dung lượng lưu trữ 5GB</strong>
                                                    <small className="text-muted">Tải lên Video cơ bản</small>
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-start gap-2">
                                                <i className="fa-solid fa-globe text-secondary fs-5 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-dark">Băng thông không giới hạn</strong>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="mt-auto pt-2">
                                        <button className="btn btn-light w-100 fw-bold border" disabled style={{ borderRadius: '8px', padding: '10px' }}>
                                            {!getActiveSub('storage') && !getActiveSub('combo') ? 'Gói hiện tại' : 'Gói mặc định'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danh sách các gói từ DB */}
                    <style>
                        {`
                        .btn-outline-fire {
                            border: 1px solid #f97316;
                            color: #f97316;
                            background: transparent;
                            transition: all 0.3s;
                        }
                        .btn-outline-fire:hover {
                            background: #fdba74;
                            color: #fff !important;
                            border-color: #fdba74;
                        }
                        `}
                    </style>
                    {packages.filter(pkg => activeTab === 'all' || pkg.package_type === activeTab).map((pkg) => {
                        const activeSub = getActiveSub(pkg.package_type);
                        const isBought = activeSub && (activeSub.vip_package_id === pkg.id || activeSub.vip_package?.id === pkg.id || activeSub.vipPackage?.id === pkg.id);

                        return (
                        <div key={pkg.id} className="col-md-6 col-xl-4">
                            <div className="card h-100 position-relative overflow-hidden border-0" style={{ 
                                borderRadius: '1rem', 
                                boxShadow: pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín') ? '0 10px 25px -5px rgba(234, 88, 12, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                border: pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín') ? '2px solid #EA580C' : 'none'
                            }}>
                                {pkg.badge_text && (
                                    <div className="position-absolute z-1" style={{ top: '20px', left: '-30px', transform: 'rotate(-45deg)', background: 'linear-gradient(45deg, #f97316, #ea580c)', color: '#fff', padding: '5px 40px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '12px' }}>
                                        {pkg.badge_text}
                                    </div>
                                )}
                                {(pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín')) && !pkg.badge_text && (
                                    <div className="position-absolute z-1" style={{ top: '20px', left: '-30px', transform: 'rotate(-45deg)', background: 'linear-gradient(45deg, #f97316, #ea580c)', color: '#fff', padding: '5px 40px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '12px' }}>
                                        HOT
                                    </div>
                                )}
                                
                                <div className="card-body p-4 d-flex flex-column position-relative z-1 mt-3">
                                    <div className="d-flex align-items-center justify-content-center mb-3 gap-2">
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1"><i className="fa-solid fa-layer-group me-1"></i> {pkg.package_type}</span>
                                    </div>
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold mb-2" style={{ color: (pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín')) ? '#EA580C' : '#0284c7' }}>
                                            {pkg.name}
                                        </h4>
                                        <h2 className="fw-bold text-dark my-3">
                                            {new Intl.NumberFormat('vi-VN').format(pkg.price)}<span className="fs-5 text-muted fw-normal">₫</span>
                                        </h2>
                                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fs-6">
                                            <i className="fa-regular fa-clock text-warning me-2"></i> {pkg.duration_days} ngày
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4 flex-grow-1 bg-light rounded-4 p-3 border">
                                        <h6 className="fw-bold text-dark mb-3 fs-7 text-uppercase tracking-wide border-bottom pb-2">Đặc quyền bao gồm:</h6>
                                        <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                                            {pkg.commission_rate > 0 && (
                                                <li className="d-flex align-items-start gap-2">
                                                    <i className="fa-solid fa-circle-check text-primary fs-5 mt-1" style={{color: '#f97316'}}></i>
                                                    <div>
                                                        <strong className="d-block text-dark">Chiết khấu hoa hồng {pkg.commission_rate}%</strong>
                                                        <small className="text-muted">Ưu đãi giảm phí sàn trên mỗi giao dịch</small>
                                                    </div>
                                                </li>
                                            )}
                                            {pkg.max_storage_gb > 0 && (
                                                <li className="d-flex align-items-start gap-2">
                                                    <i className="fa-solid fa-cloud text-info fs-5 mt-1" style={{color: '#0284c7'}}></i>
                                                    <div>
                                                        <strong className="d-block text-dark">Dung lượng lưu trữ {pkg.max_storage_gb}GB</strong>
                                                        <small className="text-muted">Không gian lưu trữ video, tài liệu</small>
                                                    </div>
                                                </li>
                                            )}
                                            {pkg.description && (
                                                <li className="d-flex align-items-start gap-2">
                                                    <i className="fa-solid fa-star text-warning fs-5 mt-1"></i>
                                                    <div className="text-muted fst-italic">"{pkg.description}"</div>
                                                </li>
                                            )}
                                            <li className="d-flex align-items-start gap-2">
                                                <i className="fa-solid fa-crown text-warning fs-5 mt-1"></i>
                                                <div>
                                                    <strong className="d-block text-dark">Huy hiệu {pkg.badge_text || pkg.name.split(' (')[0]}</strong>
                                                    <small className="text-muted">Hiển thị nổi bật trên gian hàng</small>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="mt-auto pt-2">
                                        <button 
                                            onClick={() => handleBuyClick(pkg)}
                                            className={`btn w-100 fw-bold ${(pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín')) ? 'btn-fire text-white' : 'btn-outline-fire'}`} 
                                            style={{ 
                                                borderRadius: '8px', 
                                                padding: '10px',
                                                background: (pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín')) ? 'linear-gradient(45deg, #f97316, #ea580c)' : '',
                                                border: (pkg.name.includes('Nâng Cao') || pkg.name.includes('Uy Tín')) ? 'none' : ''
                                            }}
                                        >
                                            {isBought ? 'Gia hạn thêm' : 'Mua gói này'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPackage && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }} onClick={() => setShowPaymentModal(false)}>
                        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                                <div className="modal-header border-bottom-0 pb-0">
                                    <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-credit-card text-primary"></i> 
                                        Thanh toán gói {selectedPackage.name}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="alert alert-info" style={{ borderRadius: '10px' }}>
                                        Tổng thanh toán: <strong>{formatCurrency(selectedPackage.price)}</strong>
                                    </div>
                                    <h6 className="fw-bold mb-3 mt-4">Chọn phương thức thanh toán</h6>
                                    <div className="d-flex flex-column gap-3">
                                        <div className={`card ${paymentMethod === 'vnpay' ? 'border-primary' : 'border-light'} shadow-sm`} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setPaymentMethod('vnpay')}>
                                            <div className="card-body d-flex align-items-center gap-3 p-3">
                                                <input className="form-check-input m-0" type="radio" checked={paymentMethod === 'vnpay'} readOnly />
                                                <i className="fa-solid fa-money-check-dollar fs-4 text-success"></i>
                                                <div className="fw-bold">Thanh toán qua VNPAY</div>
                                            </div>
                                        </div>
                                        <div className={`card ${paymentMethod === 'stripe' ? 'border-primary' : 'border-light'} shadow-sm`} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setPaymentMethod('stripe')}>
                                            <div className="card-body d-flex align-items-center gap-3 p-3">
                                                <input className="form-check-input m-0" type="radio" checked={paymentMethod === 'stripe'} readOnly />
                                                <i className="fa-brands fa-stripe fs-4 text-primary"></i>
                                                <div className="fw-bold">Thanh toán qua Stripe</div>
                                            </div>
                                        </div>
                                        <div className={`card ${paymentMethod === 'wallet' ? 'border-primary' : 'border-light'} shadow-sm`} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setPaymentMethod('wallet')}>
                                            <div className="card-body d-flex align-items-center gap-3 p-3">
                                                <input className="form-check-input m-0" type="radio" checked={paymentMethod === 'wallet'} readOnly />
                                                <i className="fa-solid fa-wallet fs-4 text-secondary"></i>
                                                <div>
                                                    <div className="fw-bold">Ví điện tử hệ thống</div>
                                                    <div className="text-muted small">Số dư: {formatCurrency(walletBalance)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
                                    <button type="button" className="btn btn-light" onClick={() => setShowPaymentModal(false)} style={{ borderRadius: '8px' }}>Hủy bỏ</button>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary fw-bold px-4" 
                                        style={{ borderRadius: '8px' }}
                                        onClick={handleConfirmPayment}
                                    >
                                        Xác nhận thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

VipPackages.layout = page => <SellerLayout children={page} />
