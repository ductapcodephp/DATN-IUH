import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import '../../../css/admin-style.css'; 

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
                            <Link href={route('admin.dashboard')} className={`nav-link ${route().current('admin.dashboard*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-gauge"></i></span>
                                <span className="nav-text">Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.users')} className={`nav-link ${route().current('admin.users*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-users"></i></span>
                                <span className="nav-text">Người dùng</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.vip-packages')} className={`nav-link ${route().current('admin.vip-packages*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-crown"></i></span>
                                <span className="nav-text">Gói VIP</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.withdrawals')} className={`nav-link ${route().current('admin.withdrawals*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-money-bill-wave"></i></span>
                                <span className="nav-text">Rút tiền</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.reports')} className={`nav-link ${route().current('admin.reports*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-triangle-exclamation"></i></span>
                                <span className="nav-text">Báo cáo</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.contacts')} className={`nav-link ${route().current('admin.contacts*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-envelope"></i></span>
                                <span className="nav-text">Liên hệ</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.topics.index')} className={`nav-link ${route().current('admin.topics*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-tags"></i></span>
                                <span className="nav-text">Chủ đề</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.notifications.index')} className={`nav-link ${route().current('admin.notifications*') ? 'active' : ''}`}>
                                <span className="nav-icon"><i className="fa-solid fa-bell"></i></span>
                                <span className="nav-text">Thông báo</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={route('admin.settings')} className={`nav-link ${route().current('admin.settings*') ? 'active' : ''}`}>
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
                        <Link href={route('logout')} method="post" as="button" className="btn btn-icon text-muted ms-auto hover-glow" title="Đăng xuất">
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
                            <div className="position-relative cursor-pointer hover-glow-icon dropdown">
                                <div data-bs-toggle="dropdown" aria-expanded="false" onClick={handleMarkAsRead}>
                                    <i className="fa-regular fa-bell fs-4 text-dark transition-all"></i>
                                    {unreadCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white pulse-badge">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-4 p-0" style={{ width: '320px', overflow: 'hidden' }}>
                                    <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light">
                                        <h6 className="mb-0 fw-bold">Thông báo mới</h6>
                                        {unreadCount > 0 && (
                                            <Link href={route('dashboard.notifications.mark-as-read')} method="post" as="button" className="text-primary small fw-bold border-0 bg-transparent p-0">
                                                Đánh dấu đã đọc
                                            </Link>
                                        )}
                                    </div>
                                    <div className="p-0" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {auth?.recent_notifications?.length > 0 ? (
                                            auth.recent_notifications.map((notification, index) => (
                                                <Link href={notification.data.url || '#'} key={index} className="dropdown-item d-flex align-items-start gap-3 p-3 border-bottom text-wrap hover-bg-light">
                                                    <div className={`rounded-circle bg-${notification.data.color || 'primary'}-subtle text-${notification.data.color || 'primary'} d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '40px', height: '40px' }}>
                                                        <i className={`fa-solid ${notification.data.icon || 'fa-bell'}`}></i>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 fw-bold fs-6 text-dark">{notification.data.title}</p>
                                                        <p className="mb-0 small text-muted">{notification.data.message}</p>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="text-center p-4 text-muted">
                                                <i className="fa-regular fa-bell-slash fs-3 mb-2 opacity-50"></i>
                                                <p className="mb-0 small">Không có thông báo mới</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
