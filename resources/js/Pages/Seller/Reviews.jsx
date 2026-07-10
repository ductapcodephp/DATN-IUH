import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";

export default function Reviews() {
    return (
        <>
            <Head title="Đánh giá từ học viên" />

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Đánh giá từ học viên</div>
                        <div className="page-sub">Phản hồi và chấm sao từ những người tham gia học khóa của bạn</div>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>Học viên</th>
                                <th>Khóa học</th>
                                <th>Số sao đánh giá</th>
                                <th>Bình luận</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><strong>Đăng Khoa</strong></td>
                                <td>Next.js Pro Masterclass</td>
                                <td style={{ color: 'var(--yellow)' }}>★★★★★ 5.0</td>
                                <td>Khóa học siêu thực chiến, giúp em tối ưu được dự án công ty tốt hơn nhiều.</td>
                                <td>
                                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                                        Trả lời
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Thanh Thảo</strong></td>
                                <td>UI/UX Design Master</td>
                                <td style={{ color: 'var(--yellow)' }}>★★★★☆ 4.0</td>
                                <td>Nội dung Figma rất chi tiết, tuy nhiên phần nâng cao về Design System cần thêm bài viết đọc thêm.</td>
                                <td>
                                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>
                                        Trả lời
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination from={1} to={2} total={2} />

                </div>
            </div>
        </>
    );
}

Reviews.layout = page => <SellerLayout children={page} />
