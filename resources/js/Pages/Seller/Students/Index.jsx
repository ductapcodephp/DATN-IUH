import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import Pagination from "@/Components/Pagination.jsx";
import Swal from 'sweetalert2';

export default function Students({ students, filters, coursesList }) {
    const { flash } = usePage().props;

    // State cho bộ lọc
    const [search, setSearch] = useState(filters?.search || '');
    const [courseId, setCourseId] = useState(filters?.course_id || 'all');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const isFirstRender = useRef(true);

    // Toast thông báo
    useEffect(() => {
        if (flash?.success || flash?.error) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: flash.success ? 'success' : 'error',
                title: flash.success || flash.error,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    }, [flash]);

    // Xử lý gửi bộ lọc lên server (Debounce)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('seller.students.index'),
                { search, course_id: courseId, per_page: perPage, page: 1 },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, courseId, perPage]);

    // Xử lý nút Block học viên
    const handleBlock = (studentId, studentName) => {
        Swal.fire({
            title: 'Chặn học viên này?',
            html: `Mày sắp chặn <strong>${studentName}</strong>. <br/>Học viên này sẽ không thể bình luận hay mua thêm khóa của mày nữa!`,
            icon: 'warning',
            input: 'text',
            inputPlaceholder: 'Nhập lý do chặn (không bắt buộc)...',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Khóa mõm luôn!',
            cancelButtonText: 'Từ từ đã',
            customClass: { popup: 'border-radius-10' }
        }).then((result) => {
            if (result.isConfirmed) {
                // Truyền lý do lên server
                router.post(route('seller.students.block', studentId), {
                    reason: result.value
                });
            }
        });
    };

    return (
        <>
            <Head title="Quản lý học viên" />

            <div className="page">
                <div className="page-header">
                    <div>
                        <div className="page-title">Quản lý & Theo dõi học viên</div>
                        <div className="page-sub">Theo dõi tiến độ, hỗ trợ và quản lý quyền truy cập của học viên</div>
                    </div>
                </div>

                <div className="table-card">
                    {/* TOOLBAR TÌM KIẾM & LỌC */}
                    <div className="table-toolbar" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="table-search">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Tìm tên hoặc email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Lọc theo khóa học */}
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="filter-select-custom"
                            style={{
                                padding: '8px 32px 8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e4e6ef',
                                background: '#fff',
                                outline: 'none',
                                cursor: 'pointer',
                                height: '38px'
                            }}
                        >
                            <option value="all">Tất cả khóa học</option>
                            {coursesList?.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>

                        {/* Chọn số dòng hiển thị */}
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
                        >
                            <option value="10">10 dòng</option>
                            <option value="20">20 dòng</option>
                            <option value="50">50 dòng</option>
                        </select>
                    </div>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Học viên</th>
                                    <th>Khóa học tham gia</th>
                                    <th>Tiến độ</th>
                                    <th>Ngày tham gia</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students?.data?.length > 0 ? (
                                    students.data.map((student, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div><strong>{student.name}</strong></div>
                                                <div style={{ fontSize: '12px', color: '#7e8299' }}>{student.email}</div>
                                            </td>
                                            <td>{student.course_name}</td>
                                            <td>
                                                <span className={`badge ${student.progress >= 80 ? 'badge-green' : student.progress >= 40 ? 'badge-yellow' : 'badge-red'}`}>
                                                    {student.progress}%
                                                </span>
                                            </td>
                                            <td>{student.joined_at}</td>
                                            <td>
                                                {student.is_blocked ? (
                                                    <span className="badge badge-red">Đã bị chặn</span>
                                                ) : (
                                                    <span className="badge badge-green">Bình thường</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="action-btns">
                                                    <a href={`mailto:${student.email}`} className="action-btn" title="Gửi Email hỗ trợ">
                                                        <i className="fa-regular fa-envelope"></i>
                                                    </a>
                                                    {!student.is_blocked && (
                                                        <button onClick={() => handleBlock(student.id, student.name)} className="action-btn text-danger" title="Chặn học viên">
                                                            <i className="fa-solid fa-ban"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                                            Không có dữ liệu học viên.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {students?.total > 0 && (
                        <div style={{ padding: '16px' }}>
                            <Pagination links={students.links} from={students.from} to={students.to} total={students.total} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

Students.layout = page => <SellerLayout children={page}/>
