import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import InlineEditable from '@/Components/CMS/InlineEditable';
import IconPicker from '@/Components/CMS/IconPicker';
import axios from 'axios';
import { usePage, Link } from '@inertiajs/react';

function FeaturedCoursesPreview({ block, onChange }) {
    const { extraData, auth } = usePage().props;
    const courses = extraData?.courses || [];
    const enrolledCourseIds = extraData?.enrolledCourseIds || [];
    const wishlistedIds = auth?.wishlisted_course_ids || [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <section id="vip-courses" className="py-5 bg-surface" style={{ pointerEvents: 'auto' }}>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="section-title mb-1 d-flex align-items-center gap-2">
                            <IconPicker 
                                icon={block?.icon || "fa-solid fa-crown text-warning"} 
                                editable={true}
                                onChange={(val) => {
                                    if (block?.id) {
                                        axios.post(route('cms.block.updateProperty', block.id), { property: 'icon', value: val });
                                    }
                                }} 
                            />
                            <InlineEditable 
                                block={block} 
                                property="title" 
                                value={block?.title || 'Khóa Học Nổi Bật'}
                                as="span"
                            />
                        </h2>
                        <InlineEditable 
                            block={block} 
                            property="sub_title" 
                            value={block?.sub_title || 'Các khóa học chất lượng cao được đề xuất bởi EduFlow.'}
                            as="p"
                            className="text-muted mb-0"
                        />
                    </div>
                </div>

                <div className="row g-4 pointer-events-none">
                    {courses.length > 0 ? (
                        courses.map((course) => {
                            const isWishlisted = wishlistedIds.includes(course.id);
                            
                            return (
                                <div className="col-12 col-md-6 col-lg-3" key={course.id}>
                                    <div className="course-card course-vip position-relative">
                                        <button 
                                            className="btn btn-light rounded-circle position-absolute border shadow-sm wishlist-btn" 
                                            style={{ top: '10px', left: '10px', width: '35px', height: '35px', padding: '0', zIndex: 10 }}
                                            onClick={(e) => { e.preventDefault(); }}
                                        >
                                            <i className={`fa-heart ${isWishlisted ? 'fa-solid text-danger' : 'fa-regular text-muted'}`}></i>
                                        </button>
                                        
                                        <div className="text-decoration-none text-dark d-block">
                                            <div className="badge-sponsored">Tài trợ</div>
                                            <img 
                                                src={course.thumbnail ? (course.thumbnail.startsWith('/') || course.thumbnail.startsWith('http') ? course.thumbnail : `/storage/${course.thumbnail}`) : 'https://placehold.co/600x400/png'} 
                                                alt={course.title} 
                                                className="course-thumb" 
                                                loading="lazy" 
                                            />
                                            <div className="course-body">
                                                <span className="course-cat text-primary">
                                                    {course.category?.name || 'Chưa phân loại'}
                                                </span>
                                                <h3 className="course-title">{course.title}</h3>
                                                <div className="instructor-wrap mt-2 mb-3">
                                                    <img 
                                                        src={course.instructor?.avatar ? `/storage/${course.instructor.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'U')}&background=random`} 
                                                        alt={course.instructor?.name} 
                                                    />
                                                    <span className="text-muted font-sm text-truncate">
                                                        {course.instructor?.name || 'Chưa cập nhật'}
                                                    </span>
                                                </div>
                                                <div className="course-meta">
                                                    <span className="course-rating">
                                                        <i className="fa-solid fa-star"></i> 4.9 
                                                        <span className="text-muted fw-normal"> (1.2k)</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="course-footer">
                                                <span className="price-new">{formatCurrency(course.price)}</span>
                                                {course.original_price && course.original_price > course.price && (
                                                    <span className="price-old">{formatCurrency(course.original_price)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <>
                            <div className="col-12 col-md-6 col-lg-3">
                                <a href="#" className="course-card course-vip">
                                    <div className="badge-sponsored">Tài trợ</div>
                                    <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80" alt="ReactJS" className="course-thumb" loading="lazy" />
                                    <div className="course-body">
                                        <span className="course-cat">Frontend</span>
                                        <h3 className="course-title">ReactJS Thực Chiến: Master React trong 30 ngày</h3>
                                        <div className="instructor-wrap mt-2 mb-3">
                                            <img src="https://i.pravatar.cc/150?img=68" alt="Instructor" />
                                            <span className="text-muted font-sm text-truncate">Nguyễn Văn A - Senior Dev</span>
                                        </div>
                                        <div className="course-meta">
                                            <span className="course-rating"><i className="fa-solid fa-star"></i> 4.9 <span className="text-muted fw-normal">(1.2k)</span></span>
                                        </div>
                                    </div>
                                    <div className="course-footer">
                                        <span className="price-new">899.000đ</span>
                                        <span className="price-old">1.500.000đ</span>
                                    </div>
                                </a>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <a href="#" className="course-card course-vip">
                                    <div className="badge-sponsored">Tài trợ</div>
                                    <img src="https://images.unsplash.com/photo-1627398246736-28f74706509f?w=600&q=80" alt="NodeJS" className="course-thumb" loading="lazy" />
                                    <div className="course-body">
                                        <span className="course-cat">Backend</span>
                                        <h3 className="course-title">Microservices với NodeJS & RabbitMQ toàn tập</h3>
                                        <div className="instructor-wrap mt-2 mb-3">
                                            <img src="https://i.pravatar.cc/150?img=12" alt="Instructor" />
                                            <span className="text-muted font-sm text-truncate">Trần Trọng Trí</span>
                                        </div>
                                        <div className="course-meta">
                                            <span className="course-rating"><i className="fa-solid fa-star"></i> 5.0 <span className="text-muted fw-normal">(856)</span></span>
                                        </div>
                                    </div>
                                    <div className="course-footer">
                                        <span className="price-new">950.000đ</span>
                                        <span className="price-old">1.800.000đ</span>
                                    </div>
                                </a>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <a href="#" className="course-card">
                                    <div className="badge-bestseller">Bestseller</div>
                                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80" alt="UIUX" className="course-thumb" loading="lazy" />
                                    <div className="course-body">
                                        <span className="course-cat text-danger">Thiết kế UI/UX</span>
                                        <h3 className="course-title">Figma Mastery: Thiết kế App chuẩn Quốc tế</h3>
                                        <div className="instructor-wrap mt-2 mb-3">
                                            <img src="https://i.pravatar.cc/150?img=5" alt="Instructor" />
                                            <span className="text-muted font-sm text-truncate">Lê Hoàng</span>
                                        </div>
                                        <div className="course-meta">
                                            <span className="course-rating"><i className="fa-solid fa-star"></i> 4.8 <span className="text-muted fw-normal">(2.1k)</span></span>
                                        </div>
                                    </div>
                                    <div className="course-footer">
                                        <span className="price-new">650.000đ</span>
                                        <span className="price-old">1.200.000đ</span>
                                    </div>
                                </a>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <a href="#" className="course-card">
                                    <div className="badge-new">Mới</div>
                                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80" alt="Python" className="course-thumb" loading="lazy" />
                                    <div className="course-body">
                                        <span className="course-cat text-success">AI & Data</span>
                                        <h3 className="course-title">Machine Learning cơ bản với Python</h3>
                                        <div className="instructor-wrap mt-2 mb-3">
                                            <img src="https://i.pravatar.cc/150?img=33" alt="Instructor" />
                                            <span className="text-muted font-sm text-truncate">Phạm Hương</span>
                                        </div>
                                        <div className="course-meta">
                                            <span className="course-rating"><i className="fa-solid fa-star"></i> 4.9 <span className="text-muted fw-normal">(456)</span></span>
                                        </div>
                                    </div>
                                    <div className="course-footer">
                                        <span className="price-new">1.200.000đ</span>
                                        <span className="price-old">2.000.000đ</span>
                                    </div>
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function FeaturedCoursesForm({ block }) {
    const fieldsConfig = ['title', 'sub_title', 'icon'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="Trang chủ: Khóa học nổi bật" 
            PreviewComponent={FeaturedCoursesPreview} 
        />
    );
}
