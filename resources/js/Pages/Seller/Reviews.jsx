import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";

function StarRating({ rating }) {
    return (
        <div className="d-flex align-items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <i 
                    key={star} 
                    className={`ri-star-fill ${star <= rating ? 'text-warning' : 'text-secondary opacity-25'}`}
                    style={{ fontSize: '1.1rem' }}
                ></i>
            ))}
            <span className="ms-2 fw-semibold text-dark">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function Reviews({ course, reviews }) {
    const [replyModal, setReplyModal] = useState({ show: false, reviewId: null, content: '', studentName: '', isEdit: false });

    const handleOpenReply = (review) => {
        setReplyModal({
            show: true,
            reviewId: review.id,
            content: review.reply_content ? review.reply_content : `@${review.user?.name || 'Học viên ẩn danh'} `,
            studentName: review.user?.name || 'Học viên ẩn danh',
            isEdit: !!review.reply_content
        });
    };

    const handleSubmitReply = () => {
        router.post(route('seller.reviews.reply', replyModal.reviewId), {
            reply_content: replyModal.content
        }, {
            onSuccess: () => setReplyModal({ show: false, reviewId: null, content: '', studentName: '', isEdit: false })
        });
    };

    return (
        <>
            <Head title="Đánh giá từ học viên" />

            <div className="page p-4">
                <div className="d-flex justify-content-between align-items-end mb-4 pb-2 border-bottom">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#111827' }}>Đánh giá: {course.title}</h2>
                        <div className="text-muted" style={{ fontSize: '0.95rem' }}>Phản hồi và chấm sao từ những người tham gia khóa học này</div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: '#fff' }}>
                    <div className="table-responsive">
                        <table className="table modern-table mb-0 align-middle">
                            <thead style={{ background: '#F9FAFB' }}>
                                <tr>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Học viên</th>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Đánh giá</th>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Bình luận</th>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Phản hồi của bạn</th>
                                    <th className="text-uppercase text-muted fw-bold text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.data.length > 0 ? reviews.data.map((review) => (
                                    <tr key={review.id} className="table-row-hover">
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <img src={review.user?.avatar ? (review.user.avatar.startsWith('http') ? review.user.avatar : `/storage/${review.user.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&background=0D8ABC&color=fff`} alt="avatar" className="rounded-circle" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                                        {review.user?.name || 'Học viên ẩn danh'}
                                                        {review.is_reported && <span className="badge bg-danger ms-2" style={{ fontSize: '0.7rem' }}>Bị báo cáo</span>}
                                                    </div>
                                                    <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}><i className="ri-time-line me-1"></i>{new Date(review.created_at).toLocaleDateString('vi-VN')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <StarRating rating={review.rating} />
                                        </td>
                                        <td style={{ padding: '20px 24px', maxWidth: '350px' }}>
                                            <div className="fst-italic text-secondary position-relative ps-3" style={{ borderLeft: '3px solid #E5E7EB', fontSize: '0.9rem', lineHeight: '1.5', maxHeight: '100px', overflowY: 'auto' }}>
                                                "{review.content}"
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', maxWidth: '280px' }}>
                                            {review.reply_content ? (
                                                <div className="text-dark p-3 rounded-3" style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', fontSize: '0.85rem', maxHeight: '100px', overflowY: 'auto' }}>
                                                    {review.reply_content}
                                                </div>
                                            ) : (
                                                <span className="text-muted fst-italic" style={{ fontSize: '0.85rem' }}>Chưa có phản hồi</span>
                                            )}
                                        </td>
                                        <td className="text-end" style={{ padding: '20px 24px', whiteSpace: 'nowrap' }}>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm('Bạn có chắc chắn muốn báo cáo vi phạm đánh giá này lên Admin?')) {
                                                        router.patch(route('seller.reviews.report', review.id));
                                                    }
                                                }}
                                                className={`btn-reply-outline me-2`}
                                                style={review.is_reported ? { color: '#6B7280', borderColor: '#D1D5DB', opacity: 0.7 } : { color: '#EF4444', borderColor: '#FCA5A5' }}
                                                title={review.is_reported ? 'Đã báo cáo vi phạm' : 'Báo cáo vi phạm'}
                                                disabled={review.is_reported}
                                            >
                                                <i className={`${review.is_reported ? 'ri-flag-fill' : 'ri-flag-line'} me-1`}></i> {review.is_reported ? 'Đã báo cáo' : 'Báo cáo'}
                                            </button>
                                            <button className="btn-reply-outline" onClick={() => handleOpenReply(review)}>
                                                <i className={review.reply_content ? "ri-edit-line me-1" : "ri-reply-line me-1"}></i> 
                                                {review.reply_content ? 'Sửa trả lời' : 'Trả lời'}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted" style={{ padding: '40px' }}>
                                            Chưa có đánh giá nào cho khóa học này.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4">
                    {reviews.total > 0 && (
                        <Pagination links={reviews.links} from={reviews.from} to={reviews.to} total={reviews.total} />
                    )}
                </div>
            </div>

            {/* Modal Trả lời */}
            {replyModal.show && (
                <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
            )}
            {replyModal.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">{replyModal.isEdit ? 'Sửa câu trả lời' : 'Trả lời đánh giá'}</h5>
                                <button type="button" className="btn-close" onClick={() => setReplyModal({ ...replyModal, show: false })}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Phản hồi tới: <span className="text-dark fw-bold">{replyModal.studentName}</span></label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={replyModal.content}
                                        onChange={(e) => setReplyModal({ ...replyModal, content: e.target.value })}
                                        placeholder="Nhập nội dung trả lời..."
                                        style={{ borderColor: '#E5E7EB', resize: 'none' }}
                                        autoFocus
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 pt-0">
                                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setReplyModal({ ...replyModal, show: false })}>Hủy</button>
                                <button type="button" className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#EA580C', borderColor: '#EA580C' }} onClick={handleSubmitReply}>
                                    {replyModal.isEdit ? 'Lưu thay đổi' : 'Gửi trả lời'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .modern-table th { border-bottom: 1px solid #E5E7EB; }
                .modern-table td { border-bottom: 1px solid #F3F4F6; }
                .table-row-hover:hover { background-color: #F9FAFB; }
                .table-row-hover { transition: background-color 0.15s ease; }
                .btn-reply-outline {
                    background: transparent;
                    color: #EA580C;
                    border: 1px solid #fed7aa;
                    border-radius: 20px;
                    padding: 6px 16px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .btn-reply-outline:hover {
                    background: #FFF7ED;
                    border-color: #EA580C;
                }
            `}</style>
        </>
    );
}

Reviews.layout = page => <SellerLayout children={page} />
