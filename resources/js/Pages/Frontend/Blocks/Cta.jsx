import React, { useState, useEffect } from 'react';
import InlineEditable from "@/Components/CMS/InlineEditable";

export default function Cta({ block, editable, onChange }) {
    const [buttonText, setButtonText] = useState(block?.button || "");
    const [buttonUrl, setButtonUrl] = useState(block?.url || "");

    useEffect(() => {
        setButtonText(block?.button || "");
        setButtonUrl(block?.url || "");
    }, [block]);

    return (
        <section className="py-5 text-center bg-white border-top">
            <div className="container py-5">
                <InlineEditable
                    block={block}
                    property="title"
                    value={block?.title || "Tiêu đề CTA..."}
                    as="h2"
                    className="fw-bold mb-3"
                    onSave={editable ? (val) => onChange && onChange('title', val) : null}
                    style={{ minHeight: "1.2em" }}
                />
                
                <InlineEditable
                    block={block}
                    property="description"
                    value={block?.description || "Mô tả CTA..."}
                    as="p"
                    className="text-muted mb-4 fs-6 col-lg-6 mx-auto"
                    onSave={editable ? (val) => onChange && onChange('description', val) : null}
                    style={{ minHeight: "1.5em" }}
                />
                
                <div style={editable ? { border: '1px dashed rgba(59,130,246,0.5)', borderRadius: '8px', display: 'inline-block', padding: '15px' } : {}}>
                    {editable && (
                        <div className="mb-3 text-start">
                            <label className="form-label font-sm text-muted">Text Nút bấm:</label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm mb-2" 
                                placeholder="Khám phá khoá học ngay" 
                                value={buttonText} 
                                onChange={(e) => setButtonText(e.target.value)}
                                onBlur={() => {
                                    if (buttonText !== block?.button && onChange) {
                                        onChange('button', buttonText);
                                    }
                                }}
                            />
                            <label className="form-label font-sm text-muted">Đường dẫn URL:</label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                placeholder="/tech-education/courses" 
                                value={buttonUrl} 
                                onChange={(e) => setButtonUrl(e.target.value)}
                                onBlur={() => {
                                    if (buttonUrl !== block?.url && onChange) {
                                        onChange('url', buttonUrl);
                                    }
                                }}
                            />
                        </div>
                    )}
                    <a 
                        href={buttonUrl || "/tech-education/courses"} 
                        className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-semibold shadow-sm"
                        onClick={(e) => {
                            if (editable) e.preventDefault();
                        }}
                    >
                        {buttonText || "Khám phá khoá học ngay"}
                    </a>
                </div>
            </div>
        </section>
    );
}
