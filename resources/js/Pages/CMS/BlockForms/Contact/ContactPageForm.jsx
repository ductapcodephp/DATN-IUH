import React from 'react';
import ListItemsForm from '../ListItemsForm';
import ContactPageBlock from '@/Pages/Frontend/Blocks/Contact/ContactPageBlock';

export default function ContactPageForm({ block }) {
    return (
        <ListItemsForm 
            block={block} 
            blockFields={[
                { name: 'url', label: 'Mã nhúng Google Maps (iframe src hoặc URL)', type: 'text' }
            ]}
            fieldsConfig={[
                { name: 'title', label: 'Tiêu đề (VD: Văn phòng chính)', type: 'text', width: 4 },
                { name: 'description', label: 'Nội dung (VD: Quận 1, TP. HCM)', type: 'text', width: 4 },
                { name: 'icon', label: 'Icon (VD: fa-location-dot)', type: 'icon', width: 4 }
            ]} 
            formTitle="Liên hệ: Form Liên Hệ & Thông Tin" 
            formDesc="Quản lý phương thức liên hệ"
            PreviewComponent={ContactPageBlock} 
        />
    );
}
