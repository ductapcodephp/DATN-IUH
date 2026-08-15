import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Pages/Frontend/Header';
import Footer from '@/Pages/Frontend/Footer';
import { triggerConfetti } from '@/Components/MagicUI/Confetti';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';

export default function CheckoutSuccess({ transactionCode }) {
    const { props } = usePage();
    const appUrl = props.appUrl || '';

    useEffect(() => {
        triggerConfetti({ count: 120, duration: 4500 });
    }, []);

    return (
        <div className="bg-surface">
            <Head title="Thanh toán thành công - EduFlow" />
            <Header />

            <div className="d-flex align-items-center py-5" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="bg-white rounded-4 border p-5 shadow-sm position-relative overflow-hidden">
                                <div className="mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '88px', height: '88px' }}>
                                        <i className="fa-solid fa-check fs-1"></i>
                                    </div>
                                </div>

                                <h2 className="fw-bold mb-2 text-dark">Thanh toán thành công! 🎉</h2>
                                <p className="text-muted mb-4">
                                    Cảm ơn bạn đã tin tưởng lựa chọn khóa học tại EduFlow. Mã đơn hàng của bạn là <strong className="text-dark">#{transactionCode || 'N/A'}</strong>. 
                                    Hệ thống đã tự động kích hoạt toàn bộ bài giảng và bài tập thực hành.
                                </p>

                                <div className="d-flex flex-column gap-3">
                                    <ShimmerButton
                                        asLink={true}
                                        href={route('dashboard.my-courses')}
                                        background="var(--fire, #EA580C)"
                                        className="py-3 fw-bold w-100"
                                    >
                                        <i className="fa-solid fa-graduation-cap me-2"></i> Vào phòng học ngay
                                    </ShimmerButton>

                                    <Link href={route('frontend.home')} className="btn btn-outline-dark py-3 fw-semibold rounded-3">
                                        <i className="fa-solid fa-house me-2"></i> Quay lại trang chủ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

