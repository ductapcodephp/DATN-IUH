import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function CMSLayout({ children }) {
    const { props } = usePage();
    const { auth } = props;
    
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

            {/* Sidebar */}
            <aside className="wow-sidebar">
                <div className="wow-sidebar-header">
                    <Link href={route('cms.page.index')} className="wow-logo">
                        EduFlow<span>CMS</span>
                    </Link>
                </div>
                
                <div className="wow-sidebar-menu">
                    <Link href={route('cms.page.index')} className={`wow-nav-link ${route().current('cms.page*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-layer-group"></i></span>
                        <span className="wow-nav-text">Quản lý Trang</span>
                    </Link>
                    
                    <Link href={route('cms.categories.index')} className={`wow-nav-link ${route().current('cms.categories*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-folder-tree"></i></span>
                        <span className="wow-nav-text">Danh mục Bài viết</span>
                    </Link>
                    
                    <Link href={route('cms.article.index')} className={`wow-nav-link ${route().current('cms.article*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-file-pen"></i></span>
                        <span className="wow-nav-text">Bài viết (Blog)</span>
                    </Link>
                    
                    <Link href={route('cms.faqs')} className={`wow-nav-link ${route().current('cms.faqs*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-circle-question"></i></span>
                        <span className="wow-nav-text">FAQ</span>
                    </Link>
                    
                    <Link href={route('cms.topics.index')} className={`wow-nav-link ${route().current('cms.topics*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-tags"></i></span>
                        <span className="wow-nav-text">Quản lý Chủ đề</span>
                    </Link>
                    
                    <Link href={route('cms.media.index')} className={`wow-nav-link ${route().current('cms.media*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-images"></i></span>
                        <span className="wow-nav-text">Thư viện Ảnh</span>
                    </Link>
                    
                    <Link href={route('cms.menu.index')} className={`wow-nav-link ${route().current('cms.menu*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-sitemap"></i></span>
                        <span className="wow-nav-text">Cấu hình Menu</span>
                    </Link>
                    
                    <Link href={route('cms.settings.index')} className={`wow-nav-link ${route().current('cms.settings*') ? 'active' : ''}`}>
                        <span className="wow-nav-icon"><i className="fa-solid fa-gear"></i></span>
                        <span className="wow-nav-text">Cài đặt chung</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="wow-main">
                {/* Header */}
                <header className="wow-header">
                    <h1 className="wow-title m-0 d-none d-md-block fs-4">Quản trị nội dung</h1>
                    <div className="d-flex align-items-center gap-4">
                        <button 
                            className="wow-btn-icon" 
                            onClick={toggleTheme}
                            title={`Chuyển sang giao diện ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
                        >
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-warning' : 'fa-moon text-primary'}`}></i>
                        </button>
                        
                        
                        <div className="d-flex align-items-center gap-3">
                            <img 
                                src={auth?.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'Admin')}&background=6366f1&color=fff`} 
                                alt="Admin" 
                                style={{ width: '45px', height: '45px', borderRadius: '12px' }}
                            />
                            <div className="d-none d-md-block" style={{ lineHeight: '1.2' }}>
                                <div style={{ fontWeight: 600, color: 'var(--wow-text)', fontSize: '1rem' }}>{auth?.user?.name || 'Administrator'}</div>
                                <div style={{ color: 'var(--wow-text-muted)', fontSize: '0.85rem' }}>Super Admin</div>
                            </div>
                        </div>
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
