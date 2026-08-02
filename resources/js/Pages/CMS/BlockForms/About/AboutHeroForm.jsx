import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import HeroBlock from '@/Pages/Frontend/About/HeroBlock';

export default function AboutHeroForm({ block }) {
    const fieldsConfig = ['title', 'description', 'image'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="About: Hero Block" 
            PreviewComponent={HeroBlock} 
        />
    );
}
