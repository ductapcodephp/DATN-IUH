import React from 'react';
import CourseForm from './CourseForm.jsx';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";

export default function Edit({ course }) {
    return <CourseForm course={course} />;
}
Edit.layout = page => <SellerLayout children={page} />;
