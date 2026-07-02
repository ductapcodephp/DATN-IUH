import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useForm } from '@inertiajs/react';
import LessonItem from './Lesson/LessonItem';

const ChapterItem = React.memo(({ 
    chapter, 
    index, 
    course, 
    isOpen, // Nhận trực tiếp biến primitive boolean
    toggleChapter, 
    deleteChapter, 
    openLessonModal,
    formatDuration,
    deleteLesson,
    openUploadModal,
    openVideoPlayer
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const editChapterForm = useForm({ title: chapter.title });

    const startEditChapter = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        editChapterForm.setData('title', chapter.title);
    };

    const cancelEditChapter = (e) => {
        e.stopPropagation();
        setIsEditing(false);
        editChapterForm.reset();
    };

    const submitEditChapter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        editChapterForm.put(route('seller.courses.curriculum.chapters.update', [course.id, chapter.id]), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false)
        });
    };

    return (
        <Draggable draggableId={`chapter-${chapter.id}`} index={index}>
            {(providedChapter) => (
                <div 
                    ref={providedChapter.innerRef}
                    {...providedChapter.draggableProps}
                    className="curriculum-section" 
                    style={{ marginBottom: '16px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff', ...providedChapter.draggableProps.style }}
                >
                    <div 
                        className="curriculum-header" 
                        onClick={() => !isEditing && toggleChapter(chapter.id)} 
                        style={{ cursor: isEditing ? 'default' : 'pointer', userSelect: 'none', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: isOpen ? '1px solid var(--border)' : 'none', borderRadius: isOpen ? '8px 8px 0 0' : '8px' }}
                    >
                        {isEditing ? (
                            <form onSubmit={submitEditChapter} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }} onClick={(e) => e.stopPropagation()}>
                                <input 
                                    type="text"
                                    value={editChapterForm.data.title}
                                    onChange={e => editChapterForm.setData('title', e.target.value)}
                                    required autoFocus
                                    style={{ padding: '6px 12px', border: '1px solid var(--accent)', borderRadius: '4px', width: '300px', fontSize: '14px' }}
                                />
                                <button type="submit" disabled={editChapterForm.processing} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                                    {editChapterForm.processing ? 'Lưu...' : 'Lưu'}
                                </button>
                                <button type="button" onClick={cancelEditChapter} style={{ padding: '6px 12px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                                    Hủy
                                </button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '15px' }}>
                                <span {...providedChapter.dragHandleProps} style={{ cursor: 'grab', color: '#a1a5b7', padding: '0 4px' }}>
                                    <i className="fa-solid fa-grip-vertical"></i>
                                </span>
                                <i className="fa-solid fa-folder-open" style={{ color: 'var(--fire)' }}></i>
                                {chapter.title}
                                <i onClick={startEditChapter} className="fa-regular fa-pen-to-square" style={{ color: 'var(--muted)', cursor: 'pointer', marginLeft: '6px', fontSize: '14px' }} title="Đổi tên chương"></i>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{chapter.lessons?.length || 0} bài giảng</span>
                            <div onClick={(e) => e.stopPropagation()}>
                                <i onClick={() => deleteChapter(chapter.id)} className="fa-solid fa-trash" style={{ color: 'var(--red)', cursor: 'pointer', marginRight: '8px' }} title="Xóa chương"></i>
                            </div>
                            <i className={`fa-solid ${isOpen ? 'fa-angle-up' : 'fa-angle-down'}`} style={{ color: 'var(--muted2)' }}></i>
                        </div>
                    </div>

                    {isOpen && (
                        <Droppable droppableId={`lessons-${chapter.id}`} type="LESSON">
                            {(providedLesson) => (
                                <div 
                                    ref={providedLesson.innerRef} 
                                    {...providedLesson.droppableProps}
                                    style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '40px' }}
                                >
                                    {chapter.lessons && chapter.lessons.length > 0 ? (
                                        chapter.lessons.map((lesson, lessonIndex) => (
                                            <LessonItem 
                                                key={lesson.id} 
                                                lesson={lesson} 
                                                index={lessonIndex} 
                                                formatDuration={formatDuration} 
                                                course={course}
                                                deleteLesson={deleteLesson} 
                                                openUploadModal={openUploadModal}
                                                openVideoPlayer={openVideoPlayer}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', padding: '8px 0' }}>Chưa có bài học nào trong chương này.</div>
                                    )}
                                    {providedLesson.placeholder}

                                    <div style={{ marginTop: '8px' }}>
                                        <button onClick={() => openLessonModal(chapter.id)} style={{ background: 'transparent', border: '1px dashed var(--border)', padding: '8px 16px', width: '100%', borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer', textAlign: 'left' }}>
                                            <i className="fa-solid fa-plus"></i> Thêm bài học mới vào chương này
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    )}
                </div>
            )}
        </Draggable>
    );
});

export default ChapterItem;