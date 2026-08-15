import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";

import SellerHeader from "@/Pages/Seller/SellerHeader";
import SellerSidebar from "@/Pages/Seller/SellerSidebar";
import SweetAlert from '@/Components/SweetAlert';

export default function SellerLayout({ children }) {
    const { flash } = usePage().props;
    const [flashToast, setFlashToast] = useState({ show: false, type: 'success', title: '' });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setFlashToast({
                show: true,
                type: flash.success ? 'success' : 'error',
                title: flash.success || flash.error
            });
        }
    }, [flash]);

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/assets/seller/css/seller.css?v=3" />
                <link rel="stylesheet" href="/assets/seller/css/curriculum.css" />
                <link rel="stylesheet" href="/assets/seller/css/courses.css" />
                <link rel="stylesheet" href="/assets/seller/css/profile.css" />
            </Head>

            <SweetAlert
                show={flashToast.show}
                type="toast"
                icon={flashToast.type}
                title={flashToast.title}
                onClose={() => setFlashToast({ show: false, type: 'success', title: '' })}
            />

            {/* Mobile Drawer Backdrop */}
            <div 
                className={`seller-sidebar-backdrop ${mobileSidebarOpen ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
            ></div>

            <div className="seller-app-layout">
                <SellerSidebar 
                    isOpen={mobileSidebarOpen} 
                    onClose={() => setMobileSidebarOpen(false)} 
                />
                
                <div className="seller-app-right">
                    <SellerHeader 
                        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} 
                    />
                    <div className="seller-app-main">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

