import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import InstructorListBlock from '@/Pages/Frontend/Blocks/Instructor/InstructorListBlock';

export default function InstructorListForm({ block }) {
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={[]} 
            blockName="Giảng viên: Danh sách" 
            PreviewComponent={InstructorListBlock} 
        />
    );
}
