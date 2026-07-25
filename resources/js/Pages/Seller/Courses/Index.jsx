import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";
import SweetAlert from '@/Components/SweetAlert';

export default function Courses({ courses, filters, totalCoursesCount }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, title: '' });

    const { auth } = usePage().props;
    const isFirstRender = useRef(true);
    const [showStorageModal, setShowStorageModal] = useState(false);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const limitBytes = auth?.seller_storage_limit || 0;
    const usedBytes = auth?.seller_storage_used || 0;
    const usedPercentage = limitBytes > 0 ? (usedBytes / limitBytes) * 100 : 0;
    const isStorageFull = usedBytes >= limitBytes && limitBytes > 0;
    const isNearLimit = usedPercentage >= 90;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('seller.courses.index'),
                {
                    search: search,
                    status: status,
                    per_page: perPage,
                    page: 1
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, status, perPage]);

    const handleDelete = (id, title) => {
        setConfirmDelete({ show: true, id, title });
    };

    const handleCreateCourse = (e) => {
        if (isStorageFull) {
            e.preventDefault();
            setShowStorageModal(true);
        }
    };

    return (
        <>
            <Head title="Quản lý khóa học" />

            <SweetAlert
                show={confirmDelete.show}
                type="confirm"
                icon="warning"
                title="Bạn có chắc chắn không?"
                text={`Khóa học "${confirmDelete.title}" sẽ bị xóa tạm thời vào hệ thống lưu trữ!`}
                confirmButtonText="Đồng ý, xóa ngay!"
                cancelButtonText="Hủy thao tác"
                confirmButtonColor="#f97316"
                onConfirm={() => {
                    router.delete(route('seller.courses.destroy', confirmDelete.id));
                }}
                onClose={() => setConfirmDelete({ show: false, id: null, title: '' })}
            />

            <Modal show={showStorageModal} onClose={() => setShowStorageModal(false)} maxWidth="sm">
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>
                        <i className="fa-solid fa-hard-drive"></i>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Dung lượng lưu trữ đã đầy</h3>
                    <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                        Bạn đã sử dụng hết {formatBytes(limitBytes)} dung lượng lưu trữ của gói hiện tại. Không thể tạo thêm khóa học và tải lên video mới. Vui lòng nâng cấp gói dung lượng để tiếp tục.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={() => setShowStorageModal(false)} className="btn btn-light" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                            Đóng
                        </button>
                        <Link href={route('seller.vip.index')} className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                            Mua thêm dung lượng
                        </Link>
                    </div>
                </div>
            </Modal>

            <div className="page">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div className="page-title">Danh sách khóa học giảng dạy ({totalCoursesCount || 0})</div>
                        <div className="page-sub">Xem, chỉnh sửa hoặc tạm dừng kinh doanh các bài giảng của bạn</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Thanh đo dung lượng */}
                        <div style={{ width: '220px', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '10px 16px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                                <span>Lưu trữ (R2)</span>
                                <span>{formatBytes(usedBytes)} / {formatBytes(limitBytes)}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(usedPercentage, 100)}%`, height: '100%', backgroundColor: isNearLimit ? '#ef4444' : '#f97316', transition: 'width 0.3s ease' }}></div>
                            </div>
                        </div>

                        {/* Nút Tạo khóa học */}
                        <Link
                            href={route('seller.courses.create')}
                            className="btn-primary"
                            onClick={handleCreateCourse}
                            style={{
                                textDecoration: 'none',
                                backgroundColor: '#f97316',
                                color: '#fff',
                                border: 'none',
                                transition: 'background-color 0.2s',
                                padding: '10px 16px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                        >
                            <i className="fa-solid fa-plus"></i> Tạo khóa học
                        </Link>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-toolbar" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div className="table-search">
                            <i className="fa-solid fa-magnifying-glass" style={{ color: search ? '#f97316' : '#a1a5b7' }}></i>
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                onBlur={(e) => e.target.style.borderColor = '#e4e6ef'}
                            />
                        </div>

                        {/* Đồng bộ trạng thái active của bộ lọc sang màu cam */}
                        <button
                            onClick={() => setStatus('all')}
                            className={`filter-btn ${status === 'all' ? 'active' : ''}`}
                            style={status === 'all' ? { backgroundColor: '#f97316', borderColor: '#f97316', color: '#fff' } : {}}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setStatus('published')}
                            className={`filter-btn ${status === 'published' ? 'active' : ''}`}
                            style={status === 'published' ? { backgroundColor: '#f97316', borderColor: '#f97316', color: '#fff' } : {}}
                        >
                            Đang bán
                        </button>
                        <button
                            onClick={() => setStatus('draft')}
                            className={`filter-btn ${status === 'draft' ? 'active' : ''}`}
                            style={status === 'draft' ? { backgroundColor: '#f97316', borderColor: '#f97316', color: '#fff' } : {}}
                        >
                            Chờ duyệt
                        </button>

                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="filter-select-custom"
                            style={{
                                padding: '8px 32px 8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e4e6ef',
                                background: '#fff',
                                marginLeft: 'auto',
                                outline: 'none',
                                cursor: 'pointer',
                                height: '38px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#f97316'}
                            onBlur={(e) => e.target.style.borderColor = '#e4e6ef'}
                        >
                            <option value="10">Hiển thị 10 dòng</option>
                            <option value="20">Hiển thị 20 dòng</option>
                            <option value="50">Hiển thị 50 dòng</option>
                            <option value="100">Hiển thị 100 dòng</option>
                        </select>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Khóa học</th>
                                    <th>Loại phí</th>
                                    <th>Giá bán</th>
                                    <th>Bài học</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.data.length > 0 ? (
                                    courses.data.map(course => (
                                        <tr key={course.id}>
                                            <td>
                                                <div className="course-info">
                                                    <div className="course-thumb" style={{ background: '#f5f8fa', border: '1px solid #e4e6ef', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '40px', borderRadius: '4px' }}>
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={course.thumbnail.startsWith('http') || course.thumbnail.startsWith('/') ? course.thumbnail : `/storage/${course.thumbnail}`}
                                                                alt={course.title}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <i className="fa-solid fa-book text-muted"></i>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="course-name"><strong>{course.title}</strong></div>
                                                        <div className="course-cat" style={{ fontSize: '11px', color: '#a1a5b7' }}>{course.level ? course.level.toUpperCase() : ''}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {course.is_free ? (
                                                    <span className="badge" style={{ background: '#e8fff3', color: '#50cd89', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>Miễn phí</span>
                                                ) : (
                                                    <span className="badge" style={{ background: '#fff5f8', color: '#f1416c', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>Có phí</span>
                                                )}
                                            </td>

                                            <td>
                                                {course.is_free ? (
                                                    <span style={{ color: '#50cd89', fontWeight: 'bold' }}>0 đ</span>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <div style={{ fontWeight: 'bold', color: '#181c32', fontSize: '13px' }}>
                                                            {course.price ? `${new Intl.NumberFormat('vi-VN').format(course.price)} đ` : 'Chưa nhập giá'}
                                                        </div>
                                                        {course.original_price && (
                                                            <div style={{ fontSize: '11px', color: '#a1a5b7', textDecoration: 'line-through' }}>
                                                                Giá gốc: {new Intl.NumberFormat('vi-VN').format(course.original_price)} đ
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            <td><strong>{course.lessons_count ?? course.total_lessons ?? 0}</strong> bài</td>

                                            <td>
                                                <span className={`badge ${course.status === 'published' ? 'badge-green' : course.status === 'draft' ? 'badge-yellow' : 'badge-red'}`}>
                                                    {course.status === 'published' ? 'Đang bán' : course.status === 'draft' ? 'Chờ duyệt' : 'Đang ẩn'}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-btns">
                                                    <Link
                                                        href={route('seller.courses.reviews.index', course.id)}
                                                        className="action-btn"
                                                        title="Đánh giá phản hồi"
                                                        style={{ color: '#eab308' }}
                                                    >
                                                        <i className="fa-solid fa-star"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('seller.courses.comments.index', course.id)}
                                                        className="action-btn"
                                                        title="Quản lý bình luận"
                                                        style={{ color: '#3b82f6' }}
                                                    >
                                                        <i className="fa-solid fa-comments"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('seller.courses.curriculum.index', course.id)}
                                                        className="action-btn"
                                                        title="Soạn giáo trình"
                                                        style={{ color: '#f97316' }} // Đổi màu icon danh sách giáo trình sang cam thương hiệu
                                                    >
                                                        <i className="fa-solid fa-list-ol"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('seller.courses.edit', course.id)}
                                                        className="action-btn"
                                                        title="Chỉnh sửa"
                                                        style={{ color: '#4b5563' }}
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(course.id, course.title)}
                                                        className="action-btn"
                                                        title="Xóa"
                                                        style={{ color: '#a1a5b7' }}
                                                    >
                                                        <i className="fa-solid fa-trash" onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = '#a1a5b7'}></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                                            Không tìm thấy khóa học nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {courses.total > 0 && (
                        <div style={{ padding: '16px' }}>
                            <Pagination links={courses.links} from={courses.from} to={courses.to} total={courses.total} />
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

Courses.layout = page => <SellerLayout children={page} />;
