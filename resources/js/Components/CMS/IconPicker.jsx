import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const POPULAR_ICONS = [
    // Solid icons
    "fa-solid fa-star", "fa-solid fa-heart", "fa-solid fa-bullseye", "fa-solid fa-check", 
    "fa-solid fa-code", "fa-solid fa-users-gear", "fa-solid fa-briefcase", "fa-solid fa-graduation-cap",
    "fa-solid fa-laptop-code", "fa-solid fa-rocket", "fa-solid fa-lightbulb", "fa-solid fa-gem",
    "fa-solid fa-bolt", "fa-solid fa-fire", "fa-solid fa-shield-halved", "fa-solid fa-crown",
    "fa-solid fa-award", "fa-solid fa-medal", "fa-solid fa-chart-line", "fa-solid fa-chart-pie",
    "fa-solid fa-thumbs-up", "fa-solid fa-handshake", "fa-solid fa-earth-americas", "fa-solid fa-globe",
    "fa-solid fa-map-location-dot", "fa-solid fa-compass", "fa-solid fa-location-dot", "fa-solid fa-house",
    "fa-solid fa-building", "fa-solid fa-city", "fa-solid fa-shop", "fa-solid fa-store",
    "fa-solid fa-user", "fa-solid fa-user-tie", "fa-solid fa-user-graduate", "fa-solid fa-users",
    "fa-solid fa-comments", "fa-solid fa-message", "fa-solid fa-envelope", "fa-solid fa-phone",
    "fa-solid fa-mobile-screen", "fa-solid fa-laptop", "fa-solid fa-desktop", "fa-solid fa-tablet-screen-button",
    "fa-solid fa-camera", "fa-solid fa-video", "fa-solid fa-music", "fa-solid fa-microphone",
    "fa-solid fa-book", "fa-solid fa-bookmark", "fa-solid fa-file", "fa-solid fa-folder", "fa-solid fa-book-open", "fa-solid fa-chalkboard-user",
    "fa-solid fa-gear", "fa-solid fa-wrench", "fa-solid fa-hammer", "fa-solid fa-screwdriver-wrench",
    "fa-solid fa-magnifying-glass", "fa-solid fa-filter", "fa-solid fa-sliders", "fa-solid fa-list",
    "fa-solid fa-clock", "fa-solid fa-calendar-days", "fa-solid fa-bell", "fa-solid fa-calendar-check",
    // Brand icons
    "fa-brands fa-google", "fa-brands fa-microsoft", "fa-brands fa-aws", "fa-brands fa-figma", 
    "fa-brands fa-stripe", "fa-brands fa-apple", "fa-brands fa-meta", "fa-brands fa-amazon", 
    "fa-brands fa-facebook", "fa-brands fa-github", "fa-brands fa-linkedin", "fa-brands fa-twitter",
    "fa-brands fa-youtube", "fa-brands fa-instagram", "fa-brands fa-tiktok", "fa-brands fa-discord"
];

const COLORS = [
    { value: 'text-primary', bg: '#0d6efd' },
    { value: 'text-fire', bg: '#ff4d4f' },
    { value: 'text-accent', bg: '#6366f1' },
    { value: 'text-success', bg: '#198754' },
    { value: 'text-warning', bg: '#ffc107' },
    { value: 'text-danger', bg: '#dc3545' },
    { value: 'text-secondary', bg: '#6c757d' },
    { value: 'text-dark', bg: '#212529' },
];

