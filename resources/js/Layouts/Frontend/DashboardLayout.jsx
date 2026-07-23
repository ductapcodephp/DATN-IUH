import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Header from '@/Pages/Frontend/Header';
import Footer from '@/Pages/Frontend/Footer';
import SweetAlert from '@/Components/SweetAlert';
import { useEffect } from 'react';

const menuItems = [
    {
        key: 'index',
        label: 'Tổng quan',
        icon: 'fa-solid fa-gauge-high',
        route: 'dashboard.index',
    },
    {
        key: 'my-courses',
        label: 'Khóa học của tôi',
        icon: 'fa-solid fa-graduation-cap',
        route: 'dashboard.my-courses',
    },
    {
        key: 'certificates',
        label: 'Chứng chỉ',
        icon: 'fa-solid fa-award',
        route: 'dashboard.certificates',
    },
    {
        key: 'orders',
        label: 'Lịch sử đơn hàng',
        icon: 'fa-solid fa-receipt',
        route: 'dashboard.orders',
    },
    {
        key: 'profile',
        label: 'Hồ sơ cá nhân',
        icon: 'fa-solid fa-user-pen',
        route: 'dashboard.profile',
    },
    {
        key: 'wallet',
        label: 'Ví điện tử',
        icon: 'fa-solid fa-wallet',
        route: 'finance.wallet.index',
    },
    {
        key: 'bank-accounts',
        label: 'Tài khoản ngân hàng',
        icon: 'fa-solid fa-building-columns',
        route: 'finance.bank-accounts.index',
    },
    {
        key: 'vip',
        label: 'Nâng cấp VIP',
        icon: 'fa-solid fa-crown',
        route: 'dashboard.vip.index',
    },
];

export default function DashboardLayout({ children, title, activeKey }) {
    const { flash, auth } = usePage().props;
    const user = auth?.user;
    const [flashToast, setFlashToast] = useState({ show: false, type: 'success', title: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '/assets/frontend/img/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `/storage/${avatarPath}`;
    };

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setFlashToast({
                show: true,
                type: flash.success ? 'success' : 'error',
                title: flash.success || flash.error,
            });
        }
    }, [flash]);

    return (
        <>
            <Head title={`${title} - EduFlow`} />
            <link rel="stylesheet" href="/assets/frontend/css/frontend.css" />

            <SweetAlert
                show={flashToast.show}
                type="toast"
                icon={flashToast.type}
                title={flashToast.title}
                onClose={() => setFlashToast({ show: false, type: 'success', title: '' })}
            />

            <Header />

            <div className="db-main-container">
                <div className="container-fluid px-3 px-xl-5">
                    <div className="row g-0 py-4">

                        {/* Sidebar */}
                        <div className="col-lg-3 col-xl-2 mb-4 mb-lg-0">

                            {/* Mobile Toggle */}
                            <button
                                className="btn btn-outline-secondary d-lg-none w-100 mb-3 fw-medium"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                style={{ borderRadius: '10px' }}
                            >
                                <i className="fa-solid fa-bars me-2"></i>
                                Menu tài khoản
                            </button>

                            <div className={`db-sidebar-wrapper ${sidebarOpen ? 'd-block' : 'd-none d-lg-block'}`} style={{ minHeight: 'calc(100vh - 120px)' }}>
                                {/* User Info */}
                                <div className="db-user-info">
                                    <img
                                        src={getAvatarUrl(user?.avatar)}
                                        alt={user?.name}
                                        className="rounded-circle border border-3 border-white object-fit-cover mb-2"
                                        style={{ width: '64px', height: '64px' }}
                                        onError={(e) => { e.target.src = '/assets/frontend/img/default-avatar.jpg'; }}
                                    />
                                    <div className="text-white fw-bold" style={{ fontSize: '0.9rem' }}>{user?.name}</div>
                                    <div className="text-white opacity-75" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                                </div>

                                {/* Nav Links */}
                                <nav className="p-2">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={route(item.route)}
                                            className={`d-flex align-items-center gap-3 px-3 py-2 mb-1 fw-medium text-decoration-none rounded-3 db-sidebar-link ${activeKey === item.key ? 'active' : ''}`}
                                        >
                                            <i className={`${item.icon}`} style={{ width: '18px', textAlign: 'center' }}></i>
                                            {item.label}
                                        </Link>
                                    ))}

                                    <hr style={{ borderColor: '#e2e8f0', margin: '8px 0' }} />

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="d-flex align-items-center gap-3 px-3 py-2 fw-medium text-decoration-none rounded-3 w-100 border-0"
                                        style={{
                                            fontSize: '0.875rem',
                                            color: '#dc2626',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <i className="fa-solid fa-right-from-bracket" style={{ width: '18px', textAlign: 'center' }}></i>
                                        Đăng xuất
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9 col-xl-10 ps-lg-4">
                            {children}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
