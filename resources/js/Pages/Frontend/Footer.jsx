import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
<footer className="footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4 pe-lg-5">
          <a href="home.html" className="footer-brand">Edu<span>Flow</span></a>
          <p>Nền tảng học tập trực tuyến hàng đầu, cung cấp các khoá học chất lượng cao giúp bạn thăng tiến trong sự
            nghiệp IT.</p>
        </div>
        <div className="col-lg-2 col-6">
          <h5>Khám phá</h5>
          <ul>
            <li><a href="home.html">Trang chủ</a></li>
            <li><a href="courses.html">Khóa học</a></li>
            <li><a href="blog.html">Blog</a></li>
          </ul>
        </div>
        <div className="col-lg-3 col-6">
          <h5>Hỗ trợ</h5>
          <ul>
            <li><a href="about.html">Giới thiệu</a></li>
            <li><a href="faqs.html">Câu hỏi thường gặp</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
          </ul>
        </div>
        <div className="col-lg-3">
          <h5>Liên hệ</h5>
          <ul>
            <li><i className="fa-solid fa-location-dot me-2"></i> Quận 1, TP. Hồ Chí Minh</li>
            <li><i className="fa-solid fa-envelope me-2"></i> support@eduflow.vn</li>
            <li><i className="fa-solid fa-phone me-2"></i> 1900 1234</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2026 EduFlow. Nền tảng học lập trình thực chiến.
      </div>
    </div>
  </footer>
    );
}