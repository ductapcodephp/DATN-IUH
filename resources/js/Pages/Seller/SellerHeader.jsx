import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';

export default function SellerHeader({ onToggleMobileSidebar }) {
    const { auth, vip_packages } = usePage().props;
    const walletBalance = auth?.wallet?.balance_available || 0;
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const [unreadCount, setUnreadCount] = useState(auth?.unread_notifications_count || 0);

    useEffect(() => {
        setUnreadCount(auth?.unread_notifications_count || 0);
    }, [auth?.unread_notifications_count]);

    const handleMarkAsRead = () => {
        if (unreadCount > 0) {
            router.post(route('dashboard.notifications.mark-as-read'), {}, { preserveScroll: true, preserveState: true });
            setUnreadCount(0);
        }
    };

    return (
        <div className="topbar">
            {/* Hamburger Button for Mobile */}
            <button 
                className="topbar-icon-btn d-lg-none me-2" 
                onClick={onToggleMobileSidebar}
                title="Mở menu điều hướng"
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            <div className="topbar-brand d-none d-sm-block">
                Edu<span style={{ color: 'var(--fire, #EA580C)' }}>Flow</span>
                <span style={{ fontSize: '.65rem', color: 'var(--muted)', fontFamily: "'Inter', sans-serif", fontWeight: 400, marginLeft: '4px' }}>
                    Instructor
                </span>
            </div>
            
            <div className="topbar-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Tìm kiếm bài học, hóa đơn, coupon..." />
            </div>
            
            <div className="topbar-right d-flex align-items-center gap-2">
         

                {/* VIP Badge if active */}
                {auth?.sellerVipBadge && (
                    <div className="vip-badge-animated d-none d-md-flex" title={`Huy hiệu VIP: ${auth.sellerVipBadge}`}>
                        <i className="fa-solid fa-crown text-warning me-1"></i> {auth.sellerVipBadge}
                    </div>
                )}
                
                {/* Upgrade VIP Button */}
                <ShimmerButton 
                    href={route('seller.vip.index')}
                    background="linear-gradient(45deg, #f59e0b, #d97706)"
                    className="fw-bold px-3 py-1 text-white border-0 text-decoration-none d-none d-sm-inline-flex"
                    style={{ fontSize: '0.85rem' }}
                >
                    <i className="fa-solid fa-crown me-1 text-warning"></i> 
                    {auth?.isSellerVip ? 'Gia hạn VIP' : 'Nâng cấp VIP'}
                </ShimmerButton>
                
                {/* Wallet Balance */}
                <Link href={route('seller.revenues.index')} className="wallet-badge text-decoration-none" title="Xem ví & rút tiền">
                    <i className="fa-solid fa-wallet" style={{ color: 'var(--fire, #EA580C)' }}></i>
                    <span>{formatCurrency(walletBalance)}</span>
                </Link>


                    {/* Notification Dropdown */}
                    <div className="dropdown">
                        <button 
                            className="topbar-icon-btn me-2 dropdown-toggle" 
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ position: 'relative' }}
                        >
                            <i className="fa-solid fa-bell"></i>
                            {unreadCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        
                        <div className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-0" style={{ width: '340px', maxHeight: '450px', overflowY: 'auto' }}>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <h6 className="m-0 fw-bold">Thông báo</h6>
                                {unreadCount > 0 && (
                                    <button 
                                        className="btn btn-sm btn-link text-decoration-none p-0 text-primary fw-semibold" 
                                        onClick={handleMarkAsRead}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                            </div>
                            <div className="list-group list-group-flush">
                                {auth?.recent_notifications?.length > 0 ? (
                                    auth.recent_notifications.map(notification => (
                                        <Link 
                                            key={notification.id} 
                                            href={notification.data?.url || route('seller.notifications.index')}
                                            className={`list-group-item list-group-item-action py-3 text-decoration-none ${!notification.read_at ? 'bg-light' : ''}`}
                                        >
                                            <div className="d-flex align-items-start gap-3">
                                                <div className={`mt-1 ${notification.data?.color || 'text-primary'}`} style={{ fontSize: '1.1rem' }}>
                                                    <i className={notification.data?.icon?.includes('fa-') ? (notification.data.icon.startsWith('fa-solid') || notification.data.icon.startsWith('fa-regular') ? notification.data.icon : `fa-solid ${notification.data.icon}`) : 'fa-solid fa-bell'}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold mb-1 text-dark" style={{ fontSize: '0.88rem' }}>
                                                        {notification.data?.title || 'Thông báo mới'}
                                                        {!notification.read_at && (
                                                            <span className="badge bg-danger rounded-circle p-1 ms-2" style={{ width: '6px', height: '6px', display: 'inline-block' }}> </span>
                                                        )}
                                                    </div>
                                                    <div className="text-muted mb-1" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                                                        {notification.data?.message}
                                                    </div>
                                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {new Date(notification.created_at).toLocaleString('vi-VN')}
                                                    </small>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted">
                                        <i className="fa-regular fa-bell-slash fs-3 mb-2 text-secondary"></i>
                                        <p className="mb-0" style={{ fontSize: '0.85rem' }}>Không có thông báo mới</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-2 text-center border-top bg-light">
                                <Link 
                                    href={route('seller.notifications.index')} 
                                    className="text-decoration-none text-muted small fw-semibold"
                                >
                                    Xem tất cả lịch sử thông báo <i className="fa-solid fa-arrow-right ms-1"></i>
                                </Link>
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
    );
}
