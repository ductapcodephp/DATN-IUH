import React from 'react';
import { Link, useForm } from "@inertiajs/react";
import InlineEditable from '@/Components/CMS/InlineEditable';

export default function     InstructorListBlock({ block, editable, instructors, filters }) {
    const isMock = editable || !instructors;
    
    const mockInstructors = {
        data: [
            { id: 1, name: "Nguyễn Văn A", bio: "Chuyên gia Web", rating: 4.8, total_students: 1200, courses_count: 5, avatar: null, is_vip_seller: true, vip_badge_text: "Pro" },
            { id: 2, name: "Trần Thị B", bio: "Thiết kế UI/UX", rating: 4.9, total_students: 850, courses_count: 3, avatar: null, is_vip_seller: false },
        ],
        links: [],
        current_page: 1,
        last_page: 1,
        total: 2
    };

    const currentInstructors = isMock ? mockInstructors : instructors;
    const currentFilters = filters || { search: '', sort: 'newest' };

    const { data: instructorList, links, last_page } = currentInstructors;

    const { data, setData, get } = useForm({
        search: currentFilters.search || "",
        sort: currentFilters.sort || "newest"
    });

    const handleSearch = (e) => {
        if (e.key === 'Enter' && !isMock) {
            e.preventDefault();
            get(route('frontend.instructor.index'), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSort = (sortType) => {
        if (isMock) return;
        setData('sort', sortType);
        get(route('frontend.instructor.index'), { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <section className="hero-instructors text-center">
                <div className="container">
                <InlineEditable 
                    block={block} 
                    property="title" 
                    value={block?.title || "Gặp gỡ đội ngũ Chuyên gia"}
                    as="h1" 
                    className="fw-bold mb-3" 
                />
                <InlineEditable 
                    block={block} 
                    property="sub_title" 
                    value={block?.sub_title || "Học hỏi trực tiếp từ những người đi trước. Hơn 1,200+ giảng viên giàu kinh nghiệm đang chờ đón bạn tại EduFlow."}
                    as="p" 
                    className="text-muted mb-4 fs-5 mx-auto" 
                    style={{maxWidth: '600px'}} 
                />
                
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
                            onClick={() => handleSort('newest')}
                        >
                            Tất cả
                        </button>
                        <button 
                            className={`filter-btn ${data.sort === 'popular' ? 'active' : ''}`}
                            onClick={() => handleSort('popular')}
                        >
                            Phổ biến
                        </button>
                        <button 
                            className={`filter-btn ${data.sort === 'most_courses' ? 'active' : ''}`}
                            onClick={() => handleSort('most_courses')}
                        >
                            Nhiều khóa học
                        </button>
                    </div>

                    <div className="row g-4">
                        {instructorList.map((instructor) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={instructor.id}>
                                <div className="instructor-card-pro text-center">
                                    <div className="avatar-wrapper position-relative d-inline-block">
                                        <img src={instructor.avatar || '/images/default-avatar.png'} alt={instructor.name} />
                                        {instructor.is_vip_seller ? (
                                            <div className="position-absolute" style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                                                <span className="badge text-white rounded-pill px-2 py-1 shadow border border-white" style={{ backgroundColor: 'var(--fire)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                                    <i className="fa-solid fa-crown me-1 text-warning"></i>{instructor.vip_badge_text || 'Uy tín'}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                    <h4 className="instructor-name mt-3">{instructor.name}</h4>
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
                                        <span className="skill-tag">Web Development</span>
                                    </div>

                                    {isMock ? (
                                        <button className="btn btn-outline-info w-100 fw-semibold mt-auto">Xem hồ sơ</button>
                                    ) : (
                                        <Link href={route('frontend.instructor.detail', instructor.id)} className="btn btn-outline-info w-100 fw-semibold mt-auto">Xem hồ sơ</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {instructorList.length === 0 && (
                        <div className="text-center py-5">
                            <h3 className="fs-4 fw-medium text-dark">Không tìm thấy giảng viên</h3>
                        </div>
                    )}

                    {instructorList.length > 0 && links && last_page > 1 && !isMock && (
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
                {isMock ? (
                    <button className="btn btn-warning fw-bold px-4 py-2">Đăng ký làm Giảng viên</button>
                ) : (
                    <Link href={route('register')} className="btn btn-warning fw-bold px-4 py-2">Đăng ký làm Giảng viên</Link>
                )}
                </div>
            </section>
        </>
    );
}
