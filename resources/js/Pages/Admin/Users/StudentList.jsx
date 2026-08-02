import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function StudentList({ students }) {
    return (
        <AdminLayout>
            <Head title="Quản lý học sinh" />
            
            <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 className="m-0 fw-bold text-dark">Quản lý học sinh</h3>
                    <p className="text-muted mb-0">Danh sách tài khoản học viên trên hệ thống</p>
                </div>
                <button className="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                    <i className="fa-solid fa-plus me-2"></i>Thêm học sinh
                </button>
            </div>

            <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div className="d-flex justify-content-between mb-4">
                    <div className="position-relative w-25">
                        <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input type="text" className="form-control glass-input ps-5 rounded-pill" placeholder="Tìm kiếm học sinh..." />
                    </div>
                    <div className="d-flex gap-2">
                        <select className="form-select glass-input rounded-pill">
                            <option value="">Trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="blocked">Đã chặn</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="border-0 rounded-start-3 px-4 py-3">Học sinh</th>
                                <th className="border-0 py-3">Email</th>
                                <th className="border-0 py-3">Ngày đăng ký</th>
                                <th className="border-0 py-3">Trạng thái</th>
                                <th className="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="border-top-0">
                            {students?.data?.map((student, index) => (
                                <tr key={student.id}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="avatar-glow">
                                                <img src={student.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} alt={student.name} className="rounded-circle" width="40" height="40" />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{student.name}</div>
                                                <div className="text-muted small">ID: #{student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-muted">{student.email}</td>
                                    <td className="py-3 text-muted">{student.created_at}</td>
                                    <td className="py-3">
                                        {student.status === 'active' ? (
                                            <span className="badge glass-badge-success rounded-pill px-3 py-2">Hoạt động</span>
                                        ) : (
                                            <span className="badge glass-badge-danger rounded-pill px-3 py-2">Bị chặn</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <Link href={route('admin.users.toggle-status', student.id)} method="post" as="button" className={`btn btn-sm rounded-pill px-3 ${student.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}>
                                            {student.status === 'active' ? <><i className="fa-solid fa-lock me-2"></i> Chặn</> : <><i className="fa-solid fa-unlock me-2"></i> Mở chặn</>}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            
                            {(!students || students.data.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">Không có dữ liệu học sinh.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
