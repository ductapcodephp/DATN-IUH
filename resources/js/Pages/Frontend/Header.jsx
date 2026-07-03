import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container align-items-center">

                <Link className="navbar-brand" href="/">
                    Edu<span>Flow</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Mở menu điều hướng"
                >
                    <i className="fa-solid fa-bars fs-4"></i>
                </button>


                <div className="collapse navbar-collapse" id="mainNavbar">

                    <ul className="navbar-nav main-nav mb-3 mb-lg-0 gap-lg-3">

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link active" href="/">
                                Trang chủ
                            </Link>
                        </li>


                        <li className="nav-item dropdown">

                            <a
                                className="nav-link main-nav-link dropdown-toggle"
                                href="#"
                                id="learningDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Học tập
                            </a>


                            <ul
                                className="dropdown-menu shadow-sm border-0 mt-2 p-2"
                                aria-labelledby="learningDropdown"
                                style={{ minWidth: "220px" }}
                            >

                                <li>
                                    <Link
                                        className="dropdown-item d-flex align-items-center gap-2 py-2 fw-medium rounded text-secondary"
                                        href="/courses"
                                    >
                                        <i
                                            className="fa-solid fa-book-open text-primary"
                                            style={{
                                                width: "20px",
                                                textAlign: "center"
                                            }}
                                        ></i>

                                        Danh sách khóa học
                                    </Link>
                                </li>


                                <li>
                                    <Link
                                        className="dropdown-item d-flex align-items-center gap-2 py-2 fw-medium rounded text-secondary"
                                        href="/instructors"
                                    >
                                        <i
                                            className="fa-solid fa-chalkboard-user text-info"
                                            style={{
                                                width: "20px",
                                                textAlign: "center"
                                            }}
                                        ></i>

                                        Danh sách giảng viên
                                    </Link>
                                </li>

                            </ul>

                        </li>


                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="/blog">
                                Blog
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="/about">
                                Giới thiệu
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="/faqs">
                                FAQ
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="/contact">
                                Liên hệ
                            </Link>
                        </li>

                    </ul>


                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 ms-lg-auto flex-grow-1 flex-lg-grow-0 justify-content-end">


                        <div
                            className="search-wrap my-0"
                            style={{ maxWidth: "240px", width: "100%" }}
                        >

                            <i className="fa-solid fa-magnifying-glass search-icon"></i>

                            <input
                                type="text"
                                className="search-input"
                                id="searchInput"
                                placeholder="Tìm kiếm khoá học..."
                                autoComplete="off"
                            />


                            <div className="search-dropdown" id="searchDropdown">

                                <div
                                    id="searchLoading"
                                    className="text-center p-3 d-none text-muted"
                                >
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Đang tìm...
                                </div>


                                <div id="searchResults"></div>

                            </div>

                        </div>


                        <div className="d-flex gap-3 align-items-center">

                            <Link
                                href="/checkout"
                                className="text-dark position-relative"
                                aria-label="Giỏ hàng"
                            >
                                <i className="fa-solid fa-cart-shopping fs-5"></i>
                            </Link>


                            <Link
                                href="/login"
                                className="btn btn-outline-dark btn-sm fw-semibold border-0"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                Đăng nhập
                            </Link>


                            <Link
                                href="/register"
                                className="btn btn-dark btn-sm fw-semibold"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                Đăng ký
                            </Link>

                        </div>


                    </div>

                </div>

            </div>
        </nav>
    );
}