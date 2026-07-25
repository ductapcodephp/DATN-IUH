import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';

export default function Notifications({ notifications, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('seller.notifications.index'), {
            start_date: startDate,
            end_date: endDate,
            type: type
        }, { preserveState: true });
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        setType('');
        router.get(route('seller.notifications.index'));
    };

    const getTypeLabel = (type) => {
        if (!type) return 'Thông báo';
        if (type.includes('NewCourseEnrollmentNotification')) return 'Học viên đăng ký mới';
        if (type.includes('NewReviewNotification')) return 'Đánh giá khóa học';
        if (type.includes('NewCommentReportNotification')) return 'Báo cáo bình luận';
        if (type.includes('VipExpiringNotification')) return 'Gói VIP sắp hết hạn';
        return 'Thông báo hệ thống';
    };

    const getIconClass = (type) => {
        if (!type) return 'fa-bell text-secondary';
        if (type.includes('NewCourseEnrollmentNotification')) return 'fa-user-plus text-success';
        if (type.includes('NewReviewNotification')) return 'fa-star text-warning';
        if (type.includes('NewCommentReportNotification')) return 'fa-flag text-danger';
        if (type.includes('VipExpiringNotification')) return 'fa-crown text-warning';
        return 'fa-bell text-primary';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <SellerLayout>
            <Head title="Lịch sử Thông báo" />
            <div className="container-fluid p-0">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-dark mb-0">
                        <i className="fa-solid fa-bell me-2" style={{ color: 'var(--fire)' }}></i>
                        Lịch sử Thông báo
                    </h4>
                </div>

                {/* Filter Card */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                        <form onSubmit={handleFilter} className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label text-muted small fw-semibold">Từ ngày</label>
                                <input 
                                    type="date" 
                                    className="form-control orange-input-focus rounded-3" 
                                    value={startDate} 
                                    onChange={e => setStartDate(e.target.value)} 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label text-muted small fw-semibold">Đến ngày</label>
                                <input 
                                    type="date" 
                                    className="form-control orange-input-focus rounded-3" 
                                    value={endDate} 
                                    onChange={e => setEndDate(e.target.value)} 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label text-muted small fw-semibold">Loại thông báo</label>
                                <select 
                                    className="form-select orange-input-focus rounded-3" 
                                    value={type} 
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="NewCourseEnrollmentNotification">Học viên đăng ký mới</option>
                                    <option value="NewReviewNotification">Đánh giá khóa học</option>
                                    <option value="NewCommentReportNotification">Báo cáo bình luận</option>
                                    <option value="VipExpiringNotification">Gói VIP sắp hết hạn</option>
                                </select>
                            </div>
                            <div className="col-md-2 d-flex align-items-end gap-2">
                                <button type="submit" className="btn w-100 fw-semibold" style={{ background: 'var(--fire)', color: '#fff', borderRadius: '8px' }}>
                                    Lọc
                                </button>
                                <button type="button" onClick={handleClear} className="btn btn-light border w-100 fw-semibold" style={{ borderRadius: '8px' }}>
                                    Xóa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-0">
                        {notifications.data.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="fa-regular fa-bell-slash fs-1 mb-3 text-light"></i>
                                <h5>Không có thông báo nào.</h5>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush rounded-4">
                                {notifications.data.map(notification => (
                                    <div key={notification.id} className={`list-group-item p-4 border-bottom fade-in ${!notification.read_at ? 'bg-light' : ''}`}>
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="mt-1">
                                                <i className={`fa-solid ${getIconClass(notification.type)} fs-4`}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="fw-semibold mb-1 text-dark">
                                                    {getTypeLabel(notification.type)}
                                                </h6>
                                                <p className="text-muted mb-2 mb-0" style={{ fontSize: '15px' }}>
                                                    {notification.data.message || 'Bạn có một thông báo mới.'}
                                                </p>
                                                <small className="text-muted">
                                                    <i className="fa-regular fa-clock me-1"></i>
                                                    {formatDate(notification.created_at)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Pagination */}
                    {notifications.last_page > 1 && (
                        <div className="card-footer bg-white border-0 py-3 rounded-bottom-4 d-flex justify-content-center">
                            <ul className="pagination m-0">
                                {notifications.links.map((link, k) => (
                                    <li key={k} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                        <Link 
                                            href={link.url || '#'} 
                                            className="page-link" 
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            style={link.active ? { backgroundColor: 'var(--fire)', borderColor: 'var(--fire)' } : {}}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
