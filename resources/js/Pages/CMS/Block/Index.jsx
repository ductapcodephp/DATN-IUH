import React, { useState } from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ page, blocks }) {
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        type: 'text_block', // default block type
        status: 'active'
    });

    const handleAddBlock = (e) => {
        e.preventDefault();
        post(route('cms.block.store', page.id), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa Block này? Hành động này sẽ được đưa vào thùng rác.')) {
            router.delete(route('cms.block.destroy', id));
        }
    };

    return (
        <CMSLayout>
            <Head title={`Quản lý Block: ${page.name} - CMS`} />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1">Cấu trúc trang: {page.name}</h2>
                    <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Quản lý và sắp xếp các khối giao diện (Blocks) trên trang này.</p>
                </div>
                <div className="d-flex gap-3">
                    <Link href={route('cms.page.index')} className="wow-btn-light">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại
                    </Link>
                    <button onClick={() => setShowAddModal(true)} className="wow-btn-primary">
                        <i className="fa-solid fa-plus"></i> Thêm Block mới
                    </button>
                </div>
            </div>

            <div className="wow-card">
                <div className="wow-card-body p-0">
                    <div className="wow-table-wrapper" style={{ padding: '0 30px 30px' }}>
                        <table className="wow-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>#</th>
                                    <th>Tiêu đề (Title)</th>
                                    <th>Loại (Type)</th>
                                    <th>Trạng thái</th>
                                    <th className="text-end">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blocks && blocks.length > 0 ? (
                                    blocks.map((block, index) => (
                                        <tr key={block.id}>
                                            <td style={{ color: 'var(--wow-text-muted)' }}>
                                                <i className="fa-solid fa-grip-vertical me-2" style={{ cursor: 'grab', opacity: 0.5 }}></i>
                                                {block.sort_order}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{block.title || 'Block không tên'}</td>
                                            <td style={{ color: 'var(--wow-primary)' }}>{block.type}</td>
                                            <td>
                                                <span className="wow-badge">{block.status === 'active' ? 'Hiển thị' : 'Ẩn'}</span>
                                            </td>
                                            <td className="text-end">
                                                <button className="wow-btn-icon me-2" title="Cấu hình nội dung">
                                                    <i className="fa-solid fa-gear"></i>
                                                </button>
                                                <button onClick={() => handleDelete(block.id)} className="wow-btn-icon text-danger" style={{ borderColor: 'transparent', background: 'rgba(255, 0, 85, 0.1)' }} title="Xóa Block">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center" style={{ padding: '3rem', color: 'var(--wow-text-muted)' }}>
                                            <i className="fa-solid fa-cubes fs-1 mb-3 d-block opacity-50"></i>
                                            Trang này chưa có Block nào. Hãy thêm block đầu tiên!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Thêm Block Mới */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="wow-card m-0" style={{ width: '500px', maxWidth: '90%' }}>
                        <div className="wow-card-header">
                            <h3 className="wow-title m-0 fs-5">Thêm Block Mới</h3>
                            <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ filter: 'invert(1)' }}></button>
                        </div>
                        <div className="wow-card-body">
                            <form onSubmit={handleAddBlock}>
                                <div className="mb-3">
                                    <label className="wow-label">Tên / Tiêu đề gợi nhớ</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="Ví dụ: Banner trang chủ"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.title && <div className="text-danger mt-1 small">{errors.title}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="wow-label">Loại Block (Type)</label>
                                    <select 
                                        className="wow-input"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                    >
                                        <option value="text_block">Text Content</option>
                                        <option value="hero_banner">Hero Banner</option>
                                        <option value="features">Features List</option>
                                        <option value="gallery">Image Gallery</option>
                                        <option value="html_raw">Raw HTML</option>
                                    </select>
                                    {errors.type && <div className="text-danger mt-1 small">{errors.type}</div>}
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="wow-btn-light">Hủy</button>
                                    <button type="submit" className="wow-btn-primary" disabled={processing}>
                                        {processing ? 'Đang thêm...' : 'Thêm Block'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </CMSLayout>
    );
}
