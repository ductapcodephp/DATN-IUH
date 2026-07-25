import React from 'react';
import { Link } from '@inertiajs/react';

export default function SellerSidebar() {
    return (
        <div className="sidebar">
            <div style={{ height: '8px' }}></div>

            <div className="sidebar-section">Giảng dạy</div>

            <Link
                className={`nav-item ${route().current('seller.dashboard') ? 'active' : ''}`}
                href={route('seller.dashboard')}
            >
                <i className="fa-solid fa-gauge-high"></i> Tổng quan
            </Link>

            <Link
                className={`nav-item ${route().current('seller.courses.index') ? 'active' : ''}`}
                href={route('seller.courses.index')}
            >
                <i className="fa-solid fa-book-open"></i> Quản lý khóa học <span className="nav-badge">3</span>
            </Link>


            <Link
                className={`nav-item ${route().current('seller.students.index') ? 'active' : ''}`}
                href={route('seller.students.index')}
            >
                <i className="fa-solid fa-graduation-cap"></i> Học viên của tôi
            </Link>


            <div className="sidebar-section">Tài chính & Tiếp thị</div>


            <Link
                className={`nav-item ${route().current('seller.vip.index') ? 'active' : ''}`}
                href={route('seller.vip.index')}
            >
                <i className="fa-solid fa-crown text-warning"></i> Nâng cấp VIP
            </Link>

            <Link
                className={`nav-item ${route().current('seller.revenues.index') ? 'active' : ''}`}
                href={route('seller.revenues.index')}
            >
                <i className="fa-solid fa-money-bill-transfer"></i> Ví tiền & Quản lý rút tiền
            </Link>

            <Link
                className={`nav-item ${route().current('seller.coupons.index') ? 'active' : ''}`}
                href={route('seller.coupons.index')}
            >
                <i className="fa-solid fa-ticket"></i> Mã giảm giá
            </Link>


            <div className="sidebar-section mt-4">Khu vực cài đặt</div>

            <Link
                className={`nav-item ${route().current('finance.wallet.index') ? 'active' : ''}`}
                href={route('finance.wallet.index')}
            >
                <i className="fa-solid fa-wallet"></i> Ví điện tử
            </Link>

            <Link
                className={`nav-item ${route().current('finance.bank-accounts.index') ? 'active' : ''}`}
                href={route('finance.bank-accounts.index')}
            >
                <i className="fa-solid fa-building-columns"></i> Tài khoản ngân hàng
            </Link>

            <Link
                className={`nav-item ${route().current('seller.profile.edit') ? 'active' : ''}`}
                href={route('seller.profile.edit')}
            >
                <i className="fa-regular fa-user"></i> Hồ sơ & Bảo mật
            </Link>

            <Link
                className={`nav-item ${route().current('seller.profile.notifications') ? 'active' : ''}`}
                href={route('seller.profile.notifications')}
            >
                <i className="fa-regular fa-bell"></i> Cài đặt thông báo
            </Link>

            {/* 👇 THAY ĐỔI Ở ĐÂY: Thêm class dropup vào container dưới đáy */}
            <div className="sidebar-bottom dropup">
                <div
                    className="sidebar-user dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                >
                    <div className="su-av">GV</div>
                    <div>
                        <div className="su-name">Instructor Tuấn</div>
                        <div className="su-role">Đối tác Kim Cương</div>
                    </div>
                    <i className="fa-solid fa-ellipsis" style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '.8rem' }}></i>
                </div>

                {/* Menu xổ ngược lên trên */}
                <ul className="dropdown-menu w-100 shadow border-0 mb-2">
                    <li><Link className="dropdown-item" href={route('seller.profile.edit')}><i className="ri-user-settings-line me-2"></i> Hồ sơ</Link></li>
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
    );
}
