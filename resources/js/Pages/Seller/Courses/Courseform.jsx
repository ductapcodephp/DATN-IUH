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
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, transform } = useForm({
        title: course?.title || '',
        status: course?.status || 'published',
        level: course?.level || 'beginner',
        price: course?.price || '',
        original_price: course?.original_price || '',
        is_free: !!course?.is_free,
        is_vip: !!course?.is_vip,
        description: course?.description || '',
        requirements: Array.isArray(course?.requirements) ? course.requirements.join('\n') : course?.requirements || '',
        outcomes: Array.isArray(course?.outcomes) ? course.outcomes.join('\n') : course?.outcomes || '',
        thumbnail: null,
    });

    if (isEdit) {
        transform((d) => ({ ...d, _method: 'PUT' }));
    }

    const [preview, setPreview] = useState(null);
    const currentThumbnailUrl = course?.thumbnail_url || course?.thumbnail || null;

const handleConfirm = () => {
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

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <>
            <Head title={isEdit ? `Chỉnh sửa: ${course.title}` : 'Tạo khóa học mới'} />
            


            <div className="page">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <Link href={route('seller.courses.index')} className="ef-backlink" style={{ textDecoration: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                            <i className="fas fa-arrow-left"></i> Quay lại
                        </Link>
                        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.6rem' }}>
                            {isEdit ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                            {isEdit && (
                                <span style={{ fontSize: '0.85rem', padding: '4px 10px', borderRadius: '50px', color: badge.color, background: badge.bg, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: badge.color }} />
                                    {badge.label}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="wizard-container">
                    <div className="wizard-header">
                        {[
                            { id: 1, title: 'Thông tin chung', icon: 'fas fa-info-circle' },
                            { id: 2, title: 'Giá & Phân loại', icon: 'fas fa-tag' },
                            { id: 3, title: 'Nội dung & Hình ảnh', icon: 'fas fa-image' }
                        ].map(s => (
                            <div key={s.id} className={`wizard-step ${step >= s.id ? 'active' : ''}`} onClick={() => setStep(s.id)}>
                                <div className="wizard-step-icon"><i className={s.icon}></i></div>
                                <div className="wizard-step-text">{s.title}</div>
                            </div>
                        ))}
                    </div>

                    <div onKeyDown={(e) => { 
                        if (e.key === 'Enter') {
                            e.preventDefault(); 
                            if (step < 3) nextStep();
                        }
                    }}>
                        {step === 1 && (
                            <div className="step-content">
                                <h3 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text)', fontSize: '1.2rem' }}>1. Thiết lập cơ bản</h3>
                                <div className="form-grid-1">
                                    <Field label="Tên khóa học" required error={errors.title}>
                                        <div className="input-with-icon">
                                            <i className="fas fa-heading"></i>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="VD: Lập trình React từ Zero đến Hero..."
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                style={{ paddingLeft: '42px' }}
                                                autoFocus
                                            />
                                        </div>
                                    </Field>
                                </div>
                                <div className="form-grid-2" style={{ marginTop: '24px' }}>
                                    <Field label="Trạng thái hiển thị">
                                        <div className="input-with-icon">
                                            <i className="fas fa-eye"></i>
                                            <select
                                                className="form-select form-control"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                style={{ paddingLeft: '42px' }}
                                            >
                                                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                            </select>
                                        </div>
                                    </Field>
                                    <Field label="Trình độ phù hợp">
                                        <div className="input-with-icon">
                                            <i className="fas fa-layer-group"></i>
                                            <select
                                                className="form-select form-control"
                                                value={data.level}
                                                onChange={e => setData('level', e.target.value)}
                                                style={{ paddingLeft: '42px' }}
                                            >
                                                {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                            </select>
                                        </div>
                                    </Field>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <h3 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text)', fontSize: '1.2rem' }}>2. Chi phí & Cấu hình bán</h3>
                                
                                <div className="form-grid-2">
                                    <Field label="Hình thức học phí">
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handlePricingChange(false)}
                                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${!data.is_free ? 'var(--fire)' : 'var(--border)'}`, background: !data.is_free ? 'var(--fire-d)' : '#fff', color: !data.is_free ? 'var(--fire)' : 'var(--muted)', fontWeight: '600', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <i className="fas fa-coins"></i> Trả phí
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePricingChange(true)}
                                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${data.is_free ? 'var(--green)' : 'var(--border)'}`, background: data.is_free ? 'var(--green-d)' : '#fff', color: data.is_free ? 'var(--green)' : 'var(--muted)', fontWeight: '600', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <i className="fas fa-gift"></i> Miễn phí
                                            </button>
                                        </div>
                                    </Field>
                                    
                                    <Field label="Nhãn đặc biệt (Tùy chọn)">
                                        <button
                                            type="button"
                                            onClick={() => setData('is_vip', !data.is_vip)}
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${data.is_vip ? '#d97706' : 'var(--border)'}`, background: data.is_vip ? 'rgba(217, 119, 6, 0.1)' : '#fff', color: data.is_vip ? '#d97706' : 'var(--muted)', fontWeight: '600', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <i className="fas fa-crown"></i> {data.is_vip ? 'Đã bật Khóa Học VIP' : 'Bật huy hiệu VIP'}
                                        </button>
                                    </Field>
                                </div>

                                {!data.is_free && (
                                    <div className="form-grid-2" style={{ marginTop: '24px' }}>
                                        <Field label="Giá bán (VNĐ)" required error={errors.price}>
                                            <div className="input-with-icon">
                                                <i className="fas fa-money-bill-wave"></i>
                                                <input
                                                    type="number" min="0"
                                                    className="form-control"
                                                    placeholder="VD: 500000"
                                                    value={data.price}
                                                    onChange={e => setData('price', e.target.value)}
                                                    style={{ paddingLeft: '42px' }}
                                                />
                                            </div>
                                        </Field>
                                        <Field label="Giá gốc (gạch ngang)" error={errors.original_price}>
                                            <div className="input-with-icon">
                                                <i className="fas fa-tags"></i>
                                                <input
                                                    type="number" min="0"
                                                    className="form-control"
                                                    placeholder="VD: 1000000"
                                                    value={data.original_price}
                                                    onChange={e => setData('original_price', e.target.value)}
                                                    style={{ paddingLeft: '42px' }}
                                                />
                                            </div>
                                            {discountPercent > 0 && (
                                                <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--fire)', fontWeight: '600' }}>
                                                    <i className="fas fa-arrow-down"></i> Giảm {discountPercent}% so với giá gốc
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                )}
                                
                                {data.is_free && (
                                    <div style={{ marginTop: '24px', padding: '16px', background: 'var(--green-d)', color: 'var(--green)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' }}>
                                        <i className="fas fa-check-circle" style={{ fontSize: '1.2rem' }}></i>
                                        Khóa học này sẽ được phát hành miễn phí cho tất cả học viên.
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <h3 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text)', fontSize: '1.2rem' }}>3. Hình ảnh & Mô tả</h3>
                                
                                <Field label="Ảnh bìa khóa học" error={errors.thumbnail}>
                                    <label className="compact-dropzone">
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onThumbnailChange(e.target.files[0] || null)} />
                                        {(preview || currentThumbnailUrl) ? (
                                            <img src={preview || currentThumbnailUrl} alt="Cover" />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'var(--muted2)' }}>
                                                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
                                                <div style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text)' }}>Nhấn để tải ảnh lên</div>
                                                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>PNG, JPG (Khuyên dùng: 1280x720)</div>
                                            </div>
                                        )}
                                        {(preview || currentThumbnailUrl) && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', transition: '0.2s', ':hover': { opacity: 1 } }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                                                <i className="fas fa-camera"></i>
                                            </div>
                                        )}
                                    </label>
                                </Field>

                                <div className="form-grid-1" style={{ marginTop: '24px' }}>
                                    <Field label="Mô tả tổng quan">
                                        <div className="input-with-icon textarea-icon">
                                            <i className="fas fa-align-left"></i>
                                            <textarea
                                                className="form-control"
                                                style={{ resize: 'vertical', minHeight: '100px', paddingLeft: '42px' }}
                                                placeholder="Giới thiệu nhanh về khóa học..."
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <div className="form-grid-2" style={{ marginTop: '24px' }}>
                                    <Field label="Yêu cầu đầu vào">
                                        <div className="input-with-icon textarea-icon">
                                            <i className="fas fa-clipboard-list"></i>
                                            <textarea
                                                className="form-control"
                                                style={{ resize: 'vertical', minHeight: '100px', paddingLeft: '42px' }}
                                                placeholder="- Cần biết sử dụng máy tính cơ bản..."
                                                value={data.requirements}
                                                onChange={e => setData('requirements', e.target.value)}
                                            />
                                        </div>
                                    </Field>
                                    <Field label="Kết quả đạt được">
                                        <div className="input-with-icon textarea-icon">
                                            <i className="fas fa-trophy"></i>
                                            <textarea
                                                className="form-control"
                                                style={{ resize: 'vertical', minHeight: '100px', paddingLeft: '42px' }}
                                                placeholder="- Tự tay xây dựng được..."
                                                value={data.outcomes}
                                                onChange={e => setData('outcomes', e.target.value)}
                                            />
                                        </div>
                                    </Field>
                                </div>
                            </div>
                        )}

                        <div className="step-actions">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '0.95rem' }}>
                                    <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Quay lại
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="btn-primary" style={{ padding: '12px 28px', borderRadius: '10px', background: 'var(--fire)', fontSize: '0.95rem' }}>
                                    Tiếp tục <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                </button>
                            ) : (
                                <button type="button" onClick={handleConfirm} disabled={processing} className="btn-primary" style={{ padding: '12px 32px', borderRadius: '10px', background: 'var(--fire)', fontSize: '1rem', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}>
                                    {processing ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Đang lưu</> : <><i className="fas fa-check" style={{ marginRight: '8px' }}></i> Xác nhận</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Field({ label, required, error, children, style }) {
    return (
        <div style={style} className="form-group">
            {label && (
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                    {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
                </label>
            )}
            {children}
            {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-exclamation-circle"></i> {error}</div>}
        </div>
    );
}