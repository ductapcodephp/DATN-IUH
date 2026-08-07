import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-color, #f9fafb)',
                    color: 'var(--text-color, #1f2937)'
                }}>
                    <div style={{ 
                        color: 'var(--fire, #ef4444)',
                        marginBottom: '1rem' 
                    }}>
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '1rem',
                        color: 'var(--accent, #3b82f6)' 
                    }}>
                        Đã xảy ra lỗi
                    </h1>
                    <p style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                        {this.state.error?.message || "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."}
                    </p>
                    <button 
                        onClick={this.handleReload}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'var(--accent, #3b82f6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = 0.8}
                        onMouseOut={(e) => e.target.style.opacity = 1}
                    >
                        Tải lại trang
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
