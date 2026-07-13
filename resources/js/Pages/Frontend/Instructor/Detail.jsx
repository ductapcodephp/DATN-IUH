import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link } from "@inertiajs/react";

export default function Detail({ instructor }) {
    const formatPrice = (price) => {
        if (!price || price == 0) return "Miễn phí";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <FrontendLayout>
            <header className="profile-header-section">
                <div className="container">
                <div className="row align-items-center g-4">
                    
                    <div className="col-lg-7 d-flex flex-column flex-md-row gap-4 text-center text-md-start align-items-center">
                    <img src={instructor.avatar || '/images/default-avatar.png'} className="profile-avatar-big shadow" alt={instructor.name} />
                    <div>
                        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start align-items-center mb-2">
                        <h2 className="fw-bold mb-0">{instructor.name}</h2>
                        </div>
                        <p className="text-info fw-medium mb-2 fs-5">{instructor.bio || "Giảng viên"}</p>
                        <p className="text-white-50 font-sm mb-3 lh-base" style={{maxWidth: '500px'}}>
                            {/* Short bio if available */}
                            {instructor.bio || "Giảng viên chưa cập nhật thông tin giới thiệu."}
                        </p>
                    </div>
                    </div>

                    <div className="col-lg-5">
                    <div className="row g-3">
                        <div className="col-6">
                        <div className="profile-stat-box">
                            <div className="profile-stat-num">{instructor.total_students || 0}</div>
                            <div className="profile-stat-lbl">Tổng Học Viên</div>
                        </div>
                        </div>
                        <div className="col-6">
                        <div className="profile-stat-box">
                            <div className="profile-stat-num">{Number(instructor.rating || 0).toFixed(1)} <i className="fa-solid fa-star fs-6 text-warning"></i></div>
                            <div className="profile-stat-lbl">Đánh Giá</div>
                        </div>
                        </div>
                        <div className="col-6">
                        <div className="profile-stat-box">
                            <div className="profile-stat-num">{instructor.courses_count || 0}</div>
                            <div className="profile-stat-lbl">Khóa Học Đang Bán</div>
                        </div>
                        </div>
                    </div>
                    </div>

                </div>
                </div>
            </header>

            <main className="py-4 bg-light">
                <div className="container">
                <div className="row g-4">
                    
                    <div className="col-lg-10 mx-auto">
                    
                    <ul className="nav nav-tabs profile-nav-tabs border-bottom bg-white rounded-3 px-3 shadow-sm mb-4" id="profileTabs" role="tablist">
                        <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-courses" type="button"><i className="fa-solid fa-book-open me-2"></i>Khóa học của tôi ({instructor.courses_count || 0})</button>
                        </li>
                    </ul>

                    <div className="tab-content" id="profileTabsContent">
                        
                        <div className="tab-pane fade show active" id="tab-courses">
                        <div className="row g-4">
                            
                            {instructor.authored_courses?.map((course) => (
                                <div className="col-md-4 col-sm-6" key={course.id}>
                                <div className="course-card-pro">
                                    <div className="course-thumb-wrap">
                                    <img src={course.thumbnail || '/images/course-default.jpg'} alt={course.title} />
                                    </div>
                                    <div className="course-card-body">
                                    <span className="text-info font-sm fw-bold text-uppercase mb-1">{course.category?.name || 'Khóa học'}</span>
                                    <h5 className="course-card-title"><Link href={route('frontend.course.detail', course.slug)} className="text-dark text-decoration-none">{course.title}</Link></h5>
                                    <div className="font-sm text-muted mb-3">
                                        <i className="fa-solid fa-star text-warning me-1"></i><strong>{Number(course.reviews_avg_rating || 0).toFixed(1)}</strong> ({course.students_count || 0} học viên)
                                    </div>
                                    <div className="course-price-row">
                                        <div>
                                        <span className="price-current">{formatPrice(course.price)}</span>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            ))}

                            {(!instructor.authored_courses || instructor.authored_courses.length === 0) && (
                                <div className="text-gray-500 text-center py-5">
                                    Giảng viên này chưa có khóa học nào được xuất bản.
                                </div>
                            )}
                            
                        </div>
                        </div>

                    </div>
                    </div>
                </div>
                </div>
            </main>
        </FrontendLayout>
    );
}
