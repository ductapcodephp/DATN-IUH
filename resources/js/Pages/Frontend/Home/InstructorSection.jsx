import React from "react";

export default function InstructorSection({ instructors = [] }) {
    return (
        <section className="py-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h2 className="section-title mb-2">Giảng viên tiêu biểu tuần này</h2>
                    <p className="text-muted">Những chuyên gia có tỷ lệ đánh giá cao nhất và nhiều học viên nhất.</p>
                </div>

                <div className="row g-4">
                    {instructors.map((instructor, index) => (
                        <div className="col-lg-3 col-md-6" key={instructor.id}>
                            <div className={`instructor-card text-center p-4 border rounded position-relative overflow-hidden ${index === 0 ? 'shadow-sm' : 'hover-shadow transition-all'}`}>
                                {index === 0 && (
                                    <div className="top-badge bg-warning text-dark fw-bold position-absolute top-0 start-0 w-100 py-1 font-sm">
                                        <i className="fa-solid fa-trophy"></i> Top 1 Đánh Giá
                                    </div>
                                )}

                                <img
                                    src={instructor.avatar || "/assets/frontend/img/default-avatar.jpg"}
                                    className={`rounded-circle mb-3 ${index === 0 ? 'mt-4' : ''}`}
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    alt={instructor.name}
                                />

                                <h5 className="fw-bold mb-1">{instructor.name}</h5>
                                <p className="text-accent font-sm mb-3">{instructor.current_role || "Giảng viên"}</p>

                                <div className="d-flex justify-content-center gap-3 text-muted font-sm">
                                    <span>
                                        <i className="fa-solid fa-star text-warning"></i> {Number(instructor.received_reviews_avg_rating || 0).toFixed(1)}
                                    </span>
                                    <span>
                                        <i className="fa-solid fa-users"></i> {instructor.students_count || 0} HV
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}