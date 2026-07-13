import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Link, Head } from "@inertiajs/react";

export default function Index() {
    return (
        <FrontendLayout>
            <Head title="Về chúng tôi" />

            <section className="hero-section text-center py-5">
                <div className="container py-3">
                    <h1 className="hero-title">Câu chuyện & Sứ mệnh EduFlow</h1>
                    <p className="hero-desc col-lg-8 mx-auto">Chúng tôi đem lại giải pháp thu hẹp khoảng cách giữa Nhà trường và Doanh nghiệp thực chiến, giúp học viên làm chủ công nghệ mới nhất.</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="hero-img-wrap">
                                <img 
                                    src="/assets/frontend/img/about-team.jpg" 
                                    alt="Đội ngũ EduFlow" 
                                    className="img-fluid rounded-4"
                                    onError={(e) => { e.target.src = "/assets/frontend/img/default-course.png"; }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h2 className="section-title mb-4">Chúng tôi bắt đầu như thế nào?</h2>
                            <p className="text-muted lh-lg mb-3">Xuất phát từ những lập trình viên và quản lý dự án lâu năm, EduFlow nhận thấy khoảng cách lớn giữa lý thuyết học đường và thực tế doanh nghiệp.</p>
                            <p className="text-muted lh-lg mb-4">EduFlow ra đời nhằm giải quyết triệt để bài toán đó. Chúng tôi không dạy lý thuyết suông, mà tập trung giúp bạn hoàn thiện tư duy qua thực tế 80% thời lượng.</p>
                            
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div className="roadmap-card h-100 p-3" style={{ cursor: "default" }}>
                                        <div>
                                            <h5 className="fw-bold text-accent mb-1"><i className="fa-solid fa-bullseye me-1"></i> Tầm nhìn</h5>
                                            <p className="text-muted mb-0 font-sm">Trở thành nền tảng học lập trình thực chiến hàng đầu.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="roadmap-card h-100 p-3" style={{ cursor: "default" }}>
                                        <div>
                                            <h5 className="fw-bold text-fire mb-1"><i className="fa-solid fa-heart me-1"></i> Giá trị cốt lõi</h5>
                                            <p className="text-muted mb-0 font-sm">Đồng hành, thực chiến và chuẩn đầu ra doanh nghiệp.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 text-center text-white" style={{ background: "linear-gradient(135deg, #1F2937, #111827)" }}>
                <div className="container py-4">
                    <div className="row g-4">
                        <div className="col-6 col-md-3">
                            <h2 className="display-5 fw-bold mb-2" style={{ color: "var(--accent)" }}>50k+</h2>
                            <p className="mb-0 fs-6 fw-semibold text-white-50">Học viên tin tưởng</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="display-5 fw-bold mb-2" style={{ color: "var(--accent)" }}>120+</h2>
                            <p className="mb-0 fs-6 fw-semibold text-white-50">Khóa học thực chiến</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="display-5 fw-bold mb-2" style={{ color: "var(--accent)" }}>500+</h2>
                            <p className="mb-0 fs-6 fw-semibold text-white-50">Dự án hoàn thiện</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="display-5 fw-bold mb-2" style={{ color: "var(--accent)" }}>95%</h2>
                            <p className="mb-0 fs-6 fw-semibold text-white-50">Có việc làm sau học</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-2">Khác biệt tại EduFlow</h2>
                        <p className="text-muted">Phương pháp học tập được thiết kế riêng để tối ưu hóa thời gian và hiệu quả</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="p-4 border rounded-3 bg-white h-100 shadow-sm">
                                <div className="mb-4 text-accent">
                                    <i className="fa-solid fa-code fs-1"></i>
                                </div>
                                <h5 className="fw-bold mb-3">Học qua dự án thực tế</h5>
                                <p className="text-muted mb-0">Mỗi khóa học là một sản phẩm hoàn chỉnh. Kết thúc khóa học, bạn sẽ có ngay một dự án tuyệt vời để thêm vào Portfolio xin việc.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded-3 bg-white h-100 shadow-sm">
                                <div className="mb-4 text-fire">
                                    <i className="fa-solid fa-users-gear fs-1"></i>
                                </div>
                                <h5 className="fw-bold mb-3">Review code 1-1</h5>
                                <p className="text-muted mb-0">Không để bạn kẹt lỗi quá lâu. Đội ngũ Mentor luôn sẵn sàng review code trực tiếp và chỉ ra những "Best Practices" cho bạn.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded-3 bg-white h-100 shadow-sm">
                                <div className="mb-4 text-success">
                                    <i className="fa-solid fa-briefcase fs-1"></i>
                                </div>
                                <h5 className="fw-bold mb-3">Bảo trợ việc làm</h5>
                                <p className="text-muted mb-0">EduFlow liên kết với hơn 50 doanh nghiệp IT, hỗ trợ bạn sửa CV, phỏng vấn thử (Mock Interview) và giới thiệu việc làm.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-surface">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-2">Đội ngũ Mentor chất lượng</h2>
                        <p className="text-muted">Những Senior Developer dẫn dắt bạn qua từng dòng code</p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="review-card text-center bg-white h-100 p-4 rounded-3 border">
                                <img 
                                    src="/assets/frontend/img/mentor-tri.jpg" 
                                    alt="Mentor" 
                                    className="rounded-circle border p-1 mb-3" 
                                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                    onError={(e) => { e.target.src = "/assets/frontend/img/default-mentor.png"; }}
                                />
                                <h5 className="fw-bold mb-1">Trần Trọng Trí</h5>
                                <span className="text-accent font-sm d-block mb-3 fw-semibold">Founder & Instructor</span>
                                <p className="text-muted font-sm mb-0">Nguyên Tech Lead tại tập đoàn công nghệ lớn với hơn 8 năm kinh nghiệm thực chiến.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="review-card text-center bg-white h-100 p-4 rounded-3 border">
                                <img 
                                    src="/assets/frontend/img/mentor-minh.jpg" 
                                    alt="Mentor" 
                                    className="rounded-circle border p-1 mb-3" 
                                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                    onError={(e) => { e.target.src = "/assets/frontend/img/default-mentor.png"; }}
                                />
                                <h5 className="fw-bold mb-1">Nguyễn Minh Minh</h5>
                                <span className="text-accent font-sm d-block mb-3 fw-semibold">Frontend Expert</span>
                                <p className="text-muted font-sm mb-0">Chuyên gia ReactJS và NextJS, đam mê tối ưu UI/UX mượt mà chuẩn doanh nghiệp.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="review-card text-center bg-white h-100 p-4 rounded-3 border">
                                <img 
                                    src="/assets/frontend/img/mentor-hoang.jpg" 
                                    alt="Mentor" 
                                    className="rounded-circle border p-1 mb-3" 
                                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                    onError={(e) => { e.target.src = "/assets/frontend/img/default-mentor.png"; }}
                                />
                                <h5 className="fw-bold mb-1">Phạm Minh Hoàng</h5>
                                <span className="text-accent font-sm d-block mb-3 fw-semibold">Backend Architect</span>
                                <p className="text-muted font-sm mb-0">Chuyên gia xây dựng hệ thống API quy mô lớn, Microservices và tối ưu Docker/AWS.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="review-card text-center bg-white h-100 p-4 rounded-3 border">
                                <img 
                                    src="/assets/frontend/img/mentor-thuy.jpg" 
                                    alt="Mentor" 
                                    className="rounded-circle border p-1 mb-3" 
                                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                    onError={(e) => { e.target.src = "/assets/frontend/img/default-mentor.png"; }}
                                />
                                <h5 className="fw-bold mb-1">Lê Thị Thủy</h5>
                                <span className="text-accent font-sm d-block mb-3 fw-semibold">Data Specialist</span>
                                <p className="text-muted font-sm mb-0">Thạc sĩ phân tích dữ liệu, định hướng tư duy giải quyết bài toán kinh doanh bằng số liệu.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 border-top">
                <div className="container py-4 text-center">
                    <p className="text-muted fw-semibold mb-4 text-uppercase tracking-wide">Học viên của chúng tôi đang làm việc tại</p>
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-lg-5 opacity-50">
                        <h3 className="fw-bold mb-0 text-dark"><i className="fa-brands fa-google me-1"></i> Google</h3>
                        <h3 className="fw-bold mb-0 text-dark"><i className="fa-brands fa-microsoft me-1"></i> Microsoft</h3>
                        <h3 className="fw-bold mb-0 text-dark"><i className="fa-brands fa-aws me-1"></i> AWS</h3>
                        <h3 className="fw-bold mb-0 text-dark"><i className="fa-brands fa-figma me-1"></i> Figma</h3>
                        <h3 className="fw-bold mb-0 text-dark"><i className="fa-brands fa-stripe me-1"></i> Stripe</h3>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
