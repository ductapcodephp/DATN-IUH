import React from "react";
import { Link } from "@inertiajs/react";

export default function BecomeSeller({ block }) {
    const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `/storage/${path}`) : null;
    const imgUrl = getImageUrl(block?.image) || "/assets/frontend/img/become-seller.jpg";

    const parsedContent = typeof block?.content === 'string' ? JSON.parse(block.content) : (block?.content || {});
    const listingItems = parsedContent?.listingItem || parsedContent?.listing_item || [];
    
    const features = listingItems;

    return (
        <section
            id="become-seller"
            className="cta-section"
            style={{
                background: "linear-gradient(135deg, #111827, #1E3A8A)"
            }}
        >
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
                        <h2 
                            className="fw-bold text-white mb-3" 
                            dangerouslySetInnerHTML={{ __html: block?.title || "Bạn là chuyên gia trong lĩnh vực của mình?" }} 
                        />

                        <p 
                            className="text-light mb-4 fs-5 opacity-75 pe-lg-5" 
                            dangerouslySetInnerHTML={{ __html: block?.description || "Trở thành Giảng viên trên EduFlow để tiếp cận hàng triệu học viên, chia sẻ kiến thức và tạo ra nguồn thu nhập thụ động khổng lồ không giới hạn." }}
                        />

                        <ul className="text-light list-unstyled mb-4 d-flex flex-column gap-2 opacity-75">
                            {features.map((feature, idx) => (
                                <li key={idx}>
                                    <i className={`${feature.icon || "fa-solid fa-check text-warning"} me-2`}></i>
                                    {feature.title}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={block?.url || route('apply-seller.show')}
                            className="btn btn-warning btn-lg fw-bold text-dark px-5 py-3"
                        >
                            {block?.button || "Đăng ký giảng viên"}
                        </Link>
                    </div>

                    <div className="col-lg-5 text-center position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-white rounded-circle opacity-10" style={{ filter: 'blur(50px)' }}></div>
                        <img 
                            src={imgUrl} 
                            alt={block?.title || "Trở thành Giảng viên"} 
                            className="img-fluid position-relative shadow-lg" 
                            style={{ 
                                borderRadius: "2rem",
                                border: "10px solid rgba(255,255,255,0.1)",
                                transform: "rotate(3deg)",
                                transition: "all 0.3s ease"
                            }} 
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
