import React from "react";
import { Link, router, usePage } from "@inertiajs/react";

// Hứng biến courses (gán mặc định là mảng rỗng [] để không bị lỗi nếu không có data)
export default function FeaturedCourses({ courses = [] }) {
    const { auth } = usePage().props;
    const wishlistedIds = auth?.wishlisted_course_ids || [];
    
    // Hàm tiện ích format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <section id="vip-courses" className="py-5 bg-surface">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="section-title mb-1 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-crown text-warning"></i>
                            Khóa Học Nổi Bật
                        </h2>
                        <p className="text-muted mb-0">
                            Các khóa học chất lượng cao được đề xuất bởi EduFlow.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {courses.length > 0 ? (
                        courses.map((course) => {
                            const isWishlisted = wishlistedIds.includes(course.id);
                            
                            return (
                                <div className="col-12 col-md-6 col-lg-3" key={course.id}>
                                    <div className="course-card course-vip position-relative">
                                        <button 
                                            className="btn btn-light rounded-circle position-absolute border shadow-sm wishlist-btn" 
                                            style={{ top: '10px', left: '10px', width: '35px', height: '35px', padding: '0', zIndex: 10 }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.post(route('frontend.wishlist.toggle'), { course_id: course.id }, { preserveScroll: true });
                                            }}
                                        >
                                            <i className={`fa-heart text-danger ${isWishlisted ? 'fa-solid' : 'fa-regular'}`}></i>
                                        </button>
                                    <Link
                                        href={route('frontend.course.detail', { slug: course.slug })} 
                                        className="text-decoration-none text-dark d-block h-100"
                                    >
                                    <div className="badge-sponsored">Tài trợ</div>

                                    <img
                                        src={course.thumbnail || "/images/default-course.jpg"} 
                                        alt={course.title}
                                        className="course-thumb"
                                        loading="lazy"
                                    />

                                    <div className="course-body">
                                        <span className="course-cat">
                                            {course.category?.name || "Danh mục"}
                                        </span>

                                        <h3 className="course-title" title={course.title}>
                                            {course.title}
                                        </h3>

                                        <div className="instructor-wrap mt-2 mb-3">
                                            <img
                                                src={course.seller?.avatar || "/assets/frontend/img/default-avatar.jpg"}
                                                alt={course.seller?.name || "Instructor"}
                                            />
                                            <span className="text-muted font-sm text-truncate">
                                                {course.seller?.name || "Giảng viên ẩn danh"}
                                            </span>
                                        </div>

                                        <div className="course-meta">
                                            <span className="course-rating">
                                                <i className="fa-solid fa-star"></i>
                                                5.0 
                                            </span>
                                        </div>
                                    </div>

                                    <div className="course-footer">
                                        <span className="price-new">
                                            {formatCurrency(course.price)}
                                        </span>
                                        
                                        {course.original_price > course.price && (
                                            <span className="price-old">
                                                {formatCurrency(course.original_price)}
                                            </span>
                                        )}
                                    </div>
                                    </Link>
                                </div>
                            </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center text-muted">
                            <p>Hiện chưa có khóa học VIP nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}