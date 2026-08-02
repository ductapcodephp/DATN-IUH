import React, { useState, useCallback, useRef } from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, router, Link } from '@inertiajs/react';
import axios from 'axios';

export default function MediaIndex({ pictures, galleries }) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
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
                        router.reload({ only: ['pictures'] });
                    } catch (error) {
                        Swal.fire('Lỗi!', 'Không thể xóa ảnh.', 'error');
                    }
                }
            });
        });
    };

    const handleCopyUrl = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
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
        e.preventDefault();
        e.stopPropagation();
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
                    if (!value) {
                        return 'Vui lòng nhập tên thư mục!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('cms.gallery.store'), {
                        name: result.value,
                        type: 'cms'
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

    return (
        <CMSLayout>
            <Head title="Thư viện Media" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
                        <i className="fa-solid fa-images me-2" style={{ color: 'var(--brand-purple)' }}></i> Thư viện Media
                    </h2>
                </div>
            </div>

            <div className="row g-4">
                {/* Sidebar */}
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

                {/* Main Content */}
                <div className="col-xl-9 col-lg-8">
                    <div className="media-content-area">
                        {/* Drag and drop banner */}
                        <div 
                            className={`dropzone mb-4 ${dragActive ? 'drag-over' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="d-flex align-items-center justify-content-between p-4 position-relative z-1">
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
                                    <button 
                                        className="btn btn-upload-primary rounded-pill px-4 py-2 fw-bold text-white border-0"
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
                                    </button>
                                </div>
                            </div>
                        </div>

                        {(!pictures.data || pictures.data.length === 0) ? (
                            <div className="empty-state text-center py-5 mt-4">
                                <div className="empty-icon-wrap mx-auto mb-3">
                                    <i className="fa-regular fa-images"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">Chưa có ảnh nào ở đây</h5>
                                <p className="text-muted small">Kéo thả hoặc bấm "Chọn File Tải Lên" để bắt đầu</p>
                            </div>
                        ) : (
                            <div className="media-grid">
                                {pictures.data.map((pic) => {
                                    const fileUrl = pic.image.startsWith('http') ? pic.image : `/storage/${pic.image}`;
                                    return (
                                        <div className="media-card" key={pic.id}>
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

                        {/* Pagination */}
                        {pictures.last_page > 1 && (
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

            
        </CMSLayout>
    );
}
