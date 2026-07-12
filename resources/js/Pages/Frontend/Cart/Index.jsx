import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router } from "@inertiajs/react";

export default function Index({ cartItems = [] }) {
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isApplying, setIsApplying] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
    const total = subtotal - discount;

    const handleRemoveItem = (courseId) => {
        router.post(route('frontend.cart.remove'), { course_id: courseId }, {
            preserveScroll: true
        });
    };

    const applyCoupon = () => {
        setIsApplying(true);
        // Mockup
        setTimeout(() => {
            setIsApplying(false);
            if (couponCode.toUpperCase() === 'GIAM200K') {
                setDiscount(200000);
            } else {
                setDiscount(0);
                alert("Mã giảm giá không hợp lệ");
            }
        }, 600);
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        alert("Chức năng thanh toán đang được phát triển!");
    };

    return (
        <>
            <div className="page-header py-4 bg-white border-bottom">
                <div className="container">
                    <h1 className="fs-3 fw-bold mb-0">Thanh toán an toàn</h1>
                </div>
            </div>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="bg-white rounded-3 border p-4 mb-4">
                                <h5 className="fw-bold mb-4 border-bottom pb-3">Chi tiết giỏ hàng</h5>
                                
                                <div id="cartItemsList">
                                    {cartItems.length > 0 ? (
                                        cartItems.map((item) => (
                                            <div className="cart-item" key={item.id}>
                                                <img src={item.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200"} alt="Course Thumbnail" className="cart-item-img" />
                                                <div className="cart-item-info">
                                                    <h6 className="fw-bold mb-1">{item.title}</h6>
                                                    <p className="text-muted font-sm mb-0">Khóa học</p>
                                                </div>
                                                <div className="cart-item-price fw-bold text-fire text-end">
                                                    {formatCurrency(item.price)}
                                                </div>
                                                <button type="button" className="btn-remove-item" onClick={() => handleRemoveItem(item.id)} title="Xóa khỏi giỏ">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted">Giỏ hàng của bạn đang trống.</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-3 border p-4">
                                <h5 className="fw-bold mb-4 border-bottom pb-3">Phương thức thanh toán</h5>
                                
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="payment-method-box w-100">
                                            <input type="radio" name="payment_gateway" value="stripe" defaultChecked />
                                            <div className="payment-content">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <span className="fw-semibold">Thẻ Tín Dụng / Ghi Nợ</span>
                                                    <i className="fa-brands fa-stripe fs-3 text-primary"></i>
                                                </div>
                                                <p className="font-sm text-muted mb-0">Thanh toán quốc tế bảo mật qua Stripe.</p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="payment-method-box w-100">
                                            <input type="radio" name="payment_gateway" value="vnpay" />
                                            <div className="payment-content">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <span className="fw-semibold">VNPay / ATM Nội Địa</span>
                                                    <span className="fw-bold text-primary" style={{ fontFamily: 'Arial', fontSize: '1.2rem' }}>VNPAY</span>
                                                </div>
                                                <p className="font-sm text-muted mb-0">Quét mã QR hoặc dùng thẻ ngân hàng nội địa.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="summary-box bg-white rounded-3 border p-4 sticky-top" style={{ top: '90px' }}>
                                <h5 className="fw-bold mb-4">Tổng quan đơn hàng</h5>

                                <div className="d-flex justify-content-between mb-3 font-sm">
                                    <span className="text-muted">Tạm tính (<span id="itemCount">{cartItems.length}</span> khóa học):</span>
                                    <span className="fw-semibold">{formatCurrency(subtotal)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="d-flex justify-content-between mb-3 font-sm text-success">
                                        <span>Mã giảm giá ({couponCode}):</span>
                                        <span className="fw-semibold">-{formatCurrency(discount)}</span>
                                    </div>
                                )}

                                <hr className="border-secondary opacity-25" />

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold fs-5">Tổng cộng:</span>
                                    <span className="fw-bold fs-4 text-fire">{formatCurrency(total)}</span>
                                </div>

                                <div className="mb-4">
                                    <label className="font-sm fw-semibold mb-2">Mã giảm giá (Coupon)</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Nhập mã..." readOnly={discount > 0} />
                                        <button className="btn btn-outline-dark fw-semibold" type="button" onClick={applyCoupon} disabled={isApplying || discount > 0}>
                                            {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
                                        </button>
                                    </div>
                                </div>

                                <button type="button" onClick={handleCheckout} className="btn btn-fire w-100 py-3 fs-5" disabled={cartItems.length === 0}>
                                    Thanh toán ngay <i className="fa-solid fa-arrow-right ms-2"></i>
                                </button>
                                <p className="text-center text-muted mt-3" style={{ fontSize: '0.75rem' }}>
                                    Bằng việc hoàn tất mua, bạn đồng ý với <Link href="#" className="text-dark">Điều khoản dịch vụ</Link>. Hệ thống sẽ tạo Order và chuyển hướng đến cổng thanh toán an toàn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Index.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);
