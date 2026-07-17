import React from 'react';

export default function OverlayPanel({ isOpen, onClose, title, children }) {
    return (
        <>
            <div className={`learn-overlay-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose}></div>
            <div className={`learn-overlay-panel ${isOpen ? 'is-open' : ''}`}>
                <div className="learn-overlay-header">
                    <h3 className="learn-overlay-title">{title}</h3>
                    <button className="learn-overlay-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="learn-overlay-body">
                    {children}
                </div>
            </div>
        </>
    );
}
