import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function SellerHeader() {
    const { auth, vip_packages } = usePage().props;
    const walletBalance = auth?.wallet?.balance_available || 0;
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

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
                            <i className="fa-solid fa-crown"></i> {auth.sellerVipBadge || auth.vip.vip_package?.badge_text || auth.vip.vipPackage?.badge_text || auth.vip.vip_package?.name || auth.vip.vipPackage?.name}
                        </div>
                    )}
                    
                    {/* Upgrade VIP Button */}
                    <Link 
                        className="btn btn-warning fw-bold text-white me-3" 
                        style={{ borderRadius: '8px', padding: '6px 15px', background: 'linear-gradient(45deg, #f59e0b, #d97706)', border: 'none' }}
                        href={route('seller.vip.index')}
                    >
                        <i className="fa-solid fa-crown me-2"></i> 
                        {auth?.vip ? 'Gia hạn VIP' : 'Nâng cấp VIP'}
                    </Link>
                    
                    {/* Wallet Balance */}
                    <div className="wallet-badge">
                        <i className="fa-solid fa-wallet text-secondary"></i>
                        <span>{formatCurrency(walletBalance)}</span>
                    </div>

                    {/* Notification Dropdown */}
                    <div className="dropdown">
                        <button 
                            className="topbar-icon-btn me-2 dropdown-toggle" 
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ position: 'relative' }}
                        >
                            <i className="fa-solid fa-bell"></i>
                            {auth?.unread_notifications_count > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                    {auth.unread_notifications_count}
                                </span>
                            )}
                        </button>
                        
                        <div className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0" style={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <h6 className="m-0 fw-bold">Thông báo</h6>
                                {auth?.unread_notifications_count > 0 && (
                                    <button 
                                        className="btn btn-sm btn-link text-decoration-none p-0" 
                                        onClick={() => router.post(route('notifications.mark-as-read'))}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                            </div>
                            <div className="list-group list-group-flush">
                                {auth?.unread_notifications?.length > 0 ? (
                                    auth.unread_notifications.map(notification => (
                                        <div key={notification.id} className="list-group-item list-group-item-action py-3">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className={`mt-1 ${notification.data.color}`}>
                                                    <i className={notification.data.icon}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{notification.data.title}</div>
                                                    <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{notification.data.message}</div>
                                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {new Date(notification.created_at).toLocaleString('vi-VN')}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted">
                                        <i className="fa-regular fa-bell-slash fs-3 mb-2"></i>
                                        <p className="mb-0" style={{ fontSize: '0.85rem' }}>Không có thông báo mới</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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

        </>
    );
}
