import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head, Link } from "@inertiajs/react";

export default function Detail({ article, post }) {
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '/assets/frontend/img/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        if (avatarPath.startsWith('/')) return avatarPath;
        return `/storage/${avatarPath}`;
    };

    return (
        <FrontendLayout>
            <Head title={post?.title || "Chi tiết bài viết"} />

            <style dangerouslySetInnerHTML={{ __html: `
                .article-header-meta {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    flex-wrap: wrap;
                }
                .article-author-img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .article-content {
                    font-size: 1.125rem;
                    line-height: 1.8;
                    color: #374151;
                }
                .article-content h2, .article-content h3 {
                    font-weight: 700;
                    color: #111827;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                }
                .article-content h2 { font-size: 1.75rem; }
                .article-content h3 { font-size: 1.35rem; }
                .article-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 2rem 0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .article-content pre {
                    background-color: #1f2937;
                    color: #f8fafc;
                    padding: 1.25rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    font-size: 0.95rem;
                    margin: 1.5rem 0;
                }
                .article-content code {
                    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                }
                .article-content p code {
                    background-color: #f1f5f9;
                    color: #db2777;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-size: 0.9em;
                }
                .article-content blockquote {
                    border-left: 4px solid var(--accent);
                    background-color: #f0f9ff;
                    padding: 1.25rem 1.5rem;
                    margin: 2rem 0;
                    border-radius: 0 8px 8px 0;
                    font-style: italic;
                    color: #1e3a8a;
                }
                .article-content ul, .article-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }
                .article-content li {
                    margin-bottom: 0.5rem;
                }
                .author-box {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 24px;
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    margin-top: 3rem;
                }
                .author-box-img {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .share-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    transition: opacity 0.2s;
                }
                .share-btn:hover { opacity: 0.8; color: #fff; }
                .share-fb { background-color: #1877f2; }
                .share-tw { background-color: #1da1f2; }
                .share-li { background-color: #0a66c2; }
            ` }} />

            <main className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <nav aria-label="breadcrumb" className="mb-3">
                                <ol className="breadcrumb font-sm mb-1">
                                    <li className="breadcrumb-item"><Link href={route('frontend.home')} className="text-decoration-none text-muted">Trang chủ</Link></li>
                                    <li className="breadcrumb-item"><Link href={route('frontend.blog.index')} className="text-decoration-none text-muted">Blog</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">{post.category?.name || 'Chưa phân loại'}</li>
                                </ol>
                            </nav>
                            
                            {post.category && (
                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
                                    {post.category.name}
                                </span>
                            )}

                            <h1 className="fw-bold mb-4" style={{ fontSize: '2.2rem', lineHeight: 1.3 }}>{post.title}</h1>
                            
                            <div className="article-header-meta border-bottom pb-4 mb-4">
                                <div className="d-flex align-items-center gap-2 border-end pe-3">
                                    <img src={getAvatarUrl(post.author?.avatar)} alt={post.author?.name} className="article-author-img" />
                                    <span className="fw-semibold text-dark">{post.author?.name || 'Vô danh'}</span>
                                </div>
                                <div className="border-end pe-3">
                                    <i className="fa-regular fa-calendar me-1"></i> {new Date(article.created_at).toLocaleDateString('vi-VN')}
                                </div>
                                <div>
                                    <i className="fa-regular fa-clock me-1"></i> 5 phút đọc
                                </div>
                                <div className="ms-auto d-flex gap-2">
                                    <a href="#" className="share-btn share-fb" title="Chia sẻ Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                                    <a href="#" className="share-btn share-tw" title="Chia sẻ Twitter"><i className="fa-brands fa-twitter"></i></a>
                                    <a href="#" className="share-btn share-li" title="Chia sẻ LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                                </div>
                            </div>

                            <img 
                                src={post.thumbnail ? (post.thumbnail.startsWith('http') || post.thumbnail.startsWith('/') ? post.thumbnail : `/storage/${post.thumbnail}`) : "/assets/frontend/img/blog-ai-dev.jpg"} 
                                alt={post.title}
                                className="img-fluid rounded-4 mb-5 shadow-sm w-100" 
                                style={{ maxHeight: '450px', objectFit: 'cover' }} 
                                onError={(e) => { e.target.src = "/assets/frontend/img/blog-ai-dev.jpg"; }}
                            />

                            <div 
                                className="article-content" 
                                dangerouslySetInnerHTML={{ __html: post.content }} 
                            />
                            
                            <div className="mt-5 pt-4 border-top">
                                <div className="author-box shadow-sm">
                                    <img src={getAvatarUrl(post.author?.avatar)} alt={post.author?.name} className="author-box-img" />
                                    <div>
                                        <h5 className="fw-bold mb-1">{post.author?.name || 'Vô danh'}</h5>
                                        <p className="text-primary font-sm fw-semibold mb-2">Tác giả</p>
                                        <p className="text-muted font-sm mb-0">Thành viên chia sẻ kiến thức trên EduFlow.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </FrontendLayout>
    );
}
