import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { 
    Save, 
    Palette, 
    Building, 
    Phone, 
    Mail, 
    MapPin, 
    Link as LinkIcon, 
    Plus, 
    X,
    CheckCircle2,
    Settings,
    FileText,
    Globe
} from 'lucide-react';

const parseJson = (str, defaultVal) => {
    if (!str) return defaultVal;
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return defaultVal;
    }
};

export default function Index({ settings }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, post, processing } = useForm({
        footer_brand: settings.footer_brand || 'Edu<span>Flow</span>',
        footer_description: settings.footer_description || '',
        footer_address: settings.footer_address || '',
        footer_email: settings.footer_email || '',
        footer_hotline: settings.footer_hotline || '',
        footer_copyright: settings.footer_copyright || '',
        footer_col_1_title: settings.footer_col_1_title || 'Khám phá',
        footer_col_1_links: parseJson(settings.footer_col_1_links, [
            { label: 'Trang chủ', url: '/' },
            { label: 'Khóa học', url: '/courses' },
            { label: 'Blog', url: '/blog' }
        ]),
        footer_col_2_title: settings.footer_col_2_title || 'Hỗ trợ',
        footer_col_2_links: parseJson(settings.footer_col_2_links, [
            { label: 'Giới thiệu', url: '/about' },
            { label: 'Câu hỏi thường gặp', url: '/faqs' },
            { label: 'Liên hệ', url: '/contact' }
        ]),
        footer_col_3_title: settings.footer_col_3_title || 'Liên hệ',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cms.settings.update'));
    };

    const addLink = (col) => {
        const field = `footer_col_${col}_links`;
        setData(field, [...data[field], { label: '', url: '' }]);
    };

    const removeLink = (col, index) => {
        const field = `footer_col_${col}_links`;
        const newLinks = [...data[field]];
        newLinks.splice(index, 1);
        setData(field, newLinks);
    };

    const updateLink = (col, index, key, value) => {
        const field = `footer_col_${col}_links`;
        const newLinks = [...data[field]];
        newLinks[index][key] = value;
        setData(field, newLinks);
    };

    const renderLinkEditor = (colNumber, titleField, linksField, icon) => (
        <div className="saas-card group">
            <div className="card-header-flex">
                <div className="icon-wrapper">
                    {icon}
                </div>
                <div>
                    <h3 className="card-title">Cột Links {colNumber}</h3>
                    <p className="helper-text">Quản lý tiêu đề và danh sách các đường dẫn của cột {colNumber}</p>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor={titleField} className="saas-label">Tiêu đề cột</label>
                <input 
                    id={titleField}
                    type="text" 
                    className="saas-input" 
                    value={data[titleField]}
                    onChange={e => setData(titleField, e.target.value)}
                    placeholder="Nhập tiêu đề..."
                />
            </div>
            
            <div className="form-group mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="saas-label mb-0">Danh sách Links</label>
                    <button type="button" className="btn-saas-outline-small" onClick={() => addLink(colNumber)}>
                        <Plus size={16} className="me-1" /> Thêm Link
                    </button>
                </div>

                <div className="d-flex flex-column gap-3">
                    {data[linksField].map((link, idx) => (
                        <div key={idx} className="link-item-card">
                            <button 
                                type="button" 
                                className="remove-link-btn" 
                                onClick={() => removeLink(colNumber, idx)}
                                aria-label="Xóa link"
                            >
                                <X size={16} />
                            </button>
                            <div className="row g-3">
                                <div className="col-12 col-md-5">
                                    <label htmlFor={`${linksField}_label_${idx}`} className="saas-label-small">Tên hiển thị</label>
                                    <div className="input-with-icon">
                                        <FileText size={16} className="input-icon" />
                                        <input 
                                            id={`${linksField}_label_${idx}`}
                                            type="text" 
                                            className="saas-input pl-icon" 
                                            placeholder="Trang chủ"
                                            value={link.label}
                                            onChange={e => updateLink(colNumber, idx, 'label', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-7">
                                    <label htmlFor={`${linksField}_url_${idx}`} className="saas-label-small">Đường dẫn (URL)</label>
                                    <div className="input-with-icon">
                                        <Globe size={16} className="input-icon" />
                                        <input 
                                            id={`${linksField}_url_${idx}`}
                                            type="text" 
                                            className="saas-input pl-icon" 
                                            placeholder="/khoa-hoc"
                                            value={link.url}
                                            onChange={e => updateLink(colNumber, idx, 'url', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data[linksField].length === 0 && (
                        <div className="text-center py-4 border rounded-3 border-dashed text-secondary">
                            Chưa có đường dẫn nào. Hãy thêm link mới.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <CMSLayout>
            <Head title="Cấu hình Website" />
            
            <div className="saas-page-wrapper">
                
                {/* Sticky Header */}
                <div className="saas-header sticky-top">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                            <h1 className="saas-page-title">Cấu hình Website</h1>
                            <p className="saas-page-subtitle">Quản lý giao diện, liên hệ, footer và các cài đặt cốt lõi.</p>
                        </div>
                        <button 
                            type="button" 
                            className="btn-saas-primary d-flex align-items-center" 
                            onClick={handleSubmit} 
                            disabled={processing}
                        >
                            <Save size={18} className="me-2" />
                            {processing ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
                        </button>
                    </div>

                    {flash?.success && (
                        <div className="saas-alert-success mt-3 animation-fade-in" role="alert">
                            <CheckCircle2 size={20} />
                            <span>{flash.success}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="saas-tabs-container">
                    <button 
                        className={`saas-tab ${activeTab === 'general' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('general')}
                        type="button"
                    >
                        <Settings size={18} />
                        Thông tin chung
                    </button>
                    <button 
                        className={`saas-tab ${activeTab === 'footer_links' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('footer_links')}
                        type="button"
                    >
                        <LinkIcon size={18} />
                        Footer Links
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="saas-content animation-slide-up">
                    {/* Tab 1: Thông tin chung */}
                    <div style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
                        <div className="row g-4">
                            {/* Cột trái: Nhận diện thương hiệu */}
                            <div className="col-12 col-lg-6">
                                <div className="saas-card group">
                                    <div className="card-header-flex">
                                        <div className="icon-wrapper">
                                            <Palette size={24} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="card-title">Nhận diện thương hiệu</h3>
                                            <p className="helper-text">Quản lý logo, slogan và copyright.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="footer_brand" className="saas-label">Tên Logo (Brand)</label>
                                        <input 
                                            id="footer_brand"
                                            type="text" 
                                            className="saas-input" 
                                            value={data.footer_brand}
                                            onChange={e => setData('footer_brand', e.target.value)}
                                            placeholder="Edu<span>Flow</span>"
                                        />
                                        <div className="helper-text mt-2">Hỗ trợ HTML. Ví dụ: <code>Edu&lt;span&gt;Flow&lt;/span&gt;</code></div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="footer_description" className="saas-label">Mô tả (Slogan)</label>
                                        <textarea 
                                            id="footer_description"
                                            className="saas-textarea" 
                                            value={data.footer_description}
                                            onChange={e => setData('footer_description', e.target.value)}
                                            placeholder="Nền tảng học tập trực tuyến hàng đầu..."
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="footer_copyright" className="saas-label">Bản quyền (Copyright)</label>
                                        <input 
                                            id="footer_copyright"
                                            type="text" 
                                            className="saas-input" 
                                            value={data.footer_copyright}
                                            onChange={e => setData('footer_copyright', e.target.value)}
                                            placeholder="© 2026 EduFlow."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải: Thông tin liên hệ */}
                            <div className="col-12 col-lg-6">
                                <div className="saas-card group">
                                    <div className="card-header-flex">
                                        <div className="icon-wrapper">
                                            <Building size={24} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="card-title">Thông tin liên hệ</h3>
                                            <p className="helper-text">Quản lý địa chỉ, email và tổng đài.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="footer_col_3_title" className="saas-label">Tiêu đề khu vực (Cột 3)</label>
                                        <input 
                                            id="footer_col_3_title"
                                            type="text" 
                                            className="saas-input" 
                                            value={data.footer_col_3_title}
                                            onChange={e => setData('footer_col_3_title', e.target.value)}
                                            placeholder="Liên hệ"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="footer_address" className="saas-label">Địa chỉ trụ sở</label>
                                        <div className="input-with-icon">
                                            <MapPin size={18} className="input-icon" />
                                            <input 
                                                id="footer_address"
                                                type="text" 
                                                className="saas-input pl-icon" 
                                                value={data.footer_address}
                                                onChange={e => setData('footer_address', e.target.value)}
                                                placeholder="Quận 1, TP. Hồ Chí Minh"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="footer_email" className="saas-label">Email hỗ trợ</label>
                                        <div className="input-with-icon">
                                            <Mail size={18} className="input-icon" />
                                            <input 
                                                id="footer_email"
                                                type="email" 
                                                className="saas-input pl-icon" 
                                                value={data.footer_email}
                                                onChange={e => setData('footer_email', e.target.value)}
                                                placeholder="support@eduflow.vn"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="footer_hotline" className="saas-label">Hotline tư vấn</label>
                                        <div className="input-with-icon">
                                            <Phone size={18} className="input-icon" />
                                            <input 
                                                id="footer_hotline"
                                                type="text" 
                                                className="saas-input pl-icon" 
                                                value={data.footer_hotline}
                                                onChange={e => setData('footer_hotline', e.target.value)}
                                                placeholder="1900 1234"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 2: Footer Links */}
                    <div style={{ display: activeTab === 'footer_links' ? 'block' : 'none' }}>
                        <div className="row g-4 animation-slide-up">
                            <div className="col-12 col-lg-6">
                                {renderLinkEditor(1, 'footer_col_1_title', 'footer_col_1_links', <LinkIcon size={24} />)}
                            </div>
                            <div className="col-12 col-lg-6">
                                {renderLinkEditor(2, 'footer_col_2_title', 'footer_col_2_links', <Globe size={24} />)}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
        </CMSLayout>
    );
}
