import React from 'react';
import CourseForm from './CourseForm.jsx';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";

export default function Create() {
    return <CourseForm />;
}
Create.layout = page => <SellerLayout children={page} />;
