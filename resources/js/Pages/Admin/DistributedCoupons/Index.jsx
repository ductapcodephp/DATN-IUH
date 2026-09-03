import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function DistributedCoupons({ distributedCoupons, vipPackages = [], filters = {}, stats = {} }) {

    const handleFilter = (key, value) => {
        router.get(route('admin.distributed-coupons.index'), {
            ...filters,
            [key]: value || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleFilter('search', e.target.value);
        }
    };

    const getStatusBadge = (item) => {
        if (item.is_used) {
            return <span className="badge bg-success rounded-pill px-3 py-2"><i className="fa-solid fa-check me-1"></i> Đã dùng</span>;
        }
        if (item.expires_at && new Date(item.expires_at) < new Date()) {
            return <span className="badge bg-secondary rounded-pill px-3 py-2"><i className="fa-solid fa-clock me-1"></i> Hết hạn</span>;
        }
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-2"><i className="fa-solid fa-hourglass-half me-1"></i> Chưa dùng</span>;
    };

    return (
        <AdminLayout>
            <Head title="Mã giảm giá VIP đã phát" />

            <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up mb-4">
                <div>
                    <h3 className="m-0 fw-bold text-dark">Mã giảm giá VIP đã phát</h3>
                    <p className="text-muted mb-0">Danh sách các mã giảm giá đã được hệ thống tự động phát cho học viên VIP</p>
                </div>
            </div>

            {/* Thống kê */}
            <div className="row g-3 mb-4 stagger-fade-up">
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-none glass-card rounded-4 p-3 text-center">
                        <div className="fs-3 fw-bold text-dark">{stats.total || 0}</div>
                        <div className="text-muted small">Tổng mã đã phát</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-none glass-card rounded-4 p-3 text-center">
                        <div className="fs-3 fw-bold text-success">{stats.used || 0}</div>
                        <div className="text-muted small">Đã sử dụng</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-none glass-card rounded-4 p-3 text-center">
                        <div className="fs-3 fw-bold text-warning">{stats.unused || 0}</div>
                        <div className="text-muted small">Chưa sử dụng</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-none glass-card rounded-4 p-3 text-center">
                        <div className="fs-3 fw-bold text-secondary">{stats.expired || 0}</div>
                        <div className="text-muted small">Đã hết hạn</div>
                    </div>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="card border-0 shadow-none glass-card rounded-4 p-3 mb-4 stagger-fade-up">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">Tìm kiếm</label>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Nhập mã code, tên hoặc email..."
                            defaultValue={filters.search || ''}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small fw-semibold text-muted">Gói VIP</label>
                        <select
                            className="form-select rounded-pill"
                            value={filters.vip_package_id || ''}
                            onChange={(e) => handleFilter('vip_package_id', e.target.value)}
                        >
                            <option value="">Tất cả gói VIP</option>
                            {vipPackages.map(pkg => (
                                <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small fw-semibold text-muted">Trạng thái</label>
                        <select
                            className="form-select rounded-pill"
                            value={filters.status || ''}
                            onChange={(e) => handleFilter('status', e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            <option value="used">Đã sử dụng</option>
                            <option value="unused">Chưa sử dụng</option>
                            <option value="expired">Đã hết hạn</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-outline-secondary rounded-pill w-100"
                            onClick={() => router.get(route('admin.distributed-coupons.index'))}
                        >
                            <i className="fa-solid fa-rotate-right me-1"></i> Đặt lại
                        </button>
                    </div>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up">
                <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                        <thead className="border-bottom border-light">
                            <tr>
                                <th className="text-muted fw-semibold py-3">Mã Code</th>
                                <th className="text-muted fw-semibold py-3">Người nhận</th>
                                <th className="text-muted fw-semibold py-3">Gói VIP</th>
                                <th className="text-muted fw-semibold py-3">Mức giảm</th>
                                <th className="text-muted fw-semibold py-3">Trạng thái</th>
                                <th className="text-muted fw-semibold py-3">Ngày phát</th>
                                <th className="text-muted fw-semibold py-3">Hạn sử dụng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {distributedCoupons?.data?.map((item) => (
                                <tr key={item.id} className="border-bottom border-light hover-bg-light transition-all">
                                    <td className="py-3">
                                        <span style={{ color: 'var(--fire, #ff4500)', fontWeight: '700', fontFamily: 'monospace', fontSize: '14px' }}>
                                            {item.code}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            {item.user?.avatar ? (
                                                <img src={item.user.avatar} alt="" className="rounded-circle" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                                            ) : (
                                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: '13px', color: '#fff' }}>
                                                    {item.user?.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="fw-medium" style={{ fontSize: '13px' }}>{item.user?.name}</div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>{item.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className="badge bg-info text-dark rounded-pill px-3 py-2">
                                            <i className="fa-solid fa-crown me-1"></i> {item.vip_package?.name}
                                        </span>
                                    </td>
                                    <td className="py-3 fw-semibold">
                                        {item.coupon_template?.value_formatted || '—'}
                                    </td>
                                    <td className="py-3">
                                        {getStatusBadge(item)}
                                        {item.is_used && item.used_at_formatted && (
                                            <div className="text-muted mt-1" style={{ fontSize: '11px' }}>
                                                {item.used_at_formatted}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 text-muted" style={{ fontSize: '13px' }}>
                                        {item.distributed_at_formatted || '—'}
                                    </td>
                                    <td className="py-3 text-muted" style={{ fontSize: '13px' }}>
                                        {item.expires_at_formatted}
                                    </td>
                                </tr>
                            ))}
                            {(!distributedCoupons?.data || distributedCoupons.data.length === 0) && (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="fa-solid fa-ticket fs-1 mb-3 opacity-25 d-block"></i>
                                        Chưa có mã giảm giá VIP nào được phát.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {distributedCoupons?.meta?.links && <Pagination links={distributedCoupons.meta.links} />}
            </div>
        </AdminLayout>
    );
}
