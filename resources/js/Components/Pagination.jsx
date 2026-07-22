import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], from = 0, to = 0, total = 0 }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="table-pagination">

            <div className="table-pagination-info">
                Hiển thị <strong>{from || 0}</strong> đến <strong>{to || 0}</strong> trong số <strong>{total}</strong> bản ghi
            </div>


            <div className="table-pagination-nav">
                {links.map((link, index) => {

                    let label = link.label;
                    if (label.includes('&laquo;')) {
                        label = <i className="fa-solid fa-angle-left"></i>;
                    } else if (label.includes('&raquo;')) {
                        label = <i className="fa-solid fa-angle-right"></i>;
                    }


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


                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`filter-btn ${link.active ? 'active' : ''} ${link.label.includes('&laquo;') || link.label.includes('&raquo;') ? 'table-pagination-nav-arrow' : ''}`}
                            preserveScroll
                            preserveState
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
