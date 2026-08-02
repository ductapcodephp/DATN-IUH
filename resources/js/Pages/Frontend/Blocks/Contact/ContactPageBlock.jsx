import React from 'react';
import { useForm, usePage } from "@inertiajs/react";
import ContactInfo from "@/Pages/Frontend/Contact/ContactInfo";

export default function ContactPageBlock({ block, editable, contactTopics, onChange }) {
    const isMock = editable || !contactTopics;

    const mockTopics = [
        { id: 1, name: 'Hỗ trợ kỹ thuật' },
        { id: 2, name: 'Thanh toán & Hóa đơn' },
        { id: 3, name: 'Tư vấn khóa học' }
    ];

    const currentTopics = isMock ? mockTopics : contactTopics;

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const submit = (e) => {
        e.preventDefault();
        if (isMock) {
            alert('Mock mode: Gửi liên hệ thành công!');
            reset();
            return;
        }
        post(route('frontend.contact.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <ContactInfo block={block} editable={editable} onChange={onChange}>
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
                                {currentTopics && currentTopics.map((topic) => (
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
        </ContactInfo>
    );
}
