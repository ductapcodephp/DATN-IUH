import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx"; // Gọi component phân trang bám đáy

export default function Revenues() {
    return (
        <>
            <Head title="Ví tiền & Quản lý rút tiền" />

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Ví tiền & Quản lý rút tiền</div>
                        <div className="page-sub">Số dư khả dụng hiện tại có thể rút về tài khoản ngân hàng liên kết</div>
                    </div>
                    <button className="btn-primary" style={{ background: 'var(--green)', color: '#fff' }}>
                        <i className="fa-solid fa-money-bill-transfer"></i> Gửi yêu cầu rút tiền
                    </button>
                </div>

                {/* Khối thẻ thống kê số dư */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="stat-card" style={{ borderLeft: '4px solid var(--green)' }}>
                        <div className="stat-card-val" style={{ color: 'var(--green)' }}>32,450,000 đ</div>
                        <div className="stat-card-label">Số dư khả dụng có thể rút</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-val">22,000,000 đ</div>
                        <div className="stat-card-label">Đang chờ xử lý lệnh rút</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-val">145,000,000 đ</div>
                        <div className="stat-card-label">Tổng số tiền đã rút thành công</div>
                    </div>
                </div>

                {/* Bảng lịch sử nhận flex: 1 từ file CSS toàn cục để tự động kéo dãn bám đáy */}
                <div className="table-card" style={{ marginTop: '20px' }}>
                    <div className="table-toolbar">
                        <span style={{ fontWeight: '700' }}>Lịch sử giao dịch & Rút tiền</span>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>Mã lệnh</th>
                                <th>Ngân hàng nhận</th>
                                <th>Số tiền rút</th>
                                <th>Ngày gửi</th>
                                <th>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td style={{ color: 'var(--accent)' }}>#W-9482</td>
                                <td>Vietcombank (***839)</td>
                                <td><strong>15,000,000 đ</strong></td>
                                <td>14/06/2026</td>
                                <td><span className="badge badge-green">Thành công</span></td>
                            </tr>
                            <tr>
                                <td style={{ color: 'var(--accent)' }}>#W-9411</td>
                                <td>Techcombank (***112)</td>
                                <td><strong>7,000,000 đ</strong></td>
                                <td>11/06/2026</td>
                                <td><span className="badge badge-green">Thành công</span></td>
                            </tr>
                            <tr>
                                <td style={{ color: 'var(--accent)' }}>#W-9302</td>
                                <td>Vietcombank (***839)</td>
                                <td><strong>22,000,000 đ</strong></td>
                                <td>08/06/2026</td>
                                <td><span className="badge badge-yellow">Đang xử lý</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Thanh phân trang bám đáy tự động không sợ co rút */}
                    <Pagination from={1} to={3} total={3} />

                </div>
            </div>
        </>
    );
}

Revenues.layout = page => <SellerLayout children={page} />
