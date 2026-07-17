import React from 'react';
import OverlayPanel from './OverlayPanel';

export default function NotesPanel({ isOpen, onClose, activeLesson }) {
    return (
        <OverlayPanel isOpen={isOpen} onClose={onClose} title="Ghi chú của tôi">
            <div className="d-flex gap-3 mb-4 pb-3 border-bottom">
                <select className="form-select form-select-sm w-auto shadow-none fw-medium text-dark bg-light border-0 rounded-pill px-3 py-2">
                    <option>Trong chương hiện tại</option>
                    <option>Trong tất cả các chương</option>
                </select>
                <select className="form-select form-select-sm w-auto shadow-none fw-medium text-dark bg-light border-0 rounded-pill px-3 py-2">
                    <option>Mới nhất</option>
                    <option>Cũ nhất</option>
                </select>
            </div>

            <div className="notes-list">
                <div className="learn-note-item group">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="learn-note-time-badge">05:23</div>
                        <div className="d-flex gap-2 opacity-50">
                            <i className="fa-solid fa-pen cursor-pointer p-1"></i>
                            <i className="fa-solid fa-trash cursor-pointer p-1 text-danger"></i>
                        </div>
                    </div>
                    <div className="fw-semibold mb-1" style={{ color: '#fd7e14' }}>{activeLesson?.title || 'Bài học 1'}</div>
                    <div className="text-dark" style={{ fontSize: '15px' }}>
                        Phần này cần xem lại kĩ cách dùng closure để tránh bị rò rỉ bộ nhớ.
                    </div>
                </div>

                <div className="learn-note-item group">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="learn-note-time-badge">12:05</div>
                        <div className="d-flex gap-2 opacity-50">
                            <i className="fa-solid fa-pen cursor-pointer p-1"></i>
                            <i className="fa-solid fa-trash cursor-pointer p-1 text-danger"></i>
                        </div>
                    </div>
                    <div className="fw-semibold mb-1" style={{ color: '#fd7e14' }}>{activeLesson?.title || 'Bài học 1'}</div>
                    <div className="text-dark" style={{ fontSize: '15px' }}>
                        Nhớ ghi chú: hàm map trả về mảng mới, forEach thì không.
                    </div>
                </div>
            </div>
        </OverlayPanel>
    );
}
