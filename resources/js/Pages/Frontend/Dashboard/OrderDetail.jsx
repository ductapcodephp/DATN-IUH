import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/Frontend/DashboardLayout';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const orderStatusConfig = {
    pending:   { label: 'Đang chờ',     color: '#d97706', bg: '#fef3c7', icon: 'fa-solid fa-clock'         },
    completed: { label: 'Hoàn thành',   color: '#16a34a', bg: '#dcfce7', icon: 'fa-solid fa-circle-check'  },
    failed:    { label: 'Thất bại',     color: '#dc2626', bg: '#fee2e2', icon: 'fa-solid fa-circle-xmark'  },
    refunded:  { label: 'Đã hoàn tiền', color: '#6B7280', bg: '#f3f4f6', icon: 'fa-solid fa-rotate-left'   },
};

const paymentMethodConfig = {
    wallet: { label: 'Ví EduFlow', icon: 'fa-solid fa-wallet',        color: '#7c3aed' },
    vnpay:  { label: 'VNPay',      icon: 'fa-solid fa-credit-card',   color: '#0284C7' },
    momo:   { label: 'MoMo',       icon: 'fa-solid fa-mobile-screen', color: '#d97706' },
    free:   { label: 'Miễn phí',   icon: 'fa-solid fa-gift',          color: '#16a34a' },
};

function DetailRow({ label, value, bold }) {
    return (
        <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: bold ? 700 : 500, color: '#1F2937' }}>{value}</span>
        </div>
    );
}

export default function OrderDetail({ order }) {
    const statusInfo = orderStatusConfig[order?.status] ?? orderStatusConfig.pending;
    const payInfo    = paymentMethodConfig[order?.payment_method] ?? { label: order?.payment_method, icon: 'fa-solid fa-credit-card', color: '#6B7280' };

    return (
        <DashboardLayout title="Chi tiết đơn hàng" activeKey="orders">

            {/* Back */}
            <div className="mb-4">
                <Link
                    href={route('dashboard.orders')}
                    className="d-inline-flex align-items-center gap-2 text-decoration-none fw-medium"
                    style={{ color: '#EA580C', fontSize: '0.875rem' }}
                >
                    <i className="fa-solid fa-arrow-left"></i>Quay lại danh sách đơn hàng
                </Link>
            </div>

            <div className="row g-4">
                {/* Left: Order Info */}
                <div className="col-lg-8">
                    {/* Course Card */}
                    <div
                        className="p-4 mb-4"
                        style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <h6 className="fw-bold mb-3" style={{ color: '#1F2937' }}>
                            <i className="fa-solid fa-book me-2" style={{ color: '#EA580C' }}></i>
                            Thông tin khóa học
                        </h6>
                        <div className="d-flex gap-3">
                            <img
                                src={order?.course?.thumbnail ? `/storage/${order.course.thumbnail}` : '/assets/frontend/img/default-course.png'}
                                alt={order?.course?.title}
                                style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }}
                                onError={(e) => { e.target.src = '/assets/frontend/img/default-course.png'; }}
                            />
                            <div>
                                <h5 className="fw-bold mb-2" style={{ color: '#1F2937' }}>{order?.course?.title}</h5>
                                {order?.status === 'completed' && (
                                    <Link
                                        href={route('frontend.course.learn', { slug: order?.course?.slug })}
                                        className="btn btn-sm fw-semibold text-white"
                                        style={{ background: 'linear-gradient(135deg,#EA580C,#C2410C)', borderRadius: '8px', border: 'none', fontSize: '0.8rem' }}
                                    >
                                        <i className="fa-solid fa-play me-1"></i>Học ngay
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div
                        className="p-4"
                        style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <h6 className="fw-bold mb-3" style={{ color: '#1F2937' }}>
                            <i className="fa-solid fa-file-invoice-dollar me-2" style={{ color: '#0284C7' }}></i>
                            Chi tiết thanh toán
                        </h6>

                        <DetailRow label="Giá gốc" value={formatCurrency(order?.amount_original)} />
                        {order?.discount_amount > 0 && (
                            <DetailRow label={`Giảm giá (${order?.coupon?.code ?? 'Coupon'})`} value={`-${formatCurrency(order?.discount_amount)}`} />
                        )}
                        <div className="d-flex justify-content-between align-items-center py-3 mt-1" style={{ borderTop: '2px solid #1F2937' }}>
                            <span style={{ fontWeight: 700, color: '#1F2937' }}>Thực trả</span>
                            <span style={{ fontWeight: 800, color: '#EA580C', fontSize: '1.2rem' }}>{formatCurrency(order?.amount_paid)}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="col-lg-4">
                    <div
                        className="p-4"
                        style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <h6 className="fw-bold mb-3" style={{ color: '#1F2937' }}>
                            <i className="fa-solid fa-circle-info me-2" style={{ color: '#6B7280' }}></i>
                            Thông tin đơn hàng
                        </h6>

                        <DetailRow label="Mã đơn hàng" value={`#${order?.id}`} />
                        <DetailRow
                            label="Trạng thái"
                            value={
                                <span style={{
                                    background: statusInfo.bg, color: statusInfo.color,
                                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                }}>
                                    <i className={statusInfo.icon}></i>{statusInfo.label}
                                </span>
                            }
                        />
                        <DetailRow
                            label="Hình thức thanh toán"
                            value={
                                <span>
                                    <i className={`${payInfo.icon} me-1`} style={{ color: payInfo.color }}></i>
                                    {payInfo.label}
                                </span>
                            }
                        />
                        <DetailRow
                            label="Ngày đặt"
                            value={order?.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                        />

                        {order?.status === 'refunded' && order?.refund_reason && (
                            <div className="mt-3 p-3" style={{ background: '#fee2e2', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
                                    <i className="fa-solid fa-triangle-exclamation me-1"></i>Lý do hoàn tiền
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>{order.refund_reason}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
