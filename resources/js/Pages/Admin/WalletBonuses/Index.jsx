import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import FormModal from '@/Components/FormModal';
import Swal from 'sweetalert2';

export default function WalletBonuses({ walletBonuses = { data: [], links: [] } }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        min_amount: '',
        bonus_percentage: '',
        max_bonus_amount: '',
        is_active: true
    });

    const handleOpenModal = (item = null) => {
        clearErrors();
        if (item) {
            setEditingId(item.id);
            setData({
                min_amount: item.min_amount || '',
                bonus_percentage: item.bonus_percentage || '',
                max_bonus_amount: item.max_bonus_amount || '',
                is_active: item.is_active === 1 || item.is_active === true
            });
        } else {
            setEditingId(null);
            reset();
            setData('is_active', true);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            put(route('admin.wallet-bonuses.update', editingId), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật thưởng ví.', confirmButtonColor: '#43e97b' });
                }
            });
        } else {
            post(route('admin.wallet-bonuses.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã thêm thưởng ví mới.', confirmButtonColor: '#43e97b' });
                }
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Phần thưởng ví này sẽ bị xóa mềm!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff0844',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.wallet-bonuses.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Đã xóa thưởng ví.', confirmButtonColor: '#43e97b' })
                });
            }
        });
    };

    const handleToggleStatus = (id) => {
        router.post(route('admin.wallet-bonuses.toggle-status', id), {}, {
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Quản lý thưởng ví" />

            <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up mb-4">
                <div>
                    <h3 className="m-0 fw-bold text-dark">Quản lý thưởng nạp ví</h3>
                    <p className="text-muted mb-0">Cấu hình tỷ lệ thưởng khi người dùng nạp tiền vào ví</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-dark rounded-pill px-4 btn-hover-scale shadow-sm">
                    <i className="fa-solid fa-plus me-2"></i> Thêm mức thưởng
                </button>
            </div>

            <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up">
                <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                        <thead className="border-bottom border-light">
                            <tr>
                                <th className="text-muted fw-semibold py-3">Mức nạp tối thiểu</th>
                                <th className="text-muted fw-semibold py-3">% Thưởng</th>
                                <th className="text-muted fw-semibold py-3">Thưởng tối đa</th>
                                <th className="text-muted fw-semibold py-3">Trạng thái</th>
                                <th className="text-end text-muted fw-semibold py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {walletBonuses.data.map(item => (
                                <tr key={item.id} className="border-bottom border-light hover-bg-light transition-all">
                                    <td className="py-3 fw-medium">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.min_amount)}
                                    </td>
                                    <td className="py-3">
                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                            {item.bonus_percentage}%
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {item.max_bonus_amount ? 
                                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.max_bonus_amount)
                                            : <span className="text-muted fst-italic">Không giới hạn</span>
                                        }
                                    </td>
                                    <td className="py-3">
                                        <div className="form-check form-switch cursor-pointer" onClick={() => handleToggleStatus(item.id)}>
                                            <input 
                                                className="form-check-input cursor-pointer" 
                                                type="checkbox" 
                                                checked={item.is_active} 
                                                readOnly 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <button onClick={() => handleOpenModal(item)} className="btn btn-sm btn-outline-secondary rounded-pill me-2 px-3">
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {walletBonuses.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">Không có dữ liệu mức thưởng.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {walletBonuses.links && walletBonuses.links.length > 3 && (
                    <div className="d-flex justify-content-center mt-4">
                        <ul className="pagination pagination-sm m-0">
                            {walletBonuses.links.map((link, index) => (
                                <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                    <Link 
                                        href={link.url || '#'} 
                                        className="page-link border-0 rounded mx-1 px-3 shadow-sm"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <FormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Cập nhật mức thưởng' : 'Thêm mức thưởng mới'}
                onSubmit={handleSubmit}
                processing={processing}
                submitText={editingId ? 'Cập nhật' : 'Thêm mới'}
                size="md"
            >
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label fw-medium text-dark">Mức nạp tối thiểu (VNĐ) <span className="text-danger">*</span></label>
                        <input 
                            type="number" 
                            className={`form-control form-control-lg border-0 bg-light ${errors.min_amount ? 'is-invalid' : ''}`}
                            placeholder="Ví dụ: 100000"
                            value={data.min_amount}
                            onChange={e => setData('min_amount', e.target.value)}
                        />
                        {errors.min_amount && <div className="invalid-feedback">{errors.min_amount}</div>}
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-medium text-dark">Phần trăm thưởng (%) <span className="text-danger">*</span></label>
                        <input 
                            type="number" 
                            className={`form-control form-control-lg border-0 bg-light ${errors.bonus_percentage ? 'is-invalid' : ''}`}
                            placeholder="Ví dụ: 5"
                            value={data.bonus_percentage}
                            onChange={e => setData('bonus_percentage', e.target.value)}
                        />
                        {errors.bonus_percentage && <div className="invalid-feedback">{errors.bonus_percentage}</div>}
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-medium text-dark">Thưởng tối đa (VNĐ)</label>
                        <input 
                            type="number" 
                            className={`form-control form-control-lg border-0 bg-light ${errors.max_bonus_amount ? 'is-invalid' : ''}`}
                            placeholder="Để trống nếu không giới hạn"
                            value={data.max_bonus_amount}
                            onChange={e => setData('max_bonus_amount', e.target.value)}
                        />
                        <div className="form-text">Nếu không có giới hạn thưởng, hãy để trống trường này.</div>
                        {errors.max_bonus_amount && <div className="invalid-feedback">{errors.max_bonus_amount}</div>}
                    </div>

                    <div className="col-12 mt-4">
                        <div className="form-check form-switch d-flex align-items-center gap-2">
                            <input 
                                className="form-check-input mt-0 cursor-pointer" 
                                type="checkbox" 
                                id="isActiveSwitch"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                            />
                            <label className="form-check-label mb-0 cursor-pointer fw-medium" htmlFor="isActiveSwitch">
                                Kích hoạt mức thưởng này
                            </label>
                        </div>
                    </div>
                </div>
            </FormModal>
        </AdminLayout>
    );
}
