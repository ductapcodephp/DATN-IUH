import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";
import Modal from '@/Components/Modal.jsx';

export default function Coupons({ coupons }) {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        code: '',
        type: 'percent',
        value: '',
        max_uses: '',
        starts_at: '',
        expires_at: '',
        is_active: true,
    });

    const openModal = (coupon = null) => {
        clearErrors();
        if (coupon) {
            setIsEdit(true);
            setEditId(coupon.id);
            setData({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                max_uses: coupon.max_uses || '',
                starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : '',
                expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : '',
                is_active: coupon.is_active,
            });
        } else {
            setIsEdit(false);
            setEditId(null);
            reset();
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/seller/coupons/${editId}/update`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post('/seller/coupons/store', {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
            router.delete(`/seller/coupons/${id}/destroy`);
        }
    };

    const handleToggleStatus = (id) => {
        router.patch(`/seller/coupons/${id}/toggle-status`, {}, {
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Quản lý mã giảm giá" />

            <style>{`
                .ios-toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
                .ios-toggle input { opacity: 0; width: 0; height: 0; }
                .ios-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
                .ios-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
                .ios-toggle input:checked + .ios-slider { background-color: #4CAF50; }
                .ios-toggle input:checked + .ios-slider:before { transform: translateX(20px); }

                /* ĐÃ XOÁ lớp .modern-modal cũ vì Modal mới đã lo phần khung, bo góc và bóng đổ */
                .modern-modal-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #f9fafb; }
                .modern-modal-header h3 { margin: 0; font-size: 18px; color: #111827; font-weight: 600; }
                .modern-modal-close { cursor: pointer; font-size: 20px; color: #6b7280; background: none; border: none; }
                .modern-modal-close:hover { color: #111827; }
                .modern-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                .modern-modal-footer { padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px; background: #f9fafb; }

                .form-group label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px; }
                .form-control { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                .form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .form-row { display: flex; gap: 16px; }
                .form-row > div { flex: 1; }
                .error-text { color: #ef4444; font-size: 12px; margin-top: 4px; }

                .btn-cancel { padding: 8px 16px; background: #fff; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; color: #374151; }
                .btn-cancel:hover { background: #f3f4f6; }
                .btn-save { padding: 8px 16px; background: var(--primary, #3b82f6); border: none; border-radius: 6px; cursor: pointer; font-weight: 500; color: #fff; }
                .btn-save:hover { opacity: 0.9; }
                .btn-action { background: none; border: none; cursor: pointer; font-size: 14px; }
            `}</style>

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Mã giảm giá chiến dịch</div>
                        <div className="page-sub">Tự tạo coupon ưu đãi để thúc đẩy doanh thu</div>
                    </div>
                    <button className="btn-primary" onClick={() => openModal()}>
                        <i className="fa-solid fa-plus"></i> Phát hành mã mới
                    </button>
                </div>

                <div className="table-card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã Code</th>
                                    <th>Mức giảm</th>
                                    <th>Lượt đã dùng / Tối đa</th>
                                    <th>Thời gian áp dụng</th>
                                    <th>Kích hoạt</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons?.data?.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td style={{ color: 'var(--fire, #ff4500)', fontWeight: '700' }}>{coupon.code}</td>
                                        <td>{coupon.type === 'percent' ? `${coupon.value}%` : `${new Intl.NumberFormat('vi-VN').format(coupon.value)} đ`}</td>
                                        <td>{coupon.used_count} / {coupon.max_uses || '∞'}</td>
                                        <td style={{ fontSize: '13px', color: '#4b5563' }}>
                                            Từ: {coupon.starts_at ? new Date(coupon.starts_at).toLocaleString('vi-VN') : 'Không giới hạn'} <br/>
                                            Đến: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleString('vi-VN') : 'Không giới hạn'}
                                        </td>
                                        <td>
                                            <label className="ios-toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={coupon.is_active}
                                                    onChange={() => handleToggleStatus(coupon.id)}
                                                />
                                                <span className="ios-slider"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <button className="btn-action" onClick={() => openModal(coupon)} style={{ color: '#3b82f6', marginRight: '12px' }}>
                                                <i className="fa-solid fa-pen-to-square"></i> Sửa
                                            </button>
                                            <button className="btn-action" onClick={() => handleDelete(coupon.id)} style={{ color: '#ef4444' }}>
                                                <i className="fa-solid fa-trash"></i> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!coupons || !coupons.data || coupons.data.length === 0) && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                            Chưa có mã giảm giá nào được tạo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {coupons && <Pagination links={coupons.links} />}
                </div>
            </div>

            {/* 2. THAY THẾ TOÀN BỘ ĐOẠN MODAL CŨ BẰNG COMPONENT MODAL MỚI */}
            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="xl">
                <div className="modern-modal-header">
                    <h3>{isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</h3>
                    <button type="button" className="modern-modal-close" onClick={() => setShowModal(false)}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modern-modal-body">
                        <div className="form-group">
                            <label>Mã Code (Nhập chữ in hoa, vd: SUMMER20)</label>
                            <input type="text" className="form-control" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())} required placeholder="VD: TET2026" />
                            {errors.code && <div className="error-text">{errors.code}</div>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Loại giảm giá</label>
                                <select className="form-control" value={data.type} onChange={e => setData('type', e.target.value)}>
                                    <option value="percent">Giảm theo phần trăm (%)</option>
                                    <option value="fixed">Giảm số tiền trực tiếp</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Giá trị giảm {data.type === 'percent' ? '(%)' : '(VNĐ)'}</label>
                                <input type="number" className="form-control" value={data.value} onChange={e => setData('value', e.target.value)} required min="0" placeholder="VD: 20" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Số lượt sử dụng tối đa</label>
                            <input type="number" className="form-control" value={data.max_uses} onChange={e => setData('max_uses', e.target.value)} min="1" placeholder="Bỏ trống nếu không giới hạn" />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bắt đầu từ</label>
                                <input type="datetime-local" className="form-control" value={data.starts_at} onChange={e => setData('starts_at', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Kết thúc lúc</label>
                                <input type="datetime-local" className="form-control" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} />
                                {errors.expires_at && <div className="error-text">{errors.expires_at}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="modern-modal-footer">
                        <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                        <button type="submit" className="btn-save">
                            {isEdit ? 'Lưu thay đổi' : 'Tạo mã ngay'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Coupons.layout = page => <SellerLayout children={page} />
