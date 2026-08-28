import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import { Info, Server, ShieldCheck, UserCheck, Copy, Check } from "lucide-react";

function SystemNoticeModal({ isOpen, onClose }) {
    const [copiedField, setCopiedField] = useState(null);

    if (!isOpen) return null;

    const handleCopy = (text, fieldName) => {
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1"
            style={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.65)', 
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflowY: 'auto'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '560px', margin: '1.75rem auto' }}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    {/* Header */}
                    <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div 
                                className="d-flex align-items-center justify-content-center text-primary bg-primary bg-opacity-10 rounded-circle"
                                style={{ width: '40px', height: '40px' }}
                            >
                                <Info size={22} className="text-primary" />
                            </div>
                            <div>
                                <h5 className="modal-title fw-bold text-dark mb-0 fs-5">
                                    Thông Báo Trải Nghiệm Demo
                                </h5>
                                <p className="text-muted small mb-0">Thông tin tài khoản &amp; lưu ý hệ thống</p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            className="btn-close" 
                            aria-label="Close" 
                            onClick={onClose}
                            style={{ fontSize: '13px' }}
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body px-4 py-3">
                        {/* Server Notice Alert */}
                        <div 
                            className="p-3 mb-3 rounded-3 d-flex align-items-start gap-3"
                            style={{ 
                                backgroundColor: '#fffbeb', 
                                border: '1px solid #fef3c7',
                                color: '#92400e' 
                            }}
                        >
                            <div className="mt-1 flex-shrink-0">
                                <Server size={20} className="text-warning" />
                            </div>
                            <div className="small">
                                <span className="fw-bold d-block mb-1" style={{ color: '#b45309' }}>
                                    Lưu ý về máy chủ:
                                </span>
                                Hệ thống hiện đang chạy trên máy tính cá nhân (laptop) nên đôi khi có thể gặp tình trạng phản hồi chậm, gián đoạn hoặc tạm tắt. Rất mong quý thầy cô và các bạn thông cảm!
                            </div>
                        </div>

                        <div className="mb-2">
                            <p className="fw-semibold text-secondary small mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                Tài khoản dùng thử
                            </p>
                        </div>

                        {/* Account 1: Admin */}
                        <div 
                            className="p-3 mb-2 rounded-3 border bg-light position-relative"
                            style={{ borderColor: '#e2e8f0' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <ShieldCheck size={18} className="text-danger" />
                                    <span className="fw-bold text-dark small">Tài khoản Quản trị (Admin)</span>
                                </div>
                                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-2 py-1 small">
                                    Admin
                                </span>
                            </div>
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white p-2 rounded border">
                                <div className="small">
                                    <div className="text-muted">Email: <strong className="text-dark font-monospace">admin@gmail.com</strong></div>
                                    <div className="text-muted">Mật khẩu: <strong className="text-dark font-monospace">123</strong></div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1 py-1 px-2"
                                    style={{ fontSize: '12px' }}
                                    onClick={() => handleCopy('admin@gmail.com', 'admin_email')}
                                    title="Copy Email Admin"
                                >
                                    {copiedField === 'admin_email' ? (
                                        <>
                                            <Check size={14} className="text-success" />
                                            <span className="text-success">Đã copy email</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Account 2: CMS */}
                        <div 
                            className="p-3 mb-2 rounded-3 border bg-light position-relative"
                            style={{ borderColor: '#e2e8f0' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <UserCheck size={18} className="text-primary" />
                                    <span className="fw-bold text-dark small">Tài khoản Giảng viên / Quản lý nội dung (CMS)</span>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-1 small">
                                    CMS
                                </span>
                            </div>
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white p-2 rounded border">
                                <div className="small">
                                    <div className="text-muted">Email: <strong className="text-dark font-monospace">cms@gmail.com</strong></div>
                                    <div className="text-muted">Mật khẩu: <strong className="text-dark font-monospace">123</strong></div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1 py-1 px-2"
                                    style={{ fontSize: '12px' }}
                                    onClick={() => handleCopy('cms@gmail.com', 'cms_email')}
                                    title="Copy Email CMS"
                                >
                                    {copiedField === 'cms_email' ? (
                                        <>
                                            <Check size={14} className="text-success" />
                                            <span className="text-success">Đã copy email</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Account 3: Seller */}
                        <div 
                            className="p-3 rounded-3 border bg-light position-relative"
                            style={{ borderColor: '#e2e8f0' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <UserCheck size={18} className="text-success" />
                                    <span className="fw-bold text-dark small">Tài khoản Người bán (Seller)</span>
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1 small">
                                    Seller
                                </span>
                            </div>
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white p-2 rounded border">
                                <div className="small">
                                    <div className="text-muted">Email: <strong className="text-dark font-monospace">seller1@gmail.com</strong></div>
                                    <div className="text-muted">Mật khẩu: <strong className="text-dark font-monospace">123</strong></div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-1 py-1 px-2"
                                    style={{ fontSize: '12px' }}
                                    onClick={() => handleCopy('seller1@gmail.com', 'seller_email')}
                                    title="Copy Email Seller"
                                >
                                    {copiedField === 'seller_email' ? (
                                        <>
                                            <Check size={14} className="text-success" />
                                            <span className="text-success">Đã copy email</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 px-4 pb-4 pt-2">
                        <button 
                            type="button" 
                            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            style={{ borderRadius: '10px' }}
                            onClick={onClose}
                        >
                            <span>Đã hiểu &amp; Bắt đầu trải nghiệm</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Home({ sponsoredCourses, topInstructors, enrolledCourseIds, blocks = [] }) {
    const [showNoticeModal, setShowNoticeModal] = useState(true);

    return (
        <>
            <SystemNoticeModal 
                isOpen={showNoticeModal} 
                onClose={() => setShowNoticeModal(false)} 
            />

            {blocks.map(block => (
                <BlockRenderer 
                    key={block.id} 
                    block={block} 
                    extraData={{ courses: sponsoredCourses, instructors: topInstructors, enrolledCourseIds }}
                />
            ))}
        </>
    );
}

Home.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);
