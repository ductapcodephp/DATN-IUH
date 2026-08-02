import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const parseJson = (str, defaultVal) => {
    if (!str) return defaultVal;
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return defaultVal;
    }
};

export default function Footer() {
    const { core_settings } = usePage().props;

    // Fallback values in case settings are not yet loaded or missing
    const col1Title = core_settings?.footer_col_1_title || 'Khám phá';
    const col1Links = parseJson(core_settings?.footer_col_1_links, [
        { label: 'Trang chủ', url: '/' },
        { label: 'Khóa học', url: '/courses' },
        { label: 'Blog', url: '/blog' }
    ]);

    const col2Title = core_settings?.footer_col_2_title || 'Hỗ trợ';
    const col2Links = parseJson(core_settings?.footer_col_2_links, [
        { label: 'Giới thiệu', url: '/about' },
        { label: 'Câu hỏi thường gặp', url: '/faqs' },
        { label: 'Liên hệ', url: '/contact' }
    ]);

    return (
        <footer className="footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 pe-lg-5">
                        <Link href={route('frontend.home')} className="footer-brand" dangerouslySetInnerHTML={{ __html: core_settings?.footer_brand || 'Edu<span>Flow</span>' }}></Link>
                        <p>{core_settings?.footer_description || 'Nền tảng học tập trực tuyến hàng đầu, cung cấp các khoá học chất lượng cao giúp bạn thăng tiến trong sự nghiệp IT.'}</p>
                    </div>
                    
                    <div className="col-lg-2 col-6">
                        <h5>{col1Title}</h5>
                        <ul>
                            {col1Links.map((link, idx) => (
                                <li key={idx}><Link href={link.url || '#'}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="col-lg-3 col-6">
                        <h5>{col2Title}</h5>
                        <ul>
                            {col2Links.map((link, idx) => (
                                <li key={idx}><Link href={link.url || '#'}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="col-lg-3">
                        <h5>{core_settings?.footer_col_3_title || 'Liên hệ'}</h5>
                        <ul>
                            <li><i className="fa-solid fa-location-dot me-2"></i> {core_settings?.footer_address || 'Quận 1, TP. Hồ Chí Minh'}</li>
                            <li><i className="fa-solid fa-envelope me-2"></i> {core_settings?.footer_email || 'support@eduflow.vn'}</li>
                            <li><i className="fa-solid fa-phone me-2"></i> {core_settings?.footer_hotline || '1900 1234'}</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    {core_settings?.footer_copyright || '© 2026 EduFlow. Nền tảng học lập trình thực chiến.'}
                </div>
            </div>
        </footer>
    );
}
