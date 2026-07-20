import React from 'react';
import { router } from '@inertiajs/react';

export default function CouponModal({ courseCoupons = [], instructorCoupons = [], platformCoupons = [], isLoadingCoupons, appliedCoupons = [] }) {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedCodes, setSelectedCodes] = React.useState([]);

    const availableCoupons = [...courseCoupons, ...instructorCoupons, ...platformCoupons];

    React.useEffect(() => {
        setSelectedCodes(appliedCoupons.map(c => c.code));
    }, [appliedCoupons, courseCoupons, instructorCoupons, platformCoupons]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleSelectCoupon = (coupon, type) => {
        let actualType = type;
        if (type === 'instructor') {
            actualType = coupon.seller_id === null ? 'platform' : 'instructor';
        }
        
        setSelectedCodes(prev => {
            let newCodes = [...prev];
            

            if (actualType === 'course') {
                const modalCourseCodes = courseCoupons.map(c => c.code);
                newCodes = newCodes.filter(c => !modalCourseCodes.includes(c));
            } else if (actualType === 'instructor') {
                const modalInstructorCodes = instructorCoupons.map(c => c.code);
                newCodes = newCodes.filter(c => !modalInstructorCodes.includes(c));
            } else if (actualType === 'platform') {
                const modalPlatformCodes = platformCoupons.map(c => c.code);
                newCodes = newCodes.filter(c => !modalPlatformCodes.includes(c));
            }
            
            newCodes.push(coupon.code);
            return newCodes;
        });
    };

    const handleRemoveCoupon = (couponCode) => {
        setSelectedCodes(prev => prev.filter(c => c !== couponCode));
    };

    const handleAddFromInput = (e) => {
        e.preventDefault();
        alert('Mã ưu đãi không hợp lệ hoặc không khả dụng.');
    };

    const handleSubmit = () => {

        setTimeout(() => {
            router.post(route('frontend.cart.apply-coupons'), { codes: selectedCodes }, {
                preserveScroll: true,
                onError: (errors) => {

                }
            });
        }, 150);
    };

    const renderCouponItem = (coupon, isLast, colorTheme) => {
        const isPercent = coupon.type === 'percent';
        const isSelected = selectedCodes.includes(coupon.code);
        
        let discountText = '';
        if (isPercent) {
            discountText = `Giảm ${Number(coupon.value)}%`;
            if (coupon.max_discount_amount) {
                discountText += ` (tối đa ${formatCurrency(coupon.max_discount_amount)})`;
            }
        } else {
            discountText = `Giảm trực tiếp ${formatCurrency(coupon.value)}`;
        }

        let conditionText = coupon.min_order_amount > 0 
            ? `Đơn tối thiểu ${formatCurrency(coupon.min_order_amount)}` 
            : 'Áp dụng mọi đơn hàng';

        return (
            <div key={coupon.id} className="coupon-item-wrap d-flex justify-content-between align-items-center">
                <div>
                    <div className={`fw-bold mb-1 coupon-code-text ${colorTheme === 'course' ? 'text-warning-emphasis' : 'text-primary'}`}>
                        <i className="fa-solid fa-ticket-simple me-2"></i>{coupon.code}
                        {coupon.seller_id === null && <span className="badge bg-danger ms-2" style={{ fontSize: '10px' }}>Toàn Sàn</span>}
                    </div>
                    <div className="fw-semibold mb-1 coupon-desc-text">
                        {discountText}
                    </div>
                    <div className="text-muted coupon-cond-text">
                        {conditionText}
                    </div>
                </div>
                <button 
                    className={`btn btn-sm px-3 fw-bold rounded-pill coupon-btn-use ${colorTheme === 'course' ? 'course-theme' : 'instructor-theme'}`}
                    style={isSelected ? {
                        background: colorTheme === 'course' ? '#D97706' : '#2563EB',
                        color: '#fff'
                    } : {}}
                    onClick={(e) => {
                        e.preventDefault();
                        if (isSelected) {
                            handleRemoveCoupon(coupon.code);
                        } else {
                            handleSelectCoupon(coupon, colorTheme);
                        }
                    }}
                >
                    {isSelected ? 'Đã chọn' : 'Chọn'}
                </button>
            </div>
        );
    };


    return (
        <div className="modal fade" id="couponModal" tabIndex="-1" aria-labelledby="couponModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content coupon-modal-content">
                    <div className="modal-header border-0 pb-0 pt-4 px-4">
                        <h5 className="modal-title fw-bold coupon-modal-title" id="couponModalLabel">
                            <i className="fa-solid fa-tags me-2 text-warning"></i> Chọn mã khuyến mãi
                        </h5>
                        <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body px-4 pb-0">

                        {selectedCodes.filter(code => availableCoupons?.some(c => c.code === code)).length > 0 && (
                            <>
                                <div className="mb-0 p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-bold mb-0" style={{ fontSize: '14px', color: '#1F2937' }}>Mã áp dụng từ mục này:</h6>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {selectedCodes.filter(code => availableCoupons?.some(c => c.code === code)).map((code, idx) => {
                                            const couponInfo = availableCoupons.find(c => c.code === code);
                                            let badgeStyle = { background: '#f8f9fa', color: '#1F2937', border: '1px solid #E5E7EB' };
                                            if (couponInfo) {
                                                if (couponInfo.course_id !== null) {
                                                    badgeStyle = { background: '#fff7ed', color: '#D97706', border: '1px solid #D97706' };
                                                } else if (couponInfo.seller_id !== null) {
                                                    badgeStyle = { background: '#eff6ff', color: '#2563EB', border: '1px solid #2563EB' };
                                                } else {
                                                    badgeStyle = { background: '#fef2f2', color: '#DC2626', border: '1px solid #DC2626' };
                                                }
                                            }

                                            return (
                                                <div key={idx} className="badge rounded-pill d-flex align-items-center gap-2" style={{ ...badgeStyle, padding: '6px 12px', fontSize: '13px', fontWeight: '600' }}>
                                                    <i className="fa-solid fa-ticket"></i>
                                                    {code}
                                                    <i className="fa-solid fa-xmark ms-1" style={{ cursor: 'pointer', fontSize: '14px' }} onClick={() => handleRemoveCoupon(code)} title="Xóa"></i>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <hr className="my-4" style={{ borderTop: '1px dashed #E5E7EB', opacity: 1 }} />
                            </>
                        )}

                        <form onSubmit={handleAddFromInput} className="d-flex gap-2 mb-0 mt-2">
                            <input 
                                className="form-control coupon-input"
                                placeholder="Nhập mã khuyến mãi..." 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button 
                                className="btn text-white fw-bold coupon-btn-apply" 
                                type="submit" 
                                style={{ background: '#1F2937' }}
                            >
                                Thêm mã
                            </button>
                        </form>
                        
                        <hr className="my-4" style={{ borderTop: '1px solid #E5E7EB', opacity: 1 }} />

                        {isLoadingCoupons ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-warning spinner-border-sm me-2" role="status"></div>
                                <span className="text-muted">Đang tải mã giảm giá...</span>
                            </div>
                        ) : availableCoupons?.length > 0 ? (
                            <div className="coupon-lists custom-scrollbar" style={{ overflowY: 'auto' }}>

                                {courseCoupons.length > 0 && (
                                    <div className="mb-0">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center coupon-section-title">
                                            <span className="coupon-section-indicator course"></span>
                                            Ưu đãi riêng của khóa học
                                        </h6>
                                        <div className="card border-0 shadow-sm p-3 coupon-card-course">
                                            {courseCoupons.map((coupon, index) => (
                                                <React.Fragment key={coupon.id}>
                                                    {renderCouponItem(coupon, index === courseCoupons.length - 1, 'course')}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {courseCoupons.length > 0 && instructorCoupons.length > 0 && (
                                    <div className="text-center position-relative my-4">
                                        <hr style={{ borderTop: '1px dashed #CBD5E1', opacity: 1 }} />
                                        <span className="position-absolute top-50 start-50 translate-middle px-3 text-muted" style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', background: '#fff' }}>
                                            HOẶC KẾT HỢP VỚI
                                        </span>
                                    </div>
                                )}


                                {instructorCoupons.length > 0 && (
                                    <div className="mb-2">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center coupon-section-title">
                                            <span className="coupon-section-indicator instructor"></span>
                                            Ưu đãi của giảng viên (Áp dụng toàn bộ khóa học)
                                        </h6>
                                        <div className="card border-0 shadow-sm p-3 coupon-card-instructor">
                                            {instructorCoupons.map((coupon, index) => (
                                                <React.Fragment key={coupon.id}>
                                                    {renderCouponItem(coupon, index === instructorCoupons.length - 1, 'instructor')}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {platformCoupons.length > 0 && (
                                    <div className="mb-2 mt-4">
                                        <h6 className="fw-bold mb-3 d-flex align-items-center coupon-section-title" style={{ color: '#DC2626' }}>
                                            <i className="fa-solid fa-gift me-2"></i>
                                            Ưu đãi hệ thống EduFlow
                                        </h6>
                                        <div className="card border-0 shadow-sm p-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                            {platformCoupons.map((coupon, index) => (
                                                <React.Fragment key={coupon.id}>
                                                    {renderCouponItem(coupon, index === platformCoupons.length - 1, 'platform')}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 coupon-empty-state">
                                <i className="fa-solid fa-ticket text-muted fs-1 mb-3 opacity-50"></i>
                                <p className="text-muted mb-0 fw-medium">Không có mã ưu đãi nào khả dụng lúc này.</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-0 pt-2 px-4 pb-4 mt-2">
                        <button 
                            type="button" 
                            className="btn w-100 fw-bold coupon-btn-apply" 
                            style={{ padding: '12px' }}
                            data-bs-dismiss="modal"
                            onClick={handleSubmit}
                        >
                            Áp dụng các mã đã chọn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

