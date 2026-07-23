import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import SweetAlert from '@/Components/SweetAlert';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ChapterItem from './ChapterItem';
import UploadVideoModal from './UploadVideoModal';
import AddChapterModal from './AddChapterModal';

export default function Curriculum({ course, chapters: initialChapters }) {
    const { auth } = usePage().props;
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const limitBytes = auth?.seller_storage_limit || 0;
    const usedBytes = auth?.seller_storage_used || 0;
    const usedPercentage = limitBytes > 0 ? (usedBytes / limitBytes) * 100 : 0;
    const isNearLimit = usedPercentage >= 90;

    const [chapters, setChapters] = useState(initialChapters || []);
    const [uploadModalLesson, setUploadModalLesson] = useState(null);
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState(chapters?.length > 0 ? [chapters[0].id] : []);
    const [confirmDeleteChapter, setConfirmDeleteChapter] = useState({ show: false, chapterId: null });
    const [confirmDeleteLesson, setConfirmDeleteLesson] = useState({ show: false, lessonId: null });

    const lessonForm = useForm({ title: '', type: 'video' });

    useEffect(() => {
        setChapters(initialChapters || []);
    }, [initialChapters]);

    const toggleChapter = useCallback((chapterId) => {
        setExpandedChapters(prev =>
            prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
        );
    }, []);

    const openLessonModal = useCallback((chapterId) => {
        setActiveChapterId(chapterId);
        setShowLessonModal(true);
    }, []);

    const deleteChapter = useCallback((chapterId) => {
        setConfirmDeleteChapter({ show: true, chapterId });
    }, []);

    const deleteLesson = useCallback((lessonId) => {
        setConfirmDeleteLesson({ show: true, lessonId });
    }, []);

    const formatDuration = useCallback((seconds) => {
        if (!seconds) return '--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}p ${s > 0 ? s + 's' : ''}`;
    }, []);

    const openVideoPlayer = useCallback((lesson) => {
        router.get(route('seller.courses.curriculum.lessons.show', [course.id, lesson.id]));
    }, [course.id]);

    const submitLesson = (e) => {
        e.preventDefault();

        lessonForm.post(route('seller.courses.curriculum.chapters.lessons.store', [course.id, activeChapterId]), {
            preserveScroll: true,
            onSuccess: () => {
                lessonForm.reset();
                setShowLessonModal(false);
            }
        });
    };

    const onDragEnd = useCallback((result) => {
        const { source, destination, type } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const updatedChapters = [...chapters];

        if (type === 'CHAPTER') {
            const [movedChapterData] = updatedChapters.splice(source.index, 1);
            updatedChapters.splice(destination.index, 0, movedChapterData);
            setChapters(updatedChapters);

            router.post(route('seller.courses.curriculum.chapters.reorder', course.id), {
                ids: updatedChapters.map(c => c.id)
            }, { preserveScroll: true });
        }

        if (type === 'LESSON') {
            const sourceChapterIndex = updatedChapters.findIndex(c => `lessons-${c.id}` === source.droppableId);
            const destChapterIndex = updatedChapters.findIndex(c => `lessons-${c.id}` === destination.droppableId);
            if (sourceChapterIndex === -1 || destChapterIndex === -1) return;

            const sourceChapter = updatedChapters[sourceChapterIndex];
            const destChapter = updatedChapters[destChapterIndex];
            const sourceLessons = [...(sourceChapter.lessons || [])];
            const destLessons = source.droppableId === destination.droppableId ? sourceLessons : [...(destChapter.lessons || [])];

            const [movedLesson] = sourceLessons.splice(source.index, 1);

            if (source.droppableId === destination.droppableId) {
                sourceLessons.splice(destination.index, 0, movedLesson);
                updatedChapters[sourceChapterIndex].lessons = sourceLessons;
            } else {
                destLessons.splice(destination.index, 0, movedLesson);
                updatedChapters[sourceChapterIndex].lessons = sourceLessons;
                updatedChapters[destChapterIndex].lessons = destLessons;
            }

            setChapters(updatedChapters);

            router.post(route('seller.courses.curriculum.lessons.reorder', course.id), {
                lesson_id: movedLesson.id,
                source_chapter_id: sourceChapter.id,
                target_chapter_id: destChapter.id,
                target_index: destination.index,
                sorted_ids: destLessons.map(l => l.id)
            }, { preserveScroll: true });
        }
    }, [chapters, course.id]);

    return (
        <>
            <Head title={`Giáo trình: ${course.title}`} />

            <SweetAlert
                show={confirmDeleteChapter.show}
                type="confirm"
                icon="warning"
                title="Xóa chương?"
                text="Bạn có chắc chắn muốn xóa chương này và toàn bộ bài học bên trong?"
                confirmButtonText="Xóa"
                cancelButtonText="Hủy"
                confirmButtonColor="#ef4444"
                onConfirm={() => {
                    router.delete(route('seller.courses.curriculum.chapters.destroy', [course.id, confirmDeleteChapter.chapterId]), { preserveScroll: true });
                }}
                onClose={() => setConfirmDeleteChapter({ show: false, chapterId: null })}
            />

            <SweetAlert
                show={confirmDeleteLesson.show}
                type="confirm"
                icon="warning"
                title="Xóa bài học?"
                text="Bạn có chắc chắn muốn xóa bài học này?"
                confirmButtonText="Xóa"
                cancelButtonText="Hủy"
                confirmButtonColor="#ef4444"
                onConfirm={() => {
                    router.delete(route('seller.courses.curriculum.lessons.destroy', [course.id, confirmDeleteLesson.lessonId]), { preserveScroll: true });
                }}
                onClose={() => setConfirmDeleteLesson({ show: false, lessonId: null })}
            />

            <div className="page">
                <div className="page-header">
                    <div>
                        <Link href={route('seller.courses.index')} className="ef-backlink" style={{ textDecoration: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                            <i className="fas fa-arrow-left"></i> Quay lại
                        </Link>
                        <div className="page-title">Giáo trình: {course.title}</div>
                        <div className="page-sub">Xây dựng cấu trúc chương mục, kéo thả sắp xếp và tải lên nội dung bài giảng</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '200px', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '10px 16px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                                <span>Lưu trữ (R2)</span>
                                <span>{formatBytes(usedBytes)} / {formatBytes(limitBytes)}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(usedPercentage, 100)}%`, height: '100%', backgroundColor: isNearLimit ? '#ef4444' : '#f97316', transition: 'width 0.3s ease' }}></div>
                            </div>
                            {isNearLimit && (
                                <Link href={route('seller.vip.index')} style={{ display: 'block', textAlign: 'right', fontSize: '12px', color: '#ef4444', marginTop: '6px', textDecoration: 'none', fontWeight: '500' }}>
                                    Nâng cấp gói VIP <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            )}
                        </div>
                        <button onClick={() => setShowChapterModal(true)} className="btn-primary" style={{ padding: '10px 20px', height: 'fit-content' }}>
                            <i className="fa-solid fa-plus"></i> Thêm Chương
                        </button>
                    </div>
                </div>

                <div className="table-card" style={{ padding: '20px', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <div id="curriculumWrapper" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                        {chapters.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px', color: 'var(--muted)' }}>
                                Khóa học này chưa có chương nào. Hãy tạo chương đầu tiên!
                            </div>
                        )}

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="all-chapters" type="CHAPTER">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {chapters.map((chapter, index) => (
                                            <ChapterItem
                                                key={chapter.id}
                                                chapter={chapter}
                                                index={index}
                                                course={course}
                                                isOpen={expandedChapters.includes(chapter.id)}
                                                toggleChapter={toggleChapter}
                                                deleteChapter={deleteChapter}
                                                openLessonModal={openLessonModal}
                                                formatDuration={formatDuration}
                                                deleteLesson={deleteLesson}
                                                openUploadModal={setUploadModalLesson}
                                                openVideoPlayer={openVideoPlayer}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>


            <AddChapterModal
                show={showChapterModal}
                onClose={() => setShowChapterModal(false)}
                courseId={course.id}
            />


            {showLessonModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s' }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '420px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transform: 'translateY(0)', animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                <i className="fas fa-play-circle"></i>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>Thêm Bài Học Mới</h3>
                        </div>
                        <form onSubmit={submitLesson}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Tên bài học</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-file-signature"></i>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên bài học..."
                                        value={lessonForm.data.title}
                                        onChange={e => lessonForm.setData('title', e.target.value)}
                                        autoFocus required
                                        className="form-control"
                                        style={{ paddingLeft: '42px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Loại bài học</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-photo-video"></i>
                                    <select
                                        value={lessonForm.data.type}
                                        onChange={e => lessonForm.setData('type', e.target.value)}
                                        className="form-select form-control"
                                        style={{ paddingLeft: '42px' }}
                                    >
                                        <option value="video">Video (Tải lên hoặc nhúng)</option>
                                        <option value="document">Tài liệu (PDF/Text)</option>
                                        <option value="quiz_only">Bài tập / Trắc nghiệm</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setShowLessonModal(false)} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '8px' }}>Hủy bỏ</button>
                                <button type="submit" disabled={lessonForm.processing} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', background: '#f97316', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {lessonForm.processing ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu</> : <><i className="fas fa-plus"></i> Tạo bài học</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <UploadVideoModal
                show={!!uploadModalLesson}
                onClose={() => setUploadModalLesson(null)}
                lesson={uploadModalLesson}
                course={course}
            />
        </>
    );
}

Curriculum.layout = page => <SellerLayout children={page} />;
