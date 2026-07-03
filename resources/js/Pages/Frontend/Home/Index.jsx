import React from "react";

import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";

import HeroSection from "./HeroSection";
import FeaturedCourses from "./FeaturedCourses";
import InstructorSection from "./InstructorSection";
import CategorySection from "./CategorySection";
import BecomeSeller from "./BecomeSeller";


export default function Home({vipCourses}) {

    console.log(vipCourses);
    return (
        <>
            <HeroSection />

            <FeaturedCourses courses={vipCourses} />

            <InstructorSection />

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