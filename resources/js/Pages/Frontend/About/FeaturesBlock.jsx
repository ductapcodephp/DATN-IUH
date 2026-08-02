import React, { useState, useEffect } from "react";
import InlineEditable from "@/Components/CMS/InlineEditable";
import IconPicker from "@/Components/CMS/IconPicker";

export default function FeaturesBlock({ block, editable = false, onChange = null }) {
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
            const newItems = [...items, { icon: "fa-solid fa-star text-primary", title: "Tính năng mới", desc: "Mô tả tính năng mới của bạn ở đây." }];
            setItems(newItems);
            setIsAdding(false);
            setIsDirty(true);
        }, 100);
    };
    
    const handleRemoveItem = (index) => {
        if (!editable) return;
        
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa tính năng này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Đồng ý, Xóa!',
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
        <section className="py-5">
            <div className="container py-5">
                <div className="text-center mb-5">
                    <InlineEditable
                        block={block}
                        property="title"
                        value={block?.title || "Tiêu đề tính năng"}
                        as="h2"
                        className="section-title mb-2"
                        onSave={editable ? (val) => onChange && onChange('title', val) : null}
                        style={{ minHeight: "1.5em" }}
                        placeholder="Nhập tiêu đề khối (vd: Khác biệt tại EduFlow)"
                    />
                    <InlineEditable
                        block={block}
                        property="sub_title"
                        value={block?.sub_title || "Mô tả phụ..."}
                        as="p"
                        className="text-muted col-lg-8 mx-auto"
                        onSave={editable ? (val) => onChange && onChange('sub_title', val) : null}
                        style={{ minHeight: "1.5em" }}
                        placeholder="Nhập mô tả phụ..."
                    />
                </div>

                {editable && isDirty && (
                    <div className="mb-4 text-end">
                        <button 
                            className="btn btn-sm btn-success rounded-pill px-4 shadow-sm"
                            onClick={handleSaveListing}
                        >
                            <i className="fa-solid fa-save me-1"></i> Lưu thay đổi danh sách
                        </button>
                    </div>
                )}

                <div className="row g-4 mt-5 align-items-stretch">
                    {items.map((item, index) => (
                        <div className="col-md-4 position-relative" key={index}>
                            <div className="p-4 border rounded-3 bg-white h-100 shadow-sm position-relative" style={editable ? { border: '1px dashed rgba(0,0,0,0.1)' } : {}}>
                                {editable && (
                                    <button 
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 z-3 rounded-circle shadow"
                                        style={{ transform: 'translate(25%, -25%)', width: '28px', height: '28px', padding: 0 }}
                                        onClick={() => handleRemoveItem(index)}
                                        title="Xóa ô này"
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                )}
                                <div className="mb-4">
                                    <IconPicker 
                                        icon={item.icon || "fa-solid fa-star text-primary"} 
                                        onChange={(ic) => handleItemChange(index, 'icon', ic)}
                                        editable={editable}
                                        className="fs-1"
                                    />
                                </div>
                                <InlineEditable
                                    block={block}
                                    property="listing_item"
                                    value={item.title}
                                    onSave={editable ? (val) => handleItemChange(index, 'title', val) : null}
                                    as="h5"
                                    className="fw-bold mb-3"
                                    style={{ minHeight: "1.2em" }}
                                />
                                <InlineEditable
                                    block={block}
                                    property="listing_item"
                                    value={item.desc}
                                    onSave={editable ? (val) => handleItemChange(index, 'desc', val) : null}
                                    as="p"
                                    className="text-muted mb-0"
                                    style={{ minHeight: "1.2em" }}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Dashed Add Box */}
                    {editable && (
                        <div className="col-md-4">
                            <div 
                                className="h-100 d-flex flex-column align-items-center justify-content-center p-4 border rounded-3 shadow-sm"
                                style={{ 
                                    borderStyle: 'dashed !important', 
                                    borderColor: 'rgba(0, 0, 0, 0.2) !important', 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: 'rgba(0, 0, 0, 0.02)',
                                    opacity: isAdding ? 0.5 : 1,
                                    minHeight: '200px'
                                }}
                                onClick={!isAdding ? handleAddItem : undefined}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--wow-primary)';
                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                }}
                                title="Thêm tính năng"
                            >
                                {isAdding ? (
                                    <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                                ) : (
                                    <i className="fa-solid fa-plus fs-3 mb-2" style={{ color: 'var(--wow-primary)' }}></i>
                                )}
                                <span className="text-muted fw-semibold">Thêm Listing</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
