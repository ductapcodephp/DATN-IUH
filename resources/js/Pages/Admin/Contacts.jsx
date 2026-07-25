import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function Contacts({ contacts = [] }) {
    return (
        <AdminLayout>
            <Head title="Quản lý Liên hệ" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý Liên hệ</h3>
                        <p className="text-muted mb-0">Danh sách liên hệ từ khách hàng</p>
                    </div>
                </div>
                
                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 rounded-start-3 px-4 py-3">Tên khách hàng</th>
                                    <th className="border-0 py-3">Email</th>
                                    <th className="border-0 py-3">Nội dung</th>
                                    <th className="border-0 py-3">Trạng thái</th>
                                    <th className="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {contacts.map(contact => (
                                    <tr key={contact.id}>
                                        <td className="px-4 py-3 text-dark fw-bold">{contact.name}</td>
                                        <td className="py-3">{contact.email}</td>
                                        <td className="py-3">{contact.subject}</td>
                                        <td className="py-3"><span className="badge bg-warning text-dark rounded-pill px-3 py-2">{contact.status}</span></td>
                                        <td className="px-4 py-3 text-end">
                                            <button className="btn btn-sm rounded-pill px-3 btn-outline-success">Đã phản hồi</button>
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
