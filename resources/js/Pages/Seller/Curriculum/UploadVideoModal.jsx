import React, { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
export default function UploadVideoModal({ show, onClose, lesson, course }) {
    const { auth } = usePage().props;
    const [videoFile, setVideoFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const limitBytes = auth?.seller_storage_limit || 0;
    const usedBytes = auth?.seller_storage_used || 0;

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

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

            if (usedBytes + file.size > limitBytes && limitBytes > 0) {
                setError(`Không đủ dung lượng lưu trữ! Video cần ${formatBytes(file.size)} nhưng bạn chỉ còn ${formatBytes(Math.max(0, limitBytes - usedBytes))}.`);
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
                { 
                    extension: videoFile.name.split('.').pop(),
                    size_bytes: videoFile.size 
                }
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


    if (!show) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s' }}>
            <div style={{ background: '#fff', borderRadius: '20px', width: '500px', maxWidth: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #f8fafc, #ffffff)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Tải Video Bài Học</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>{lesson?.title}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px', padding: '4px' }} disabled={processing}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleUpload} style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                                Chọn file Video
                            </label>
                            <span style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                                Còn lại: {formatBytes(Math.max(0, limitBytes - usedBytes))}
                            </span>
                        </div>
                        
                        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px 24px', textAlign: 'center', background: '#f8fafc', transition: 'all 0.2s', position: 'relative' }}>
                            <input
                                type="file"
                                accept="video/*"
                                disabled={processing}
                                onChange={handleFileChange}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                            />
                            {!videoFile ? (
                                <>
                                    <i className="fa-solid fa-film" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '16px' }}></i>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600', color: '#475569' }}>Kéo thả hoặc nhấn để chọn video</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Hỗ trợ MP4, MOV, AVI, MKV (Tối đa 1GB)</p>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', marginBottom: '12px' }}>
                                        <i className="fa-solid fa-check" style={{ fontSize: '20px' }}></i>
                                    </div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a', wordBreak: 'break-all' }}>{videoFile.name}</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{formatBytes(videoFile.size)}</p>
                                </>
                            )}
                        </div>
                        
                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' }}>
                                <i className="fa-solid fa-circle-exclamation"></i> {error}
                            </div>
                        )}
                    </div>

                    {progress > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>
                                <span>{progress === 100 ? 'Đang xử lý...' : 'Đang tải lên...'}</span>
                                <span style={{ color: '#f97316' }}>{progress}%</span>
                            </div>
                            <div style={{ width: '100%', backgroundColor: '#f1f5f9', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#f97316', height: '100%', borderRadius: '999px', transition: 'width 0.3s ease', width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            style={{ padding: '10px 20px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background 0.2s' }}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={!videoFile || processing}
                            style={{ padding: '10px 24px', border: 'none', backgroundColor: '#f97316', color: '#fff', borderRadius: '8px', cursor: (!videoFile || processing) ? 'not-allowed' : 'pointer', opacity: (!videoFile || processing) ? 0.6 : 1, fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                        >
                            {processing ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Đang tải...</>
                            ) : (
                                <><i className="fa-solid fa-cloud-arrow-up"></i> Bắt đầu Upload</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}} />
        </div>
    );
}
