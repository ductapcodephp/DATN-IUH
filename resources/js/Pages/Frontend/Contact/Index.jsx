import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head, usePage } from "@inertiajs/react";
import SweetAlert from '@/Components/SweetAlert';
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import ContactPageBlock from "@/Pages/Frontend/Blocks/Contact/ContactPageBlock";

export default function Index({ contactTopics, blocks = [] }) {
    const { flash } = usePage().props;

    // Contact info block is likely the first one, or we just pass it down via BlockRenderer
    // The existing code passed contactBlock to ContactInfo.
    // The user's new ContactPageBlock wraps ContactInfo, so we can just render the blocks directly.

    return (
        <FrontendLayout>
            <Head title="Liên hệ với chúng tôi" />
            
            <SweetAlert
                show={!!flash.success}
                type="toast"
                icon="success"
                title={flash.success}
            />

            {blocks && blocks.length > 0 ? blocks.map((block, idx) => (
                <BlockRenderer 
                    key={block.id} 
                    block={block} 
                    extraData={{ 
                        contactTopics,
                        contactBlock: blocks.find(b => b.type === 'contact_info_block') 
                    }} 
                />
            )) : (
                <ContactPageBlock contactTopics={contactTopics} />
            )}
        </FrontendLayout>
    );
}
