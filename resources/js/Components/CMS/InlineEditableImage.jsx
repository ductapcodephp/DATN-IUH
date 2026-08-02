import React, { useRef, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import MediaPickerModal from './MediaPickerModal';

export default function InlineEditableImage({ block, property, className = '', style = {}, defaultSrc = '', onChange }) {
    const { props } = usePage();
    const isEditMode = props.isEditMode === true;
    
    const initialValue = isEditMode 
        ? (block?.[property] || '') 
        : (block?.[property] || defaultSrc);
    
    const [src, setSrc] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [showModal, setShowModal] = useState(false);

    if (!isEditMode) {
        const displaySrc = initialValue?.startsWith('http') || initialValue?.startsWith('/') ? initialValue : (initialValue ? `/storage/${initialValue}` : '');
        return <img src={displaySrc} className={className} style={style} alt="" />;
    }

    const handleClick = () => {
        setShowModal(true);
    };

    const handleSelectImage = (imagePath) => {
        setShowModal(false);
        saveImage(imagePath);
    };

    const saveImage = async (newUrl) => {
        setIsSaving(true);
        setSrc(newUrl);
        
        if (onChange) {
            onChange(newUrl);
            setIsSaving(false);
            return;
        }

        try {
            await axios.post(route('cms.block.updateProperty', block.id), {
                property,
                value: newUrl
            });
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    icon: 'success',
                    title: 'Đã lưu ảnh'
                });
            });
        } catch (err) {
            console.error(err);
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    icon: 'error',
                    title: 'Lỗi khi lưu ảnh'
                });
            });
        }
        setIsSaving(false);
    };

    const displaySrc = src ? (src.startsWith('http') || src.startsWith('/') ? src : `/storage/${src}`) : '';

    return (
        <>
            <div 
                className="inline-editable-image-wrapper" 
                style={{ position: 'relative', display: 'inline-block', minHeight: !src ? '150px' : 'auto', minWidth: !src ? '150px' : 'auto', width: !src ? '100%' : 'auto', ...style }}
                onClick={handleClick}
                title={`Nhấn để thay đổi ảnh: ${property}`}
            >
                {!src ? (
                    <div 
                        className={`d-flex flex-column align-items-center justify-content-center bg-light border border-dashed rounded ${className}`}
                        style={{ height: '100%', minHeight: '150px', cursor: 'pointer', ...style }}
                    >
                        <i className="fa-solid fa-image text-muted fs-1 mb-2"></i>
                        <span className="text-muted fw-semibold">Thêm ảnh</span>
                    </div>
                ) : (
                    <>
                        <img 
                            src={displaySrc} 
                            className={className} 
                            style={{ ...style, cursor: 'pointer', opacity: isSaving ? 0.5 : 1, transition: 'all 0.3s' }} 
                            alt="" 
                        />
                        <div className="inline-image-overlay" style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer', borderRadius: style.borderRadius || 0
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                            <span className="text-white fw-bold"><i className="fa-solid fa-camera"></i> Đổi Ảnh</span>
                        </div>
                    </>
                )}
            </div>

            <MediaPickerModal 
                show={showModal} 
                onClose={() => setShowModal(false)} 
                onSelect={handleSelectImage} 
            />
        </>
    );
}
