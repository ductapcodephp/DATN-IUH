import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";
import SweetAlert from '@/Components/SweetAlert';

export default function Courses({ courses, filters, totalCoursesCount }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, title: '' });

    const isFirstRender = useRef(true);

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

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Danh sách khóa học giảng dạy ({totalCoursesCount || 0})</div>
                        <div className="page-sub">Xem, chỉnh sửa hoặc tạm dừng kinh doanh các bài giảng của bạn</div>
                    </div>
                    {/* Style inline cho nút Tạo khóa học mới đồng bộ tone cam */}
                    <Link
                        href={route('seller.courses.create')}
                        className="btn-primary"
                        style={{
                            textDecoration: 'none',
                            backgroundColor: '#f97316',
                            color: '#fff',
                            border: 'none',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                    >
                        <i className="fa-solid fa-plus"></i> Tạo khóa học mới
                    </Link>
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
