import React from 'react';
import BaseBlockForm from '../../BaseBlockForm';

const DummyFaqAccordion = () => <div>FaqAccordion Placeholder</div>;

export default function FaqAccordionForm({ block }) {
    return (
        <BaseBlockForm 
            block={block} 
            blockName="FAQ: Accordion" 
            PreviewComponent={DummyFaqAccordion} 
        />
    );
}
