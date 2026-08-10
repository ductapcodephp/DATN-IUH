import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";

import Header from "@/Pages/Frontend/Header";
import Footer from "@/Pages/Frontend/Footer";
import ChatWidget from '@/Components/ChatWidget';
import SweetAlert from '@/Components/SweetAlert';
import { useState } from "react";

export default function FrontendLayout({ children }) {
    const { flash } = usePage().props;
    const [flashToast, setFlashToast] = useState({ show: false, type: 'success', title: '' });

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
                <link rel="stylesheet" href="/frontend/css/style.css" />
            </Head>

            <SweetAlert
                show={flashToast.show}
                type="toast"
                icon={flashToast.type}
                title={flashToast.title}
                onClose={() => setFlashToast({ show: false, type: 'success', title: '' })}
            />

            <Header />

            <main>
                {children}
            </main>
            <ChatWidget />
            <Footer />
        </>
    );
}
