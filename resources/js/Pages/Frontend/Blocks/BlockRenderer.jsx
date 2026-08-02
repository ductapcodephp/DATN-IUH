import React from 'react';

// === About Blocks ===
import HeroBlock from '@/Pages/Frontend/About/HeroBlock';
import StoryBlock from '@/Pages/Frontend/About/StoryBlock';
import StatsBlock from '@/Pages/Frontend/About/StatsBlock';
import FeaturesBlock from '@/Pages/Frontend/About/FeaturesBlock';
import MentorsBlock from '@/Pages/Frontend/About/MentorsBlock';
import PartnersBlock from '@/Pages/Frontend/About/PartnersBlock';

// === Common Blocks ===
import TextBlock from './Common/TextBlock';
import HtmlRaw from './Common/HtmlRaw';
import Cta from './Cta';

// === Home Blocks ===
import HeroSection from '@/Pages/Frontend/Home/HeroSection';
import BecomeSeller from '@/Pages/Frontend/Home/BecomeSeller';
import FeaturedCourses from '@/Pages/Frontend/Home/FeaturedCourses';
import InstructorSection from '@/Pages/Frontend/Home/InstructorSection';
import CategorySection from '@/Pages/Frontend/Home/CategorySection';

// === FAQ Blocks ===
import FaqListBlock from './Faq/FaqListBlock';

// === Contact Blocks ===
import ContactInfo from '@/Pages/Frontend/Contact/ContactInfo';
import ContactPageBlock from './Contact/ContactPageBlock';

// === Course Blocks ===
import CourseListBlock from './Course/CourseListBlock';

// === Instructor Blocks ===
import InstructorListBlock from './Instructor/InstructorListBlock';

// === Cart Blocks ===
import CartBlock from './Cart/CartBlock';

// === Blog Blocks ===
import BlogListBlock from './Blog/BlogListBlock';


const blockComponents = {
    // About
    'about_hero': HeroBlock,
    'about_story': StoryBlock,
    'about_stats': StatsBlock,
    'about_features': FeaturesBlock,
    'about_mentors': MentorsBlock,
    'about_partners': PartnersBlock,

    // Home
    'home_hero_block': HeroSection,
    'home_become_seller_block': BecomeSeller,
    'home_featured_courses': FeaturedCourses,
    'home_instructor_section': InstructorSection,
    'home_category_section': CategorySection,

    // FAQ
    'faq_accordion_block': FaqListBlock,
    'faq_list_block': FaqListBlock,

    // Contact
    'contact_info_block': ContactInfo,
    'contact_page_block': ContactPageBlock,

    // Course
    'course_list_block': CourseListBlock,

    // Instructor
    'instructor_list_block': InstructorListBlock,

    // Blog
    'blog_list_block': BlogListBlock,

    // Cart
    'cart_block': CartBlock,

    // Common / Generic
    'text_block': TextBlock,
    'html_raw': HtmlRaw,
    'cta_block': Cta,
    'about_cta': Cta,
};

export default function BlockRenderer({ block, editable = false, onChange = null, extraData = {} }) {
    if (!block || block.status !== 'active') return null;

    const Component = blockComponents[block.type];

    if (!Component) {
        if (process.env.NODE_ENV === 'development') {
            return (
                <div className="alert alert-warning m-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                    Block type <strong>"{block.type}"</strong> chưa được đăng ký trong BlockRenderer.
                </div>
            );
        }
        return null;
    }

    return <Component block={block} editable={editable} onChange={onChange} {...extraData} />;
}
