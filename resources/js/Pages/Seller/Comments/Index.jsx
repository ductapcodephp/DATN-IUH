import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/Seller/SellerLayout';

export default function CommentsIndex({ comments, course }) {
    const deleteComment = (id) => {
        if (confirm('Bạn có chắc muốn xóa bình luận này vĩnh viễn? Hành động này cũng sẽ xóa toàn bộ các phản hồi bên trong.')) {
            router.delete(route('seller.comments.destroy', id), {
                preserveScroll: true
            });
        }
    };

    return (
        <div className="container-fluid py-4 px-4">
            <Head title={`Bình luận - ${course.title}`} />
            
            <div className="d-flex align-items-center mb-4 gap-3">
                <Link href={route('seller.courses.index')} className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
                    <i className="fa-solid fa-arrow-left"></i>
                </Link>
                <div>
                    <h4 className="fw-bold mb-1"><i className="fa-regular fa-comments me-2 text-primary"></i> Quản lý bình luận</h4>
                    <span className="text-muted" style={{ fontSize: '14px' }}>Khóa học: <strong className="text-dark">{course.title}</strong></span>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 rounded-start">Người bình luận</th>
                                    <th className="border-0" style={{ minWidth: '250px' }}>Nội dung</th>
                                    <th className="border-0">Khóa học / Bài học</th>
                                    <th className="border-0 text-center">Báo cáo</th>
                                    <th className="border-0 rounded-end text-end">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.data.length > 0 ? (
                                    comments.data.map((comment) => (
                                        <tr key={comment.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img 
                                                        src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=random`} 
                                                        className="rounded-circle" 
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                                                        alt="avatar" 
                                                    />
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{comment.user?.name}</h6>
                                                        <span className="text-muted" style={{ fontSize: '12px' }}>
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{
                                                    maxWidth: '300px',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {comment.content}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                    <span className="badge bg-light text-dark border mb-1">
                                                        {comment.lesson?.chapter?.course?.title || 'Unknown Course'}
                                                    </span>
                                                    <br />
                                                    <small className="text-muted fw-semibold">
                                                        Bài: {comment.lesson?.title || 'Unknown Lesson'}
                                                    </small>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {comment.reports_count > 0 ? (
                                                    <span className="badge bg-danger rounded-pill">
                                                        {comment.reports_count} báo cáo
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                                {/* Button to view report details if needed */}
                                                {comment.reports_count > 0 && (
                                                    <div className="mt-1">
                                                        <button 
                                                            className="btn btn-link btn-sm text-danger p-0"
                                                            style={{ fontSize: '12px' }}
                                                            data-bs-toggle="modal" 
                                                            data-bs-target={`#reportModal${comment.id}`}
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-sm btn-outline-danger" 
                                                    onClick={() => deleteComment(comment.id)}
                                                    title="Xóa vĩnh viễn"
                                                >
                                                    <i className="fa-solid fa-trash"></i> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            Chưa có bình luận nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {comments.links && comments.links.length > 3 && (
                        <div className="d-flex justify-content-center mt-4">
                            <ul className="pagination mb-0">
                                {comments.links.map((link, idx) => (
                                    <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${link.url === null ? 'disabled' : ''}`}>
                                        <Link 
                                            className="page-link" 
                                            href={link.url || '#'} 
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals for viewing reports */}
            {comments.data.map(comment => comment.reports_count > 0 && (
                <div key={`modal-${comment.id}`} className="modal fade" id={`reportModal${comment.id}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <div className="modal-header border-bottom-0 bg-light pb-2">
                                <h5 className="modal-title fw-bold">Chi tiết báo cáo</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3 p-3 bg-light rounded-3">
                                    <strong className="d-block mb-1">Nội dung bình luận bị báo cáo:</strong>
                                    <span className="text-muted">{comment.content}</span>
                                </div>
                                
                                <h6 className="fw-bold mb-3">Danh sách báo cáo ({comment.reports_count})</h6>
                                <div className="list-group list-group-flush border-top border-bottom" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {comment.reports.map((report, rIdx) => (
                                        <div key={rIdx} className="list-group-item px-0 py-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="badge bg-danger rounded-pill px-3">{report.reason}</span>
                                                <small className="text-muted">{new Date(report.created_at).toLocaleString()}</small>
                                            </div>
                                            {report.details && (
                                                <p className="mb-0 mt-2 text-dark small p-2 bg-light rounded">{report.details}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 pt-0">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger rounded-pill px-4" 
                                    onClick={() => {
                                        document.querySelector(`#reportModal${comment.id} .btn-close`).click();
                                        deleteComment(comment.id);
                                    }}
                                >
                                    Xóa vĩnh viễn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

CommentsIndex.layout = page => <SellerLayout children={page} />
