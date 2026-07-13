import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container align-items-center">

                <Link className="navbar-brand" href={route('frontend.home')}>
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
                            <Link className="nav-link main-nav-link active" href={route('frontend.home')}>
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
                                        href={route('frontend.course.index')}
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
                                        href={route('frontend.instructor.index')}
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
                            <Link className="nav-link main-nav-link" href="#">
                                Blog
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="#">
                                Giới thiệu
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="#">
                                FAQ
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link main-nav-link" href="#">
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
                                href={route('frontend.cart.index')}
                                className="text-dark position-relative me-2"
                                aria-label="Giỏ hàng"
                            >
                                <i className="fa-solid fa-cart-shopping fs-5"></i>
                            </Link>

                            {user ? (
                                <div className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle d-flex align-items-center gap-2 p-0" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="rounded-circle object-fit-cover" width="36" height="36" />
                                        <span className="fw-semibold text-dark d-none d-md-inline-block">{user.name}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 p-2" aria-labelledby="userDropdown">
                                        <li><Link className="dropdown-item py-2 rounded font-sm" href={route('dashboard')}><i className="fa-solid fa-gauge me-2 text-secondary"></i> Bảng điều khiển</Link></li>
                                        <li><Link className="dropdown-item py-2 rounded font-sm" href={route('profile.edit')}><i className="fa-solid fa-user me-2 text-primary"></i> Hồ sơ của tôi</Link></li>
                                        <li><Link className="dropdown-item py-2 rounded font-sm" href={route('frontend.wishlist.index')}><i className="fa-solid fa-heart me-2 text-danger"></i> Mục yêu thích</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link className="dropdown-item py-2 rounded font-sm text-danger fw-medium" href={route('logout')} method="post" as="button">
                                                <i className="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="btn btn-outline-dark btn-sm fw-semibold border-0"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        Đăng nhập
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="btn btn-dark btn-sm fw-semibold"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        Đăng ký
                                    </Link>
                                </>
                            )}

                        </div>


                    </div>

                </div>

            </div>
        </nav>
    );
}