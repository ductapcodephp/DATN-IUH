import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router } from "@inertiajs/react";

export default function Index({ instructors, filters }) {
    const { data: instructorList, links, current_page, last_page, total } = instructors;

    const { data, setData, get } = useForm({
        search: filters.search || "",
        sort: filters.sort || "newest"
    });

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            get(route('frontend.instructor.index'), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <FrontendLayout>
            <section className="hero-instructors text-center">
                <div className="container">
                <h1 className="fw-bold mb-3">Gặp gỡ đội ngũ Chuyên gia</h1>
                <p className="text-muted mb-4 fs-5 mx-auto" style={{maxWidth: '600px'}}>
                    Học hỏi trực tiếp từ những người đi trước. Hơn 1,200+ giảng viên giàu kinh nghiệm đang chờ đón bạn tại EduFlow.
                </p>
                
                <div className="mx-auto position-relative" style={{maxWidth: '500px'}}>
                    <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input 
                        type="text" 
                        className="form-control form-control-lg ps-5 shadow-sm border-0" 
                        placeholder="Tìm kiếm tên giảng viên, kỹ năng..." 
                        style={{borderRadius: '30px'}}
                        value={data.search}
                        onChange={e => setData('search', e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                </div>
            </section>

            <section className="py-5 bg-white">
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                        <button 
                            className={`filter-btn ${data.sort === 'newest' ? 'active' : ''}`}
                            onClick={() => { setData('sort', 'newest'); get(route('frontend.instructor.index'), { preserveState: true, preserveScroll: true }); }}
                        >
                            Tất cả
                        </button>
                        <button 
                            className={`filter-btn ${data.sort === 'popular' ? 'active' : ''}`}
                            onClick={() => { setData('sort', 'popular'); get(route('frontend.instructor.index'), { preserveState: true, preserveScroll: true }); }}
                        >
                            Phổ biến
                        </button>
                        <button 
                            className={`filter-btn ${data.sort === 'most_courses' ? 'active' : ''}`}
                            onClick={() => { setData('sort', 'most_courses'); get(route('frontend.instructor.index'), { preserveState: true, preserveScroll: true }); }}
                        >
                            Nhiều khóa học
                        </button>
                    </div>

                    <div className="row g-4">
                        {instructorList.map((instructor) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={instructor.id}>
                                <div className="instructor-card-pro text-center">
                                    <div className="avatar-wrapper">
                                        <img src={instructor.avatar || '/images/default-avatar.png'} alt={instructor.name} />
                                        {/* Optional top-rated badge */}
                                    </div>
                                    <h4 className="instructor-name">{instructor.name}</h4>
                                    <div className="instructor-title">{instructor.bio || 'Giảng viên'}</div>
                                    
                                    <div className="stats-row">
                                        <div className="stat-item">
                                            <div className="stat-val text-warning"><i className="fa-solid fa-star"></i> {Number(instructor.rating || 0).toFixed(1)}</div>
                                            <div className="stat-label">Đánh giá</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-val">{instructor.total_students || 0}</div>
                                            <div className="stat-label">Học viên</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-val">{instructor.courses_count || 0}</div>
                                            <div className="stat-label">Khóa học</div>
                                        </div>
                                    </div>

                                    <div className="skill-tags">
                                        {/* You can map skills if available */}
                                        <span className="skill-tag">Web Development</span>
                                    </div>

                                    <Link href={route('frontend.instructor.detail', instructor.id)} className="btn btn-outline-info w-100 fw-semibold mt-auto">Xem hồ sơ</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {instructorList.length === 0 && (
                        <div className="text-center py-5">
                            <h3 className="fs-4 fw-medium text-dark">Không tìm thấy giảng viên</h3>
                        </div>
                    )}

                    {/* Pagination */}
                    {instructorList.length > 0 && links && last_page > 1 && (
                        <nav className="mt-5 d-flex justify-content-center">
                            <ul className="pagination">
                                {links.map((link, index) => {
                                    let label = link.label;
                                    if (label.includes('&laquo;')) label = '«';
                                    if (label.includes('&raquo;')) label = '»';

                                    return (
                                        <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                            {link.url ? (
                                                <Link
                                                    className={`page-link ${link.active ? 'bg-dark border-dark text-white' : 'text-dark'}`}
                                                    href={link.url}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    {label}
                                                </Link>
                                            ) : (
                                                <span className="page-link text-muted">{label}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    )}
                </div>
            </section>

            <section className="py-5" style={{background: '#111827', color: '#fff'}}>
                <div className="container text-center py-4">
                <h2 className="fw-bold mb-3">Bạn muốn gia nhập đội ngũ Giảng viên?</h2>
                <p className="text-light opacity-75 mb-4 mx-auto" style={{maxWidth: '600px'}}>
                    Chia sẻ kiến thức của bạn tới hàng triệu học viên và tạo ra nguồn thu nhập thụ động không giới hạn ngay hôm nay.
                </p>
                <Link href={route('register')} className="btn btn-warning fw-bold px-4 py-2">Đăng ký làm Giảng viên</Link>
                </div>
            </section>
        </FrontendLayout>
    );
}
