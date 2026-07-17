import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FormModal({
    isOpen,
    onClose,
    title,
    subtitle,
    icon = <i className="fa-solid fa-pen"></i>,
    onSubmit,
    isSubmitting = false,
    maxWidth = '520px',
    children
}) {
    const modalRef = useRef(null);
    const [renderModal, setRenderModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRenderModal(true);
            setTimeout(() => setIsAnimating(true), 10);
            document.body.style.overflow = 'hidden';
            
            // Auto focus first input
            setTimeout(() => {
                if (modalRef.current) {
                    const firstInput = modalRef.current.querySelector('input, textarea, select');
                    if (firstInput) firstInput.focus();
                }
            }, 300);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setRenderModal(false);
                document.body.style.overflow = '';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
            // Basic focus trap
            if (e.key === 'Tab' && isOpen && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!renderModal) return null;

    const modalContent = (
        <div className={`form-modal-overlay ${isAnimating ? 'open' : ''}`} onClick={(e) => {
            if (e.target.classList.contains('form-modal-overlay')) {
                onClose();
            }
        }}>
            <div 
                className={`form-modal-container ${isAnimating ? 'open' : ''}`} 
                style={{ maxWidth: maxWidth }}
                ref={modalRef}
            >
                <div className="form-modal-header">
                    <div className="header-left">
                        <div className="header-icon">
                            {icon}
                        </div>
                        <div className="header-title-box">
                            <h3 className="header-title">{title}</h3>
                            {subtitle && <p className="header-subtitle">{subtitle}</p>}
                        </div>
                    </div>
                    <button type="button" className="header-close-btn" onClick={onClose}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <form onSubmit={onSubmit}>
                    <div className="form-modal-body">
                        {children}
                    </div>

                    <div className="form-modal-footer">
                        <button type="button" className="form-modal-btn-cancel" onClick={onClose} disabled={isSubmitting}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="form-modal-btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
