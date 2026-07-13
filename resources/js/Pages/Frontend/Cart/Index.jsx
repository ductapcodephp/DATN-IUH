import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router, Head } from "@inertiajs/react";
import SweetAlert from '@/Components/SweetAlert';

export default function Index({ cart, cartItems = [], totalAmount, popularCourses = [] }) {
    const [coupon, setCoupon] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [selectedGateway, setSelectedGateway] = useState('stripe');
    const [processing, setProcessing] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState({ show: false, id: null });

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getImageUrl = (url) => {
        if (!url) return "/assets/frontend/img/default-course-orange.png";
        if (url.startsWith('http')) return url;
        return `/storage/${url}`;
    };

    const finalTotal = totalAmount - discountAmount;

    const removeFromCart = (courseId) => {
        setConfirmRemove({ show: true, id: courseId });
    };

    const executeRemove = (courseId) => {
        router.post(route('frontend.cart.remove'), { course_id: courseId }, {
            preserveScroll: true
        });
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        setApplyingCoupon(true);
        setTimeout(() => {
            setApplyingCoupon(false);
            if (coupon === 'GIAM200K') {
                setDiscountAmount(200000);
                setAppliedCoupon({ code: 'GIAM200K', type: 'fixed', value: 200000 });
            } else {
                setDiscountAmount(0);
                setAppliedCoupon(null);
            }
        }, 600);
    };

    const handleRemoveCoupon = () => {
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCoupon("");
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
        }, 1000);
    };

    return (
        <FrontendLayout>
            <Head title="Giỏ hàng của bạn" />

            <SweetAlert
                show={confirmRemove.show}
                type="confirm"
                icon="warning"
                title="Xóa khóa học?"
                text="Bạn có chắc chắn muốn xóa khóa học này khỏi giỏ hàng?"
                confirmButtonText="Xóa"
                cancelButtonText="Hủy"
                confirmButtonColor="#dc3545"
                onConfirm={() => executeRemove(confirmRemove.id)}
                onClose={() => setConfirmRemove({ show: false, id: null })}
            />

            {/* HEADER GIỎ HÀNG */}
            <div className="page-header py-5 position-relative overflow-hidden page-header-premium">
                <div className="container position-relative z-index-1">
                    <div className="row align-items-center">
                        <div className="col-12 text-center text-md-start">
                            <h1 className="fw-bolder display-5 mb-2 text-dark">Giỏ hàng của bạn</h1>
                            <p className="text-muted fs-5 mb-0">Hoàn tất thủ tục thanh toán để bắt đầu khóa học</p>
                        </div>
                    </div>
                </div>
                
                {/* Background icon pattern */}
                <div className="position-absolute top-0 end-0 opacity-10 translate-middle-y text-muted header-bg-icon">
                    <i className="fa-solid fa-shield-halved fs-15rem"></i>
                </div>
            </div>

            <section className="py-5 cart-section">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="bg-white rounded-4 shadow-sm border-0 p-4 p-md-5 mb-4">
                                <h4 className="fw-bold fs-4 mb-4 text-dark"><i className="fa-solid fa-cart-shopping me-2 text-muted"></i>Sản phẩm đã chọn</h4>
                                
                                {cartItems && cartItems.length > 0 ? (
                                    <div className="d-flex flex-column gap-3 pe-2 cart-items-wrapper custom-scrollbar">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-surface">
                                                <div className="card-body p-3 p-md-4 d-flex flex-column flex-md-row align-items-md-center">
                                                    
                                                    {/* Thumbnail */}
                                                    <Link href={route('frontend.course.detail', item.course?.slug || '#')} className="d-block mb-3 mb-md-0 overflow-hidden rounded-3 cart-item-img-wrap">
                                                        <img 
                                                            src={getImageUrl(item.course?.thumbnail)} 
                                                            alt={item.course?.title} 
                                                            className="w-100 h-100 object-fit-cover cart-item-img" 
                                                            loading="lazy" 
                                                            onError={(e) => {
                                                                e.target.src = "/assets/frontend/img/default-course.png";
                                                            }}
                                                        />
                                                    </Link>

                                                    {/* Info */}
                                                    <div className="ms-md-4 flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <div className="badge bg-primary bg-opacity-10 text-primary mb-2 rounded-pill px-3 py-2 fw-medium border border-primary border-opacity-25">
                                                                    <i className="fa-solid fa-tag me-1"></i>
                                                                    {item.course?.category?.name || 'Khóa học'}
                                                                </div>
                                                                <Link href={route('frontend.course.detail', item.course?.slug || '#')} className="text-decoration-none text-dark d-block">
                                                                    <h4 className="fw-bold mb-2 fs-5 lh-base text-truncate" style={{maxWidth: '400px'}} title={item.course?.title}>{item.course?.title}</h4>
                                                                </Link>
                                                                <div className="text-muted small">Tác giả: <span className="fw-medium text-dark">{item.course?.seller?.name || 'Giảng viên'}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="d-flex flex-row flex-md-column align-items-center align-items-md-end justify-content-between mt-3 mt-md-0 ms-md-4 cart-item-price-wrap">
                                                        <div className="fw-bold fs-5 mb-md-2 theme-orange">
                                                            {formatPrice(item.price)}
                                                        </div>
                                                        <button 
                                                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm border btn-remove-cart btn-icon-36"
                                                            onClick={() => removeFromCart(item.course_id)}
                                                            title="Xóa khỏi giỏ hàng"
                                                        >
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-5 text-center bg-white rounded-4 shadow-sm border-0">
                                        <i className="fa-solid fa-cart-shopping text-muted opacity-25 fs-4rem"></i>
                                        <h4 className="mt-4 fw-bold text-dark">Giỏ hàng trống</h4>
                                        <p className="text-muted mb-4">Bạn chưa chọn khóa học nào. Hãy tiếp tục khám phá nhé!</p>
                                        <Link href={route('frontend.course.index')} className="btn px-4 py-2 rounded-pill fw-semibold mt-2 shadow-sm text-white btn-gradient-orange">
                                            <i className="fa-solid fa-magnifying-glass me-2"></i>Tìm khóa học ngay
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-4 shadow-sm border-0 p-4 p-md-5">
                                <h4 className="fw-bold fs-4 mb-4 text-dark"><i className="fa-solid fa-credit-card me-2 text-muted"></i>Phương thức thanh toán</h4>
                                
                                <div className="row g-3">
                                    <div className="col-12 col-sm-6">
                                        <div 
                                            className={`payment-method-label rounded-3 p-3 position-relative overflow-hidden ${selectedGateway === 'stripe' ? 'active' : ''}`}
                                            onClick={() => setSelectedGateway('stripe')}
                                        >
                                            <div className="position-absolute top-0 end-0 p-2">
                                                {selectedGateway === 'stripe' && (
                                                    <i className={`fa-solid fa-circle-check fs-5 theme-orange`}></i>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <i className="fa-brands fa-stripe fs-2 text-stripe"></i>
                                                <div>
                                                    <div className="fw-bold text-dark">Thanh toán Quốc tế</div>
                                                    <div className="small text-muted">Bằng thẻ Visa, Mastercard qua Stripe</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6">
                                        <div 
                                            className={`payment-method-label rounded-3 p-3 position-relative overflow-hidden ${selectedGateway === 'vnpay' ? 'active' : ''}`}
                                            onClick={() => setSelectedGateway('vnpay')}
                                        >
                                            <div className="position-absolute top-0 end-0 p-2">
                                                {selectedGateway === 'vnpay' && (
                                                    <i className={`fa-solid fa-circle-check fs-5 theme-orange`}></i>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="fw-bold px-2 py-1 bg-white rounded shadow-sm text-dark vnpay-logo">
                                                    <span style={{color: '#005baa'}}>VN</span><span style={{color: '#ed1b24'}}>PAY</span>
                                                </span>
                                                <div>
                                                    <div className="fw-bold text-dark">Thanh toán Nội địa</div>
                                                    <div className="small text-muted">Qua ứng dụng ngân hàng VN (VNPAY)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bg-white rounded-4 shadow-sm border-0 p-4 p-md-5 sticky-top sticky-top-100">
                                <h4 className="fw-bold mb-4 text-dark"><i className="fa-solid fa-receipt me-2 text-muted"></i>Tổng đơn hàng</h4>
                                
                                {/* Promo Code Box */}
                                <div className="p-4 rounded-4 mb-4 bg-surface">
                                    <h6 className="fw-bold mb-3 text-dark">Mã giảm giá</h6>
                                    {appliedCoupon ? (
                                        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm border border-success border-opacity-25">
                                            <div>
                                                <div className="fw-bold text-success mb-1">
                                                    <i className="fa-solid fa-tags me-2"></i>{appliedCoupon.code}
                                                </div>
                                                <div className="small text-muted">
                                                    {appliedCoupon.type === 'percent' 
                                                        ? `Giảm ${appliedCoupon.value}% đơn hàng` 
                                                        : `Giảm ${formatPrice(appliedCoupon.value)}`}
                                                </div>
                                            </div>
                                            <button 
                                                className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                                                onClick={handleRemoveCoupon}
                                                title="Gỡ mã giảm giá"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                                            <input 
                                                type="text" 
                                                className="form-control rounded-3 bg-white orange-input-focus"
                                                placeholder="Nhập mã (VD: GIAM200K)" 
                                                value={coupon}
                                                onChange={e => setCoupon(e.target.value.toUpperCase())}
                                            />
                                            <button 
                                                type="submit" 
                                                className="btn btn-dark px-4 fw-semibold rounded-3"
                                                disabled={!coupon.trim() || applyingCoupon}
                                            >
                                                {applyingCoupon ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Áp dụng'}
                                            </button>
                                        </form>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                                    <span className="fw-medium">{formatPrice(totalAmount)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="d-flex justify-content-between mb-3 text-success fw-medium">
                                        <span>Giảm giá:</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <hr className="my-4 border-secondary opacity-10" />
                                <div className="d-flex justify-content-between align-items-end mb-4">
                                    <span className="fw-bold text-dark fs-5">Tổng cộng:</span>
                                    <div className="text-end">
                                        <span className="fw-bold fs-3 theme-orange">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>

                                <button 
                                    className="btn w-100 py-3 rounded-pill fw-bold text-white fs-5 shadow-sm btn-gradient-orange"
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0 || processing}
                                >
                                    {processing ? (
                                        <><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Đang xử lý...</>
                                    ) : (
                                        <>
                                            Thanh toán {selectedGateway === 'vnpay' ? 'VNPAY' : 'Stripe'}
                                            <i className="fa-solid fa-arrow-right ms-2"></i>
                                        </>
                                    )}
                                </button>
                                
                                <p className="text-center text-muted mt-4 mb-0 small">
                                    Bằng cách hoàn tất giao dịch mua, bạn đồng ý với Điều khoản Dịch vụ này của chúng tôi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách Khóa học mua nhiều nhất */}
                    {popularCourses && popularCourses.length > 0 && (
                        <div className="mt-5 pt-4 border-top">
                            <h3 className="fw-bold mb-4">Khóa học được mua nhiều nhất</h3>
                            <div className="row g-4">
                                {popularCourses.map((course) => (
                                    <div key={course.id} className="col-12 col-md-6 col-lg-3">
                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card cart-card-hover">
                                            <Link href={route('frontend.course.detail', course.slug)} className="text-decoration-none">
                                                <img 
                                                    src={getImageUrl(course.thumbnail)} 
                                                    alt={course.title} 
                                                    className="w-100 object-fit-cover" 
                                                    style={{ height: '160px' }} 
                                                    loading="lazy" 
                                                    onError={(e) => {
                                                        e.target.src = "/assets/frontend/img/default-course.png";
                                                    }}
                                                />
                                                <div className="card-body p-3">
                                                    <div className="badge bg-primary bg-opacity-10 text-primary mb-2 rounded-pill px-2 py-1">
                                                        {course.category?.name || 'Khóa học'}
                                                    </div>
                                                    <h6 className="fw-bold text-dark text-truncate mb-2">{course.title}</h6>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="small text-muted"><i className="fa-solid fa-users me-1"></i>{course.students_count} học viên</span>
                                                        <span className="small text-warning fw-bold"><i className="fa-solid fa-star me-1"></i>{Number(course.reviews_avg_rating).toFixed(1) || 5.0}</span>
                                                    </div>
                                                    <div className="fw-bold theme-orange">{formatPrice(course.price)}</div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </FrontendLayout>
    );
}
