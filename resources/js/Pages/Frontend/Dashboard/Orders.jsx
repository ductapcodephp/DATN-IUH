import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/Frontend/DashboardLayout';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const orderStatusConfig = {
    pending: { label: 'Đang chờ', color: '#d97706', bg: '#fef3c7', icon: 'fa-solid fa-clock' },
    completed: { label: 'Hoàn thành', color: '#16a34a', bg: '#dcfce7', icon: 'fa-solid fa-circle-check' },
    failed: { label: 'Thất bại', color: '#dc2626', bg: '#fee2e2', icon: 'fa-solid fa-circle-xmark' },
    refunded: { label: 'Đã hoàn tiền', color: '#6B7280', bg: '#f3f4f6', icon: 'fa-solid fa-rotate-left' },
};

const paymentMethodConfig = {
    wallet: { label: 'Ví EduFlow', icon: 'fa-solid fa-wallet' },
    vnpay: { label: 'VNPay', icon: 'fa-solid fa-credit-card' },
    momo: { label: 'MoMo', icon: 'fa-solid fa-mobile-screen' },
    free: { label: 'Miễn phí', icon: 'fa-solid fa-gift' },
};

export default function Orders({ orders, filters }) {
    const [status, setStatus] = useState(filters?.status ?? '');
    const [paymentMethod, setPaymentMethod] = useState(filters?.payment_method ?? '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters?.date_to ?? '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('dashboard.orders'), {
            status, payment_method: paymentMethod,
            date_from: dateFrom, date_to: dateTo,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setStatus(''); setPaymentMethod(''); setDateFrom(''); setDateTo('');
        router.get(route('dashboard.orders'));
    };

    return (
        <DashboardLayout title="Lịch sử đơn hàng" activeKey="orders">

            {/* Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                    <i className="fa-solid fa-receipt me-2" style={{ color: '#0284C7' }}></i>
                    Lịch sử đơn hàng
                </h4>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                    Tổng cộng <strong>{orders?.total ?? 0}</strong> đơn hàng
                </p>
            </div>

            {/* Filters */}
            <form onSubmit={handleFilter}>
                <div className="p-3 mb-4 db-filter-bar">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)} style={{ borderRadius: '8px' }}>
                                <option value="">Tất cả trạng thái</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="pending">Đang chờ</option>
                                <option value="failed">Thất bại</option>
                                <option value="refunded">Đã hoàn tiền</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select form-select-sm" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ borderRadius: '8px' }}>
                                <option value="">Tất cả hình thức</option>
                                <option value="wallet">Ví EduFlow</option>
                                <option value="vnpay">VNPay</option>
                                <option value="momo">MoMo</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ borderRadius: '8px' }} placeholder="Từ ngày" />
                        </div>
                        <div className="col-md-2">
                            <input type="date" className="form-control form-control-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ borderRadius: '8px' }} placeholder="Đến ngày" />
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                            <button type="submit" className="btn btn-sm fw-semibold text-white flex-grow-1" style={{ background: '#EA580C', borderRadius: '8px', border: 'none' }}>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                            {(status || paymentMethod || dateFrom || dateTo) && (
                                <button type="button" onClick={handleReset} className="btn btn-sm btn-outline-secondary fw-semibold" style={{ borderRadius: '8px' }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {/* Orders List */}
            {(orders?.data ?? []).length === 0 ? (
                <div className="text-center py-5">
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <i className="fa-solid fa-receipt" style={{ fontSize: '2rem', color: '#0284C7' }}></i>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: '#1F2937' }}>Chưa có đơn hàng nào</h6>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Hãy khám phá và đăng ký khóa học đầu tiên!</p>
                    <Link href={route('frontend.course.index')} className="btn btn-sm fw-semibold text-white" style={{ background: '#EA580C', borderRadius: '8px', border: 'none' }}>
                        Khám phá khóa học
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(orders?.data ?? []).map((order) => {
                        const statusInfo = orderStatusConfig[order.status] ?? orderStatusConfig.pending;
                        const payInfo = paymentMethodConfig[order.payment_method] ?? { label: order.payment_method, icon: 'fa-solid fa-credit-card' };

                        return (
                            <div key={order.id} className="db-order-card">
                                <div className="d-flex flex-wrap align-items-center gap-3">
                                    {/* Course Thumbnail */}
                                    <img
                                        src={order.course?.thumbnail ? `/storage/${order.course.thumbnail}` : '/assets/frontend/img/default-course.png'}
                                        alt={order.course?.title}
                                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                                        onError={(e) => { e.target.src = '/assets/frontend/img/default-course.png'; }}
                                    />

                                    {/* Order Info */}
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '0.9rem', marginBottom: '4px' }}>
                                            {order.course?.title ?? 'Khóa học'}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                                            <span>Mã đơn: <strong style={{ color: '#4B5563' }}>#{order.id}</strong></span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
                                            <i className={`${payInfo.icon} me-1`}></i>{payInfo.label}
                                            {order.coupon && (
                                                <span className="ms-2 px-2 py-0" style={{ background: '#dcfce7', color: '#16a34a', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                                                    🎟 {order.coupon.code}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price & Status */}
                                    <div className="text-end">
                                        <div className="mb-2">
                                            {order.discount_amount > 0 && (
                                                <div style={{ fontSize: '0.78rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                                                    {formatCurrency(order.amount_original)}
                                                </div>
                                            )}
                                            <div style={{ fontWeight: 800, color: '#EA580C', fontSize: '1rem' }}>
                                                {formatCurrency(order.amount_paid)}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            background: statusInfo.bg, color: statusInfo.color,
                                            padding: '3px 10px', borderRadius: '20px',
                                            fontSize: '0.72rem', fontWeight: 700,
                                        }}>
                                            <i className={statusInfo.icon}></i>
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* View Detail */}
                                    <Link
                                        href={route('dashboard.orders.detail', { orderId: order.id })}
                                        className="btn btn-sm fw-semibold"
                                        style={{ borderRadius: '8px', border: '1px solid #e2e8f0', color: '#4B5563', fontSize: '0.8rem', flexShrink: 0 }}
                                    >
                                        Chi tiết
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {orders?.last_page > 1 && (
                        <div className="d-flex justify-content-center gap-2 mt-2">
                            {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get(route('dashboard.orders'), { page, status, payment_method: paymentMethod })}
                                    className="btn btn-sm fw-semibold"
                                    style={{
                                        borderRadius: '8px', minWidth: '36px',
                                        background: page === orders.current_page ? '#EA580C' : '#fff',
                                        color: page === orders.current_page ? '#fff' : '#4B5563',
                                        border: `1px solid ${page === orders.current_page ? '#EA580C' : '#e2e8f0'}`,
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
