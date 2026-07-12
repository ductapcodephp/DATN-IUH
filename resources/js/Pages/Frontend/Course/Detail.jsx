import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Detail({ course }) {
    const { data, setData, post, processing } = useForm({
        course_id: course.id,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        post(route('frontend.cart.add'));
    };

    return (
        <>
            <section className="cd-hero bg-dark text-white py-5 position-relative">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 pe-lg-5">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb cd-breadcrumb mb-3 font-sm">
                                    <li className="breadcrumb-item"><Link href="/" className="text-light opacity-75">Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><Link href="#" className="text-light opacity-75">Khóa học</Link></li>
                                    <li className="breadcrumb-item active text-white fw-semibold" aria-current="page">{course.title}</li>
                                </ol>
                            </nav>

                            <h1 className="cd-title fw-bold mb-3">{course.title}</h1>
                            <p className="cd-desc fs-5 opacity-75 mb-4">{course.description}</p>

                            <div className="d-flex flex-wrap align-items-center gap-4 font-sm mb-4">
                                <div className="cd-rating text-yellow fw-bold">
                                    <span className="fs-5 me-1">{Number(course.reviews_avg_rating || 0).toFixed(1)}</span>
                                    <i className="fa-solid fa-star"></i>
                                    <a href="#reviews" className="text-light opacity-75 fw-normal text-decoration-underline ms-2">({course.reviews_count} đánh giá)</a>
                                </div>
                                <div><i className="fa-solid fa-globe me-2"></i> Tiếng Việt</div>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <img src={course.seller?.avatar || "https://i.pravatar.cc/100"} alt="Instructor" className="rounded-circle" width="48" height="48" />
                                <div>
                                    <div className="font-sm opacity-75">Giảng viên</div>
                                    <a href="#instructor" className="text-white fw-bold text-decoration-none">{course.seller?.name || "Giảng viên ẩn danh"}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cd-main py-5">
                <div className="container position-relative">
                    <div className="row">
                        <div className="col-lg-8 pe-lg-5 mb-5 mb-lg-0">
                            <ul className="nav nav-tabs cd-tabs mb-4" id="courseTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active fw-semibold" id="content-tab" data-bs-toggle="tab" data-bs-target="#content-pane" type="button" role="tab">Nội dung khóa học</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link fw-semibold" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc-pane" type="button" role="tab">Giới thiệu</button>
                                </li>
                            </ul>

                            <div className="tab-content" id="courseTabsContent">
                                <div className="tab-pane fade show active" id="content-pane" role="tabpanel">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="fw-bold mb-0">Lộ trình học tập</h4>
                                        <span className="text-muted font-sm">{course.chapters?.length || 0} chương</span>
                                    </div>

                                    <div className="accordion cd-accordion" id="curriculumAccordion">
                                        {course.chapters?.map((chapter, index) => (
                                            <div className="accordion-item" key={chapter.id}>
                                                <h2 className="accordion-header">
                                                    <button className={`accordion-button fw-bold ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${chapter.id}`} aria-expanded={index === 0 ? "true" : "false"}>
                                                        {chapter.title}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${chapter.id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#curriculumAccordion">
                                                    <div className="accordion-body p-0">
                                                        <div className="list-group list-group-flush">
                                                            {chapter.lessons?.map((lesson) => (
                                                                <div className="list-group-item d-flex align-items-center justify-content-between p-3 text-muted bg-surface-alt" key={lesson.id}>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <i className="fa-solid fa-lock opacity-50"></i>
                                                                        <span>{lesson.title}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="tab-pane fade" id="desc-pane" role="tabpanel">
                                    <h4 className="fw-bold mb-3">Mô tả khóa học</h4>
                                    <div className="rich-text-content text-muted lh-lg mb-5" dangerouslySetInnerHTML={{ __html: course.description }}></div>

                                    <h4 className="fw-bold mb-4" id="instructor">Giảng viên của bạn</h4>
                                    <div className="d-flex flex-column flex-md-row gap-4 align-items-start border rounded-3 p-4 bg-white">
                                        <img src={course.seller?.avatar || "https://i.pravatar.cc/150"} alt={course.seller?.name} className="rounded-circle" width="120" height="120" />
                                        <div>
                                            <h5 className="fw-bold text-main mb-1">{course.seller?.name}</h5>
                                            <p className="text-accent font-sm fw-semibold mb-3">{course.seller?.current_role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="cd-floating-card bg-white rounded-3 shadow-lg border overflow-hidden sticky-top">
                                <div className="cd-preview-box position-relative bg-dark" style={{ cursor: 'pointer' }}>
                                    <img src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600"} alt="Cover" className="w-100 opacity-75" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                                    <div className="play-icon-overlay position-absolute top-50 start-50 translate-middle">
                                        <i className="fa-solid fa-circle-play text-white fs-1 shadow-sm"></i>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="fs-2 fw-bold text-fire">{formatCurrency(course.price)}</span>
                                        {course.original_price > course.price && (
                                            <span className="text-muted text-decoration-line-through fs-5">{formatCurrency(course.original_price)}</span>
                                        )}
                                    </div>

                                    <div className="d-flex flex-column gap-2 mb-4">
                                        <form onSubmit={handleAddToCart}>
                                            <input type="hidden" name="course_id" value={course.id} />
                                            <button type="submit" className="btn btn-fire py-3 fw-bold fs-5 w-100 mb-2">Mua ngay</button>
                                            <button type="button" onClick={handleAddToCart} className="btn btn-outline-dark py-3 fw-semibold w-100" disabled={processing}>Thêm vào giỏ hàng</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Detail.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);
