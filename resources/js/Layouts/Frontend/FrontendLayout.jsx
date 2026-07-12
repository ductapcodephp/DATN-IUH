import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";

import Header from "@/Pages/Frontend/Header";
import Footer from "@/Pages/Frontend/Footer";

export default function FrontendLayout({ children }) {

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/assets/frontend/css/frontend.css" />
                <link rel="stylesheet" href="/frontend/css/style.css" />
            </Head>

            <Header />

            <main>
                {children}
            </main>

            <Footer />
        </>
    );
}