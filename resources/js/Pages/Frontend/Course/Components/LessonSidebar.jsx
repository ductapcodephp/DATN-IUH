import React from 'react';

export default function LessonSidebar({ chapters, activeLesson, localCompleted, localProgresses, isLessonUnlocked, handleLessonSelect, formatTime }) {
    return (
        <aside className="learn-sidebar-f8">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center flex-shrink-0" style={{ backgroundColor: '#f7f8fa' }}>
                <h6 className="fw-bold mb-0" style={{ color: '#1f2937' }}>Nội dung khóa học</h6>
                <button className="btn btn-sm btn-light border d-md-none bg-white"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="overflow-auto flex-grow-1">
                <div className="accordion accordion-flush" id="learnAccordion">
                    {chapters.map((chapter, index) => (
                        <div className="accordion-item border-bottom border-0" key={chapter.id}>
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button fw-bold py-3 px-3 shadow-none border-bottom ${index === 0 ? '' : 'collapsed'}`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#sec${chapter.id}`}
                                    style={{ backgroundColor: '#f7f8fa', color: '#1f2937', fontSize: '15px' }}
                                >
                                    <div className="d-flex flex-column text-start w-100">
                                        <span>{index + 1}. {chapter.title}</span>
                                        <span className="text-muted fw-normal mt-1" style={{ fontSize: '12px' }}>
                                            {chapter.lessons?.filter(l => localCompleted.includes(l.id)).length || 0}/{chapter.lessons?.length || 0} bài học
                                        </span>
                                    </div>
                                </button>
                            </h2>
                            <div id={`sec${chapter.id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#learnAccordion">
                                <div className="list-group list-group-flush">
                                    {chapter.lessons && chapter.lessons.map((lesson, lIndex) => {
                                        const isActive = activeLesson && activeLesson.id === lesson.id;
                                        const isQuiz = lesson.type === 'quiz_only' || lesson.type === 'quiz';
                                        const isCompleted = localCompleted.includes(lesson.id);
                                        const unlocked = isLessonUnlocked(lesson);

                                        return (
                                            <button
                                                key={lesson.id}
                                                className={`list-group-item list-group-item-action d-flex align-items-start gap-3 px-3 py-3 text-start border-0 border-bottom ${!unlocked ? 'opacity-50' : ''}`}
                                                style={{
                                                    backgroundColor: isActive ? '#fff4ed' : '#fff',
                                                    cursor: unlocked ? 'pointer' : 'not-allowed'
                                                }}
                                                onClick={() => handleLessonSelect(lesson)}
                                            >
                                                {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#fd7e14' }}></div>}

                                                <div className="lesson-info flex-grow-1 ps-2">
                                                    <div className="mb-1" style={{ fontSize: '14px', fontWeight: isActive ? '600' : '500', color: '#1f2937' }}>
                                                        {index + 1}.{lIndex + 1} {lesson.title}
                                                    </div>
                                                    <div className="d-flex align-items-center" style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        {isQuiz ? (
                                                            <><i className="fa-solid fa-file-code me-2" style={{ color: isActive ? '#fd7e14' : '#6b7280' }}></i> Bài tập</>
                                                        ) : (
                                                            <><i className="fa-solid fa-circle-play me-2" style={{ color: isActive ? '#fd7e14' : '#6b7280' }}></i> {formatTime(localProgresses[lesson.id]?.watched_seconds || 0)}</>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {isCompleted ? (
                                                        <i className="fa-solid fa-circle-check" style={{ color: '#198754' }}></i>
                                                    ) : (
                                                        !unlocked ? (
                                                            <i className="fa-solid fa-lock" style={{ color: '#d1d5db' }}></i>
                                                        ) : null
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
