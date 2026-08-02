import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import StoryBlock from '@/Pages/Frontend/About/StoryBlock';

export default function AboutStoryForm({ block }) {
    const fieldsConfig = ['title', 'sub_title', 'description', 'image', 'image_icon'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="About: Story Block" 
            PreviewComponent={StoryBlock} 
        />
    );
}
