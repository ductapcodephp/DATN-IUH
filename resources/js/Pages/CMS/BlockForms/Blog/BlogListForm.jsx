import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import BlogListBlock from '@/Pages/Frontend/Blocks/Blog/BlogListBlock';

export default function BlogListForm({ block }) {
    const fieldsConfig = [
        { name: 'title', label: 'Tiêu đề', type: 'text', placeholder: 'VD: Blog Chia Sẻ Kiến Thức' },
        { name: 'sub_title', label: 'Mô tả ngắn', type: 'textarea', placeholder: 'Nhập mô tả...' },
    ];

    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="Blog: Danh sách bài viết" 
            PreviewComponent={BlogListBlock} 
        />
    );
}
