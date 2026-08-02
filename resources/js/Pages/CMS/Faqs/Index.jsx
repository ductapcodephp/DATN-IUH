import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';

export default function Index({ faqCategories, uncategorizedCount }) {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const categoryForm = useForm({
        name: '',
        icon: '',
        color: '#000000',
        sort_order: 0,
    });

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            categoryForm.setData({
                name: category.name,
                icon: category.icon || '',
                color: category.color || '#000000',
                sort_order: category.sort_order || 0
            });
        } else {
            setEditingCategory(null);
            categoryForm.reset();
        }
        setShowCategoryModal(true);
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route('cms.faqs.categories.update', editingCategory.id), {
                onSuccess: () => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    categoryForm.reset();
                }
            });
        } else {
            categoryForm.post(route('cms.faqs.categories.store'), {
                onSuccess: () => {
                    setShowCategoryModal(false);
                    categoryForm.reset();
                }
            });
        }
    };

    const handleCategoryDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Các câu hỏi bên trong sẽ không bị xóa (trở thành chưa phân loại).')) {
            router.delete(route('cms.faqs.categories.destroy', id));
        }
    };

    return (
        <CMSLayout>
            <Head title="Quản lý danh mục FAQ" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý danh mục FAQ</h3>
                        <p className="text-muted mb-0">Quản lý các danh mục chủ đề câu hỏi thường gặp</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button onClick={() => openCategoryModal()} className="btn btn-primary btn-gradient-orange border-0 rounded-pill px-4 py-2">
                            <i className="fa-solid fa-folder-plus me-2"></i>Thêm Danh mục
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 border rounded-3 overflow-hidden">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 px-4 py-3 text-center" style={{ width: '80px' }}>Vị trí</th>
                                    <th className="border-0 py-3">Danh mục</th>
                                    <th className="border-0 py-3 text-center" style={{ width: '150px' }}>Số câu hỏi</th>
                                    <th className="border-0 px-4 py-3 text-end" style={{ whiteSpace: 'nowrap', width: '250px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {faqCategories.data && faqCategories.data.map(cat => (
                                    <tr key={`cat-${cat.id}`}>
                                        <td className="px-4 py-3 fw-bold text-center border-start-0 text-muted">{cat.sort_order}</td>
                                        <td className="py-3 text-dark fw-bold">
                                            <i className={`${cat.icon || 'fa-solid fa-folder'} me-3`} style={{ color: cat.color || 'var(--bs-primary)' }}></i> {cat.name}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                                                {cat.faqs_count} câu hỏi
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-end border-end-0" style={{ whiteSpace: 'nowrap' }}>
                                            <Link href={route('cms.faqs.categories.show', cat.id)} className="btn btn-sm btn-outline-info rounded-pill px-3 me-2" title="Xem danh sách câu hỏi">
                                                <i className="fa-solid fa-eye"></i> Xem
                                            </Link>
                                            <button onClick={() => openCategoryModal(cat)} className="btn btn-sm btn-outline-secondary rounded-pill px-3 me-2" title="Sửa danh mục">
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button onClick={() => handleCategoryDelete(cat.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3" title="Xóa danh mục">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {uncategorizedCount > 0 && (
                                    <tr>
                                        <td className="px-4 py-3 text-center border-start-0 text-muted">-</td>
                                        <td className="py-3 text-secondary fw-bold">
                                            <i className="fa-solid fa-box-open me-3"></i> Chưa phân loại
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                                                {uncategorizedCount} câu hỏi
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-end border-end-0">
                                            <Link href={route('cms.faqs.categories.show', 'uncategorized')} className="btn btn-sm btn-outline-info rounded-pill px-3" title="Xem danh sách câu hỏi chưa phân loại">
                                                <i className="fa-solid fa-eye"></i> Xem
                                            </Link>
                                        </td>
                                    </tr>
                                )}

                                {(!faqCategories.data || faqCategories.data.length === 0) && uncategorizedCount === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">Chưa có danh mục nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit Category */}
            {showCategoryModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold text-dark">
                                    {editingCategory ? 'Cập nhật Danh Mục FAQ' : 'Thêm Danh Mục FAQ'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
                            </div>
                            <form onSubmit={handleCategorySubmit}>
                                <div className="modal-body py-0">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Tên danh mục <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control orange-input-focus ${categoryForm.errors.name ? 'is-invalid' : ''}`}
                                            value={categoryForm.data.name}
                                            onChange={(e) => categoryForm.setData('name', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            placeholder="VD: Học phí & Thanh toán"
                                            required
                                        />
                                        {categoryForm.errors.name && <div className="invalid-feedback">{categoryForm.errors.name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Vị trí sắp xếp</label>
                                        <input
                                            type="number"
                                            className={`form-control orange-input-focus ${categoryForm.errors.sort_order ? 'is-invalid' : ''}`}
                                            value={categoryForm.data.sort_order}
                                            onChange={(e) => categoryForm.setData('sort_order', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            min="0"
                                        />
                                        {categoryForm.errors.sort_order && <div className="invalid-feedback">{categoryForm.errors.sort_order}</div>}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Icon FontAwesome</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white"><i className={categoryForm.data.icon || 'fa-solid fa-folder'} style={{ color: categoryForm.data.color }}></i></span>
                                                <input
                                                    type="text"
                                                    className={`form-control orange-input-focus ${categoryForm.errors.icon ? 'is-invalid' : ''}`}
                                                    value={categoryForm.data.icon}
                                                    onChange={(e) => categoryForm.setData('icon', e.target.value)}
                                                    style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                                                    placeholder="VD: fa-solid fa-credit-card"
                                                />
                                            </div>
                                            {categoryForm.errors.icon && <div className="invalid-feedback d-block">{categoryForm.errors.icon}</div>}
                                            <small className="text-muted mt-1 d-block">Lấy class icon từ FontAwesome (ví dụ: fa-solid fa-credit-card)</small>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Màu sắc</label>
                                            <input
                                                type="color"
                                                className={`form-control form-control-color w-100 ${categoryForm.errors.color ? 'is-invalid' : ''}`}
                                                value={categoryForm.data.color || '#000000'}
                                                onChange={(e) => categoryForm.setData('color', e.target.value)}
                                                style={{ borderRadius: '8px', cursor: 'pointer', height: '42px' }}
                                            />
                                            {categoryForm.errors.color && <div className="invalid-feedback">{categoryForm.errors.color}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-3">
                                    <button type="button" className="btn btn-light" onClick={() => setShowCategoryModal(false)} style={{ borderRadius: '8px' }}>Hủy</button>
                                    <button type="submit" className="btn btn-primary btn-gradient-orange border-0" disabled={categoryForm.processing} style={{ borderRadius: '8px' }}>
                                        {categoryForm.processing ? 'Đang xử lý...' : (editingCategory ? 'Cập nhật' : 'Thêm mới')}
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
