import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from '@inertiajs/react';

const LessonItem = React.memo(({ lesson, index, formatDuration, course, deleteLesson, openUploadModal }) => {
    return (
        <Draggable draggableId={`lesson-${lesson.id}`} index={index}>
            {(providedLesson, snapshotLesson) => (
                <div
                    ref={providedLesson.innerRef}
                    {...providedLesson.draggableProps}
                    className={`dnd-item ${snapshotLesson.isDragging ? 'is-dragging' : ''}`}
                    style={providedLesson.draggableProps.style}
                >
                    {/* BÊN TRÁI */}
                    <div className="dnd-left">
                        <div {...providedLesson.dragHandleProps} className="dnd-handle" title="Giữ và kéo để thay đổi vị trí">
                            <i className="fa-solid fa-grip-vertical"></i>
                        </div>

                        <span style={{ fontSize: '14px' }}>
                            {lesson.type === 'video' && '🎥'}
                            {lesson.type === 'quiz_only' && '❓'}
                            {lesson.type === 'document' && '📄'}
                        </span>

                        <div className="item-title-box">
                            <span className="item-title">{lesson.title}</span>
                            {lesson.type === 'video' && (
                                <span className="item-meta">Thời lượng: {formatDuration(lesson.duration)}</span>
                            )}
                        </div>
                    </div>

                    {/* BÊN PHẢI */}
                    <div className="dnd-right" onClick={(e) => e.stopPropagation()}>
                        {lesson.type === 'video' && (
                            <button onClick={() => openUploadModal(lesson)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} title="Tải nhanh video bài giảng">
                                <i className="fa-solid fa-upload"></i> Video
                            </button>
                        )}

                        <Link href={route('seller.courses.curriculum.lessons.show', [course.id, lesson.id])} className="btn-detail-icon" title="Cấu hình chi tiết bài học">
                            <i className="fa-solid fa-sliders"></i>
                        </Link>

                        <button onClick={() => deleteLesson(lesson.id)} className="action-btn text-muted" title="Xóa bài học">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
});

export default LessonItem;