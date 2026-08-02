import React from "react";
import ListItemsForm from "../ListItemsForm";

export default function PartnersForm({ block }) {
    const fieldsConfig = [
        { name: "icon", label: "Icon Class (VD: fa-brands fa-google)", width: 6 },
        { name: "name", label: "Tên đối tác (VD: Google)", width: 6 }
    ];

    return (
        <ListItemsForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            formTitle="Đối tác (Partners)" 
            formDesc="Quản lý logo các công ty đối tác." 
        />
    );
}
