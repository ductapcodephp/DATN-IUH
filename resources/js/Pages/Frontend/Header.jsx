import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import VipBadge from '@/Components/VipBadge';
import axios from 'axios';

export default function Header() {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const { url } = usePage();
    const user = auth?.user;

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '/assets/frontend/img/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        if (avatarPath.startsWith('/')) return avatarPath;
        return `/storage/${avatarPath}`;
    };

    const isActive = (path) => {
        if (path === '/home') {
            return url === '/tech-education/home';
        }
        return url.startsWith(`/tech-education${path}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                setIsSearching(true);
                setShowDropdown(true);
                axios.get(route('frontend.course.search-suggestions', { keyword: searchQuery }))
                    .then(response => {
                        setSearchResults(response.data.data);
                    })
                    .catch(error => {
                        console.error('Lỗi tìm kiếm:', error);
                    })
                    .finally(() => {
                        setIsSearching(false);
                    });
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setShowDropdown(false);
            router.get(route('frontend.course.index'), { search: searchQuery.trim() });
        }
    };

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
                            <Link className={`nav-link main-nav-link ${isActive('/home') ? 'active' : ''}`} href={route('frontend.home')}>
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
                            <Link className={`nav-link main-nav-link ${isActive('/blog') ? 'active' : ''}`} href={route('frontend.blog.index')}>
                                Blog
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link main-nav-link ${isActive('/about') ? 'active' : ''}`} href={route('frontend.about.index')}>
                                Giới thiệu
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link main-nav-link ${isActive('/faqs') ? 'active' : ''}`} href={route('frontend.faq.index')}>
                                FAQ
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link main-nav-link ${isActive('/contact') ? 'active' : ''}`} href={route('frontend.contact.index')}>
                                Liên hệ
                            </Link>
                        </li>

                    </ul>


                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 ms-lg-auto flex-grow-1 flex-lg-grow-0 justify-content-end">


                        <div
                            className="search-wrap my-0"
                            style={{ maxWidth: "350px", width: "100%", position: "relative" }}
                            ref={searchRef}
                        >

                            <i className="fa-solid fa-magnifying-glass search-icon"></i>

                            <input
                                type="text"
                                className="search-input"
                                id="searchInput"
                                placeholder="Tìm kiếm khoá học..."
                                autoComplete="off"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                onFocus={() => {
                                    if (searchQuery.trim().length > 0) setShowDropdown(true);
                                }}
                            />

                            {showDropdown && (
                                <div className="search-dropdown show position-absolute bg-white border rounded shadow-sm mt-1" style={{ top: "100%", zIndex: 1050, right: 0, width: "450px", maxWidth: "90vw", overflow: "hidden" }}>

                                    {isSearching && (
                                        <div className="text-center p-3 text-muted">
                                            <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                            Đang tìm...
                                        </div>
                                    )}

                                    {!isSearching && searchResults.length > 0 && (
                                        <div className="list-group list-group-flush">
                                            {searchResults.map(course => (
                                                <Link
                                                    key={course.id}
                                                    href={route('frontend.course.detail', course.slug)}
                                                    className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-bottom-0 py-2"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <img
                                                        src={getAvatarUrl(user.avatar)}
                                                        alt="Avatar"
                                                        className="rounded-circle object-fit-cover"
                                                        width="36"
                                                        height="36"
                                                    />
                                                    <div className="d-flex flex-column overflow-hidden text-truncate w-100">
                                                        <span className="fw-medium text-truncate text-dark font-sm mb-0">{course.title}</span>
                                                        {course.is_vip_seller ? (
                                                            <span className="text-fire fw-bold" style={{ fontSize: '10px' }}><i className="fa-solid fa-star me-1"></i> {course.vip_badge_text || 'Đề xuất'}</span>
                                                        ) : null}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {!isSearching && searchResults.length === 0 && searchQuery.trim().length > 0 && (
                                        <div className="p-3 text-center text-muted font-sm">
                                            Không tìm thấy khóa học nào.
                                        </div>
                                    )}

                                </div>
                            )}

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
                                        <img src={getAvatarUrl(user.avatar)} alt="Avatar" className="rounded-circle object-fit-cover" width="36" height="36" />
                                        <span className="fw-semibold text-dark d-none d-md-inline-block">{user.name}</span>
                                        <div className="d-none d-md-block">
                                            <VipBadge 
                                                isUserVip={auth?.isUserVip} 
                                                isSellerVip={auth?.isSellerVip} 
                                                userVipBadge={auth?.userVipBadge} 
                                                sellerVipBadge={auth?.sellerVipBadge} 
                                            />
                                        </div>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 p-2" aria-labelledby="userDropdown">
                                        <li><Link className="dropdown-item py-2 rounded font-sm" href={route('dashboard.index')}><i className="fa-solid fa-gauge me-2 text-secondary"></i> Bảng điều khiển</Link></li>
                                        <li><Link className="dropdown-item py-2 rounded font-sm" href={route('dashboard.profile')}><i className="fa-solid fa-user me-2 text-primary"></i> Hồ sơ của tôi</Link></li>
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
