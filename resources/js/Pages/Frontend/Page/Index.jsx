import React from 'react';
import { Head } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';
import BlockRenderer from '@/Pages/Frontend/Blocks/BlockRenderer';

export default function Index({ post, page, blocks }) {
    const sortedBlocks = blocks || [];

    return (
        <FrontendLayout>
            <Head title={post?.title || page?.name || 'Page'} />
            
            {sortedBlocks.length > 0 ? (
                sortedBlocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} />
                ))
            ) : (
                <section className="py-5">
                    <div className="container text-center">
                        <i className="fa-solid fa-layer-group fa-3x text-muted mb-3"></i>
                        <h3 className="text-muted">Trang này chưa có nội dung</h3>
                        <p className="text-muted">Vui lòng vào CMS để thêm các Block cho trang này.</p>
                    </div>
                </section>
            )}
        </FrontendLayout>
    );
}
