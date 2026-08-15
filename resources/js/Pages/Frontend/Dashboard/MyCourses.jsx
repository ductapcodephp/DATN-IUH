import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/Frontend/DashboardLayout';
import Swal from 'sweetalert2';

const statusConfig = {
    completed: { label: 'Hoàn thành', color: '#16a34a', bg: '#dcfce7', icon: 'fa-solid fa-circle-check' },
    in_progress: { label: 'Đang học', color: '#EA580C', bg: '#fff7ed', icon: 'fa-solid fa-play-circle' },
    not_started: { label: 'Chưa bắt đầu', color: '#6B7280', bg: '#f3f4f6', icon: 'fa-solid fa-clock' },
};

function CourseCard({ enrollment, onReportClick }) {
    const course = enrollment.course;
    const progress = enrollment.progress ?? 0;
    const statusKey = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';
    const status = statusConfig[statusKey];

    return (
        <div className="h-100 db-course-card">
            {/* Thumbnail */}
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                    src={course?.thumbnail ? (course.thumbnail.startsWith('/') ? course.thumbnail : `/storage/${course.thumbnail}`) : '/assets/frontend/img/default-course.png'}
                    alt={course?.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/frontend/img/default-course.png'; }}
                />
                {/* Status Badge */}
                <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: status.bg, color: status.color,
                    padding: '4px 10px', borderRadius: '20px',
                    fontSize: '0.72rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                    <i className={status.icon}></i>
                    {status.label}
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '4px' }}>
                    {course?.category?.name ?? 'Khóa học'}
                </div>
                <Link href={route('frontend.course.detail', { slug: course?.slug })} className="text-decoration-none">
                    <h6
                        className="fw-bold mb-2 text-dark"
                        style={{ lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                        {course?.title ?? 'Không có tiêu đề'}
                    </h6>
                </Link>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '12px' }}>
                    <i className="fa-solid fa-chalkboard-user me-1" style={{ color: '#0284C7' }}></i>
                    {course?.seller?.name ?? 'Giảng viên'}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Tiến độ học</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progress === 100 ? '#16a34a' : '#EA580C' }}>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: progress === 100
                                ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                : 'linear-gradient(90deg, #EA580C, #f97316)',
                            borderRadius: '4px',
                            transition: 'width 0.6s ease',
                        }}></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                    {progress === 100 ? (
                        <Link
                            href={route('frontend.course.learn', { slug: course?.slug })}
                            className="btn flex-grow-1 fw-semibold"
                            style={{
                                background: '#f1f5f9', color: '#475569',
                                borderRadius: '10px', fontSize: '0.85rem', border: 'none',
                            }}
                        >
                            <i className="fa-solid fa-arrow-rotate-right me-2"></i>Xem lại bài học
                        </Link>
                    ) : (
                        <Link
                            href={route('frontend.course.learn', { slug: course?.slug })}
                            className="btn flex-grow-1 fw-semibold text-white"
                            style={{
                                background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                                borderRadius: '10px', fontSize: '0.85rem', border: 'none',
                            }}
                        >
                            <i className="fa-solid fa-play me-2"></i>
                            {progress > 0 ? 'Học tiếp' : 'Bắt đầu học'}
                        </Link>
                    )}
                    
                    <button
                        type="button"
                        onClick={() => onReportClick(course)}
                        className="btn btn-outline-danger"
                        style={{
                            borderRadius: '10px', fontSize: '0.85rem', padding: '0.375rem 0.75rem',
                        }}
                        title="Báo cáo khóa học"
                    >
                        <i className="fa-regular fa-flag"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MyCourses({ courses, filters, reportTopics }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');

    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const { data: reportData, setData: setReportData, post: postReport, processing: reportProcessing, errors: reportErrors, reset: resetReport } = useForm({
        reason: '',
        details: ''
    });

    const handleReportClick = (course) => {
        setSelectedCourse(course);
        setShowReportModal(true);
    };

    const closeReportModal = () => {
        setShowReportModal(false);
        setSelectedCourse(null);
        resetReport();
    };

    const submitReport = (e) => {
        e.preventDefault();
        postReport(route('frontend.course.report', { course: selectedCourse?.id }), {
            onSuccess: () => {
                closeReportModal();
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Báo cáo khóa học thành công. Ban quản trị sẽ sớm xem xét!',
                    icon: 'success',
                    confirmButtonColor: '#ea580c',
                });
            },
            onError: (errors) => {
                const msg = Object.values(errors)[0] || 'Có lỗi xảy ra khi gửi báo cáo.';
                Swal.fire({
                    title: 'Thông báo',
                    text: msg,
                    icon: 'warning',
                    confirmButtonColor: '#ea580c',
                });
            }
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('dashboard.my-courses'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatusFilter('');
        router.get(route('dashboard.my-courses'));
    };

    return (
        <DashboardLayout title="Khóa học của tôi" activeKey="my-courses">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                        <i className="fa-solid fa-graduation-cap me-2" style={{ color: '#EA580C' }}></i>
                        Khóa học của tôi
                    </h4>
                    <p className="mb-0" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        Tổng cộng <strong>{courses?.total ?? 0}</strong> khóa học đã đăng ký
                    </p>
                </div>
                <Link
                    href={route('frontend.course.index')}
                    className="btn fw-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#EA580C,#C2410C)', borderRadius: '10px', border: 'none', fontSize: '0.875rem' }}
                >
                    <i className="fa-solid fa-plus me-2"></i>Khám phá thêm
                </Link>
            </div>

            {/* Filters */}
            <form onSubmit={handleFilter}>
                <div className="d-flex flex-wrap gap-2 mb-4 p-3 db-filter-bar">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm khóa học..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: '1', minWidth: '200px', borderRadius: '10px', fontSize: '0.875rem' }}
                    />
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: 'auto', borderRadius: '10px', fontSize: '0.875rem' }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="in_progress">Đang học</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="not_started">Chưa bắt đầu</option>
                    </select>
                    <button
                        type="submit"
                        className="btn fw-semibold text-white"
                        style={{ background: '#EA580C', borderRadius: '10px', fontSize: '0.875rem', border: 'none' }}
                    >
                        <i className="fa-solid fa-magnifying-glass me-1"></i> Lọc
                    </button>
                    {(search || statusFilter) && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline-secondary fw-semibold"
                            style={{ borderRadius: '10px', fontSize: '0.875rem' }}
                        >
                            Đặt lại
                        </button>
                    )}
                </div>
            </form>

            {/* Courses Grid */}
            {(courses?.data ?? []).length === 0 ? (
                <div className="text-center py-5">
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: '#fff7ed', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                        <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2rem', color: '#EA580C' }}></i>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: '#1F2937' }}>Chưa có khóa học nào</h6>
                    <p className="mb-3" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        Bạn chưa đăng ký khóa học nào. Hãy khám phá ngay!
                    </p>
                    <Link href={route('frontend.course.index')} className="btn btn-sm fw-semibold text-white" style={{ background: '#EA580C', borderRadius: '8px', border: 'none' }}>
                        Khám phá khóa học
                    </Link>
                </div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        {(courses?.data ?? []).map((enrollment) => (
                            <div key={enrollment.id} className="col-md-6 col-xl-4">
                                <CourseCard enrollment={enrollment} onReportClick={handleReportClick} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {courses?.last_page > 1 && (
                        <div className="d-flex justify-content-center gap-2">
                            {Array.from({ length: courses.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get(route('dashboard.my-courses'), { page, search, status: statusFilter })}
                                    className="btn btn-sm fw-semibold"
                                    style={{
                                        borderRadius: '8px',
                                        background: page === courses.current_page ? '#EA580C' : '#fff',
                                        color: page === courses.current_page ? '#fff' : '#4B5563',
                                        border: `1px solid ${page === courses.current_page ? '#EA580C' : '#e2e8f0'}`,
                                        minWidth: '36px',
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold text-danger">
                                    <i className="fa-solid fa-flag me-2"></i>
                                    Báo cáo khóa học
                                </h5>
                                <button type="button" className="btn-close" onClick={closeReportModal}></button>
                            </div>
                            <form onSubmit={submitReport}>
                                <div className="modal-body py-0">
                                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                        Bạn đang báo cáo khóa học: <strong className="text-dark">{selectedCourse?.title}</strong>
                                    </p>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Lý do báo cáo <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-select ${reportErrors.reason ? 'is-invalid' : ''}`}
                                            value={reportData.reason}
                                            onChange={(e) => setReportData('reason', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                        >
                                            <option value="">-- Chọn lý do --</option>
                                            {reportTopics && reportTopics.map((topic) => (
                                                <option key={topic.id} value={topic.name}>{topic.name}</option>
                                            ))}
                                        </select>
                                        {reportErrors.reason && <div className="invalid-feedback">{reportErrors.reason}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>Chi tiết (Tùy chọn)</label>
                                        <textarea
                                            className={`form-control ${reportErrors.details ? 'is-invalid' : ''}`}
                                            rows="3"
                                            placeholder="Cung cấp thêm thông tin để chúng tôi có thể xử lý tốt hơn..."
                                            value={reportData.details}
                                            onChange={(e) => setReportData('details', e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                        ></textarea>
                                        {reportErrors.details && <div className="invalid-feedback">{reportErrors.details}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={closeReportModal} style={{ borderRadius: '8px' }}>Hủy</button>
                                    <button type="submit" className="btn btn-danger" disabled={reportProcessing} style={{ borderRadius: '8px' }}>
                                        {reportProcessing ? 'Đang gửi...' : 'Gửi báo cáo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
