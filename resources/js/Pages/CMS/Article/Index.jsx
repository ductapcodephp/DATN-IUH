import React from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ articles }) {
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            router.delete(route('cms.article.destroy', id));
        }
    };
    return (
        <CMSLayout>
            <Head title="Quản lý Bài Viết - CMS" />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="wow-title mb-1">Danh sách Bài Viết</h2>
                    <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Quản lý nội dung bài viết blog/tin tức của hệ thống.</p>
                </div>
                <Link href={route('cms.article.create')} className="wow-btn-primary">
                    <i className="fa-solid fa-plus"></i> Tạo Bài Viết Mới
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
                                {articles.data && articles.data.length > 0 ? (
                                    articles.data.map((article) => (
                                        <tr key={article.id}>
                                            <td style={{ color: 'var(--wow-text-muted)' }}>#{article.id}</td>
                                            <td style={{ fontWeight: 600 }}>{article.title}</td>
                                            <td style={{ color: 'var(--wow-primary)' }}>
                                                {article.slug && (
                                                    <a href={`/tech-education/${article.slug}.html`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {article.slug} <i className="fa-solid fa-arrow-up-right-from-square ms-1" style={{ fontSize: '0.8em' }}></i>
                                                    </a>
                                                )}
                                            </td>
                                            <td>
                                                <select 
                                                    className="form-select form-select-sm" 
                                                    style={{ width: '130px', borderColor: 'var(--wow-border)' }}
                                                    value={article.published || 'draft'}
                                                    onChange={(e) => {
                                                        router.put(route('cms.article.status', article.id), {
                                                            published: e.target.value
                                                        }, { preserveScroll: true });
                                                    }}
                                                >
                                                    <option value="publish">Hiển thị</option>
                                                    <option value="draft">Bản nháp</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                    <Link href={route('cms.article.edit', article.id)} className="wow-btn-icon" title="Sửa bài viết">
                                                        <i className="fa-solid fa-pen"></i>
                                                    </Link>
                                                    <button onClick={() => handleDelete(article.id)} className="wow-btn-icon text-danger" style={{ borderColor: 'transparent', background: 'rgba(255, 0, 85, 0.1)' }} title="Xóa bài viết">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center" style={{ padding: '3rem', color: 'var(--wow-text-muted)' }}>
                                            <i className="fa-solid fa-folder-open fs-1 mb-3 d-block opacity-50"></i>
                                            Chưa có bài viết nào. Hãy tạo mới để bắt đầu!
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
