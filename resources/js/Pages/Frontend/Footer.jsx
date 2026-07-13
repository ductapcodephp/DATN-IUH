import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
<footer className="footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4 pe-lg-5">
          <Link href={route('frontend.home')} className="footer-brand">Edu<span>Flow</span></Link>
          <p>Nền tảng học tập trực tuyến hàng đầu, cung cấp các khoá học chất lượng cao giúp bạn thăng tiến trong sự
            nghiệp IT.</p>
        </div>
        <div className="col-lg-2 col-6">
          <h5>Khám phá</h5>
          <ul>
            <li><Link href={route('frontend.home')}>Trang chủ</Link></li>
            <li><Link href={route('frontend.course.index')}>Khóa học</Link></li>
            <li><Link href="#">Blog</Link></li>
          </ul>
        </div>
        <div className="col-lg-3 col-6">
          <h5>Hỗ trợ</h5>
          <ul>
            <li><Link href="#">Giới thiệu</Link></li>
            <li><Link href="#">Câu hỏi thường gặp</Link></li>
            <li><Link href="#">Liên hệ</Link></li>
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