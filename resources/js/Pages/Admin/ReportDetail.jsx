import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function ReportDetail({ report }) {
    
    // Tạo route url tuỳ thuộc vào loại đối tượng bị báo cáo
    const getTargetLink = () => {
        if (!report.reportable) return null;
        
        if (report.target_type_label === 'Khóa học') {
            return route('frontend.course.detail', report.reportable.slug || report.reportable.id);
        }
        if (report.target_type_label === 'Đánh giá') {
            // Review thường gắn với Course, ta có thể link về khóa họclấy slug từ course
            if (report.reportable.course && report.reportable.course.slug) {
                return route('frontend.course.detail', report.reportable.course.slug);
            }
        }
        return null;
    };

    const targetUrl = getTargetLink();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'resolve' hoặc 'dismiss'
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleResolveClick = () => {
        if (report.target_type_label !== 'Khóa học') {
            if (confirm('Bạn có chắc chắn muốn CHẤP NHẬN báo cáo này và XÓA (Gỡ bỏ) nội dung bị báo cáo không?')) {
                setProcessing(true);
                router.post(route('admin.reports.resolve', report.id), { reason: '' }, {
                    onFinish: () => setProcessing(false)
                });
            }
        } else {
            setModalType('resolve');
            setReason('');
            setShowModal(true);
        }
    };

    const handleDismissClick = () => {
        if (report.target_type_label !== 'Khóa học') {
            if (confirm('Bạn có chắc chắn muốn TỪ CHỐI báo cáo này không?')) {
                setProcessing(true);
                router.post(route('admin.reports.dismiss', report.id), { reason: '' }, {
                    onFinish: () => setProcessing(false)
                });
            }
        } else {
            setModalType('dismiss');
            setReason('');
            setShowModal(true);
        }
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert('Vui lòng nhập lý do để thông báo cho người dùng.');
            return;
        }
        setProcessing(true);
        const actionRoute = modalType === 'resolve' ? 'admin.reports.resolve' : 'admin.reports.dismiss';
        router.post(route(actionRoute, report.id), { reason: reason }, {
            onSuccess: () => setShowModal(false),
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AdminLayout>
            <Head title={`Chi tiết Báo cáo #${report.id}`} />
            
            <div className="container-fluid px-4 py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <Link href={route('admin.reports')} className="text-decoration-none text-muted mb-2 d-inline-block">
                            <i className="fa-solid fa-arrow-left me-1"></i> Quay lại danh sách
                        </Link>
                        <h2 className="mb-0 fw-bold">Chi tiết Báo cáo #{report.id}</h2>
                    </div>
                    <div>
                        {report.status === 'pending' && <span className="badge bg-warning text-dark fs-6 px-3 py-2">Đang chờ</span>}
                        {report.status === 'reviewed' && <span className="badge bg-success fs-6 px-3 py-2">Đã giải quyết</span>}
                        {report.status === 'dismissed' && <span className="badge bg-secondary fs-6 px-3 py-2">Đã từ chối</span>}
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-lg-8">
                        {/* Thông tin báo cáo chính */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="mb-0 fw-bold"><i className="fa-solid fa-circle-info text-primary me-2"></i> Thông tin Báo cáo</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="row mb-4">
                                    <div className="col-sm-4 text-muted fw-semibold">Người báo cáo:</div>
                                    <div className="col-sm-8 fw-bold text-dark">{report.reporter?.name || 'Người dùng ẩn danh'}</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-4 text-muted fw-semibold">Lý do báo cáo:</div>
                                    <div className="col-sm-8 text-danger fw-bold">{report.reason}</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-4 text-muted fw-semibold">Chi tiết bổ sung:</div>
                                    <div className="col-sm-8">
                                        <div className="p-3 bg-light rounded text-dark" style={{ minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                                            {report.details || <span className="text-muted fst-italic">Không cung cấp chi tiết thêm.</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-4 text-muted fw-semibold">Thời gian báo cáo:</div>
                                    <div className="col-sm-8 text-dark">
                                        {new Date(report.created_at).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin đối tượng bị báo cáo */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold"><i className="fa-solid fa-crosshairs text-danger me-2"></i> Đối tượng bị báo cáo</h5>
                                <span className="badge bg-light text-dark border px-3 py-2 fs-6">{report.target_type_label}</span>
                            </div>
                            <div className="card-body p-4">
                                <div className="row mb-4">
                                    <div className="col-sm-4 text-muted fw-semibold">Tên/Tiêu đề đối tượng:</div>
                                    <div className="col-sm-8 fw-bold text-dark">{report.target_name || 'Không xác định'}</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-sm-4 text-muted fw-semibold">Nội dung trích đoạn:</div>
                                    <div className="col-sm-8">
                                        <div className="p-3 border border-warning-subtle bg-warning-subtle rounded text-dark fst-italic">
                                            "{report.target_content || 'Không có nội dung văn bản cụ thể.'}"
                                        </div>
                                    </div>
                                </div>
                                {targetUrl && (
                                    <div className="row mt-4 pt-3 border-top">
                                        <div className="col-12 text-center">
                                            <a href={targetUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary px-4 fw-bold rounded-pill">
                                                <i className="fa-solid fa-arrow-up-right-from-square me-2"></i> Truy cập Đối tượng bị báo cáo (Xem trực tiếp)
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '90px' }}>
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="mb-0 fw-bold"><i className="fa-solid fa-gavel text-warning me-2"></i> Xử lý Báo cáo</h5>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-4">
                                    Vui lòng kiểm tra kỹ nội dung bị báo cáo trước khi đưa ra quyết định xử lý.
                                </p>
                                
                                {report.status === 'pending' ? (
                                    <div className="d-grid gap-3">
                                        <button 
                                            className="btn btn-success fw-bold py-2 rounded-3 shadow-sm"
                                            onClick={handleResolveClick}
                                            disabled={processing}
                                        >
                                            {processing ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-check me-2"></i>}
                                            Chấp nhận & Xử lý (Gỡ bỏ nội dung)
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary fw-bold py-2 rounded-3"
                                            onClick={handleDismissClick}
                                            disabled={processing}
                                        >
                                            <i className="fa-solid fa-xmark me-2"></i> Từ chối (Báo cáo sai)
                                        </button>
                                    </div>
                                ) : (
                                    <div className="alert alert-info border-0 rounded-3 text-center mb-0">
                                        Báo cáo này đã được đóng và không thể thay đổi trạng thái.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Xử lý Báo cáo Khóa học */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-bottom-0 pt-4 pb-0 px-4">
                                <h5 className="modal-title fw-bold">
                                    {modalType === 'resolve' ? 'Lý do Gỡ bỏ Khóa học' : 'Từ chối Báo cáo'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleModalSubmit}>
                                <div className="modal-body px-4 py-3">
                                    <p className="text-muted small mb-3">
                                        {modalType === 'resolve' 
                                            ? 'Hệ thống sẽ xóa mềm khóa học và gửi email thông báo gỡ bỏ kèm lý do này tới Giảng viên (người tạo khóa học).'
                                            : 'Vui lòng nhập lý do từ chối. Hệ thống sẽ gửi email thông báo kèm lý do này đến người dùng đã gửi báo cáo.'
                                        }
                                    </p>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            {modalType === 'resolve' ? 'Lý do gỡ bỏ' : 'Lý do từ chối'} <span className="text-danger">*</span>
                                        </label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4" 
                                            placeholder={modalType === 'resolve' ? 'Ví dụ: Khóa học chứa nội dung vi phạm bản quyền...' : 'Ví dụ: Nội dung không vi phạm tiêu chuẩn cộng đồng...'}
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pb-4 px-4">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className={modalType === 'resolve' ? 'btn btn-danger px-4' : 'btn btn-primary px-4'} disabled={processing}>
                                        {processing ? 'Đang gửi...' : 'Xác nhận & Gửi Email'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
