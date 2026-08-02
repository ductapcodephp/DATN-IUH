import React, { useState } from 'react';
import CMSLayout from '@/Layouts/CMS/CMSLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import CKEditorComponent from '@/Components/CMS/CKEditorComponent';
import MediaPickerModal from '@/Components/CMS/MediaPickerModal';

export default function Edit({ article, categories = [] }) {
    const [activeTab, setActiveTab] = useState('basic');
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: article.title || '',
        category_id: article.category_id || '',
        slug: article.slug || '',
        sub_title: article.sub_title || '',
        description: article.description || '',
        content: article.content || '',
        thumbnail: article.thumbnail || '',
        published: article.published || 'publish',
        language: article.language || 'vi',
        is_hot: article.is_hot || false,
        is_new: article.is_new || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('cms.article.update', article.id));
    };

    const handleSelectThumbnail = (url) => {
        if (url) {
            setData('thumbnail', url);
        }
        setShowMediaPicker(false);
    };

    return (
        <CMSLayout>
            <Head title={`Sửa Bài Viết: ${article.title} - CMS`} />
            
            <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="wow-title mb-1">Sửa Bài Viết</h2>
                        <p className="m-0" style={{ color: 'var(--wow-text-muted)' }}>Cập nhật nội dung bài viết</p>
                    </div>
                    <div className="d-flex gap-3">
                        <Link href={route('cms.article.index')} className="wow-btn-light">
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
                                <><i className="fa-solid fa-save"></i> Cập nhật</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="wow-card">
                    <div className="wow-tabs">
                        <button 
                            type="button" 
                            className={`wow-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            <i className="fa-solid fa-info-circle"></i> Cơ bản
                        </button>
                        <button 
                            type="button" 
                            className={`wow-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                            onClick={() => setActiveTab('content')}
                        >
                            <i className="fa-solid fa-layer-group"></i> Nội dung
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
                        {/* TAB 1: BASIC */}
                        {activeTab === 'basic' && (
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className="wow-label">Tiêu đề bài viết *</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="Nhập tiêu đề..."
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && <div className="text-danger mt-2 small">{errors.title}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="wow-label">Đường dẫn (Slug) - Để trống sẽ tự tạo từ tiêu đề</label>
                                    <input 
                                        type="text" 
                                        className="wow-input"
                                        placeholder="bai-viet-moi..."
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="wow-label">Chuyên mục bài viết</label>
                                    <select 
                                        className="wow-input"
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                    >
                                        <option value="">-- Chọn chuyên mục --</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
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
                            </div>
                        )}

                        {/* TAB 2: CONTENT */}
                        {activeTab === 'content' && (
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className="wow-label">Nội dung chi tiết</label>
                                    <CKEditorComponent 
                                        value={data.content}
                                        onChange={(val) => setData('content', val)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SETTINGS */}
                        {activeTab === 'settings' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="wow-label">Ảnh đại diện (Thumbnail)</label>
                                    <div className="d-flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            className="wow-input"
                                            placeholder="/storage/..."
                                            value={data.thumbnail}
                                            onChange={e => setData('thumbnail', e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowMediaPicker(true)}
                                        >
                                            <i className="fa-solid fa-image"></i>
                                        </button>
                                    </div>
                                    {data.thumbnail && (
                                        <img src={data.thumbnail} alt="Thumbnail preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </div>

                                <div className="col-md-6">
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
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {showMediaPicker && (
                <MediaPickerModal 
                    onSelect={handleSelectThumbnail} 
                    onClose={() => setShowMediaPicker(false)} 
                    multiple={false} 
                />
            )}
        </CMSLayout>
    );
}
