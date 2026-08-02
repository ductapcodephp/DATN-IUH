import React, { useEffect, useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router, usePage, Head } from "@inertiajs/react";
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";
import CourseListBlock from "@/Pages/Frontend/Blocks/Course/CourseListBlock";

export default function Index({ courses, categories, filters, enrolledCourseIds, post, page, blocks, blockTypesConfig }) {
    
    return (
        <FrontendLayout>
            <Head title={post?.title || page?.name || "Khóa học"} />

            {blocks && blocks.length > 0 ? (
                blocks.map(block => (
                    <BlockRenderer key={block.id} block={block} extraData={{ courses, categories, filters, enrolledCourseIds }} />
                ))
            ) : (
                <CourseListBlock extraData={{ courses, categories, filters, enrolledCourseIds }} />
            )}
        </FrontendLayout>
    );
}
