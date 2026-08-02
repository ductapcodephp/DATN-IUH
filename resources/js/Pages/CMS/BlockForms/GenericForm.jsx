import React, { useState } from "react";
import CMSLayout from "@/Layouts/CMS/CMSLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function GenericForm({ block }) {
    const { data, setData, put, processing, errors } = useForm({
        type: block?.type || 'text_block',
        title: block?.title || '',
        sub_title: block?.sub_title || '',
        content: block?.content || '',
        status: block?.status || 'active',
    });

    const [showEditor, setShowEditor] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('cms.block.update', block.id));
    };

    return (
        <CMSLayout>
            <Head title={`Sửa Block: ${block?.title || 'Không tên'}`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1">Visual Editor: {block?.type}</h2>
                    <p className="m-0 text-muted">Sửa trực tiếp trên giao diện. Nhấp vào chữ để sửa Tiêu đề. Mở Editor để sửa nội dung dài.</p>
                </div>
                <div>
                    <Link href={route('cms.block.index', block?.post_id)} className="wow-btn-light me-2">
                        <i className="fa-solid fa-arrow-left"></i> Hủy
                    </Link>
                    <button onClick={handleSubmit} className="wow-btn-primary" disabled={processing}>
                        <i className="fa-solid fa-save"></i> Lưu Cấu Hình
                    </button>
                </div>
            </div>

            <div className="wow-card mb-4">
                <div className="wow-card-body position-relative p-0" style={{ minHeight: '300px', background: '#fff' }}>
                    <div className="position-absolute top-0 end-0 m-3 z-3">
                        <button 
                            type="button" 
                            className="wow-btn-light" 
                            onClick={() => setShowEditor(!showEditor)}
                        >
                            <i className="fa-solid fa-pen-to-square"></i> {showEditor ? 'Đóng Trình soạn thảo (Content)' : 'Sửa Nội Dung Dài (Content)'}
                        </button>
                    </div>

                    <div className="p-4">
                        {/* Live Preview / Inline Editor */}
                        <BlockRenderer 
                            block={data} 
                            editable={true} 
                            onChange={(field, value) => setData(field, value)} 
                        />
                    </div>
                </div>
            </div>

            {showEditor && (
                <div className="wow-card">
                    <div className="wow-card-body">
                        <h5 className="wow-label mb-3"><i className="fa-solid fa-align-left me-2"></i> Trình soạn thảo nội dung (CKEditor)</h5>
                        <CKEditor
                            editor={ClassicEditor}
                            data={data.content}
                            onChange={(event, editor) => {
                                const newData = editor.getData();
                                setData('content', newData);
                            }}
                        />
                    </div>
                </div>
            )}
        </CMSLayout>
    );
}
