import React from 'react';
import OverlayPanel from './OverlayPanel';

export default function CommentsPanel({ isOpen, onClose }) {
    return (
        <OverlayPanel isOpen={isOpen} onClose={onClose} title="25 bình luận">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold" style={{ fontSize: '15px' }}>25 bình luận</span>
                <span className="text-muted" style={{ fontSize: '13px', fontStyle: 'italic' }}>
                    (Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé)
                </span>
            </div>

            <div className="d-flex gap-3 mb-4 border-bottom pb-4">
                <div className="learn-comment-avatar">T</div>
                <div className="flex-grow-1">
                    <div className="comment-compose border rounded-3 bg-white overflow-hidden">
                        <textarea className="form-control border-0 shadow-none p-3" rows="2" placeholder="Nhập bình luận mới của bạn..." style={{ fontSize: '14px' }}></textarea>
                        <div className="d-flex justify-content-end p-2 border-top bg-light">
                            <button className="btn text-white btn-sm fw-semibold px-4 rounded-pill" style={{ backgroundColor: '#fd7e14' }}>
                                Gửi bình luận
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="comments-list">
                {/* Dummy comment 1 */}
                <div className="d-flex gap-3 mb-4">
                    <div className="learn-comment-avatar">
                        <img src="https://ui-avatars.com/api/?name=User&background=random" className="w-100 h-100 rounded-circle" alt="avatar" />
                    </div>
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="learn-comment-author">Nguyễn Văn A</span>
                            <span className="learn-comment-meta">· 2 giờ trước</span>
                        </div>
                        <div className="learn-comment-text">
                            Khóa học quá tuyệt vời, anh giải thích rất dễ hiểu ạ. Cảm ơn F8!
                        </div>
                        <div className="d-flex align-items-center gap-3 mt-1">
                            <span className="learn-comment-actions">Thích</span>
                            <span className="learn-comment-actions">Phản hồi</span>
                            <i className="fa-solid fa-ellipsis text-muted ms-2 cursor-pointer"></i>
                        </div>
                    </div>
                </div>
                {/* Dummy comment 2 */}
                <div className="d-flex gap-3 mb-4">
                    <div className="learn-comment-avatar">
                        <img src="https://ui-avatars.com/api/?name=Huy&background=random" className="w-100 h-100 rounded-circle" alt="avatar" />
                    </div>
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="learn-comment-author">Trần Huy</span>
                            <span className="learn-comment-meta">· 5 giờ trước</span>
                        </div>
                        <div className="learn-comment-text">
                            Khúc phút thứ 5 bị lỗi âm thanh phải không mọi người?
                        </div>
                        <div className="d-flex align-items-center gap-3 mt-1">
                            <span className="learn-comment-actions">Thích</span>
                            <span className="learn-comment-actions">Phản hồi</span>
                            <i className="fa-solid fa-ellipsis text-muted ms-2 cursor-pointer"></i>
                        </div>
                    </div>
                </div>
            </div>
        </OverlayPanel>
    );
}
