import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import '@/../css/admin-style.css'; // ensure styles apply if needed, though this is a public page it might use a different style

export default function Contact() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contact');
    };

    return (
        <div className="app-layout d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
            <Head title="Liên hệ" />
            {/* Ambient Background Blobs */}
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>

            <div className="card glass-card border-0 p-5 shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold glow-text">Liên hệ với chúng tôi</h2>
                    <p className="text-muted">Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất.</p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-medium">Họ và tên</label>
                        <input type="text" className="form-control glass-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label text-muted fw-medium">Email</label>
                        <input type="email" className="form-control glass-input" value={data.email} onChange={e => setData('email', e.target.value)} required />
                        {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label text-muted fw-medium">Số điện thoại</label>
                        <input type="text" className="form-control glass-input" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted fw-medium">Chủ đề</label>
                        <input type="text" className="form-control glass-input" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label text-muted fw-medium">Nội dung</label>
                        <textarea className="form-control glass-input" rows="4" value={data.message} onChange={e => setData('message', e.target.value)} required></textarea>
                    </div>

                    <button type="submit" className="btn btn-glass-primary w-100 fw-bold rounded-pill py-2" disabled={processing}>
                        <i className="fa-solid fa-paper-plane me-2"></i>Gửi liên hệ
                    </button>
                </form>
            </div>
        </div>
    );
}
