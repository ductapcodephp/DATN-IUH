import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

import CommentsPanel from './Components/CommentsPanel';
import NotesPanel from './Components/NotesPanel';
import QuizPanel from './Components/QuizPanel';
import LessonSidebar from './Components/LessonSidebar';
import CheatWarningModal from './Components/CheatWarningModal';
import CircularProgress from '@/Components/MagicUI/CircularProgress';
import { triggerConfetti } from '@/Components/MagicUI/Confetti';

import { useVideoPlayer } from '../../../hooks/useVideoPlayer';
import { useProgressTracker } from '../../../hooks/useProgressTracker';
import { useQuizEngine } from '../../../hooks/useQuizEngine';
import Swal from 'sweetalert2';

export default function Learn({ course, userQuizResults = {}, courseProgress = 0, completedLessonIds = [], lessonProgresses = {}, reportTopics = [] }) {
    const { chapters } = course;
    const [activeLesson, setActiveLesson] = useState(null);
    const [localCompleted, setLocalCompleted] = useState(completedLessonIds); 
    const [localProgresses, setLocalProgresses] = useState(lessonProgresses || {});
    const [progress, setProgress] = useState(courseProgress);

    useEffect(() => {
        if (progress >= 100) {
            triggerConfetti({ count: 120, duration: 4000 });
        }
    }, [progress]);


    const flattenedLessons = chapters.reduce((acc, chapter) => {
        return acc.concat(chapter.lessons || []);
    }, []);

    const isLessonUnlocked = (lesson) => {
        const index = flattenedLessons.findIndex(l => l.id === lesson.id);
        if (index <= 0) return true;
        const prevLesson = flattenedLessons[index - 1];
        return localCompleted.includes(prevLesson.id);
    };

    const [showCommentsPanel, setShowCommentsPanel] = useState(false);
    const [showNotesPanel, setShowNotesPanel] = useState(false);

    const [showNoteForm, setShowNoteForm] = useState(false);
    const [currentNoteTime, setCurrentNoteTime] = useState('00:00');

    const { videoRef, playerRef } = useVideoPlayer(activeLesson);
    
    const { showCheatModal, cheatMessage, setShowCheatModal } = useProgressTracker({
        activeLesson,
        course,
        playerRef,
        localCompleted,
        localProgresses,
        setLocalProgresses,
        setLocalCompleted,
        setProgress,
        flattenedLessons
    });

    const {
        quizActive,
        selectedAnswers,
        quizSubmitted,
        activeQuiz,
        questions,
        handleAnswerSelect,
        submitQuiz,
        handleLessonSelectQuizInit
    } = useQuizEngine({
        activeLesson,
        course,
        userQuizResults,
        localCompleted,
        setLocalCompleted,
        flattenedLessons,
        setProgress
    });

    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleOpenNoteForm = () => {
        let timeInSeconds = 0;
        if (playerRef.current) {
            timeInSeconds = playerRef.current.currentTime();
        }
        setCurrentNoteTime(formatTime(timeInSeconds));
        setShowNoteForm(true);
    };

    useEffect(() => {
        if (chapters && chapters.length > 0 && chapters[0].lessons && chapters[0].lessons.length > 0) {
            handleLessonSelect(chapters[0].lessons[0]);
        }
    }, [chapters]);

    const handleLessonSelect = (lesson) => {
        if (!isLessonUnlocked(lesson)) {
            Swal.fire({
                title: 'Bài học chưa mở khóa',
                text: 'Bạn cần hoàn thành bài học trước đó để mở khóa bài này!',
                icon: 'warning',
                confirmButtonColor: '#ea580c',
            });
            return;
        }
        setActiveLesson(lesson);
        handleLessonSelectQuizInit(lesson);
    };

    return (
        <div className="learn-page-body">
            <Head title={`Đang học: ${course.title} - EduFlow`} />

            {/* NAV GLOBAL (F8 Style) */}
            <nav className="learn-nav-global">
                <Link href={route('frontend.course.detail', course.slug)} className="learn-nav-back">
                    <i className="fa-solid fa-chevron-left"></i>
                </Link>
                <Link href={route('frontend.home')} className="text-dark text-decoration-none fw-bold fs-5 d-flex align-items-center">
                    Edu<span className="text-accent">Flow</span>
                </Link>

                <h1 className="learn-nav-title mb-0 text-truncate d-none d-md-block">
                    {course.title}
                </h1>

                <div className="learn-nav-actions">
                    <div className="learn-streak-badge d-none d-md-flex align-items-center gap-1">
                        <span className="fs-6">🔥</span> 5 ngày liên tục
                    </div>

                    <div className="d-none d-md-flex align-items-center gap-2 px-2 py-1 bg-white rounded-pill border shadow-sm">
                        <CircularProgress value={progress} size={36} strokeWidth={4} color="#EA580C" fontSize="10px" />
                        <span className="fw-semibold text-muted font-sm me-1">Tiến độ</span>
                    </div>

                    <button className="learn-nav-icon" onClick={() => setShowNotesPanel(true)} title="Ghi chú bài học">
                        <i className="fa-solid fa-file-lines"></i>
                    </button>
                    <button className="learn-nav-icon" onClick={() => setShowCommentsPanel(true)} title="Hỏi đáp & Thảo luận">
                        <i className="fa-solid fa-circle-question"></i>
                    </button>
                </div>
            </nav>

            <div className="learn-wrapper-f8">
                {/* MAIN CONTENT */}
                <main className="learn-main-f8">
                    {!quizActive ? (
                        <>
                            {/* VIDEO */}
                            <div className="video-container bg-black flex-shrink-0 w-100" id="videoContainer" style={{ aspectRatio: '16/9', maxHeight: '70vh' }}>
                                <div ref={videoRef} className="w-100 h-100"></div>
                            </div>

                            {/* LESSON INFO & NOTES */}
                            <div className="learn-lesson-content bg-white p-4 p-md-5 border-top">
                                <div className="mx-auto" style={{ maxWidth: '860px' }}>
                                    <h1 className="fw-bold mb-2 text-dark" style={{ fontSize: '28px' }}>
                                        {activeLesson?.title || '1.2 IIFE là gì?'}
                                    </h1>
                                    <div className="text-muted mb-4" style={{ fontSize: '13px' }}>
                                        Cập nhật tháng 11 năm 2023
                                    </div>

                                    <div className="learn-lesson-description text-dark mb-5" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                        Tham gia các cộng đồng để cùng học hỏi, chia sẻ và "thám thính" xem khóa học sắp có gì mới nhé! Trong bài học này, chúng ta sẽ tìm hiểu về IIFE (Immediately Invoked Function Expression) - một pattern quan trọng trong JavaScript giúp tạo ra scope riêng biệt, tránh xung đột biến với global scope. Đây là kiến thức nền tảng cực kỳ quan trọng trước khi bước vào các khái niệm nâng cao hơn như Closure, Module Pattern hay các design pattern phổ biến khác trong JavaScript hiện đại. Hãy chú ý theo dõi kỹ ví dụ minh họa và thực hành lại nhiều lần để nắm chắc bản chất của cơ chế này nhé.
                                        <br /><br />
                                        <ul className="list-unstyled">
                                            <li className="mb-2">- Fanpage: <a href="https://www.facebook.com/f8vnofficial" target="_blank" className="text-accent text-decoration-none hover-underline">https://www.facebook.com/f8vnofficial</a></li>
                                            <li className="mb-2">- Group: <a href="https://www.facebook.com/groups/649972919142215" target="_blank" className="text-accent text-decoration-none hover-underline">https://www.facebook.com/groups/649972919142215</a></li>
                                            <li>- Youtube: <a href="https://www.youtube.com/F8VNOfficial" target="_blank" className="text-accent text-decoration-none hover-underline">https://www.youtube.com/F8VNOfficial</a></li>
                                        </ul>
                                    </div>

                                    <div className="learn-note-section">
                                        {!showNoteForm ? (
                                            <button
                                                className="btn btn-outline-secondary fw-semibold rounded-pill px-4 py-2"
                                                onClick={handleOpenNoteForm}
                                            >
                                                <i className="fa-solid fa-plus me-2"></i> Thêm ghi chú
                                            </button>
                                        ) : (
                                            <div className="learn-note-form-container mt-3">
                                                <div className="d-flex align-items-center mb-3">
                                                    <span className="fw-semibold me-2 text-dark">Thêm ghi chú tại</span>
                                                    <span className="badge rounded-pill text-white px-3 py-1" style={{ backgroundColor: 'var(--accent)', fontSize: '14px' }}>
                                                        {currentNoteTime}
                                                    </span>
                                                </div>

                                                <div className="border rounded-3 overflow-hidden bg-white">
                                                    {/* Toolbar */}
                                                    <div className="learn-note-toolbar d-flex align-items-center gap-3 px-3 py-2 border-bottom bg-light">
                                                        <select className="form-select form-select-sm w-auto border-0 bg-transparent shadow-none fw-semibold text-dark">
                                                            <option>Normal</option>
                                                            <option>Heading 1</option>
                                                            <option>Heading 2</option>
                                                        </select>
                                                        <div className="vr"></div>
                                                        <button className="btn btn-sm text-secondary p-1"><i className="fa-solid fa-bold"></i></button>
                                                        <button className="btn btn-sm text-secondary p-1"><i className="fa-solid fa-italic"></i></button>
                                                        <div className="vr"></div>
                                                        <button className="btn btn-sm text-secondary p-1"><i className="fa-solid fa-list-ul"></i></button>
                                                        <button className="btn btn-sm text-secondary p-1"><i className="fa-solid fa-list-ol"></i></button>
                                                    </div>
                                                    {/* Editor */}
                                                    <textarea
                                                        className="form-control border-0 shadow-none w-100 p-3"
                                                        rows="4"
                                                        placeholder="Nội dung ghi chú..."
                                                        style={{ resize: 'none', fontSize: '15px' }}
                                                    ></textarea>
                                                </div>

                                                <div className="d-flex justify-content-end gap-2 mt-3">
                                                    <button
                                                        className="btn text-secondary fw-semibold bg-transparent border-0"
                                                        onClick={() => setShowNoteForm(false)}
                                                    >
                                                        Hủy bỏ
                                                    </button>
                                                    <button className="btn text-white fw-bold px-4 rounded-pill" style={{ backgroundColor: '#fd7e14' }}>
                                                        Tạo ghi chú
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <QuizPanel 
                            activeLesson={activeLesson}
                            activeQuiz={activeQuiz}
                            questions={questions}
                            selectedAnswers={selectedAnswers}
                            quizSubmitted={quizSubmitted}
                            handleAnswerSelect={handleAnswerSelect}
                            submitQuiz={submitQuiz}
                        />
                    )}

                    {/* FIXED FOOTER */}
                    <div className="learn-footer-fixed">
                        <button
                            className="learn-btn-prev d-flex align-items-center"
                            disabled={flattenedLessons.findIndex(l => l.id === activeLesson?.id) <= 0}
                            onClick={() => {
                                const currentIndex = flattenedLessons.findIndex(l => l.id === activeLesson?.id);
                                if (currentIndex > 0) {
                                    handleLessonSelect(flattenedLessons[currentIndex - 1]);
                                }
                            }}
                        >
                            <i className="fa-solid fa-chevron-left me-2 fs-6"></i> <span className="d-none d-md-inline">BÀI TRƯỚC</span>
                        </button>

                        <div className="learn-breadcrumb d-none d-md-block">
                            <span className="learn-breadcrumb-active">{course.title}</span>
                            <i className="fa-solid fa-chevron-right mx-2 text-muted" style={{ fontSize: '10px' }}></i>
                            <span>{activeLesson?.title}</span>
                        </div>

                        <button
                            className="learn-btn-next d-flex align-items-center"
                            disabled={flattenedLessons.findIndex(l => l.id === activeLesson?.id) >= flattenedLessons.length - 1}
                            onClick={() => {
                                const currentIndex = flattenedLessons.findIndex(l => l.id === activeLesson?.id);
                                if (currentIndex !== -1 && currentIndex < flattenedLessons.length - 1) {
                                    const nextLesson = flattenedLessons[currentIndex + 1];
                                    if (localCompleted.includes(activeLesson?.id)) {
                                        handleLessonSelect(nextLesson);
                                    } else {
                                        Swal.fire({
                                            title: 'Chưa hoàn thành',
                                            text: 'Bạn cần hoàn thành bài học hiện tại trước khi chuyển bài!',
                                            icon: 'warning',
                                            confirmButtonColor: '#ea580c',
                                        });
                                    }
                                }
                            }}
                        >
                            <span className="d-none d-md-inline">BÀI TIẾP THEO</span> <i className="fa-solid fa-chevron-right ms-2 fs-6"></i>
                        </button>
                    </div>
                </main>

                <LessonSidebar 
                    chapters={chapters}
                    activeLesson={activeLesson}
                    localCompleted={localCompleted}
                    localProgresses={localProgresses}
                    isLessonUnlocked={isLessonUnlocked}
                    handleLessonSelect={handleLessonSelect}
                    formatTime={formatTime}
                />
            </div>

            {/* OVERLAYS & FAB */}
            <button className="learn-fab-comment" onClick={() => setShowCommentsPanel(true)}>
                <i className="fa-solid fa-comment-dots fs-4" style={{ color: '#fd7e14' }}></i> Hỏi đáp
            </button>

            <CommentsPanel 
                isOpen={showCommentsPanel} 
                onClose={() => setShowCommentsPanel(false)} 
                lessonId={activeLesson?.id}
                courseSlug={course.slug}
                reportTopics={reportTopics}
            />
            <NotesPanel isOpen={showNotesPanel} onClose={() => setShowNotesPanel(false)} activeLesson={activeLesson} />

            <CheatWarningModal 
                show={showCheatModal} 
                message={cheatMessage} 
                onClose={() => setShowCheatModal(false)} 
            />
        </div>
    );
}
