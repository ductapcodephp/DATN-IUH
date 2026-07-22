import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';
import '@/Pages/Seller/Settings/master.css';

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
            <div>
                <div className="fw-semibold text-dark">{label}</div>
                <div className="text-muted small mt-1">{description}</div>
            </div>
            <div className="form-check form-switch fs-4 m-0">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    checked={checked} 
                    onChange={onChange} 
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}

export default function Notifications() {
    return (
        <SellerLayout>
            <Head title="Cài đặt thông báo" />

            <div className="page">
                {/* Header */}
                <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                    <i className="fa-solid fa-bell me-2" style={{ color: '#EA580C' }}></i>
                    Cài đặt thông báo
                </h4>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                    Quản lý cách chúng tôi liên hệ và thông báo cho bạn.
                </p>
            </div>

                <div className="fade-in">
                    <h5 className="fw-semibold mb-4 mt-4 text-dark">Thông báo qua Email</h5>
                    
                    <ToggleRow label="Học viên đặt câu hỏi (Q&A)" description="Nhận thông báo để hỗ trợ học viên kịp thời." checked={true} onChange={()=>{}} />
                    <ToggleRow label="Đánh giá mới" description="Nhận thông báo khi có học viên đánh giá khóa học." checked={true} onChange={()=>{}} />
                    <ToggleRow label="Doanh thu hàng tháng" description="Gửi báo cáo doanh thu vào ngày 1 hàng tháng." checked={false} onChange={()=>{}} />
                    <ToggleRow label="Cập nhật từ hệ thống" description="Thông tin về tính năng mới và thông báo quan trọng." checked={true} onChange={()=>{}} />

                    <h5 className="fw-semibold mb-4 mt-5 text-dark">Thông báo Đẩy (Push Notifications)</h5>
                    <ToggleRow label="Khóa học được duyệt" description="Nhận thông báo ngay khi khóa học được admin phê duyệt." checked={true} onChange={()=>{}} />
                    <ToggleRow label="Có sinh viên đăng ký mới" description="Nhận thông báo khi có học viên thanh toán thành công." checked={true} onChange={()=>{}} />
                    
                    <div className="mt-4 pt-3 d-flex justify-content-end">
                        <button className="btn fw-semibold px-4 py-2" style={{ background: '#EA580C', color: 'white', borderRadius: '8px', border: 'none' }}>
                            <i className="fa-solid fa-floppy-disk me-2"></i> Lưu cài đặt thông báo
                        </button>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
