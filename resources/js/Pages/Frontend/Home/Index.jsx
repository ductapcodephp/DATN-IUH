import React from "react";

import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";

import BlockRenderer from "@/Pages/Frontend/Blocks/BlockRenderer";

export default function Home({sponsoredCourses, topInstructors, enrolledCourseIds, blocks = []}) {
    return (
        <>
            {blocks.map(block => (
                <BlockRenderer 
                    key={block.id} 
                    block={block} 
                    extraData={{ courses: sponsoredCourses, instructors: topInstructors, enrolledCourseIds }}
                />
            ))}
        </>
    );
}


Home.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);
