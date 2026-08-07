import React from 'react';

export default function QuizPanel({ activeLesson, activeQuiz, questions, selectedAnswers, quizSubmitted, handleAnswerSelect, submitQuiz }) {
    return (
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
    );
}
