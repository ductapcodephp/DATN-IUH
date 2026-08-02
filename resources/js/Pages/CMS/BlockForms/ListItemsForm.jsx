import React, { useState, useEffect } from "react";
import CMSLayout from "@/Layouts/CMS/CMSLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import IconPicker from "@/Components/CMS/IconPicker";

export default function ListItemsForm({ block, fieldsConfig, blockFields, formTitle, formDesc, PreviewComponent }) {
    const parsedContent = typeof block?.content === 'string' ? JSON.parse(block.content) : (block?.content || {});
    const listingItems = parsedContent?.listingItem || parsedContent?.listing_item || [];

    const { data, setData, put, processing, errors } = useForm({
        id: block?.id,
        listing_item: listingItems,
        url: block?.url || '',
        title: block?.title || '',
        sub_title: block?.sub_title || '',
    });

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.listing_item];
        newItems[index][field] = value;
        setData('listing_item', newItems);
    };

    const handleAddItem = () => {
        const newItem = {};
        fieldsConfig.forEach(f => { newItem[f.name] = '' });
        const newItems = [...data.listing_item, newItem];
        setData('listing_item', newItems);
    };

    const handleRemoveItem = (index) => {
        const newItems = data.listing_item.filter((_, i) => i !== index);
        setData('listing_item', newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('cms.block.updateDTO', block.id), {
            onSuccess: () => {
                import('sweetalert2').then(({ default: Swal }) => {
                    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, icon: 'success', title: 'Lưu thay đổi thành công!' });
                });
            }
        });
    };

    return (
        <CMSLayout>
            <Head title={`Sửa Block: ${formTitle}`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1">Cấu hình trực quan: {formTitle}</h2>
                    <p className="m-0 text-muted">Nhấp vào Tiêu đề/Phụ đề trên Preview để sửa. Quản lý danh sách ở bên dưới.</p>
                </div>
                <div>
                    <Link href={route('cms.block.index', block?.post_id)} className="wow-btn-light me-2">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại
                    </Link>
                </div>
            </div>

            {/* Block Live Preview - Full Width */}
            <div className="wow-card mb-4">
                <div className="wow-card-body position-relative p-0" style={{ minHeight: '300px', background: '#fff' }}>
                    <div className="p-4 pt-5 pb-5 overflow-auto" style={{ border: '1px dashed #ccc', background: '#fff' }}>
                        <style>{`
                            .section-title { font-weight: 800; font-size: 2.25rem; }
                            .text-accent { color: #3b82f6; }
                            .text-fire { color: #f97316; }
                            .text-success { color: #22c55e; }
                            .bg-surface { background-color: #f9fafb; }
                        `}</style>
                        {PreviewComponent ? (
                            <PreviewComponent 
                                block={{...block, ...data}} 
                                onChange={(field, value) => setData(field, value)} 
                                editable={true}
                            />
                        ) : (
                            <BlockRenderer 
                                block={data} 
                                editable={true} 
                                onChange={(field, value) => setData(field, value)} 
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Quản lý danh sách (Items) */}
            <div className="wow-card">
                <div className="wow-card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="wow-label m-0 fs-5"><i className="fa-solid fa-list-check me-2"></i> {formDesc}</h5>
                        <div className="d-flex gap-2">
                            <button type="button" onClick={handleAddItem} className="wow-btn-light btn-sm">
                                <i className="fa-solid fa-plus"></i> Thêm mục mới
                            </button>
                            <button type="button" onClick={handleSubmit} className="wow-btn-primary btn-sm" disabled={processing}>
                                <i className="fa-solid fa-save"></i> Lưu
                            </button>
                        </div>
                    </div>

                    {blockFields && blockFields.length > 0 && (
                        <div className="row g-3 mb-4 pb-4 border-bottom">
                            <h6 className="fw-bold mb-2 text-dark">Cấu hình chung</h6>
                            {blockFields.map(field => (
                                <div className={`col-md-${field.width || 12}`} key={field.name}>
                                    <label className="wow-label">{field.label}</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        value={data[field.name] || ''}
                                        onChange={e => setData(field.name, e.target.value)}
                                        placeholder={field.placeholder || ''}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {data.listing_item.length === 0 ? (
                        <div className="alert alert-light text-center border py-5">
                            <div className="mb-3 text-muted">Chưa có mục nào. Hãy thêm mục đầu tiên.</div>
                            <button type="button" onClick={handleAddItem} className="wow-btn-primary">
                                <i className="fa-solid fa-plus"></i> Thêm mục mới
                            </button>
                        </div>
                    ) : (
                        <div className="accordion" id="itemsAccordion">
                            {data.listing_item.map((item, index) => (
                                <div className="accordion-item mb-3 border rounded" key={index}>
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed bg-light fw-bold p-3" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                            Mục #{index + 1}: {item[fieldsConfig[0].name] || 'Chưa nhập tên'}
                                        </button>
                                    </h2>
                                    <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#itemsAccordion">
                                        <div className="accordion-body bg-white">
                                            <div className="row g-3">
                                                {fieldsConfig.map(field => (
                                                    <div className={`col-md-${field.width || 12}`} key={field.name}>
                                                        <label className="wow-label">{field.label}</label>
                                                        {field.type === 'textarea' ? (
                                                            <textarea 
                                                                className="wow-input"
                                                                rows={3}
                                                                value={item[field.name]}
                                                                onChange={e => handleItemChange(index, field.name, e.target.value)}
                                                            ></textarea>
                                                        ) : field.type === 'icon' ? (
                                                            <div className="d-flex align-items-center bg-light border rounded p-2">
                                                                <IconPicker 
                                                                    icon={item[field.name] || 'fa-solid fa-star'}
                                                                    onChange={val => handleItemChange(index, field.name, val)}
                                                                    editable={true}
                                                                />
                                                                <span className="ms-3 text-muted small">Bấm vào biểu tượng bên trái để chọn Icon và màu</span>
                                                            </div>
                                                        ) : (
                                                            <input 
                                                                type="text" 
                                                                className="wow-input"
                                                                value={item[field.name]}
                                                                onChange={e => handleItemChange(index, field.name, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 text-end">
                                                <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-sm btn-outline-danger">
                                                    <i className="fa-solid fa-trash"></i> Xóa mục này
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


        </CMSLayout>
    );
}
