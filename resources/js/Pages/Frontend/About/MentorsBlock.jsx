import React, { useState, useEffect } from "react";
import InlineEditable from "@/Components/CMS/InlineEditable";
import MediaPickerModal from "@/Components/CMS/MediaPickerModal";

export default function MentorsBlock({ block, editable, onChange }) {
    const [items, setItems] = useState([]);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [editingImageIndex, setEditingImageIndex] = useState(null);
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
            const newItems = [...items, { image: "", name: "Tên Mentor", role: "Vai trò", desc: "Mô tả ngắn gọn về mentor này." }];
            setItems(newItems);
            setIsAdding(false);
            setIsDirty(true);
        }, 100);
    };
    
    const handleRemoveItem = (index) => {
        if (!editable) return;
        
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Xóa Mentor này?',
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
        <section className="py-5 bg-surface">
            <div className="container">
                <div className="text-center mb-5">
                    <InlineEditable
                        block={block}
                        property="title"
                        value={block?.title || "Tiêu đề..."}
                        as="h2"
                        className="section-title mb-2"
                        onSave={editable ? (val) => onChange && onChange('title', val) : null}
                    />
                    <InlineEditable
                        block={block}
                        property="sub_title"
                        value={block?.sub_title || "Mô tả phụ..."}
                        as="p"
                        className="text-muted"
                        onSave={editable ? (val) => onChange && onChange('sub_title', val) : null}
                    />
                </div>
                
                {editable && (
                    <div className="mb-4 d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm border border-primary border-opacity-25">
                        <div>
                            <h6 className="mb-0 text-primary fw-bold"><i className="fa-solid fa-users-cog me-2"></i>Chỉnh sửa danh sách Mentor</h6>
                            <small className="text-muted">Click trực tiếp vào chữ bên dưới để sửa tên, vai trò, mô tả.</small>
                        </div>
                        <div>
                            {isDirty && (
                                <button className="btn btn-success rounded-pill px-4 me-2 shadow-sm" onClick={handleSaveListing}>
                                    <i className="fa-solid fa-save me-1"></i> Lưu danh sách
                                </button>
                            )}
                            <button className="btn btn-outline-primary rounded-pill px-4 shadow-sm" onClick={handleAddItem} disabled={isAdding}>
                                {isAdding ? <><i className="fa-solid fa-spinner fa-spin me-1"></i> Đang thêm...</> : <><i className="fa-solid fa-plus me-1"></i> Thêm Mentor</>}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="row g-4">
                    {items.map((item, index) => (
                        <div className="col-12 col-md-6 col-lg-3 position-relative" key={index}>
                            {editable && (
                                <button 
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 mt-2 me-3 shadow-sm"
                                    style={{ zIndex: 10, width: '28px', height: '28px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => handleRemoveItem(index)}
                                    title="Xóa Mentor này"
                                >
                                    <i className="fa-solid fa-times font-sm"></i>
                                </button>
                            )}
                            <div className="review-card text-center bg-white h-100 p-4 rounded-3 border" style={editable ? { border: '1px dashed rgba(59, 130, 246, 0.5)' } : {}}>
                                <div 
                                    className="mx-auto position-relative rounded-circle border p-1 mb-3 bg-white d-flex align-items-center justify-content-center overflow-hidden" 
                                    style={{ width: "90px", height: "90px", cursor: editable ? "pointer" : "default" }}
                                    onClick={() => {
                                        if (editable) {
                                            setEditingImageIndex(index);
                                            setShowMediaPicker(true);
                                        }
                                    }}
                                    title={editable ? "Nhấn để đổi ảnh" : ""}
                                >
                                    {item.image ? (
                                        <img 
                                            src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/storage/${item.image}`} 
                                            alt={item.name} 
                                            className="w-100 h-100 rounded-circle" 
                                            style={{ objectFit: "cover" }}
                                            onError={(e) => { e.target.style.opacity = '0'; }}
                                        />
                                    ) : (
                                        editable && <i className="fa-solid fa-camera fs-4 text-black-50 opacity-25"></i>
                                    )}
                                </div>
                                
                                <div style={editable ? { cursor: "text", padding: "2px", border: "1px dashed #ccc", borderRadius: "4px" } : {}}>
                                    <h5 
                                        className="fw-bold mb-1"
                                        contentEditable={editable}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleItemChange(index, 'name', e.currentTarget.textContent)}
                                    >
                                        {item.name}
                                    </h5>
                                </div>
                                
                                <div className="mt-1" style={editable ? { cursor: "text", padding: "2px", border: "1px dashed #ccc", borderRadius: "4px" } : {}}>
                                    <span 
                                        className="text-accent font-sm d-block fw-semibold"
                                        contentEditable={editable}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleItemChange(index, 'role', e.currentTarget.textContent)}
                                    >
                                        {item.role}
                                    </span>
                                </div>
                                
                                <div className="mt-2" style={editable ? { cursor: "text", padding: "2px", border: "1px dashed #ccc", borderRadius: "4px" } : {}}>
                                    <p 
                                        className="text-muted font-sm mb-0"
                                        contentEditable={editable}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleItemChange(index, 'desc', e.currentTarget.textContent)}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {items.length === 0 && (
                        <div className="col-12 text-center py-5 text-muted">
                            {editable ? "Chưa có Mentor nào. Hãy bấm 'Thêm Mentor' để bắt đầu." : "Đang cập nhật danh sách Mentor."}
                        </div>
                    )}
                </div>
            </div>

            <MediaPickerModal 
                show={showMediaPicker}
                onClose={() => {
                    setShowMediaPicker(false);
                    setEditingImageIndex(null);
                }}
                onSelect={(imageUrl) => {
                    if (editingImageIndex !== null) {
                        handleItemChange(editingImageIndex, 'image', imageUrl);
                    }
                    setShowMediaPicker(false);
                    setEditingImageIndex(null);
                }}
            />
        </section>
    );
}
