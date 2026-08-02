import React from 'react';
import BaseBlockForm from '../../BaseBlockForm';
import StatsBlock from '@/Pages/Frontend/About/StatsBlock';

export default function AboutStatsForm({ block }) {
    const fieldsConfig = ['title', 'listing_item'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="About: Stats Block" 
            PreviewComponent={StatsBlock} 
        />
    );
}
