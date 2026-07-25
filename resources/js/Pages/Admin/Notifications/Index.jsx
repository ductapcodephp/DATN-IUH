import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function Index({ notifications, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.notifications.index'), {
            start_date: startDate,
            end_date: endDate,
            type: type
        }, { preserveState: true });
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        setType('');
        router.get(route('admin.notifications.index'));
    };

    const getTypeLabel = (type) => {
        if (!type) return 'Thông báo';
        if (type.includes('NewContactNotification')) return 'Liên hệ mới';
        if (type.includes('NewReportNotification')) return 'Báo cáo vi phạm';
        if (type.includes('NewWithdrawalRequestNotification')) return 'Yêu cầu rút tiền';
        return 'Hệ thống';
    };

    const getIconClass = (type) => {
        if (!type) return 'fa-bell text-secondary';
        if (type.includes('NewContactNotification')) return 'fa-envelope text-info';
        if (type.includes('NewReportNotification')) return 'fa-triangle-exclamation text-danger';
        if (type.includes('NewWithdrawalRequestNotification')) return 'fa-money-bill-transfer text-success';
        return 'fa-bell text-primary';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title="Log Thông Báo" />
            
            <div className="container-fluid px-4">
                <h1 className="mt-4 mb-4">Lịch sử Thông báo Hệ thống</h1>
                
                {/* Lọc thông báo */}
                <div className="card mb-4 shadow-sm border-0">
                    <div className="card-header bg-white py-3">
                        <i className="fas fa-filter me-1"></i> Bộ lọc
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleFilter} className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Từ ngày</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={startDate} 
                                    onChange={e => setStartDate(e.target.value)} 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Đến ngày</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={endDate} 
                                    onChange={e => setEndDate(e.target.value)} 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold text-secondary">Loại thông báo</label>
                                <select 
                                    className="form-select" 
                                    value={type} 
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value="">-- Tất cả --</option>
                                    <option value="NewContactNotification">Liên hệ mới</option>
                                    <option value="NewReportNotification">Báo cáo vi phạm</option>
                                    <option value="NewWithdrawalRequestNotification">Yêu cầu rút tiền</option>
                                </select>
                            </div>
                            <div className="col-md-2 d-flex align-items-end gap-2">
                                <button type="submit" className="btn btn-primary w-100">
                                    <i className="fa-solid fa-magnifying-glass me-1"></i> Lọc
                                </button>
                                <button type="button" onClick={handleClear} className="btn btn-outline-secondary w-100">
                                    Xóa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danh sách */}
                <div className="card mb-4 shadow-sm border-0">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <div>
                            <i className="fas fa-table me-1"></i> Log Thông Báo
                        </div>
                        <span className="badge bg-primary rounded-pill">Total: {notifications.total}</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="ps-4">Thời gian</th>
                                        <th scope="col">Loại</th>
                                        <th scope="col">Nội dung chi tiết</th>
                                        <th scope="col" className="text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">
                                                Không có dữ liệu log thông báo.
                                            </td>
                                        </tr>
                                    ) : (
                                        notifications.data.map(notification => (
                                            <tr key={notification.id} className={!notification.read_at ? 'table-active' : ''}>
                                                <td className="ps-4 text-nowrap text-muted">
                                                    {formatDate(notification.created_at)}
                                                </td>
                                                <td>
                                                    <span className="d-flex align-items-center gap-2">
                                                        <i className={`fa-solid ${getIconClass(notification.type)}`}></i>
                                                        <span className="fw-semibold">{getTypeLabel(notification.type)}</span>
                                                    </span>
                                                </td>
                                                <td>
                                                    {notification.data.message || JSON.stringify(notification.data)}
                                                </td>
                                                <td className="text-center">
                                                    {notification.read_at ? (
                                                        <span className="badge bg-success-subtle text-success">Đã xem</span>
                                                    ) : (
                                                        <span className="badge bg-danger-subtle text-danger">Chưa xem</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Phân trang */}
                    {notifications.last_page > 1 && (
                        <div className="card-footer bg-white py-3">
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center mb-0">
                                    {notifications.links.map((link, k) => (
                                        <li key={k} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                            <Link 
                                                href={link.url || '#'} 
                                                className="page-link" 
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
