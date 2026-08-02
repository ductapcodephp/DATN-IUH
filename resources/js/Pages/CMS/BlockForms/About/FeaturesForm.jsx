import React from "react";
import ListItemsForm from "../ListItemsForm";

export default function FeaturesForm({ block }) {
    const fieldsConfig = [
        { name: "icon", label: "Icon", width: 12, type: 'icon' },
        { name: "title", label: "Tiêu đề tính năng", width: 12 },
        { name: "desc", label: "Mô tả ngắn", width: 12, type: "textarea" }
    ];

    return (
        <ListItemsForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            formTitle="Điểm khác biệt (Features)" 
            formDesc="Quản lý danh sách các điểm nổi bật (Khác biệt tại EduFlow)." 
        />
    );
}
