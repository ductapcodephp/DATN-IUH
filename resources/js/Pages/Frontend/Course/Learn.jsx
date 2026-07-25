import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';

import CommentsPanel from './Components/CommentsPanel';
import NotesPanel from './Components/NotesPanel';

export default function Learn({ course, userQuizResults = {}, courseProgress = 0, completedLessonIds = [], lessonProgresses = {}, reportTopics = [] }) {
    const { chapters } = course;
    const [activeLesson, setActiveLesson] = useState(null);
    const [localCompleted, setLocalCompleted] = useState(completedLessonIds); // nhận id khóa học đã mở khóa
    const [localProgresses, setLocalProgresses] = useState(lessonProgresses || {});
    const [showCheatModal, setShowCheatModal] = useState(false);
    const [cheatMessage, setCheatMessage] = useState("");

    const flattenedLessons = chapters.reduce((acc, chapter) => {
        return acc.concat(chapter.lessons || []);
    }, []);

    const isLessonUnlocked = (lesson) => {
        const index = flattenedLessons.findIndex(l => l.id === lesson.id);
        if (index <= 0) return true;
        const prevLesson = flattenedLessons[index - 1];
        return localCompleted.includes(prevLesson.id);
    };
    const [quizActive, setQuizActive] = useState(false);
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // Quiz state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    // Overlay states
    const [showCommentsPanel, setShowCommentsPanel] = useState(false);
    const [showNotesPanel, setShowNotesPanel] = useState(false);

    // Note form state
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [currentNoteTime, setCurrentNoteTime] = useState('00:00');

    // Progress state
    const [progress, setProgress] = useState(courseProgress);

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

        const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        setCurrentNoteTime(`${m}:${s}`);
        setShowNoteForm(true);
    };

    // Initialize with the  first lesson of the first chapter
    useEffect(() => {
        if (chapters && chapters.length > 0 && chapters[0].lessons && chapters[0].lessons.length > 0) {
            handleLessonSelect(chapters[0].lessons[0]);
        }
    }, [chapters]);

    // Initialize VideoJS
    useEffect(() => {
        if (activeLesson && activeLesson.type === 'video' && activeLesson.video) {
            if (playerRef.current) {
                const player = playerRef.current;
                player.src({ src: activeLesson.video.url || `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`, type: activeLesson.video.url ? 'video/mp4' : 'application/x-mpegURL' });
            } else {
                const videoElement = document.createElement('video-js');
                videoElement.classList.add('vjs-default-skin', 'vjs-big-play-centered', 'w-100', 'h-100');
                if (videoRef.current) {
                    videoRef.current.appendChild(videoElement);
                    playerRef.current = videojs(videoElement, {
                        controls: true,
                        preload: 'auto',
                        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                        sources: [{
                            src: activeLesson.video.url || `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`, // Placeholder for actual video source
                            type: activeLesson.video.url ? 'video/mp4' : 'application/x-mpegURL'
                        }]
                    });
                }
            }
        }

        return () => {
            if (playerRef.current) {
                console.log("=== [Cleanup] Tiến hành hủy trình phát video cũ ===");

                playerRef.current.dispose(); 
                playerRef.current = null;    
            }
        };
    }, [activeLesson]);

    const handleLessonSelect = (lesson) => {
        if (!isLessonUnlocked(lesson)) {
            alert('Bạn cần hoàn thành bài học trước đó để mở khóa bài này!');
            return;
        }
        setActiveLesson(lesson);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);

        if (lesson.type === 'quiz_only' || lesson.type === 'quiz') {
            setQuizActive(true);
            const activeQuiz = lesson.quizzes?.[0];
            if (activeQuiz && userQuizResults && userQuizResults[activeQuiz.id]) {
                const result = userQuizResults[activeQuiz.id];
                setSelectedAnswers(result.user_answers || {});
                setQuizSubmitted(true);
            }
        } else {
            setQuizActive(false);
        }
    };

    const activeQuiz = activeLesson?.quizzes?.[0];
    const questions = activeQuiz?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const [quizScore, setQuizScore] = useState(0);
    const handleAnswerSelect = (questionId, answerId, isMultipleChoice) => {
        if (quizSubmitted) return;

        setSelectedAnswers(prev => {
            const currentSelected = prev[questionId] || [];
            if (isMultipleChoice) {
                if (currentSelected.includes(answerId)) {
                    return { ...prev, [questionId]: currentSelected.filter(id => id !== answerId) };
                } else {
                    return { ...prev, [questionId]: [...currentSelected, answerId] };
                }
            } else {
                return { ...prev, [questionId]: [answerId] };
            }
        });
    };

    const submitQuiz = async () => {
        if (!activeQuiz) return;

        let correctCount = 0;

        questions.forEach((q, index) => {
            const selected = selectedAnswers[q.id] || [];
            const correctAnswers = q.answers.filter(a => a.is_correct).map(a => a.id);

            const isCorrect = selected.length === correctAnswers.length &&
                selected.every(id => correctAnswers.includes(id));

            if (isCorrect) {
                correctCount++;
            }

            console.log(`Câu ${index + 1} (${q.id}): %c${isCorrect ? "ĐÚNG 🟢" : "SAI 🔴"}`, isCorrect ? "color: green; font-weight: bold" : "color: red; font-weight: bold");
        });

        setQuizSubmitted(true);

        try {
            const response = await axios.post(route('frontend.course.learn.submit-quiz', { slug: course.slug, quiz: activeQuiz.id }), {
                answers: selectedAnswers
            });
            if (correctCount === questions.length && !localCompleted.includes(activeLesson.id)) {
                setLocalCompleted(prev => {
                    const newCompleted = [...prev, activeLesson.id];
                    const totalLessons = flattenedLessons.length;
                    if (totalLessons > 0) {
                        setProgress(Math.round((newCompleted.length / totalLessons) * 100));
                    }
                    return newCompleted;
                });
            }
        } catch (error) {
            console.error("Lỗi khi nộp bài:", error.response?.data || error.message);
        }

    };


    
    useEffect(() => {
        if (activeLesson && activeLesson.type === 'video' && activeLesson.video) {
            let player;
            if (playerRef.current) {
                player = playerRef.current;
                player.src({
                    src: activeLesson.video.url || `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
                    type: activeLesson.video.url ? 'video/mp4' : 'application/x-mpegURL'
                });
            } else {
                const videoElement = document.createElement('video-js');
                videoElement.classList.add('vjs-default-skin', 'vjs-big-play-centered', 'w-100', 'h-100');
                if (videoRef.current) {
                    videoRef.current.appendChild(videoElement);
                    player = videojs(videoElement, {
                        controls: true,
                        preload: 'auto',
                        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                        sources: [{
                            src: activeLesson.video.url || `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
                            type: activeLesson.video.url ? 'video/mp4' : 'application/x-mpegURL'
                        }]
                    });
                    playerRef.current = player;
                }
            }

            // --- ĐOẠN CODE THEO DÕI TIẾN ĐỘ & CHỐNG TUA ---
            let lastSentTime = 0;
            const isAlreadyCompleted = localCompleted.includes(activeLesson.id);
            let maxWatchedTime = isAlreadyCompleted 
                ? 999999 
                : (localProgresses[activeLesson.id]?.watched_seconds || 0);
            
            // Lấy số giây đã tua từ DB
            let totalSkipped = localProgresses[activeLesson.id]?.skipped_seconds || 0;
            const maxSkipPerSeek = 20; // Tối đa 20s/lần
            
            const updateInterval = 10; 

            const onTimeUpdate = () => {
                if (!player) return;
                const currentTime = player.currentTime();
                const duration = player.duration();

                // Lấy thời lượng tối đa được phép tua (10% của khóa học/bài học)
                const maxTotalSkipAllowed = duration * 0.10;

                // Bắt buộc chỉ cập nhật mốc xa nhất khi KHÔNG PHẢI đang thao tác tua (kéo thả)
                if (!player.seeking()) {
                    // Nếu đang xem bình thường (nhảy thời gian đều đặn < 2s) thì mới lưu kỷ lục
                    if (currentTime > maxWatchedTime && (currentTime - maxWatchedTime) < 2) {
                        maxWatchedTime = currentTime;
                    }
                } else {
                    const jump = currentTime - maxWatchedTime;
                    if (jump > 1) { // Người dùng đang kéo thanh thời gian tiến lên
                        if (jump > maxSkipPerSeek) {
                            player.currentTime(maxWatchedTime);
                            setCheatMessage(`Bạn chỉ được phép tua tối đa ${maxSkipPerSeek} giây mỗi lần!`);
                            setShowCheatModal(true);
                            return; 
                        }

                        if (totalSkipped + jump > maxTotalSkipAllowed) {
                            player.currentTime(maxWatchedTime);
                            setCheatMessage(`Bạn đã hết quyền tua! (Tối đa ${Math.floor(maxTotalSkipAllowed)} giây cho bài này). Tổng đã tua: ${totalSkipped}s.`);
                            setShowCheatModal(true);
                            return; 
                        }

                        // Nếu hợp lệ -> cộng dồn số giây đã tua và cho phép xem tiếp
                        totalSkipped += jump;
                        maxWatchedTime = currentTime;
                    }
                }

                // Lấy thời gian an toàn nhất để tính toán (tránh lỗi nếu có chênh lệch)
                let safeTime = Math.min(currentTime, maxWatchedTime);

                // Kiểm tra nếu video có thời lượng và xem được thêm 1 khoảng thời gian
                if (duration > 0 && (safeTime - lastSentTime >= updateInterval || safeTime === duration)) {
                    lastSentTime = safeTime;

                    axios.post(route('frontend.course.update_video_progress', {
                        slug: course.slug,
                        lessonId: activeLesson.id
                    }), {
                        watched_seconds: safeTime,
                        skipped_seconds: totalSkipped,
                        duration_seconds: duration
                    })
                        .then(response => {
                            // Backend trả về thời gian xem đã được xác thực qua lớp Anti-cheat
                            const confirmedWatched = response.data.watched_seconds;
                            
                            setLocalProgresses(prev => ({
                                ...prev,
                                [activeLesson.id]: {
                                    ...(prev[activeLesson.id] || {}),
                                    watched_seconds: confirmedWatched
                                }
                            }));

                            // Chỉ mở khóa nếu thời gian XÁC THỰC đạt >= 70%
                            if (duration > 0 && (confirmedWatched / duration) >= 0.7) {
                                setLocalCompleted(prev => {
                                    if (!prev.includes(activeLesson.id)) {
                                        const newCompleted = [...prev, activeLesson.id];
                                        const totalLessons = flattenedLessons.length;
                                        if (totalLessons > 0) {
                                            setProgress(Math.round((newCompleted.length / totalLessons) * 100));
                                        }
                                        return newCompleted;
                                    }
                                    return prev;
                                });
                            }
                        })
                        .catch(err => console.error('Lỗi khi lưu tiến trình xem:', err));
                }
            };

            // Sự kiện ngăn chặn tua tiến
            const onSeeking = () => {
                if (!player) return;
                const currentTime = player.currentTime();
                if (currentTime > maxWatchedTime) {
                    // Nếu cố tình tua vượt quá mốc đã xem -> Kéo ngược lại
                    player.currentTime(maxWatchedTime);
                }
            };

            player.on('timeupdate', onTimeUpdate);
            player.on('seeking', onSeeking);

            return () => {
                if (player) {
                    player.off('timeupdate', onTimeUpdate);
                    player.off('seeking', onSeeking);
                }
            };
        }
    }, [activeLesson, course.slug]);
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
                    <div className="learn-streak-badge d-none d-md-flex">
                        <span className="me-1 fs-6">🔥</span> 5 ngày liên tục
                    </div>

                    <div className="d-none d-md-flex align-items-center gap-2" style={{ width: '130px' }}>
                        <div className="progress flex-grow-1" style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                            <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: '#fd7e14', borderRadius: '4px' }}></div>
                        </div>
                        <span className="fw-bold" style={{ fontSize: '13px', color: '#1f2937' }}>{progress}%</span>
                    </div>

                    <button className="learn-nav-icon" onClick={() => setShowNotesPanel(true)}>
                        <i className="fa-solid fa-file-lines"></i>
                    </button>
                    <button className="learn-nav-icon" onClick={() => setShowCommentsPanel(true)}>
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
                        /* QUIZ SECTION (F8 Code Quiz Style) */
                        <div className="learn-quiz-section">
                            <div className="learn-quiz-container">
                                {!activeQuiz || questions.length === 0 ? (
                                    <div className="text-center py-5">
                                        <h4 className="text-muted fw-semibold">Chưa có dữ liệu bài kiểm tra</h4>
                                    </div>
                                ) : (
                                    <>
                                        <div className="learn-quiz-header">
                                            <h2 className="learn-quiz-title">{activeLesson?.title}</h2>
                                            <div className="learn-quiz-date">Cập nhật tháng 11 năm 2023</div>
                                        </div>

                                        {questions.map((q, qIndex) => (
                                            <div key={q.id} className="mb-5 border-bottom pb-4">
                                                <div className="learn-quiz-code-block mb-3">
                                                    <strong>Câu {qIndex + 1}: </strong>
                                                    {q.question}
                                                </div>

                                                <div className="learn-quiz-instruction mb-3">Chọn đáp án đúng:</div>

                                                <div className="d-flex flex-column gap-2">
                                                    {q.answers?.map((answer) => {
                                                        const isSelected = (selectedAnswers[q.id] || []).includes(answer.id);

                                                        let optionClass = "learn-quiz-option";
                                                        let icon = null;

                                                        if (isSelected && !quizSubmitted) {
                                                            optionClass += " is-selected";
                                                        }

                                                        if (quizSubmitted) {
                                                            if (answer.is_correct) {
                                                                optionClass += " is-correct";
                                                                icon = <i className="fa-solid fa-circle-check fs-5 text-success"></i>;
                                                            } else if (isSelected && !answer.is_correct) {
                                                                optionClass += " is-wrong";
                                                                icon = <i className="fa-solid fa-circle-xmark fs-5 text-danger"></i>;
                                                            } else {
                                                                optionClass += " opacity-50";
                                                            }
                                                        }

                                                        return (
                                                            <button
                                                                key={answer.id}
                                                                className={optionClass}
                                                                onClick={() => handleAnswerSelect(q.id, answer.id, false)}
                                                                disabled={quizSubmitted}
                                                            >
                                                                <span>{answer.answer}</span>
                                                                {icon && <span className="ms-auto">{icon}</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {quizSubmitted && q.explanation && (
                                                    <div className="alert mt-4 p-3 d-flex align-items-start border-0 rounded-3" style={{ backgroundColor: '#fff4ed' }}>
                                                        <i className="fa-solid fa-lightbulb fs-4 me-3 mt-1" style={{ color: '#fd7e14' }}></i>
                                                        <div>
                                                            <h6 className="fw-bold mb-1" style={{ color: '#fd7e14' }}>Giải thích</h6>
                                                            <p className="mb-0 text-dark font-sm">{q.explanation}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {!quizSubmitted && (
                                            <div className="mt-2 text-center">
                                                <button
                                                    className="learn-quiz-submit-btn py-3 px-5 fw-bold"
                                                    disabled={Object.keys(selectedAnswers).length === 0}
                                                    onClick={submitQuiz}
                                                >
                                                    NỘP BÀI TẬP
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
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
                                        alert('Bạn cần hoàn thành bài học hiện tại trước!');
                                    }
                                }
                            }}
                        >
                            <span className="d-none d-md-inline">BÀI TIẾP THEO</span> <i className="fa-solid fa-chevron-right ms-2 fs-6"></i>
                        </button>
                    </div>
                </main>

                {/* SIDEBAR */}
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

            {/* MODAL CẢNH BÁO TUA VIDEO */}
            {showCheatModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-danger text-white border-0 py-3">
                                <h5 className="modal-title fw-bold">
                                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                    Cảnh báo học tập
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheatModal(false)}></button>
                            </div>
                            <div className="modal-body text-center py-4 px-4">
                                <p className="mb-0 fs-5 text-dark fw-medium">{cheatMessage}</p>
                                <p className="text-muted mt-2 mb-0" style={{ fontSize: '14px' }}>Việc tua video quá mức cho phép sẽ bị ghi nhận để đảm bảo chất lượng học tập.</p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 bg-light py-3">
                                <button type="button" className="btn btn-dark px-5 py-2 fw-bold rounded-pill" onClick={() => setShowCheatModal(false)}>
                                    Đã hiểu & Tiếp tục học
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
