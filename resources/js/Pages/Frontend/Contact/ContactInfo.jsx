import React from "react";
import InlineEditable from '@/Components/CMS/InlineEditable';
import IconPicker from '@/Components/CMS/IconPicker';
import axios from 'axios';

export default function ContactInfo({ block, children, editable, onChange }) {
    const parsedContent = typeof block?.content === 'string' ? JSON.parse(block.content) : (block?.content || {});
    const items = parsedContent?.listingItem || parsedContent?.listing_item || [
            { title: "Văn phòng chính", description: "Quận 1, TP. Hồ Chí Minh, Việt Nam", icon: "fa-location-dot" },
            { title: "Email hỗ trợ", description: "support@eduflow.vn", icon: "fa-envelope" },
            { title: "Hotline tư vấn", description: "1900 1234 (8:00 - 22:00)", icon: "fa-phone" }
        ];

    const mapUrl = block?.url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.423169372332!2d106.7017555!3d10.7773539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b098f1%3A0x9e73722247b973a8!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1718873000000!5m2!1svi!2s";

    return (
        <>
            <section className="hero-section text-center py-5 mb-5">
                <div className="container py-2">
                    <InlineEditable 
                        block={block}
                        property="title"
                        value={block?.title || "Liên hệ với EduFlow"}
                        className="hero-title"
                        as="h1"
                    />
                    <InlineEditable 
                        block={block}
                        property="sub_title"
                        value={block?.sub_title || "Kết nối với chúng tôi nếu bạn cần tư vấn lộ trình học tập, giải đáp dịch vụ hoặc hợp tác doanh nghiệp."}
                        className="hero-desc col-lg-6 mx-auto mb-0"
                        as="p"
                    />
                </div>
            </section>

            <div className="container mb-5">
                <div className="row g-5">
                    
                    {/* Cột trái: Thông tin liên hệ */}
                    <div className="col-lg-5">
                        <h2 className="section-title fs-3 mb-3">Thông tin kết nối</h2>
                        <p className="text-muted mb-4">Đội ngũ hỗ trợ của EduFlow luôn sẵn sàng phản hồi bạn trong vòng 24 giờ làm việc. Hãy lựa chọn phương thức tiện lợi nhất cho bạn.</p>
                        
                        <div className="d-flex flex-column gap-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="d-flex align-items-start gap-3">
                                    <div className="contact-info-icon" style={{ zIndex: editable ? 9 : 1 }}>
                                        {editable ? (
                                            <IconPicker 
                                                icon={`fa-solid ${item.icon || 'fa-circle-info'}`}
                                                onChange={async (val) => {
                                                    const cleanIcon = val.replace('fa-solid ', '').trim();
                                                    const newItems = [...items];
                                                    newItems[idx].icon = cleanIcon;
                                                    if (block?.id) {
                                                        try { await axios.put(route('cms.block.updateDTO', block.id), { listing_item: newItems }); } catch (e) { console.error(e); }
                                                    }
                                                    if (typeof onChange === 'function') { onChange('listing_item', newItems); }
                                                }}
                                                editable={true}
                                            />
                                        ) : (
                                            <i className={`fa-solid ${item.icon || 'fa-circle-info'}`}></i>
                                        )}
                                    </div>
                                    <div>
                                        <InlineEditable 
                                            block={block}
                                            property={`listing_item_${idx}_title`}
                                            value={item.title}
                                            onSave={async (val) => {
                                                const newItems = [...items];
                                                newItems[idx].title = val;
                                                if (block?.id) {
                                                    try { await axios.put(route('cms.block.updateDTO', block.id), { listing_item: newItems }); } catch (e) { console.error(e); }
                                                }
                                                if (editable && typeof onChange === 'function') { onChange('listing_item', newItems); }
                                            }}
                                            className="fw-bold mb-1 text-dark text-uppercase tracking-wider"
                                            style={{ fontSize: "0.8rem" }}
                                            as="h5"
                                        />
                                        <InlineEditable 
                                            block={block}
                                            property={`listing_item_${idx}_desc`}
                                            value={item.description}
                                            onSave={async (val) => {
                                                const newItems = [...items];
                                                newItems[idx].description = val;
                                                if (block?.id) {
                                                    try { await axios.put(route('cms.block.updateDTO', block.id), { listing_item: newItems }); } catch (e) { console.error(e); }
                                                }
                                                if (editable && typeof onChange === 'function') { onChange('listing_item', newItems); }
                                            }}
                                            className="text-muted mb-0"
                                            as="p"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Google Map */}
                        <div className="mt-4 pt-2">
                            <div className="ratio ratio-16x9 rounded overflow-hidden border position-relative">
                                <iframe 
                                    src={mapUrl} 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true} 
                                    loading="lazy"
                                ></iframe>
                                {editable && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{background: 'rgba(255,255,255,0.7)', pointerEvents: 'none'}}>
                                        <span className="badge bg-primary fs-6"><i className="fa-solid fa-map-location-dot me-2"></i>Chỉnh sửa Link Bản đồ ở Form bên dưới</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Form liên hệ (Children) */}
                    <div className="col-lg-7">
                        {children}
                    </div>

                </div>
            </div>
        </>
    );
}
