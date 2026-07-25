import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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

export default function UserDetail({ user, stats, chartData, filters, orders }) {
    const isUser = user.current_role === 'user';
    const isSeller = user.current_role === 'seller';
    
    const [chartFilter, setChartFilter] = useState(filters.type || 'week');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    
    const [chartDataState, setChartDataState] = useState({
        labels: chartData?.labels || [],
        datasets: [{
            fill: true,
            label: isUser ? 'Tiêu dùng' : 'Doanh thu',
            data: chartData?.data || [],
            borderColor: isUser ? 'rgba(59, 130, 246, 1)' : 'rgba(234, 88, 12, 1)',
            backgroundColor: isUser ? 'rgba(59, 130, 246, 0.1)' : 'rgba(234, 88, 12, 0.1)',
            tension: 0.4,
            pointBackgroundColor: isUser ? 'rgba(59, 130, 246, 1)' : 'rgba(234, 88, 12, 1)',
        }],
    });

    const [orderStartDate, setOrderStartDate] = useState('');
    const [orderEndDate, setOrderEndDate] = useState('');
    const [orderSearchId, setOrderSearchId] = useState('');

    const filteredOrders = React.useMemo(() => {
        if (!orders) return [];
        return orders.filter(order => {
            let pass = true;
            
            if (orderSearchId) {
                const searchId = orderSearchId.replace('#', '').trim();
                if (!order.id.toString().includes(searchId)) {
                    pass = false;
                }
            }

            const orderDate = new Date(order.created_at);
            if (orderStartDate) {
                const start = new Date(orderStartDate);
                start.setHours(0, 0, 0, 0);
                if (orderDate < start) pass = false;
            }
            if (orderEndDate) {
                const end = new Date(orderEndDate);
                end.setHours(23, 59, 59, 999);
                if (orderDate > end) pass = false;
            }
            return pass;
        });
    }, [orders, orderStartDate, orderEndDate, orderSearchId]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                let url = route('admin.users.chart-data', { id: user.id }) + `?type=${chartFilter}`;
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
                        label: isUser ? 'Tiêu dùng' : 'Doanh thu',
                        data: data.data || [],
                        borderColor: isUser ? 'rgba(59, 130, 246, 1)' : 'rgba(234, 88, 12, 1)',
                        backgroundColor: isUser ? 'rgba(59, 130, 246, 0.1)' : 'rgba(234, 88, 12, 0.1)',
                        tension: 0.4,
                        pointBackgroundColor: isUser ? 'rgba(59, 130, 246, 1)' : 'rgba(234, 88, 12, 1)',
                    }],
                });
            } catch (error) {
                console.error("Failed to fetch chart data:", error);
            }
        };
        
        fetchChartData();
    }, [chartFilter, startDate, endDate, user.id]);

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

    const getAvatarUrl = () => {
        if (user.avatar) {
            return user.avatar.startsWith('http') || user.avatar.startsWith('/') 
                ? user.avatar 
                : `/storage/${user.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    };

    return (
        <AdminLayout>
            <Head title={`Chi tiết: ${user.name}`} />
            
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <Link href={route('admin.users')} className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <div>
                            <h3 className="m-0 fw-bold text-dark">Hồ sơ người dùng</h3>
                            <p className="text-muted mb-0">Xem thống kê và hoạt động chi tiết</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    {/* User Profile Card */}
                    <div className="col-12 col-xl-4 stagger-fade-up">
                        <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
                            <div className="glow-bg bg-primary-glow" style={{ opacity: 0.05 }}></div>
                            <div className="card-body p-4 text-center position-relative z-1">
                                <img 
                                    src={getAvatarUrl()} 
                                    alt={user.name} 
                                    className="rounded-circle shadow-sm mb-3"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid white' }}
                                />
                                <h4 className="fw-bold mb-1">{user.name}</h4>
                                <p className="text-muted mb-3">{user.email}</p>
                                
                                <span className={`badge rounded-pill px-3 py-2 ${isSeller ? 'bg-primary text-white' : 'bg-info text-dark'} fw-bold`}>
                                    {isSeller ? 'Giảng viên (Seller)' : 'Học viên (User)'}
                                </span>
                                
                                <div className="mt-4 pt-4 border-top text-start">
                                    <div className="mb-2"><strong>ID:</strong> #{user.id}</div>
                                    <div className="mb-2"><strong>Điện thoại:</strong> {user.phone || 'Chưa cập nhật'}</div>
                                    <div className="mb-2"><strong>Trạng thái:</strong> {user.is_active ? <span className="text-success fw-bold">Hoạt động</span> : <span className="text-danger fw-bold">Bị khóa</span>}</div>
                                    <div><strong>Ngày tham gia:</strong> {new Date(user.created_at).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="col-12 col-xl-8">
                        <div className="row g-3 h-100">
                            {isUser && (
                                <>
                                    <div className="col-12 col-md-6 stagger-fade-up">
                                        <div className="card stat-card glass-card border-0 h-100" data-color="--primary-glow">
                                            <div className="card-body position-relative overflow-hidden">
                                                <div className="glow-bg bg-primary-glow"></div>
                                                <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                                    <div className="stat-icon icon-primary">
                                                        <i className="fa-solid fa-wallet"></i>
                                                    </div>
                                                </div>
                                                <div className="text-muted fw-medium mb-1 position-relative z-1">Tổng tiền đã tiêu (VNĐ)</div>
                                                <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1">
                                                    {new Intl.NumberFormat('vi-VN').format(stats.total_spent || 0)} ₫
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 stagger-fade-up" style={{ animationDelay: '0.1s' }}>
                                        <div className="card stat-card glass-card border-0 h-100" data-color="--success-glow">
                                            <div className="card-body position-relative overflow-hidden">
                                                <div className="glow-bg bg-success-glow"></div>
                                                <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                                    <div className="stat-icon icon-success">
                                                        <i className="fa-solid fa-graduation-cap"></i>
                                                    </div>
                                                </div>
                                                <div className="text-muted fw-medium mb-1 position-relative z-1">Khóa học đã mua</div>
                                                <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1">
                                                    {stats.total_courses || 0}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 stagger-fade-up" style={{ animationDelay: '0.2s' }}>
                                        <div className="card stat-card glass-card border-0 h-100" data-color="--warning-glow">
                                            <div className="card-body position-relative overflow-hidden">
                                                <div className="glow-bg bg-warning-glow"></div>
                                                <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                                    <div className="stat-icon icon-warning">
                                                        <i className="fa-solid fa-crown"></i>
                                                    </div>
                                                </div>
                                                <div className="text-muted fw-medium mb-1 position-relative z-1">Gói VIP đã mua</div>
                                                <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1">
                                                    {stats.total_vips || 0}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {isSeller && (
                                <>
                                    <div className="col-12 col-md-6 stagger-fade-up">
                                        <div className="card stat-card glass-card border-0 h-100" data-color="--primary-glow">
                                            <div className="card-body position-relative overflow-hidden">
                                                <div className="glow-bg bg-primary-glow"></div>
                                                <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                                    <div className="stat-icon icon-primary">
                                                        <i className="fa-solid fa-money-bill-wave"></i>
                                                    </div>
                                                </div>
                                                <div className="text-muted fw-medium mb-1 position-relative z-1">Tổng doanh thu (VNĐ)</div>
                                                <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1">
                                                    {new Intl.NumberFormat('vi-VN').format(stats.total_revenue || 0)} ₫
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 stagger-fade-up" style={{ animationDelay: '0.1s' }}>
                                        <div className="card stat-card glass-card border-0 h-100" data-color="--success-glow">
                                            <div className="card-body position-relative overflow-hidden">
                                                <div className="glow-bg bg-success-glow"></div>
                                                <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                                    <div className="stat-icon icon-success">
                                                        <i className="fa-solid fa-book-open"></i>
                                                    </div>
                                                </div>
                                                <div className="text-muted fw-medium mb-1 position-relative z-1">Khóa học đang bán</div>
                                                <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1">
                                                    {stats.total_courses || 0}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 stagger-fade-up" style={{ animationDelay: '0.2s' }}>
                                        <div className="card stat-card glass-card border-0 h-100" data-color="--info-glow">
                                            <div className="card-body position-relative overflow-hidden">
                                                <div className="glow-bg bg-info-glow"></div>
                                                <div className="d-flex align-items-center justify-content-between mb-3 position-relative z-1">
                                                    <div className="stat-icon" style={{ color: 'var(--bs-info)', backgroundColor: 'rgba(13, 202, 240, 0.1)' }}>
                                                        <i className="fa-solid fa-users"></i>
                                                    </div>
                                                </div>
                                                <div className="text-muted fw-medium mb-1 position-relative z-1">Tổng số học viên</div>
                                                <h2 className="fw-bold m-0 text-dark stat-value position-relative z-1">
                                                    {stats.total_students || 0}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="w-100 stagger-fade-up">
                    <div className="card border-0 shadow-none glass-card rounded-4 p-1 position-relative overflow-hidden">
                        <div className={`glow-bg ${isUser ? 'bg-primary-glow' : 'bg-primary-glow'}`} style={{ opacity: 0.05, width: '500px', height: '500px', right: '-100px', top: '-100px' }}></div>
                        <div className="card-header bg-transparent border-0 pt-4 pb-2 d-flex justify-content-between align-items-center position-relative z-1 flex-wrap gap-3">
                            <h5 className="card-title fw-bold m-0 text-dark">
                                {isUser ? 'Biểu đồ tiêu dùng chi tiết' : 'Biểu đồ doanh thu chi tiết'}
                            </h5>
                            
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
                            <div className="chart-container w-100" style={{ height: '400px', borderRadius: '15px' }}>
                                <Line options={chartOptions} data={chartDataState} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Orders Section */}
                <div className="w-100 stagger-fade-up mt-4">
                    <div className="card border-0 shadow-sm rounded-4 position-relative overflow-hidden">
                        <div className="card-header bg-white border-bottom pt-4 pb-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h5 className="card-title fw-bold m-0 text-dark">
                                <i className="fa-solid fa-cart-shopping me-2 text-primary"></i>
                                Lịch sử mua hàng (Khóa học & Gói VIP)
                            </h5>
                            <div className="d-flex gap-3 align-items-center flex-wrap">
                                <div className="input-group input-group-sm rounded-pill bg-light border overflow-hidden p-1" style={{ width: '200px' }}>
                                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-1">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm border-0 bg-transparent shadow-none" 
                                        placeholder="Tìm mã ĐH..." 
                                        value={orderSearchId}
                                        onChange={(e) => setOrderSearchId(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex align-items-center gap-2 bg-light p-1 rounded-pill border">
                                    <input 
                                        type="date" 
                                        className="form-control form-control-sm border-0 bg-transparent rounded-pill px-3" 
                                        value={orderStartDate} 
                                        onChange={(e) => setOrderStartDate(e.target.value)} 
                                        style={{ minWidth: '130px', boxShadow: 'none' }}
                                    />
                                    <span className="fw-bold text-muted px-1">-</span>
                                    <input 
                                        type="date" 
                                        className="form-control form-control-sm border-0 bg-transparent rounded-pill px-3" 
                                        value={orderEndDate} 
                                        onChange={(e) => setOrderEndDate(e.target.value)} 
                                        style={{ minWidth: '130px', boxShadow: 'none' }}
                                    />
                                </div>
                                {(orderStartDate || orderEndDate || orderSearchId) && (
                                    <button 
                                        className="btn btn-sm btn-light rounded-circle"
                                        onClick={() => { setOrderStartDate(''); setOrderEndDate(''); setOrderSearchId(''); }}
                                        title="Xóa bộ lọc"
                                    >
                                        <i className="fa-solid fa-times text-danger"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-4 py-3">Mã ĐH</th>
                                            <th className="py-3">Tên mục</th>
                                            <th className="py-3">Loại</th>
                                            <th className="py-3">Số tiền</th>
                                            <th className="py-3">Thanh toán</th>
                                            <th className="py-3">Ngày mua</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!filteredOrders || filteredOrders.length === 0) ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-5 text-muted">
                                                    <i className="fa-solid fa-box-open fs-2 mb-3 d-block opacity-50"></i>
                                                    {orders && orders.length > 0 ? 'Không tìm thấy đơn hàng nào trong khoảng thời gian này' : 'Người dùng chưa có lịch sử mua hàng nào'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="px-4 fw-medium text-dark">#{order.id}</td>
                                                    <td>
                                                        {order.course_id && order.course ? (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                                                    <i className="fa-solid fa-graduation-cap text-primary"></i>
                                                                </div>
                                                                <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: '300px' }}>
                                                                    {order.course.title}
                                                                </span>
                                                            </div>
                                                        ) : order.vip_package_id && order.vip_package ? (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                                                    <i className="fa-solid fa-crown text-warning"></i>
                                                                </div>
                                                                <span className="fw-semibold text-dark">
                                                                    Gói VIP: {order.vip_package.name}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">Không xác định</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {order.course_id ? (
                                                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">Khóa học</span>
                                                        ) : (
                                                            <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill">Gói VIP</span>
                                                        )}
                                                    </td>
                                                    <td className="fw-bold text-dark">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount_paid)}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-secondary bg-opacity-10 text-secondary text-uppercase">
                                                            {order.payment_method}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted">
                                                        {new Date(order.created_at).toLocaleDateString('vi-VN')} {new Date(order.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
