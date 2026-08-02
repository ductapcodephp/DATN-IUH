import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import BlogListBlock from "@/Pages/Frontend/Blocks/Blog/BlogListBlock";

export default function Index({ blocks, page, articles, categories }) {
    const hasBlocks = blocks && blocks.length > 0;

    return (
        <FrontendLayout>
            <Head title={page?.title || "Blog Công Nghệ & Khởi Nghiệp"} />
            
            {hasBlocks ? (
                blocks.map((block, index) => (
                    <BlockRenderer key={index} block={block} extraData={{ articles, categories }} />
                ))
            ) : (
                <BlogListBlock articles={articles} categories={categories} />
            )}
        </FrontendLayout>
    );
}
