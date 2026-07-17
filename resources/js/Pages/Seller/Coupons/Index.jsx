import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";
import FormModal from "@/Components/FormModal.jsx";

export default function Coupons({ coupons, courses }) {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, reset, errors, clearErrors, processing } = useForm({
        code: '',
        type: 'percent',
        value: '',
        max_uses: '',
        starts_at: '',
        expires_at: '',
        course_id: '',
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
                course_id: coupon.course_id || '',
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

                .btn-action { 
                    background: none; 
                    border: none; 
                    cursor: pointer; 
                    font-size: 14px; 
                    font-family: inherit;
                    text-decoration: none; 
                    display: inline-block; 
                }
            `}</style>

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Mã giảm giá chiến dịch</div>
                        <div className="page-sub">Tự tạo coupon ưu đãi để thúc đẩy doanh thu</div>
                    </div>
                    <button className="btn-primary" onClick={() => openModal()} style={{ textDecoration: 'none' }}>
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
                                    <th>Áp dụng cho</th>
                                    <th>Thời gian áp dụng</th>
                                    <th>Kích hoạt</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons?.data?.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td style={{ color: 'var(--fire, #ff4500)', fontWeight: '700' }}>{coupon.code}</td>
                                        <td>{coupon.value_formatted}</td>
                                        <td>{coupon.used_count} / {coupon.max_uses || '∞'}</td>
                                        <td style={{ fontSize: '13px', color: '#4b5563' }}>
                                            {coupon.course_id 
                                                ? <span className="text-primary fw-bold">{courses?.find(c => c.id === coupon.course_id)?.title || 'Khóa học cụ thể'}</span>
                                                : <span className="text-success">Áp dụng tất cả khóa học</span>}
                                        </td>
                                        <td style={{ fontSize: '13px', color: '#4b5563' }}>
                                            Từ: {coupon.starts_at_formatted} <br/>
                                            Đến: {coupon.expires_at_formatted}
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
                    {coupons?.meta?.links && <Pagination links={coupons.meta.links} />}
                </div>
            </div>

            <FormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
                subtitle="Điền thông tin bên dưới để thiết lập ưu đãi cho học viên"
                icon={<i className={isEdit ? "fa-solid fa-pen" : "fa-solid fa-plus"}></i>}
                onSubmit={handleSubmit}
                isSubmitting={processing}
                maxWidth="680px"
            >
                <div className="form-modal-group">
                    <label className="form-modal-label">Mã Code (Nhập chữ in hoa, vd: SUMMER20) <span className="required">*</span></label>
                    <input 
                        type="text" 
                        className={`form-modal-input ${errors.code ? 'has-error' : ''}`}
                        value={data.code} 
                        onChange={e => setData('code', e.target.value.toUpperCase())} 
                        required 
                        placeholder="VD: TET2026" 
                    />
                    {errors.code && <div className="form-modal-error"><i className="fa-solid fa-circle-exclamation"></i> {errors.code}</div>}
                </div>

                <div className="form-modal-row">
                    <div className="form-modal-group">
                        <label className="form-modal-label">Loại giảm giá</label>
                        <select className="form-modal-select" value={data.type} onChange={e => setData('type', e.target.value)}>
                            <option value="percent">Giảm theo phần trăm (%)</option>
                            <option value="fixed">Giảm số tiền trực tiếp</option>
                        </select>
                    </div>
                    <div className="form-modal-group">
                        <label className="form-modal-label">Giá trị giảm {data.type === 'percent' ? '(%)' : '(VNĐ)'} <span className="required">*</span></label>
                        <input 
                            type="number" 
                            className={`form-modal-input ${errors.value ? 'has-error' : ''}`}
                            value={data.value} 
                            onChange={e => setData('value', e.target.value)} 
                            required 
                            min="0" 
                            placeholder="VD: 20" 
                        />
                        {errors.value && <div className="form-modal-error"><i className="fa-solid fa-circle-exclamation"></i> {errors.value}</div>}
                    </div>
                </div>

                <div className="form-modal-row">
                    <div className="form-modal-group">
                        <label className="form-modal-label">Số lượt sử dụng tối đa</label>
                        <input 
                            type="number" 
                            className={`form-modal-input ${errors.max_uses ? 'has-error' : ''}`}
                            value={data.max_uses} 
                            onChange={e => setData('max_uses', e.target.value)} 
                            min="1" 
                            placeholder="Bỏ trống nếu không giới hạn" 
                        />
                        {errors.max_uses && <div className="form-modal-error"><i className="fa-solid fa-circle-exclamation"></i> {errors.max_uses}</div>}
                    </div>
                    <div className="form-modal-group">
                        <label className="form-modal-label">Áp dụng cho khóa học</label>
                        <select className={`form-modal-select ${errors.course_id ? 'has-error' : ''}`} value={data.course_id} onChange={e => setData('course_id', e.target.value)}>
                            <option value="">-- Tất cả khóa học --</option>
                            {courses?.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                        {errors.course_id && <div className="form-modal-error"><i className="fa-solid fa-circle-exclamation"></i> {errors.course_id}</div>}
                    </div>
                </div>

                <div className="form-modal-row">
                    <div className="form-modal-group">
                        <label className="form-modal-label">Bắt đầu từ</label>
                        <input 
                            type="datetime-local" 
                            className={`form-modal-input ${errors.starts_at ? 'has-error' : ''}`}
                            value={data.starts_at} 
                            onChange={e => setData('starts_at', e.target.value)} 
                        />
                        {errors.starts_at && <div className="form-modal-error"><i className="fa-solid fa-circle-exclamation"></i> {errors.starts_at}</div>}
                    </div>
                    <div className="form-modal-group">
                        <label className="form-modal-label">Kết thúc lúc</label>
                        <input 
                            type="datetime-local" 
                            className={`form-modal-input ${errors.expires_at ? 'has-error' : ''}`}
                            value={data.expires_at} 
                            onChange={e => setData('expires_at', e.target.value)} 
                        />
                        {errors.expires_at && <div className="form-modal-error"><i className="fa-solid fa-circle-exclamation"></i> {errors.expires_at}</div>}
                    </div>
                </div>
            </FormModal>
        </>
    );
}

Coupons.layout = page => <SellerLayout children={page} />
