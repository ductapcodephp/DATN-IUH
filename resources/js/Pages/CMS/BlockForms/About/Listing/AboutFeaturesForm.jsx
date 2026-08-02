import React from 'react';
import BaseBlockForm from '../../BaseBlockForm';
import FeaturesBlock from '@/Pages/Frontend/About/FeaturesBlock';

export default function AboutFeaturesForm({ block }) {
    const fieldsConfig = ['title', 'sub_title', 'listing_item'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="About: Features Block" 
            PreviewComponent={FeaturesBlock} 
        />
    );
}
