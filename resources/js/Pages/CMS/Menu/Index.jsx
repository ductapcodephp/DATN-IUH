import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import IconPicker from '@/Components/CMS/IconPicker';
export default function Index({ menus }) {
    const [showModal, setShowModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [addingChildTo, setAddingChildTo] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        url: '',
        icon: '',
        position: 'header',
        parent_id: '',
        display: 'show',
        sort_order: 0,
    });

    const openModal = (menu = null, parentId = '') => {
        if (menu) {
            setEditingMenu(menu);
            setAddingChildTo(null);
            setData({
                name: menu.name,
                url: menu.url || '',
                icon: menu.icon || '',
                position: menu.position || 'header',
                parent_id: menu.parent_id || '',
                display: menu.display || 'show',
                sort_order: menu.sort_order || 0,
            });
        } else {
            setEditingMenu(null);
            setAddingChildTo(parentId);
            reset();
            setData('parent_id', parentId);
            setData('position', 'header');
            setData('display', 'show');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMenu(null);
        setAddingChildTo(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMenu) {
            put(route('cms.menu.update', editingMenu.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('cms.menu.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa menu này? Tất cả menu con (nếu có) cũng sẽ bị xóa!')) {
            destroy(route('cms.menu.destroy', id));
        }
    };

    return (
        <CMSLayout>
            <Head title="Quản lý Menu" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up mb-4">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý Menu</h3>
                        <p className="text-muted mb-0">Thiết lập menu Header & Footer (Tối đa 2 cấp)</p>
                    </div>
                    <button onClick={() => openModal()} className="btn btn-primary btn-gradient-orange border-0 rounded-pill px-4 py-2 shadow-sm">
                        <i className="fa-solid fa-plus me-2"></i>Thêm Menu Cha
                    </button>
                </div>

                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up">
                    {menus.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="fa-solid fa-bars-staggered fs-1 mb-3 d-block opacity-50"></i>
                            Chưa có menu nào được tạo.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="border-0 rounded-start-3 px-4 py-3" style={{ width: '80px' }}>STT</th>
                                        <th className="border-0 py-3">Tên Menu</th>
                                        <th className="border-0 py-3">URL</th>
                                        <th className="border-0 py-3 text-center">Trạng thái</th>
                                        <th className="border-0 rounded-end-3 text-end px-4 py-3" style={{ width: '250px' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="border-top-0">
                                    {menus.map((menu, index) => (
                                        <React.Fragment key={`menu-${menu.id}`}>
                                            {/* Parent Menu Row */}
                                            <tr style={{ backgroundColor: 'var(--bs-light)', borderBottom: '2px solid #fff' }}>
                                                <td className="px-4 py-3 fw-bold text-muted text-center">{menu.sort_order}</td>
                                                <td className="py-3">
                                                    <span className="fw-bold text-dark fs-5">
                                                        {menu.icon && <i className={`${menu.icon} me-2 text-primary`}></i>}
                                                        {menu.name}
                                                    </span>
                                                    <span className="badge bg-secondary ms-2 rounded-pill" style={{ fontSize: '0.7em' }}>{menu.position}</span>
                                                </td>
                                                <td className="py-3 text-primary">{menu.url || '-'}</td>
                                                <td className="py-3 text-center">
                                                    {menu.display === 'show' ? (
                                                        <span className="badge bg-success rounded-pill px-3">Hiển thị</span>
                                                    ) : (
                                                        <span className="badge bg-warning text-dark rounded-pill px-3">Đã ẩn</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <button onClick={() => openModal(null, menu.id)} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" title="Thêm menu con">
                                                        <i className="fa-solid fa-plus"></i> Con
                                                    </button>
                                                    <button onClick={() => openModal(menu)} className="btn btn-sm btn-outline-secondary rounded-pill px-3 me-2" title="Sửa menu">
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(menu.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3" title="Xóa menu">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Children Menu Rows */}
                                            {menu.children && menu.children.length > 0 && menu.children.map(child => (
                                                <tr key={`child-${child.id}`}>
                                                    <td className="px-4 py-3 fw-bold text-muted text-center" style={{ fontSize: '0.9em' }}>{child.sort_order}</td>
                                                    <td className="py-3 ps-5">
                                                        <i className="fa-solid fa-arrow-turn-up fa-rotate-90 text-muted me-2 opacity-50"></i>
                                                        <span className="text-dark fw-medium">
                                                            {child.icon && <i className={`${child.icon} me-2 text-muted`}></i>}
                                                            {child.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-muted">{child.url || '-'}</td>
                                                    <td className="py-3 text-center">
                                                        {child.display === 'show' ? (
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">Hiển thị</span>
                                                        ) : (
                                                            <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">Đã ẩn</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-end">
                                                        <button onClick={() => openModal(child)} className="btn btn-sm btn-light rounded-pill px-3 me-2 text-secondary" title="Sửa menu">
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button onClick={() => handleDelete(child.id)} className="btn btn-sm btn-light rounded-pill px-3 text-danger" title="Xóa menu">
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Create/Edit */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold text-dark">
                                    {editingMenu ? 'Cập nhật Menu' : (addingChildTo ? 'Thêm Menu Con' : 'Thêm Menu Cha')}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body py-0">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Tên Menu <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control orange-input-focus ${errors.name ? 'is-invalid' : ''}`}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            placeholder="VD: Khóa học, Bài viết..."
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Đường dẫn (URL)</label>
                                        <input
                                            type="text"
                                            className={`form-control orange-input-focus ${errors.url ? 'is-invalid' : ''}`}
                                            value={data.url}
                                            onChange={(e) => setData('url', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                            placeholder="VD: /khoa-hoc hoặc https://google.com"
                                        />
                                        {errors.url && <div className="invalid-feedback">{errors.url}</div>}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Vị trí</label>
                                            <select
                                                className={`form-select orange-input-focus ${errors.position ? 'is-invalid' : ''}`}
                                                value={data.position}
                                                onChange={(e) => setData('position', e.target.value)}
                                                style={{ borderRadius: '8px' }}
                                                disabled={!!addingChildTo || (editingMenu && editingMenu.parent_id)}
                                            >
                                                <option value="header">Header (Menu trên)</option>
                                                <option value="cart">Cart (Menu giỏ hàng)</option>
                                            </select>
                                            {(!!addingChildTo || (editingMenu && editingMenu.parent_id)) && (
                                                <small className="text-muted" style={{ fontSize: '0.8em' }}>Menu con tự động theo vị trí của Menu cha</small>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Sắp xếp (STT)</label>
                                            <input
                                                type="number"
                                                className={`form-control orange-input-focus ${errors.sort_order ? 'is-invalid' : ''}`}
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', e.target.value)}
                                                style={{ borderRadius: '8px' }}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3 d-flex flex-column justify-content-center">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Icon (Tùy chọn)</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <IconPicker 
                                                    icon={data.icon || ''} 
                                                    onChange={(ic) => setData('icon', ic)} 
                                                    editable={true} 
                                                />
                                                <input
                                                    type="text"
                                                    className={`form-control orange-input-focus ${errors.icon ? 'is-invalid' : ''}`}
                                                    value={data.icon}
                                                    onChange={(e) => setData('icon', e.target.value)}
                                                    style={{ borderRadius: '8px' }}
                                                    placeholder="Lấy class từ IconPicker"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Trạng thái</label>
                                            <select
                                                className={`form-select orange-input-focus ${errors.display ? 'is-invalid' : ''}`}
                                                value={data.display}
                                                onChange={(e) => setData('display', e.target.value)}
                                                style={{ borderRadius: '8px' }}
                                            >
                                                <option value="show">Hiển thị</option>
                                                <option value="hide">Ẩn</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer border-top-0 pt-3">
                                    <button type="button" className="btn btn-light" onClick={closeModal} style={{ borderRadius: '8px' }}>Hủy</button>
                                    <button type="submit" className="btn btn-primary btn-gradient-orange border-0" disabled={processing} style={{ borderRadius: '8px' }}>
                                        {processing ? 'Đang xử lý...' : (editingMenu ? 'Cập nhật' : 'Lưu Menu')}
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
