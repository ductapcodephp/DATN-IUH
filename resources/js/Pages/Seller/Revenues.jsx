import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";
import NumberTicker from '@/Components/MagicUI/NumberTicker';
import MagicCard from '@/Components/MagicUI/MagicCard';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';
import Swal from 'sweetalert2';

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
            Swal.fire({
                title: 'Chưa có tài khoản ngân hàng',
                text: 'Vui lòng thêm tài khoản ngân hàng trước khi thực hiện rút tiền.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ea580c',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Thêm tài khoản',
                cancelButtonText: 'Để sau'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.visit(route('finance.bank-accounts.index'));
                }
            });
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
                Swal.fire({
                    title: 'Gửi yêu cầu thành công!',
                    text: 'Yêu cầu rút tiền của bạn đã được tiếp nhận và sẽ được Admin duyệt trong 24h.',
                    icon: 'success',
                    confirmButtonColor: '#ea580c',
                });
            }
        });
    };

    return (
        <>
            <Head title="Doanh thu & Rút tiền - Kênh Giảng Viên" />

            <div className="page">
                <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                        <div className="page-title">Ví tiền & Quản lý rút tiền</div>
                        <div className="page-sub text-muted">Số dư khả dụng hiện tại có thể rút về tài khoản ngân hàng liên kết</div>
                    </div>
                    <ShimmerButton 
                        onClick={openModal} 
                        className="fw-bold px-4 py-2 text-white border-0 text-decoration-none shadow-sm"
                    >
                        <i className="fa-solid fa-money-bill-transfer me-2"></i> Gửi yêu cầu rút tiền
                    </ShimmerButton>
                </div>

                {/* Khối thẻ thống kê số dư */}
                <div className="stats-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                    <MagicCard className="stat-card p-4" gradientColor="rgba(234, 88, 12, 0.12)" style={{ borderLeft: '4px solid var(--fire, #EA580C)' }}>
                        <div className="stat-card-val text-dark" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--fire, #EA580C)' }}>
                            <NumberTicker value={wallet.balance_available || 0} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>đ</span>
                        </div>
                        <div className="stat-card-label text-muted mt-2">Số dư khả dụng có thể rút</div>
                    </MagicCard>

                    <MagicCard className="stat-card p-4" gradientColor="rgba(217, 119, 6, 0.12)" style={{ borderLeft: '4px solid #d97706' }}>
                        <div className="stat-card-val" style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                            <NumberTicker value={wallet.balance_pending || 0} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>đ</span>
                        </div>
                        <div className="stat-card-label text-muted mt-2">Đang chờ xử lý / Giam (3 ngày)</div>
                    </MagicCard>

                    <MagicCard className="stat-card p-4" gradientColor="rgba(22, 163, 74, 0.12)" style={{ borderLeft: '4px solid #16a34a' }}>
                        <div className="stat-card-val" style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                            <NumberTicker value={totalWithdrawn || 0} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>đ</span>
                        </div>
                        <div className="stat-card-label text-muted mt-2">Tổng số tiền đã rút thành công</div>
                    </MagicCard>
                </div>


                {/* Bảng lịch sử */}
                <div className="table-card mt-4" style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div className="table-toolbar p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                        <span style={{ fontWeight: '700' }}>Lịch sử giao dịch & Biến động số dư</span>
                        <span className="badge bg-light text-secondary border px-3 py-2">
                            <i className="fa-solid fa-receipt me-1"></i> {transactions.total || 0} giao dịch
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{ verticalAlign: 'middle' }}>
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 px-4 py-3">Mã GD</th>
                                    <th className="border-0 px-4 py-3">Loại & Nội dung</th>
                                    <th className="border-0 px-4 py-3 text-end">Người mua trả</th>
                                    <th className="border-0 px-4 py-3 text-end">Hoa hồng sàn</th>
                                    <th className="border-0 px-4 py-3 text-end">Thực nhận / Rút</th>
                                    <th className="border-0 px-4 py-3">Thời gian</th>
                                    <th className="border-0 px-4 py-3 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data && transactions.data.length > 0 ? (
                                    transactions.data.map((tx) => {
                                        const isEarning = tx.type === 'earning';
                                        const isWithdrawal = tx.type === 'withdrawal';
                                        const buyerPaid = tx.buyer_paid_amount ?? tx.amount;
                                        const commRate = tx.commission_rate != null ? Number(tx.commission_rate) : null;
                                        const commAmount = tx.commission_amount != null ? Number(tx.commission_amount) : 0;
                                        const sellerAmount = tx.seller_amount ?? tx.amount;

                                        return (
                                            <tr key={`${tx.source}-${tx.id}`}>
                                                <td className="px-4 py-3 text-fire fw-semibold" style={{ whiteSpace: 'nowrap' }}>
                                                    #{tx.source === 'online' ? 'PAY-' : 'WL-'}{tx.id}
                                                    {tx.order_id && (
                                                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                                            Đơn #{tx.order_id}
                                                        </small>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3" style={{ minWidth: '220px' }}>
                                                    <div>
                                                        <span className={`badge ${tx.source === 'online' ? 'bg-primary' : (isEarning ? 'bg-success' : 'bg-secondary')} rounded-pill px-2 py-1`}>
                                                            {tx.source === 'online' ? 'Thanh toán' : (isEarning ? 'Doanh thu bán khóa học' : 'Rút tiền')}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Tên khóa học hoặc mô tả */}
                                                    <div className="fw-semibold text-dark mt-1" style={{ fontSize: '0.9rem' }}>
                                                        {tx.course_title || tx.description}
                                                    </div>

                                                    {/* Tên người mua */}
                                                    {tx.buyer_name && (
                                                        <small className="text-muted d-block mt-1">
                                                            <i className="fa-solid fa-user-graduate me-1 text-primary"></i>
                                                            Người mua: <strong>{tx.buyer_name}</strong>
                                                        </small>
                                                    )}

                                                    {tx.metadata?.admin_note && (
                                                        <small className={`d-block mt-1 p-1 bg-light ${tx.status === 'failed' ? 'text-danger' : 'text-success'} rounded`} style={{ fontSize: '0.8rem', borderLeft: `3px solid ${tx.status === 'failed' ? '#dc3545' : '#198754'}` }}>
                                                            <i className="fa-solid fa-note-sticky me-1"></i>
                                                            <strong>{tx.status === 'failed' ? 'Lý do từ chối:' : 'Ghi chú duyệt:'}</strong> {tx.metadata.admin_note}
                                                        </small>
                                                    )}
                                                </td>

                                                {/* Cột 1: Số tiền người mua trả */}
                                                <td className="px-4 py-3 text-end" style={{ whiteSpace: 'nowrap' }}>
                                                    {isEarning ? (
                                                        <div>
                                                            <span className="fw-bold text-dark">{formatCurrency(buyerPaid)}</span>
                                                            {tx.discount_amount > 0 && (
                                                                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                                                    (Đã giảm {formatCurrency(tx.discount_amount)})
                                                                </small>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </td>

                                                {/* Cột 2: Hoa hồng sàn bị trừ + % */}
                                                <td className="px-4 py-3 text-end" style={{ whiteSpace: 'nowrap' }}>
                                                    {isEarning ? (
                                                        <div>
                                                            <span className="text-danger fw-semibold">
                                                                -{formatCurrency(commAmount)}
                                                            </span>
                                                            {commRate !== null && (
                                                                <span className="badge bg-light text-danger border ms-1" style={{ fontSize: '0.75rem' }}>
                                                                    {commRate}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">0%</span>
                                                    )}
                                                </td>

                                                {/* Cột 3: Thực nhận / Rút */}
                                                <td className="px-4 py-3 text-end" style={{ whiteSpace: 'nowrap' }}>
                                                    {isEarning ? (
                                                        <strong className="text-success" style={{ fontSize: '1rem' }}>
                                                            +{formatCurrency(sellerAmount)}
                                                        </strong>
                                                    ) : (
                                                        <strong className={['deposit', 'refund'].includes(tx.type) ? 'text-success' : 'text-danger'} style={{ fontSize: '1rem' }}>
                                                            {['deposit', 'refund'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                                                        </strong>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-muted" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                                    {formatDate(tx.created_at)}
                                                </td>

                                                <td className="px-4 py-3 text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {tx.status === 'completed' && <span className="badge bg-success rounded-pill px-3 py-1"><i className="fa-solid fa-check me-1"></i>Thành công</span>}
                                                    {tx.status === 'pending' && <span className="badge bg-warning text-dark rounded-pill px-3 py-1"><i className="fa-solid fa-clock me-1"></i>Chờ giam (3 ngày)</span>}
                                                    {tx.status === 'failed' && <span className="badge bg-danger rounded-pill px-3 py-1"><i className="fa-solid fa-xmark me-1"></i>Thất bại</span>}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">Chưa có giao dịch nào.</td>
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
