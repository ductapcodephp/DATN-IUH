import React from "react";
import InlineEditable from '@/Components/CMS/InlineEditable';

export default function FaqListBlock({ block, editable, faqCategories: propFaqCategories }) {
    const isMock = editable || !propFaqCategories;
    
    const mockCategories = [
        {
            id: 1,
            name: "Tài khoản & Đăng nhập",
            slug: "tai-khoan",
            icon: "fa-solid fa-user",
            color: "#4f46e5",
            faqs: [
                { id: 1, question: "Làm sao để lấy lại mật khẩu?", answer: "Bạn có thể chọn 'Quên mật khẩu' ở trang đăng nhập." }
            ]
        },
        {
            id: 2,
            name: "Thanh toán & Hoàn tiền",
            slug: "thanh-toan",
            icon: "fa-solid fa-credit-card",
            color: "#10b981",
            faqs: [
                { id: 2, question: "Có những phương thức thanh toán nào?", answer: "Chúng tôi hỗ trợ VNPay, MoMo, và chuyển khoản ngân hàng." }
            ]
        }
    ];

    const faqCategories = isMock ? mockCategories : propFaqCategories;

    return (
        <>
            <section className="hero-section text-center py-5 mb-5">
                <div className="container py-2">
                    <InlineEditable 
                        block={block} 
                        property="title" 
                        value={block?.title || "Giải đáp thắc mắc"}
                        as="h1" 
                        className="hero-title" 
                    />
                    <InlineEditable 
                        block={block} 
                        property="sub_title" 
                        value={block?.sub_title || "Bạn có câu hỏi? Chúng tôi có câu trả lời. Tìm kiếm nhanh các chủ đề hỗ trợ học viên bên dưới."}
                        as="p" 
                        className="hero-desc col-lg-6 mx-auto mb-0" 
                    />
                </div>
            </section>

            <div className="container mb-5">
                <div className="row g-4">
                    
                    {/* Sidebar Categories */}
                    <div className="col-lg-3">
                        <div className="d-flex flex-column gap-2 sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            {faqCategories.length > 0 ? (
                                faqCategories.map(category => (
                                    <a 
                                        key={`nav-${category.id}`} 
                                        href={`#cat-${category.slug}`} 
                                        className="roadmap-card p-3 justify-content-between text-dark fw-semibold text-decoration-none d-flex align-items-center rounded border bg-white"
                                    >
                                        <span>
                                            <i className={`${category.icon || 'fa-solid fa-folder'} me-2`} style={{ color: category.color || 'var(--bs-primary)' }}></i> 
                                            {category.name}
                                        </span>
                                        <i className="fa-solid fa-chevron-right font-sm text-muted"></i>
                                    </a>
                                ))
                            ) : (
                                <div className="text-muted fst-italic">Đang cập nhật danh mục...</div>
                            )}
                        </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="col-lg-9">
                        {faqCategories.length > 0 ? (
                            faqCategories.map(category => (
                                <div key={category.id} id={`cat-${category.slug}`} className="mb-5 scroll-margin">
                                    <h3 className="section-title fs-4 mb-3 border-bottom pb-2">{category.name}</h3>
                                    
                                    {category.faqs && category.faqs.length > 0 ? (
                                        <div className="accordion faq-accordion" id={`accordion-${category.id}`}>
                                            {category.faqs.map((faq, idx) => (
                                                <div key={faq.id} className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                                    <h2 className="accordion-header">
                                                        <button 
                                                            className={`accordion-button fw-bold text-dark bg-white ${idx !== 0 ? 'collapsed' : ''}`} 
                                                            type="button" 
                                                            data-bs-toggle="collapse" 
                                                            data-bs-target={`#faq-${faq.id}`} 
                                                            aria-expanded={idx === 0 ? "true" : "false"} 
                                                            aria-controls={`faq-${faq.id}`}
                                                        >
                                                            {faq.question}
                                                        </button>
                                                    </h2>
                                                    <div 
                                                        id={`faq-${faq.id}`} 
                                                        className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} 
                                                        data-bs-parent={`#accordion-${category.id}`}
                                                    >
                                                        <div className="accordion-body text-muted lh-lg" dangerouslySetInnerHTML={{__html: faq.answer}}>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted">Chưa có câu hỏi nào trong danh mục này.</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5">
                                <h5 className="text-muted">Chưa có dữ liệu FAQ.</h5>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
