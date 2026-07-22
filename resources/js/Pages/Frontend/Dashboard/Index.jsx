import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/Frontend/DashboardLayout';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

function StatCard({ icon, iconColor, iconBg, label, value, sub }) {
    return (
        <div className="p-4 h-100 db-stat-card">
            <div className="d-flex align-items-center gap-3">
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <i className={icon} style={{ color: iconColor, fontSize: '1.2rem' }}></i>
                </div>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937', lineHeight: 1.2 }}>{value}</div>
                    {sub && <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{sub}</div>}
                </div>
            </div>
        </div>
    );
}

export default function DashboardIndex({ stats, wallet }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '/assets/frontend/img/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `/storage/${avatarPath}`;
    };

    return (
        <DashboardLayout title="Tổng quan" activeKey="index">

            {/* Greeting */}
            <div className="mb-4 p-4 p-md-5 db-greeting-card">
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '-20px',
                    width: '150px', height: '150px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }}></div>
                <div style={{ position: 'relative' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                            src={getAvatarUrl(user?.avatar)}
                            alt={user?.name}
                            className="rounded-circle object-fit-cover border border-3"
                            style={{ width: '56px', height: '56px', borderColor: 'rgba(255,255,255,0.5)' }}
                            onError={(e) => { e.target.src = '/assets/frontend/img/default-avatar.jpg'; }}
                        />
                        <div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Xin chào trở lại,</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{user?.name} 👋</h2>
                        </div>
                    </div>
                    <p style={{ opacity: 0.85, maxWidth: '500px', marginBottom: 0, lineHeight: 1.6 }}>
                        Hôm nay là một ngày tuyệt vời để tiếp tục hành trình học tập. Bạn đang tiến bộ rất tốt!
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <StatCard
                        icon="fa-solid fa-book-open"
                        iconColor="#EA580C"
                        iconBg="#fff7ed"
                        label="Đang học"
                        value={stats?.in_progress ?? 0}
                        sub="khóa học"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard
                        icon="fa-solid fa-circle-check"
                        iconColor="#16a34a"
                        iconBg="#dcfce7"
                        label="Đã hoàn thành"
                        value={stats?.completed ?? 0}
                        sub="khóa học"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard
                        icon="fa-solid fa-award"
                        iconColor="#d97706"
                        iconBg="#fef3c7"
                        label="Chứng chỉ"
                        value={stats?.completed ?? 0}
                        sub="đã nhận"
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div className="row g-3">
                <div className="col-12">
                    <h5 className="fw-bold mb-3" style={{ color: '#1F2937' }}>Truy cập nhanh</h5>
                </div>

                {[
                    { icon: 'fa-solid fa-graduation-cap', label: 'Khóa học của tôi', desc: `${(stats?.in_progress ?? 0) + (stats?.completed ?? 0)} khóa học`, color: '#EA580C', bg: '#fff7ed', route: 'dashboard.my-courses' },
                    { icon: 'fa-solid fa-receipt', label: 'Lịch sử đơn hàng', desc: `${stats?.total_orders ?? 0} đơn hàng`, color: '#0284C7', bg: '#e0f2fe', route: 'dashboard.orders' },
                    { icon: 'fa-solid fa-award', label: 'Chứng chỉ của tôi', desc: `${stats?.completed ?? 0} chứng chỉ`, color: '#d97706', bg: '#fef3c7', route: 'dashboard.certificates' },
                    { icon: 'fa-solid fa-user-pen', label: 'Hồ sơ cá nhân', desc: 'Cập nhật thông tin', color: '#64748b', bg: '#f1f5f9', route: 'dashboard.profile' },
                ].map((item, i) => (
                    <div key={i} className="col-6 col-md-6">
                        <Link
                            href={route(item.route)}
                            className="d-flex align-items-center gap-3 p-3 text-decoration-none db-quick-link"
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = item.color}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: item.bg, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', flexShrink: 0,
                            }}>
                                <i className={item.icon} style={{ color: item.color, fontSize: '1.1rem' }}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937' }}>{item.label}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.desc}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

        </DashboardLayout>
    );
}
