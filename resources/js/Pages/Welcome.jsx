import React from 'react';
import { router, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <Head title="Trang chủ" />
            <h1>Chào mừng bạn đã đăng nhập thành công!</h1>
            <p>Xin chào: <strong>{auth.user.name}</strong> ({auth.user.email})</p>
            
            <button 
                onClick={handleLogout} 
                style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
            >
                Đăng xuất
            </button>
        </div>
    );
}
