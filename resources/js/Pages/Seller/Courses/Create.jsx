import React from 'react';
import CourseForm from './CourseForm.jsx';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";

export default function Create({ parentCourses, categories }) {
    return <CourseForm parentCourses={parentCourses} categories={categories} />;
}
Create.layout = page => <SellerLayout children={page} />;
