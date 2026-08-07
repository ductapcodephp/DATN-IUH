import React from 'react';

export default function CheatWarningModal({ show, message, onClose }) {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-danger text-white border-0 py-3">
                        <h5 className="modal-title fw-bold">
                            <i className="fa-solid fa-triangle-exclamation me-2"></i>
                            Cảnh báo học tập
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center py-4 px-4">
                        <p className="mb-0 fs-5 text-dark fw-medium">{message}</p>
                        <p className="text-muted mt-2 mb-0" style={{ fontSize: '14px' }}>Việc tua video quá mức cho phép sẽ bị ghi nhận để đảm bảo chất lượng học tập.</p>
                    </div>
                    <div className="modal-footer justify-content-center border-0 bg-light py-3">
                        <button type="button" className="btn btn-dark px-5 py-2 fw-bold rounded-pill" onClick={onClose}>
                            Đã hiểu & Tiếp tục học
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
