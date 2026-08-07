import { useState } from 'react';
import axios from 'axios';


export const useQuizEngine = ({ activeLesson, course, userQuizResults, localCompleted, setLocalCompleted, flattenedLessons, setProgress }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizActive, setQuizActive] = useState(false);

    const activeQuiz = activeLesson?.quizzes?.[0];
    const questions = activeQuiz?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleLessonSelectQuizInit = (lesson) => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);

        if (lesson.type === 'quiz_only' || lesson.type === 'quiz') {
            setQuizActive(true);
            const quiz = lesson.quizzes?.[0];
            if (quiz && userQuizResults && userQuizResults[quiz.id]) {
                const result = userQuizResults[quiz.id];
                setSelectedAnswers(result.user_answers || {});
                setQuizSubmitted(true);
            }
        } else {
            setQuizActive(false);
        }
    };

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

    return {
        quizActive,
        currentQuestionIndex,
        selectedAnswers,
        quizSubmitted,
        quizScore,
        activeQuiz,
        questions,
        currentQuestion,
        handleAnswerSelect,
        submitQuiz,
        handleLessonSelectQuizInit
    };
};
