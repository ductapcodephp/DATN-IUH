import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/Frontend/FrontendLayout';

export default function Apply({ profile, bankAccount }) {
    const { flash } = usePage().props;
    
    // Determine the current status
    const status = profile?.status || 'none'; 
    const isPending = status === 'pending';
    const isApproved = status === 'approved';
    const isRejected = status === 'rejected';

    const { data, setData, post, processing, errors } = useForm({
        headline: profile?.headline || '',
        bio: profile?.bio || '',
        website: profile?.website || '',
        tax_number: profile?.tax_number || '',
        bank_name: bankAccount?.bank_name || '',
        bank_account_number: bankAccount?.account_number || '',
        bank_account_name: bankAccount?.account_name || '',
        identity_card_front: null,
        identity_card_back: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('apply-seller.submit'));
    };

    return (
        <FrontendLayout>
            <Head title="Đăng ký làm giảng viên" />

            <div className="bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            
                            <div className="text-center mb-5">
                                <h1 className="fw-bold">Trở thành Giảng viên</h1>
                                <p className="text-muted">Chia sẻ kiến thức của bạn và tạo nguồn thu nhập thụ động</p>
                            </div>

                            {flash.success && (
                                <div className="alert alert-success shadow-sm border-0 rounded-3 mb-4">
                                    <i className="fa-solid fa-circle-check me-2"></i>
                                    {flash.success}
                                </div>
                            )}

                            {errors.system && (
                                <div className="alert alert-danger shadow-sm border-0 rounded-3 mb-4">
                                    <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                    {errors.system}
                                </div>
                            )}

                            {isPending && (
                                <div className="alert alert-info shadow-sm border-0 rounded-3 p-4 mb-4 text-center">
                                    <i className="fa-solid fa-hourglass-half fs-1 text-info mb-3 d-block"></i>
                                    <h4 className="fw-bold text-dark">Hồ sơ đang chờ duyệt</h4>
                                    <p className="mb-0 text-muted">Chúng tôi đã nhận được hồ sơ của bạn và đang tiến hành xét duyệt. Quá trình này có thể mất từ 1-3 ngày làm việc. Vui lòng kiên nhẫn chờ đợi.</p>
                                </div>
                            )}

                            {isApproved && (
                                <div className="alert alert-success shadow-sm border-0 rounded-3 p-4 mb-4 text-center">
                                    <i className="fa-solid fa-medal fs-1 text-success mb-3 d-block"></i>
                                    <h4 className="fw-bold text-dark">Chúc mừng! Bạn đã là Giảng viên</h4>
                                    <p className="text-muted">Hồ sơ của bạn đã được duyệt thành công.</p>
                                    <Link href={route('seller.dashboard')} className="btn btn-success rounded-pill px-4 mt-2">
                                        Vào trang Quản lý Giảng viên
                                    </Link>
                                </div>
                            )}

                            {isRejected && (
                                <div className="alert alert-danger shadow-sm border-0 rounded-3 p-4 mb-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="fa-solid fa-circle-xmark fs-2 text-danger me-3"></i>
                                        <h4 className="fw-bold mb-0 text-dark">Hồ sơ bị từ chối</h4>
                                    </div>
                                    <p className="mb-2"><strong>Lý do:</strong> {profile.reject_reason}</p>
                                    <p className="mb-0 text-muted small">Vui lòng cập nhật lại thông tin bên dưới và gửi lại yêu cầu để chúng tôi xem xét.</p>
                                </div>
                            )}

                            {(!isPending && !isApproved) && (
                                <div className="card shadow-sm border-0 rounded-4">
                                    <div className="card-body p-4 p-md-5">
                                        <form onSubmit={submit} encType="multipart/form-data">
                                            
                                            <h5 className="fw-bold mb-4 text-primary"><i className="fa-solid fa-user-tie me-2"></i>1. Thông tin chuyên môn</h5>
                                            
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Chức danh / Chuyên môn <span className="text-danger">*</span></label>
                                                <input type="text" className={`form-control ${errors.headline ? 'is-invalid' : ''}`} placeholder="VD: Senior Fullstack Developer" value={data.headline} onChange={e => setData('headline', e.target.value)} />
                                                {errors.headline && <div className="invalid-feedback">{errors.headline}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Giới thiệu bản thân <span className="text-danger">*</span></label>
                                                <textarea className={`form-control ${errors.bio ? 'is-invalid' : ''}`} rows="5" placeholder="Kể về kinh nghiệm và kỹ năng của bạn..." value={data.bio} onChange={e => setData('bio', e.target.value)}></textarea>
                                                {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label fw-bold">Website / LinkedIn (Tùy chọn)</label>
                                                <input type="url" className={`form-control ${errors.website ? 'is-invalid' : ''}`} placeholder="https://..." value={data.website} onChange={e => setData('website', e.target.value)} />
                                                {errors.website && <div className="invalid-feedback">{errors.website}</div>}
                                            </div>

                                            <hr className="my-5" />

                                            <h5 className="fw-bold mb-4 text-primary"><i className="fa-solid fa-money-check-dollar me-2"></i>2. Thông tin thanh toán (Payout)</h5>

                                            <div className="row g-3 mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">Tên Ngân hàng <span className="text-danger">*</span></label>
                                                    <input type="text" className={`form-control ${errors.bank_name ? 'is-invalid' : ''}`} placeholder="VD: Vietcombank, TPBank" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} />
                                                    {errors.bank_name && <div className="invalid-feedback">{errors.bank_name}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">Số tài khoản <span className="text-danger">*</span></label>
                                                    <input type="text" className={`form-control ${errors.bank_account_number ? 'is-invalid' : ''}`} value={data.bank_account_number} onChange={e => setData('bank_account_number', e.target.value)} />
                                                    {errors.bank_account_number && <div className="invalid-feedback">{errors.bank_account_number}</div>}
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="form-label fw-bold">Tên chủ tài khoản <span className="text-danger">*</span></label>
                                                    <input type="text" className={`form-control ${errors.bank_account_name ? 'is-invalid' : ''}`} placeholder="VIET HOA KHONG DAU" value={data.bank_account_name} onChange={e => setData('bank_account_name', e.target.value)} />
                                                    {errors.bank_account_name && <div className="invalid-feedback">{errors.bank_account_name}</div>}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label fw-bold">Mã số thuế (Tùy chọn)</label>
                                                <input type="text" className={`form-control ${errors.tax_number ? 'is-invalid' : ''}`} value={data.tax_number} onChange={e => setData('tax_number', e.target.value)} />
                                                {errors.tax_number && <div className="invalid-feedback">{errors.tax_number}</div>}
                                            </div>

                                            <hr className="my-5" />

                                            <h5 className="fw-bold mb-4 text-primary"><i className="fa-solid fa-id-card me-2"></i>3. Xác minh danh tính</h5>
                                            <p className="small text-muted mb-4">Để đảm bảo chất lượng, chúng tôi cần xác minh danh tính của bạn. Vui lòng tải lên ảnh chụp 2 mặt CMND/CCCD hoặc Hộ chiếu (rõ nét, không bị lóa sáng).</p>

                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">Mặt trước CCCD <span className="text-danger">*</span></label>
                                                    <input type="file" className={`form-control ${errors.identity_card_front ? 'is-invalid' : ''}`} accept="image/*" onChange={e => setData('identity_card_front', e.target.files[0])} />
                                                    {errors.identity_card_front && <div className="invalid-feedback">{errors.identity_card_front}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">Mặt sau CCCD <span className="text-danger">*</span></label>
                                                    <input type="file" className={`form-control ${errors.identity_card_back ? 'is-invalid' : ''}`} accept="image/*" onChange={e => setData('identity_card_back', e.target.files[0])} />
                                                    {errors.identity_card_back && <div className="invalid-feedback">{errors.identity_card_back}</div>}
                                                </div>
                                            </div>

                                            <div className="d-grid mt-5">
                                                <button type="submit" className="btn btn-primary btn-lg rounded-pill fw-bold" disabled={processing}>
                                                    {processing ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-paper-plane me-2"></i>}
                                                    {isRejected ? 'Gửi lại Yêu cầu' : 'Gửi Yêu cầu Xét duyệt'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
