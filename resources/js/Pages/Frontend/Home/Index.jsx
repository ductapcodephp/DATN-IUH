import React from "react";

import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";

import HeroSection from "./HeroSection";
import FeaturedCourses from "./FeaturedCourses";
import InstructorSection from "./InstructorSection";
import CategorySection from "./CategorySection";
import BecomeSeller from "./BecomeSeller";


export default function Home({vipCourses, topInstructors, enrolledCourseIds}) {

    return (
        <>
            <HeroSection />

            <FeaturedCourses courses={vipCourses} enrolledCourseIds={enrolledCourseIds} />

            <InstructorSection instructors={topInstructors} />

            <CategorySection />

            <BecomeSeller />
        </>
    );

}


Home.layout = page => (
    <FrontendLayout>
        {page}
    </FrontendLayout>
);