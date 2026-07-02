import React, { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

// 🔧 FIX (chống đụng thư mục chunk cũ): mỗi "lượt upload mới" của 1 file được
// gắn 1 UUID riêng, lưu tạm ở sessionStorage. Nếu user refresh trang giữa lúc
// đang upload, vẫn lấy lại đúng UUID cũ để resume tiếp (không mất tiến độ).
// Nhưng nếu là một lượt upload hoàn toàn mới (đóng tab, xong rồi up lại,...)
// thì sẽ luôn được cấp UUID mới -> không bao giờ đụng lại thư mục chunk cũ
// (kể cả khi cùng lesson, cùng tên file, cùng size).
const getUploadSessionId = (lessonId, file) => {
    const storageKey = `upload_session_${lessonId}_${file.name}_${file.size}`;
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
        sessionId = (window.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`);
        sessionStorage.setItem(storageKey, sessionId);
    }

    return { sessionId, storageKey };
};

export default function UploadVideoModal({ show, onClose, lesson, course }) {
    const [videoFile, setVideoFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const cancelTokenRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Giới hạn dung lượng tối đa 1GB (1024000 KB)
            if (file.size > 1024000 * 1024) {
                setError('File vượt quá giới hạn cho phép (Tối đa 1GB).');
                setVideoFile(null);
                return;
            }
            setError('');
            setVideoFile(file);
        }
    };

  const uploadChunks = async (e) => {
        e.preventDefault();
        if (!videoFile) return;

        setProcessing(true);
        setError('');
        setProgress(0);

        try {
            // 🔥 Đẩy toàn bộ biến vào trong try để an toàn tuyệt đối
            const chunkSize = 5 * 1024 * 1024; // 5MB
            const totalChunks = Math.ceil(videoFile.size / chunkSize);

            // 🔧 FIX: fileUid giờ dựa trên session UUID (xem getUploadSessionId ở trên)
            // thay vì chỉ ghép tên + size. Vẫn resume được nếu refresh giữa lúc
            // upload, nhưng không bao giờ đụng lại thư mục chunk cũ của lượt
            // upload trước (kể cả khi up lại đúng file đó).
            const { sessionId, storageKey } = getUploadSessionId(lesson.id, videoFile);
            const fileUid = `vid_${lesson.id}_${sessionId}`;

            // 1. Gọi API Check (Nếu Ziggy lỗi nó sẽ văng ở ngay dòng này)
            const checkResponse = await axios.get(
                route('seller.courses.curriculum.lessons.upload.check', [course?.id, lesson?.id]),
                { params: { file_uid: fileUid } }
            );
            
            const uploadedChunksFromServer = checkResponse.data.uploaded_chunks || [];

            // 🔧 FIX: theo dõi response của request CUỐI CÙNG thực sự được gửi lên,
            // để biết server có thật sự dispatch job xử lý video hay chưa.
            // Trước đây code cứ alert "thành công" ngay khi for-loop chạy hết,
            // bất kể response thật trả về status gì (chunk_saved hay processing),
            // nên dù backend chưa dispatch job, người dùng vẫn thấy "thành công".
            let lastResponseStatus = null;

            // 2. Bắt đầu vòng lặp up từng mảnh
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                if (uploadedChunksFromServer.includes(chunkIndex)) {
                    const currentProgress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                    setProgress(currentProgress);
                    continue;
                }

                const start = chunkIndex * chunkSize;
                const end = Math.min(start + chunkSize, videoFile.size);
                const chunk = videoFile.slice(start, end);

                const formData = new FormData();
                formData.append('video_chunk', chunk);
                formData.append('chunk_index', chunkIndex);
                formData.append('total_chunks', totalChunks);
                formData.append('file_uid', fileUid);
                formData.append('filename', videoFile.name);

                cancelTokenRef.current = axios.CancelToken.source();

                const res = await axios.post(
                    route('seller.courses.curriculum.lessons.upload', [course?.id, lesson?.id]),
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        cancelToken: cancelTokenRef.current.token,
                    }
                );

                lastResponseStatus = res?.data?.status || null;

                const currentProgress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                setProgress(currentProgress);
            }

            // Hoàn tất
            setVideoFile(null);
            setProgress(0);
            setProcessing(false);

            // 🔧 FIX: chỉ báo "thành công, đang xử lý ngầm" khi server thật sự xác
            // nhận status === 'processing' (nghĩa là job đã được dispatch).
            // Nếu mọi chunk đều bị skip do đã upload đủ từ trước (resume), coi như
            // server đã xử lý ở lượt trước đó rồi nên vẫn báo thành công.
            const allChunksWereAlreadyUploaded =
                lastResponseStatus === null && uploadedChunksFromServer.length === totalChunks;

            if (lastResponseStatus === 'processing' || allChunksWereAlreadyUploaded) {
                // 🔧 FIX: dọn session sau khi đã xử lý xong, để lần upload tiếp
                // theo (dù cùng file) luôn bắt đầu bằng 1 session/thư mục mới.
                sessionStorage.removeItem(storageKey);

                onClose();
                router.reload({ preserveScroll: true });
                Swal.fire({
                    icon: 'success',
                    title: 'Tải lên thành công!',
                    text: 'Hệ thống đang xử lý video ngầm.',
                    showConfirmButton: false,
                    timer: 2000
                });
            } else {
                // Trường hợp này có nghĩa là: tất cả request đều 200 OK, nhưng vì
                // lý do gì đó (count chunk lệch, mất chunk...) server vẫn chưa
                // dispatch job xử lý. Báo thẳng cho người dùng biết thay vì im
                // lặng coi như xong, để không bị "tưởng thành công" như cũ.
                setError(
                    'Đã upload xong các mảnh nhưng server chưa xác nhận đưa video vào hàng đợi xử lý. ' +
                    'Vui lòng thử tải lại trang và upload lại file này.'
                );
            }

        } catch (err) {
            // 🔥 CHỖ NÀY SẼ ÉP TRÌNH DUYỆT PHẢI NÓI RA LỖI GÌ!
            console.error("LỖI GỐC NẰM Ở ĐÂY NÀY:", err);

            if (axios.isCancel(err)) {
                console.log('Upload bị hủy.');
            } else {
                // Lấy thông báo lỗi từ server, hoặc lỗi của Ziggy
                const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra.';
                setError(errorMsg);
                setProgress(0);
            }
            setProcessing(false);
        }
    };

    const handleClose = () => {
        if (processing && cancelTokenRef.current) {
            cancelTokenRef.current.cancel('User closed modal');
        }
        setVideoFile(null);
        setProgress(0);
        setError('');
        setProcessing(false);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={uploadChunks} style={{ padding: '24px' }}>
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
                            {progress === 100 ? 'Đang đưa vào hàng đợi xử lý ngầm...' : `Đang upload: ${progress}%`}
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
                        {processing ? 'Đang gửi từng mảnh...' : 'Bắt đầu Upload'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}