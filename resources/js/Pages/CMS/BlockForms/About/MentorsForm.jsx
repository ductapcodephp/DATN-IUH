import React from "react";
import ListItemsForm from "../ListItemsForm";

export default function MentorsForm({ block }) {
    const fieldsConfig = [
        { name: "image", label: "Đường dẫn Ảnh đại diện", width: 12 },
        { name: "name", label: "Họ và tên", width: 6 },
        { name: "role", label: "Chức vụ (VD: Founder)", width: 6 },
        { name: "desc", label: "Mô tả ngắn về Mentor", width: 12, type: "textarea" }
    ];

    return (
        <ListItemsForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            formTitle="Đội ngũ Mentor" 
            formDesc="Quản lý thông tin các Mentor giảng dạy." 
        />
    );
}
