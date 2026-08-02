import React, { useState, useEffect } from "react";
import InlineEditable from "@/Components/CMS/InlineEditable";
import IconPicker from "@/Components/CMS/IconPicker";
import InlineEditableImage from "@/Components/CMS/InlineEditableImage";

export default function StoryBlock({ block, editable, onChange }) {
    const title = block?.title || "Tiêu đề câu chuyện";
    
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
            const newItems = [...items, { icon: "fa-solid fa-star", iconColor: "text-primary", title: "Mục tiêu", desc: "Mô tả ở đây." }];
            setItems(newItems);
            setIsAdding(false);
            setIsDirty(true);
        }, 100);
    };
    
    const handleRemoveItem = (index) => {
        if (!editable) return;
        
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa mục này?',
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
        <section className="py-5">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="hero-img-wrap">
                            <InlineEditableImage 
                                block={block} 
                                property="image"
                                className="img-fluid rounded-4"
                                defaultSrc="/assets/frontend/img/about-team.jpg"
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <InlineEditable
                            block={block}
                            property="title"
                            value={block?.title || ""}
                            as="h2"
                            className="section-title mb-4"
                            onSave={editable ? (val) => onChange && onChange('title', val) : null}
                            placeholder="Nhập tiêu đề (vd: Chúng tôi bắt đầu như thế nào?)"
                        />
                        
                        <div className="text-muted lh-lg mb-4 position-relative" style={editable ? { border: '1px dashed rgba(59, 130, 246, 0.5)', padding: '10px', borderRadius: '8px' } : {}}>
                            {editable && <div className="position-absolute top-0 end-0 bg-primary text-white small px-2 rounded-bottom shadow-sm" style={{ transform: 'translateY(-100%)' }}>Mô tả (HTML)</div>}
                            <InlineEditable
                                block={block}
                                property="description"
                                value={block?.description || ""}
                                as="div"
                                isHtml={true}
                                onSave={editable ? (val) => onChange && onChange('description', val) : null}
                                placeholder="Nhập đoạn mô tả HTML vào đây..."
                            />
                        </div>
                        
                        {editable && isDirty && (
                            <div className="mb-3 text-end">
                                <button 
                                    className="btn btn-sm btn-success rounded-pill px-4 shadow-sm"
                                    onClick={handleSaveListing}
                                >
                                    <i className="fa-solid fa-save me-1"></i> Lưu thay đổi danh sách
                                </button>
                            </div>
                        )}
                        
                        <div className="row g-3">
                            {items.map((item, index) => {
                                const defaultIcon = index === 0 ? "fa-solid fa-bullseye" : (index === 1 ? "fa-solid fa-heart" : "fa-solid fa-star");
                                const defaultColor = index === 0 ? "text-accent" : (index === 1 ? "text-fire" : "text-primary");
                                
                                return (
                                <div className="col-sm-6 position-relative" key={index}>
                                    {editable && (
                                        <button 
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 shadow-sm"
                                            style={{ zIndex: 10, width: '24px', height: '24px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => handleRemoveItem(index)}
                                            title="Xóa mục này"
                                        >
                                            <i className="fa-solid fa-times font-sm"></i>
                                        </button>
                                    )}
                                    <div className="roadmap-card h-100 p-3" style={editable ? { cursor: "text", border: '1px dashed rgba(59, 130, 246, 0.3)' } : { cursor: "default" }}>
                                        <div>
                                            <h5 className={`fw-bold ${item.iconColor || defaultColor} mb-1 d-flex align-items-center`}>
                                                <IconPicker 
                                                    icon={item.icon || defaultIcon} 
                                                    color={item.iconColor || defaultColor}
                                                    onChange={(ic) => handleItemChange(index, 'icon', ic)}
                                                    onColorChange={(c) => handleItemChange(index, 'iconColor', c)}
                                                    editable={editable}
                                                    className="me-2"
                                                />
                                                <InlineEditable
                                                    block={block}
                                                    property="listing_item"
                                                    value={item.title}
                                                    onSave={editable ? (val) => handleItemChange(index, 'title', val) : null}
                                                    as="span"
                                                    style={{ minHeight: "1.2em", display: 'inline-block', flex: 1 }}
                                                />
                                            </h5>
                                            <InlineEditable
                                                block={block}
                                                property="listing_item"
                                                value={item.desc}
                                                onSave={editable ? (val) => handleItemChange(index, 'desc', val) : null}
                                                as="p"
                                                className="text-muted mb-0 font-sm"
                                                style={{ minHeight: "1.2em" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )})}

                            {/* Nút thêm mới */}
                            {editable && (
                                <div className="col-sm-6">
                                    <div 
                                        className="roadmap-card h-100 p-3 d-flex flex-column align-items-center justify-content-center"
                                        style={{ 
                                            borderStyle: 'dashed', 
                                            borderColor: 'rgba(0,0,0,0.2)', 
                                            background: 'rgba(248, 250, 252, 0.5)',
                                            cursor: 'pointer',
                                            minHeight: '100px'
                                        }}
                                        onClick={handleAddItem}
                                    >
                                        <div className="text-center">
                                            {isAdding ? (
                                                <div className="spinner-border text-primary spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                                                        <i className="fa-solid fa-plus"></i>
                                                    </div>
                                                    <span className="text-muted fw-medium font-sm">Thêm Mục Mới</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
