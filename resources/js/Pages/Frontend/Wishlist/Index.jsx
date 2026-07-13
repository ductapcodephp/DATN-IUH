import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function Index({ wishlistCourses }) {
    const { auth } = usePage().props;

    const formatPrice = (price) => {
        if (!price || price == 0) return "Miễn phí";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <FrontendLayout>
            <div className="page-header py-4 bg-surface border-bottom">
                <div className="container">
                    <h1 className="fs-3 fw-bold mb-2">Khóa học yêu thích</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 font-sm">
                            <li className="breadcrumb-item"><Link href={route('frontend.home')} className="text-muted">Trang chủ</Link></li>
                            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Mục yêu thích</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="py-5">
                <div className="container">
                    
                    <div className="row g-4">
                        <div className="col-lg-12">
                            <div className="d-flex align-items-center mb-4">
                                <h4 className="fw-bold mb-0">Bạn đã lưu {wishlistCourses?.length || 0} khóa học</h4>
                            </div>

                            <div className="row g-4">
                                {wishlistCourses && wishlistCourses.length > 0 ? wishlistCourses.map((course) => {
                                    // Because this is the wishlist page, all items here are wishlisted by definition
                                    // but we still check the array to be safe in case it's toggled off but not refreshed
                                    const isWishlisted = (auth?.wishlisted_course_ids || []).includes(course.id);
                                    
                                    return (
                                        <div className="col-12 col-md-6 col-xl-3" key={course.id}>
                                            <div className="course-card position-relative h-100 d-flex flex-column">
                                                <button 
                                                    className="btn btn-light rounded-circle position-absolute border shadow-sm wishlist-btn" 
                                                    style={{ top: '10px', right: '10px', width: '35px', height: '35px', padding: '0', zIndex: 10 }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.post(route('frontend.wishlist.toggle'), { course_id: course.id }, { preserveScroll: true });
                                                    }}
                                                >
                                                    <i className={`fa-heart text-danger ${isWishlisted ? 'fa-solid' : 'fa-regular'}`}></i>
                                                </button>
                                                
                                                <Link href={route('frontend.course.detail', { slug: course.slug })} className="text-decoration-none text-dark d-flex flex-column h-100">
                                                    <img src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/frontend/img/no-thumbnail.png'} alt={course.title} className="course-thumb" loading="lazy" />
                                                    
                                                    <div className="course-body flex-grow-1">
                                                        <span className="course-cat">{course.category?.name}</span>
                                                        <h3 className="course-title">{course.title}</h3>
                                                        <div className="course-meta">
                                                            <span className="course-rating">
                                                                <i className="fa-solid fa-star text-warning"></i> {Number(course.reviews_avg_rating || 0).toFixed(1)}
                                                            </span>
                                                            <span><i className="fa-solid fa-users"></i> {course.students_count || 0}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="course-footer mt-auto">
                                                        <span className="price-new">{formatPrice(course.price)}</span>
                                                        {course.original_price > course.price && (
                                                            <span className="price-old">{formatPrice(course.original_price)}</span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-12 text-center py-5 bg-light rounded border">
                                        <div className="mb-4">
                                            <i className="fa-regular fa-heart text-muted" style={{ fontSize: '4rem' }}></i>
                                        </div>
                                        <h5 className="fw-bold mb-3">Chưa có khóa học nào</h5>
                                        <p className="text-muted mb-4">Bạn chưa lưu khóa học nào vào danh sách yêu thích.</p>
                                        <Link href={route('frontend.course.index')} className="btn btn-fire px-4 py-2 fw-semibold">
                                            Khám phá khóa học ngay
                                        </Link>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </FrontendLayout>
    );
}
