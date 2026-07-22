import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";

export default function VipPackages({ packages, currentSubscription }) {
    const { auth } = usePage().props;
    const walletBalance = auth?.wallet?.balance_available || 0;
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');

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

                {currentSubscription && (
                    <div className="alert alert-success mt-4 d-flex align-items-center gap-3" style={{ borderRadius: '12px', border: 'none', background: '#dcfce7', color: '#166534' }}>
                        <i className="fa-solid fa-crown fs-4 text-warning"></i>
                        <div>
                            <strong>Bạn đang sử dụng gói {currentSubscription.vip_package?.name || currentSubscription.vipPackage?.name}</strong>
                            <div style={{ fontSize: '0.85rem' }}>
                                Thời hạn: {new Date(currentSubscription.starts_at).toLocaleDateString('vi-VN')} - {new Date(currentSubscription.expires_at).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-4 mt-2">
                    {/* Gói Free (Mặc định) */}
                    <div className="col-md-4">
                        <div className="card h-100" style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div className="card-body p-4 text-center">
                                <h4 className="fw-bold text-secondary">Miễn phí</h4>
                                <div className="display-6 fw-bold my-3 text-dark">0đ <span className="fs-6 text-muted fw-normal">/tháng</span></div>
                                <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Hoa hồng chiết khấu 15%</p>
                                
                                <ul className="list-unstyled text-start mb-4" style={{ fontSize: '0.9rem', color: '#475569' }}>
                                    <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Không thu phí Upload video</li>
                                    <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Không giới hạn số khóa học</li>
                                    <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Tính năng bán hàng cơ bản</li>
                                    <li className="mb-2 text-muted text-decoration-line-through"><i className="fa-solid fa-xmark me-2"></i>Huy hiệu ưu tiên</li>
                                    <li className="mb-2 text-muted text-decoration-line-through"><i className="fa-solid fa-xmark me-2"></i>Thống kê nâng cao</li>
                                </ul>
                                
                                <button className="btn btn-outline-secondary w-100" disabled style={{ borderRadius: '8px' }}>
                                    {(!currentSubscription || (currentSubscription.vip_package?.name || currentSubscription.vipPackage?.name) === 'Free') ? 'Gói hiện tại' : 'Gói mặc định'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách các gói từ DB */}
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="col-md-4">
                            <div className="card h-100 position-relative" style={{ 
                                borderRadius: '16px', 
                                border: pkg.name === 'Business' ? '2px solid #EA580C' : '1px solid #e2e8f0',
                                boxShadow: pkg.name === 'Business' ? '0 10px 25px -5px rgba(234, 88, 12, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}>
                                {pkg.name === 'Business' && (
                                    <span className="badge bg-fire position-absolute top-0 start-50 translate-middle" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '20px' }}>
                                        PHỔ BIẾN NHẤT
                                    </span>
                                )}
                                
                                <div className="card-body p-4 text-center">
                                    <h4 className="fw-bold" style={{ color: pkg.name === 'Business' ? '#EA580C' : '#0284c7' }}>
                                        {pkg.name === 'Business' && <i className="fa-solid fa-fire me-2"></i>}
                                        {pkg.name}
                                    </h4>
                                    <div className="display-6 fw-bold my-3 text-dark">
                                        {formatCurrency(pkg.price).replace(' ₫', 'đ')} <span className="fs-6 text-muted fw-normal">/{pkg.duration_days} ngày</span>
                                    </div>
                                    <p className="text-muted mb-4" style={{ fontSize: '0.9rem', height: '40px' }}>{pkg.description}</p>
                                    
                                    <ul className="list-unstyled text-start mb-4" style={{ fontSize: '0.9rem', color: '#475569' }}>
                                        <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Hoa hồng chiết khấu siêu rẻ</li>
                                        <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Tất cả tính năng của gói Free</li>
                                        <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Ưu tiên hiển thị Top Search</li>
                                        <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Badge {pkg.name} xịn xò</li>
                                        {pkg.name === 'Business' && (
                                            <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Banner quảng cáo riêng & CSKH VIP</li>
                                        )}
                                    </ul>
                                    
                                    <button 
                                        onClick={() => handleBuyClick(pkg)}
                                        className={`btn w-100 fw-bold ${pkg.name === 'Business' ? 'btn-fire text-white' : 'btn-outline-primary'}`} 
                                        style={{ borderRadius: '8px', padding: '10px' }}
                                    >
                                        Mua gói này
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
