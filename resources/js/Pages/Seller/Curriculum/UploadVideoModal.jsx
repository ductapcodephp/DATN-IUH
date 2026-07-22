import React, { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
export default function UploadVideoModal({ show, onClose, lesson, course }) {
    const [videoFile, setVideoFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const abortControllerRef = useRef(null);

    // --- 2. CÁC HÀM XỬ LÝ SỰ KIỆN (Event Handlers) ---

    /**
     * Hàm xử lý khi người dùng chọn file từ máy tính
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên người dùng chọn
        if (file) {

            if (file.size > 1024 * 1024 * 1024) {
                setError('File vượt quá giới hạn cho phép (Tối đa 1GB).');
                setVideoFile(null);
                return;
            }
            setError('');
            setVideoFile(file);
        }
    };


    const handleUpload = async (e) => {
        e.preventDefault();
        if (!videoFile) return;

        setProcessing(true);
        setError('');
        setProgress(0);

        try {
            const presignedRes = await axios.post(
                route('seller.courses.curriculum.lessons.video.presigned-url', [course?.id, lesson?.id]), 
                { extension: videoFile.name.split('.').pop() }
            );
            const { url, key } = presignedRes.data;

            const duration = await new Promise((resolve) => {
                const videoElement = document.createElement('video');
                videoElement.preload = 'metadata';
                
                videoElement.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(videoElement.src);
                    resolve(Math.round(videoElement.duration));
                };
                videoElement.onerror = () => {
                    resolve(0);
                };
                videoElement.src = URL.createObjectURL(videoFile);
            });

            abortControllerRef.current = new AbortController();

            await axios.put(url, videoFile, {
                headers: { 'Content-Type': videoFile.type },
                signal: abortControllerRef.current.signal,
                onUploadProgress: (progressEvent) => {
                    const currentProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(currentProgress);
                }
            });

            await axios.post(                                                                                                                            
                route('seller.courses.curriculum.lessons.video.confirm', [course?.id, lesson?.id]),                                                     
                {                                                                                                                                        
                    key: key,                                                                                                                            
                    duration_seconds: duration,                                                                                                          
                    size_bytes: videoFile.size,                                                                                                          
                    mime_type: videoFile.type                                                                                                            
                }                                                                                                                                        
            );                                                                                                                                           

            setVideoFile(null); 
            setProgress(0); 
            setProcessing(false); 
            onClose(); 
            router.reload({ preserveScroll: true }); 
            
            Swal.fire({
                icon: 'success',
                title: 'Tải lên thành công!',
                text: 'Hệ thống đã nhận diện video.',
                showConfirmButton: false,
                timer: 2000
            });

        } catch (err) {
            if (axios.isCancel(err) || err.name === 'CanceledError') {
                console.log("Đã hủy tiến trình upload.");
                return;
            }
            console.error("Lỗi upload:", err); 
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải lên Cloudflare R2.'); 
            setProcessing(false); 
            setProgress(0); 
        }
    };

    const handleClose = () => {
        if (processing && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setVideoFile(null);
        setProgress(0);
        setError('');
        setProcessing(false);
        onClose();
    };


    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={handleUpload} style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
                    Tải video bài học: <span style={{ color: 'var(--accent)' }}>{lesson?.title}</span>
                </h2>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Chọn file Video của bạn (Hỗ trợ mp4, mov, avi, mkv, max 1GB)
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        disabled={processing}
                        onChange={handleFileChange}
                        style={{ display: 'block', width: '100%', fontSize: '14px', color: '#4b5563' }}
                    />
                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{error}</div>
                    )}
                </div>


                {progress > 0 && (
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '10px', marginTop: '16px', overflow: 'hidden' }}>
                        <div
                            style={{ backgroundColor: 'var(--accent)', height: '10px', borderRadius: '9999px', transition: 'all 0.3s ease', width: `${progress}%` }}
                        ></div>
                        <span style={{ display: 'block', textAlign: 'right', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                            {progress === 100 ? 'Đang đưa vào hàng đợi xử lý ngầm...' : `Đang tải lên: ${progress}%`}
                        </span>
                    </div>
                )}


                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={processing}
                        style={{ padding: '8px 16px', border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={!videoFile || processing}
                        style={{ padding: '8px 16px', border: 'none', backgroundColor: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', opacity: (!videoFile || processing) ? 0.5 : 1 }}
                    >
                        {processing ? 'Đang tải lên...' : 'Bắt đầu Upload'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
