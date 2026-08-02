import React, { useState, useEffect } from "react";
import InlineEditable from "@/Components/CMS/InlineEditable";
import IconPicker from "@/Components/CMS/IconPicker";

export default function PartnersBlock({ block, editable, onChange }) {
    const [items, setItems] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        let parsedItems = block?.content?.listing_item || block?.content?.listingItem || [];
        setItems(parsedItems);
    }, [block]);

    const handleItemChange = (index, key, newValue) => {
        if (!editable) return;
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: newValue };
        setItems(newItems);
        setIsDirty(true);
    };

    const handleAddItem = () => {
        if (!editable) return;
        setIsAdding(true);
        setTimeout(() => {
            const newItems = [...items, { icon: "fa-solid fa-building", name: "Đối tác mới" }];
            setItems(newItems);
            setIsAdding(false);
            setIsDirty(true);
        }, 100);
    };
    
    const handleRemoveItem = (index) => {
        if (!editable) return;
        
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa đối tác này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa!',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    const newItems = items.filter((_, i) => i !== index);
                    setItems(newItems);
                    setIsDirty(true);
                }
            });
        });
    };

    const handleSaveListing = () => {
        if (!editable || !onChange) return;
        onChange('listing_item', items);
        setIsDirty(false);
    };

    return (
        <section className="py-5 border-top position-relative">
            {editable && isDirty && (
                <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 100 }}>
                    <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={handleSaveListing}>
                        <i className="fa-solid fa-save me-1"></i> Lưu danh sách Đối tác
                    </button>
                </div>
            )}
            
            <div className="container py-4 text-center">
                <InlineEditable
                    block={block}
                    property="title"
                    value={block?.title || "Tiêu đề đối tác..."}
                    as="p"
                    className="text-muted fw-semibold mb-4 text-uppercase tracking-wide"
                    onSave={editable ? (val) => onChange && onChange('title', val) : null}
                />
                
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-lg-5 opacity-50" style={editable ? { opacity: 1 } : {}}>
                    {items.map((item, index) => (
                        <div key={index} className="position-relative p-2" style={editable ? { border: '1px dashed rgba(59, 130, 246, 0.5)', borderRadius: '8px' } : {}}>
                            {editable && (
                                <button 
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 mt-n2 me-n2 shadow-sm"
                                    style={{ zIndex: 10, width: '20px', height: '20px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            )}
                            
                            <h3 className="fw-bold mb-0 text-dark d-flex align-items-center">
                                <IconPicker 
                                    icon={item.icon || "fa-solid fa-building"} 
                                    onChange={(ic) => handleItemChange(index, 'icon', ic)}
                                    editable={editable}
                                    className="me-2"
                                />
                                <span 
                                    contentEditable={editable}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => handleItemChange(index, 'name', e.currentTarget.textContent)}
                                    style={editable ? { cursor: "text", padding: "0 4px", borderBottom: "1px dashed #ccc" } : {}}
                                >
                                    {item.name}
                                </span>
                            </h3>
                        </div>
                    ))}
                    
                    {editable && (
                        <button className="btn btn-outline-primary btn-sm rounded-pill ms-3" onClick={handleAddItem} disabled={isAdding}>
                            <i className="fa-solid fa-plus"></i> Thêm
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
