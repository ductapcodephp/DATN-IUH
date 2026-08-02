import React from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function BaseBlockForm({ block, blockName, PreviewComponent }) {
    const handleBlockChange = async (property, value) => {
        try {
            await axios.post(route('cms.block.updateProperty', block.id), {
                property,
                value
            });
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: 'Đã lưu thay đổi'
                });
            });
        } catch (error) {
            console.error(error);
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'error',
                    title: 'Lỗi khi lưu: ' + property
                });
            });
        }
    };
    
    return (
        <CMSLayout>
            <Head title={`Live Edit Block: ${blockName}`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1"><i className="fa-solid fa-wand-magic-sparkles text-warning me-2"></i> Visual Editor: {blockName}</h2>
                    <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Hãy nhấp trực tiếp vào văn bản hoặc ảnh trong khung bên dưới để chỉnh sửa. Dữ liệu sẽ được lưu tự động.</p>
                </div>
                <div>
                    <Link href={route('cms.block.index', block?.page?.id || block?.post_id)} className="wow-btn-light">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại cấu trúc trang
                    </Link>
                </div>
            </div>

            <div className="wow-card mb-4" style={{ overflow: 'hidden', border: '2px solid var(--wow-primary)' }}>
                <div className="wow-card-body p-0 position-relative" style={{ minHeight: '600px', background: '#fff' }}>
                    <div className="p-2 border-bottom bg-light d-flex justify-content-center align-items-center gap-3 font-sm text-muted fw-bold shadow-sm z-3 position-relative">
                        <span><i className="fa-solid fa-desktop me-1"></i> Preview & Edit Mode</span>
                        <span className="badge bg-success ms-2"><i className="fa-solid fa-bolt text-warning"></i> Auto-save Enabled</span>
                    </div>
                    <div className="p-0 position-relative z-1" style={{ zoom: 0.9 }}>
                        {/* We pass both isEditMode (for InlineEditable) and editable+onChange (for legacy blocks) */}
                        {PreviewComponent && <PreviewComponent block={block} isEditMode={true} editable={true} onChange={handleBlockChange} />}
                    </div>
                </div>
            </div>
        </CMSLayout>
    );
}
