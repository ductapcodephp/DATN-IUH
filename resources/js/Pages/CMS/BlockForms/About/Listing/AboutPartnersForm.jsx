import React from 'react';
import BaseBlockForm from '../../BaseBlockForm';
import PartnersBlock from '@/Pages/Frontend/About/PartnersBlock';

export default function AboutPartnersForm({ block }) {
    const fieldsConfig = ['title', 'listing_item'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="About: Partners Block" 
            PreviewComponent={PartnersBlock} 
        />
    );
}
