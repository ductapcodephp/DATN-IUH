import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function Settings({ settings = [] }) {
    return (
        <AdminLayout>
            <Head title="Cài đặt hệ thống" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Cài đặt hệ thống</h3>
                        <p className="text-muted mb-0">Cấu hình các thông số cốt lõi</p>
                    </div>
                    <button className="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                        <i className="fa-solid fa-save me-2"></i>Lưu thay đổi
                    </button>
                </div>
                
                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <h5 className="fw-bold mb-4">Cấu hình doanh thu</h5>
                    <form>
                        <div className="row mb-4">
                            {settings.map(setting => (
                                <div className="col-md-6 mb-3" key={setting.id}>
                                    <label className="form-label text-muted fw-medium">{setting.description || setting.key}</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control glass-input" defaultValue={setting.value} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
