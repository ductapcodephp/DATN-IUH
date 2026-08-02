import React from "react";

export default function TextBlock({ block, editable, onChange }) {
    return (
        <section className="py-5">
            <div className="container">
                {block?.title && (
                    <h2 
                        className="section-title mb-4"
                        contentEditable={editable}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => editable && onChange && onChange('title', e.currentTarget.textContent)}
                        style={editable ? { border: '2px dashed rgba(59, 130, 246, 0.5)', padding: '5px', outline: 'none', cursor: 'text' } : {}}
                    >
                        {block.title}
                    </h2>
                )}
                
                {block?.sub_title && (
                    <h4 
                        className="text-muted mb-4"
                        contentEditable={editable}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => editable && onChange && onChange('sub_title', e.currentTarget.textContent)}
                        style={editable ? { border: '2px dashed rgba(59, 130, 246, 0.5)', padding: '5px', outline: 'none', cursor: 'text' } : {}}
                    >
                        {block.sub_title}
                    </h4>
                )}

                <div dangerouslySetInnerHTML={{ __html: block?.content || '<p>Nội dung trống...</p>' }}></div>
            </div>
        </section>
    );
}
