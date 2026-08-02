import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import FaqListBlock from "@/Pages/Frontend/Blocks/Faq/FaqListBlock";

export default function Index({ faqCategories = [], post, page, blocks = [] }) {
    return (
        <FrontendLayout>
            <Head title={post?.title || page?.name || "Câu Hỏi Thường Gặp (FAQ)"} />

            {blocks && blocks.length > 0 ? (
                blocks.map(block => (
                    <BlockRenderer 
                        key={block.id} 
                        block={block} 
                        extraData={{ faqCategories }} 
                    />
                ))
            ) : (
                <FaqListBlock faqCategories={faqCategories} />
            )}
        </FrontendLayout>
    );
}
