import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';

export default function Withdrawals({ withdrawals = [] }) {
    const [actionModal, setActionModal] = useState({ open: false, type: '', id: null });

    const { data, setData, post, processing, errors, reset } = useForm({
        admin_note: ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const openModal = (type, id) => {
        setActionModal({ open: true, type, id });
        reset();
    };

    const submitAction = (e) => {
        e.preventDefault();
        const routeName = actionModal.type === 'approve' ? 'admin.withdrawals.approve' : 'admin.withdrawals.reject';
        post(route(routeName, actionModal.id), {
            onSuccess: () => {
                setActionModal({ open: false, type: '', id: null });
                reset();
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Yêu cầu rút tiền" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Yêu cầu rút tiền</h3>
                        <p className="text-muted mb-0">Duyệt và xử lý các khoản rút tiền từ giảng viên</p>
                    </div>
                </div>
                
                <div className="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 rounded-start-3 px-4 py-3">Mã GD</th>
                                    <th className="border-0 py-3">Giảng viên</th>
                                    <th className="border-0 py-3">Ngân hàng</th>
                                    <th className="border-0 py-3">Số tiền</th>
                                    <th className="border-0 py-3">Trạng thái</th>
                                    <th className="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {withdrawals.map(withdrawal => (
                                    <tr key={withdrawal.id}>
                                        <td className="px-4 py-3 fw-bold">#{withdrawal.id}</td>
                                        <td className="py-3 text-dark">{withdrawal.user?.name}</td>
                                        <td className="py-3 text-dark">
                                            <div className="fw-semibold">{withdrawal.bank_name}</div>
                                            <small className="text-muted">{withdrawal.account_number} - {withdrawal.account_name}</small>
                                        </td>
                                        <td className="py-3 fw-bold text-danger">{formatCurrency(withdrawal.amount)}</td>
                                        <td className="py-3">
                                            {withdrawal.status === 'pending' && <span className="badge bg-warning rounded-pill px-3 py-2">Chờ duyệt</span>}
                                            {withdrawal.status === 'approved' && <span className="badge bg-success rounded-pill px-3 py-2">Đã duyệt</span>}
                                            {withdrawal.status === 'rejected' && <span className="badge bg-danger rounded-pill px-3 py-2">Từ chối</span>}
                                            {withdrawal.admin_note && <div className="mt-1 small text-muted"><i className="fa-solid fa-note-sticky"></i> {withdrawal.admin_note}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            {withdrawal.status === 'pending' && (
                                                <>
                                                    <button onClick={() => openModal('approve', withdrawal.id)} className="btn btn-sm rounded-pill px-3 btn-outline-success me-2">Duyệt</button>
                                                    <button onClick={() => openModal('reject', withdrawal.id)} className="btn btn-sm rounded-pill px-3 btn-outline-danger">Từ chối</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {withdrawals.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">Chưa có yêu cầu rút tiền nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {actionModal.open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                            <h5 className="fw-bold mb-0 text-dark">
                                {actionModal.type === 'approve' ? 'Xác nhận duyệt yêu cầu' : 'Từ chối yêu cầu rút tiền'}
                            </h5>
                            <button onClick={() => setActionModal({ open: false, type: '', id: null })} className="btn btn-sm text-muted">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={submitAction} className="p-4">
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    {actionModal.type === 'approve' ? 'Ghi chú duyệt (mã GD ngân hàng, lời nhắn...)' : 'Lý do từ chối (bắt buộc)'}
                                </label>
                                <textarea 
                                    className="form-control" 
                                    rows="3"
                                    value={data.admin_note}
                                    onChange={e => setData('admin_note', e.target.value)}
                                    placeholder={actionModal.type === 'approve' ? 'Nhập ghi chú duyệt...' : 'Nhập lý do từ chối để giảng viên biết...'}
                                    required={actionModal.type === 'reject'}
                                ></textarea>
                                {errors.admin_note && <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>{errors.admin_note}</div>}
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" onClick={() => setActionModal({ open: false, type: '', id: null })} className="btn btn-outline-secondary w-50 fw-semibold">Hủy</button>
                                <button type="submit" disabled={processing} className={`btn w-50 fw-semibold ${actionModal.type === 'approve' ? 'btn-success' : 'btn-danger'}`}>
                                    {processing ? 'Đang xử lý...' : (actionModal.type === 'approve' ? 'Duyệt & Lưu' : 'Từ chối & Hoàn tiền')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
