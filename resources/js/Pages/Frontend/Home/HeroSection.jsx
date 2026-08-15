import React from 'react';
import { Link } from '@inertiajs/react';
import InlineEditable from '@/Components/CMS/InlineEditable';
import InlineEditableImage from '@/Components/CMS/InlineEditableImage';
import NumberTicker from '@/Components/MagicUI/NumberTicker';
import ShimmerButton from '@/Components/MagicUI/ShimmerButton';

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

                        <div className="d-flex gap-3 align-items-center flex-wrap">
                            <ShimmerButton
                                asLink={true}
                                href={block?.url || "#vip-courses"}
                                background="var(--fire, #EA580C)"
                                className="shadow-sm"
                            >
                                <i className="fa-solid fa-rocket me-1"></i>
                                <InlineEditable block={block} property="button" as="span" />
                            </ShimmerButton>

                            <a href="#become-seller" className="btn btn-outline-dark fw-semibold bg-white px-4 py-2" style={{ height: "46px", display: "inline-flex", alignItems: "center" }}>
                                <InlineEditable block={block} property="sub_title" as="span" />
                            </a>
                        </div>

                    </div>

                    <div className="col-lg-6">
                        <div className="hero-img-wrap position-relative">

                            <div className="position-absolute top-0 start-0 translate-middle bg-white p-2 px-3 rounded shadow-sm z-1 d-none d-md-flex align-items-center gap-2 border border-light">
                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                                    <i className="fa-solid fa-users text-accent fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">
                                        <NumberTicker value={50000} suffix="+" duration={2200} />
                                    </h6>
                                    <span className="font-sm text-muted">Học viên tích cực</span>
                                </div>
                            </div>

                            <div
                                className="position-absolute bottom-0 end-0 translate-middle-y bg-white p-2 px-3 rounded shadow-sm z-1 d-none d-md-flex align-items-center gap-2 border border-light"
                                style={{ marginRight: "-20px" }}
                            >
                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                                    <i className="fa-solid fa-chalkboard-user text-fire fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">
                                        <NumberTicker value={1200} suffix="+" duration={2000} />
                                    </h6>
                                    <span className="font-sm text-muted">Chuyên gia giảng dạy</span>
                                </div>
                            </div>

                            <InlineEditableImage 
                                block={block} 
                                property="image" 
                                className="img-fluid rounded-4 shadow-sm" 
                                defaultSrc="/assets/frontend/img/about-team.jpg"
                            />

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

