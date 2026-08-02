import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import HeroSection from '@/Pages/Frontend/Home/HeroSection';

export default function HomeHeroForm({ block }) {
    const fieldsConfig = ['title', 'description', 'image', 'button', 'url', 'sub_title'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="Trang chủ: Hero Banner" 
            PreviewComponent={HeroSection} 
        />
    );
}
