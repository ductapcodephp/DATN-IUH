import React from "react";

export default function InstructorSection() {
    return (
        <section className="py-5">

            <div className="container py-4">

                <div className="text-center mb-5">
                    <h2 className="section-title mb-2">
                        Giảng viên tiêu biểu tuần này
                    </h2>

                    <p className="text-muted">
                        Những chuyên gia có tỷ lệ đánh giá cao nhất và nhiều học viên nhất.
                    </p>
                </div>


                <div className="row g-4">


                    <div className="col-lg-3 col-md-6">

                        <div className="instructor-card text-center p-4 border rounded shadow-sm position-relative overflow-hidden">

                            <div className="top-badge bg-warning text-dark fw-bold position-absolute top-0 start-0 w-100 py-1 font-sm">
                                <i className="fa-solid fa-trophy"></i> Top 1 Doanh Thu
                            </div>


                            <img
                                src="https://i.pravatar.cc/150?img=68"
                                className="rounded-circle mb-3 mt-4"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover"
                                }}
                                alt=""
                            />


                            <h5 className="fw-bold mb-1">
                                Nguyễn Văn A
                            </h5>


                            <p className="text-accent font-sm mb-3">
                                Fullstack Developer
                            </p>


                            <div className="d-flex justify-content-center gap-3 text-muted font-sm">

                                <span>
                                    <i className="fa-solid fa-star text-warning"></i> 4.9
                                </span>


                                <span>
                                    <i className="fa-solid fa-users"></i> 12.5k HV
                                </span>

                            </div>

                        </div>

                    </div>




                    <div className="col-lg-3 col-md-6">

                        <div className="instructor-card text-center p-4 border rounded hover-shadow transition-all">

                            <img
                                src="https://i.pravatar.cc/150?img=12"
                                className="rounded-circle mb-3"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover"
                                }}
                                alt=""
                            />


                            <h5 className="fw-bold mb-1">
                                Trần Trọng Trí
                            </h5>


                            <p className="text-accent font-sm mb-3">
                                Cloud Architect
                            </p>


                            <div className="d-flex justify-content-center gap-3 text-muted font-sm">

                                <span>
                                    <i className="fa-solid fa-star text-warning"></i> 4.8
                                </span>

                                <span>
                                    <i className="fa-solid fa-users"></i> 8.2k HV
                                </span>

                            </div>


                        </div>

                    </div>





                    <div className="col-lg-3 col-md-6">

                        <div className="instructor-card text-center p-4 border rounded hover-shadow transition-all">


                            <img
                                src="https://i.pravatar.cc/150?img=33"
                                className="rounded-circle mb-3"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover"
                                }}
                                alt=""
                            />


                            <h5 className="fw-bold mb-1">
                                Lê Minh Đăng
                            </h5>


                            <p className="text-accent font-sm mb-3">
                                Product Designer
                            </p>


                            <div className="d-flex justify-content-center gap-3 text-muted font-sm">

                                <span>
                                    <i className="fa-solid fa-star text-warning"></i> 4.9
                                </span>


                                <span>
                                    <i className="fa-solid fa-users"></i> 6.1k HV
                                </span>

                            </div>


                        </div>

                    </div>





                    <div className="col-lg-3 col-md-6">

                        <div className="instructor-card text-center p-4 border rounded hover-shadow transition-all">


                            <img
                                src="https://i.pravatar.cc/150?img=47"
                                className="rounded-circle mb-3"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover"
                                }}
                                alt=""
                            />


                            <h5 className="fw-bold mb-1">
                                Hoàng Thủy Tiên
                            </h5>


                            <p className="text-accent font-sm mb-3">
                                Data Scientist
                            </p>


                            <div className="d-flex justify-content-center gap-3 text-muted font-sm">

                                <span>
                                    <i className="fa-solid fa-star text-warning"></i> 4.7
                                </span>


                                <span>
                                    <i className="fa-solid fa-users"></i> 4.5k HV
                                </span>

                            </div>


                        </div>

                    </div>



                </div>

            </div>

        </section>
    );
}