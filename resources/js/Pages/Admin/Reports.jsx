import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function Reports({ reports = [] }) {
    return (
        <AdminLayout>
            <Head title="Quản lý Báo cáo vi phạm" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý Báo cáo vi phạm</h3>
                        <p className="text-muted mb-0">Xử lý các báo cáo từ cộng đồng</p>
                    </div>
                </div>
                
                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 rounded-start-3 px-4 py-3">Người báo cáo</th>
                                    <th className="border-0 py-3">Nội dung báo cáo</th>
                                    <th className="border-0 py-3">Loại vi phạm</th>
                                    <th className="border-0 py-3">Trạng thái</th>
                                    <th className="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {reports.map(report => (
                                    <tr key={report.id}>
                                        <td className="px-4 py-3 text-dark fw-bold">{report.reporter?.name}</td>
                                        <td className="py-3 text-muted">{report.reason}</td>
                                        <td className="py-3"><span className="badge bg-danger rounded-pill px-3 py-2">{report.status}</span></td>
                                        <td className="py-3"><span className="badge bg-warning text-dark rounded-pill px-3 py-2">{new Date(report.created_at).toLocaleDateString()}</span></td>
                                        <td className="px-4 py-3 text-end">
                                            <button className="btn btn-sm rounded-pill px-3 btn-outline-primary">Chi tiết</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
