import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function InlineEditable({ block, property, value: propValue, onSave, as: Tag = 'div', className = '', style = {}, isHtml = false, placeholder = '' }) {
    const { props } = usePage();
    // Check if we are in CMS builder mode
    const isEditMode = props.isEditMode === true;
    const initialValue = propValue !== undefined ? propValue : (block?.[property] || '');
    
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (!isEditMode) {
        // Normal render for frontend
        if (isHtml) {
            return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: initialValue }} />;
        }
        return <Tag className={className} style={style}>{initialValue}</Tag>;
    }

    // CMS Builder Mode
    const handleBlur = async () => {
        setIsEditing(false);
        const newValue = elementRef.current.innerText; // for text, or innerHTML for isHtml
        if (newValue !== initialValue) {
            setIsSaving(true);
            try {
                let finalValue = newValue;
                if (isHtml) {
                    // Remove messy inline styles and classes injected by contenteditable
                    finalValue = elementRef.current.innerHTML
                        .replace(/ (style|class)="[^"]*"/gi, '')
                        .replace(/ (style|class)='[^']*'/gi, '');
                }

                if (onSave) {
                    await onSave(finalValue);
                    // Không hiện Toast nếu dùng onSave nội bộ (tránh spam)
                } else if (block?.id && property) {
                    await axios.post(route('cms.block.updateProperty', block.id), {
                        property,
                        value: finalValue
                    });
                    import('sweetalert2').then(({ default: Swal }) => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            icon: 'success',
                            title: 'Đã lưu thay đổi'
                        });
                    });
                }
            } catch (err) {
                console.error(err);
                import('sweetalert2').then(({ default: Swal }) => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        icon: 'error',
                        title: 'Lỗi khi lưu: ' + property
                    });
                });
            }
            setIsSaving(false);
        }
    };

    const [isHovered, setIsHovered] = useState(false);

    const commonProps = {
        ref: elementRef,
        className: `${className} ${isEditing ? 'inline-editing' : 'inline-editable'}`,
        style: {
            ...style,
            outline: isEditing ? '2px dashed var(--wow-primary)' : (isHovered ? '2px dashed rgba(59, 130, 246, 0.8)' : '1px dashed rgba(100, 116, 139, 0.3)'),
            outlineOffset: '2px',
            cursor: 'text',
            position: 'relative',
            transition: 'all 0.2s ease',
            ...(isSaving ? { opacity: 0.5 } : {})
        },
        contentEditable: true,
        suppressContentEditableWarning: true,
        onFocus: () => setIsEditing(true),
        onBlur: handleBlur,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        title: `Nhấn để sửa trực tiếp: ${property}`,
        "data-placeholder": placeholder || `Nhập ${property}...`
    };

    if (isHtml) {
        return <Tag {...commonProps} dangerouslySetInnerHTML={{ __html: value }} />;
    }

    return (
        <Tag {...commonProps}>
            {value}
            {!value && <span style={{ color: '#94a3b8', fontStyle: 'italic', opacity: 0.7, pointerEvents: 'none' }} contentEditable={false}>{placeholder || `Nhập ${property}...`}</span>}
        </Tag>
    );
}
