import React from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ pages }) {
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa trang này?')) {
            router.delete(route('cms.page.destroy', id));
        }
    };
    return (
        <CMSLayout>
            <Head title="Quản lý Trang - CMS" />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1">Danh sách Trang</h2>
                    <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Quản lý nội dung các trang tĩnh và động của hệ thống.</p>
                </div>
                <Link href={route('cms.page.create')} className="wow-btn-primary">
                    <i className="fa-solid fa-plus"></i> Tạo Trang Mới
                </Link>
            </div>

            <div className="wow-card">
                <div className="wow-card-body p-0">
                    <div className="wow-table-wrapper" style={{ padding: '0 30px 30px' }}>
                        <table className="wow-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tiêu đề (Title)</th>
                                    <th>Đường dẫn (Slug)</th>
                                    <th>Trạng thái</th>
                                    <th className="text-end">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.data && pages.data.length > 0 ? (
                                    pages.data.map((page) => (
                                        <tr key={page.id}>
                                            <td style={{ color: 'var(--wow-text-muted)' }}>#{page.id}</td>
                                            <td style={{ fontWeight: 600 }}>{page.name}</td>
                                            <td style={{ color: 'var(--wow-primary)' }}>{page.post?.slug}</td>
                                            <td>
                                                <span className="wow-badge">Hiển thị</span>
                                            </td>
                                            <td className="text-end">
                                                <Link href={route('cms.block.index', page.id)} className="wow-btn-icon me-2" title="Quản lý Block">
                                                    <i className="fa-solid fa-cubes"></i>
                                                </Link>
                                                <Link href={route('cms.page.edit', page.id)} className="wow-btn-icon me-2" title="Sửa trang">
                                                    <i className="fa-solid fa-pen"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(page.id)} className="wow-btn-icon text-danger" style={{ borderColor: 'transparent', background: 'rgba(255, 0, 85, 0.1)' }} title="Xóa trang">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center" style={{ padding: '3rem', color: 'var(--wow-text-muted)' }}>
                                            <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-50"></i>
                                            Chưa có trang nào. Hãy tạo mới để bắt đầu!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CMSLayout>
    );
}
