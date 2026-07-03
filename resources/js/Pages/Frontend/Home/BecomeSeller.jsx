import React from "react";
import { Link } from "@inertiajs/react";


export default function BecomeSeller() {

    return (

        <section
            id="become-seller"
            className="cta-section"
            style={{
                background: "linear-gradient(135deg, #111827, #1E3A8A)"
            }}
        >

            <div className="container">


                <div className="row align-items-center">


                    <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">


                        <h2 className="fw-bold text-white mb-3">

                            Bạn là chuyên gia trong lĩnh vực của mình?

                        </h2>



                        <p className="text-light mb-4 fs-5 opacity-75 pe-lg-5">

                            Trở thành Giảng viên trên EduFlow để tiếp cận hàng triệu
                            học viên, chia sẻ kiến thức và tạo ra nguồn thu nhập
                            thụ động khổng lồ không giới hạn.

                        </p>



                        <ul className="text-light list-unstyled mb-4 d-flex flex-column gap-2 opacity-75">


                            <li>

                                <i className="fa-solid fa-check text-warning me-2"></i>

                                Tự do định giá khóa học của bạn.

                            </li>


                            <li>

                                <i className="fa-solid fa-check text-warning me-2"></i>

                                Công cụ hỗ trợ Marketing và đẩy Top (Ads).

                            </li>



                            <li>

                                <i className="fa-solid fa-check text-warning me-2"></i>

                                Nhận thanh toán doanh thu tự động hàng tháng.

                            </li>


                        </ul>





                        <Link
                            href="/seller/register"
                            className="btn btn-warning btn-lg fw-bold text-dark px-5 py-3"
                        >

                            Đăng ký làm Giảng viên

                        </Link>



                    </div>





                    <div className="col-lg-5 text-center">


                        <img

                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80"

                            alt="Become Instructor"

                            className="img-fluid rounded shadow-lg"

                            style={{
                                border: "4px solid rgba(255,255,255,0.1)"
                            }}

                        />


                    </div>



                </div>


            </div>


        </section>

    );
}