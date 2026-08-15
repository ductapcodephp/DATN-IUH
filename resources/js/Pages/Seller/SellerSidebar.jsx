import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SellerSidebar({ isOpen, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const avatarInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'GV';

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Sidebar Brand Header (Mobile & Desktop) */}
            <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2 border-bottom">
                <Link href={route('seller.dashboard')} className="text-decoration-none d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                        Edu<span style={{ color: 'var(--fire, #EA580C)' }}>Flow</span>
                    </span>
                    <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '0.65rem' }}>
                        Instructor
                    </span>
                </Link>
                <button 
                    className="btn btn-sm btn-light d-lg-none rounded-circle border-0 text-muted" 
                    onClick={onClose}
                    title="Đóng menu"
                    style={{ width: '32px', height: '32px' }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div style={{ height: '8px' }}></div>

            <div className="sidebar-section">Giảng dạy</div>

            <Link
                className={`nav-item ${route().current('seller.dashboard') ? 'active' : ''}`}
                href={route('seller.dashboard')}
                onClick={onClose}
            >
                <i className="fa-solid fa-gauge-high"></i> Tổng quan
            </Link>

            <Link
                className={`nav-item ${route().current('seller.courses.index') ? 'active' : ''}`}
                href={route('seller.courses.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-book-open"></i> Quản lý khóa học
            </Link>

            <Link
                className={`nav-item ${route().current('seller.students.index') ? 'active' : ''}`}
                href={route('seller.students.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-graduation-cap"></i> Học viên của tôi
            </Link>


            <div className="sidebar-section">Tài chính & Tiếp thị</div>

            <Link
                className={`nav-item ${route().current('seller.vip.index') ? 'active' : ''}`}
                href={route('seller.vip.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-crown text-warning"></i> Nâng cấp VIP
            </Link>

            <Link
                className={`nav-item ${route().current('seller.revenues.index') ? 'active' : ''}`}
                href={route('seller.revenues.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-money-bill-transfer"></i> Ví tiền & Quản lý rút tiền
            </Link>

            <Link
                className={`nav-item ${route().current('seller.coupons.index') ? 'active' : ''}`}
                href={route('seller.coupons.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-ticket"></i> Mã giảm giá
            </Link>

            <Link
                className={`nav-item ${route().current('seller.ads.index') ? 'active' : ''}`}
                href={route('seller.ads.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-rectangle-ad text-primary"></i> Đăng ký ADS
            </Link>


            <div className="sidebar-section mt-4">Khu vực cài đặt</div>

            <Link
                className={`nav-item ${route().current('finance.wallet.index') ? 'active' : ''}`}
                href={route('finance.wallet.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-wallet"></i> Ví điện tử
            </Link>

            <Link
                className={`nav-item ${route().current('finance.bank-accounts.index') ? 'active' : ''}`}
                href={route('finance.bank-accounts.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-building-columns"></i> Tài khoản ngân hàng
            </Link>

            <Link
                className={`nav-item ${route().current('seller.profile.edit') ? 'active' : ''}`}
                href={route('seller.profile.edit')}
                onClick={onClose}
            >
                <i className="fa-regular fa-user"></i> Hồ sơ & Bảo mật
            </Link>

            <Link
                className={`nav-item ${route().current('seller.profile.notifications') ? 'active' : ''}`}
                href={route('seller.profile.notifications')}
                onClick={onClose}
            >
                <i className="fa-regular fa-bell"></i> Cài đặt thông báo
            </Link>

            <Link
                className={`nav-item ${route().current('seller.notifications.index') ? 'active' : ''}`}
                href={route('seller.notifications.index')}
                onClick={onClose}
            >
                <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử thông báo
            </Link>

            <div className="sidebar-bottom dropup mt-auto">
                <div
                    className="sidebar-user dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                >
                    <div className="su-av" style={{ background: 'var(--fire, #EA580C)', color: '#fff', fontWeight: 'bold' }}>
                        {avatarInitials}
                    </div>
                    <div className="text-truncate pe-2">
                        <div className="su-name text-truncate">{user?.name || 'Giảng viên'}</div>
                        <div className="su-role text-truncate">{auth?.sellerVipBadge || 'Đối tác Giảng viên'}</div>
                    </div>
                    <i className="fa-solid fa-ellipsis" style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '.8rem' }}></i>
                </div>

                <ul className="dropdown-menu w-100 shadow border-0 mb-2">
                    <li><Link className="dropdown-item" href={route('seller.profile.edit')}><i className="fa-regular fa-user me-2"></i> Hồ sơ</Link></li>
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
        </aside>
    );
}

