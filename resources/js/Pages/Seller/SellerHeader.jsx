import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function SellerHeader() {
    const { auth, vip_packages } = usePage().props;
    const [showVipModal, setShowVipModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');

    const walletBalance = auth?.wallet?.balance_available || 0;
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const handleBuyVip = () => {
        if (!selectedPackage) {
            alert('Vui lòng chọn gói VIP');
            return;
        }
        
        router.post(route('seller.vip.buy'), {
            package_id: selectedPackage,
            payment_method: paymentMethod
        }, {
            onSuccess: () => setShowVipModal(false)
        });
    };

    return (
        <>
            <style>{`
                .vip-badge-animated {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: linear-gradient(90deg, #FFDF00, #D4AF37, #FFDF00, #D4AF37);
                    background-size: 300% 100%;
                    color: #fff;
                    font-weight: bold;
                    font-size: 0.85rem;
                    padding: 5px 15px;
                    border-radius: 20px;
                    animation: shine 3s infinite linear;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
                    margin-right: 15px;
                }
                
                @keyframes shine {
                    0% { background-position: 100% 0; }
                    100% { background-position: 0 0; }
                }
                
                .wallet-badge {
                    background: #f1f5f9;
                    color: #0f172a;
                    padding: 6px 15px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #e2e8f0;
                    margin-right: 15px;
                }

                .vip-package-card {
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .vip-package-card:hover {
                    border-color: #EA580C;
                }
                
                .vip-package-card.selected {
                    border-color: #EA580C;
                    background-color: #fff7ed;
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
                }
            `}</style>
            
            <div className="topbar">
                <div className="topbar-brand">
                    Edu<span>Flow</span>
                    <span style={{ fontSize: '.65rem', color: 'var(--muted)', fontFamily: "'Inter', sans-serif", fontWeight: 400, marginLeft: '4px' }}>
                        Instructor
                    </span>
                </div>
                <div className="topbar-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Tìm kiếm bài học, hóa đơn, coupon..." />
                </div>
                
                <div className="topbar-right d-flex align-items-center">
                    
                    {/* VIP Badge if active */}
                    {auth?.vip && (
                        <div className="vip-badge-animated">
                            <i className="fa-solid fa-crown"></i> VIP: {auth.vip.vip_package?.name || auth.vip.vipPackage?.name}
                        </div>
                    )}
                    
                    {/* Upgrade VIP Button */}
                    <button 
                        className="btn btn-warning fw-bold text-white me-3" 
                        style={{ borderRadius: '8px', padding: '6px 15px', background: 'linear-gradient(45deg, #f59e0b, #d97706)', border: 'none' }}
                        onClick={() => setShowVipModal(true)}
                    >
                        <i className="fa-solid fa-crown me-2"></i> 
                        {auth?.vip ? 'Gia hạn VIP' : 'Nâng cấp VIP'}
                    </button>
                    
                    {/* Wallet Balance */}
                    <div className="wallet-badge">
                        <i className="fa-solid fa-wallet text-secondary"></i>
                        <span>{formatCurrency(walletBalance)}</span>
                    </div>

                    <button className="topbar-icon-btn me-2">
                        <i className="fa-solid fa-bell"></i>
                        <span className="notif-dot"></span>
                    </button>

                    {/* Avatar Dropdown */}
                    <div className="dropdown">
                        <div 
                            className="topbar-avatar dropdown-toggle" 
                            role="button"
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style={{ cursor: 'pointer' }}
                        >
                            GV
                        </div>
                        
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" style={{ minWidth: '180px' }}>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2 py-2" href={route('seller.profile.edit')}>
                                    <i className="fa-regular fa-user text-muted"></i> Hồ sơ của tôi
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider opacity-50" /></li>
                            <li>
                                <Link 
                                    className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    type="button"
                                    style={{ width: '100%', textAlign: 'left' }}
                                >
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* VIP Purchase Modal */}
            {showVipModal && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }} onClick={() => setShowVipModal(false)}>
                        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                                <div className="modal-header border-bottom-0 pb-0">
                                    <h4 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-crown text-warning"></i> 
                                        Nâng cấp Đặc quyền Giảng viên
                                    </h4>
                                    <button type="button" className="btn-close" onClick={() => setShowVipModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">1. Chọn gói VIP phù hợp</h6>
                                        <div className="row g-3">
                                            {vip_packages?.map(pkg => (
                                                <div className="col-md-6" key={pkg.id}>
                                                    <div 
                                                        className={`vip-package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedPackage(pkg.id)}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <h5 className="fw-bold m-0">{pkg.name}</h5>
                                                            <span className="badge bg-warning text-dark">{pkg.duration_days} ngày</span>
                                                        </div>
                                                        <h4 className="text-primary fw-bold mb-3">{formatCurrency(pkg.price)}</h4>
                                                        <p className="text-muted small mb-0">
                                                            <i className="fa-solid fa-check text-success me-2"></i> {pkg.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!vip_packages || vip_packages.length === 0) && (
                                                <div className="col-12 text-center text-muted py-3">
                                                    Không có gói VIP nào khả dụng.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h6 className="fw-bold mb-3">2. Phương thức thanh toán</h6>
                                        <div className="d-flex gap-3 flex-wrap">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="payment" id="vnpay" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
                                                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="vnpay">
                                                    <i className="fa-solid fa-money-check-dollar text-success"></i> VNPAY
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="payment" id="stripe" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                                                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="stripe">
                                                    <i className="fa-brands fa-stripe text-primary"></i> Stripe
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="payment" id="wallet" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                                                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="wallet">
                                                    <i className="fa-solid fa-wallet text-secondary"></i> Ví EduFlow (Số dư: {formatCurrency(walletBalance)})
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
                                    <button type="button" className="btn btn-light" onClick={() => setShowVipModal(false)} style={{ borderRadius: '8px' }}>Hủy bỏ</button>
                                    <button 
                                        type="button" 
                                        className="btn btn-warning fw-bold text-white px-4" 
                                        style={{ borderRadius: '8px', background: 'linear-gradient(45deg, #f59e0b, #d97706)', border: 'none' }}
                                        onClick={handleBuyVip}
                                        disabled={!selectedPackage}
                                    >
                                        Thanh toán ngay
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
