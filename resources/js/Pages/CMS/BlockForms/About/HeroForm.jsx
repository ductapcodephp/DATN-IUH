import React from "react";
import CMSLayout from "@/Layouts/CMS/CMSLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import HeroBlock from "@/Pages/Frontend/About/HeroBlock";

export default function HeroForm({ block }) {
    const { data, setData, put, processing, errors } = useForm({
        title: block?.title || '',
        description: block?.description || '', // We use description for hero text
        image: block?.image || '',
        status: block?.status || 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('cms.block.update', block.id));
    };

    return (
        <CMSLayout>
            <Head title={`Sửa Hero Banner`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1">Cấu hình trực quan: Banner Giới Thiệu</h2>
                    <p className="m-0 text-muted">Nhấp vào Tiêu đề hoặc Đoạn văn bên dưới để sửa trực tiếp (WYSIWYG).</p>
                </div>
                <div>
                    <Link href={route('cms.block.index', block?.post_id)} className="wow-btn-light me-2">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại
                    </Link>
                    <button onClick={handleSubmit} className="wow-btn-primary" disabled={processing}>
                        <i className="fa-solid fa-save"></i> Cập nhật Hero Banner
                    </button>
                </div>
            </div>

            <div className="wow-card mb-4">
                <div className="wow-card-body position-relative p-0" style={{ minHeight: '300px', background: '#fff' }}>
                    <div className="position-absolute top-0 end-0 m-3 z-3">
                        <div className="input-group input-group-sm bg-white shadow-sm rounded" style={{ width: '300px' }}>
                            <span className="input-group-text bg-light"><i className="fa-regular fa-image"></i></span>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Đường dẫn ảnh nền..."
                                value={data.image}
                                onChange={e => setData('image', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-4 pt-5 pb-5 overflow-auto" style={{ border: '1px dashed #ccc', background: '#fff' }}>
                        <style>{`
                            .hero-title { font-weight: 800; font-size: 3rem; margin-bottom: 1rem; color: #1f2937; }
                            .hero-desc { font-size: 1.125rem; color: #6b7280; line-height: 1.75; }
                            .text-accent { color: #3b82f6; }
                        `}</style>
                        <HeroBlock 
                            block={data} 
                            editable={true} 
                            onChange={(field, value) => setData(field, value)} 
                        />
                    </div>
                </div>
            </div>
        </CMSLayout>
    );
}
