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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '420px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transform: 'translateY(0)', animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--fire-d)', color: 'var(--fire)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <i className="fas fa-folder-plus"></i>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>Thêm Chương Mới</h3>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Tên chương</label>
                        <div className="input-with-icon">
                            <i className="fas fa-heading"></i>
                            <input
                                type="text"
                                placeholder="Nhập tên chương..."
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                autoFocus required
                                className="form-control"
                                style={{ paddingLeft: '42px' }}
                            />
                        </div>
                        {errors.title && <div style={{ color: 'var(--red)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><i className="fas fa-exclamation-circle"></i> {errors.title}</div>}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '8px' }}>Hủy bỏ</button>
                        <button type="submit" disabled={processing} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--fire)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {processing ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu</> : <><i className="fas fa-save"></i> Lưu lại</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(AddChapterModal);
