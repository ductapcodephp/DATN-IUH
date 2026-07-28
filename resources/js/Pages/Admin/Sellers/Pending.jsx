import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function PendingSellers({ profiles }) {
    const { flash, errors } = usePage().props;
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = (id) => {
        if (confirm('Bạn có chắc chắn muốn duyệt hồ sơ giảng viên này? Họ sẽ được cấp quyền đăng khóa học ngay lập tức.')) {
            router.post(route('admin.sellers.approve', id), {}, {
                preserveScroll: true,
                onBefore: () => setIsProcessing(true),
                onFinish: () => setIsProcessing(false)
            });
        }
    };

    const openRejectModal = (id) => {
        setSelectedProfileId(id);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleReject = (e) => {
        e.preventDefault();
        if (!rejectReason.trim()) return;

        router.post(route('admin.sellers.reject', selectedProfileId), {
            reject_reason: rejectReason
        }, {
            preserveScroll: true,
            onBefore: () => setIsProcessing(true),
            onSuccess: () => setShowRejectModal(false),
            onFinish: () => setIsProcessing(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="Duyệt Hồ Sơ Giảng Viên" />
            
            <div className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0">Danh sách hồ sơ chờ duyệt</h4>
                </div>

                {flash.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <i className="fa-solid fa-check-circle me-2"></i>{flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                
                {errors.system && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="fa-solid fa-triangle-exclamation me-2"></i>{errors.system}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-muted small">
                                    <tr>
                                        <th className="ps-4">Người dùng</th>
                                        <th>Chức danh</th>
                                        <th>Thông tin thanh toán</th>
                                        <th>Giấy tờ tùy thân</th>
                                        <th className="text-end pe-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.length > 0 ? (
                                        profiles.map(profile => {
                                            const defaultBank = profile.user?.bank_accounts?.find(b => b.is_default) || profile.user?.bank_accounts?.[0];
                                            return (
                                            <tr key={profile.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <i className="fa-solid fa-user"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0 fw-bold">{profile.user?.name || 'Unknown'}</h6>
                                                            <span className="small text-muted">{profile.user?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="fw-bold">{profile.headline}</span>
                                                    <br />
                                                    <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                                        {profile.website ? <a href={profile.website} target="_blank" rel="noreferrer" className="text-decoration-none">{profile.website}</a> : 'Không có website'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="small">
                                                        {defaultBank ? (
                                                            <>
                                                                <strong>NH:</strong> {defaultBank.bank_name} <br />
                                                                <strong>STK:</strong> {defaultBank.account_number} <br />
                                                                <strong>Chủ:</strong> {defaultBank.account_name}
                                                            </>
                                                        ) : (
                                                            <span className="text-muted">Chưa cập nhật NH</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        {profile.identity_card_front ? (
                                                            <a href={`/storage/${profile.identity_card_front}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" title="CCCD Mặt trước">
                                                                <i className="fa-regular fa-image"></i> Mặt trước
                                                            </a>
                                                        ) : (
                                                            <span className="badge bg-secondary-subtle text-secondary">Không có</span>
                                                        )}
                                                        {profile.identity_card_back && (
                                                            <a href={`/storage/${profile.identity_card_back}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" title="CCCD Mặt sau">
                                                                <i className="fa-regular fa-image"></i> Mặt sau
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button 
                                                        className="btn btn-sm btn-success me-2 rounded-pill px-3" 
                                                        onClick={() => handleApprove(profile.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        <i className="fa-solid fa-check me-1"></i> Duyệt
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger rounded-pill px-3" 
                                                        onClick={() => openRejectModal(profile.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        <i className="fa-solid fa-xmark me-1"></i> Từ chối
                                                    </button>
                                                </td>
                                            </tr>
                                        )})
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                <i className="fa-regular fa-folder-open fs-1 mb-3 opacity-50 d-block"></i>
                                                Hiện chưa có hồ sơ nào cần xét duyệt
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal using standard HTML/CSS */}
            {showRejectModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <form onSubmit={handleReject}>
                                    <div className="modal-header border-0 pb-0">
                                        <h5 className="modal-title fw-bold text-danger">
                                            <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                            Từ chối Hồ sơ
                                        </h5>
                                        <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p className="text-muted small mb-3">Vui lòng cung cấp lý do từ chối để người dùng có thể cập nhật lại hồ sơ một cách chính xác.</p>
                                        
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small">Lý do từ chối <span className="text-danger">*</span></label>
                                            <textarea 
                                                className={`form-control ${errors.reject_reason ? 'is-invalid' : ''}`}
                                                rows="4"
                                                placeholder="Ví dụ: Hình ảnh CCCD mặt trước bị mờ, vui lòng chụp lại rõ nét hơn..."
                                                value={rejectReason}
                                                onChange={e => setRejectReason(e.target.value)}
                                                autoFocus
                                            ></textarea>
                                            {errors.reject_reason && (
                                                <div className="invalid-feedback">{errors.reject_reason}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 pt-0">
                                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowRejectModal(false)}>Hủy</button>
                                        <button type="submit" className="btn btn-danger rounded-pill px-4 shadow-sm" disabled={isProcessing || !rejectReason.trim()}>
                                            {isProcessing ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-paper-plane me-2"></i>}
                                            Gửi lý do từ chối
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
