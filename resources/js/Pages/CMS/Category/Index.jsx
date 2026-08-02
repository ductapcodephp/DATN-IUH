import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import CmsLayout from '@/Layouts/CMS/CmsLayout';
import FormModal from '@/Components/FormModal';
import Swal from 'sweetalert2';

export default function CategoryIndex({ categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        icon: '',
        color: '',
        sort_order: 0,
        is_active: true,
    });

    const handleOpenModal = (category = null) => {
        clearErrors();
        if (category) {
            setEditingCategory(category);
            setData({
                name: category.name || '',
                icon: category.icon || '',
                color: category.color || '',
                sort_order: category.sort_order || 0,
                is_active: !!category.is_active,
            });
        } else {
            setEditingCategory(null);
            reset();
            setData({
                name: '',
                icon: '',
                color: '',
                sort_order: 0,
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingCategory) {
            put(route('cms.categories.update', editingCategory.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Cập nhật thành công!', showConfirmButton: false, timer: 1500 });
                }
            });
        } else {
            post(route('cms.categories.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Thêm mới thành công!', showConfirmButton: false, timer: 1500 });
                }
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Xóa danh mục?',
            text: "Thao tác này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Đồng ý Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('cms.categories.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã xóa!', showConfirmButton: false, timer: 1500 });
                    }
                });
            }
        });
    };

    return (
        <CmsLayout>
            <Head title="Danh mục Bài viết" />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title m-0">Danh mục Bài viết</h2>
                    <p className="text-muted mb-0">Quản lý chuyên mục phân loại cho Blog/Bài viết</p>
                </div>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleOpenModal()}>
                    <i className="fa-solid fa-plus me-2"></i>Thêm Chuyên mục
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table align-middle table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Tên Chuyên Mục</th>
                                    <th className="py-3">Icon / Màu sắc</th>
                                    <th className="py-3">Thứ tự</th>
                                    <th className="py-3 text-center">Trạng thái</th>
                                    <th className="px-4 py-3 text-end">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="px-4 fw-medium text-dark">{cat.name}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {cat.icon && <i className={`${cat.icon} fs-5`} style={{ color: cat.color || '#333' }}></i>}
                                                {cat.color && <span className="badge rounded-pill" style={{ backgroundColor: cat.color, fontSize: '0.7rem' }}>{cat.color}</span>}
                                            </div>
                                        </td>
                                        <td>{cat.sort_order}</td>
                                        <td className="text-center">
                                            {cat.is_active ? 
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Hiển thị</span> : 
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3">Ẩn</span>
                                            }
                                        </td>
                                        <td className="px-4 text-end">
                                            <button onClick={() => handleOpenModal(cat)} className="btn btn-light btn-sm text-primary me-2 rounded-circle shadow-sm" style={{ width: '32px', height: '32px' }} title="Sửa">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="btn btn-light btn-sm text-danger rounded-circle shadow-sm" style={{ width: '32px', height: '32px' }} title="Xóa">
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            Chưa có chuyên mục nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <FormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingCategory ? "Sửa Chuyên mục" : "Thêm Chuyên mục Mới"}
                onSubmit={handleSubmit}
                submitText={editingCategory ? "Cập nhật" : "Tạo mới"}
                processing={processing}
            >
                <div className="mb-3">
                    <label className="form-label fw-bold">Tên Chuyên Mục</label>
                    <input type="text" className={`form-control rounded-3 py-2 ${errors.name ? 'is-invalid' : ''}`} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nhập tên..." />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Icon (FontAwesome)</label>
                        <input type="text" className="form-control rounded-3 py-2" value={data.icon} onChange={e => setData('icon', e.target.value)} placeholder="fa-solid fa-newspaper" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Mã Màu sắc</label>
                        <input type="text" className="form-control rounded-3 py-2" value={data.color} onChange={e => setData('color', e.target.value)} placeholder="#ef4444" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Thứ tự sắp xếp</label>
                        <input type="number" className="form-control rounded-3 py-2" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-end pb-2">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="isActive" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                            <label className="form-check-label ms-2 fw-medium" htmlFor="isActive">Hiển thị (Active)</label>
                        </div>
                    </div>
                </div>
            </FormModal>
        </CmsLayout>
    );
}
