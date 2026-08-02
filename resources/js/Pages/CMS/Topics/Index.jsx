import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
export default function Index({ topics }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        type: 'contact',
    });

    const openModal = (topic = null) => {
        if (topic) {
            setEditingTopic(topic);
            setData({ name: topic.name, type: topic.type });
        } else {
            setEditingTopic(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTopic(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTopic) {
            put(route('cms.topics.update', editingTopic.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('cms.topics.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
            destroy(route('cms.topics.destroy', id));
        }
    };

    return (
        <CMSLayout>
            <Head title="Quản lý Chủ đề" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý Chủ đề</h3>
                        <p className="text-muted mb-0">Quản lý các chủ đề liên hệ và báo cáo</p>
                    </div>
                    <button onClick={() => openModal()} className="btn btn-primary btn-gradient-orange border-0 rounded-pill px-4 py-2">
                        <i className="fa-solid fa-plus me-2"></i>Thêm chủ đề
                    </button>
                </div>

                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 rounded-start-3 px-4 py-3">ID</th>
                                    <th className="border-0 py-3">Tên chủ đề</th>
                                    <th className="border-0 py-3">Loại</th>
                                    <th className="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {topics.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">Không có dữ liệu</td>
                                    </tr>
                                ) : (
                                    topics.data.map(topic => (
                                        <tr key={topic.id}>
                                            <td className="px-4 py-3 text-muted">#{topic.id}</td>
                                            <td className="py-3 text-dark fw-semibold">{topic.name}</td>
                                            <td className="py-3">
                                                {topic.type === 'contact' ? (
                                                    <span className="badge bg-primary rounded-pill px-3 py-2">Liên hệ</span>
                                                ) : (
                                                    <span className="badge bg-danger rounded-pill px-3 py-2">Báo cáo</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <button onClick={() => openModal(topic)} className="btn btn-sm rounded-pill px-3 btn-outline-secondary me-2">
                                                    Sửa
                                                </button>
                                                <button onClick={() => handleDelete(topic.id)} className="btn btn-sm rounded-pill px-3 btn-outline-danger">
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {topics.last_page > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            {topics.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`btn btn-sm mx-1 ${link.active ? 'btn-primary' : 'btn-light'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Create/Edit */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold text-dark">
                                    {editingTopic ? 'Cập nhật chủ đề' : 'Thêm chủ đề mới'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body py-0">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Tên chủ đề <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control orange-input-focus ${errors.name ? 'is-invalid' : ''}`}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Loại chủ đề <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-select orange-input-focus ${errors.type ? 'is-invalid' : ''}`}
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                        >
                                            <option value="contact">Liên hệ</option>
                                            <option value="report">Báo cáo vi phạm</option>
                                        </select>
                                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-3">
                                    <button type="button" className="btn btn-light" onClick={closeModal} style={{ borderRadius: '8px' }}>Hủy</button>
                                    <button type="submit" className="btn btn-primary btn-gradient-orange border-0" disabled={processing} style={{ borderRadius: '8px' }}>
                                        {processing ? 'Đang xử lý...' : (editingTopic ? 'Cập nhật' : 'Thêm mới')}
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
