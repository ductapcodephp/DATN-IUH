import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function Dashboard({ stats, currentDays = 30 }) {
    const [days, setDays] = useState(currentDays);
    const [activeTab, setActiveTab] = useState('small');
    
    const [chartFilter, setChartFilter] = useState('week');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const [chartDataState, setChartDataState] = useState({
        labels: stats?.revenueChart?.labels || [],
        datasets: [{
            fill: true,
            label: 'Doanh thu',
            data: stats?.revenueChart?.data || [],
            borderColor: 'rgba(234, 88, 12, 1)',
            backgroundColor: 'rgba(234, 88, 12, 0.1)',
            tension: 0.4,
            pointBackgroundColor: 'rgba(234, 88, 12, 1)',
        }],
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                let url = `/admin/dashboard/chart-data?type=${chartFilter}`;
                if (chartFilter === 'custom') {
                    if (!startDate || !endDate) return;
                    url += `&start_date=${startDate}&end_date=${endDate}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                
                setChartDataState({
                    labels: data.labels || [],
                    datasets: [{
                        fill: true,
                        label: 'Doanh thu',
                        data: data.data || [],
                        borderColor: 'rgba(234, 88, 12, 1)',
                        backgroundColor: 'rgba(234, 88, 12, 0.1)',
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(234, 88, 12, 1)',
                    }],
                });
            } catch (error) {
                console.error("Failed to fetch chart data:", error);
            }
        };
        
        if (activeTab === 'large') {
            fetchChartData();
        }
    }, [chartFilter, startDate, endDate, activeTab]);

    const handleDaysChange = (e) => {
        setDays(e.target.value);
        router.get(route('admin.dashboard'), { days: e.target.value }, { preserveState: true, preserveScroll: true });
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) return (value / 1000000) + ' Tr';
                        if (value >= 1000) return (value / 1000) + ' K';
                        return value;
                    }
                }
            }
        }
    };



    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="content-area">
                {activeTab === 'small' && (
                    <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up mb-3">
                        <h3 className="m-0 fw-bold text-dark">Tổng quan hệ thống</h3>
                        <button className="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                            <i className="fa-solid fa-wand-magic-sparkles me-2"></i>Xuất báo cáo
                        </button>
                    </div>
                )}

                {/* TABS NATIVE BOOTSTRAP FOR CHARTS */}
                <ul className="nav nav-pills mb-4 stagger-fade-up" id="dashboardTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link rounded-pill fw-bold ${activeTab === 'small' ? 'active bg-primary' : 'text-dark'}`} onClick={() => setActiveTab('small')} type="button" role="tab">
                            <i className="fa-solid fa-chart-pie me-2"></i>Chế độ xem gọn
                        </button>
                    </li>
                    <li className="nav-item ms-2" role="presentation">
                        <button className={`nav-link rounded-pill fw-bold ${activeTab === 'large' ? 'active bg-primary' : 'text-dark'}`} onClick={() => setActiveTab('large')} type="button" role="tab">
                            <i className="fa-solid fa-chart-line me-2"></i>Chế độ xem rộng
                        </button>
                    </li>
                </ul>

                {activeTab === 'small' && (
                    <div className="stat-cards-row stagger-fade-up">
                        <div className="stagger-fade-up">
                            <div className="card stat-card glass-card border-0" data-color="--primary-glow">
                                <div className="card-body position-relative overflow-hidden">
                                    <div className="glow-bg bg-primary-glow"></div>
                                    <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                        <div className="stat-icon icon-primary">
                                            <i className="fa-solid fa-wallet"></i>
                                        </div>
                                        <span className="badge glass-badge-success fw-bold rounded-pill bounce-in">
                                            <i className="fa-solid fa-arrow-trend-up me-1"></i>12%
                                        </span>
                                    </div>
                                    <div className="text-muted fw-medium mb-1 position-relative z-1">Tổng doanh thu (VNĐ)</div>
                                    <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1"><span className="count-up" data-value={stats?.totalRevenue || 0}>{new Intl.NumberFormat('vi-VN').format(stats?.totalRevenue || 0)}</span> ₫</h2>
                                </div>
                            </div>
                        </div>

                        <div className="stagger-fade-up">
                            <div className="card stat-card glass-card border-0" data-color="--success-glow">
                                <div className="card-body position-relative overflow-hidden">
                                    <div className="glow-bg bg-success-glow"></div>
                                    <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                        <div className="stat-icon icon-success">
                                            <i className="fa-solid fa-user-graduate"></i>
                                        </div>
                                        <span className="badge glass-badge-success fw-bold rounded-pill bounce-in" style={{ animationDelay: '0.1s' }}>
                                            <i className="fa-solid fa-arrow-trend-up me-1"></i>8%
                                        </span>
                                    </div>
                                    <div className="text-muted fw-medium mb-1 position-relative z-1">Tổng học sinh</div>
                                    <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1 count-up" data-value={stats?.totalStudents || 0}>{new Intl.NumberFormat('vi-VN').format(stats?.totalStudents || 0)}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="stagger-fade-up">
                            <div className="card stat-card glass-card border-0" data-color="--warning-glow">
                                <div className="card-body position-relative overflow-hidden">
                                    <div className="glow-bg bg-warning-glow"></div>
                                    <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                        <div className="stat-icon icon-warning">
                                            <i className="fa-solid fa-chalkboard-user"></i>
                                        </div>
                                        <span className="badge glass-badge-danger fw-bold rounded-pill bounce-in" style={{ animationDelay: '0.2s' }}>
                                            <i className="fa-solid fa-arrow-trend-down me-1"></i>2%
                                        </span>
                                    </div>
                                    <div className="text-muted fw-medium mb-1 position-relative z-1">Tổng giảng viên</div>
                                    <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1 count-up" data-value={stats?.totalTeachers || 0}>{new Intl.NumberFormat('vi-VN').format(stats?.totalTeachers || 0)}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="stagger-fade-up">
                            <div className="card stat-card glass-card border-0" data-color="--danger-glow">
                                <div className="card-body position-relative overflow-hidden">
                                    <div className="glow-bg bg-danger-glow"></div>
                                    <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                        <div className="stat-icon icon-danger">
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                        </div>
                                        <span className="badge glass-badge-danger fw-bold rounded-pill bounce-in" style={{ animationDelay: '0.3s' }}>Cần xử lý</span>
                                    </div>
                                    <div className="text-muted fw-medium mb-1 position-relative z-1">Báo cáo cần xử lý</div>
                                    <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1 count-up" data-value={stats?.pendingReports || 0}>{new Intl.NumberFormat('vi-VN').format(stats?.pendingReports || 0)}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`stagger-fade-up ${activeTab === 'small' ? 'chart-row' : ''}`}>
                    {activeTab === 'small' && (
                        <>
                            <div className="chart-card">
                                <div className="card border-0 shadow-none glass-card rounded-4 h-100 p-1 position-relative overflow-hidden">
                                    <div className="glow-bg bg-primary-glow" style={{ opacity: 0.05, width: '300px', height: '300px', right: '-50px', top: '-50px' }}></div>
                                    <div className="card-header bg-transparent border-0 pt-4 pb-2 d-flex justify-content-between align-items-center position-relative z-1">
                                        <h5 className="card-title fw-bold m-0 text-dark">Doanh thu thống kê</h5>
                                        <select className="form-select form-select-sm glass-input rounded-pill fw-bold w-auto px-3 border-0 shadow-sm" value={days} onChange={handleDaysChange}>
                                            <option value="7">7 ngày qua</option>
                                            <option value="30">30 ngày qua</option>
                                            <option value="365">12 tháng qua</option>
                                        </select>
                                    </div>
                                    <div className="card-body position-relative z-1">
                                        <div className="chart-container w-100" style={{ height: '320px', borderRadius: '15px' }}>
                                            <Line options={chartOptions} data={chartDataState} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="donut-card">
                                <div className="card border-0 shadow-none glass-card rounded-4 h-100 p-1 position-relative overflow-hidden d-flex flex-column">
                                    <div className="glow-bg bg-info-glow" style={{ opacity: 0.08, width: '200px', height: '200px', bottom: '-50px', left: '-50px' }}></div>
                                    <div className="card-header bg-transparent border-0 pt-4 pb-0 text-center position-relative z-1">
                                        <h5 className="card-title fw-bold m-0 text-dark">Tỉ lệ hoàn thành</h5>
                                        <p className="text-muted small mt-1">Khóa học của học sinh</p>
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-center align-items-center position-relative z-1 flex-grow-1">
                                        <div className="radial-progress-wrapper position-relative text-center">
                                            <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '15px solid var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div>
                                                    <h2 className="stat-value fw-bold text-dark m-0">{stats?.completionRate ? Math.round(stats.completionRate) : 0}%</h2>
                                                    <span className="text-muted small">Trung bình</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {activeTab === 'large' && (
                        <div className="w-100 mb-4">
                            <div className="card border-0 shadow-none glass-card rounded-4 p-1 position-relative overflow-hidden">
                                <div className="glow-bg bg-primary-glow" style={{ opacity: 0.05, width: '500px', height: '500px', right: '-100px', top: '-100px' }}></div>
                                <div className="card-header bg-transparent border-0 pt-4 pb-2 d-flex justify-content-between align-items-center position-relative z-1 flex-wrap gap-3">
                                    <h5 className="card-title fw-bold m-0 text-dark">Biểu đồ doanh thu chi tiết</h5>
                                    
                                    <div className="d-flex gap-3 align-items-center flex-wrap">
                                        <select className="form-select form-select-sm glass-input rounded-pill fw-bold w-auto px-3 border-0 shadow-sm" value={chartFilter} onChange={(e) => setChartFilter(e.target.value)}>
                                            <option value="week">Theo tuần</option>
                                            <option value="month">Theo tháng</option>
                                            <option value="year">Theo năm</option>
                                            <option value="custom">Tùy chỉnh</option>
                                        </select>

                                        {chartFilter === 'custom' && (
                                            <div className="d-flex align-items-center gap-2">
                                                <input type="date" className="form-control form-control-sm glass-input rounded-pill px-3" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                                <span className="fw-bold">-</span>
                                                <input type="date" className="form-control form-control-sm glass-input rounded-pill px-3" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body position-relative z-1">
                                    <div className="chart-container w-100" style={{ height: '600px', borderRadius: '15px' }}>
                                        <Line options={chartOptions} data={chartDataState} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
