import React from 'react';
import { Link } from '@inertiajs/react';

export default function SellerHeader() {
    return (
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
            <div className="topbar-right">
                <button className="topbar-icon-btn">
                    <i className="fa-solid fa-bell"></i>
                    <span className="notif-dot"></span>
                </button>

                {/* 👇 Bọc cụm Dropdown bằng class dropdown của Bootstrap */}
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
                            <Link className="dropdown-item d-flex align-items-center gap-2 py-2" href={route('profile.edit')}>
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