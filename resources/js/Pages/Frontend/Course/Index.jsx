import React, { useEffect, useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router, usePage } from "@inertiajs/react";

export default function Index({ courses, categories, filters }) {
    const { auth } = usePage().props;
    // Pagination data
    const { data: courseList, links, current_page, last_page, total } = courses;

    const { data, setData, get } = useForm({
        search: filters.search || "",
        category: filters.category || [],
        price: filters.price || "all",
        rating: filters.rating || "",
        sort: filters.sort || "newest"
    });

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox") {
            let newArray = [...data[name]];
            if (checked) {
                newArray.push(value);
            } else {
                newArray = newArray.filter(item => item !== value);
            }
            setData(name, newArray);
        } else {
            setData(name, value);
        }
    };

    // Auto submit form when filters change (except search input text)
    useEffect(() => {
        let isMounted = true;
        const timer = setTimeout(() => {
            if (isMounted) {
                get(route('frontend.course.index'), {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }, 300); // debounce
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [data.category, data.price, data.rating, data.sort, data.search]);

    const formatPrice = (price) => {
        if (!price || price == 0) return "Miễn phí";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <FrontendLayout>
            <div className="page-header py-4 bg-surface border-bottom">
                <div className="container">
                    <h1 className="fs-3 fw-bold mb-2">Tất cả khóa học</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 font-sm">
                            <li className="breadcrumb-item"><Link href={route('frontend.home')} className="text-muted">Trang chủ</Link></li>
                            <li className="breadcrumb-item active text-main fw-semibold" aria-current="page">Khóa học</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="py-5">
                <div className="container">
                    
                    <div className="row g-4">
                        
                        {/* Sidebar Filters */}
                        <div className="col-lg-3">
                            <div className="filter-sidebar">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0"><i className="fa-solid fa-filter me-2 text-muted"></i> Bộ lọc</h5>
                                    <button onClick={() => get(route('frontend.course.index'))} className="btn btn-sm btn-outline-dark fw-semibold">Làm mới</button>
                                </div>

                                <div className="filter-group">
                                    <h6 className="filter-title">Danh mục</h6>
                                    <div className="filter-options">
                                        {categories?.map(cat => (
                                            <label className="custom-checkbox" key={cat.id}>
                                                <input 
                                                    type="checkbox" 
                                                    name="category" 
                                                    value={cat.slug} 
                                                    checked={data.category.includes(cat.slug)}
                                                    onChange={handleFilterChange}
                                                />
                                                <span className="checkmark"></span>
                                                <span className="label-text">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <h6 className="filter-title">Giá khóa học</h6>
                                    <div className="filter-options">
                                        <label className="custom-radio">
                                            <input type="radio" name="price" value="all" checked={data.price === 'all'} onChange={handleFilterChange} />
                                            <span className="radiomark"></span>
                                            <span className="label-text">Tất cả mức giá</span>
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name="price" value="free" checked={data.price === 'free'} onChange={handleFilterChange} />
                                            <span className="radiomark"></span>
                                            <span className="label-text">Miễn phí</span>
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name="price" value="paid" checked={data.price === 'paid'} onChange={handleFilterChange} />
                                            <span className="radiomark"></span>
                                            <span className="label-text">Trả phí</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="filter-group border-0 pb-0 mb-0">
                                    <h6 className="filter-title">Đánh giá</h6>
                                    <div className="filter-options">
                                        <label className="custom-radio">
                                            <input type="radio" name="rating" value="" checked={data.rating === ''} onChange={handleFilterChange} />
                                            <span className="radiomark"></span>
                                            <span className="label-text text-yellow">Tất cả đánh giá</span>
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name="rating" value="4.5" checked={data.rating === '4.5'} onChange={handleFilterChange} />
                                            <span className="radiomark"></span>
                                            <span className="label-text text-yellow">
                                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i> (Từ 4.5)
                                            </span>
                                        </label>
                                        <label className="custom-radio">
                                            <input type="radio" name="rating" value="4.0" checked={data.rating === '4.0'} onChange={handleFilterChange} />
                                            <span className="radiomark"></span>
                                            <span className="label-text text-yellow">
                                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-regular fa-star"></i> (Từ 4.0)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                                <div className="text-muted font-sm">
                                    <div className="search-wrap d-inline-block position-relative me-3" style={{width: '250px'}}>
                                        <i className="fa-solid fa-magnifying-glass search-icon position-absolute" style={{left: '10px', top: '50%', transform: 'translateY(-50%)'}}></i>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm ps-4" 
                                            placeholder="Tìm kiếm khoá học..." 
                                            name="search"
                                            value={data.search}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    Tìm thấy <b className="text-dark">{total}</b> khóa học
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="font-sm fw-semibold text-nowrap">Sắp xếp:</span>
                                    <select 
                                        name="sort" 
                                        className="form-select form-select-sm sort-dropdown" 
                                        style={{ width: "180px", boxShadow: "none" }}
                                        value={data.sort}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="popular">Phổ biến nhất</option>
                                        <option value="price_asc">Giá: Thấp đến cao</option>
                                        <option value="price_desc">Giá: Cao đến thấp</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-4">
                                {courseList && courseList.length > 0 ? courseList.map((course) => {
                                    const isWishlisted = (auth?.wishlisted_course_ids || []).includes(course.id);
                                    
                                    return (
                                        <div className="col-12 col-md-6 col-xl-4" key={course.id}>
                                            <div className="course-card position-relative">
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
                                            <Link href={route('frontend.course.detail', { slug: course.slug })} className="text-decoration-none text-dark">
                                                <img src={course.thumbnail ? `/storage/${course.thumbnail}` : '/assets/frontend/img/no-thumbnail.png'} alt={course.title} className="course-thumb" loading="lazy" />
                                            <div className="course-body">
                                                <span className="course-cat">{course.category?.name}</span>
                                                <h3 className="course-title">{course.title}</h3>
                                                <div className="course-meta">
                                                    <span className="course-rating">
                                                        <i className="fa-solid fa-star"></i> {Number(course.reviews_avg_rating || 0).toFixed(1)}
                                                    </span>
                                                    <span><i className="fa-solid fa-users"></i> {course.students_count || 0}</span>
                                                </div>
                                            </div>
                                            <div className="course-footer">
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
                                    <div className="col-12 text-center py-5">
                                        <h5 className="text-muted">Không tìm thấy khóa học nào phù hợp.</h5>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {last_page > 1 && (
                                <div className="d-flex justify-content-center mt-5">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination">
                                            {links.map((link, index) => {
                                                let label = link.label;
                                                if (label.includes('&laquo;')) label = '«';
                                                if (label.includes('&raquo;')) label = '»';

                                                return (
                                                    <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                        {link.url ? (
                                                            <Link 
                                                                className="page-link" 
                                                                href={link.url}
                                                                preserveScroll
                                                                preserveState
                                                            >
                                                                {label}
                                                            </Link>
                                                        ) : (
                                                            <span className="page-link">{label}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </nav>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </section>
        </FrontendLayout>
    );
}
