import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Pages/Frontend/Header';
import Footer from '@/Pages/Frontend/Footer';

export default function CheckoutSuccess({ transactionCode }) {
    const { props } = usePage();
    // Use appUrl provided from the backend or fallback to window.location.origin
    const appUrl = props.appUrl || '';

    return (
        <div className="bg-surface">
            <Head title="Thanh toán thành công" />
            <Header />

            <div className="d-flex align-items-center" style={{ minHeight: 'calc(100vh - 73px)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="bg-white rounded-4 border p-5 shadow-sm">
                                <div className="mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: '80px', height: '80px' }}>
                                        <i className="fa-solid fa-check fs-1"></i>
                                    </div>
                                </div>

                                <h2 className="fw-bold mb-3">Thanh toán thành công!</h2>
                                <p className="text-muted mb-4">
                                    Cảm ơn bạn đã mua khóa học. Mã đơn hàng của bạn là <b>#{transactionCode || 'N/A'}</b>. 
                                    Hệ thống đã mở khóa toàn bộ nội dung học tập cho bạn.
                                </p>

                                <div className="d-flex flex-column gap-3">
                                    <a href={route('dashboard.my-courses')} className="btn btn-fire py-3 fw-bold">
                                        Vào phòng học ngay
                                    </a>
                                    <a href={route('frontend.home')} className="btn btn-outline-dark py-3 fw-semibold">
                                        Quay lại trang chủ
                                    </a>
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
