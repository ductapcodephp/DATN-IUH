import React from 'react';
import { useForm } from '@inertiajs/react';

const AddChapterModal = ({ show, onClose, courseId }) => {
    if (!show) return null;

    const { data, setData, post, processing, errors, reset } = useForm({ title: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.courses.curriculum.chapters.store', courseId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                <h3 style={{ marginTop: 0 }}>Thêm Chương Mới</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Tên chương</label>
                        <input
                            type="text"
                            placeholder="Nhập tên chương..."
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            autoFocus required
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        {errors.title && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.title}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                        <button type="submit" disabled={processing} style={{ padding: '8px 16px', border: 'none', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                            {processing ? 'Đang lưu...' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(AddChapterModal);
