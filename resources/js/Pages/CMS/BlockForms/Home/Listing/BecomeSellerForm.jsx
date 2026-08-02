import React from 'react';
import ListItemsForm from '../../ListItemsForm';
import InlineEditable from '@/Components/CMS/InlineEditable';
import InlineEditableImage from '@/Components/CMS/InlineEditableImage';
import { Link } from '@inertiajs/react';

function BecomeSellerPreview({ block, onChange }) {
    const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `/storage/${path}`) : null;
    const imgUrl = getImageUrl(block?.image) || "/assets/frontend/img/become-seller.jpg";

    const features = block?.listing_item || [];

    return (
        <section
            id="become-seller"
            className="cta-section"
            style={{
                background: "linear-gradient(135deg, #111827, #1E3A8A)",
                pointerEvents: 'auto'
            }}
        >
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
                        <InlineEditable 
                            block={block} 
                            property="title" 
                            as="h2" 
                            className="fw-bold text-white mb-3" 
                            isHtml={true}
                            value={block?.title || "Bạn là chuyên gia trong lĩnh vực của mình?"}
                        />

                        <InlineEditable 
                            block={block} 
                            property="description" 
                            as="p" 
                            className="text-light mb-4 fs-5 opacity-75 pe-lg-5" 
                            isHtml={true}
                            value={block?.description || "Trở thành Giảng viên trên EduFlow để tiếp cận hàng triệu học viên, chia sẻ kiến thức và tạo ra nguồn thu nhập thụ động khổng lồ không giới hạn."}
                        />

                        <ul className="text-light list-unstyled mb-4 d-flex flex-column gap-2 opacity-75 pointer-events-none">
                            {features.map((feature, idx) => (
                                <li key={idx}>
                                    <i className={`${feature.icon || "fa-solid fa-check text-warning"} me-2`}></i>
                                    {feature.title}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="btn btn-warning btn-lg fw-bold text-dark px-5 py-3"
                        >
                            <InlineEditable 
                                block={block} 
                                property="button" 
                                as="span" 
                                value={block?.button || "Đăng ký giảng viên"}
                            />
                        </Link>
                    </div>

                    <div className="col-lg-5 text-center position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-white rounded-circle opacity-10" style={{ filter: 'blur(50px)' }}></div>
                        <InlineEditableImage
                            block={block}
                            property="image"
                            className="img-fluid position-relative shadow-lg"
                            style={{ 
                                borderRadius: "2rem",
                                border: "10px solid rgba(255,255,255,0.1)",
                                transform: "rotate(3deg)",
                                transition: "all 0.3s ease"
                            }}
                            defaultImage="/assets/frontend/img/become-seller.jpg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function BecomeSellerForm({ block }) {
    const fieldsConfig = [
        { name: "icon", label: "Mã Icon", width: 12, type: 'icon' },
        { name: "title", label: "Nội dung", width: 12 }
    ];

    return (
        <ListItemsForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            formTitle="Trang chủ: Trở Thành Giảng Viên" 
            formDesc="Quản lý danh sách các điểm nổi bật." 
            PreviewComponent={BecomeSellerPreview}
        />
    );
}