export default function IconPicker({ icon, onChange, editable = false, className = "", color, onColorChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const baseIcon = onColorChange ? icon : (icon.replace(/text-[a-z-]+/g, '').trim() || 'fa-solid fa-star');
    const currentColor = onColorChange ? color : (icon.match(/text-[a-z-]+/)?.[0] || 'text-primary');

    const filteredIcons = POPULAR_ICONS.filter(i => i.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropUp = spaceBelow < 280 && rect.top > 280;
            
            setDropdownStyle({
                position: 'fixed',
                zIndex: 999999,
                top: dropUp ? 'auto' : `${rect.bottom + 5}px`,
                bottom: dropUp ? `${window.innerHeight - rect.top + 5}px` : 'auto',
                left: `${rect.left}px`,
                width: '280px'
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const handleScroll = (e) => {
                if (dropdownRef.current && dropdownRef.current.contains(e.target)) return;
                setIsOpen(false);
            };
            window.addEventListener('scroll', handleScroll, true);
            return () => window.removeEventListener('scroll', handleScroll, true);
        }
    }, [isOpen]);

    if (!editable) {
        return <i className={`${baseIcon} ${onColorChange ? '' : currentColor} ${className}`}></i>;
    }

    const handleIconSelect = (ic) => {
        if (onColorChange) {
            onChange(ic);
        } else {
            onChange(`${ic} ${currentColor}`);
        }
        setIsOpen(false);
    };

    const handleColorSelect = (cValue) => {
        if (onColorChange) {
            onColorChange(cValue);
        } else {
            onChange(`${baseIcon} ${cValue}`);
        }
    };

    return (
        <>
            <div 
                ref={buttonRef}
                className={`d-inline-flex align-items-center justify-content-center ${className} ${onColorChange ? '' : currentColor}`}
                style={{ 
                    cursor: 'pointer', 
                    border: '1px dashed rgba(59, 130, 246, 0.5)', 
                    borderRadius: '4px',
                    padding: '2px',
                    minWidth: '24px',
                    minHeight: '24px',
                    transition: 'all 0.2s'
                }}
                title="Nhấn để đổi Icon"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
                <i className={baseIcon}></i>
            </div>

            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    className="bg-white shadow-lg rounded-3 border p-2 d-flex flex-column"
                    style={dropdownStyle}
                >
                    <div className="mb-2 position-relative">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            placeholder="Tìm hoặc dán class/thẻ HTML (VD: <i class='fa-solid fa-car'>)" 
                            value={search}
                            onChange={(e) => {
                                let val = e.target.value;
                                const match = val.match(/class=["'](.*?)["']/);
                                if (match && match[1]) {
                                    val = match[1];
                                }
                                setSearch(val);
                            }}
                            autoFocus
                        />
                        {search.startsWith('fa-') && (
                            <button 
                                className="btn btn-sm btn-primary position-absolute top-0 end-0 h-100"
                                style={{ borderRadius: '0 4px 4px 0', border: 'none' }}
                                onClick={() => handleIconSelect(search.trim())}
                                title="Dùng icon này"
                            >
                                <i className="fa-solid fa-check"></i> Chọn
                            </button>
                        )}
                    </div>
                    <div 
                        className="d-flex flex-wrap gap-1 custom-scrollbar mb-2"
                        style={{ maxHeight: '180px', overflowY: 'auto' }}
                    >
                        {search.startsWith('fa-') && !filteredIcons.includes(search.trim()) && (
                            <div 
                                className="d-flex align-items-center justify-content-center border rounded border-primary bg-primary bg-opacity-10 text-primary"
                                style={{ width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}
                                onClick={() => handleIconSelect(search.trim())}
                                title="Áp dụng icon tùy chỉnh này"
                            >
                                <i className={search.trim()}></i>
                            </div>
                        )}
                        {filteredIcons.length > 0 ? filteredIcons.map(ic => (
                            <div 
                                key={ic}
                                className="d-flex align-items-center justify-content-center border rounded"
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    background: baseIcon === ic ? '#f1f5f9' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                                title={ic}
                                onClick={() => handleIconSelect(ic)}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = baseIcon === ic ? '#f1f5f9' : 'transparent'}
                            >
                                <i className={ic}></i>
                            </div>
                        )) : (
                            !search.startsWith('fa-') && <div className="text-muted text-center w-100 py-3 font-sm">Không tìm thấy icon</div>
                        )}
                    </div>
                    
                    <div className="border-top pt-2 mt-auto">
                        <div className="small text-muted mb-1 font-sm">Chọn màu sắc:</div>
                        <div className="d-flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <div 
                                    key={c.value}
                                    onClick={() => handleColorSelect(c.value)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: c.bg,
                                        cursor: 'pointer',
                                        border: currentColor === c.value ? '2px solid #000' : '2px solid transparent',
                                        boxShadow: currentColor === c.value ? '0 0 0 2px #fff inset' : 'none'
                                    }}
                                    title={c.value}
                                />
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
