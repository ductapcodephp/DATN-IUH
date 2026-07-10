import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout.jsx';

export default function Dashboard() {
    return (
        <>
            <Head title="Tổng quan - Kênh Người Bán" />
            <link rel="stylesheet" href="/assets/seller/css/seller.css" />

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Kênh Giảng Viên</div>
                        <div className="page-sub">Chào quay trở lại, đối tác Tuấn! Hôm nay bạn có 8 học viên mới đăng ký.</div>
                    </div>
                    <button className="btn-primary"><i className="fa-solid fa-plus"></i> Tạo khóa học mới</button>
                </div>

                {/* Grid Thống kê */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'var(--fire-d)', color: 'var(--fire)' }}><i className="fa-solid fa-sack-dollar"></i></div>
                        <div className="stat-card-val">54.8M đ</div>
                        <div className="stat-card-label">Doanh thu tạm tính (T6)</div>
                        <div className="stat-card-trend trend-up"><i className="fa-solid fa-arrow-trend-up"></i> +24% tháng trước</div>
                        <div className="stat-card-line" style={{ background: 'var(--fire)' }}></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'var(--accent-d)', color: 'var(--accent)' }}><i className="fa-solid fa-users"></i></div>
                        <div className="stat-card-val">1,842</div>
                        <div className="stat-card-label">Tổng học viên đăng ký</div>
                        <div className="stat-card-trend trend-up"><i className="fa-solid fa-arrow-trend-up"></i> +82 tuần này</div>
                        <div className="stat-card-line" style={{ background: 'var(--accent)' }}></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'var(--purple-d)', color: 'var(--purple)' }}><i className="fa-solid fa-book-bookmark"></i></div>
                        <div className="stat-card-val">3</div>
                        <div className="stat-card-label">Khóa học đang mở</div>
                        <div className="stat-card-trend"><i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }}></i> Tất cả ổn định</div>
                        <div className="stat-card-line" style={{ background: 'var(--purple)' }}></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'var(--yellow-d)', color: 'var(--yellow)' }}><i className="fa-solid fa-star"></i></div>
                        <div className="stat-card-val">4.92</div>
                        <div className="stat-card-label">Đánh giá trung bình</div>
                        <div className="stat-card-trend trend-up"><i className="fa-solid fa-arrow-trend-up"></i> (120 nhận xét)</div>
                        <div className="stat-card-line" style={{ background: 'var(--yellow)' }}></div>
                    </div>
                </div>

                {/* Biểu đồ & Đăng ký mới */}
                <div className="charts-row">
                    <div className="card">
                        <div className="card-header">
                            <div><div className="card-title">Biến động số dư & Học viên đăng ký mới</div><div className="card-sub">Cập nhật 30 phút trước</div></div>
                        </div>
                        <div className="card-body">
                            <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '20px', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ height: '40%', width: '12%', background: 'var(--fire-d)', borderTop: '3px solid var(--fire)', textAlign: 'center', fontSize: '10px' }}>T2</div>
                                <div style={{ height: '60%', width: '12%', background: 'var(--fire-d)', borderTop: '3px solid var(--fire)', textAlign: 'center', fontSize: '10px' }}>T3</div>
                                <div style={{ height: '55%', width: '12%', background: 'var(--fire-d)', borderTop: '3px solid var(--fire)', textAlign: 'center', fontSize: '10px' }}>T4</div>
                                <div style={{ height: '80%', width: '12%', background: 'var(--fire-d)', borderTop: '3px solid var(--fire)', textAlign: 'center', fontSize: '10px' }}>T5</div>
                                <div style={{ height: '95%', width: '12%', background: 'var(--fire-d)', borderTop: '3px solid var(--fire)', textAlign: 'center', fontSize: '10px' }}>T6 (Nay)</div>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '10px', textAlign: 'center' }}><i className="fa-solid fa-info-circle"></i> Biểu đồ doanh số tuần hiện tại</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><div className="card-title">Đăng ký mới nhất</div></div>
                        <div style={{ padding: '10px 15px' }}>
                            <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Hoàng Long</strong> mua <i>Next.js Advanced</i></span>
                                <span style={{ color: 'var(--green)' }}>+499K</span>
                            </div>
                            <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Minh Thư</strong> mua <i>UI/UX Master</i></span>
                                <span style={{ color: 'var(--green)' }}>+599K</span>
                            </div>
                            <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Khánh An</strong> mua <i>React cho người mới</i></span>
                                <span style={{ color: 'var(--green)' }}>+399K</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
);
}

// 🌟 3. KHAI BÁO BỘ KHUNG CỐ ĐỊNH Ở ĐÂY ĐỂ HOÀN TẤT SPA
Dashboard.layout = page => <SellerLayout children={page} />
