import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';

const BANKS = [
    'Vietcombank', 'Techcombank', 'BIDV', 'Agribank', 'VietinBank',
    'MB Bank', 'ACB', 'VPBank', 'TPBank', 'Sacombank', 'HDBank',
    'SeABank', 'SHB', 'OCB', 'Nam A Bank', 'Eximbank', 'MSB', 'LienVietPostBank',
];

function BankAccountCard({ account, onEdit, onDelete, onSetDefault }) {
    return (
        <div
            className={`p-4 db-bank-card ${account.is_default ? 'is-default' : ''}`}
        >
            {/* BG decoration */}
            {account.is_default && (
                <>
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }}></div>
                </>
            )}

            <div style={{ position: 'relative' }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            opacity: account.is_default ? 0.8 : 1,
                            color: account.is_default ? '#fff' : '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>
                            <i className="fa-solid fa-building-columns me-1"></i>
                            {account.bank_name}
                        </div>
                    </div>
                    {account.is_default && (
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '3px 10px', borderRadius: '20px',
                            fontSize: '0.7rem', fontWeight: 700,
                        }}>
                            <i className="fa-solid fa-star me-1"></i>Mặc định
                        </span>
                    )}
                </div>

                {/* Account Number */}
                <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '4px' }}>
                    {account.account_number}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, opacity: account.is_default ? 0.9 : 1 }}>{account.account_name}</div>
                {account.branch && (
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '2px' }}>
                        <i className="fa-solid fa-location-dot me-1"></i>{account.branch}
                    </div>
                )}

                {/* Actions */}
                <div className="d-flex gap-2 mt-3">
                    {!account.is_default && (
                        <button
                            onClick={() => onSetDefault(account.id)}
                            className="btn btn-sm fw-semibold"
                            style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid #e2e8f0', color: '#EA580C', fontSize: '0.75rem' }}
                        >
                            <i className="fa-solid fa-star me-1"></i>Đặt mặc định
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(account)}
                        className="btn btn-sm fw-semibold"
                        style={{
                            borderRadius: '8px', fontSize: '0.75rem',
                            background: account.is_default ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                            border: 'none',
                            color: account.is_default ? '#fff' : '#475569',
                        }}
                    >
                        <i className="fa-solid fa-pen me-1"></i>Sửa
                    </button>
                    <button
                        onClick={() => onDelete(account.id)}
                        className="btn btn-sm fw-semibold"
                        style={{
                            borderRadius: '8px', fontSize: '0.75rem',
                            background: account.is_default ? 'rgba(255,255,255,0.2)' : '#fee2e2',
                            border: 'none',
                            color: account.is_default ? '#fff' : '#dc2626',
                        }}
                    >
                        <i className="fa-solid fa-trash me-1"></i>Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

function BankAccountModal({ isOpen, onClose, editingAccount, onSubmit }) {
    const { data, setData, processing, reset, errors } = useForm({
        bank_name: editingAccount?.bank_name ?? '',
        account_name: editingAccount?.account_name ?? '',
        account_number: editingAccount?.account_number ?? '',
        branch: editingAccount?.branch ?? '',
        is_default: editingAccount?.is_default ?? false,
    });

    React.useEffect(() => {
        if (editingAccount) {
            setData({
                bank_name: editingAccount.bank_name ?? '',
                account_name: editingAccount.account_name ?? '',
                account_number: editingAccount.account_number ?? '',
                branch: editingAccount.branch ?? '',
                is_default: editingAccount.is_default ?? false,
            });
        } else {
            reset();
        }
    }, [editingAccount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data, editingAccount?.id);
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <div className="d-flex justify-content-between align-items-center p-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                        <i className="fa-solid fa-building-columns me-2" style={{ color: '#EA580C' }}></i>
                        {editingAccount ? 'Cập nhật tài khoản' : 'Thêm tài khoản ngân hàng'}
                    </h5>
                    <button onClick={onClose} className="btn btn-sm" style={{ borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#6B7280' }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>Ngân hàng <span style={{ color: '#dc2626' }}>*</span></label>
                        <select className="form-select" value={data.bank_name} onChange={(e) => setData('bank_name', e.target.value)} style={{ borderRadius: '10px' }} required>
                            <option value="">-- Chọn ngân hàng --</option>
                            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {errors.bank_name && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.bank_name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>Tên chủ tài khoản <span style={{ color: '#dc2626' }}>*</span></label>
                        <input type="text" className="form-control" value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} placeholder="NGUYEN VAN A" style={{ borderRadius: '10px' }} required />
                        {errors.account_name && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.account_name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>Số tài khoản <span style={{ color: '#dc2626' }}>*</span></label>
                        <input type="text" className="form-control" value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} placeholder="0123456789" style={{ borderRadius: '10px' }} required />
                        {errors.account_number && <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.account_number}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#374151' }}>Chi nhánh (tùy chọn)</label>
                        <input type="text" className="form-control" value={data.branch} onChange={(e) => setData('branch', e.target.value)} placeholder="Chi nhánh HCM" style={{ borderRadius: '10px' }} />
                    </div>
                    <div className="form-check mb-4">
                        <input className="form-check-input" type="checkbox" checked={data.is_default} onChange={(e) => setData('is_default', e.target.checked)} id="isDefault" />
                        <label className="form-check-label fw-medium" htmlFor="isDefault" style={{ fontSize: '0.875rem', color: '#374151' }}>
                            Đặt làm tài khoản mặc định
                        </label>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" onClick={onClose} className="btn btn-outline-secondary flex-grow-1 fw-semibold" style={{ borderRadius: '10px' }}>Hủy</button>
                        <button type="submit" className="btn flex-grow-1 fw-semibold text-white" disabled={processing} style={{ background: 'linear-gradient(135deg,#EA580C,#C2410C)', borderRadius: '10px', border: 'none' }}>
                            {processing ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Đang lưu...</> : <><i className="fa-solid fa-floppy-disk me-2"></i>{editingAccount ? 'Cập nhật' : 'Thêm tài khoản'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function BankAccounts({ bankAccounts, wallet }) {
    const [modalOpen, setModalOpen]       = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const openAdd  = () => { setEditingAccount(null); setModalOpen(true); };
    const openEdit = (acc) => { setEditingAccount(acc); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditingAccount(null); };

    const handleSubmit = (data, id) => {
        if (id) {
            router.put(route('finance.bank-accounts.update', id), data, {
                onSuccess: closeModal,
            });
        } else {
            router.post(route('finance.bank-accounts.store'), data, {
                onSuccess: closeModal,
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?')) {
            router.delete(route('finance.bank-accounts.destroy', id));
        }
    };

    const handleSetDefault = (id) => {
        router.patch(route('finance.bank-accounts.set-default', id));
    };

    return (
        <SellerLayout>
            <Head title="Quản lý thẻ ngân hàng" />

            <div className="page">
            {wallet?.status !== 'active' ? (
                <div className="text-center py-5 px-3" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '100px', height: '100px' }}>
                        <i className="fa-solid fa-wallet fs-1 text-primary"></i>
                    </div>
                    <h3 className="fw-bold mb-2">Mở Ví EduFlow Ngay</h3>
                    <p className="text-muted mb-4 fs-6">Thanh toán siêu tốc - Nhận siêu ưu đãi</p>
                    
                    <div className="mx-auto text-start p-4 bg-light rounded-3 mb-4 border border-primary border-opacity-25" style={{ maxWidth: '500px' }}>
                        <h6 className="fw-bold text-primary mb-3"><i className="fa-solid fa-gift me-2"></i>Thưởng thêm khi nạp tiền:</h6>
                        <ul className="mb-0 text-dark fs-6" style={{ lineHeight: '1.8' }}>
                            {usePage().props.wallet_bonuses?.map(bonus => (
                                <li key={bonus.id}>
                                    Tặng ngay <span className="fw-bold text-danger">{Number(bonus.bonus_percentage)}%</span> {bonus.max_bonus_amount ? `(tối đa ${new Intl.NumberFormat('vi-VN').format(bonus.max_bonus_amount)}đ)` : ''} khi nạp từ {new Intl.NumberFormat('vi-VN').format(bonus.min_amount)}đ
                                </li>
                            ))}
                            {(!usePage().props.wallet_bonuses || usePage().props.wallet_bonuses.length === 0) && (
                                <li>Đang cập nhật chương trình khuyến mãi...</li>
                            )}
                        </ul>
                        <hr className="my-3 opacity-25" />
                        <ul className="list-unstyled mb-0 fs-6 text-muted">
                            <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Thanh toán khóa học chỉ với 1 chạm</li>
                            <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i>Không cần nhập lại thẻ hay mã OTP</li>
                            <li className="mb-0"><i className="fa-solid fa-check text-success me-2"></i>Lưu trữ lịch sử giao dịch minh bạch</li>
                        </ul>
                    </div>

                    <button 
                        onClick={() => router.post(route('finance.wallet.activate'))} 
                        className="btn btn-primary px-5 py-3 fw-bold fs-5 shadow-sm" 
                        style={{ borderRadius: '12px' }}
                    >
                        Đồng Ý Mở Ví Ngay
                    </button>
                </div>
            ) : (
                <>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                        <i className="fa-solid fa-building-columns me-2" style={{ color: '#059669' }}></i>
                        Tài khoản ngân hàng
                    </h4>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                        Quản lý tài khoản ngân hàng để rút tiền từ ví
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="btn fw-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#EA580C,#C2410C)', borderRadius: '10px', border: 'none', fontSize: '0.875rem' }}
                >
                    <i className="fa-solid fa-plus me-2"></i>Thêm tài khoản
                </button>
            </div>

            {/* Notice */}
            <div className="mb-4 p-3 d-flex align-items-start gap-3" style={{ background: '#e0f2fe', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <i className="fa-solid fa-circle-info" style={{ color: '#0284C7', fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}></i>
                <div style={{ fontSize: '0.85rem', color: '#0c4a6e' }}>
                    <strong>Lưu ý:</strong> Tài khoản ngân hàng mặc định sẽ được sử dụng khi bạn yêu cầu rút tiền từ ví EduFlow. Hãy đảm bảo thông tin chính xác để tránh sai sót khi nhận tiền.
                </div>
            </div>

            {/* Bank Accounts Grid */}
            {bankAccounts?.length === 0 ? (
                <div className="text-center py-5">
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <i className="fa-solid fa-building-columns" style={{ fontSize: '2rem', color: '#059669' }}></i>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: '#1F2937' }}>Chưa có tài khoản ngân hàng</h6>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Thêm tài khoản ngân hàng để nhận tiền từ ví EduFlow</p>
                    <button onClick={openAdd} className="btn btn-sm fw-semibold text-white" style={{ background: '#EA580C', borderRadius: '8px', border: 'none' }}>
                        <i className="fa-solid fa-plus me-2"></i>Thêm tài khoản đầu tiên
                    </button>
                </div>
            ) : (
                <div className="row g-3">
                    {bankAccounts.map((account) => (
                        <div key={account.id} className="col-md-6 col-lg-4">
                            <BankAccountCard
                                account={account}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Sửa Ngân Hàng */}
            <BankAccountModal
                isOpen={modalOpen}
                onClose={closeModal}
                editingAccount={editingAccount}
                onSubmit={handleSubmit}
            />
                </>
            )}
            </div>
        </SellerLayout>
    );
}
