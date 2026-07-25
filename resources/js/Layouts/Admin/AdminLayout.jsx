import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/admin-style.css'; 

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Ambient Background Blobs */}
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
            <div className="ambient-blob blob-3"></div>

            {/* Sidebar */}
            <aside className="sidebar glass-panel" id="sidebar" style={{ transform: sidebarOpen ? 'translateX(0)' : '' }}>
                <div className="sidebar-header">
                    <h3 className="sidebar-logo m-0 glow-text">EduFlow<span className="text-primary-glow">Admin</span></h3>
                    <button className="btn btn-icon sidebar-toggle d-lg-none text-white" onClick={toggleSidebar}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div className="sidebar-menu position-relative">
                    <div className="menu-indicator"></div>
                    <ul className="nav flex-column" id="sidebarNav">
                        <li className="nav-item">
                            <Link href="/admin/dashboard" className={`nav-link ${url.startsWith('/admin/dashboard') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-gauge"></i></span>
                                <span className="nav-text">Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/users" className={`nav-link ${url.startsWith('/admin/users') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-users"></i></span>
                                <span className="nav-text">Người dùng</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/vip-packages" className={`nav-link ${url.startsWith('/admin/vip-packages') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-crown"></i></span>
                                <span className="nav-text">Gói VIP</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/withdrawals" className={`nav-link ${url.startsWith('/admin/withdrawals') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-money-bill-wave"></i></span>
                                <span className="nav-text">Rút tiền</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/reports" className={`nav-link ${url.startsWith('/admin/reports') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-triangle-exclamation"></i></span>
                                <span className="nav-text">Báo cáo</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/contacts" className={`nav-link ${url.startsWith('/admin/contacts') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-envelope"></i></span>
                                <span className="nav-text">Liên hệ</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/settings" className={`nav-link ${url.startsWith('/admin/settings') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-gear"></i></span>
                                <span className="nav-text">Cài đặt</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                
                <div className="sidebar-footer">
                    <div className="user-profile-block d-flex align-items-center gap-3">
                        <div className="avatar-glow">
                            <img src="https://ui-avatars.com/api/?name=Super+Admin&background=4facfe&color=fff" alt="Avatar" className="rounded-circle" width="40" height="40" />
                        </div>
                        <div className="sidebar-footer-info overflow-hidden">
                            <div className="fw-bold text-truncate text-dark">Super Admin</div>
                            <div className="text-muted small text-truncate">Quản trị viên</div>
                        </div>
                        <Link href="/logout" method="post" as="button" className="btn btn-icon text-muted ms-auto hover-glow" title="Đăng xuất">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <main className="dashboard-wrapper main-wrapper" id="mainWrapper">
                {/* Topbar */}
                <header className="topbar">
                    <div className="d-flex align-items-center justify-content-between w-100 h-100">
                        <div className="d-flex align-items-center gap-3">
                            <button className="btn btn-icon text-dark d-lg-none" onClick={toggleSidebar}>
                                <i className="fa-solid fa-bars fs-4"></i>
                            </button>
                            <nav aria-label="breadcrumb" className="d-none d-md-block">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item text-muted">Admin</li>
                                    <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">Trang quản trị</li>
                                </ol>
                            </nav>
                        </div>
                        
                        <div className="d-flex align-items-center gap-4">
                            {/* Search */}
                            <div className="position-relative d-none d-md-block search-wrapper">
                                <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y"></i>
                                <input type="text" className="form-control glass-input" placeholder="Tìm kiếm..." />
                            </div>
                            
                            {/* Notifications */}
                            <div className="position-relative cursor-pointer hover-glow-icon">
                                <i className="fa-regular fa-bell fs-4 text-dark transition-all"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white pulse-badge">
                                    3
                                </span>
                            </div>
                            
                            {/* User Dropdown */}
                            <div className="d-flex align-items-center cursor-pointer avatar-glow">
                                <img src="https://ui-avatars.com/api/?name=Super+Admin&background=4facfe&color=fff" alt="User" className="rounded-circle" width="36" height="36" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                {children}
                
            </main>
        </div>
    );
}
