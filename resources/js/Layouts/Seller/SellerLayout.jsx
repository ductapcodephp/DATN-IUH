import React from "react";
import { Head } from "@inertiajs/react";

import SellerHeader from "@/Pages/Seller/SellerHeader";
import SellerSidebar from "@/Pages/Seller/SellerSidebar";


export default function SellerLayout({ children }) {

    return (
        <>

            <Head>
                <link rel="stylesheet" href="/assets/seller/css/seller.css" />
                <link rel="stylesheet" href="/assets/seller/css/curriculum.css" />
                <link rel="stylesheet" href="/assets/seller/css/courses.css" />
                <link rel="stylesheet" href="/assets/seller/css/profile.css" />
            </Head>


            <SellerHeader />


            <div className="body-wrap">

                <SellerSidebar />


                <div className="main">

                    {children}

                </div>


            </div>


        </>
    );
}