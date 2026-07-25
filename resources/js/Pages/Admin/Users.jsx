import React, { useState, useEffect } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import Pagination from '@/Components/Pagination';
import FormModal from '@/Components/FormModal';
import Swal from 'sweetalert2';

export default function Users({ users = {}, roles = [], filters = {} }) {
    const data = users.data || [];
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [role, setRole] = useState(filters.role || '');

    // Form states
    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        current_role: 'user',
    });

    const handleOpenModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Người dùng đã được tạo thành công.',
                    confirmButtonColor: '#17b952'
                });
            }
        });
    };

    const handleToggleStatus = (id, currentStatus) => {
        Swal.fire({
            title: 'Xác nhận?',
            text: currentStatus ? "Bạn có chắc chắn muốn khóa tài khoản này?" : "Bạn muốn mở khóa tài khoản này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: currentStatus ? '#fa709a' : '#43e97b',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.users.toggle-status', id), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Thành công!', 
                            text: 'Đã cập nhật trạng thái.', 
                            icon: 'success',
                            confirmButtonColor: '#43e97b'
                        });
                    }
                });
            }
        });
    };

    // --- Filter Logic ---
    const applyFilters = (newFilters) => {
        router.get(route('admin.users'), { search, status, role, ...newFilters }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        applyFilters({ status: e.target.value });
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        applyFilters({ role: e.target.value });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                applyFilters({ search });
            }
        }, 500); // 500ms debounce
        return () => clearTimeout(timeout);
    }, [search]);

    const getRoleBadgeClass = (userRole) => {
        if (userRole === 'root') return 'role-root';
        if (userRole === 'seller') return 'role-seller';
        return 'role-user';
    };

    const getAvatarUrl = (user) => {
        if (user.avatar) {
            return user.avatar.startsWith('http') || user.avatar.startsWith('/') 
                ? user.avatar 
                : `/storage/${user.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    };

    return (
        <AdminLayout>
            <Head title="Quản lý Người dùng" />
            <div className="content-area">
                <div className="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                    <div>
                        <h3 className="m-0 fw-bold text-dark">Quản lý Người dùng</h3>
                        <p className="text-muted mb-0">Theo dõi và quản lý tài khoản học viên, giảng viên</p>
                    </div>
                </div>
                
                {/* Clean & Elegant Control Panel */}
                <div className="d-flex align-items-center mb-4 gap-3 stagger-fade-up bg-white p-3 rounded-4 shadow-sm flex-nowrap overflow-auto" style={{ border: '1px solid rgba(0,0,0,0.03)' }}>
                    <div className="position-relative flex-grow-1" style={{ minWidth: '250px' }}>
                        <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y text-muted" style={{ left: '16px' }}></i>
                        <input 
                            type="text" 
                            className="form-control rounded-pill border-0 bg-light w-100" 
                            style={{ paddingLeft: '45px', height: '44px' }} 
                            placeholder="Tìm kiếm tài khoản, email..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className="form-select rounded-pill border-0 bg-light fw-medium ps-4 pe-5 flex-shrink-0" 
                        style={{ cursor: 'pointer', height: '44px', width: 'auto', minWidth: '220px', color: 'var(--text-muted)' }}
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Bị khóa</option>
                    </select>

                    <select 
                        className="form-select rounded-pill border-0 bg-light fw-medium ps-4 pe-5 flex-shrink-0" 
                        style={{ cursor: 'pointer', height: '44px', width: 'auto', minWidth: '220px', color: 'var(--text-muted)' }}
                        value={role}
                        onChange={handleRoleChange}
                    >
                        <option value="">Tất cả vai trò</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r === 'seller' ? 'Giảng viên (Seller)' : (r === 'user' ? 'Học viên (User)' : r)}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleOpenModal} className="btn btn-primary fw-bold rounded-pill px-4 flex-shrink-0 text-nowrap" style={{ height: '44px', background: 'var(--primary-glow)', border: 'none', boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)' }}>
                        <i className="fa-solid fa-user-plus me-2"></i> Thêm mới
                    </button>
                </div>

                <div className="card border-0 shadow-none users-table-card p-0 stagger-fade-up">
                    <div className="table-responsive">
                        <table className="table premium-table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>ID</th>
                                    <th>Tài khoản</th>
                                    <th>Thông tin liên hệ</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th className="text-end">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(user => (
                                    <tr key={user.id}>
                                        <td className="fw-bold text-muted">#{user.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-glow">
                                                    <img src={getAvatarUrl(user)}
                                                         onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`; }}
                                                         className="rounded-circle shadow-sm" width="40" height="40" alt={user.name} style={{ objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{user.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '13px' }}>Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="text-dark fw-medium"><i className="fa-regular fa-envelope me-2 text-muted"></i>{user.email}</span>
                                                {user.phone && <span className="text-muted mt-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-phone me-2"></i>{user.phone}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${getRoleBadgeClass(user.current_role)}`}>
                                                {user.current_role === 'seller' ? 'Giảng viên' : 'Học viên'}
                                            </span>
                                        </td>
                                        <td>
                                            {user.is_active ? (
                                                <div className="d-flex align-items-center gap-2 text-success fw-bold" style={{ fontSize: '14px' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#17b952', display: 'inline-block' }}></span>
                                                    Hoạt động
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2 text-danger fw-bold" style={{ fontSize: '14px' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e6396b', display: 'inline-block' }}></span>
                                                    Bị khóa
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link href={route('admin.users.show', user.id)} className="btn btn-sm btn-glass-primary rounded-circle" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xem chi tiết">
                                                    <i className="fa-solid fa-eye"></i>
                                                </Link>
                                                
                                                {user.is_active ? (
                                                    <button onClick={() => handleToggleStatus(user.id, user.is_active)} className="btn btn-sm btn-outline-danger rounded-circle border-0" style={{ width: '36px', height: '36px', padding: 0, backgroundColor: 'rgba(250, 112, 154, 0.1)' }} title="Khóa tài khoản">
                                                        <i className="fa-solid fa-lock"></i>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleToggleStatus(user.id, user.is_active)} className="btn btn-sm btn-outline-success rounded-circle border-0" style={{ width: '36px', height: '36px', padding: 0, backgroundColor: 'rgba(67, 233, 123, 0.1)' }} title="Mở khóa tài khoản">
                                                        <i className="fa-solid fa-unlock"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="text-muted mb-2"><i className="fa-regular fa-folder-open fa-3x"></i></div>
                                            <h5 className="fw-bold mt-3">Không tìm thấy người dùng nào.</h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Integrated Pagination inside card */}
                    {users.links && users.links.length > 3 && (
                        <Pagination links={users.links} from={users.from} to={users.to} total={users.total} />
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm Người dùng Mới"
                subtitle="Cấp tài khoản mới cho Học viên hoặc Giảng viên"
                icon={<i className="fa-solid fa-user-plus text-primary"></i>}
                onSubmit={handleCreateUser}
                isSubmitting={processing}
            >
                <div className="mb-3">
                    <label className="form-label fw-bold">Họ và tên</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Nhập họ và tên..."
                        value={formData.name}
                        onChange={e => setData('name', e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                
                <div className="mb-3">
                    <label className="form-label fw-bold">Địa chỉ Email</label>
                    <input 
                        type="email" 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="VD: user@eduflow.com"
                        value={formData.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Mật khẩu</label>
                    <input 
                        type="password" 
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Mật khẩu ít nhất 6 ký tự..."
                        value={formData.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Vai trò</label>
                    <select 
                        className={`form-select ${errors.current_role ? 'is-invalid' : ''}`}
                        value={formData.current_role}
                        onChange={e => setData('current_role', e.target.value)}
                    >
                        <option value="user">Học viên (User)</option>
                        <option value="seller">Giảng viên (Seller)</option>
                    </select>
                    {errors.current_role && <div className="invalid-feedback">{errors.current_role}</div>}
                </div>
            </FormModal>

        </AdminLayout>
    );
}
