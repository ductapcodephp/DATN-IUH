import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

const STATUS_OPTIONS = [
    { value: 'published', label: 'Công khai' },
    { value: 'draft', label: 'Bản nháp' },
    { value: 'hidden', label: 'Tạm ẩn' },
];

const LEVEL_OPTIONS = [
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung bình' },
    { value: 'advanced', label: 'Nâng cao' },
];

const STATUS_BADGE = {
    published: { label: 'Công khai', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.12)' },
    draft: { label: 'Bản nháp', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' },
    hidden: { label: 'Tạm ẩn', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
};

export default function CourseForm({ course }) {
    const isEdit = !!course;

    const { data, setData, post, processing, errors, transform } = useForm({
        title: course?.title || '',
        status: course?.status || 'published',
        level: course?.level || 'beginner',
        price: course?.price || '',
        original_price: course?.original_price || '',
        is_free: !!course?.is_free,
        is_vip: !!course?.is_vip,
        description: course?.description || '',
        requirements: Array.isArray(course?.requirements) ? course.requirements.join('\n') : '',
        outcomes: Array.isArray(course?.outcomes) ? course.outcomes.join('\n') : '',
        thumbnail: null,
    });

    if (isEdit) {
        transform((d) => ({ ...d, _method: 'PUT' }));
    }

    const [preview, setPreview] = useState(null);
    const currentThumbnailUrl = course?.thumbnail_url || course?.thumbnail || null;

    const submit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? route('seller.courses.update', course.id)
            : route('seller.courses.store');
        post(url, { forceFormData: true });
    };

    const onThumbnailChange = (file) => {
        setData('thumbnail', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handlePricingChange = (free) => {
        setData('is_free', free);
        if (free) {
            setData('price', 0);
            setData('original_price', 0);
        }
    };

    const discountPercent = (data.price && data.original_price && Number(data.original_price) > Number(data.price))
        ? Math.round((1 - Number(data.price) / Number(data.original_price)) * 100)
        : null;

    const badge = STATUS_BADGE[data.status] || STATUS_BADGE.draft;

    return (
        <>
            <Head title={isEdit ? `Chỉnh sửa: ${course.title}` : 'Tạo khóa học mới'} />
            <div className="page">
                <Link href={route('seller.courses.index')} className="ef-backlink">
                    <IconBack /> Quay lại danh sách khóa học
                </Link>

                <div className="page-header" style={{ marginTop: '10px' }}>
                    <div>
                        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {isEdit ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                            {isEdit && (
                                <span className="ef-status-badge" style={{ color: badge.color, background: badge.bg }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.color }} />
                                    {badge.label}
                                </span>
                            )}
                        </div>
                        <div className="page-sub">
                            {isEdit ? course.title : 'Điền thông tin bên dưới để thêm khóa học vào danh mục giảng dạy của bạn'}
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Section icon={<IconInfo />} title="Thông tin cơ bản" desc="Tên và trạng thái hiển thị của khóa học">
                        <div className="ef-grid-2-1">
                            <Field label="Tên khóa học" required error={errors.title}>
                                <input
                                    type="text"
                                    className="form-control ef-input ef-input-custom"
                                    placeholder="VD: Lập trình React từ Zero đến Hero"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                            </Field>
                            <Field label="Trạng thái">
                                <select
                                    className="form-select ef-input ef-input-custom"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    <Section icon={<IconSliders />} title="Trình độ & cấu hình bán" desc="Mức học phí và phân loại độ khó của khóa học">
                        <div className="ef-grid-1-1">
                            <Field label="Trình độ">
                                <select
                                    className="form-select ef-input ef-input-custom"
                                    value={data.level}
                                    onChange={e => setData('level', e.target.value)}
                                >
                                    {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Field>
                            <Field label="Loại nội dung">
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', height: '42px' }}>
                                    <Chip active={data.is_vip} color="#d97706" activeBg="rgba(217, 119, 6, 0.12)" onClick={() => setData('is_vip', !data.is_vip)}>
                                        ⭐ Khóa học VIP
                                    </Chip>
                                </div>
                            </Field>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <label className="ef-label">Hình thức học phí</label>
                            <div className="ef-segment-group">
                                <button
                                    type="button"
                                    className={`ef-segment-item ${!data.is_free ? 'active' : ''}`}
                                    style={!data.is_free ? { color: '#f97316' } : {}}
                                    onClick={() => handlePricingChange(false)}
                                >
                                    💰 Trả phí
                                </button>
                                <button
                                    type="button"
                                    className={`ef-segment-item ${data.is_free ? 'active' : ''}`}
                                    style={data.is_free ? { color: '#16a34a' } : {}}
                                    onClick={() => handlePricingChange(true)}
                                >
                                    🆓 Miễn phí
                                </button>
                            </div>
                        </div>

                        {data.is_free ? (
                            <div className="ef-free-banner">
                                🎉 Khóa học này sẽ hiển thị <strong>miễn phí</strong> cho học viên — không cần nhập giá bán.
                            </div>
                        ) : (
                            <div style={{ marginTop: '16px' }}>
                                <div className="ef-grid-1-1">
                                    <Field label="Giá bán (VNĐ)" required error={errors.price}>
                                        <input
                                            type="number" min="0"
                                            className="form-control ef-input ef-input-custom"
                                            placeholder="0"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Giá gốc (gạch ngang)" error={errors.original_price}>
                                        <input
                                            type="number" min="0"
                                            className="form-control ef-input ef-input-custom"
                                            placeholder="0"
                                            value={data.original_price}
                                            onChange={e => setData('original_price', e.target.value)}
                                        />
                                    </Field>
                                </div>
                                {discountPercent !== null && (
                                    <span className="ef-discount-badge">Giảm {discountPercent}% so với giá gốc</span>
                                )}
                            </div>
                        )}
                    </Section>

                    <Section icon={<IconImage />} title="Ảnh bìa & nội dung" desc="Hình ảnh đại diện và mô tả chi tiết khóa học">
                        <Field label="Ảnh bìa" error={errors.thumbnail}>
                            <Dropzone preview={preview} currentUrl={currentThumbnailUrl} onChange={onThumbnailChange} isEdit={isEdit} />
                            {isEdit && <div className="ef-hint-text">Để trống nếu muốn giữ ảnh hiện tại</div>}
                        </Field>

                        <Field label="Mô tả chi tiết" style={{ marginTop: '16px' }}>
                            <textarea
                                className="form-control ef-input ef-input-custom"
                                style={{ resize: 'vertical' }}
                                rows="4"
                                placeholder="Giới thiệu tổng quan về nội dung, lợi ích của khóa học..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </Field>

                        <div className="ef-grid-1-1" style={{ marginTop: '16px' }}>
                            <Field label="Yêu cầu đầu vào">
                                <textarea
                                    className="form-control ef-input ef-input-custom"
                                    style={{ resize: 'vertical' }}
                                    rows="3"
                                    placeholder="- Kiến thức cơ bản..."
                                    value={data.requirements}
                                    onChange={e => setData('requirements', e.target.value)}
                                />
                            </Field>
                            <Field label="Kết quả đạt được">
                                <textarea
                                    className="form-control ef-input ef-input-custom"
                                    style={{ resize: 'vertical' }}
                                    rows="3"
                                    placeholder="- Thành thạo..."
                                    value={data.outcomes}
                                    onChange={e => setData('outcomes', e.target.value)}
                                />
                            </Field>
                        </div>
                    </Section>

                    <div className="ef-actions-bar">
                        <Link href={route('seller.courses.index')} className="btn btn-secondary ef-btn-secondary-custom">
                            Hủy bỏ
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn btn-primary ef-btn-primary-custom"
                        >
                            {processing ? (<><Spinner /> Đang lưu...</>) : (isEdit ? 'Cập nhật thay đổi' : 'Lưu khóa học')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

/* ---------- Sub-components ---------- */

function Section({ icon, title, desc, children }) {
    return (
        <div className="ef-section ef-section-card">
            <div className="ef-section-header">
                <span className="ef-section-icon">{icon}</span>
                <div>
                    <div className="ef-section-title">{title}</div>
                    {desc && <div className="ef-section-desc">{desc}</div>}
                </div>
            </div>
            <div style={{ marginTop: '18px' }}>{children}</div>
        </div>
    );
}

function Field({ label, required, error, children, style }) {
    return (
        <div style={style}>
            {label && (
                <label className="ef-label">
                    {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
                </label>
            )}
            {children}
            {error && <div className="ef-error-text">{error}</div>}
        </div>
    );
}

function Chip({ active, color, activeBg, onClick, children }) {
    const chipInlineStyle = {
        border: `1.5px solid ${active ? color : '#e2e5e9'}`,
        background: active ? activeBg : '#f9fafb',
        color: active ? color : '#374151',
    };
    return (
        <button type="button" onClick={onClick} className="ef-chip ef-chip-custom" style={chipInlineStyle}>
            {children}
        </button>
    );
}

function Dropzone({ preview, currentUrl, onChange, isEdit }) {
    const img = preview || currentUrl;
    return (
        <label className="ef-dropzone ef-dropzone-custom">
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onChange(e.target.files[0] || null)} />
            {img ? (
                <img src={img} alt="Ảnh bìa khóa học" className="ef-dropzone-preview" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                    <IconUpload />
                    <div style={{ marginTop: '6px', fontSize: '13px' }}>{isEdit ? 'Nhấn để chọn ảnh bìa mới' : 'Nhấn để chọn ảnh bìa'}</div>
                    <div style={{ fontSize: '11.5px' }}>PNG, JPG — tối đa 2MB</div>
                </div>
            )}
        </label>
    );
}

function Spinner() {
    return <span className="ef-spinner" style={{ display: 'inline-block', width: 14, height: 14, marginRight: 6, verticalAlign: '-2px' }} />;
}

/* ---------- Icons ---------- */
const IconBack = (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>);
const IconInfo = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>);
const IconSliders = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="currentColor" /><line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" fill="currentColor" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="7" cy="18" r="2" fill="currentColor" /></svg>);
const IconImage = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>);
const IconUpload = (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 20h14" /></svg>);