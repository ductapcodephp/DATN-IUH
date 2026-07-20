import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/Frontend/DashboardLayout';

export default function Certificates({ certificates }) {
    return (
        <DashboardLayout title="Chứng chỉ của tôi" activeKey="certificates">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                        <i className="fa-solid fa-award me-2" style={{ color: '#d97706' }}></i>
                        Chứng chỉ của tôi
                    </h4>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                        Tổng cộng <strong>{certificates?.length ?? 0}</strong> chứng chỉ đã đạt được
                    </p>
                </div>
            </div>

            {/* Banner */}
            <div className="mb-4 p-4 d-flex align-items-center gap-4 db-cert-banner">
                <div style={{
                    width: '60px', height: '60px', borderRadius: '16px',
                    background: '#f59e0b', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                }}>
                    <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: '#92400e', fontSize: '1rem', marginBottom: '4px' }}>
                        Hành trình học tập của bạn thật ấn tượng!
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.6 }}>
                        Mỗi chứng chỉ là minh chứng cho sự nỗ lực và kiến thức bạn đã tích lũy.
                        Tiếp tục phát huy để đạt được nhiều thành tích hơn nữa.
                    </div>
                </div>
            </div>

            {/* Certificates Grid */}
            {(certificates ?? []).length === 0 ? (
                <div className="text-center py-5">
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: '#fef3c7', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                        <i className="fa-solid fa-award" style={{ fontSize: '2rem', color: '#d97706' }}></i>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: '#1F2937' }}>Chưa có chứng chỉ nào</h6>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        Hoàn thành 100% khóa học để nhận chứng chỉ tốt nghiệp
                    </p>
                    <Link href={route('dashboard.my-courses')} className="btn btn-sm fw-semibold text-white" style={{ background: '#EA580C', borderRadius: '8px', border: 'none' }}>
                        Xem khóa học đang học
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {certificates.map((enrollment, i) => {
                        const course = enrollment.course;
                        const certCode = `EDU-${String(course?.id ?? i + 1).padStart(4, '0')}-${String(enrollment.id).padStart(4, '0')}`;
                        const completedDate = new Date(enrollment.updated_at);

                        return (
                            <div key={enrollment.id} className="col-md-6">
                                <div className="db-cert-card">
                                    {/* Certificate Header */}
                                    <div className="p-4 db-cert-header">
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{
                                                width: '52px', height: '52px', borderRadius: '14px',
                                                background: '#f59e0b', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', flexShrink: 0,
                                                boxShadow: '0 4px 12px rgba(245,158,11,0.35)',
                                            }}>
                                                <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.3rem', color: '#fff' }}></i>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    Chứng chỉ hoàn thành
                                                </div>
                                                <div style={{ fontWeight: 800, color: '#78350f', fontSize: '1rem', lineHeight: 1.3 }}>
                                                    {course?.title ?? 'Khóa học'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certificate Body */}
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Mã chứng chỉ</div>
                                                <code style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1F2937', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                                                    {certCode}
                                                </code>
                                            </div>
                                            <div className="text-end">
                                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Cấp ngày</div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1F2937' }}>
                                                    {completedDate.toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress confirmed */}
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Tiến độ</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>100%</span>
                                            </div>
                                            <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius: '4px' }}></div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm fw-semibold flex-grow-1"
                                                style={{ borderRadius: '8px', background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', fontSize: '0.8rem' }}
                                                onClick={() => alert(`Tính năng tải chứng chỉ PDF đang được phát triển. Mã: ${certCode}`)}
                                            >
                                                <i className="fa-solid fa-download me-1"></i>Tải PDF
                                            </button>
                                            <Link
                                                href={route('frontend.course.learn', { slug: course?.slug })}
                                                className="btn btn-sm fw-semibold flex-grow-1"
                                                style={{ borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: 'none', fontSize: '0.8rem' }}
                                            >
                                                <i className="fa-solid fa-arrow-rotate-right me-1"></i>Xem lại
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
