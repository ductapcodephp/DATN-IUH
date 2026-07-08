import React, { useState } from 'react';
import UploadVideoModal from '../UploadVideoModal';

export default function LessonVideoManager({ course, lesson }) {
    const video = lesson?.video;
    const isReady = video?.status === 'ready' && !!video?.url;
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎥 Học liệu Video của bài học
            </h3>
            
            {isReady ? (
                <div>
                    <video src={video.url} controls style={{ width: '100%', borderRadius: '6px', background: '#000', maxHeight: '400px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <span style={{ fontSize: '13px', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '4px', fontWeight: '500' }}>
                            <i className="fa-solid fa-circle-check"></i> Video đã sẵn sàng phát hoạt động
                        </span>
                        <button onClick={() => setShowUploadModal(true)} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                            Thay đổi Video khác
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                    {video?.status === 'processing' ? (
                        <div>
                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: '#f59e0b', marginBottom: '16px' }}></i>
                            <p style={{ fontWeight: '500', color: '#b45309' }}>Hệ thống đang thực hiện gộp mảng và đồng bộ lên máy chủ đám mây...</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tiến trình này chạy ngầm độc lập, bạn không cần treo máy chờ đợi ở đây.</span>
                        </div>
                    ) : (
                        <div>
                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '44px', marginBottom: '12px', color: '#94a3b8' }}></i>
                            <p style={{ marginBottom: '16px', fontSize: '14px' }}>Bài học cấu hình dạng Video nhưng chưa có tài nguyên được đẩy lên.</p>
                            <button onClick={() => setShowUploadModal(true)} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Tải Video Lên Ngay
                            </button>
                        </div>
                    )}
                </div>
            )}

            <UploadVideoModal
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                lesson={lesson}
                course={course}
            />
        </div>
    );
}