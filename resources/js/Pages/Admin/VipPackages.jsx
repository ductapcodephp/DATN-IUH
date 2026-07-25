import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import FormModal from '@/Components/FormModal';
import Swal from 'sweetalert2';

export default function VipPackages({ packages = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        badge_text: '',
        package_type: 'commission',
        role_type: 'seller',
        price: '',
        duration_days: '',
        description: '',
        priority_level: 0,
        commission_rate: '',
        max_storage_gb: ''
    });

    const handleOpenModal = (pkg = null) => {
        clearErrors();
        if (pkg) {
            setEditingId(pkg.id);
            setData({
                name: pkg.name || '',
                badge_text: pkg.badge_text || '',
                package_type: pkg.package_type || 'commission',
                role_type: pkg.role_type || 'seller',
                price: pkg.price || '',
                duration_days: pkg.duration_days || '',
                description: pkg.description || '',
                priority_level: pkg.priority_level || 0,
                commission_rate: pkg.commission_rate || '',
                max_storage_gb: pkg.max_storage_gb || ''
            });
        } else {
            setEditingId(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            put(route('admin.vip-packages.update', editingId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật gói VIP.', confirmButtonColor: '#43e97b' });
                }
            });
        } else {
            post(route('admin.vip-packages.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã tạo gói VIP mới.', confirmButtonColor: '#43e97b' });
                }
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Xóa gói VIP?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.vip-packages.destroy', id), {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        if (!page.props.flash.error) {
                            Swal.fire({ title: 'Đã xóa!', text: 'Gói VIP đã được xóa.', icon: 'success', confirmButtonColor: '#43e97b' });
                        }
                    }
                });
            }
        });
    };

    const handleToggleStatus = (id, currentStatus) => {
        router.post(route('admin.vip-packages.toggle-status', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'success',
                    title: currentStatus ? 'Đã tạm ẩn gói VIP' : 'Đã kích hoạt gói VIP'
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Quản lý Gói VIP" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý Gói VIP</h3>
                        <p className="text-muted mb-0">Thiết lập các gói dịch vụ cao cấp cho giảng viên và học viên</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary fw-bold rounded-pill px-4 py-2 shadow-sm" style={{ background: 'var(--primary-glow)', border: 'none' }}>
                        <i className="fa-solid fa-plus me-2"></i> Tạo gói mới
                    </button>
                </div>
                
                <ul className="nav nav-pills mb-4 mt-4 stagger-fade-up gap-2 flex-wrap">
                    <li className="nav-item">
                        <button className={`nav-link fw-bold px-4 rounded-pill ${activeTab === 'all' ? 'active shadow-sm' : 'bg-light text-muted'}`} onClick={() => setActiveTab('all')}>
                            <i className="fa-solid fa-layer-group me-2"></i> Tất cả
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link fw-bold px-4 rounded-pill ${activeTab === 'user' ? 'active shadow-sm' : 'bg-light text-muted'}`} onClick={() => setActiveTab('user')}>
                            <i className="fa-solid fa-user-graduate me-2"></i> Gói Học viên
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link fw-bold px-4 rounded-pill ${activeTab === 'commission' ? 'active shadow-sm' : 'bg-light text-muted'}`} onClick={() => setActiveTab('commission')}>
                            <i className="fa-solid fa-percent me-2"></i> Giảm chiết khấu (GV)
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link fw-bold px-4 rounded-pill ${activeTab === 'storage' ? 'active shadow-sm' : 'bg-light text-muted'}`} onClick={() => setActiveTab('storage')}>
                            <i className="fa-solid fa-hard-drive me-2"></i> Mở rộng bộ nhớ (GV)
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link fw-bold px-4 rounded-pill ${activeTab === 'combo' ? 'active shadow-sm' : 'bg-light text-muted'}`} onClick={() => setActiveTab('combo')}>
                            <i className="fa-solid fa-gem me-2"></i> Combo VIP (GV)
                        </button>
                    </li>
                </ul>

                <div className="row g-4 mt-2">
                    {packages.filter(pkg => {
                        if (activeTab === 'all') return true;
                        if (activeTab === 'user') return pkg.role_type === 'user';
                        return pkg.role_type === 'seller' && pkg.package_type === activeTab;
                    }).map(pkg => (
                        <div className="col-md-6 col-xl-4 stagger-fade-up" key={pkg.id}>
                            <div className="card glass-card border-0 h-100 position-relative overflow-hidden shadow-sm hover-lift" style={{ borderRadius: '1rem' }}>
                                <div className={`position-absolute top-0 end-0 p-3 z-1`}>
                                    <span className={`badge rounded-pill px-3 py-2 fw-bold ${pkg.role_type === 'seller' ? 'bg-primary' : 'bg-info text-dark'}`}>
                                        {pkg.role_type === 'seller' ? 'Dành cho Giảng viên' : 'Dành cho Học viên'}
                                    </span>
                                </div>
                                {pkg.badge_text && (
                                    <div className="position-absolute z-1" style={{ top: '20px', left: '-30px', transform: 'rotate(-45deg)', background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', padding: '5px 40px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '12px' }}>
                                        {pkg.badge_text}
                                    </div>
                                )}
                                <div className={`glow-bg ${pkg.role_type === 'seller' ? 'bg-primary-glow' : 'bg-info-glow'}`} style={{ opacity: 0.05 }}></div>
                                <div className="card-body p-4 d-flex flex-column position-relative z-1 mt-3">
                                    <div className="d-flex align-items-center justify-content-center mb-3 gap-2">
                                        {pkg.is_active ? (
                                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1"><i className="fa-solid fa-circle me-1" style={{ fontSize: '8px' }}></i> Hoạt động</span>
                                        ) : (
                                            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1"><i className="fa-solid fa-circle me-1" style={{ fontSize: '8px' }}></i> Đang ẩn</span>
                                        )}
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1"><i className="fa-solid fa-layer-group me-1"></i> {pkg.package_type}</span>
                                    </div>
                                    <div className="text-center mb-4">
                                        <h4 className="fw-bold text-dark mb-2">{pkg.name}</h4>
                                        <h2 className="fw-bold text-dark my-3">
                                            {new Intl.NumberFormat('vi-VN').format(pkg.price)}<span className="fs-5 text-muted fw-normal">₫</span>
                                        </h2>
                                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fs-6">
                                            <i className="fa-regular fa-clock text-warning me-2"></i> {pkg.duration_days} ngày
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4 flex-grow-1 bg-light rounded-4 p-3 border">
                                        <h6 className="fw-bold text-dark mb-3 fs-7 text-uppercase tracking-wide border-bottom pb-2">Đặc quyền bao gồm:</h6>
                                        <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                                            {pkg.commission_rate > 0 && (
                                                <li className="d-flex align-items-start gap-2">
                                                    <i className="fa-solid fa-circle-check text-primary fs-5 mt-1"></i>
                                                    <div>
                                                        <strong className="d-block text-dark">Chiết khấu hoa hồng {pkg.commission_rate}%</strong>
                                                        <small className="text-muted">Ưu đãi giảm phí sàn trên mỗi giao dịch</small>
                                                    </div>
                                                </li>
                                            )}
                                            {pkg.max_storage_gb > 0 && (
                                                <li className="d-flex align-items-start gap-2">
                                                    <i className="fa-solid fa-cloud text-info fs-5 mt-1"></i>
                                                    <div>
                                                        <strong className="d-block text-dark">Dung lượng lưu trữ {pkg.max_storage_gb}GB</strong>
                                                        <small className="text-muted">Không gian lưu trữ video, tài liệu</small>
                                                    </div>
                                                </li>
                                            )}
                                            {pkg.description && (
                                                <li className="d-flex align-items-start gap-2">
                                                    <i className="fa-solid fa-star text-warning fs-5 mt-1"></i>
                                                    <div className="text-muted fst-italic">"{pkg.description}"</div>
                                                </li>
                                            )}
                                            {!pkg.description && !pkg.commission_rate && !pkg.max_storage_gb && (
                                                <li className="text-muted text-center fst-italic py-2">Chưa có mô tả chi tiết</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="d-flex gap-2 mt-auto pt-2">
                                        <button onClick={() => handleToggleStatus(pkg.id, pkg.is_active)} className={`btn btn-sm ${pkg.is_active ? 'btn-light text-warning' : 'btn-light text-success'} flex-grow-1 rounded-pill fw-bold border`} title={pkg.is_active ? "Ẩn gói này" : "Kích hoạt"}>
                                            <i className={`fa-solid ${pkg.is_active ? 'fa-eye-slash' : 'fa-eye'} me-1`}></i> {pkg.is_active ? 'Ẩn' : 'Hiện'}
                                        </button>
                                        <button onClick={() => handleOpenModal(pkg)} className="btn btn-sm btn-primary flex-grow-1 rounded-pill fw-bold shadow-sm">
                                            <i className="fa-solid fa-pen-to-square me-1"></i> Sửa
                                        </button>
                                        <button onClick={() => handleDelete(pkg.id)} className="btn btn-sm btn-danger flex-grow-1 rounded-pill fw-bold shadow-sm">
                                            <i className="fa-solid fa-trash me-1"></i> Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {packages.filter(pkg => {
                        if (activeTab === 'all') return true;
                        if (activeTab === 'user') return pkg.role_type === 'user';
                        return pkg.role_type === 'seller' && pkg.package_type === activeTab;
                    }).length === 0 && (
                        <div className="col-12 text-center py-5 stagger-fade-up">
                            <div className="text-muted mb-3"><i className="fa-regular fa-folder-open fa-4x opacity-50"></i></div>
                            <h4 className="fw-bold text-dark">Chưa có gói VIP nào</h4>
                            <p className="text-muted">Hãy tạo gói VIP đầu tiên để bắt đầu cung cấp dịch vụ cao cấp.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Cập nhật Gói VIP" : "Thêm Gói VIP Mới"}
                subtitle="Cấu hình thông tin và quyền lợi của gói"
                icon={<i className="fa-solid fa-crown text-warning"></i>}
                onSubmit={handleSubmit}
                isSubmitting={processing}
                size="lg"
            >
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="form-floating">
                            <input 
                                type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                id="pkgName"
                                placeholder="VD: Gói Bạc, Gói Vàng..."
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <label htmlFor="pkgName" className="fw-bold text-muted"><i className="fa-solid fa-signature me-2"></i>Tên gói VIP</label>
                        </div>
                        {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-floating">
                            <input 
                                type="text" 
                                className={`form-control ${errors.badge_text ? 'is-invalid' : ''}`}
                                id="badgeText"
                                placeholder="VD: HOT, BEST SELLER"
                                value={data.badge_text}
                                onChange={e => setData('badge_text', e.target.value)}
                            />
                            <label htmlFor="badgeText" className="fw-bold text-muted"><i className="fa-solid fa-tag me-2"></i>Huy hiệu nổi bật (Tùy chọn)</label>
                        </div>
                        {errors.badge_text && <div className="text-danger small mt-1">{errors.badge_text}</div>}
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <select 
                                className={`form-select ${errors.role_type ? 'is-invalid' : ''}`}
                                id="roleType"
                                value={data.role_type}
                                onChange={e => setData('role_type', e.target.value)}
                            >
                                <option value="seller">Giảng viên</option>
                                <option value="user">Học viên</option>
                            </select>
                            <label htmlFor="roleType" className="fw-bold text-muted"><i className="fa-solid fa-users me-2"></i>Đối tượng áp dụng</label>
                        </div>
                        {errors.role_type && <div className="text-danger small mt-1">{errors.role_type}</div>}
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <select 
                                className={`form-select ${errors.package_type ? 'is-invalid' : ''}`}
                                id="packageType"
                                value={data.package_type}
                                onChange={e => {
                                    const val = e.target.value;
                                    let updates = { package_type: val };
                                    if (val === 'commission' || val === 'standard') updates.max_storage_gb = '';
                                    if (val === 'storage' || val === 'standard') updates.commission_rate = '';
                                    setData({ ...data, ...updates });
                                }}
                            >
                                <option value="commission">Giảm chiết khấu phí (Sàn)</option>
                                <option value="storage">Mở rộng dung lượng (GB)</option>
                                <option value="combo">Combo VIP (Giảm phí + Mở rộng)</option>
                                <option value="standard">Tiêu chuẩn (Chỉ mô tả)</option>
                            </select>
                            <label htmlFor="packageType" className="fw-bold text-muted"><i className="fa-solid fa-layer-group me-2"></i>Loại đặc quyền</label>
                        </div>
                        {errors.package_type && <div className="text-danger small mt-1">{errors.package_type}</div>}
                    </div>

                    <div className="col-md-6">
                        <div className="form-floating">
                            <input 
                                type="number" 
                                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                id="price"
                                placeholder="VD: 199000"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                            />
                            <label htmlFor="price" className="fw-bold text-muted"><i className="fa-solid fa-money-bill-wave me-2"></i>Giá tiền (VNĐ)</label>
                        </div>
                        {errors.price && <div className="text-danger small mt-1">{errors.price}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <div className="form-floating">
                            <input 
                                type="number" 
                                className={`form-control ${errors.duration_days ? 'is-invalid' : ''}`}
                                id="durationDays"
                                placeholder="VD: 30"
                                value={data.duration_days}
                                onChange={e => setData('duration_days', e.target.value)}
                            />
                            <label htmlFor="durationDays" className="fw-bold text-muted"><i className="fa-solid fa-clock me-2"></i>Thời hạn (Số ngày)</label>
                        </div>
                        {errors.duration_days && <div className="text-danger small mt-1">{errors.duration_days}</div>}
                    </div>

                    {(data.package_type === 'commission' || data.package_type === 'combo') && (
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input 
                                    type="number" 
                                    className={`form-control ${errors.commission_rate ? 'is-invalid' : ''}`}
                                    id="commissionRate"
                                    placeholder="VD: 15"
                                    value={data.commission_rate}
                                    onChange={e => setData('commission_rate', e.target.value)}
                                />
                                <label htmlFor="commissionRate" className="fw-bold text-muted"><i className="fa-solid fa-percent me-2"></i>Mức chiết khấu (%)</label>
                            </div>
                            {errors.commission_rate && <div className="text-danger small mt-1">{errors.commission_rate}</div>}
                        </div>
                    )}

                    {(data.package_type === 'storage' || data.package_type === 'combo') && (
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input 
                                    type="number" 
                                    className={`form-control ${errors.max_storage_gb ? 'is-invalid' : ''}`}
                                    id="maxStorageGb"
                                    placeholder="VD: 50"
                                    value={data.max_storage_gb}
                                    onChange={e => setData('max_storage_gb', e.target.value)}
                                />
                                <label htmlFor="maxStorageGb" className="fw-bold text-muted"><i className="fa-solid fa-hard-drive me-2"></i>Bộ nhớ tối đa (GB)</label>
                            </div>
                            {errors.max_storage_gb && <div className="text-danger small mt-1">{errors.max_storage_gb}</div>}
                        </div>
                    )}

                    <div className="col-md-12">
                        <div className="form-floating">
                            <input 
                                type="number" 
                                className={`form-control ${errors.priority_level ? 'is-invalid' : ''}`}
                                id="priorityLevel"
                                placeholder="Số lớn ưu tiên trước"
                                value={data.priority_level}
                                onChange={e => setData('priority_level', e.target.value)}
                            />
                            <label htmlFor="priorityLevel" className="fw-bold text-muted"><i className="fa-solid fa-sort-amount-up me-2"></i>Độ ưu tiên hiển thị</label>
                        </div>
                        {errors.priority_level && <div className="text-danger small mt-1">{errors.priority_level}</div>}
                    </div>

                    <div className="col-12">
                        <div className="form-floating">
                            <textarea 
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                id="description"
                                style={{ height: '100px' }}
                                placeholder="Mô tả tóm tắt về lợi ích của gói VIP..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                            <label htmlFor="description" className="fw-bold text-muted"><i className="fa-solid fa-align-left me-2"></i>Mô tả tóm tắt gói VIP</label>
                        </div>
                        {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
                    </div>
                </div>
            </FormModal>
        </AdminLayout>
    );
}
