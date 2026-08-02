import React from 'react';
import ListItemsForm from '../ListItemsForm';
import CartBlock from '@/Pages/Frontend/Blocks/Cart/CartBlock';

export default function CartForm({ block }) {
    return (
        <ListItemsForm 
            block={block} 
            fieldsConfig={[
                { name: 'text', label: 'Nội dung (vd: 🔒 Bảo mật SSL)', type: 'text' }
            ]} 
            formTitle="Giỏ hàng: Chi tiết" 
            formDesc="Quản lý các cam kết bảo mật/hoàn tiền"
            PreviewComponent={CartBlock} 
        />
    );
}
