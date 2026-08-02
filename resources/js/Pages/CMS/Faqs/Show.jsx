import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';

export default function Show({ category, faqs, categoryId }) {
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        category_id: categoryId === 'uncategorized' ? '' : categoryId,
        question: '',
        answer: '',
        is_active: true,
        sort_order: 0,
    });

    const openModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setData({ 
                category_id: faq.category_id || '',
                question: faq.question, 
                answer: faq.answer,
                is_active: faq.is_active,
                sort_order: faq.sort_order 
            });
        } else {
            setEditingFaq(null);
            reset();
            setData('category_id', categoryId === 'uncategorized' ? '' : categoryId);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFaq(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFaq) {
            put(route('cms.faqs.update', editingFaq.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('cms.faqs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
            destroy(route('cms.faqs.destroy', id));
        }
    };

    const toggleStatus = (id) => {
        post(route('cms.faqs.toggle-status', id));
    };

    return (
        <CMSLayout>
            <Head title={`Danh sách FAQ - ${category ? category.name : 'Chưa phân loại'}`} />
            
            <div className="content-area">
                
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div className="d-flex align-items-center gap-3">
                        <Link href={route('cms.faqs')} className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <div>
                            <h3 className="m-0 fw-bold text-dark">
                                <i className={`${category?.icon || (category ? 'fa-solid fa-folder' : 'fa-solid fa-box-open')} me-2`} style={{ color: category?.color || 'var(--bs-primary)' }}></i>
                                {category ? category.name : 'Câu hỏi chưa phân loại'}
                            </h3>
                            <p className="text-muted mb-0">Quản lý các câu hỏi thuộc danh mục này</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => openModal()} className="btn btn-primary btn-gradient-orange border-0 rounded-pill px-4 py-2 shadow-sm">
                            <i className="fa-solid fa-plus me-2"></i>Thêm Câu hỏi
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 rounded-start-3 px-4 py-3 text-center" style={{ width: '80px' }}>Vị trí</th>
                                    <th className="border-0 py-3" style={{ width: '25%' }}>Câu hỏi</th>
                                    <th className="border-0 py-3">Câu trả lời</th>
                                    <th className="border-0 py-3 text-center" style={{ width: '120px' }}>Trạng thái</th>
                                    <th className="border-0 rounded-end-3 text-end px-4 py-3" style={{ whiteSpace: 'nowrap', width: '200px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {(!faqs.data || faqs.data.length === 0) ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">Chưa có câu hỏi nào trong danh mục này</td>
                                    </tr>
                                ) : (
                                    faqs.data.map(faq => (
                                        <tr key={faq.id}>
                                            <td className="px-4 py-3 text-muted fw-bold text-center">{faq.sort_order}</td>
                                            <td className="py-3 text-dark fw-bold">{faq.question}</td>
                                            <td className="py-3 text-muted">
                                                <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {faq.answer}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="form-check form-switch d-flex justify-content-center">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        checked={faq.is_active} 
                                                        onChange={() => toggleStatus(faq.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-end" style={{ whiteSpace: 'nowrap' }}>
                                                <button onClick={() => openModal(faq)} className="btn btn-sm rounded-pill px-3 btn-outline-secondary me-2">
                                                    Sửa
                                                </button>
                                                <button onClick={() => handleDelete(faq.id)} className="btn btn-sm rounded-pill px-3 btn-outline-danger">
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modal Create/Edit FAQ */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold text-dark">
                                    {editingFaq ? 'Cập nhật Câu hỏi' : 'Thêm Câu hỏi mới'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body py-0">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Vị trí sắp xếp</label>
                                        <input
                                            type="number"
                                            className={`form-control orange-input-focus ${errors.sort_order ? 'is-invalid' : ''}`}
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            min="0"
                                        />
                                        {errors.sort_order && <div className="invalid-feedback">{errors.sort_order}</div>}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Câu hỏi <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control orange-input-focus ${errors.question ? 'is-invalid' : ''}`}
                                            value={data.question}
                                            onChange={(e) => setData('question', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            required
                                        />
                                        {errors.question && <div className="invalid-feedback">{errors.question}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Câu trả lời <span className="text-danger">*</span></label>
                                        <textarea
                                            className={`form-control orange-input-focus ${errors.answer ? 'is-invalid' : ''}`}
                                            value={data.answer}
                                            onChange={(e) => setData('answer', e.target.value)}
                                            style={{ borderRadius: '8px', minHeight: '120px' }}
                                            required
                                        ></textarea>
                                        {errors.answer && <div className="invalid-feedback">{errors.answer}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="isActiveCheck"
                                                checked={data.is_active} 
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                            />
                                            <label className="form-check-label ms-2 fw-semibold" htmlFor="isActiveCheck" style={{ fontSize: '0.9rem' }}>
                                                Hiển thị công khai
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-3">
                                    <button type="button" className="btn btn-light" onClick={closeModal} style={{ borderRadius: '8px' }}>Hủy</button>
                                    <button type="submit" className="btn btn-primary btn-gradient-orange border-0" disabled={processing} style={{ borderRadius: '8px' }}>
                                        {processing ? 'Đang xử lý...' : (editingFaq ? 'Cập nhật' : 'Thêm mới')}
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
