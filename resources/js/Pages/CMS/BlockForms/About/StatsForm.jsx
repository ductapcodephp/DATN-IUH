import React from "react";
import ListItemsForm from "../ListItemsForm";

export default function StatsForm({ block }) {
    const fieldsConfig = [
        { name: "value", label: "Giá trị (VD: 50k+, 95%)", width: 6 },
        { name: "label", label: "Nhãn (VD: Học viên tin tưởng)", width: 6 }
    ];

    return (
        <ListItemsForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            formTitle="Thống kê (Stats)" 
            formDesc="Quản lý các con số ấn tượng của dự án." 
        />
    );
}
