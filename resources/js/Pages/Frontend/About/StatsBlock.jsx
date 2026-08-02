import React, { useState, useEffect } from "react";
import InlineEditable from "@/Components/CMS/InlineEditable";
import axios from "axios";

export default function StatsBlock({ block, isEditMode, editable, onChange }) {
    const [items, setItems] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        let parsedItems = block?.content?.listing_item || block?.content?.listingItem || [];
        setItems(parsedItems);
        setIsDirty(false);
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
            const newItems = [...items, { value: "0", label: "Tiêu đề mới" }];
            setItems(newItems);
            setIsDirty(true);
            setIsAdding(false);
        }, 100);
    };
    
    const handleRemoveItem = (index) => {
        if (!editable) return;
        
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa thống kê này?',
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
        <section className="py-5 text-center text-white position-relative" style={{ background: "linear-gradient(135deg, #1F2937, #111827)" }}>
            <div className="container py-4">
                {isEditMode && editable && isDirty && (
                    <div className="mb-4 text-end">
                        <button 
                            className="btn btn-sm btn-success rounded-pill px-4 shadow-sm"
                            onClick={handleSaveListing}
                        >
                            <i className="fa-solid fa-save me-1"></i> Lưu thay đổi danh sách
                        </button>
                    </div>
                )}
                <div className="row g-4 align-items-stretch">
                    {items.map((item, index) => (
                        <div className="col-6 col-md-3 position-relative" key={index}>
                            <div className="p-3 h-100 position-relative" style={isEditMode && editable ? { border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' } : {}}>
                                {isEditMode && editable && (
                                    <button 
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 z-3 rounded-circle shadow"
                                        style={{ transform: 'translate(25%, -25%)', width: '28px', height: '28px', padding: 0 }}
                                        onClick={() => handleRemoveItem(index)}
                                        title="Xóa ô này"
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                )}
                                <InlineEditable
                                    block={block}
                                    property="listing_item"
                                    value={item.value}
                                    onSave={(val) => handleItemChange(index, 'value', val)}
                                    as="h2"
                                    className="display-5 fw-bold mb-3"
                                    style={{ color: "var(--accent)", minHeight: "1.2em" }}
                                />
                                <InlineEditable
                                    block={block}
                                    property="listing_item"
                                    value={item.label}
                                    onSave={(val) => handleItemChange(index, 'label', val)}
                                    as="p"
                                    className="mb-0 fs-6 fw-semibold text-white-50 mt-2"
                                    style={{ minHeight: "1.2em" }}
                                />
                            </div>
                        </div>
                    ))}
                    
                    {/* Dashed Add Box */}
                    {isEditMode && editable && (
                        <div className="col-6 col-md-3">
                            <div 
                                className="h-100 d-flex flex-column align-items-center justify-content-center p-3"
                                style={{ 
                                    border: '2px dashed rgba(255, 255, 255, 0.3)', 
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    opacity: isAdding ? 0.5 : 1
                                }}
                                onClick={!isAdding ? handleAddItem : undefined}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--brand-purple)';
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                }}
                                title="Thêm ô thống kê"
                            >
                                {isAdding ? (
                                    <div className="spinner-border spinner-border-sm text-light mb-2"></div>
                                ) : (
                                    <i className="fa-solid fa-plus fs-3 mb-2" style={{ color: 'var(--brand-purple)' }}></i>
                                )}
                                <span className="text-white-50 fw-semibold">Thêm Listing</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
