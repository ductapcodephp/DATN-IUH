import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout.jsx';
import NumberTicker from '@/Components/MagicUI/NumberTicker';
import MagicCard from '@/Components/MagicUI/MagicCard';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stats, recentEnrollments, chartData, weeklyChartData, currentFilter }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');
    
    // Hàm format tiền tệ
    const formatCurrency = (amount) => {
        if (!amount) return '0 đ';
        if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M đ';
        if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        router.get(route('seller.dashboard'), { filter }, { preserveState: true, replace: true });
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0, color: 'var(--fire, #EA580C)' }}>Doanh thu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Head title="Tổng quan - Kênh Người Bán" />

            <div className="page">
                <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                        <div className="page-title">Kênh Giảng Viên</div>
                        <div className="page-sub">Chào quay trở lại, {auth.user.name}! Hôm nay bạn có {stats?.newStudentsToday || 0} học viên mới đăng ký.</div>
                    </div>
                    <ShimmerButton 
                        href={route('seller.courses.create')} 
                        className="fw-bold px-4 py-2 text-white border-0 text-decoration-none shadow-sm"
                    >
                        <i className="fa-solid fa-plus me-2"></i> Tạo khóa học mới
                    </ShimmerButton>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{ padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', fontWeight: activeTab === 'overview' ? 'bold' : 'normal', color: activeTab === 'overview' ? 'var(--fire, #EA580C)' : 'var(--muted)', borderBottom: activeTab === 'overview' ? '2px solid var(--fire, #EA580C)' : '2px solid transparent' }}
                    >
                        Tổng quan
                    </button>
                    <button 
                        onClick={() => setActiveTab('analytics')}
                        style={{ padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', fontWeight: activeTab === 'analytics' ? 'bold' : 'normal', color: activeTab === 'analytics' ? 'var(--fire, #EA580C)' : 'var(--muted)', borderBottom: activeTab === 'analytics' ? '2px solid var(--fire, #EA580C)' : '2px solid transparent' }}
                    >
                        Phân tích Doanh thu
                    </button>
                </div>

                <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
                    {/* Grid Thống kê */}
                    <div className="stats-grid">
                        <MagicCard className="stat-card" gradientColor="rgba(234, 88, 12, 0.12)">
                            <div className="stat-card-icon" style={{ background: 'var(--fire-d)', color: 'var(--fire, #EA580C)' }}><i className="fa-solid fa-sack-dollar"></i></div>
                            <div className="stat-card-val text-dark">
                                <NumberTicker value={stats?.currentMonthRevenue || 0} /> <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>đ</span>
                            </div>
                            <div className="stat-card-label">Doanh thu tạm tính (Tháng này)</div>
                            <div className="stat-card-trend trend-up"><i className="fa-solid fa-arrow-trend-up"></i> Từ giao dịch thành công</div>
                            <div className="stat-card-line" style={{ background: 'var(--fire, #EA580C)' }}></div>
                        </MagicCard>

                        <MagicCard className="stat-card" gradientColor="rgba(14, 165, 233, 0.12)">
                            <div className="stat-card-icon" style={{ background: 'var(--accent-d)', color: 'var(--accent)' }}><i className="fa-solid fa-users"></i></div>
                            <div className="stat-card-val text-dark">
                                <NumberTicker value={stats?.totalStudents || 0} />
                            </div>
                            <div className="stat-card-label">Tổng học viên đăng ký</div>
                            <div className="stat-card-trend trend-up"><i className="fa-solid fa-arrow-trend-up"></i> +{stats?.newStudentsToday || 0} hôm nay</div>
                            <div className="stat-card-line" style={{ background: 'var(--accent)' }}></div>
                        </MagicCard>

                        <MagicCard className="stat-card" gradientColor="rgba(147, 51, 234, 0.12)">
                            <div className="stat-card-icon" style={{ background: 'var(--purple-d)', color: 'var(--purple)' }}><i className="fa-solid fa-book-bookmark"></i></div>
                            <div className="stat-card-val text-dark">
                                <NumberTicker value={stats?.activeCourses || 0} />
                            </div>
                            <div className="stat-card-label">Khóa học đang mở</div>
                            <div className="stat-card-trend"><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }}></i> Đang hoạt động</div>
                            <div className="stat-card-line" style={{ background: 'var(--purple)' }}></div>
                        </MagicCard>

                        <MagicCard className="stat-card" gradientColor="rgba(202, 138, 4, 0.12)">
                            <div className="stat-card-icon" style={{ background: 'var(--yellow-d)', color: 'var(--yellow)' }}><i className="fa-solid fa-star"></i></div>
                            <div className="stat-card-val text-dark">
                                <NumberTicker value={Number(stats?.avgRating || 0)} decimalPlaces={1} />
                            </div>
                            <div className="stat-card-label">Đánh giá trung bình</div>
                            <div className="stat-card-trend trend-up"><i className="fa-solid fa-arrow-trend-up"></i> ({stats?.totalReviews || 0} nhận xét)</div>
                            <div className="stat-card-line" style={{ background: 'var(--yellow)' }}></div>
                        </MagicCard>
                    </div>

                    {/* Biểu đồ & Đăng ký mới */}
                    <div className="charts-row">

                        <div className="card">
                            <div className="card-header">
                                <div><div className="card-title">Biến động doanh thu (7 ngày)</div><div className="card-sub">Cập nhật lúc {new Date().toLocaleTimeString()}</div></div>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '220px', paddingTop: '20px' }}>
                                    {activeTab === 'overview' && weeklyChartData && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={weeklyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(value)} width={80} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line type="monotone" dataKey="revenue" stroke="var(--fire)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div><div className="card-title">Học viên đăng ký mới</div><div className="card-sub">Cập nhật lúc {new Date().toLocaleTimeString()}</div></div>
                            </div>
                            <div className="card-body" style={{ padding: '10px 15px' }}>
                                {recentEnrollments && recentEnrollments.length > 0 ? (
                                    recentEnrollments.map((enrollment, index) => (
                                        <div key={index} style={{ padding: '12px 0', borderBottom: index < recentEnrollments.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{enrollment.student_name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Mua <i>{enrollment.course_title}</i></div>
                                            </div>
                                            <div style={{ color: 'var(--green)', fontWeight: 'bold' }}>+{formatCurrency(enrollment.price)}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                                        Chưa có học viên nào đăng ký.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'analytics' && (
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="card-title">Phân tích Doanh thu</div>
                                <div className="card-sub">Theo dõi tốc độ tăng trưởng doanh thu của bạn</div>
                            </div>
                            <div>
                                <select 
                                    className="form-control" 
                                    value={currentFilter} 
                                    onChange={handleFilterChange}
                                    style={{ width: '150px', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer' }}
                                >
                                    <option value="week">7 Ngày qua</option>
                                    <option value="month">30 Ngày qua</option>
                                    <option value="quarter">3 Tháng qua</option>
                                    <option value="year">12 Tháng qua</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{ height: '400px', paddingTop: '20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="name" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis tick={{ fontSize: 13 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(value)} width={100} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#eee', strokeWidth: 2 }} />
                                        <Line type="monotone" dataKey="revenue" stroke="var(--fire)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8, stroke: 'var(--fire)', strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// 🌟 3. KHAI BÁO BỘ KHUNG CỐ ĐỊNH Ở ĐÂY ĐỂ HOÀN TẤT SPA
Dashboard.layout = page => <SellerLayout children={page} />
