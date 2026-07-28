import React, { useState } from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const [activeTab, setActiveTab] = useState('content');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        title: '',
        sub_title: '',
        description: '',
        content: '',
        thumbnail: '',
        published: 'publish',
        language: 'vi',
        tags: [],
        css: '',
        custom_css: '',
        google_title: '',
        google_description: '',
        facebook_title: '',
        facebook_description: '',
        is_hot: false,
        is_new: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cms.page.store'));
    };

    return (
        <CMSLayout>
            <Head title="Tạo Trang Mới - CMS" />
            
            <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="wow-title mb-1">Tạo Trang Mới</h2>
                        <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Thiết lập cấu hình và nội dung trang</p>
                    </div>
                    <div className="d-flex gap-3">
                        <Link href={route('cms.page.index')} className="wow-btn-light">
                            <i className="fa-solid fa-arrow-left"></i> Quay lại
                        </Link>
                        <button 
                            type="submit" 
                            className="wow-btn-primary" 
                            disabled={processing}
                        >
                            {processing ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...</>
                            ) : (
                                <><i className="fa-solid fa-rocket"></i> Xuất bản</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="wow-card">
                    <div className="wow-tabs">
                        <button 
                            type="button" 
                            className={`wow-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                            onClick={() => setActiveTab('content')}
                        >
                            <i className="fa-solid fa-layer-group"></i> Nội dung
                        </button>
                        <button 
                            type="button" 
                            className={`wow-tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('seo')}
                        >
                            <i className="fa-solid fa-rocket"></i> SEO & Social
                        </button>
                        <button 
                            type="button" 
                            className={`wow-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <i className="fa-solid fa-gear"></i> Cài đặt
                        </button>
                    </div>
                    
                    <div className="wow-card-body">
                        {/* TAB 1: CONTENT */}
                        {activeTab === 'content' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="wow-label">Tên trang (Internal) *</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="Ví dụ: Trang Chủ"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger mt-2 small">{errors.name}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="wow-label">Tiêu đề (Hiển thị) *</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="Nhập tiêu đề trang hiển thị cho người dùng"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && <div className="text-danger mt-2 small">{errors.title}</div>}
                                </div>

                                <div className="col-md-12">
                                    <div className="wow-input d-flex align-items-center mb-1" style={{ background: 'rgba(255,107,0,0.05)', borderColor: 'rgba(255,107,0,0.2)' }}>
                                        <i className="fa-solid fa-link me-2" style={{ color: 'var(--wow-primary)' }}></i>
                                        <span className="text-muted">Đường dẫn (Slug) sẽ tự động được tạo từ Tiêu đề.</span>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <label className="wow-label">Mô tả ngắn</label>
                                    <textarea 
                                        className="wow-input"
                                        rows="3"
                                        placeholder="Mô tả tóm tắt..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="col-md-12">
                                    <label className="wow-label">Nội dung chi tiết</label>
                                    <textarea 
                                        className="wow-input"
                                        rows="8"
                                        placeholder="Viết nội dung tại đây..."
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: SEO */}
                        {activeTab === 'seo' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="wow-label"><i className="fa-brands fa-google text-primary me-2"></i> Google Title</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="Tiêu đề trên Google"
                                        value={data.google_title}
                                        onChange={e => setData('google_title', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="wow-label"><i className="fa-brands fa-facebook" style={{ color: '#1877F2' }}></i> Facebook Title</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="Tiêu đề khi share Facebook"
                                        value={data.facebook_title}
                                        onChange={e => setData('facebook_title', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="wow-label">Google Description</label>
                                    <textarea 
                                        className="wow-input"
                                        rows="4"
                                        placeholder="Mô tả trên Google"
                                        value={data.google_description}
                                        onChange={e => setData('google_description', e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="col-md-6">
                                    <label className="wow-label">Facebook Description</label>
                                    <textarea 
                                        className="wow-input"
                                        rows="4"
                                        placeholder="Mô tả khi share Facebook"
                                        value={data.facebook_description}
                                        onChange={e => setData('facebook_description', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SETTINGS */}
                        {activeTab === 'settings' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="wow-label">Trạng thái *</label>
                                    <select 
                                        className="wow-input"
                                        value={data.published} 
                                        onChange={e => setData('published', e.target.value)}
                                    >
                                        <option value="publish">Hiển thị (Publish)</option>
                                        <option value="draft">Bản nháp (Draft)</option>
                                    </select>
                                    {errors.published && <div className="text-danger mt-2 small">{errors.published}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="wow-label">Ngôn ngữ *</label>
                                    <select 
                                        className="wow-input"
                                        value={data.language} 
                                        onChange={e => setData('language', e.target.value)}
                                    >
                                        <option value="vi">Tiếng Việt</option>
                                        <option value="en">English</option>
                                    </select>
                                    {errors.language && <div className="text-danger mt-2 small">{errors.language}</div>}
                                </div>
                                <div className="col-md-12">
                                    <label className="wow-label">Đánh dấu (Flags)</label>
                                    <div className="d-flex gap-4">
                                        <div className="form-check form-switch mt-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="is_hot"
                                                checked={data.is_hot}
                                                onChange={e => setData('is_hot', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_hot" style={{ color: 'var(--wow-text)' }}>
                                                Nổi bật (Hot)
                                            </label>
                                        </div>
                                        <div className="form-check form-switch mt-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="is_new"
                                                checked={data.is_new}
                                                onChange={e => setData('is_new', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_new" style={{ color: 'var(--wow-text)' }}>
                                                Mới (New)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <label className="wow-label">Tiêu đề phụ (Subtitle)</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        value={data.sub_title}
                                        onChange={e => setData('sub_title', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className="wow-label">CSS Tùy chỉnh (CSS)</label>
                                    <textarea 
                                        className="wow-input"
                                        rows="6"
                                        placeholder=".my-class { color: red; }"
                                        value={data.css}
                                        onChange={e => setData('css', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </CMSLayout>
    );
}
