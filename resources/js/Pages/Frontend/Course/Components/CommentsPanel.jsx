import React, { useState, useEffect } from 'react';
import OverlayPanel from './OverlayPanel';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

const renderCommentContent = (content, parentName) => {
    if (!parentName || !content) return content;
    
    const tag = `@${parentName}`;
    if (content.includes(tag)) {
        const parts = content.split(tag);
        return (
            <>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <span className="fw-bold text-primary" style={{ backgroundColor: '#e7f1ff', padding: '2px 4px', borderRadius: '4px' }}>
                                {tag}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </>
        );
    }
    
    return content;
};

// Recursive Component for rendering comments
const CommentNode = ({ comment, onReply, onReport, authUser, parentName }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleOpenReply = () => {
        setReplyContent(`@${comment.user?.name} `);
        setShowReplyForm(!showReplyForm);
    };

    const handleSubmitReply = () => {
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent, () => {
            setReplyContent('');
            setShowReplyForm(false);
        });
    };

    return (
        <div className="mb-3">
            <div className="d-flex gap-3">
                <div className="learn-comment-avatar">
                    <img 
                        src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=random`} 
                        className="w-100 h-100 rounded-circle" 
                        alt="avatar" 
                    />
                </div>
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                        <span className="learn-comment-author fw-bold" style={{ fontSize: '14px' }}>{comment.user?.name}</span>
                        <span className="learn-comment-meta text-muted" style={{ fontSize: '12px' }}>· {new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="learn-comment-text mt-1" style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                        {renderCommentContent(comment.content, parentName)}
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-1">
                        <span className="learn-comment-actions text-primary cursor-pointer fw-semibold" style={{ fontSize: '13px' }} onClick={handleOpenReply}>Phản hồi</span>
                        <span className="learn-comment-actions text-danger cursor-pointer fw-semibold" style={{ fontSize: '13px' }} onClick={() => onReport(comment)}>Báo cáo</span>
                    </div>
                    
                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3 mb-3 d-flex gap-2">
                            <div className="learn-comment-avatar" style={{ width: '30px', height: '30px' }}>
                                <img src={authUser?.avatar || `https://ui-avatars.com/api/?name=${authUser?.name}&background=random`} className="w-100 h-100 rounded-circle" alt="avatar" />
                            </div>
                            <div className="flex-grow-1 border rounded-3 bg-white overflow-hidden">
                                <textarea 
                                    autoFocus
                                    className="form-control border-0 shadow-none p-2" 
                                    rows="1" 
                                    placeholder={`Trả lời ${comment.user?.name}...`} 
                                    style={{ fontSize: '13px' }}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                ></textarea>
                                <div className="d-flex justify-content-end p-2 bg-light border-top">
                                    <button className="btn btn-sm btn-light me-2" onClick={() => setShowReplyForm(false)}>Hủy</button>
                                    <button className="btn text-white btn-sm fw-semibold rounded-pill px-3" style={{ backgroundColor: '#fd7e14' }} onClick={handleSubmitReply}>Gửi</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Render children recursively */}
                    {comment.children && comment.children.length > 0 && (
                        <div className="mt-3">
                            {comment.children.map(child => (
                                <CommentNode key={child.id} comment={child} onReply={onReply} onReport={onReport} authUser={authUser} parentName={comment.user?.name} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function CommentsPanel({ isOpen, onClose, lessonId, courseSlug, reportTopics = [] }) {
    const { auth } = usePage().props;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Báo cáo state
    const [reportingComment, setReportingComment] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    useEffect(() => {
        if (isOpen && lessonId) {
            fetchComments();
        }
    }, [isOpen, lessonId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(route('frontend.course.comments.get', { slug: courseSlug, lessonId: lessonId }));
            if (res.data.success) {
                setComments(res.data.comments);
            }
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (parentId = null, content, onSuccess = null) => {
        try {
            const res = await axios.post(route('frontend.course.comments.add', { slug: courseSlug, lessonId: lessonId }), {
                content: content,
                parent_id: parentId
            });
            if (res.data.success) {
                fetchComments();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Không thể gửi bình luận. Vui lòng thử lại!',
                icon: 'error',
                confirmButtonColor: '#ea580c',
            });
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportReason) return;
        setIsReporting(true);
        try {
            const res = await axios.post(route('frontend.course.comments.report', { comment: reportingComment.id }), {
                reason: reportReason,
                details: reportDetails,
            });
            if (res.data.success) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cảm ơn bạn! Đã gửi báo cáo bình luận thành công.',
                    icon: 'success',
                    confirmButtonColor: '#ea580c',
                });
                setReportingComment(null);
                setReportReason('');
                setReportDetails('');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo, vui lòng thử lại.';
            Swal.fire({
                title: 'Thông báo',
                text: errorMsg,
                icon: 'warning',
                confirmButtonColor: '#ea580c',
            });
        } finally {
            setIsReporting(false);
        }
    };

    // Calculate total comments by flattening the tree recursively
    const countComments = (nodes) => {
        let count = 0;
        nodes.forEach(node => {
            count += 1;
            if (node.children) {
                count += countComments(node.children);
            }
        });
        return count;
    };

    const totalComments = countComments(comments);

    return (
        <OverlayPanel isOpen={isOpen} onClose={onClose} title={`${totalComments} bình luận`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold" style={{ fontSize: '15px' }}>{totalComments} bình luận</span>
                <span className="text-muted" style={{ fontSize: '13px', fontStyle: 'italic' }}>
                    (Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé)
                </span>
            </div>

            {/* Main Comment Input */}
            <div className="d-flex gap-3 mb-4 border-bottom pb-4">
                <div className="learn-comment-avatar">
                    <img src={auth?.user?.avatar || `https://ui-avatars.com/api/?name=${auth?.user?.name}&background=random`} className="w-100 h-100 rounded-circle" alt="avatar" />
                </div>
                <div className="flex-grow-1">
                    <div className="comment-compose border rounded-3 bg-white overflow-hidden">
                        <textarea 
                            className="form-control border-0 shadow-none p-3" 
                            rows="2" 
                            placeholder="Nhập bình luận mới của bạn..." 
                            style={{ fontSize: '14px' }}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <div className="d-flex justify-content-end p-2 border-top bg-light">
                            <button 
                                className="btn text-white btn-sm fw-semibold px-4 rounded-pill" 
                                style={{ backgroundColor: '#fd7e14' }}
                                onClick={() => {
                                    if (newComment.trim()) {
                                        handlePostComment(null, newComment, () => setNewComment(''));
                                    }
                                }}
                            >
                                Gửi bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <div className="text-center text-muted py-4">Đang tải bình luận...</div>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentNode 
                            key={comment.id} 
                            comment={comment} 
                            onReply={handlePostComment}
                            onReport={(c) => setReportingComment(c)}
                            authUser={auth?.user}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted py-4">Chưa có bình luận nào cho bài học này. Hãy là người đầu tiên thảo luận!</div>
                )}
            </div>

            {/* Modal Report */}
            {reportingComment && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header border-bottom-0 bg-light pb-2">
                                <h5 className="modal-title fw-bold">Báo cáo bình luận</h5>
                                <button type="button" className="btn-close" onClick={() => setReportingComment(null)}></button>
                            </div>
                            <form onSubmit={handleReportSubmit}>
                                <div className="modal-body pt-0">
                                    <p className="text-muted small mb-3">
                                        Báo cáo bình luận của <strong>{reportingComment.user?.name}</strong>. Admin sẽ xem xét và xử lý.
                                    </p>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Lý do báo cáo <span className="text-danger">*</span></label>
                                        <select
                                            className="form-select orange-input-focus"
                                            value={reportReason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn lý do --</option>
                                            {reportTopics.map((t, idx) => (
                                                <option key={idx} value={t.name || t}>{t.name || t}</option>
                                            ))}
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Chi tiết thêm (không bắt buộc)</label>
                                        <textarea
                                            className="form-control orange-input-focus"
                                            rows="3"
                                            placeholder="Mô tả rõ hơn về vi phạm..."
                                            value={reportDetails}
                                            onChange={(e) => setReportDetails(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setReportingComment(null)}>Hủy</button>
                                    <button type="submit" className="btn btn-danger rounded-pill px-4" disabled={isReporting}>
                                        {isReporting ? 'Đang gửi...' : 'Gửi báo cáo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </OverlayPanel>
    );
}
