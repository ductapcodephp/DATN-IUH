import React from 'react';
import { useForm } from '@inertiajs/react';

export default function LessonConfigForm({ course, lesson }) {
    const { data, setData, put, processing } = useForm({
        title: lesson.title || '',
        description: lesson.description || '',
        is_published: lesson.is_published ?? false,
        is_preview: lesson.is_preview ?? false,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('seller.courses.curriculum.lessons.update', { course: course.id, lesson: lesson.id }), {
            preserveScroll: true
        });
    };

    return (
        <div className="card-box sticky">
            <h4 className="card-header">
                <span><i className="fa-solid fa-gear" style={{ color: '#64748b' }}></i> Thiết lập bài học</span>
            </h4>
            
            <form onSubmit={submitEdit}>
                <div className="form-group">
                    <label className="form-label">Tên bài học</label>
                    <input type="text" className="form-control" value={data.title} onChange={e => setData('title', e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Mô tả</label>
                    <textarea rows="4" className="form-control" style={{ resize: 'vertical' }} value={data.description} onChange={e => setData('description', e.target.value)} />
                </div>

                <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                        <input type="checkbox" checked={data.is_preview} onChange={e => setData('is_preview', e.target.checked)} /> Cho xem thử (Preview)
                    </label>
                    <label className="form-checkbox-label">
                        <input type="checkbox" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} /> Xuất bản công khai
                    </label>
                </div>

                <button type="submit" disabled={processing} className="btn btn-primary" style={{ width: '100%' }}>
                    {processing ? 'Đang cập nhật...' : 'Lưu cấu hình'}
                </button>
            </form>
        </div>
    );
}