import React from 'react';
import { Link } from '@inertiajs/react';
import InlineEditable from '@/Components/CMS/InlineEditable';
import InlineEditableImage from '@/Components/CMS/InlineEditableImage';

export default function HeroSection({ block }) {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-lg-6 pe-lg-5 mb-5 mb-lg-0">

                        <InlineEditable 
                            block={block} 
                            property="title" 
                            as="h1" 
                            className="hero-title" 
                            isHtml={true}
                        />

                        <InlineEditable 
                            block={block} 
                            property="description" 
                            as="p" 
                            className="hero-desc" 
                            isHtml={true}
                        />

                        <div className="d-flex gap-3">
                            <a href={block?.url || "#vip-courses"} className="btn btn-fire">
                                <InlineEditable block={block} property="button" as="span" />
                            </a>

                            <a href="#become-seller" className="btn btn-outline-dark fw-semibold bg-white">
                                <InlineEditable block={block} property="sub_title" as="span" />
                            </a>
                        </div>

                    </div>

                    <div className="col-lg-6">
                        <div className="hero-img-wrap position-relative">

                            <div className="position-absolute top-0 start-0 translate-middle bg-white p-2 rounded shadow-sm z-1 d-none d-md-flex align-items-center gap-2">
                                <i className="fa-solid fa-users text-accent fs-4"></i>
                                <div>
                                    <h6 className="mb-0 fw-bold">50K+</h6>
                                    <span className="font-sm text-muted">Học viên</span>
                                </div>
                            </div>

                            <div
                                className="position-absolute bottom-0 end-0 translate-middle-y bg-white p-2 rounded shadow-sm z-1 d-none d-md-flex align-items-center gap-2"
                                style={{ marginRight: "-20px" }}
                            >
                                <i className="fa-solid fa-chalkboard-user text-fire fs-4"></i>
                                <div>
                                    <h6 className="mb-0 fw-bold">1.200+</h6>
                                    <span className="font-sm text-muted">Giảng viên</span>
                                </div>
                            </div>

                            <InlineEditableImage 
                                block={block} 
                                property="image" 
                                className="img-fluid" 
                                defaultSrc="/assets/frontend/img/about-team.jpg"
                            />

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
