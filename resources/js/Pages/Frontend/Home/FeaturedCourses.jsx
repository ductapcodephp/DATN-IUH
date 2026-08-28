import React from "react";
import { Link, usePage } from "@inertiajs/react";
import MagicCard from "@/Components/MagicUI/MagicCard";

export default function FeaturedCourses({ block, editable, courses = [], enrolledCourseIds = [] }) {
    const { auth } = usePage().props;
    const wishlistedIds = auth?.wishlisted_course_ids || [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const isMock = editable;

    const mockCourses = [
        {
            id: 1, title: 'Khóa học React JS Cơ bản (Mẫu)', slug: '#', price: 500000, original_price: 1000000, 
            category: { name: 'Lập trình Web' }, students_count: 1500, reviews_avg_rating: 4.8,
            thumbnail: null, instructor: { name: 'Giảng viên Mẫu' }
        },
        {
            id: 2, title: 'Làm chủ Laravel 11 (Mẫu)', slug: '#', price: 0, original_price: 0, 
            category: { name: 'Backend' }, students_count: 3200, reviews_avg_rating: 5.0,
            thumbnail: null, instructor: { name: 'Giảng viên Mẫu' }
        },
        {
            id: 3, title: 'Master Node.js (Mẫu)', slug: '#', price: 800000, original_price: 1200000, 
            category: { name: 'Backend' }, students_count: 800, reviews_avg_rating: 4.5,
            thumbnail: null, instructor: { name: 'Giảng viên Mẫu' }
        },
        {
            id: 4, title: 'UI/UX Design (Mẫu)', slug: '#', price: 1200000, original_price: 1500000, 
            category: { name: 'Design' }, students_count: 500, reviews_avg_rating: 4.9,
            thumbnail: null, instructor: { name: 'Giảng viên Mẫu' }
        }
    ];

    const displayCourses = isMock ? mockCourses : (courses || []);

    return (
        <section id="sponsored-courses" className="py-5 bg-surface">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="section-title mb-1 d-flex align-items-center gap-2">
                            <i className={block?.icon || "fa-solid fa-crown text-warning"}></i>
                            {block?.title || 'Khóa Học Nổi Bật'}
                        </h2>
                        <p className="text-muted mb-0">
                            {block?.sub_title || 'Các khóa học chất lượng cao được đề xuất bởi EduFlow.'}
                        </p>
                    </div>
                </div>

                {displayCourses.length > 0 ? (
                    <div className="row g-4">
                        {displayCourses.map((course) => {
                            const isWishlisted = wishlistedIds.includes(course.id);
                            
                            return (
                                <div className="col-12 col-md-6 col-lg-3" key={course.id}>
                                    <MagicCard
                                        className="h-100"
                                        gradientColor="rgba(234, 88, 12, 0.12)"
                                        borderColor="rgba(234, 88, 12, 0.35)"
                                    >
                                        <div className="course-card course-sponsored position-relative border-0 shadow-none">
                                            <button 
                                                className="btn btn-light rounded-circle position-absolute border shadow-sm wishlist-btn" 
                                                style={{ top: '10px', left: '10px', width: '35px', height: '35px', padding: '0', zIndex: 10 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                title={isWishlisted ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
                                            >
                                                <i className={`fa-heart ${isWishlisted ? 'fa-solid text-danger' : 'fa-regular text-muted'}`}></i>
                                            </button>
                                            
                                            <Link 
                                                href={course.ad_id ? route('frontend.ads.click', course.ad_id) : route('frontend.course.detail', course.slug || '#')} 
                                                className="text-decoration-none text-dark d-block"
                                            >
                                                {course.ad_id && <div className="badge-sponsored">Tài trợ</div>}
                                                <img 
                                                    src={course.thumbnail ? (course.thumbnail.startsWith('http') || course.thumbnail.startsWith('/') ? course.thumbnail : `/storage/${course.thumbnail}`) : '/assets/frontend/img/default-course.png'} 
                                                    alt={course.title} 
                                                    className="course-thumb" 
                                                    loading="lazy" 
                                                    onError={(e) => { e.target.src = "/assets/frontend/img/default-course.png"; }}
                                                />
                                                <div className="course-body">
                                                    <span className="course-cat text-primary">
                                                        {course.category?.name || 'Chưa phân loại'}
                                                    </span>
                                                    <h3 className="course-title">{course.title}</h3>
                                                    <div className="instructor-wrap mt-2 mb-3">
                                                        <img 
                                                            src={course.seller?.avatar ? (course.seller.avatar.startsWith('http') || course.seller.avatar.startsWith('/') ? course.seller.avatar : `/storage/${course.seller.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(course.seller?.name || 'U')}&background=random`} 
                                                            alt={course.seller?.name} 
                                                        />
                                                        <span className="text-muted font-sm text-truncate">
                                                            {course.seller?.name || 'Chưa cập nhật'}
                                                        </span>
                                                    </div>
                                                    <div className="course-meta">
                                                        <span className="course-rating">
                                                            <i className="fa-solid fa-star"></i> {Number(course.reviews_avg_rating || 5).toFixed(1)} 
                                                            <span className="text-muted fw-normal"> ({course.students_count || 0})</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="course-footer">
                                                    <span className="price-new">{formatCurrency(course.price)}</span>
                                                    {course.original_price && course.original_price > course.price && (
                                                        <span className="price-old">{formatCurrency(course.original_price)}</span>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    </MagicCard>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded shadow-sm border">
                        <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">Chưa có khóa học nổi bật nào.</h5>
                    </div>
                )}
            </div>
        </section>
    );
}
