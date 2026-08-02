import React, { useState } from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, useForm, router, Head } from "@inertiajs/react";
import SweetAlert from '@/Components/SweetAlert';
import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";

import CourseDetailBlock from "@/Pages/Frontend/Blocks/Course/CourseDetailBlock";

export default function Detail({ course, relatedCourses, isEnrolled, enrollment, reviews, userReview, post, page, blocks, blockTypesConfig }) {

    return (
        <>
            <Head title={post?.title || page?.name || course?.title || "Chi tiết khóa học"} />

            <CourseDetailBlock 
                course={course}
                relatedCourses={relatedCourses}
                isEnrolled={isEnrolled}
                enrollment={enrollment}
                reviews={reviews}
                userReview={userReview}
            />

            {blocks && blocks.length > 0 && blocks.map(block => (
                <BlockRenderer 
                    key={block.id} 
                    block={block} 
                    extraData={{ course, relatedCourses, isEnrolled, enrollment, reviews, userReview }} 
                />
            ))}
        </>
    );
}

Detail.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);
