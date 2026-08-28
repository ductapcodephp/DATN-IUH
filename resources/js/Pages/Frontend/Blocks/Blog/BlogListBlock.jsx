import React, { useState } from "react";
import InlineEditable from '@/Components/CMS/InlineEditable';
import { Link } from '@inertiajs/react';

export default function BlogListBlock({ block, editable, onChange, articles: propArticles, categories = [] }) {
    const articles = editable && (!propArticles || !propArticles.data) ? [
        {
            id: 1,
            title: "Lộ trình học Frontend thực chiến đáp ứng thị trường năm 2026",
            slug: "lo-trinh-frontend-2026",
            category: "Frontend Tips",
            categoryColorClass: "text-accent",
            image: "/assets/frontend/img/blog-frontend-2026.jpg",
            summary: "Những kỹ năng cốt lõi và các framework bắt buộc phải làm chủ nếu muốn lọt vào mắt xanh của các nhà tuyển dụng công nghệ lớn.",
            date: "20/06/2026",
            readTime: "5 phút đọc"
        },
        {
            id: 2,
            title: "Thiết kế RESTful API chuẩn doanh nghiệp: 5 lỗi phổ biến nhất cần tránh",
            slug: "thiet-ke-restful-api",
            category: "Backend & Cloud",
            categoryColorClass: "text-fire",
            image: "/assets/frontend/img/blog-restful-api.jpg",
            summary: "Tìm hiểu cách tổ chức HTTP status code, cấu trúc dữ liệu trả về và phương pháp bảo mật JWT đúng chuẩn bảo mật.",
            date: "18/06/2026",
            readTime: "8 phút đọc"
        },
        {
            id: 3,
            title: "Hành trang viết CV và phỏng vấn thử dành cho sinh viên IT mới ra trường",
            slug: "viet-cv-phong-van-thu",
            category: "Kinh nghiệm đi làm",
            categoryColorClass: "text-warning",
            image: "/assets/frontend/img/blog-cv-interview.jpg",
            summary: "Làm sao để làm nổi bật các project thực hành cá nhân và gây ấn tượng mạnh với Mentor ngay từ vòng lọc hồ sơ?",
            date: "15/06/2026",
            readTime: "6 phút đọc"
        },
        {
            id: 4,
            title: "ChatGPT và GitHub Copilot: Dev có đang đứng trước nguy cơ bị thay thế?",
            slug: "chat-gpt-github-copilot-dev-thay-the",
            category: "Xu hướng AI",
            categoryColorStyle: { color: "#8B5CF6" },
            image: "/assets/frontend/img/blog-ai-dev.jpg",
            summary: "Phân tích thực tế về cách AI đang thay đổi cách chúng ta viết code, và làm thế nào để tận dụng nó để x10 hiệu suất làm việc.",
            date: "12/06/2026",
            readTime: "10 phút đọc"
        },
        {
            id: 5,
            title: "Tối ưu hoá hiệu suất React App với useMemo và useCallback",
            slug: "toi-uu-hieu-suat-react",
            category: "Frontend Tips",
            categoryColorClass: "text-accent",
            image: "/assets/frontend/img/blog-react-usememo.jpg",
            summary: "Hướng dẫn chi tiết bằng ví dụ thực tế giúp ứng dụng React của bạn mượt mà hơn, tránh re-render thừa thải làm lag giao diện.",
            date: "10/06/2026",
            readTime: "7 phút đọc"
        },
        {
            id: 6,
            title: "Docker cơ bản: Đóng gói ứng dụng NodeJS chỉ trong 10 phút",
            slug: "docker-co-ban-nodejs",
            category: "Backend & Cloud",
            categoryColorClass: "text-fire",
            image: "/assets/frontend/img/blog-docker-nodejs.jpg",
            summary: "Tạm biệt nỗi ám ảnh 'chạy được trên máy em nhưng lên server thì lỗi'. Hãy bắt đầu làm quen với công nghệ container hóa.",
            date: "08/06/2026",
            readTime: "5 phút đọc"
        },
        {
            id: 7,
            title: "Bí kíp deal lương thành công cho Junior Developer khi nhảy việc",
            slug: "deal-luong-junior-developer",
            category: "Kinh nghiệm đi làm",
            categoryColorClass: "text-warning",
            image: "/assets/frontend/img/blog-deal-salary.jpg",
            summary: "Cần chuẩn bị những gì để tự tin đàm phán mức lương xứng đáng với năng lực của bạn trong thời buổi kinh tế khó khăn?",
            date: "05/06/2026",
            readTime: "4 phút đọc"
        },
        {
            id: 8,
            title: "Hướng dẫn tích hợp ChatGPT vào ứng dụng Web bằng OpenAI API",
            slug: "tich-hop-chatgpt-openai-api",
            category: "Xu hướng AI",
            categoryColorStyle: { color: "#8B5CF6" },
            image: "/assets/frontend/img/blog-chatgpt-api.jpg",
            summary: "Cùng xây dựng một chatbot thông minh, tự động trả lời câu hỏi của khách hàng ngay trên website của bạn chỉ với vài thao tác.",
            date: "02/06/2026",
            readTime: "12 phút đọc"
        },
        {
            id: 9,
            title: "CSS Grid vs Flexbox: Khi nào nên dùng cái nào?",
            slug: "css-grid-vs-flexbox",
            category: "Frontend Tips",
            categoryColorClass: "text-accent",
            image: "/assets/frontend/img/blog-css-grid-flexbox.jpg",
            summary: "Phân biệt rõ ràng hai kỹ thuật layout mạnh mẽ nhất hiện nay để xây dựng UI linh hoạt, đáp ứng mọi kích thước màn hình thiết bị.",
            date: "28/05/2026",
            readTime: "6 phút đọc"
        }
    ] : (propArticles?.data || []).map(article => {
        const post = article.post || {};
        return {
            id: article.id,
            title: post.title,
            slug: post.slug,
            category: post.category?.name || 'Chưa phân loại',
            categoryColorClass: "text-primary",
            image: post.thumbnail ? (post.thumbnail.startsWith('http') || post.thumbnail.startsWith('/') ? post.thumbnail : `/storage/${post.thumbnail}`) : "/assets/frontend/img/blog-ai-dev.jpg",
            summary: post.description,
            date: new Date(article.created_at).toLocaleDateString('vi-VN'),
            readTime: "5 phút đọc", // placeholder
        };
    });

    const [activeTab, setActiveTab] = useState("all");

    const filteredArticles = activeTab === "all" 
        ? articles 
        : articles.filter(a => a.category && a.category.toLowerCase().includes(activeTab.toLowerCase()));

    return (
        <>
            <section className="hero-section text-center py-5 mb-4">
                <div className="container py-2">
                    <InlineEditable 
                        block={block} 
                        property="title" 
                        value={block?.title || "Blog Chia Sẻ Kiến Thức"} 
                        onChange={(val) => { if (typeof onChange === 'function') onChange('title', val); }}
                        className="hero-title"
                        as="h1"
                    />
                    <InlineEditable 
                        block={block} 
                        property="sub_title" 
                        value={block?.sub_title || "Cập nhật tin tức công nghệ mới nhất, hướng dẫn lập trình thực chiến và cẩm nang định hướng sự nghiệp IT."} 
                        onChange={(val) => { if (typeof onChange === 'function') onChange('sub_title', val); }}
                        className="hero-desc col-lg-6 mx-auto mb-0"
                        as="p"
                    />
                </div>
            </section>

            <div className="container mb-5">
                <div className="d-flex flex-wrap gap-2 justify-content-center border-bottom pb-3">
                    <button 
                        onClick={() => setActiveTab("all")} 
                        className={`btn btn-sm px-4 rounded-pill ${activeTab === "all" ? "btn-dark" : "btn-outline-secondary border-0"}`}
                    >
                        Tất cả bài viết
                    </button>
                    {categories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveTab(cat.name.toLowerCase())} 
                            className={`btn btn-sm px-4 rounded-pill ${activeTab === cat.name.toLowerCase() ? "btn-dark" : "btn-outline-secondary border-0"}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <section className="mb-5">
                <div className="container">
                    <div className="row g-4">
                        {filteredArticles.map((article) => (
                            <div className="col-12 col-md-6 col-lg-4" key={article.id}>
                                <div className="course-card h-100 d-flex flex-column cart-card-hover border rounded-3 overflow-hidden shadow-sm bg-white">
                                    <Link href={route('frontend.blog.detail', article.slug)}>
                                        <img 
                                            src={article.image} 
                                            alt={article.title} 
                                            className="course-thumb w-100 object-fit-cover" 
                                            style={{ height: "200px" }}
                                            loading="lazy"
                                            onError={(e) => { e.target.src = "/assets/frontend/img/blog-ai-dev.jpg"; }}
                                        />
                                    </Link>
                                    <div className="course-body d-flex flex-column flex-grow-1 p-4">
                                        <span 
                                            className={`course-cat fw-semibold ${article.categoryColorClass || ""}`} 
                                            style={article.categoryColorStyle}
                                        >
                                            {article.category}
                                        </span>
                                        <h3 className="course-title fs-5 fw-bold mb-2 mt-1">
                                            <Link href={route('frontend.blog.detail', article.slug)} className="text-dark text-decoration-none hover-text-accent">{article.title}</Link>
                                        </h3>
                                        <p className="text-muted font-sm mb-3 lh-relaxed">{article.summary}</p>
                                        
                                        <div className="course-meta mt-auto pt-3 border-top text-muted font-sm d-flex justify-content-between">
                                            <span><i className="fa-regular fa-calendar me-1"></i> {article.date}</span>
                                            <span><i className="fa-regular fa-clock me-1"></i> {article.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-center mt-5">
                        <nav>
                            <ul className="pagination pagination-sm gap-2">
                                <li className="page-item disabled"><a className="page-link border-0 rounded bg-light" href="#"><i className="fa-solid fa-chevron-left"></i></a></li>
                                <li className="page-item active"><a className="page-link border-0 rounded btn-dark text-white px-3" href="#">1</a></li>
                                <li className="page-item"><a className="page-link border-0 rounded bg-light text-dark px-3" href="#">2</a></li>
                                <li className="page-item"><a className="page-link border-0 rounded bg-light text-dark px-3" href="#">3</a></li>
                                <li className="page-item"><a className="page-link border-0 rounded bg-light" href="#"><i className="fa-solid fa-chevron-right"></i></a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
        </>
    );
}
