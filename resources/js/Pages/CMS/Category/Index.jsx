import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import CmsLayout from '@/Layouts/CMS/CMSLayout';
import FormModal from '@/Components/FormModal';
import IconPicker from '@/Components/CMS/IconPicker';
import Swal from 'sweetalert2';

const PRESET_COLORS = [
    { label: 'Cam EduFlow', hex: '#EA580C' },
    { label: 'Xanh Lam', hex: '#0284C7' },
    { label: 'Xanh Dương', hex: '#2563EB' },
    { label: 'Tím', hex: '#7C3AED' },
    { label: 'Xanh Lá', hex: '#10B981' },
    { label: 'Vàng Hổ Phách', hex: '#F59E0B' },
    { label: 'Đỏ', hex: '#EF4444' },
    { label: 'Hồng', hex: '#EC4899' },
    { label: 'Xanh Ngọc', hex: '#14B8A6' },
    { label: 'Chàm', hex: '#6366F1' },
    { label: 'Xám Đậm', hex: '#4B5563' },
    { label: 'Đen Tuyền', hex: '#1E293B' },
];

export default function CategoryIndex({ categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        icon: 'fa-solid fa-newspaper',
        color: '#EA580C',
        sort_order: 0,
        is_active: true,
    });

    const handleOpenModal = (category = null) => {
        clearErrors();
        if (category) {
            setEditingCategory(category);
            setData({
                name: category.name || '',
                icon: category.icon || 'fa-solid fa-newspaper',
                color: category.color || '#EA580C',
                sort_order: category.sort_order || 0,
                is_active: !!category.is_active,
            });
        } else {
            setEditingCategory(null);
            reset();
            setData({
                name: '',
                icon: 'fa-solid fa-newspaper',
                color: '#EA580C',
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
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-3 shadow-xs" 
                                                    style={{ 
                                                        width: '34px', 
                                                        height: '34px', 
                                                        backgroundColor: `${cat.color || '#EA580C'}18`, 
                                                        color: cat.color || '#EA580C' 
                                                    }}
                                                >
                                                    <i className={`${cat.icon || 'fa-solid fa-folder'} fs-6`}></i>
                                                </div>
                                                {cat.color && (
                                                    <span className="badge rounded-pill" style={{ backgroundColor: cat.color, color: '#fff', fontSize: '0.72rem', padding: '4px 8px' }}>
                                                        {cat.color}
                                                    </span>
                                                )}
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
                    <label className="form-label fw-bold">Tên Chuyên Mục <span className="text-danger">*</span></label>
                    <input 
                        type="text" 
                        className={`form-control rounded-3 py-2 orange-input-focus ${errors.name ? 'is-invalid' : ''}`} 
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)} 
                        placeholder="VD: Lập trình Web, Trí tuệ nhân tạo..." 
                        required 
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold d-flex justify-content-between align-items-center mb-1">
                        <span>Icon đại diện</span>
                        <small className="text-muted fw-normal" style={{ fontSize: '0.8rem' }}>Nhấp vào icon để mở bảng chọn</small>
                    </label>
                    <div className="d-flex gap-2 align-items-center">
                        <div className="d-flex align-items-center justify-content-center border rounded-3 p-1 bg-light" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                            <IconPicker 
                                icon={data.icon || 'fa-solid fa-folder'} 
                                onChange={(ic) => {
                                    const pureIcon = ic.replace(/text-[a-z-]+/g, '').trim();
                                    setData('icon', pureIcon);
                                }} 
                                editable={true} 
                                className="fs-5"
                            />
                        </div>
                        <input 
                            type="text" 
                            className={`form-control rounded-3 py-2 orange-input-focus ${errors.icon ? 'is-invalid' : ''}`}
                            value={data.icon} 
                            onChange={e => setData('icon', e.target.value)} 
                            placeholder="VD: fa-solid fa-newspaper, fa-solid fa-code" 
                        />
                    </div>
                    {errors.icon && <div className="text-danger font-sm mt-1">{errors.icon}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold d-flex justify-content-between align-items-center mb-1">
                        <span>Bảng màu sắc</span>
                        <span className="badge rounded-pill px-2 py-1 text-white" style={{ backgroundColor: data.color || '#EA580C', fontSize: '0.75rem' }}>
                            {data.color || '#EA580C'}
                        </span>
                    </label>

                    {/* Preset Palette Swatches */}
                    <div className="d-flex flex-wrap gap-2 mb-2 p-2 rounded-3 border bg-light align-items-center">
                        {PRESET_COLORS.map((c) => (
                            <div
                                key={c.hex}
                                onClick={() => setData('color', c.hex)}
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: c.hex,
                                    cursor: 'pointer',
                                    border: data.color?.toUpperCase() === c.hex.toUpperCase() ? '2px solid #000' : '2px solid transparent',
                                    boxShadow: data.color?.toUpperCase() === c.hex.toUpperCase() ? '0 0 0 2px #fff inset, 0 2px 4px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
                                    transform: data.color?.toUpperCase() === c.hex.toUpperCase() ? 'scale(1.15)' : 'scale(1)',
                                    transition: 'all 0.15s ease-in-out'
                                }}
                                title={`${c.label} (${c.hex})`}
                            />
                        ))}

                        {/* Custom Color Input */}
                        <div className="d-flex align-items-center ms-auto" title="Chọn màu tùy chỉnh">
                            <input
                                type="color"
                                className="form-control form-control-color border-0 p-0 rounded-circle"
                                style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                                value={data.color?.startsWith('#') && (data.color.length === 7 || data.color.length === 4) ? data.color : '#EA580C'}
                                onChange={e => setData('color', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Hex Code Input */}
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderRadius: '8px 0 0 8px' }}>
                            <i className="fa-solid fa-palette" style={{ color: data.color || '#EA580C' }}></i>
                        </span>
                        <input
                            type="text"
                            className={`form-control orange-input-focus border-start-0 ${errors.color ? 'is-invalid' : ''}`}
                            style={{ borderRadius: '0 8px 8px 0' }}
                            value={data.color}
                            onChange={e => setData('color', e.target.value)}
                            placeholder="Mã màu HEX (VD: #EA580C)"
                        />
                    </div>
                    {errors.color && <div className="text-danger font-sm mt-1">{errors.color}</div>}
                </div>

                {/* Live Preview Card */}
                <div className="mb-3 p-3 rounded-3 border d-flex align-items-center justify-content-between" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="d-flex align-items-center gap-3">
                        <div 
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{ 
                                width: '40px', 
                                height: '40px', 
                                backgroundColor: `${data.color || '#EA580C'}18`, 
                                color: data.color || '#EA580C' 
                            }}
                        >
                            <i className={`${data.icon || 'fa-solid fa-folder'} fs-5`}></i>
                        </div>
                        <div>
                            <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{data.name || 'Tên chuyên mục'}</div>
                            <small className="text-muted font-sm">Xem trước hiển thị</small>
                        </div>
                    </div>
                    <div>
                        <span 
                            className="badge rounded-pill px-3 py-2 fw-semibold"
                            style={{ 
                                backgroundColor: data.color || '#EA580C',
                                color: '#ffffff',
                                fontSize: '0.8rem'
                            }}
                        >
                            <i className={`${data.icon || 'fa-solid fa-folder'} me-1`}></i>
                            {data.name || 'Chuyên mục'}
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Thứ tự sắp xếp</label>
                        <input type="number" className={`form-control rounded-3 py-2 orange-input-focus ${errors.sort_order ? 'is-invalid' : ''}`} value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} min="0" />
                        {errors.sort_order && <div className="text-danger font-sm mt-1">{errors.sort_order}</div>}
                    </div>
                    <div className="col-md-6 mb-3 d-flex align-items-end pb-2">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="isActive" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} />
                            <label className="form-check-label ms-2 fw-medium" htmlFor="isActive" style={{ cursor: 'pointer' }}>Hiển thị (Active)</label>
                        </div>
                    </div>
                </div>
            </FormModal>
        </CmsLayout>
    );
}
