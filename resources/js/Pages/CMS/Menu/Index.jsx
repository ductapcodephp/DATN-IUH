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

    const positionLabel = (pos) => {
        const map = { header: 'Header', cart: 'Cart', footer: 'Footer' };
        return map[pos] || pos;
    };

    const positionColor = (pos) => {
        const map = { header: '#6366f1', cart: '#f59e0b', footer: '#64748b' };
        return map[pos] || '#6366f1';
    };

    const truncateUrl = (url) => {
        if (!url) return null;
        try {
            const u = new URL(url);
            return u.pathname === '/' ? u.hostname : u.hostname + u.pathname;
        } catch {
            return url.length > 40 ? url.substring(0, 40) + '…' : url;
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

                {menus.length === 0 ? (
                    <div className="card border-0 shadow-none glass-card rounded-4 p-5 stagger-fade-up text-center">
                        <i className="fa-solid fa-bars-staggered fs-1 mb-3 d-block opacity-50 text-muted"></i>
                        <p className="text-muted mb-0">Chưa có menu nào được tạo.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3 stagger-fade-up">
                        {menus.map((menu, index) => (
                            <div key={`menu-${menu.id}`} className="card border-0 shadow-none glass-card rounded-4 overflow-hidden">
                                {/* Parent Row */}
                                <div className="d-flex align-items-center px-4 py-3 gap-3" style={{ borderLeft: `4px solid ${positionColor(menu.position)}` }}>
                                    {/* Sort Order */}
                                    <div className="text-muted fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                                         style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,0,0,.04)', fontSize: '0.85rem' }}>
                                        {menu.sort_order}
                                    </div>

                                    {/* Icon + Name + Position Badge */}
                                    <div className="d-flex align-items-center gap-2 flex-shrink-0" style={{ minWidth: 180 }}>
                                        {menu.icon && <i className={`${menu.icon} fs-5`} style={{ color: positionColor(menu.position), width: 22, textAlign: 'center' }}></i>}
                                        <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>{menu.name}</span>
                                        <span className="badge rounded-pill text-white px-2" style={{ fontSize: '0.65rem', backgroundColor: positionColor(menu.position) }}>
                                            {positionLabel(menu.position)}
                                        </span>
                                    </div>

                                    {/* URL */}
                                    <div className="flex-grow-1 text-truncate" style={{ minWidth: 0 }}>
                                        {menu.url ? (
                                            <a href={menu.url} target="_blank" rel="noopener noreferrer"
                                               className="text-decoration-none d-inline-flex align-items-center gap-1"
                                               style={{ color: '#6366f1', fontSize: '0.88rem', maxWidth: '100%' }}
                                               title={menu.url}>
                                                <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem', flexShrink: 0 }}></i>
                                                <span className="text-truncate">{truncateUrl(menu.url)}</span>
                                            </a>
                                        ) : (
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>—</span>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="flex-shrink-0">
                                        {menu.display === 'show' ? (
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3"
                                                  style={{ fontSize: '0.75rem' }}>
                                                <i className="fa-solid fa-eye me-1" style={{ fontSize: '0.65rem' }}></i>Hiển thị
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3"
                                                  style={{ fontSize: '0.75rem' }}>
                                                <i className="fa-solid fa-eye-slash me-1" style={{ fontSize: '0.65rem' }}></i>Đã ẩn
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex gap-1 flex-shrink-0">
                                        <button onClick={() => openModal(null, menu.id)}
                                                className="btn btn-sm d-flex align-items-center justify-content-center"
                                                style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(99,102,241,.08)', color: '#6366f1' }}
                                                title="Thêm menu con">
                                            <i className="fa-solid fa-plus" style={{ fontSize: '0.8rem' }}></i>
                                        </button>
                                        <button onClick={() => openModal(menu)}
                                                className="btn btn-sm d-flex align-items-center justify-content-center"
                                                style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(100,116,139,.08)', color: '#64748b' }}
                                                title="Sửa menu">
                                            <i className="fa-solid fa-pen" style={{ fontSize: '0.75rem' }}></i>
                                        </button>
                                        <button onClick={() => handleDelete(menu.id)}
                                                className="btn btn-sm d-flex align-items-center justify-content-center"
                                                style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(239,68,68,.06)', color: '#ef4444' }}
                                                title="Xóa menu">
                                            <i className="fa-solid fa-trash" style={{ fontSize: '0.75rem' }}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Children */}
                                {menu.children && menu.children.length > 0 && (
                                    <div style={{ backgroundColor: 'rgba(0,0,0,.015)' }}>
                                        {menu.children.map((child, ci) => (
                                            <div key={`child-${child.id}`}
                                                 className="d-flex align-items-center px-4 py-2 gap-3"
                                                 style={{ marginLeft: 36, borderTop: '1px solid rgba(0,0,0,.04)' }}>
                                                {/* Sort */}
                                                <div className="text-muted d-flex align-items-center justify-content-center flex-shrink-0"
                                                     style={{ width: 28, height: 28, borderRadius: 6, fontSize: '0.8rem' }}>
                                                    {child.sort_order}
                                                </div>

                                                {/* Arrow + Name */}
                                                <div className="d-flex align-items-center gap-2 flex-shrink-0" style={{ minWidth: 160 }}>
                                                    <i className="fa-solid fa-turn-up fa-rotate-90 text-muted opacity-25" style={{ fontSize: '0.75rem' }}></i>
                                                    {child.icon && <i className={`${child.icon} text-muted`} style={{ width: 18, textAlign: 'center', fontSize: '0.9rem' }}></i>}
                                                    <span className="fw-medium text-dark" style={{ fontSize: '0.93rem' }}>{child.name}</span>
                                                </div>

                                                {/* URL */}
                                                <div className="flex-grow-1 text-truncate" style={{ minWidth: 0 }}>
                                                    {child.url ? (
                                                        <a href={child.url} target="_blank" rel="noopener noreferrer"
                                                           className="text-decoration-none d-inline-flex align-items-center gap-1"
                                                           style={{ color: '#94a3b8', fontSize: '0.83rem', maxWidth: '100%' }}
                                                           title={child.url}>
                                                            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem', flexShrink: 0 }}></i>
                                                            <span className="text-truncate">{truncateUrl(child.url)}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted" style={{ fontSize: '0.83rem' }}>—</span>
                                                    )}
                                                </div>

                                                {/* Status */}
                                                <div className="flex-shrink-0">
                                                    {child.display === 'show' ? (
                                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2" style={{ fontSize: '0.7rem' }}>
                                                            <i className="fa-solid fa-eye" style={{ fontSize: '0.6rem' }}></i>
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2" style={{ fontSize: '0.7rem' }}>
                                                            <i className="fa-solid fa-eye-slash" style={{ fontSize: '0.6rem' }}></i>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="d-flex gap-1 flex-shrink-0">
                                                    <button onClick={() => openModal(child)}
                                                            className="btn btn-sm d-flex align-items-center justify-content-center"
                                                            style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: 'rgba(100,116,139,.06)', color: '#94a3b8' }}
                                                            title="Sửa">
                                                        <i className="fa-solid fa-pen" style={{ fontSize: '0.7rem' }}></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(child.id)}
                                                            className="btn btn-sm d-flex align-items-center justify-content-center"
                                                            style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: 'rgba(239,68,68,.04)', color: '#fca5a5' }}
                                                            title="Xóa">
                                                        <i className="fa-solid fa-trash" style={{ fontSize: '0.7rem' }}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
