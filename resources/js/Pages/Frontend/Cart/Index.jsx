import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router, Head } from "@inertiajs/react";
import Swal from 'sweetalert2';
import CouponModal from './CouponModal';

export default function Index({ cart, cartItems = [], totalAmount, popularCourses = [] , courseCoupons = [], instructorCoupons = [], platformCoupons = [], discountAmount = 0, appliedCoupons = [] }) {
    console.log(instructorCoupons)
    console.log(courseCoupons)
    console.log(platformCoupons)
    const [selectedGateway, setSelectedGateway] = useState('vnpay');
    const [processing, setProcessing] = useState(false);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
    const formatPrice = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    console.log("Các mã giảm giá đang áp dụng (Index):", appliedCoupons);
    const removeCoupon = (codeToRemove) => {
        const currentCodes = appliedCoupons.map(c => c.code);
        const newCodes = currentCodes.filter(c => c !== codeToRemove);
        router.post(route('frontend.cart.apply-coupons'), { codes: newCodes }, { preserveScroll: true });
    };

    const finalTotal = totalAmount - discountAmount;

    const removeFromCart = (cartItemId) => {
        Swal.fire({
            title: "Xóa khóa học?",
            text: "Bạn có chắc chắn muốn xóa khóa học này khỏi giỏ hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            background: "#ffffff",
            customClass: { popup: "border-radius-10" }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('frontend.cart.remove', { cartItem: cartItemId }), {
                    preserveScroll: true
                });
            }
        });
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('frontend.checkout.process'), {
            gateway: selectedGateway,
            coupon_ids: appliedCoupons.map(c => c.id)
        }, {
            onFinish: () => setProcessing(false)
        });
    };
    const fetchAvailableCoupons = async (courseId) => {
        setIsLoadingCoupons(true);
        router.reload({
            only: ['courseCoupons', 'instructorCoupons', 'platformCoupons'],
            data: { course_id: courseId },
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsLoadingCoupons(false);
            },
        });
    }
    return (
        <FrontendLayout>
            <Head title="Giỏ hàng của bạn" />

            <div className="page-head" style={{ maxWidth: '1200px' }}>
              <h1>🛒 Giỏ hàng của bạn</h1>
              <p>Còn {cartItems.length} khóa học đang chờ — hoàn tất thanh toán để bắt đầu học ngay hôm nay.</p>
            </div>

            <div className="cart-layout" style={{ maxWidth: '1200px' }}>
              <div>
                <div className="cart-card">
                  <div className="cart-card-title">Sản phẩm đã chọn <span className="count">{cartItems.length} khóa học</span></div>
                  
                  {cartItems && cartItems.length > 0 ? (
                      <div className="cart-items-wrapper custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                          {Object.entries(cartItems.reduce((acc, item) => {
                              // Tạm thời nhóm bằng JS để tạo UI, phần logic state sếp tự code nhé!
                              const sellerName = item.course?.instructor?.name || 'EduFlow Originals';
                              if (!acc[sellerName]) acc[sellerName] = [];
                              acc[sellerName].push(item);
                              return acc;
                          }, {})).map(([sellerName, items], gIndex) => (
                              <div key={gIndex} className="seller-group mb-3" style={{ background: '#fff', border: '1px solid var(--border, #E5E7EB)', borderRadius: '12px', overflow: 'hidden' }}>
                                  {/* Tiêu đề nhóm giảng viên */}
                                  <div className="seller-header px-3 py-2" style={{ background: 'var(--bg-surface-alt, #F1F5F9)', borderBottom: '1px solid var(--border, #E5E7EB)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <i className="fa-solid fa-chalkboard-user text-muted"></i>
                                      <span className="fw-bold" style={{ fontSize: '14px', color: 'var(--text-main, #1F2937)' }}>Giảng viên: {sellerName}</span>
                                  </div>
                                  
                                  {/* Danh sách khóa học của giảng viên */}
                                  <div className="seller-items p-2">
                                      {items.map((item, index) => (
                                          <div key={index} className="cart-item border-0 mb-0 shadow-none">
                                            <img 
                                                src={item.course?.thumbnail || '/assets/frontend/img/default-course.png'} 
                                                alt={item.course?.title} 
                                                className="cart-thumb" 
                                                loading="lazy" 
                                                onError={(e) => {
                                                    e.target.src = "/assets/frontend/img/default-course.png";
                                                }}
                                            />
                                            <div className="cart-item-body">
                                              <span className="cart-item-tag">{item.course?.category?.name || 'Khóa học'}</span>
                                              <Link href={route('frontend.course.detail', item.course?.slug || '#')} className="cart-item-title" title={item.course?.title}>
                                                {item.course?.title}
                                              </Link>
                                              <div 
                                                className="mt-2 d-inline-flex align-items-center" 
                                                style={{ fontSize: '12px', cursor: 'pointer', color: '#D97706', fontWeight: '600', padding: '4px 8px', background: '#fff7ed', borderRadius: '4px', border: '1px dashed #D97706' }}
                                                data-bs-toggle="modal" 
                                                data-bs-target="#couponModal"
                                                onClick={() => fetchAvailableCoupons(item.course?.id)}
                                              >
                                                  <i className="fa-solid fa-ticket-simple me-1"></i> Chọn mã ưu đãi
                                              </div>
                                            </div>
                                            <div className="cart-item-right">
                                              <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} title="Xóa">✕</button>
                                              <div className="cart-item-price">{formatPrice(item.price)}</div>
                                            </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="py-4 text-center">
                          <p className="text-muted mb-3">Giỏ hàng trống. Bạn chưa chọn khóa học nào.</p>
                          <Link href={route('frontend.course.index')} className="btn btn-primary btn-sm rounded-pill px-4" style={{ background: 'var(--clay)', border: 'none' }}>
                              Tìm khóa học ngay
                          </Link>
                      </div>
                  )}
                </div>

                <div className="cart-card">
                  <div className="cart-card-title">Phương thức thanh toán</div>
                  <div className="cart-method-grid">
                    <div 
                        className={`cart-method ${selectedGateway === 'stripe' ? 'active' : ''}`}
                        onClick={() => setSelectedGateway('stripe')}
                    >
                      <div className="badge">S</div>
                      <div>
                        <div className="name">Thanh toán quốc tế</div>
                        <div className="desc">Visa, Mastercard qua Stripe</div>
                      </div>
                      {selectedGateway === 'stripe' && <div className="check">✓</div>}
                    </div>
                    <div 
                        className={`cart-method ${selectedGateway === 'vnpay' ? 'active' : ''}`}
                        onClick={() => setSelectedGateway('vnpay')}
                    >
                      <div className="badge" style={{background: '#005baa'}}>VN</div>
                      <div>
                        <div className="name">Thanh toán nội địa</div>
                        <div className="desc">Qua ứng dụng ngân hàng (VNPAY)</div>
                      </div>
                      {selectedGateway === 'vnpay' && <div className="check">✓</div>}
                    </div>
                  </div>
                </div>
                    {/* các khóa học được mua nhiều nhất */}
                {popularCourses && popularCourses.length > 0 && (
                    <div className="cart-cross-sell">
                      <img 
                        src={popularCourses[0]?.thumbnail || '/assets/frontend/img/default-course.png'} 
                        alt={popularCourses[0]?.title} 
                        className="cart-thumb" 
                        style={{width: '44px', height: '44px'}}
                        onError={(e) => { e.target.src = "/assets/frontend/img/default-course.png"; }}
                      />
                      <div className="cart-cross-sell-body">
                        <div className="cart-cross-sell-title text-truncate" style={{maxWidth: '200px'}}>{popularCourses[0]?.title}</div>
                        <div className="cart-cross-sell-price">Thêm chỉ với {formatPrice(popularCourses[0]?.price)} khi mua kèm</div>
                      </div>
                      <Link href={route('frontend.course.detail', popularCourses[0]?.slug || '#')} className="text-decoration-none">
                          <button style={{border: '1px solid var(--ink-300)', background: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'}}>
                              Xem chi tiết
                          </button>
                      </Link>
                    </div>
                )}
              </div>
                    {/* các mã đã được applied */}
              <div className="cart-card" style={{position: 'sticky', top: '24px'}}>
                <div className="cart-card-title">📋 Tổng đơn hàng</div>

                {appliedCoupons && appliedCoupons.length > 0 ? (
                    <>
                        <div className="applied-coupons-wrapper custom-scrollbar" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                            {appliedCoupons.map((coupon, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm border border-success border-opacity-25 mb-2" style={{ background: '#fff', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--green-600)', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="fw-bold text-success mb-1" style={{fontSize: '13px', color: 'var(--green-600)', fontWeight: '700'}}>
                                            <i className="fa-solid fa-tags me-1"></i>{coupon.code}
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-outline-danger border-0 rounded-circle p-1"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#dc3545' }}
                                        onClick={() => removeCoupon(coupon.code)}
                                        title="Gỡ mã giảm giá"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div 
                            className="cart-promo-trigger mt-3" 
                            data-bs-toggle="modal" 
                                data-bs-target="#couponModal"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    background: 'var(--bg-surface-alt, #F1F5F9)',
                                    borderRadius: '8px',
                                    border: '1px dashed var(--fire, #EA580C)',
                                    cursor: 'pointer',
                                    color: 'var(--fire, #EA580C)',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#fff7ed'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-surface-alt, #F1F5F9)'; }}
                                onClick={() => fetchAvailableCoupons('all')}
                            >
                                <span><i className="fa-solid fa-plus me-2"></i> Thêm ưu đãi khác</span>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                            </div>
                    </>
                ) : (
                    <>
                        <div 
                            className="cart-promo-trigger" 
                            data-bs-toggle="modal" 
                            data-bs-target="#couponModal"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: 'var(--bg-surface-alt, #F1F5F9)',
                                borderRadius: '8px',
                                border: '1px dashed var(--fire, #EA580C)',
                                cursor: 'pointer',
                                color: 'var(--fire, #EA580C)',
                                fontWeight: '600',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#fff7ed'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-surface-alt, #F1F5F9)'; }}
                            onClick={() => fetchAvailableCoupons('all')}
                        >
                            <span><i className="fa-solid fa-ticket me-2"></i> Chọn mã khuyến mãi</span>
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                        </div>
                    </>
                )}

                <div className="cart-divider"></div>

                <div className="cart-summary-row"><span>Tạm tính ({cartItems.length} sản phẩm)</span><span>{formatPrice(totalAmount)}</span></div>
                {discountAmount > 0 && (
                    <div className="cart-summary-row discount"><span>Ưu đãi</span><span>− {formatPrice(discountAmount)}</span></div>
                )}

                <div className="cart-divider"></div>

                <div className="cart-total-row">
                  <span className="label">Tổng cộng</span>
                  <span className="value">{formatPrice(finalTotal)}</span>
                </div>

                <button 
                    className="cart-pay-btn"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || processing}
                >
                  {processing ? 'Đang xử lý...' : 'Hoàn tất thanh toán →'}
                </button>

                <div className="cart-trust-row">
                  <span>🔒 Bảo mật SSL</span>
                  <span>↺ Hoàn tiền 7 ngày</span>
                </div>

                <div className="cart-refund-note">
                  ✓ Được hoàn tiền 100% trong 7 ngày nếu khóa học không phù hợp.
                </div>

                <p className="cart-legal">Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.</p>
              </div>

            </div>

            {popularCourses && popularCourses.length > 0 && (
                <div className="cart-popular-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 64px' }}>
                    <div style={{ borderTop: '1px solid var(--ink-300)', paddingTop: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Khóa học được mua nhiều nhất</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                            {popularCourses.map((course) => (
                                <div key={course.id} className="cart-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <Link href={route('frontend.course.detail', course.slug)} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <img 
                                            src={course.thumbnail || '/assets/frontend/img/default-course.png'} 
                                            alt={course.title} 
                                            style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                                            loading="lazy" 
                                            onError={(e) => { e.target.src = "/assets/frontend/img/default-course.png"; }}
                                        />
                                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <div className="cart-item-tag" style={{ alignSelf: 'flex-start' }}>
                                                {course.category?.name || 'Khóa học'}
                                            </div>
                                            <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                {course.title}
                                            </h6>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '12px', fontSize: '12px', color: 'var(--ink-500)' }}>
                                                <span><i className="fa-solid fa-users me-1"></i>{course.students_count} học viên</span>
                                                <span style={{ color: '#F59E0B', fontWeight: '700' }}><i className="fa-solid fa-star me-1"></i>{Number(course.reviews_avg_rating).toFixed(1) || 5.0}</span>
                                            </div>
                                            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--clay-dark)' }}>{formatPrice(course.price)}</div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <CouponModal 
                courseCoupons={courseCoupons}
                instructorCoupons={instructorCoupons}
                platformCoupons={platformCoupons}
                isLoadingCoupons={isLoadingCoupons}
                appliedCoupons={appliedCoupons}
            />
        </FrontendLayout>
    );
}
