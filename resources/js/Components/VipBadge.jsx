import React from 'react';

export default function VipBadge({ isUserVip, isSellerVip, userVipBadge, sellerVipBadge, className = '' }) {
    if (isSellerVip && sellerVipBadge) {
        return (
            <span className={`badge bg-fire text-white ${className}`} style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <i className="fa-solid fa-crown text-warning"></i> {sellerVipBadge}
            </span>
        );
    }
    
    if (isUserVip && userVipBadge) {
        return (
            <span className={`badge bg-primary text-white ${className}`} style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(45deg, #0284c7, #38bdf8)' }}>
                <i className="fa-solid fa-star text-warning"></i> {userVipBadge}
            </span>
        );
    }

    return null;
}
