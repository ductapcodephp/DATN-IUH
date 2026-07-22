import React from 'react';
import { Head } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";

function StarRating({ rating }) {
    return (
        <div className="d-flex align-items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <i 
                    key={star} 
                    className={`ri-star-fill ${star <= rating ? 'text-warning' : 'text-secondary opacity-25'}`}
                    style={{ fontSize: '1.1rem' }}
                ></i>
            ))}
            <span className="ms-2 fw-semibold text-dark">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function Reviews() {
    const reviews = [
        {
            id: 1,
            studentName: 'Đăng Khoa',
            courseName: 'Next.js Pro Masterclass',
            rating: 5,
            comment: 'Khóa học siêu thực chiến, giúp em tối ưu được dự án công ty tốt hơn nhiều.',
            avatar: 'https://ui-avatars.com/api/?name=Đăng+Khoa&background=0D8ABC&color=fff'
        },
        {
            id: 2,
            studentName: 'Thanh Thảo',
            courseName: 'UI/UX Design Master',
            rating: 4,
            comment: 'Nội dung Figma rất chi tiết, tuy nhiên phần nâng cao về Design System cần thêm bài viết đọc thêm.',
            avatar: 'https://ui-avatars.com/api/?name=Thanh+Thảo&background=E11D48&color=fff'
        }
    ];

    return (
        <>
            <Head title="Đánh giá từ học viên" />

            <div className="page p-4">
                <div className="d-flex justify-content-between align-items-end mb-4 pb-2 border-bottom">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#111827' }}>Đánh giá từ học viên</h2>
                        <div className="text-muted" style={{ fontSize: '0.95rem' }}>Phản hồi và chấm sao từ những người tham gia học khóa của bạn</div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: '#fff' }}>
                    <div className="table-responsive">
                        <table className="table modern-table mb-0 align-middle">
                            <thead style={{ background: '#F9FAFB' }}>
                                <tr>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Học viên</th>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Đánh giá</th>
                                    <th className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Bình luận</th>
                                    <th className="text-uppercase text-muted fw-bold text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '16px 24px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id} className="table-row-hover">
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <img src={review.avatar} alt="avatar" className="rounded-circle" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{review.studentName}</div>
                                                    <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}><i className="ri-book-open-line me-1"></i>{review.courseName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <StarRating rating={review.rating} />
                                        </td>
                                        <td style={{ padding: '20px 24px', maxWidth: '350px' }}>
                                            <div className="fst-italic text-secondary position-relative ps-3" style={{ borderLeft: '3px solid #E5E7EB', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                "{review.comment}"
                                            </div>
                                        </td>
                                        <td className="text-end" style={{ padding: '20px 24px' }}>
                                            <button className="btn-reply-outline">
                                                <i className="ri-reply-line me-1"></i> Trả lời
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4">
                    <Pagination from={1} to={2} total={2} />
                </div>
            </div>

            <style>{`
                .modern-table th { border-bottom: 1px solid #E5E7EB; }
                .modern-table td { border-bottom: 1px solid #F3F4F6; }
                .table-row-hover:hover { background-color: #F9FAFB; }
                .table-row-hover { transition: background-color 0.15s ease; }
                .btn-reply-outline {
                    background: transparent;
                    color: #EA580C;
                    border: 1px solid #fed7aa;
                    border-radius: 20px;
                    padding: 6px 16px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .btn-reply-outline:hover {
                    background: #FFF7ED;
                    border-color: #EA580C;
                }
            `}</style>
        </>
    );
}

Reviews.layout = page => <SellerLayout children={page} />
