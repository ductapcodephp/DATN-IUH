import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";

export default function Revenues({ wallet, totalWithdrawn, transactions, bankAccounts }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const [modalOpen, setModalOpen] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        bank_account_id: bankAccounts?.length > 0 ? (bankAccounts.find(b => b.is_default)?.id || bankAccounts[0].id) : ''
    });

    const openModal = () => {
        if (!bankAccounts || bankAccounts.length === 0) {
            alert('Vui lòng thêm tài khoản ngân hàng trước khi rút tiền.');
            router.visit(route('seller.bank-accounts.index'));
            return;
        }
        setModalOpen(true);
    };

    const submitWithdraw = (e) => {
        e.preventDefault();
        post(route('seller.revenues.withdraw'), {
            onSuccess: () => {
                setModalOpen(false);
                reset();
            }
        });
    };

    return (
        <>
            <Head title="Doanh thu & Rút tiền" />

            <div className="page">
                <div className="page-header d-flex justify-content-between align-items-center">
                    <div>
                        <div className="page-title">Ví tiền & Quản lý rút tiền</div>
                        <div className="page-sub text-muted">Số dư khả dụng hiện tại có thể rút về tài khoản ngân hàng liên kết</div>
                    </div>
                    <button onClick={openModal} className="btn btn-fire d-flex align-items-center gap-2">
                        <i className="fa-solid fa-money-bill-transfer"></i> Gửi yêu cầu rút tiền
                    </button>
                </div>

                {/* Khối thẻ thống kê số dư */}
                <div className="stats-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div className="stat-card" style={{ borderLeft: '4px solid var(--fire)', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div className="stat-card-val text-fire" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {formatCurrency(wallet.balance_available)}
                        </div>
                        <div className="stat-card-label text-muted mt-2">Số dư khả dụng có thể rút</div>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div className="stat-card-val" style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                            {formatCurrency(wallet.balance_pending)}
                        </div>
                        <div className="stat-card-label text-muted mt-2">Đang chờ xử lý / Giam (3 ngày)</div>
                    </div>
                    <div className="stat-card" style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div className="stat-card-val" style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                            {formatCurrency(totalWithdrawn)}
                        </div>
                        <div className="stat-card-label text-muted mt-2">Tổng số tiền đã rút thành công</div>
                    </div>
                </div>

                {/* Bảng lịch sử */}
                <div className="table-card mt-4" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div className="table-toolbar p-3 border-bottom bg-light">
                        <span style={{ fontWeight: '700' }}>Lịch sử giao dịch & Rút tiền</span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{ verticalAlign: 'middle' }}>
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 px-4 py-3">Mã lệnh</th>
                                    <th className="border-0 px-4 py-3">Loại</th>
                                    <th className="border-0 px-4 py-3">Số tiền</th>
                                    <th className="border-0 px-4 py-3">Ngày gửi</th>
                                    <th className="border-0 px-4 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data && transactions.data.length > 0 ? (
                                    transactions.data.map((tx, index) => (
                                        <tr key={`${tx.source}-${tx.id}`}>
                                            <td className="px-4 py-3 text-fire fw-semibold">
                                                #{tx.source === 'online' ? 'PAY-' : 'WL-'}{tx.id}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <span className={`badge ${tx.source === 'online' ? 'bg-primary' : (tx.type === 'earning' ? 'bg-success' : 'bg-secondary')}`}>
                                                        {tx.source === 'online' ? 'Thanh toán' : (tx.type === 'earning' ? 'Doanh thu' : 'Rút tiền')}
                                                    </span>
                                                </div>
                                                <small className="text-muted d-block mt-1">{tx.description}</small>
                                            </td>
                                            <td className="px-4 py-3">
                                                <strong className={tx.source === 'online' || tx.type === 'earning' ? 'text-success' : 'text-danger'}>
                                                    {tx.source === 'online' || tx.type === 'earning' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </strong>
                                            </td>
                                            <td className="px-4 py-3">{formatDate(tx.created_at)}</td>
                                            <td className="px-4 py-3">
                                                {tx.status === 'completed' && <span className="badge bg-success">Thành công</span>}
                                                {tx.status === 'pending' && <span className="badge bg-warning text-dark">Đang xử lý</span>}
                                                {tx.status === 'failed' && <span className="badge bg-danger">Thất bại</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">Chưa có giao dịch nào.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {transactions.total > 0 && (
                        <div className="p-3 border-top">
                            <Pagination 
                                links={transactions.links} 
                                from={transactions.from} 
                                to={transactions.to} 
                                total={transactions.total} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal rút tiền */}
            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                            <h5 className="fw-bold mb-0">Yêu cầu rút tiền</h5>
                            <button onClick={() => setModalOpen(false)} className="btn btn-sm text-muted">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={submitWithdraw} className="p-4">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Số dư khả dụng</label>
                                <div className="form-control" style={{ background: '#f8fafc', color: '#16a34a', fontWeight: 'bold' }}>
                                    {formatCurrency(wallet.balance_available)}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Số tiền muốn rút (VNĐ)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    placeholder="Nhập số tiền..."
                                    min="50000"
                                    max={wallet.balance_available}
                                    required
                                />
                                {errors.amount && <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>{errors.amount}</div>}
                                <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>Tối thiểu 50,000đ. Phí rút tiền: 0đ</div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Tài khoản nhận tiền</label>
                                <select 
                                    className="form-select"
                                    value={data.bank_account_id}
                                    onChange={e => setData('bank_account_id', e.target.value)}
                                    required
                                >
                                    {bankAccounts?.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.bank_name} - {bank.account_number} ({bank.account_name}) {bank.is_default ? ' [Mặc định]' : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.bank_account_id && <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>{errors.bank_account_id}</div>}
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline-secondary w-50 fw-semibold">Hủy</button>
                                <button type="submit" disabled={processing} className="btn btn-fire w-50 fw-semibold">
                                    {processing ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Revenues.layout = page => <SellerLayout children={page} />
