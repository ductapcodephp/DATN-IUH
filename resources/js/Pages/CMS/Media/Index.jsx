import React, { useState, useCallback, useRef } from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, router, Link } from '@inertiajs/react';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';
import axios from 'axios';

export default function MediaIndex({ pictures, galleries }) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    
    // Determine active gallery from URL params
    const queryParams = new URLSearchParams(window.location.search);
    const currentGalleryId = queryParams.get('gallery_id');

    const handleUpload = async (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => file.type.startsWith('image/'));

        if (validFiles.length === 0) {
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi định dạng',
                    text: 'Vui lòng chọn file hình ảnh (JPG, PNG, GIF, WebP...)',
                });
            });
            return;
        }

        setUploading(true);
        let successCount = 0;

        for (const file of validFiles) {
            const formData = new FormData();
            formData.append('file', file);
            if (currentGalleryId) {
                formData.append('gallery_id', currentGalleryId);
            }

            try {
                await axios.post(route('cms.media.upload'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                successCount++;
            } catch (error) {
                console.error("Lỗi khi upload:", error);
            }
        }
        
        if (successCount > 0) {
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'success',
                    title: `Tải lên thành công ${successCount} ảnh!`
                });
            });
            router.reload({ only: ['pictures'] });
        } else {
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tải ảnh',
                    text: 'Không có ảnh nào được tải lên thành công, vui lòng thử lại.',
                });
            });
        }
        setUploading(false);
    };

    const handleDelete = (id) => {
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa ảnh này?',
                text: "Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Đồng ý, Xóa!',
                cancelButtonText: 'Hủy'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(route('cms.media.destroy', id));
                        Swal.fire('Đã xóa!', 'Ảnh đã được xóa khỏi hệ thống.', 'success');
                        if (selectedImage?.id === id) {
                            setSelectedImage(null);
                        }
                        router.reload({ only: ['pictures'] });
                    } catch (error) {
                        Swal.fire('Lỗi!', 'Không thể xóa ảnh.', 'error');
                    }
                }
            });
        });
    };

    const handleCopyUrl = (e, url) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        navigator.clipboard.writeText(url);
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: 'Đã copy đường dẫn ảnh'
            });
        });
    };

    const copyFilePath = (e, path) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        navigator.clipboard.writeText(path);
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: 'Đã copy đường dẫn Path'
            });
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    };

    const handleCreateGallery = () => {
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Tạo thư mục mới',
                input: 'text',
                inputPlaceholder: 'Nhập tên thư mục...',
                showCancelButton: true,
                confirmButtonText: 'Tạo',
                cancelButtonText: 'Hủy',
                inputValidator: (value) => {
                    if (!value) return 'Vui lòng nhập tên thư mục!';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('cms.gallery.store'), {
                        name: result.value
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 2000,
                                icon: 'success',
                                title: 'Đã tạo thư mục'
                            });
                        }
                    });
                }
            });
        });
    };

    const handleEditGallery = (e, gallery) => {
        e.preventDefault();
        e.stopPropagation();
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Đổi tên thư mục',
                input: 'text',
                inputValue: gallery.name,
                inputPlaceholder: 'Nhập tên thư mục mới...',
                showCancelButton: true,
                confirmButtonText: 'Lưu',
                cancelButtonText: 'Hủy',
                inputValidator: (value) => {
                    if (!value) return 'Vui lòng nhập tên thư mục!';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.put(route('cms.gallery.update', gallery.id), {
                        name: result.value
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, icon: 'success', title: 'Đã cập nhật'
                            });
                        }
                    });
                }
            });
        });
    };

    const handleDeleteGallery = (e, gallery) => {
        e.preventDefault();
        e.stopPropagation();
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa thư mục này?',
                text: "Tất cả ảnh bên trong sẽ vẫn còn trong hệ thống (Tất cả ảnh).",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Đồng ý, Xóa!',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('cms.gallery.destroy', gallery.id), {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, icon: 'success', title: 'Đã xóa'
                            });
                            if (currentGalleryId == gallery.id) {
                                router.visit(route('cms.media.index'));
                            }
                        }
                    });
                }
            });
        });
    };

    const rawPictures = pictures?.data || [];
    const displayedPictures = searchQuery 
        ? rawPictures.filter(p => (p.name || p.original_name || p.image || '').toLowerCase().includes(searchQuery.toLowerCase()))
        : rawPictures;

    return (
        <CMSLayout>
            <Head title="Thư viện Media - CMS" />

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="mb-1 fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
                        <i className="fa-solid fa-images me-2" style={{ color: 'var(--brand-purple)' }}></i> Thư viện Media
                    </h2>
                    <p className="m-0 text-muted small">Tải lên, quản lý và tái sử dụng hình ảnh cho toàn bộ website.</p>
                </div>

                <div className="position-relative" style={{ minWidth: '260px' }}>
                    <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px' }}></i>
                    <input 
                        type="text" 
                        className="form-control rounded-pill ps-5 py-2 shadow-sm border-0" 
                        style={{ backgroundColor: 'var(--wow-input-bg, #ffffff)', color: 'var(--wow-text)' }}
                        placeholder="Tìm kiếm hình ảnh..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="btn btn-sm position-absolute top-50 translate-middle-y end-0 me-2 text-muted border-0 bg-transparent"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="row g-4">
                <div className="col-xl-3 col-lg-4">
                    <div className="sidebar-card">
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 className="fw-bold m-0 text-uppercase tracking-wider" style={{ color: 'var(--brand-purple)', fontSize: '0.8rem', letterSpacing: '1px' }}>Thư mục</h6>
                                <button 
                                    className="btn-create-folder"
                                    onClick={handleCreateGallery} 
                                    title="Tạo thư mục mới"
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                <Link 
                                    href={route('cms.media.index')} 
                                    className={`folder-item ${!currentGalleryId ? 'active' : ''}`}
                                >
                                    <i className="fa-solid fa-border-all"></i>
                                    <span>Tất cả ảnh</span>
                                    <span className="folder-count ms-auto">{pictures.total || 0}</span>
                                </Link>
                                {galleries.map(gallery => (
                                    <div 
                                        key={gallery.id} 
                                        onClick={() => router.visit(route('cms.media.index', { gallery_id: gallery.id }))}
                                        className={`folder-item ${currentGalleryId == gallery.id ? 'active' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className={currentGalleryId == gallery.id ? "fa-solid fa-folder-open" : "fa-regular fa-folder"}></i>
                                        <span className="text-truncate flex-grow-1">{gallery.name}</span>
                                        <div className="folder-actions d-none gap-1">
                                            <button className="btn-icon-small" onClick={(e) => handleEditGallery(e, gallery)} title="Đổi tên">
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button className="btn-icon-small text-danger-hover" onClick={(e) => handleDeleteGallery(e, gallery)} title="Xóa thư mục">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                        <span className="folder-count">{gallery.pictures_count || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9 col-lg-8">
                    <div className="media-content-area">
                        <div 
                            className={`dropzone mb-4 ${dragActive ? 'drag-over' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="d-flex align-items-center justify-content-between p-4 position-relative z-1 flex-wrap gap-3">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="dropzone-icon">
                                        <i className={`fa-solid fa-cloud-arrow-up`}></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1 text-dark">Kéo thả hình ảnh vào khu vực này</h5>
                                        <p className="text-muted m-0 font-sm">Hỗ trợ JPG, PNG, GIF, WebP. Kích thước tối đa 10MB.</p>
                                    </div>
                                </div>
                                <div>
                                    <input 
                                        ref={fileInputRef} 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        className="d-none" 
                                        onChange={onFileChange}
                                    />
                                    <ShimmerButton 
                                        className="fw-bold px-4 py-2"
                                        disabled={uploading}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        {uploading ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span> Đang tải...</>
                                        ) : (
                                            <><i className="fa-solid fa-upload me-2"></i> Chọn File Tải Lên</>
                                        )}
                                    </ShimmerButton>
                                </div>
                            </div>
                        </div>

                        {(!displayedPictures || displayedPictures.length === 0) ? (
                            <div className="empty-state text-center py-5 mt-4">
                                <div className="empty-icon-wrap mx-auto mb-3">
                                    <i className="fa-regular fa-images"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">
                                    {searchQuery ? 'Không tìm thấy hình ảnh phù hợp' : 'Chưa có ảnh nào ở đây'}
                                </h5>
                                <p className="text-muted small">
                                    {searchQuery ? `Thử tìm với từ khóa khác hoặc bấm nút xóa tìm kiếm.` : `Kéo thả hoặc bấm "Chọn File Tải Lên" để bắt đầu.`}
                                </p>
                            </div>
                        ) : (
                            <div className="media-grid">
                                {displayedPictures.map((pic) => {
                                    const fileUrl = pic.image.startsWith('http') ? pic.image : `/storage/${pic.image}`;
                                    return (
                                        <div 
                                            className="media-card" 
                                            key={pic.id}
                                            onClick={() => setSelectedImage(pic)}
                                            title="Bấm để xem chi tiết ảnh"
                                        >
                                            <img 
                                                src={fileUrl} 
                                                alt={pic.name || 'Image'} 
                                                loading="lazy"
                                            />
                                            
                                            <div className="media-card-overlay">
                                                <div className="filename" title={pic.original_name || pic.name}>
                                                    {pic.original_name || pic.name || 'image.jpg'}
                                                </div>
                                            </div>

                                            <div className="media-card-actions">
                                                <button 
                                                    className="action-btn text-primary"
                                                    onClick={(e) => handleCopyUrl(e, window.location.origin + fileUrl)}
                                                    title="Copy URL"
                                                >
                                                    <i className="fa-solid fa-link"></i>
                                                </button>
                                                <button 
                                                    className="action-btn text-info"
                                                    onClick={(e) => copyFilePath(e, pic.image)}
                                                    title="Copy Path"
                                                >
                                                    <i className="fa-solid fa-code"></i>
                                                </button>
                                                <button 
                                                    className="action-btn text-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDelete(pic.id);
                                                    }}
                                                    title="Xóa"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!searchQuery && pictures.last_page > 1 && (
                            <div className="d-flex justify-content-center mt-5">
                                <nav>
                                    <ul className="custom-pagination pagination">
                                        {pictures.links.map((link, idx) => (
                                            <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                <Link 
                                                    href={link.url || '#'} 
                                                    className="page-link"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                ></Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div className="wow-lightbox-backdrop" onClick={() => setSelectedImage(null)}>
                    <div className="wow-lightbox-card p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold m-0 text-truncate pe-3" style={{ color: 'var(--wow-text)' }}>
                                <i className="fa-solid fa-image me-2 text-primary"></i>
                                {selectedImage.original_name || selectedImage.name || 'Chi tiết hình ảnh'}
                            </h5>
                            <button 
                                className="wow-btn-icon" 
                                onClick={() => setSelectedImage(null)}
                                title="Đóng"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="text-center bg-black bg-opacity-10 rounded-4 p-3 mb-4 d-flex align-items-center justify-content-center" style={{ minHeight: '260px', maxHeight: '420px', overflow: 'hidden' }}>
                            <img 
                                src={selectedImage.image.startsWith('http') ? selectedImage.image : `/storage/${selectedImage.image}`} 
                                alt={selectedImage.name || 'Preview'} 
                                style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '12px' }}
                            />
                        </div>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <div>
                                <label className="small text-muted fw-bold mb-1">Đường dẫn đầy đủ (Full URL):</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        className="form-control form-control-sm rounded-start-pill ps-3" 
                                        style={{ backgroundColor: 'var(--wow-input-bg, #ffffff)', color: 'var(--wow-text)' }}
                                        value={window.location.origin + (selectedImage.image.startsWith('http') ? selectedImage.image : `/storage/${selectedImage.image}`)}
                                    />
                                    <button 
                                        className="btn btn-primary rounded-end-pill px-3"
                                        onClick={() => handleCopyUrl(null, window.location.origin + (selectedImage.image.startsWith('http') ? selectedImage.image : `/storage/${selectedImage.image}`))}
                                    >
                                        <i className="fa-solid fa-copy me-1"></i> Copy URL
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="small text-muted fw-bold mb-1">Đường dẫn tương đối (Storage Path):</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        className="form-control form-control-sm rounded-start-pill ps-3" 
                                        style={{ backgroundColor: 'var(--wow-input-bg, #ffffff)', color: 'var(--wow-text)' }}
                                        value={selectedImage.image}
                                    />
                                    <button 
                                        className="btn btn-info text-white rounded-end-pill px-3"
                                        onClick={() => copyFilePath(null, selectedImage.image)}
                                    >
                                        <i className="fa-solid fa-code me-1"></i> Copy Path
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <span className="small text-muted">
                                ID: #{selectedImage.id}
                            </span>
                            <button 
                                className="btn btn-danger btn-sm rounded-pill px-4 fw-bold"
                                onClick={() => handleDelete(selectedImage.id)}
                            >
                                <i className="fa-solid fa-trash me-2"></i> Xóa ảnh này
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CMSLayout>
    );
}
