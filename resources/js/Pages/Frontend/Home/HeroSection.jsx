import React from 'react';
import { Link } from '@inertiajs/react';

export default function HeroSection() {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-lg-6 pe-lg-5 mb-5 mb-lg-0">

                        <h1 className="hero-title">
                            Học hỏi từ hàng ngàn <br />
                            Chuyên gia hàng đầu.
                        </h1>

                        <p className="hero-desc">
                            Khám phá hơn 10.000+ khóa học từ các Giảng viên xuất sắc nhất.
                            Cập nhật kỹ năng mới và thăng tiến sự nghiệp ngay hôm nay.
                        </p>


                        <div className="d-flex gap-3">

                            <a
                                href="#vip-courses"
                                className="btn btn-fire"
                            >
                                Khám phá ngay
                            </a>


                            <a
                                href="#become-seller"
                                className="btn btn-outline-dark fw-semibold bg-white"
                            >
                                Trở thành Giảng viên
                            </a>

                        </div>

                    </div>


                    <div className="col-lg-6">

                        <div className="hero-img-wrap position-relative">


                            <div className="position-absolute top-0 start-0 translate-middle bg-white p-2 rounded shadow-sm z-1 d-none d-md-flex align-items-center gap-2">

                                <i className="fa-solid fa-users text-accent fs-4"></i>

                                <div>
                                    <h6 className="mb-0 fw-bold">
                                        50K+
                                    </h6>

                                    <span className="font-sm text-muted">
                                        Học viên
                                    </span>
                                </div>

                            </div>



                            <div
                                className="position-absolute bottom-0 end-0 translate-middle-y bg-white p-2 rounded shadow-sm z-1 d-none d-md-flex align-items-center gap-2"
                                style={{
                                    marginRight: "-20px"
                                }}
                            >

                                <i className="fa-solid fa-chalkboard-user text-fire fs-4"></i>


                                <div>

                                    <h6 className="mb-0 fw-bold">
                                        1.200+
                                    </h6>


                                    <span className="font-sm text-muted">
                                        Giảng viên
                                    </span>

                                </div>


                            </div>



                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Học viên EduFlow"
                                className="img-fluid"
                                loading="lazy"
                            />


                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}