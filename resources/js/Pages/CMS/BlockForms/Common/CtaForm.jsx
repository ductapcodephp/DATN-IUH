import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import Cta from '@/Pages/Frontend/Blocks/Cta';

export default function CtaForm({ block }) {
    const fieldsConfig = ['title', 'description', 'button', 'url', 'background'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="CTA Block" 
            PreviewComponent={Cta} 
        />
    );
}
