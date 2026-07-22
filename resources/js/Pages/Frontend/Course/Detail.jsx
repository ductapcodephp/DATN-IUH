import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm } from "@inertiajs/react";
import SweetAlert from '@/Components/SweetAlert';

export default function Detail({ course, relatedCourses, isEnrolled, enrollment, reviews, userReview }) {
    const { data, setData, post, processing } = useForm({
        course_id: course.id,
    });

    const { data: reviewData, setData: setReviewData, post: postReview, processing: processingReview, reset: resetReview, errors: reviewErrors } = useForm({
        rating: 5,
        content: '',
    });

    const submitReview = (e) => {
        e.preventDefault();
        postReview(route('frontend.course.review', course.slug), {
            preserveScroll: true,
            onSuccess: () => resetReview('content')
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        post(route('frontend.cart.add', course.id));
    };

    const totalLessons = course.chapters?.reduce((acc, chapter) => acc + (chapter.lessons?.length || 0), 0) || 0;

    return (
        <>
            <section className="cd-hero bg-dark text-white py-5 position-relative">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 pe-lg-5">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb cd-breadcrumb mb-3 font-sm">
                                    <li className="breadcrumb-item"><Link href={route('frontend.home')} className="text-light opacity-75">Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><Link href={route('frontend.course.index')} className="text-light opacity-75">{course.category?.name || "Khóa học"}</Link></li>
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
                                <div><i className="fa-solid fa-users me-2"></i> 0 học viên</div>
                                <div><i className="fa-solid fa-globe me-2"></i> Tiếng Việt</div>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <img src={course.seller?.avatar || "/assets/frontend/img/default-avatar-small.jpg"} alt="Instructor" className="rounded-circle" width="48" height="48" />
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
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link fw-semibold" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews-pane" type="button" role="tab">Đánh giá</button>
                                </li>
                            </ul>

                            <div className="tab-content" id="courseTabsContent">
                                
                                <div className="tab-pane fade show active" id="content-pane" role="tabpanel">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="fw-bold mb-0">Lộ trình học tập</h4>
                                        <span className="text-muted font-sm">{course.chapters?.length || 0} chương • {totalLessons} bài học</span>
                                    </div>
                                    
                                    <div className="accordion cd-accordion" id="curriculumAccordion">
                                        
                                        {course.chapters?.length > 0 ? course.chapters.map((chapter, index) => {
                                            const [isOpen, setIsOpen] = useState(index === 0);
                                            return (
                                                <div className="accordion-item" key={chapter.id}>
                                                    <h2 className="accordion-header">
                                                        <button 
                                                            className={`accordion-button fw-bold ${!isOpen ? 'collapsed' : ''}`} 
                                                            type="button" 
                                                            onClick={() => setIsOpen(!isOpen)}
                                                            aria-expanded={isOpen ? "true" : "false"}
                                                        >
                                                            {chapter.title}
                                                        </button>
                                                    </h2>
                                                    {isOpen && (
                                                        <div className="accordion-collapse">
                                                            <div className="accordion-body p-0">
                                                                <div className="list-group list-group-flush">
                                                                    {chapter.lessons && chapter.lessons.length > 0 ? chapter.lessons.map((lesson) => (
                                                                        <div className="list-group-item d-flex align-items-center justify-content-between p-3 text-muted bg-surface-alt" key={lesson.id}>
                                                                            <div className="d-flex align-items-center gap-3">
                                                                                {lesson.type === 'video' ? (
                                                                                    <i className="fa-solid fa-circle-play text-accent"></i>
                                                                                ) : (
                                                                                    <i className="fa-solid fa-lock opacity-50"></i>
                                                                                )}
                                                                                <span className={lesson.type === 'video' ? 'fw-medium text-dark' : ''}>{lesson.title}</span>
                                                                            </div>
                                                                            {lesson.type === 'video' && (
                                                                                <div className="d-flex align-items-center gap-3 font-sm">
                                                                                    {lesson.is_preview && <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Học thử free</span>}
                                                                                    <span className="text-muted">Video</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )) : (
                                                                        <div className="p-3 text-muted font-sm">Chưa có bài học nào trong chương này.</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }) : (
                                            <div className="text-muted">Chưa có dữ liệu lộ trình học tập.</div>
                                        )}

                                    </div>
                                </div>

                                <div className="tab-pane fade" id="desc-pane" role="tabpanel">
                                    <h4 className="fw-bold mb-3">Mô tả khóa học</h4>
                                    <div className="rich-text-content text-muted lh-lg mb-5" dangerouslySetInnerHTML={{ __html: course.description }}></div>

                                    <h4 className="fw-bold mb-4" id="instructor">Giảng viên của bạn</h4>
                                    <div className="d-flex flex-column flex-md-row gap-4 align-items-start border rounded-3 p-4 bg-white">
                                        <img src={course.seller?.avatar || "/assets/frontend/img/default-avatar.jpg"} alt={course.seller?.name} className="rounded-circle" width="120" height="120" />
                                        <div>
                                            <h5 className="fw-bold text-main mb-1">{course.seller?.name}</h5>
                                            <p className="text-accent font-sm fw-semibold mb-3">{course.seller?.current_role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade" id="reviews-pane" role="tabpanel">
                                    <h4 className="fw-bold mb-4">Đánh giá từ học viên</h4>
                                    
                                    <div className="row align-items-center mb-5">
                                        <div className="col-md-3 text-center mb-4 mb-md-0">
                                            <div className="display-3 fw-bold text-main">{Number(course.reviews_avg_rating || 0).toFixed(1)}</div>
                                            <div className="text-yellow fs-5 mb-1">
                                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                                            </div>
                                            <div className="text-muted font-sm">Đánh giá trung bình</div>
                                        </div>
                                    </div>

                                    <div className="bg-surface border rounded-3 p-4 mb-5">
                                        <h6 className="fw-bold mb-2">Để lại đánh giá của bạn</h6>
                                        {!isEnrolled ? (
                                            <div className="alert alert-warning mb-0 border-0 font-sm">
                                                <i className="fa-solid fa-circle-info me-2"></i> Bạn cần tham gia khóa học để có thể gửi đánh giá.
                                            </div>
                                        ) : enrollment?.progress < 80 ? (
                                            <div className="alert alert-warning mb-0 border-0 font-sm">
                                                <i className="fa-solid fa-circle-info me-2"></i> Bạn cần hoàn thành ít nhất <b>80% khóa học</b> để có thể gửi đánh giá. (Tiến độ hiện tại: {Number(enrollment.progress || 0).toFixed(0)}%)
                                            </div>
                                        ) : userReview ? (
                                            <div className="alert alert-success mb-0 border-0 font-sm">
                                                <i className="fa-solid fa-check-circle me-2"></i> Bạn đã đánh giá khóa học này. Cảm ơn phản hồi của bạn!
                                            </div>
                                        ) : (
                                            <form onSubmit={submitReview}>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Đánh giá sao</label>
                                                    <div className="d-flex gap-2">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <i key={star} 
                                                                className={`fa-solid fa-star fs-4 ${reviewData.rating >= star ? 'text-warning' : 'text-muted'}`} 
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => setReviewData('rating', star)}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    {reviewErrors.rating && <div className="text-danger mt-1 font-sm">{reviewErrors.rating}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Nội dung đánh giá</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        rows="3" 
                                                        placeholder="Chia sẻ cảm nhận của bạn về khóa học..."
                                                        value={reviewData.content}
                                                        onChange={e => setReviewData('content', e.target.value)}
                                                    ></textarea>
                                                    {reviewErrors.content && <div className="text-danger mt-1 font-sm">{reviewErrors.content}</div>}
                                                </div>
                                                <button type="submit" className="btn btn-fire" disabled={processingReview}>
                                                    {processingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    <div className="reviews-list custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '15px' }}>
                                        {reviews && reviews.length > 0 ? reviews.map(review => (
                                            <div key={review.id} className="review-item d-flex gap-3 mb-4 pb-4 border-bottom">
                                                <img src={review.user?.avatar || "/assets/frontend/img/default-avatar.jpg"} alt={review.user?.name} className="rounded-circle object-fit-cover" width="48" height="48" />
                                                <div>
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <h6 className="fw-bold mb-0">{review.user?.name}</h6>
                                                        <span className="text-muted font-sm ms-2">
                                                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <div className="text-warning mb-2 font-sm">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-muted opacity-50'}`}></i>
                                                        ))}
                                                    </div>
                                                    {review.content && <p className="mb-0 text-dark">{review.content}</p>}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-muted text-center py-4">Chưa có đánh giá nào.</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="cd-floating-card bg-white rounded-3 shadow-lg border overflow-hidden sticky-top">
                                <div className="cd-preview-box position-relative bg-dark" style={{ cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#previewModal">
                                    <img src={course.thumbnail || "/assets/frontend/img/blog-react-usememo.jpg"} alt="Cover" className="w-100 opacity-75" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                                    <div className="play-icon-overlay position-absolute top-50 start-50 translate-middle">
                                        <i className="fa-solid fa-circle-play text-white fs-1 shadow-sm"></i>
                                    </div>
                                    <div className="position-absolute bottom-0 w-100 text-center text-white pb-2 fw-semibold text-shadow">Xem video giới thiệu</div>
                                </div>

                                <div className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="fs-2 fw-bold text-fire">{course.is_free ? 'Miễn phí' : formatCurrency(course.price)}</span>
                                        {Number(course.original_price) > Number(course.price) && (
                                            <span className="text-muted text-decoration-line-through fs-5">{formatCurrency(course.original_price)}</span>
                                        )}
                                    </div>

                                    <div className="d-flex flex-column gap-2 mb-4">
                                        {isEnrolled ? (
                                            <Link href={route('frontend.course.learn', course.slug)} className="btn btn-success py-3 fw-bold fs-5 w-100 mb-2">
                                                <i className="fa-solid fa-circle-play me-2"></i> Vào học ngay
                                            </Link>
                                        ) : course.is_free ? (
                                            <Link href={route('frontend.course.enroll-free', course.slug)} method="post" as="button" type="button" className="btn btn-primary py-3 fw-bold fs-5 w-100 mb-2">
                                                <i className="fa-solid fa-unlock me-2"></i> Mở khóa miễn phí
                                            </Link>
                                        ) : (
                                            <form onSubmit={handleAddToCart}>
                                                <input type="hidden" name="course_id" value={course.id} />
                                                <button type="submit" className="btn btn-fire py-3 fw-bold fs-5 w-100 mb-2">Mua ngay</button>
                                                <button type="button" onClick={handleAddToCart} className="btn btn-outline-dark py-3 fw-semibold w-100" disabled={processing}>Thêm vào giỏ hàng</button>
                                            </form>
                                        )}
                                    </div>

                                    <ul className="list-unstyled text-muted font-sm mb-0 d-flex flex-column gap-2">
                                        <li><i className="fa-solid fa-clock text-dark w-20px"></i> Truy cập trọn đời</li>
                                        <li><i className="fa-solid fa-mobile-screen text-dark w-20px"></i> Học trên mọi thiết bị</li>
                                        <li><i className="fa-solid fa-certificate text-dark w-20px"></i> Cấp chứng chỉ hoàn thành</li>
                                        <li><i className="fa-solid fa-rotate-left text-dark w-20px"></i> Hoàn tiền trong 30 ngày</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {relatedCourses && relatedCourses.length > 0 && (
                <section className="cd-related py-5 bg-light">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <h3 className="fw-bold mb-1">Khóa học liên quan</h3>
                                <p className="text-muted mb-0">Các khóa học cùng chủ đề được học viên quan tâm nhiều nhất</p>
                            </div>
                            <Link href={route('frontend.course.index', { category: [course.category?.slug] })} className="btn btn-outline-dark fw-semibold">
                                Xem thêm
                            </Link>
                        </div>
                        <div className="row g-4">
                            {relatedCourses.map((rcourse) => (
                                <div className="col-12 col-md-6 col-lg-3" key={rcourse.id}>
                                    <div className="course-card position-relative bg-white h-100">
                                        <Link href={route('frontend.course.detail', { slug: rcourse.slug })} className="text-decoration-none text-dark d-flex flex-column h-100">
                                            <img src={rcourse.thumbnail ? `/storage/${rcourse.thumbnail}` : '/assets/frontend/img/no-thumbnail.png'} alt={rcourse.title} className="course-thumb w-100" style={{ height: '180px', objectFit: 'cover' }} loading="lazy" />
                                            <div className="course-body flex-grow-1 p-3">
                                                <span className="course-cat text-accent fw-semibold font-sm">{rcourse.category?.name}</span>
                                                <h4 className="course-title fs-6 fw-bold mt-2 mb-3 line-clamp-2">{rcourse.title}</h4>
                                                <div className="course-meta d-flex justify-content-between text-muted font-sm mb-3">
                                                    <span className="course-rating">
                                                        <i className="fa-solid fa-star text-warning"></i> {Number(rcourse.reviews_avg_rating || 0).toFixed(1)}
                                                    </span>
                                                    <span><i className="fa-solid fa-users"></i> {rcourse.students_count || 0} lượt mua</span>
                                                </div>
                                            </div>
                                            <div className="course-footer p-3 border-top mt-auto d-flex flex-wrap align-items-baseline gap-2">
                                                <span className="price-new fw-bold text-fire fs-5">{formatCurrency(rcourse.price)}</span>
                                                {Number(rcourse.original_price) > Number(rcourse.price) && (
                                                    <span className="price-old text-muted text-decoration-line-through font-sm">{formatCurrency(rcourse.original_price)}</span>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="modal fade" id="previewModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark border-0">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title text-white fw-semibold">Xem trước khóa học</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="ratio ratio-16x9 mt-3">
                                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Detail.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);
