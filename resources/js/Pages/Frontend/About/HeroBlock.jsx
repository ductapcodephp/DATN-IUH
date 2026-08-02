import React from "react";

export default function HeroBlock({ block, editable, onChange }) {
    const title = block?.title || "Tiêu đề Hero";
    const desc = block?.description || "Mô tả Hero...";
    
    return (
        <section className="hero-section text-center py-5">
            <div className="container py-3">
                <h1 
                    className="hero-title"
                    contentEditable={editable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => editable && onChange('title', e.currentTarget.textContent)}
                    style={editable ? { border: '2px dashed rgba(59, 130, 246, 0.5)', padding: '5px', outline: 'none', cursor: 'text' } : {}}
                    title={editable ? "Nhấn để sửa Tiêu đề" : ""}
                >
                    {title}
                </h1>
                <p 
                    className="hero-desc col-lg-8 mx-auto mt-3"
                    contentEditable={editable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => editable && onChange('description', e.currentTarget.textContent)}
                    style={editable ? { border: '2px dashed rgba(59, 130, 246, 0.5)', padding: '5px', outline: 'none', cursor: 'text' } : {}}
                    title={editable ? "Nhấn để sửa Đoạn văn" : ""}
                >
                    {desc}
                </p>
            </div>
        </section>
    );
}
