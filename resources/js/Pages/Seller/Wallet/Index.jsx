import React, { useState } from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const txTypeConfig = {
    deposit:     { label: 'Nạp tiền',   color: '#16a34a', bg: '#dcfce7', icon: 'fa-solid fa-arrow-down',  sign: '+' },
    purchase:    { label: 'Mua khóa học', color: '#EA580C', bg: '#fff7ed', icon: 'fa-solid fa-arrow-up',  sign: '-' },
    refund:      { label: 'Hoàn tiền',  color: '#0284C7', bg: '#e0f2fe', icon: 'fa-solid fa-rotate-left', sign: '+' },
    commission:  { label: 'Hoa hồng',   color: '#7c3aed', bg: '#ede9fe', icon: 'fa-solid fa-sack-dollar', sign: '+' },
    vip_payment: { label: 'Mua VIP',    color: '#d97706', bg: '#fef3c7', icon: 'fa-solid fa-crown',       sign: '-' },
    withdrawal:  { label: 'Rút tiền',   color: '#dc2626', bg: '#fee2e2', icon: 'fa-solid fa-money-bill-transfer', sign: '-' },
    earning:     { label: 'Doanh thu',  color: '#059669', bg: '#ecfdf5', icon: 'fa-solid fa-hand-holding-dollar', sign: '+' },
    vnpay:       { label: 'VNPAY',      color: '#059669', bg: '#ecfdf5', icon: 'fa-solid fa-money-check-dollar', sign: '+' },
    momo:        { label: 'MoMo',       color: '#be185d', bg: '#fdf2f8', icon: 'fa-solid fa-wallet',             sign: '+' },
    paypal:      { label: 'PayPal',     color: '#0284c7', bg: '#e0f2fe', icon: 'fa-brands fa-paypal',            sign: '+' },
    stripe:      { label: 'Stripe',     color: '#6366f1', bg: '#e0e7ff', icon: 'fa-brands fa-stripe',            sign: '+' },
};

const txStatusConfig = {
    pending:   { label: 'Đang xử lý', color: '#d97706', bg: '#fef3c7' },
    completed: { label: 'Thành công',  color: '#16a34a', bg: '#dcfce7' },
    failed:    { label: 'Thất bại',   color: '#dc2626', bg: '#fee2e2' },
};

