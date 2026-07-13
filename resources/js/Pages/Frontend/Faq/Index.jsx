import React from "react";
import FrontendLayout from "@/Layouts/Frontend/FrontendLayout";
import { Head } from "@inertiajs/react";

export default function Index() {
    return (
        <FrontendLayout>
            <Head title="Câu Hỏi Thường Gặp (FAQ)" />

            <section className="hero-section text-center py-5 mb-5">
                <div className="container py-2">
                    <h1 className="hero-title">Giải Đáp Thắc Mắc</h1>
                    <p className="hero-desc col-lg-6 mx-auto mb-0">Bạn có câu hỏi? Chúng tôi có câu trả lời. Tìm kiếm nhanh các chủ đề hỗ trợ học viên bên dưới.</p>
                </div>
            </section>

            <div className="container mb-5">
                <div className="row g-4">
                    
                    <div className="col-lg-3">
                        <div className="d-flex flex-column gap-2 sticky-top" style={{ top: "100px", zIndex: 10 }}>
                            <a href="#payment" className="roadmap-card p-3 d-flex justify-content-between align-items-center text-decoration-none text-dark fw-semibold">
                                <span><i className="fa-solid fa-credit-card text-accent me-2"></i> Học phí & Thanh toán</span>
                                <i className="fa-solid fa-chevron-right font-sm text-muted"></i>
                            </a>
                            <a href="#learning" className="roadmap-card p-3 d-flex justify-content-between align-items-center text-decoration-none text-dark fw-semibold">
                                <span><i className="fa-solid fa-laptop-code text-fire me-2"></i> Hình thức học & Hỗ trợ</span>
                                <i className="fa-solid fa-chevron-right font-sm text-muted"></i>
                            </a>
                            <a href="#certificate" className="roadmap-card p-3 d-flex justify-content-between align-items-center text-decoration-none text-dark fw-semibold">
                                <span><i className="fa-solid fa-medal text-warning me-2"></i> Chứng chỉ & Đầu ra</span>
                                <i className="fa-solid fa-chevron-right font-sm text-muted"></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        
                        {/* Học phí & Thanh toán */}
                        <div id="payment" className="mb-5 scroll-margin">
                            <h3 className="section-title fs-4 mb-3 border-bottom pb-2">Học phí & Thanh toán</h3>
                            <div className="accordion faq-accordion" id="accordionPayment">
                                
                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#pay1" aria-expanded="true" aria-controls="pay1">
                                            Tôi có thể thanh toán qua những hình thức nào?
                                        </button>
                                    </h2>
                                    <div id="pay1" className="accordion-collapse collapse show" data-bs-parent="#accordionPayment">
                                        <div className="accordion-body text-muted lh-lg">
                                            EduFlow hỗ trợ đa dạng các cổng thanh toán bao gồm Chuyển khoản ngân hàng (Qua mã QR tự động), thẻ ATM nội địa, thẻ Visa/Mastercard hoặc thanh toán qua ví điện tử Momo/VNPAY. Khóa học sẽ được kích hoạt ngay lập tức sau khi giao dịch thành công.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#pay2" aria-expanded="false" aria-controls="pay2">
                                            Hệ thống có chính sách hoàn trả học phí không?
                                        </button>
                                    </h2>
                                    <div id="pay2" className="accordion-collapse collapse" data-bs-parent="#accordionPayment">
                                        <div className="accordion-body text-muted lh-lg">
                                            Có, EduFlow cam kết hoàn trả 100% học phí trong vòng 3 ngày kể từ ngày mua nếu bạn không hài lòng với nội dung bài học và chưa học quá 20% tổng số thời lượng video của khóa học.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#pay3" aria-expanded="false" aria-controls="pay3">
                                            Khóa học có hỗ trợ trả góp học phí không?
                                        </button>
                                    </h2>
                                    <div id="pay3" className="accordion-collapse collapse" data-bs-parent="#accordionPayment">
                                        <div className="accordion-body text-muted lh-lg">
                                            Đối với các khóa học hoặc gói lộ trình chuyên sâu (Pro/Bootcamp), EduFlow hỗ trợ chính sách chia nhỏ học phí làm 2-3 kỳ thanh toán hoặc hỗ trợ trả góp 0% lãi suất thông qua thẻ tín dụng liên kết của hơn 20 ngân hàng lớn tại Việt Nam.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#pay4" aria-expanded="false" aria-controls="pay4">
                                            Tôi có nhận được hóa đơn giá trị gia tăng (VAT) không?
                                        </button>
                                    </h2>
                                    <div id="pay4" className="accordion-collapse collapse" data-bs-parent="#accordionPayment">
                                        <div className="accordion-body text-muted lh-lg">
                                            Có. Học viên hoặc doanh nghiệp có nhu cầu xuất hóa đơn tài chính (VAT) vui lòng gửi thông tin xuất hóa đơn (Tên công ty, Mã số thuế, Địa chỉ) cho ban hỗ trợ của EduFlow trong vòng 7 ngày làm việc kể từ thời điểm giao dịch thành công.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Hình thức học & Hỗ trợ */}
                        <div id="learning" className="mb-5 scroll-margin">
                            <h3 className="section-title fs-4 mb-3 border-bottom pb-2">Hình thức học & Hỗ trợ</h3>
                            <div className="accordion faq-accordion" id="accordionLearning">
                                
                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#learn1" aria-expanded="false" aria-controls="learn1">
                                            Khóa học là video quay sẵn hay học trực tuyến trực tiếp?
                                        </button>
                                    </h2>
                                    <div id="learn1" className="accordion-collapse collapse" data-bs-parent="#accordionLearning">
                                        <div className="accordion-body text-muted lh-lg">
                                            Các khóa học tại EduFlow là sự kết hợp giữa hệ thống video bài giảng chất lượng cao quay sẵn (để bạn chủ động thời gian) và các buổi Review Code, giải đáp thắc mắc hàng tuần cùng Mentor qua Google Meet/Discord.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#learn2" aria-expanded="false" aria-controls="learn2">
                                            Khi gặp lỗi code hoặc không hiểu bài thì tôi hỏi ai?
                                        </button>
                                    </h2>
                                    <div id="learn2" className="accordion-collapse collapse" data-bs-parent="#accordionLearning">
                                        <div className="accordion-body text-muted lh-lg">
                                            Mỗi bài học đều có mục Thảo luận ngay bên dưới. Bạn có thể đăng câu hỏi kèm ảnh chụp màn hình lỗi. Đội ngũ Mentor trực tuyến của chúng tôi sẽ phản hồi và gỡ lỗi cùng bạn trong vòng 15-30 phút (Giờ làm việc từ 8h00 - 22h00 hàng ngày).
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#learn3" aria-expanded="false" aria-controls="learn3">
                                            Tôi có giới hạn thời gian truy cập vào khóa học không?
                                        </button>
                                    </h2>
                                    <div id="learn3" className="accordion-collapse collapse" data-bs-parent="#accordionLearning">
                                        <div className="accordion-body text-muted lh-lg">
                                            Hoàn toàn không. Sau khi thanh toán thành công, bạn sẽ được cấp quyền truy cập trọn đời (Lifetime Access) vào nội dung khóa học, bao gồm tất cả các bài giảng video, mã nguồn mẫu và tài liệu đính kèm, kể cả các bản cập nhật giáo trình cải tiến trong tương lai.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#learn4" aria-expanded="false" aria-controls="learn4">
                                            Tôi có thể học trên điện thoại hoặc máy tính bảng không?
                                        </button>
                                    </h2>
                                    <div id="learn4" className="accordion-collapse collapse" data-bs-parent="#accordionLearning">
                                        <div className="accordion-body text-muted lh-lg">
                                            Có. Nền tảng EduFlow được tối ưu hóa giao diện hoàn hảo cho tất cả thiết bị di động, máy tính bảng và máy tính cá nhân. Bạn có thể dễ dàng tiếp tục bài học của mình mọi lúc mọi nơi chỉ cần có kết nối Internet.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Chứng chỉ & Đầu ra */}
                        <div id="certificate" className="mb-5 scroll-margin">
                            <h3 className="section-title fs-4 mb-3 border-bottom pb-2">Chứng chỉ & Đầu ra</h3>
                            <div className="accordion faq-accordion" id="accordionCertificate">
                                
                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#cert1" aria-expanded="false" aria-controls="cert1">
                                            Tôi có nhận được chứng chỉ sau khi hoàn thành khóa học không?
                                        </button>
                                    </h2>
                                    <div id="cert1" className="accordion-collapse collapse" data-bs-parent="#accordionCertificate">
                                        <div className="accordion-body text-muted lh-lg">
                                            Có, sau khi hoàn thành 100% giáo trình và vượt qua bài kiểm tra trắc nghiệm / dự án thực tế cuối khóa, EduFlow sẽ cấp chứng chỉ số (e-Certificate) có mã định danh để bạn dễ dàng đính kèm vào CV hoặc LinkedIn của mình.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#cert2" aria-expanded="false" aria-controls="cert2">
                                            Chứng chỉ của EduFlow có giá trị như thế nào?
                                        </button>
                                    </h2>
                                    <div id="cert2" className="accordion-collapse collapse" data-bs-parent="#accordionCertificate">
                                        <div className="accordion-body text-muted lh-lg">
                                            Chứng chỉ chứng nhận bạn đã hoàn thành chương trình đào tạo thực tế và có đầy đủ năng lực làm việc. EduFlow liên kết với nhiều đối tác doanh nghiệp IT, hỗ trợ ưu tiên tuyển dụng đối với các học viên sở hữu chứng chỉ xuất sắc từ hệ thống.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#cert3" aria-expanded="false" aria-controls="cert3">
                                            EduFlow có cam kết giới thiệu việc làm sau khóa học không?
                                        </button>
                                    </h2>
                                    <div id="cert3" className="accordion-collapse collapse" data-bs-parent="#accordionCertificate">
                                        <div className="accordion-body text-muted lh-lg">
                                            Với các khóa học thuộc lộ trình Bootcamp chuyên sâu, EduFlow cam kết hỗ trợ tối đa kết nối việc làm: bao gồm hướng dẫn tối ưu CV/Portfolio, tổ chức phỏng vấn thử cùng chuyên gia và trực tiếp gửi hồ sơ giới thiệu của bạn tới mạng lưới doanh nghiệp đối tác IT lớn của chúng tôi.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed fw-bold text-dark bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#cert4" aria-expanded="false" aria-controls="cert4">
                                            Học viên chưa có nền tảng (Non-IT) có thể theo học và xin việc được không?
                                        </button>
                                    </h2>
                                    <div id="cert4" className="accordion-collapse collapse" data-bs-parent="#accordionCertificate">
                                        <div className="accordion-body text-muted lh-lg">
                                            Hoàn toàn được. Giáo trình các lộ trình học tại EduFlow được thiết kế chi tiết đi từ con số 0, bắt đầu từ những khái niệm căn bản nhất. Với sự hỗ trợ sát sao 1-1 từ các Mentor, rất nhiều học viên trái ngành đã thành công thay đổi sự nghiệp sang ngành lập trình.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </FrontendLayout>
    );
}
