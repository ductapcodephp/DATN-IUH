import React from 'react';
import BaseBlockForm from '../../BaseBlockForm';
import ContactInfo from '@/Pages/Frontend/Contact/ContactInfo';

export default function ContactInfoForm({ block }) {
    const fieldsConfig = ['title', 'description', 'listing_item'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="Contact: Info Block" 
            // Mock children so preview renders correctly without real form
            PreviewComponent={(props) => (
                <ContactInfo {...props}>
                    <div className="contact-form-wrap shadow-sm bg-white p-4 rounded-3 border">
                        <h3 className="fw-bold mb-2 fs-4 text-dark">Gửi lời nhắn cho chúng tôi (Preview Form)</h3>
                        <div className="p-5 bg-light text-center border">Form liên hệ giữ nguyên logic, không hiển thị đầy đủ trong Preview này.</div>
                    </div>
                </ContactInfo>
            )} 
        />
    );
}
