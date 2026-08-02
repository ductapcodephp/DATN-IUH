import React from 'react';
import CourseForm from './CourseForm.jsx';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";

export default function Edit({ course, parentCourses, categories }) {
    return <CourseForm course={course} parentCourses={parentCourses} categories={categories} />;
}
Edit.layout = page => <SellerLayout children={page} />;
