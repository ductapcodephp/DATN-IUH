import React, { useState, useEffect, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SweetAlert from '@/Components/SweetAlert';

export default function LessonQuizManager({ course, lesson }) {
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ question_text: '', type: 'single_choice', answers: [] });
    const [editProcessing, setEditProcessing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, questionId: null });

    const [quizzes, setQuizzes] = useState(lesson.quizzes || []);

    useEffect(() => {
        setQuizzes(lesson.quizzes || []);
    }, [lesson.quizzes]);

    const quizForm = useForm({
        question_text: '',
        type: 'single_choice',
        answers: [
            { text: '', is_correct: true },
            { text: '', is_correct: false },
        ]
    });

    const handleAddQuizFormAnswer = () => {
        quizForm.setData('answers', [
            ...quizForm.data.answers,
            { text: '', is_correct: false }
        ]);
    };

    const handleRemoveQuizFormAnswer = (indexToRemove) => {
        if (quizForm.data.answers.length <= 2) return;
        const updated = quizForm.data.answers.filter((_, idx) => idx !== indexToRemove);
        if (quizForm.data.type === 'single_choice' && !updated.some(a => a.is_correct)) {
            updated[0].is_correct = true;
        }
        quizForm.setData('answers', updated);
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        const hasCorrect = quizForm.data.answers.some(a => a.is_correct);
        if (!hasCorrect) {
            alert('Vui lòng chọn ít nhất 1 đáp án đúng!');
            return;
        }

        quizForm.post(route('seller.courses.curriculum.quiz.store-question', [course.id, lesson.id]), {
            preserveScroll: true,
            onSuccess: () => {
                quizForm.reset();
                setShowQuizForm(false);
                router.reload({ only: ['lesson'] });
            }
        });
    };

    const handleDeleteQuestion = (questionId) => {
        setConfirmDelete({ show: true, questionId });
    };

    const startEditQuestion = (q) => {
        setEditingId(q.id);
        const mappedAnswers = (q.answers || []).map(a => ({ text: a.answer, is_correct: !!a.is_correct }));
        while (mappedAnswers.length < 2) {
            mappedAnswers.push({ text: '', is_correct: false });
        }
        setEditData({
            question_text: q.question,
            type: q.type || 'single_choice',
            answers: mappedAnswers
        });
    };

    const cancelEditQuestion = () => {
        setEditingId(null);
        setEditData({ question_text: '', type: 'single_choice', answers: [] });
    };

    const handleAddEditAnswer = () => {
        setEditData({
            ...editData,
            answers: [
                ...editData.answers,
                { text: '', is_correct: false }
            ]
        });
    };

    const handleRemoveEditAnswer = (indexToRemove) => {
        if (editData.answers.length <= 2) return;
        const updated = editData.answers.filter((_, idx) => idx !== indexToRemove);
        if (editData.type === 'single_choice' && !updated.some(a => a.is_correct)) {
            updated[0].is_correct = true;
        }
        setEditData({ ...editData, answers: updated });
    };

    const handleEditAnswerText = (idx, value) => {
        const updated = [...editData.answers];
        updated[idx].text = value;
        setEditData({ ...editData, answers: updated });
    };

    const handleEditAnswerCorrect = (idx) => {
        const updated = editData.answers.map((a, i) => {
            if (editData.type === 'single_choice') {
                return { ...a, is_correct: i === idx };
            } else {
                return i === idx ? { ...a, is_correct: !a.is_correct } : a;
            }
        });
        setEditData({ ...editData, answers: updated });
    };

    const submitEditQuestion = (e, questionId) => {
        e.preventDefault();
        const hasCorrect = editData.answers.some(a => a.is_correct);
        if (!hasCorrect) {
            alert('Vui lòng chọn ít nhất 1 đáp án đúng!');
            return;
        }

        setEditProcessing(true);
        router.post(
            route('seller.courses.curriculum.quiz.update-question', {
                course: course.id,
                questionId: questionId
            }),
            {
                ...editData,
                _method: 'PUT'
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    setEditProcessing(false);
                    router.reload({ only: ['lesson'] });
                },
                onError: () => setEditProcessing(false)
            }
        );
    };

    const onQuestionDragEnd = useCallback((result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const quizId = parseInt(source.droppableId.split('-')[1]);
        const updatedQuizzes = [...quizzes];
        const quizIndex = updatedQuizzes.findIndex(q => q.id === quizId);

        if (quizIndex > -1) {
            const updatedQuestions = [...updatedQuizzes[quizIndex].questions];
            const [movedQuestion] = updatedQuestions.splice(source.index, 1);
            updatedQuestions.splice(destination.index, 0, movedQuestion);

            updatedQuizzes[quizIndex].questions = updatedQuestions;
            setQuizzes(updatedQuizzes);

            router.post(route('seller.courses.curriculum.quiz.reorder', [course.id, lesson.id]), {
                question_ids: updatedQuestions.map(q => q.id)
            }, { preserveScroll: true });
        }
    }, [quizzes, course.id, lesson.id]);

    const renderQuestion = (q, qIdx, providedQuestion, snapshotQuestion) => (
        <div
            ref={providedQuestion.innerRef}
            {...providedQuestion.draggableProps}
            className={`dnd-item ${snapshotQuestion.isDragging ? 'is-dragging' : ''}`}
            style={{ padding: '16px', gap: '12px', position: 'relative', alignItems: 'stretch', ...providedQuestion.draggableProps.style }}
        >

            <div
                {...providedQuestion.dragHandleProps}
                className="dnd-handle"
                style={{
                    opacity: editingId === q.id ? 0 : 1,
                    pointerEvents: editingId === q.id ? 'none' : 'auto',
                    width: editingId === q.id ? '0px' : 'auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingTop: '2px',
                    transition: 'opacity 0.2s'
                }}
            >
                <i className="fa-solid fa-grip-vertical"></i>
            </div>

            <div style={{ flex: 1 }}>
                {editingId === q.id ? (
                    <form onSubmit={(e) => submitEditQuestion(e, q.id)} className="quiz-box" style={{ margin: 0 }}>
                        <div className="form-group">
                            <label className="form-label">Nội dung câu hỏi:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editData.question_text}
                                onChange={e => setEditData({ ...editData, question_text: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Loại câu hỏi:</label>
                            <select 
                                className="form-control"
                                value={editData.type} 
                                onChange={e => {
                                    const newType = e.target.value;
                                    const updatedAnswers = editData.answers.map((a, idx) => ({
                                        ...a, 
                                        is_correct: newType === 'single_choice' ? idx === 0 : a.is_correct
                                    }));
                                    setEditData({ ...editData, type: newType, answers: updatedAnswers });
                                }}
                            >
                                <option value="single_choice">Chỉ có 1 đáp án đúng</option>
                                <option value="multiple_choice">Có nhiều đáp án đúng (Học viên phải chọn đủ)</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">Các phương án lựa chọn (Click chọn đáp án đúng):</label>
                            <button
                                type="button"
                                onClick={handleAddEditAnswer}
                                className="btn btn-sm"
                                style={{
                                    borderRadius: '8px',
                                    padding: '4px 10px',
                                    fontSize: '0.8rem',
                                    color: '#EA580C',
                                    border: '1px solid #EA580C',
                                    background: 'transparent',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fa-solid fa-plus me-1"></i> Thêm đáp án
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {editData.answers.map((ans, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type={editData.type === 'single_choice' ? "radio" : "checkbox"}
                                        name={`edit_correct_${q.id}`}
                                        checked={ans.is_correct}
                                        onChange={() => handleEditAnswerCorrect(idx)}
                                        style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#EA580C' }}
                                        title={ans.is_correct ? "Đáp án đúng" : "Đánh dấu là đáp án đúng"}
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ padding: '6px 10px', flex: 1, borderRadius: '8px' }}
                                        placeholder={`Đáp án ${idx + 1}`}
                                        value={ans.text}
                                        onChange={e => handleEditAnswerText(idx, e.target.value)}
                                        required
                                    />
                                    {editData.answers.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEditAnswer(idx)}
                                            className="btn btn-outline-danger btn-sm"
                                            style={{ borderRadius: '8px', padding: '6px 10px' }}
                                            title="Xóa đáp án này"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                            <button type="button" onClick={cancelEditQuestion} className="btn btn-secondary">Hủy</button>
                            <button type="submit" disabled={editProcessing} className="btn btn-primary">
                                {editProcessing ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div style={{ position: 'absolute', top: '14px', right: '16px', display: 'flex', gap: '14px' }}>
                            <button onClick={() => startEditQuestion(q)} className="action-btn text-orange" title="Sửa câu hỏi">
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button onClick={() => handleDeleteQuestion(q.id)} className="action-btn text-muted" title="Xóa câu hỏi">
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <h5 className="item-title" style={{ margin: 0, paddingRight: '50px', fontWeight: '600' }}>
                                Câu {qIdx + 1}: {q.question} 
                                <span className="badge-type">
                                    {q.type === 'multiple_choice' ? 'Chọn nhiều' : 'Chọn 1'}
                                </span>
                            </h5>
                        </div>

                        <div className="quiz-answers-grid">
                            {q.answers?.map(a => (
                                <div key={a.id} className={`quiz-ans-item ${a.is_correct ? 'correct' : ''}`}>
                                    {a.is_correct ? '✅ ' : '🔸 '} {a.answer}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="card-box">
            <SweetAlert
                show={confirmDelete.show}
                type="confirm"
                icon="warning"
                title="Xóa câu hỏi?"
                text="Bạn có chắc chắn muốn xóa câu hỏi này?"
                confirmButtonText="Xóa"
                cancelButtonText="Hủy"
                confirmButtonColor="#ef4444"
                onConfirm={() => {
                    router.delete(route('seller.courses.curriculum.quiz.delete-question', {
                        course: course.id,
                        questionId: confirmDelete.questionId
                    }), {
                        preserveScroll: true
                    });
                }}
                onClose={() => setConfirmDelete({ show: false, questionId: null })}
            />

            <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '20px' }}>
                <h3>❓ Danh sách câu hỏi trắc nghiệm ({quizzes?.reduce((acc, q) => acc + (q.questions?.length || 0), 0) || 0})</h3>
                {!showQuizForm && (
                    <button onClick={() => setShowQuizForm(true)} className="btn btn-primary">
                        <i className="fa-solid fa-plus"></i> Thêm câu hỏi mới
                    </button>
                )}
            </div>

            {showQuizForm && (
                <form onSubmit={handleAddQuestion} className="quiz-box" style={{ marginBottom: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Nội dung câu hỏi:</label>
                        <input type="text" className="form-control" value={quizForm.data.question_text} onChange={e => quizForm.setData('question_text', e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Loại câu hỏi:</label>
                        <select 
                            className="form-control"
                            value={quizForm.data.type} 
                            onChange={e => {
                                const newType = e.target.value;
                                const updatedAnswers = quizForm.data.answers.map((a, idx) => ({
                                    ...a, 
                                    is_correct: newType === 'single_choice' ? idx === 0 : a.is_correct
                                }));
                                quizForm.setData({ ...quizForm.data, type: newType, answers: updatedAnswers });
                            }}
                        >
                            <option value="single_choice">Chỉ có 1 đáp án đúng</option>
                            <option value="multiple_choice">Có nhiều đáp án đúng (Học viên phải chọn đủ)</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label mb-0">Các phương án lựa chọn (Click chọn đáp án đúng):</label>
                        <button
                            type="button"
                            onClick={handleAddQuizFormAnswer}
                            className="btn btn-sm"
                            style={{
                                borderRadius: '8px',
                                padding: '4px 10px',
                                fontSize: '0.8rem',
                                color: '#EA580C',
                                border: '1px solid #EA580C',
                                background: 'transparent',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fa-solid fa-plus me-1"></i> Thêm đáp án
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {quizForm.data.answers.map((ans, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input 
                                    type={quizForm.data.type === 'single_choice' ? "radio" : "checkbox"} 
                                    name="correct_answer_new" 
                                    checked={ans.is_correct} 
                                    onChange={() => {
                                        const updated = quizForm.data.answers.map((a, i) => {
                                            if (quizForm.data.type === 'single_choice') {
                                                return { ...a, is_correct: i === idx };
                                            } else {
                                                return i === idx ? { ...a, is_correct: !a.is_correct } : a;
                                            }
                                        });
                                        quizForm.setData('answers', updated);
                                    }} 
                                    style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#EA580C' }}
                                    title={ans.is_correct ? "Đáp án đúng" : "Đánh dấu là đáp án đúng"}
                                />
                                <input 
                                    type="text" 
                                    className="form-control"
                                    style={{ padding: '6px 10px', flex: 1, borderRadius: '8px' }}
                                    placeholder={`Đáp án ${idx + 1}`} 
                                    value={ans.text} 
                                    onChange={e => {
                                        const updated = [...quizForm.data.answers];
                                        updated[idx].text = e.target.value;
                                        quizForm.setData('answers', updated);
                                    }} 
                                    required 
                                />
                                {quizForm.data.answers.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuizFormAnswer(idx)}
                                        className="btn btn-outline-danger btn-sm"
                                        style={{ borderRadius: '8px', padding: '6px 10px' }}
                                        title="Xóa đáp án này"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                        <button type="button" onClick={() => setShowQuizForm(false)} className="btn btn-secondary">Hủy</button>
                        <button type="submit" disabled={quizForm.processing} className="btn btn-primary">Lưu câu hỏi</button>
                    </div>
                </form>
            )}

            {quizzes?.length > 0 ? (
                <DragDropContext onDragEnd={onQuestionDragEnd}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="quiz-box" style={{ background: '#f8fafc', margin: 0 }}>
                                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                                    📋 {quiz.title} ({quiz.questions?.length || 0} câu)
                                </h4>

                                <Droppable droppableId={`quiz-${quiz.id}`} type="QUESTION">
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {quiz.questions?.length > 0 ? (
                                                quiz.questions.map((q, qIdx) => (
                                                    <Draggable key={q.id} draggableId={`question-${q.id}`} index={qIdx} isDragDisabled={editingId === q.id}>
                                                        {(providedQuestion, snapshotQuestion) => renderQuestion(q, qIdx, providedQuestion, snapshotQuestion)}
                                                    </Draggable>
                                                ))
                                            ) : (
                                                <div className="card-empty" style={{ padding: '16px 0' }}>Chưa có câu hỏi nào trong quiz này.</div>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            ) : (
                <div className="card-empty">Chưa có bài quiz nào.</div>
            )}
        </div>
    );
}
