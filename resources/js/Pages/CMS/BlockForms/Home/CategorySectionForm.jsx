import React from 'react';
import BaseBlockForm from '../BaseBlockForm';
import InlineEditable from '@/Components/CMS/InlineEditable';

function CategorySectionPreview({ block, onChange }) {
    return (
        <section className="py-5 bg-surface" style={{ pointerEvents: 'auto' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title mb-2">
                        <InlineEditable 
                            block={block} 
                            property="title" 
                            value={block?.title || 'Danh mục hàng đầu'}
                            as="span"
                        />
                    </h2>
                    <InlineEditable 
                        block={block} 
                        property="sub_title" 
                        value={block?.sub_title || 'Khám phá các khóa học theo chủ đề yêu thích của bạn.'}
                        as="p"
                        className="text-muted"
                    />
                </div>

                <div className="row g-4 pointer-events-none">
                    <div className="col-md-3">
                        <div className="roadmap-card text-center flex-column justify-content-center py-4 px-3">
                            <div className="cat-icon-wrap tech-web">
                                <i className="fas fa-code"></i>
                            </div>
                            <h5 className="cat-title mt-3">Lập trình Web</h5>
                            <div><span className="cat-count">1,450 Khóa học</span></div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="roadmap-card text-center flex-column justify-content-center py-4 px-3">
                            <div className="cat-icon-wrap tech-mobile">
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <h5 className="cat-title mt-3">Mobile Development</h5>
                            <div><span className="cat-count">820 Khóa học</span></div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="roadmap-card text-center flex-column justify-content-center py-4 px-3">
                            <div className="cat-icon-wrap tech-cloud">
                                <i className="fas fa-cloud"></i>
                            </div>
                            <h5 className="cat-title mt-3">DevOps & Cloud</h5>
                            <div><span className="cat-count">530 Khóa học</span></div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="roadmap-card text-center flex-column justify-content-center py-4 px-3">
                            <div className="cat-icon-wrap tech-ai">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h5 className="cat-title mt-3">AI & Data Science</h5>
                            <div><span className="cat-count">610 Khóa học</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function CategorySectionForm({ block }) {
    const fieldsConfig = ['title', 'sub_title'];
    return (
        <BaseBlockForm 
            block={block} 
            fieldsConfig={fieldsConfig} 
            blockName="Trang chủ: Danh mục khóa học" 
            PreviewComponent={CategorySectionPreview} 
        />
    );
}
