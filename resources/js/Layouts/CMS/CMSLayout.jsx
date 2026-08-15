import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function CMSLayout({ children }) {
    const { props } = usePage();
    const { auth } = props;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('cms-theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('cms-theme', theme);
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/CMS/css/cms-wow.css';
        link.id = 'wow-css-theme';
        
        if (!document.getElementById('wow-css-theme')) {
            document.head.appendChild(link);
        }

        return () => {
            if (document.getElementById('wow-css-theme')) {
                document.head.removeChild(document.getElementById('wow-css-theme'));
            }
        };
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="wow-layout">
            <div className="wow-blob wow-blob-1"></div>
            <div className="wow-blob wow-blob-2"></div>

            {/* Mobile Backdrop */}
            <div 
                className={`wow-sidebar-backdrop ${mobileSidebarOpen ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`wow-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
                <div className="wow-sidebar-header d-flex justify-content-between align-items-center">
                    <Link href={route('cms.page.index')} className="wow-logo">
                        EduFlow<span>CMS</span>
                    </Link>
                    <button 
                        className="wow-btn-icon d-lg-none" 
                        onClick={() => setMobileSidebarOpen(false)}
                        title="Đóng menu"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div className="wow-sidebar-menu">
                    <Link 
                        href={route('cms.page.index')} 
                        className={`wow-nav-link ${route().current('cms.page*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-layer-group"></i></span>
                        <span className="wow-nav-text">Quản lý Trang</span>
                    </Link>
                    
                    <Link 
                        href={route('cms.categories.index')} 
                        className={`wow-nav-link ${route().current('cms.categories*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-folder-tree"></i></span>
                        <span className="wow-nav-text">Danh mục Bài viết</span>
                    </Link>
                    
                    <Link 
                        href={route('cms.article.index')} 
                        className={`wow-nav-link ${route().current('cms.article*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-file-pen"></i></span>
                        <span className="wow-nav-text">Bài viết (Blog)</span>
                    </Link>
                    
                    <Link 
                        href={route('cms.faqs')} 
                        className={`wow-nav-link ${route().current('cms.faqs*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-circle-question"></i></span>
                        <span className="wow-nav-text">FAQ</span>
                    </Link>

                    <Link 
                        href={route('cms.topics.index')} 
                        className={`wow-nav-link ${route().current('cms.topics*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-tags"></i></span>
                        <span className="wow-nav-text">Chủ đề liên hệ</span>
                    </Link>
                    
                    <Link 
                        href={route('cms.media.index')} 
                        className={`wow-nav-link ${route().current('cms.media*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-images"></i></span>
                        <span className="wow-nav-text">Thư viện Ảnh</span>
                    </Link>
                    
                    <Link 
                        href={route('cms.menu.index')} 
                        className={`wow-nav-link ${route().current('cms.menu*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-sitemap"></i></span>
                        <span className="wow-nav-text">Cấu hình Menu</span>
                    </Link>
                    
                    <Link 
                        href={route('cms.settings.index')} 
                        className={`wow-nav-link ${route().current('cms.settings*') ? 'active' : ''}`}
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <span className="wow-nav-icon"><i className="fa-solid fa-gear"></i></span>
                        <span className="wow-nav-text">Cài đặt chung</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="wow-main">
                {/* Header */}
                <header className="wow-header">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            className="wow-btn-icon d-lg-none" 
                            onClick={() => setMobileSidebarOpen(true)}
                            title="Mở menu điều hướng"
                        >
                            <i className="fa-solid fa-bars fs-5"></i>
                        </button>
                        <h1 className="wow-title m-0 d-none d-md-block fs-4">Quản trị nội dung</h1>
                    </div>
                    
                    <div className="d-flex align-items-center gap-3">
                        {/* Quick Jump to Admin Dashboard */}
                        <Link 
                            href={route('admin.dashboard')} 
                            className="wow-btn-icon" 
                            title="Về Trang Quản Trị Hệ Thống (Admin Dashboard)"
                        >
                            <i className="fa-solid fa-gauge text-primary"></i>
                        </Link>

                        {/* Quick Jump to Client Web */}
                        <a 
                            href="/tech-education" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="wow-btn-icon" 
                            title="Xem trang web người dùng (Client)"
                        >
                            <i className="fa-solid fa-arrow-up-right-from-square text-info"></i>
                        </a>

                        {/* Theme Toggle */}
                        <button 
                            className="wow-btn-icon" 
                            onClick={toggleTheme}
                            title={`Chuyển sang giao diện ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
                        >
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-warning' : 'fa-moon text-primary'}`}></i>
                        </button>
                        
                        <div className="d-flex align-items-center gap-3 ms-2">
                            <img 
                                src={auth?.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'Admin')}&background=6366f1&color=fff`} 
                                alt="Admin" 
                                style={{ width: '40px', height: '40px', borderRadius: '12px' }}
                            />
                            <div className="d-none d-md-block" style={{ lineHeight: '1.2' }}>
                                <div style={{ fontWeight: 600, color: 'var(--wow-text)', fontSize: '0.95rem' }}>{auth?.user?.name || 'Administrator'}</div>
                                <div style={{ color: 'var(--wow-text-muted)', fontSize: '0.8rem' }}>Super Admin</div>
                            </div>
                        </div>
                        
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="wow-btn-icon text-danger"
                            title="Đăng xuất"
                            style={{ border: 'none', background: 'none' }}
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="wow-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

