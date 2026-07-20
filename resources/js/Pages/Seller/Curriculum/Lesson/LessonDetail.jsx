
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SellerLayout from "@/Layouts/Seller/SellerLayout.jsx";


import LessonVideoManager from './LessonVideoManager';
import LessonQuizManager from './LessonQuizManager';
import LessonConfigForm from './LessonConfigForm';

export default function LessonDetail({ course, lesson }) {
    return (
        <SellerLayout>
            <Head title={`Quản lý: ${lesson.title}`} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>


                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


                    <div style={{ marginBottom: '-8px' }}>
                        <Link href={route('seller.courses.curriculum.index', course.id)} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                            <i className="fa-solid fa-arrow-left"></i> Quay lại Giáo trình khóa học
                        </Link>
                    </div>


                    {lesson.type === 'video' && (
                        <LessonVideoManager course={course} lesson={lesson} />
                    )}


                    {lesson.type === 'quiz_only' && (
                        <LessonQuizManager course={course} lesson={lesson} />
                    )}
                </div>

                <div>
                    <LessonConfigForm course={course} lesson={lesson} />
                </div>
            </div>
        </SellerLayout>
    );
}
