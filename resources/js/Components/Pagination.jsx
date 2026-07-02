import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], from = 0, to = 0, total = 0 }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="table-pagination">
            {/* Phần hiển thị thông tin số dòng */}
            <div className="table-pagination-info">
                Hiển thị <strong>{from || 0}</strong> đến <strong>{to || 0}</strong> trong số <strong>{total}</strong> bản ghi
            </div>

            {/* Phần các nút bấm chuyển trang */}
            <div className="table-pagination-nav">
                {links.map((link, index) => {
                    // Xử lý đổi icon cho nút "Trước" và "Sau" thay vì chữ mặc định của Laravel
                    let label = link.label;
                    if (label.includes('&laquo;')) {
                        label = <i className="fa-solid fa-angle-left"></i>;
                    } else if (label.includes('&raquo;')) {
                        label = <i className="fa-solid fa-angle-right"></i>;
                    }

                    // Nếu không có url (nút bị disabled ví dụ như đang ở trang 1 mà bấm nút back)
                    if (link.url === null) {
                        return (
                            <button
                                key={index}
                                className={`filter-btn ${link.label.includes('&laquo;') || link.label.includes('&raquo;') ? 'table-pagination-nav-arrow' : ''}`}
                                disabled
                            >
                                {label}
                            </button>
                        );
                    }

                    // Nếu có url thì dùng thẻ <Link> của Inertia để chuyển trang không bị load lại trang
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`filter-btn ${link.active ? 'active' : ''} ${link.label.includes('&laquo;') || link.label.includes('&raquo;') ? 'table-pagination-nav-arrow' : ''}`}
                            preserveScroll // Giữ nguyên vị trí cuộn màn hình khi chuyển trang
                            preserveState  // Giữ nguyên các bộ lọc per_page, search trên URL
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}