export default function Wallet({ wallet, transactions, filters }) {
    const [activeTab, setActiveTab] = useState(filters?.activeTab ?? 'wallet_history');

    const [type, setType]         = useState(filters?.type ?? '');
    const [status, setStatus]     = useState(filters?.status ?? '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? '');
    const [dateTo, setDateTo]     = useState(filters?.date_to ?? '');

    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState(100000);
    const [depositGateway, setDepositGateway] = useState('vnpay');

    const handleDeposit = (e) => {
        e.preventDefault();
        router.post(route('frontend.wallet.deposit'), {
            amount: depositAmount,
            gateway: depositGateway,
            type: 'deposit'
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('finance.wallet.index'), { type, status, date_from: dateFrom, date_to: dateTo, activeTab }, { preserveState: true });
    };

    const handleReset = () => {
        setType(''); setStatus(''); setDateFrom(''); setDateTo('');
        router.get(route('finance.wallet.index'), { activeTab }, { preserveState: true });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setType(''); setStatus(''); setDateFrom(''); setDateTo('');
        router.get(route('finance.wallet.index'), { activeTab: tab }, { preserveState: true, replace: true });
    };

    return (
        <SellerLayout>
            <Head title="Ví Điện Tử" />

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
            {/* Promo Banner */}
            <div className="mb-4 p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(90deg, #fef2f2 0%, #fff1f2 100%)', border: '1px solid #fecdd3' }}>
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        <i className="fa-solid fa-gift fs-5"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold text-danger mb-1">Siêu Ưu Đãi Thưởng Nạp!</h6>
                        <ul className="text-dark mb-0 ps-3" style={{ fontSize: '0.9rem', margin: 0 }}>
                            {usePage().props.wallet_bonuses?.length > 0 ? (
                                usePage().props.wallet_bonuses.map((bonus, index) => (
                                    <li key={bonus.id} style={{ marginBottom: index < usePage().props.wallet_bonuses.length - 1 ? '4px' : '0' }}>
                                        Tặng ngay <span className="fw-bold text-danger">+{Number(bonus.bonus_percentage)}%</span> {bonus.max_bonus_amount ? `(tối đa ${new Intl.NumberFormat('vi-VN').format(bonus.max_bonus_amount)}đ)` : ''} khi nạp từ {new Intl.NumberFormat('vi-VN').format(bonus.min_amount)}đ
                                    </li>
                                ))
                            ) : (
                                <li className="list-unstyled ms-n3">Đang cập nhật chương trình khuyến mãi...</li>
                            )}
                        </ul>
                    </div>
                </div>
                <button 
                    onClick={() => setShowDepositModal(true)}
                    className="btn btn-danger fw-bold px-4 rounded-pill d-none d-md-block"
                >
                    Nạp Tiền Ngay
                </button>
            </div>

            {/* Header */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                        <i className="fa-solid fa-wallet me-2" style={{ color: '#7c3aed' }}></i>
                        Ví điện tử EduFlow
                    </h4>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                        Quản lý số dư và lịch sử giao dịch tài chính
                    </p>
                </div>
                <button 
                    onClick={() => setShowDepositModal(true)}
                    className="btn fw-semibold text-white px-4" 
                    style={{ background: '#7c3aed', borderRadius: '12px', border: 'none' }}
                >
                    <i className="fa-solid fa-plus me-2"></i>Nạp tiền
                </button>
            </div>

            {/* Wallet Card + Stats */}
            <div className="row g-3 mb-4">
                {/* Balance Card */}
                <div className="col-md-3">
                    <div className="p-4 h-100 text-white" style={{ backgroundColor: '#ea580c', backgroundImage: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2)' }}>
                        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>
                                <i className="fa-solid fa-wallet me-2"></i>Số dư hiện tại
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2 }}>
                                {formatCurrency(wallet?.balance)}
                            </div>
                            <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: '8px' }}>
                                Ví EduFlow của bạn
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Deposited */}
                <div className="col-md-3">
                    <div
                        className="p-4 h-100"
                        style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="fa-solid fa-arrow-down" style={{ color: '#16a34a', fontSize: '1.2rem' }}></i>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px' }}>Tổng đã nạp</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>{formatCurrency(wallet?.total_deposited)}</div>
                    </div>
                </div>
                
                {/* Total Spent */}
                <div className="col-md-3">
                    <div
                        className="p-4 h-100"
                        style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="fa-solid fa-arrow-up" style={{ color: '#EA580C', fontSize: '1.2rem' }}></i>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px' }}>Tổng đã chi tiêu</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EA580C' }}>{formatCurrency(wallet?.total_spent)}</div>
                    </div>
                </div>

                {/* Pending Balance */}
                <div className="col-md-3">
                    <div
                        className="p-4 h-100"
                        style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                            <i className="fa-solid fa-hourglass-half" style={{ color: '#d97706', fontSize: '1.2rem' }}></i>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px' }}>Số tiền chờ duyệt</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{formatCurrency(wallet?.balance_pending)}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-3 gap-2" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <li className="nav-item">
                    <button 
                        className={`nav-link fw-semibold px-4 py-2`}
                        onClick={() => handleTabChange('wallet_history')}
                        style={{
                            borderRadius: '12px', 
                            background: activeTab === 'wallet_history' ? '#f5f3ff' : 'transparent',
                            color: activeTab === 'wallet_history' ? '#7c3aed' : '#6B7280',
                            border: activeTab === 'wallet_history' ? '1px solid #ddd6fe' : '1px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="fa-solid fa-clock-rotate-left me-2"></i>Lịch sử ví
                    </button>
                </li>
            </ul>

            {/* Transactions */}
            <div className="overflow-hidden" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {/* Transactions Header + Filter */}
                <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <form onSubmit={handleFilter}>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            <h6 className="fw-bold mb-0 me-3" style={{ color: '#1F2937' }}>
                                Lịch sử Ví
                            </h6>
                            <select className="form-select form-select-sm" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 'auto', borderRadius: '8px', fontSize: '0.8rem' }}>
                                <option value="">Tất cả loại</option>
                                <option value="deposit">Nạp tiền</option>
                                <option value="purchase">Mua khóa học</option>
                                <option value="refund">Hoàn tiền</option>
                                <option value="commission">Hoa hồng</option>
                                <option value="vip_payment">Mua VIP</option>
                                <option value="withdrawal">Rút tiền</option>
                                <option value="earning">Doanh thu</option>
                            </select>
                            <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto', borderRadius: '8px', fontSize: '0.8rem' }}>
                                <option value="">Tất cả trạng thái</option>
                                <option value="completed">Thành công</option>
                                <option value="pending">Đang xử lý</option>
                                <option value="failed">Thất bại</option>
                            </select>
                            <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ width: 'auto', borderRadius: '8px', fontSize: '0.8rem' }} />
                            <input type="date" className="form-control form-control-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ width: 'auto', borderRadius: '8px', fontSize: '0.8rem' }} />
                            <button type="submit" className="btn btn-sm fw-semibold text-white" style={{ background: '#7c3aed', borderRadius: '8px', border: 'none', fontSize: '0.8rem' }}>
                                <i className="fa-solid fa-magnifying-glass me-1"></i>Lọc
                            </button>
                            {(type || status || dateFrom || dateTo) && (
                                <button type="button" onClick={handleReset} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px', fontSize: '0.8rem' }}>
                                    Đặt lại
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Transactions List */}
                {activeTab === 'wallet_history' && (
                    <>
                        {(transactions?.data ?? []).length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '2.5rem', color: '#e2e8f0', marginBottom: '12px', display: 'block' }}></i>
                                <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Chưa có giao dịch nào</p>
                            </div>
                        ) : (
                            <>
                                {(transactions?.data ?? []).map((tx, i) => {
                                    const txInfo    = txTypeConfig[tx.type] ?? txTypeConfig.deposit;
                                    const statusInfo = txStatusConfig[tx.status] ?? txStatusConfig.pending;
                                    const isCredit  = txInfo.sign === '+';

                                    return (
                                        <div
                                            key={`wallet_${tx.id}`}
                                            className="d-flex align-items-center justify-content-between px-4 py-3"
                                            style={{ borderBottom: i < (transactions.data.length - 1) ? '1px solid #f8fafc' : 'none' }}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{
                                                    width: '42px', height: '42px', borderRadius: '12px',
                                                    background: txInfo.bg, display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', flexShrink: 0,
                                                }}>
                                                    <i className={txInfo.icon} style={{ color: txInfo.color }}></i>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.875rem' }}>{txInfo.label}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                        {new Date(tx.created_at).toLocaleString('vi-VN')}
                                                        {tx.reference_code && <span className="ms-2 text-muted">• {tx.reference_code}</span>}
                                                    </div>
                                                    {tx.description && (
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>{tx.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div style={{ fontWeight: 800, fontSize: '1rem', color: isCredit ? '#16a34a' : '#EA580C' }}>
                                                    {txInfo.sign}{formatCurrency(tx.amount)}
                                                </div>
                                                <div style={{
                                                    display: 'inline-block', padding: '2px 8px', borderRadius: '20px',
                                                    background: statusInfo.bg, color: statusInfo.color,
                                                    fontSize: '0.7rem', fontWeight: 600,
                                                }}>
                                                    {statusInfo.label}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {transactions?.last_page > 1 && (
                                    <div className="d-flex justify-content-center gap-2 p-3">
                                        {Array.from({ length: transactions.last_page }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => router.get(route('finance.wallet.index'), { page, type, status, activeTab })}
                                                className="btn btn-sm fw-semibold"
                                                style={{
                                                    borderRadius: '8px', minWidth: '36px',
                                                    background: page === transactions.current_page ? '#7c3aed' : '#fff',
                                                    color: page === transactions.current_page ? '#fff' : '#4B5563',
                                                    border: `1px solid ${page === transactions.current_page ? '#7c3aed' : '#e2e8f0'}`,
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                )}
            </div>

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold" style={{ color: '#1F2937' }}>Nạp tiền vào ví</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDepositModal(false)}></button>
                            </div>
                            <form onSubmit={handleDeposit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Số tiền cần nạp (VNĐ)</label>
                                        <input 
                                            type="number" 
                                            className="form-control form-control-lg" 
                                            value={depositAmount} 
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                            min="10000"
                                            step="10000"
                                            required
                                            style={{ borderRadius: '10px' }}
                                        />
                                        <div className="form-text mt-2">
                                            <span className="text-muted">Tối thiểu 10,000đ. </span>
                                            {usePage().props.wallet_bonuses?.length > 0 && (
                                                <span className="text-success fw-bold">
                                                    <i className="fa-solid fa-gift me-1"></i>Thưởng nạp:{' '}
                                                    {usePage().props.wallet_bonuses.map((b, idx) => (
                                                        <span key={b.id}>
                                                            +{Number(b.bonus_percentage)}% {b.max_bonus_amount ? `(Tối đa ${new Intl.NumberFormat('vi-VN').format(b.max_bonus_amount)}đ)` : ''} (Từ {new Intl.NumberFormat('vi-VN').format(b.min_amount)}đ)
                                                            {idx < usePage().props.wallet_bonuses.length - 1 ? ' | ' : ''}
                                                        </span>
                                                    ))}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Phương thức thanh toán</label>
                                        <div className="d-flex gap-3">
                                            <div 
                                                className={`flex-fill p-3 border rounded text-center cursor-pointer`}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: depositGateway === 'vnpay' ? '#7c3aed' : '#e2e8f0', background: depositGateway === 'vnpay' ? '#f5f3ff' : '#fff' }}
                                                onClick={() => setDepositGateway('vnpay')}
                                            >
                                                <i className="fa-solid fa-money-check-dollar fs-3 mb-2 d-block" style={{ color: depositGateway === 'vnpay' ? '#7c3aed' : '#9CA3AF' }}></i>
                                                <span className="fw-semibold" style={{ color: depositGateway === 'vnpay' ? '#7c3aed' : '#4B5563' }}>VNPAY</span>
                                            </div>
                                            <div 
                                                className={`flex-fill p-3 border rounded text-center cursor-pointer`}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: depositGateway === 'stripe' ? '#7c3aed' : '#e2e8f0', background: depositGateway === 'stripe' ? '#f5f3ff' : '#fff' }}
                                                onClick={() => setDepositGateway('stripe')}
                                            >
                                                <i className="fa-brands fa-stripe fs-3 mb-2 d-block" style={{ color: depositGateway === 'stripe' ? '#7c3aed' : '#9CA3AF' }}></i>
                                                <span className="fw-semibold" style={{ color: depositGateway === 'stripe' ? '#7c3aed' : '#4B5563' }}>Stripe</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowDepositModal(false)} style={{ borderRadius: '10px', fontWeight: 500 }}>Hủy</button>
                                    <button type="submit" className="btn text-white px-4" style={{ background: '#7c3aed', borderRadius: '10px', fontWeight: 600 }}>Tiến hành nạp</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
                </>
            )}
            </div>
        </SellerLayout>
    );
}
