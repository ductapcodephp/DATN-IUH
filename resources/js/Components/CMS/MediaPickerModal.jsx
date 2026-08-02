import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

export default function MediaPickerModal({ show, onClose, onSelect }) {
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [galleries, setGalleries] = useState([]);
    const [currentGalleryId, setCurrentGalleryId] = useState(null);

    useEffect(() => {
        if (show) {
            setPictures([]);
            setPage(1);
            setHasMore(true);
            setCurrentGalleryId(null);
            fetchGalleries();
            fetchMedia(1, null);
        }
    }, [show]);

    const fetchGalleries = async () => {
        try {
            const res = await axios.get(route('cms.media.galleries.ajax'));
            setGalleries(res.data);
        } catch (e) {
            console.error("Failed to fetch galleries", e);
        }
    };

    const fetchMedia = async (pageNum, galId = currentGalleryId) => {
        setLoading(true);
        try {
            const res = await axios.get(route('cms.media.ajax'), {
                params: { page: pageNum, per_page: 24, gallery_id: galId }
            });
            const data = res.data;
            if (pageNum === 1) {
                setPictures(data.data);
            } else {
                setPictures(prev => [...prev, ...data.data]);
            }
            if (data.current_page >= data.last_page) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch media", error);
        }
        setLoading(false);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMedia(nextPage);
    };

    const handleUpload = async (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => file.type.startsWith('image/'));

        if (validFiles.length === 0) {
            alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP...)');
            return;
        }

        setUploading(true);
        let successCount = 0;
        let newPictures = [];

        for (const file of validFiles) {
            const formData = new FormData();
            formData.append('file', file);
            if (currentGalleryId) {
                formData.append('gallery_id', currentGalleryId);
            }

            try {
                const res = await axios.post(route('cms.media.upload'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                newPictures.push({
                    id: res.data.id,
                    image: res.data.path,
                    name: res.data.name,
                    original_name: res.data.name
                });
                successCount++;
            } catch (error) {
                console.error("Lỗi khi upload:", error);
            }
        }
        
        if (successCount > 0) {
            setPictures(prev => [...newPictures, ...prev]);
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: `Tải lên thành công ${successCount} ảnh!`
                });
            });
        } else {
            alert('Lỗi tải ảnh. Vui lòng thử lại.');
        }
        setUploading(false);
    };

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    };

    if (!show) return null;

    const modalContent = (
        <div className="modal-backdrop-custom d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{ width: '95%', maxWidth: '1400px', height: '90vh', overflow: 'hidden' }}>
                
                {/* Header */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white shadow-sm z-1">
                    <div>
                        <h4 className="m-0 fw-bold"><i className="fa-regular fa-images text-primary me-2"></i> Chọn hình ảnh từ thư viện</h4>
                        <p className="text-muted mb-0 mt-1 font-sm">Chọn một bức ảnh để chèn vào nội dung của bạn</p>
                    </div>
                    <button className="btn-close fs-5" onClick={onClose}></button>
                </div>

                {/* Body */}
                <div className="flex-grow-1 p-0 overflow-hidden d-flex">
                    {/* Sidebar */}
                    <div className="border-end bg-white" style={{ width: '280px', flexShrink: 0, overflowY: 'auto' }}>
                        <div className="p-3 border-bottom">
                            <h6 className="fw-bold m-0 text-uppercase tracking-wider" style={{ color: 'var(--brand-purple)', fontSize: '0.8rem', letterSpacing: '1px' }}>Thư mục</h6>
                        </div>
                        <div className="p-2 d-flex flex-column gap-1">
                            <div 
                                className={`folder-item p-2 rounded-2 d-flex align-items-center gap-2 ${!currentGalleryId ? 'bg-light text-primary fw-bold' : 'text-dark hover-bg-light'}`}
                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => { setCurrentGalleryId(null); setPage(1); setPictures([]); fetchMedia(1, null); }}
                            >
                                <i className="fa-solid fa-border-all"></i>
                                <span>Tất cả ảnh</span>
                            </div>
                            {galleries.map(gallery => (
                                <div 
                                    key={gallery.id} 
                                    onClick={() => { setCurrentGalleryId(gallery.id); setPage(1); setPictures([]); fetchMedia(1, gallery.id); }}
                                    className={`folder-item p-2 rounded-2 d-flex align-items-center gap-2 ${currentGalleryId == gallery.id ? 'bg-light text-primary fw-bold' : 'text-dark hover-bg-light'}`}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                    <i className={currentGalleryId == gallery.id ? "fa-solid fa-folder-open" : "fa-regular fa-folder"}></i>
                                    <span className="text-truncate flex-grow-1">{gallery.name}</span>
                                    <span className="badge bg-secondary rounded-pill" style={{ fontSize: '0.7rem' }}>{gallery.pictures_count || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#f8fafc' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 shadow-sm border">
                            <span className="text-muted fw-semibold">Đang hiển thị {pictures.length} ảnh</span>
                            <div>
                                <input 
                                    ref={fileInputRef} 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    className="d-none" 
                                    onChange={onFileChange}
                                />
                                <button 
                                    className="wow-btn-primary" 
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span> Đang tải lên...</>
                                    ) : (
                                        <><i className="fa-solid fa-cloud-arrow-up me-2"></i> Tải ảnh mới</>
                                    )}
                                </button>
                            </div>
                        </div>

                    {pictures.length === 0 && !loading && (
                        <div className="text-center py-5">
                            <div className="empty-state-icon bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                <i className="fa-regular fa-image fs-1 text-muted"></i>
                            </div>
                            <h5 className="fw-bold text-dark">Chưa có hình ảnh nào</h5>
                        </div>
                    )}

                    <div className="row g-3">
                        {pictures.map(pic => {
                            const fileUrl = pic.image.startsWith('http') ? pic.image : `/storage/${pic.image}`;
                            return (
                                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={pic.id}>
                                    <div 
                                        className="card border-0 shadow-sm overflow-hidden h-100" 
                                        style={{ cursor: 'pointer', transition: 'all 0.2s', borderRadius: '12px' }}
                                        onClick={() => onSelect(fileUrl)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.borderColor = 'var(--wow-primary)';
                                            e.currentTarget.style.borderWidth = '2px';
                                            e.currentTarget.style.borderStyle = 'solid';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                                            e.currentTarget.style.borderWidth = '0';
                                        }}
                                    >
                                        <div className="ratio ratio-1x1 bg-light">
                                            <img src={fileUrl} alt={pic.name} className="object-fit-cover" loading="lazy" />
                                        </div>
                                        <div className="card-body p-2 text-center bg-white border-top">
                                            <p className="text-truncate mb-0 font-sm fw-medium text-dark" style={{ fontSize: '0.85rem' }} title={pic.original_name || pic.name}>
                                                {pic.original_name || pic.name || 'image.jpg'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {loading && (
                        <div className="text-center py-4">
                            <span className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></span>
                        </div>
                    )}

                    {!loading && hasMore && (
                        <div className="text-center mt-5 mb-3">
                            <button className="btn btn-outline-primary rounded-pill px-5 py-2 fw-bold shadow-sm" onClick={handleLoadMore}>
                                <i className="fa-solid fa-arrow-down me-2"></i> Tải thêm ảnh
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            <style>{`
                .modal-backdrop-custom { z-index: 100000 !important; }
                .folder-item:hover { background-color: #f8f9fa !important; }
            `}</style>
        </div>
    );

    // Use createPortal to ensure the modal breaks out of any stacking contexts and overlays everything
    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return modalContent;
}
