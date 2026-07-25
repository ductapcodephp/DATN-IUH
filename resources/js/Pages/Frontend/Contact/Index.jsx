import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import SweetAlert from '@/Components/SweetAlert';

export default function Index({ contactTopics }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('frontend.contact.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <FrontendLayout>
            <Head title="Liên hệ với chúng tôi" />
            
            <SweetAlert
                show={!!flash.success}
                type="toast"
                icon="success"
                title={flash.success}
            />

            <section className="hero-section text-center py-5 mb-5">
                <div className="container py-2">
                    <h1 className="hero-title">Liên hệ với EduFlow</h1>
                    <p className="hero-desc col-lg-6 mx-auto mb-0">Kết nối với chúng tôi nếu bạn cần tư vấn lộ trình học tập, giải đáp dịch vụ hoặc hợp tác doanh nghiệp.</p>
                </div>
            </section>

            <div className="container mb-5">
                <div className="row g-5">
                    
                    {/* Cột trái: Thông tin liên hệ */}
                    <div className="col-lg-5">
                        <h2 className="section-title fs-3 mb-3">Thông tin kết nối</h2>
                        <p className="text-muted mb-4">Đội ngũ hỗ trợ của EduFlow luôn sẵn sàng phản hồi bạn trong vòng 24 giờ làm việc. Hãy lựa chọn phương thức tiện lợi nhất cho bạn.</p>
                        
                        <div className="d-flex flex-column gap-4">
                            {/* Địa chỉ */}
                            <div className="d-flex align-items-start gap-3">
                                <div className="contact-info-icon"><i className="fa-solid fa-location-dot"></i></div>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark text-uppercase tracking-wider" style={{ fontSize: "0.8rem" }}>Văn phòng chính</h5>
                                    <p className="text-muted mb-0">Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="d-flex align-items-start gap-3">
                                <div className="contact-info-icon"><i className="fa-solid fa-envelope"></i></div>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark text-uppercase tracking-wider" style={{ fontSize: "0.8rem" }}>Email hỗ trợ</h5>
                                    <p className="text-muted mb-0">support@eduflow.vn</p>
                                </div>
                            </div>

                            {/* Hotline */}
                            <div className="d-flex align-items-start gap-3">
                                <div className="contact-info-icon"><i className="fa-solid fa-phone"></i></div>
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark text-uppercase tracking-wider" style={{ fontSize: "0.8rem" }}>Hotline tư vấn</h5>
                                    <p className="text-muted mb-0">1900 1234 (8:00 - 22:00)</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Map */}
                        <div className="mt-4 pt-2">
                            <div className="ratio ratio-16x9 rounded overflow-hidden border">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.423169372332!2d106.7017555!3d10.7773539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b098f1%3A0x9e73722247b973a8!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1718873000000!5m2!1svi!2s" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true} 
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Form liên hệ */}
                    <div className="col-lg-7">
                        <div className="contact-form-wrap shadow-sm bg-white p-4 rounded-3 border">
                            <h3 className="fw-bold mb-2 fs-4 text-dark">Gửi lời nhắn cho chúng tôi</h3>
                            <p className="text-muted font-sm mb-4">Điền đầy đủ thông tin vào biểu mẫu dưới đây, EduFlow sẽ liên hệ lại ngay.</p>
                            
                            <form onSubmit={submit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="contactName" className="form-label font-sm fw-semibold text-dark">Họ và tên *</label>
                                        <input 
                                            type="text" 
                                            id="contactName" 
                                            className={`form-control-custom orange-input-focus ${errors.name ? 'is-invalid border-danger' : ''}`}
                                            placeholder="Ví dụ: Nguyễn Văn A" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required 
                                        />
                                        {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <label htmlFor="contactEmail" className="form-label font-sm fw-semibold text-dark">Địa chỉ Email *</label>
                                        <input 
                                            type="email" 
                                            id="contactEmail" 
                                            className={`form-control-custom orange-input-focus ${errors.email ? 'is-invalid border-danger' : ''}`}
                                            placeholder="name@example.com" 
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required 
                                        />
                                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                    </div>

                                    <div className="col-md-12">
                                        <label htmlFor="contactPhone" className="form-label font-sm fw-semibold text-dark">Số điện thoại *</label>
                                        <input 
                                            type="tel" 
                                            id="contactPhone" 
                                            className={`form-control-custom orange-input-focus ${errors.phone ? 'is-invalid border-danger' : ''}`}
                                            placeholder="Ví dụ: 0912345678" 
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            required 
                                        />
                                        {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                                    </div>

                                    <div className="col-md-12">
                                        <label htmlFor="contactSubject" className="form-label font-sm fw-semibold text-dark">Chủ đề cần hỗ trợ *</label>
                                        <select 
                                            id="contactSubject" 
                                            className={`form-select orange-input-focus ${errors.subject ? 'is-invalid border-danger' : ''}`}
                                            style={{ padding: '0.6rem 1rem' }}
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn chủ đề hỗ trợ --</option>
                                            {contactTopics && contactTopics.map((topic) => (
                                                <option key={topic.id} value={topic.name}>{topic.name}</option>
                                            ))}
                                            <option value="Khác">Khác</option>
                                        </select>
                                        {errors.subject && <div className="text-danger small mt-1">{errors.subject}</div>}
                                    </div>

                                    <div className="col-md-12">
                                        <label htmlFor="contactMessage" className="form-label font-sm fw-semibold text-dark">Nội dung tin nhắn *</label>
                                        <textarea 
                                            id="contactMessage" 
                                            className={`form-control-custom orange-input-focus ${errors.message ? 'is-invalid border-danger' : ''}`}
                                            rows="5" 
                                            placeholder="Nhập nội dung bạn cần chúng tôi hỗ trợ tại đây..." 
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            required
                                        ></textarea>
                                        {errors.message && <div className="text-danger small mt-1">{errors.message}</div>}
                                    </div>

                                    <div className="col-md-12 pt-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-dark w-100 py-3 fw-semibold btn-gradient-orange" 
                                            style={{ borderRadius: "6px" }}
                                            disabled={processing}
                                        >
                                            {processing ? 'Đang gửi...' : 'Gửi thông tin liên hệ'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </FrontendLayout>
    );
}
