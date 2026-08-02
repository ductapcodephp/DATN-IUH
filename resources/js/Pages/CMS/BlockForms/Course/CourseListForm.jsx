import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import CourseListBlock from '@/Pages/Frontend/Blocks/Course/CourseListBlock';

export default function CourseListForm(props) {
    return (
        <BaseBlockForm
            {...props}
            PreviewComponent={CourseListBlock}
            blockName="Khóa học: Danh sách"
        />
    );
}
