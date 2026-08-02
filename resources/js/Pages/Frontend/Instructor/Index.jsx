import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import InstructorListBlock from "@/Pages/Frontend/Blocks/Instructor/InstructorListBlock";

export default function Index({ instructors, filters, page, post, blocks }) {
    return (
        <FrontendLayout>
            <Head title={post?.title || page?.name || "Đội ngũ giảng viên"} />
            
            {blocks && blocks.length > 0 ? (
                blocks.map(block => (
                    <BlockRenderer 
                        key={block.id} 
                        block={block} 
                        extraData={{ instructors, filters }} 
                    />
                ))
            ) : (
                <InstructorListBlock instructors={instructors} filters={filters} />
            )}
        </FrontendLayout>
    );
}
