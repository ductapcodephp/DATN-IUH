const fs = require('fs');

const files = {
    'vip-packages.html': `
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Quản lý Gói VIP</h3>
                    <p class="text-muted mb-0">Thiết lập các gói dịch vụ cao cấp cho giảng viên</p>
                </div>
                <button class="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                    <i class="fa-solid fa-plus me-2"></i>Tạo gói mới
                </button>
            </div>
            
            <div class="row g-4 mt-2">
                <div class="col-md-4 stagger-fade-up">
                    <div class="card glass-card border-0 h-100 p-4">
                        <div class="text-center">
                            <h4 class="fw-bold text-dark">Gói Pro 1 Tháng</h4>
                            <h2 class="fw-bold text-primary-glow my-3">199.000đ</h2>
                            <p class="text-muted">Phù hợp cho người mới bắt đầu</p>
                        </div>
                        <ul class="list-unstyled mt-4 mb-5">
                            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> Đăng tối đa 10 khóa học</li>
                            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> Hỗ trợ ưu tiên 24/7</li>
                        </ul>
                        <div class="mt-auto">
                            <button class="btn btn-outline-primary w-100 rounded-pill mb-2">Chỉnh sửa</button>
                            <button class="btn btn-outline-danger w-100 rounded-pill">Xóa gói</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    'settings.html': `
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Cài đặt hệ thống</h3>
                    <p class="text-muted mb-0">Cấu hình các thông số cốt lõi</p>
                </div>
                <button class="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                    <i class="fa-solid fa-save me-2"></i>Lưu thay đổi
                </button>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <h5 class="fw-bold mb-4">Cấu hình doanh thu</h5>
                <form>
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium">Phần trăm hoa hồng chiết khấu (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control glass-input" value="15">
                                <span class="input-group-text glass-input">%</span>
                            </div>
                            <div class="form-text">Tỉ lệ nền tảng sẽ giữ lại khi giảng viên bán được khóa học.</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium">Phần trăm thưởng nạp ví (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control glass-input" value="5">
                                <span class="input-group-text glass-input">%</span>
                            </div>
                            <div class="form-text">Tỉ lệ cộng thêm khi học sinh nạp tiền vào ví.</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    'withdrawals.html': `
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Yêu cầu rút tiền</h3>
                    <p class="text-muted mb-0">Duyệt và xử lý các khoản rút tiền từ giảng viên</p>
                </div>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="border-0 rounded-start-3 px-4 py-3">Mã GD</th>
                                <th class="border-0 py-3">Giảng viên</th>
                                <th class="border-0 py-3">Số tiền</th>
                                <th class="border-0 py-3">Trạng thái</th>
                                <th class="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr>
                                <td class="px-4 py-3 fw-bold">#WD1023</td>
                                <td class="py-3 text-dark">Trần Văn C</td>
                                <td class="py-3 fw-bold text-danger">5.000.000đ</td>
                                <td class="py-3"><span class="badge bg-warning rounded-pill px-3 py-2">Chờ duyệt</span></td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-success me-2">Duyệt</button>
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-danger">Từ chối</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    'reports.html': `
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Quản lý Báo cáo vi phạm</h3>
                    <p class="text-muted mb-0">Xử lý các báo cáo từ cộng đồng</p>
                </div>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="border-0 rounded-start-3 px-4 py-3">Người báo cáo</th>
                                <th class="border-0 py-3">Nội dung báo cáo</th>
                                <th class="border-0 py-3">Loại vi phạm</th>
                                <th class="border-0 py-3">Trạng thái</th>
                                <th class="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr>
                                <td class="px-4 py-3 text-dark fw-bold">Nguyễn Văn A</td>
                                <td class="py-3 text-muted">Khóa học có nội dung không phù hợp...</td>
                                <td class="py-3"><span class="badge bg-danger rounded-pill px-3 py-2">Spam / Cấm</span></td>
                                <td class="py-3"><span class="badge bg-warning text-dark rounded-pill px-3 py-2">Chờ xử lý</span></td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-primary">Chi tiết</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};

for (const [filename, newContent] of Object.entries(files)) {
    let content = fs.readFileSync(filename, 'utf8');
    content = content.replace(/<div class="content-area">[\s\S]*?<\/div>\s*<\/main>/, newContent + '\n    </main>');
    fs.writeFileSync(filename, content);
}
