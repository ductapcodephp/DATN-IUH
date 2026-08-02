import React from 'react';
import BaseBlockForm from '../../BaseBlockForm';
import MentorsBlock from '@/Pages/Frontend/About/MentorsBlock';

export default function AboutMentorsForm({ block }) {
    const fieldsConfig = ['title', 'description', 'listing_item'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="About: Mentors Block" 
            PreviewComponent={MentorsBlock} 
        />
    );
}
