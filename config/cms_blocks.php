<?php

return [

    'home_hero_block' => [
        'name' => 'Trang chủ: Hero Banner',

        'backend' => 'CMS/BlockForms/Home/HomeHeroForm',
        'frontend' => 'Frontend/Home/HeroSection',
        'fields' => ['title', 'sub_title', 'description', 'image', 'button', 'url'],
    ],
    'home_become_seller_block' => [
        'name' => 'Trang chủ: Trở Thành Giảng Viên',

        'backend' => 'CMS/BlockForms/Home/Listing/BecomeSellerForm',
        'frontend' => 'Frontend/Home/BecomeSeller',
        'fields' => ['title', 'description', 'image', 'button', 'url', 'listing_item'],
    ],
    'home_featured_courses' => [
        'name' => 'Trang chủ: Khóa học nổi bật',

        'backend' => 'CMS/BlockForms/Home/FeaturedCoursesForm',
        'frontend' => 'Frontend/Home/FeaturedCourses',
        'fields' => ['title', 'sub_title', 'icon'],
    ],
    'home_instructor_section' => [
        'name' => 'Trang chủ: Giảng viên hàng đầu',

        'backend' => 'CMS/BlockForms/Home/InstructorSectionForm', 
        'frontend' => 'Frontend/Home/InstructorSection',
        'fields' => ['title', 'sub_title', 'description'],
    ],
    'home_category_section' => [
        'name' => 'Trang chủ: Danh mục khóa học',

        'backend' => 'CMS/BlockForms/Home/CategorySectionForm',
        'frontend' => 'Frontend/Home/CategorySection',
        'fields' => ['title', 'sub_title'],
    ],
    'about_hero' => [
        'name' => 'Giới thiệu: Tiêu đề',

        'backend' => 'CMS/BlockForms/About/AboutHeroForm',
        'frontend' => 'Frontend/About/HeroBlock',
        'fields' => ['title', 'description', 'image'],
    ],
    'about_story' => [
        'name' => 'Giới thiệu: Câu chuyện',

        'backend' => 'CMS/BlockForms/About/AboutStoryForm',
        'frontend' => 'Frontend/About/StoryBlock',
        'fields' => ['title', 'sub_title', 'description', 'image', 'image_icon'],
    ],
    'about_stats' => [
        'name' => 'Giới thiệu: Thống kê',

        'backend' => 'CMS/BlockForms/About/Listing/AboutStatsForm',
        'frontend' => 'Frontend/About/StatsBlock',
        'fields' => ['title', 'listing_item'],
    ],
    'about_features' => [
        'name' => 'Giới thiệu: Tính năng',

        'backend' => 'CMS/BlockForms/About/Listing/AboutFeaturesForm',
        'frontend' => 'Frontend/About/FeaturesBlock',
        'fields' => ['title', 'sub_title', 'listing_item'],
    ],
    'about_mentors' => [
        'name' => 'Giới thiệu: Cố vấn',

        'backend' => 'CMS/BlockForms/About/Listing/AboutMentorsForm',
        'frontend' => 'Frontend/About/MentorsBlock',
        'fields' => ['title', 'description', 'listing_item'],
    ],
    'about_partners' => [
        'name' => 'Giới thiệu: Đối tác',

        'backend' => 'CMS/BlockForms/About/Listing/AboutPartnersForm',
        'frontend' => 'Frontend/About/PartnersBlock',
        'fields' => ['title', 'listing_item'],
    ],
       'about_cta' => [
        'name' => 'Giới thiệu: Kêu Gọi Hành Động (CTA)',

        'backend' => 'CMS/BlockForms/Common/CtaForm',
        'frontend' => 'Frontend/Blocks/Cta',
        'fields' => ['title', 'description', 'button', 'url', 'background'],
    ],
    'faq_accordion_block' => [
        'name' => 'FAQ: Danh sách thu gọn',

        'backend' => 'CMS/BlockForms/Faq/Listing/FaqAccordionForm',
        'frontend' => 'Frontend/Faq/FaqAccordion',
        'fields' => ['title', 'description'],
    ],
    'contact_info_block' => [
        'name' => 'Liên hệ: Thông tin',

        'backend' => 'CMS/BlockForms/Contact/Listing/ContactInfoForm',
        'frontend' => 'Frontend/Contact/ContactInfo',
        'fields' => ['title', 'description', 'listing_item'],
    ],
    'course_list_block' => [
        'name' => 'Khóa học: Danh sách',

        'backend' => 'CMS/BlockForms/Course/CourseListForm',
        'frontend' => 'Frontend/Blocks/Course/CourseListBlock',
        'fields' => [], 
    ],
    'instructor_list_block' => [
        'name' => 'Giảng viên: Danh sách',

        'backend' => 'CMS/BlockForms/Instructor/InstructorListForm',
        'frontend' => 'Frontend/Blocks/Instructor/InstructorListBlock',
        'fields' => [], 
    ],
    'cart_block' => [
        'name' => 'Giỏ hàng: Chi tiết',

        'backend' => 'CMS/BlockForms/Cart/CartForm',
        'frontend' => 'Frontend/Blocks/Cart/CartBlock',
        'fields' => [], 
    ],
    'contact_page_block' => [
        'name' => 'Liên hệ: Form Liên Hệ & Thông Tin',

        'backend' => 'CMS/BlockForms/Contact/ContactPageForm',
        'frontend' => 'Frontend/Blocks/Contact/ContactPageBlock',
        'fields' => [], 
    ],
    'blog_list_block' => [
        'name' => 'Blog: Danh sách bài viết',

        'backend' => 'CMS/BlockForms/Blog/BlogListForm',
        'frontend' => 'Frontend/Blocks/Blog/BlogListBlock',
        'fields' => ['title', 'sub_title'], 
    ],
];
