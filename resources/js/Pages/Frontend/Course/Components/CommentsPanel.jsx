import React, { useState, useEffect } from 'react';
import OverlayPanel from './OverlayPanel';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

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
const CommentNode = ({ comment, onReply, authUser, parentName }) => {
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
                                <CommentNode key={child.id} comment={child} onReply={onReply} authUser={authUser} parentName={comment.user?.name} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function CommentsPanel({ isOpen, onClose, lessonId, courseSlug }) {
    const { auth } = usePage().props;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

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
                // Refresh comments
                fetchComments();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            alert('Không thể gửi bình luận. Vui lòng thử lại!');
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
                            authUser={auth?.user}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted py-4">Chưa có bình luận nào cho bài học này. Hãy là người đầu tiên thảo luận!</div>
                )}
            </div>
        </OverlayPanel>
    );
}
