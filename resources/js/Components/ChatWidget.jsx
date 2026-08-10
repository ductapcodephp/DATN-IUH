import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

// Biến lưu trữ ngoài component để giữ state khi Inertia chuyển trang (không bị mất).
// Khi F5 (reload cứng), trình duyệt sẽ reset lại file JS nên biến này sẽ reset theo.
let cachedIsOpen = false;
let cachedMessages = [
    { text: "Chào bạn! Mình là AI tư vấn khóa học. Mình có thể giúp gì cho bạn?", isBot: true }
];

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(cachedIsOpen);
    const [messages, setMessages] = useState(cachedMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        cachedIsOpen = isOpen;
    }, [isOpen]);

    useEffect(() => {
        cachedMessages = messages;
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, isBot: false }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            // Đã chuyển sang dùng route của web.php
            const response = await axios.post(route('chat.send'), { question: input });
            setMessages([...newMessages, { text: response.data.reply, isBot: true }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Xin lỗi, AI đang bận hoặc mất kết nối mạng!", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="position-fixed" style={{ bottom: '24px', right: '24px', zIndex: 1050 }}>
            <div 
                className={`card shadow-lg border-0 mb-3 transition-base ${isOpen ? 'd-flex' : 'd-none'}`} 
                style={{ width: '350px', height: '450px', borderRadius: '12px', overflow: 'hidden' }}
            >
                <div className="card-header text-white d-flex justify-content-between align-items-center p-3 border-0" style={{ backgroundColor: 'var(--fire, #EA580C)' }}>
                    <h5 className="mb-0 fs-6 fw-bold d-flex align-items-center gap-2">
                        <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true" style={{ width: '8px', height: '8px' }}></span>
                        AI Tư Vấn Khóa Học
                    </h5>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="btn btn-sm text-white p-0 border-0 shadow-none hover-opacity"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="card-body bg-light overflow-auto d-flex flex-column gap-3 p-3">
                    {messages.map((msg, index) => {
                        const formattedText = msg.text
                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: ' + (msg.isBot ? '#0284C7' : '#fff') + '; text-decoration: underline;">$1</a>')
                            .replace(/\n/g, '<br />');

                        return (
                            <div 
                                key={index} 
                                className={`p-2 px-3 rounded-3 shadow-sm ${msg.isBot ? 'bg-white text-dark align-self-start' : 'text-white align-self-end'}`}
                                style={{ 
                                    maxWidth: '85%', 
                                    fontSize: '0.9rem',
                                    backgroundColor: msg.isBot ? '#fff' : 'var(--accent, #0284C7)',
                                    borderBottomLeftRadius: msg.isBot ? '2px' : '0.5rem',
                                    borderBottomRightRadius: !msg.isBot ? '2px' : '0.5rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: formattedText }}
                            />
                        );
                    })}
                    {isLoading && (
                        <div className="align-self-start fst-italic text-muted px-3 py-1 rounded-pill bg-white shadow-sm" style={{ fontSize: '0.8rem' }}>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            AI đang suy nghĩ...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="card-footer bg-white border-top-0 p-3">
                    <div className="input-group position-relative">
                        <input
                            type="text"
                            className="form-control rounded-pill orange-input-focus shadow-none"
                            placeholder="Nhập câu hỏi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                            style={{ paddingRight: '45px' }}
                        />
                        <button 
                            className="btn rounded-circle position-absolute end-0 top-50 translate-middle-y me-1 d-flex align-items-center justify-content-center"
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            style={{ 
                                zIndex: 5, 
                                backgroundColor: input.trim() ? 'var(--fire, #EA580C)' : '#e9ecef',
                                color: input.trim() ? 'white' : '#6c757d',
                                width: '34px', height: '34px', padding: 0
                            }}
                        >
                            <Send size={16} style={{ marginLeft: input.trim() ? '2px' : '0' }} />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn rounded-circle shadow d-flex align-items-center justify-content-center text-white border-0"
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: 'var(--fire, #EA580C)',
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'scale(0)' : 'scale(1)',
                    position: isOpen ? 'absolute' : 'relative',
                    bottom: isOpen ? '0' : 'auto',
                    right: isOpen ? '0' : 'auto',
                }}
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
}
