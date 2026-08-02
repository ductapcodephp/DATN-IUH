import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head, usePage } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import CartBlock from "@/Pages/Frontend/Blocks/Cart/CartBlock";
import SweetAlert from '@/Components/SweetAlert';

export default function Index({ cart, cartItems = [], totalAmount, popularCourses = [] , courseCoupons = [], instructorCoupons = [], platformCoupons = [], discountAmount = 0, appliedCoupons = [], blocks = [] }) {
    const { flash } = usePage().props;

    return (
        <FrontendLayout>
            <Head title="Giỏ hàng của bạn" />
            <SweetAlert
                show={!!flash.success}
                type="toast"
                icon="success"
                title={flash.success}
            />
            <SweetAlert
                show={!!flash.error}
                type="toast"
                icon="error"
                title={flash.error}
            />

            {blocks && blocks.length > 0 ? blocks.map(block => (
                <BlockRenderer 
                    key={block.id} 
                    block={block} 
                    extraData={{ 
                        cart, cartItems, totalAmount, popularCourses, 
                        courseCoupons, instructorCoupons, platformCoupons, 
                        discountAmount, appliedCoupons 
                    }} 
                />
            )) : (
                <CartBlock 
                    cart={cart}
                    cartItems={cartItems}
                    totalAmount={totalAmount}
                    popularCourses={popularCourses}
                    courseCoupons={courseCoupons}
                    instructorCoupons={instructorCoupons}
                    platformCoupons={platformCoupons}
                    discountAmount={discountAmount}
                    appliedCoupons={appliedCoupons}
                />
            )}
        </FrontendLayout>
    );
}
