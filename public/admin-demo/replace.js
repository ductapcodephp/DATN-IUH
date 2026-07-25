const fs = require('fs');
const files = {
    'users.html': \
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Qu?n lý ngu?i dùng</h3>
                    <p class="text-muted mb-0">Danh sách tài kho?n h?c viên và gi?ng viên</p>
                </div>
                <button class="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                    <i class="fa-solid fa-plus me-2"></i>Thêm ngu?i dùng
                </button>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div class="d-flex justify-content-between mb-4">
                    <div class="position-relative w-25">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input type="text" class="form-control glass-input ps-5 rounded-pill" placeholder="Tìm ki?m...">
                    </div>
                    <div class="d-flex gap-2">
                        <select class="form-select glass-input rounded-pill">
                            <option value="">Tr?ng thái</option>
                            <option value="active">Ho?t d?ng</option>
                            <option value="blocked">Ðã ch?n</option>
                        </select>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="border-0 rounded-start-3 px-4 py-3">Ngu?i dùng</th>
                                <th class="border-0 py-3">Vai trò</th>
                                <th class="border-0 py-3">Ngày dang ký</th>
                                <th class="border-0 py-3">Tr?ng thái</th>
                                <th class="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr>
                                <td class="px-4 py-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="avatar-glow">
                                            <img src="https://ui-avatars.com/api/?name=Nguyen+A&background=random" alt="Avatar" class="rounded-circle" width="40" height="40">
                                        </div>
                                        <div>
                                            <div class="fw-bold text-dark">Nguy?n Van A</div>
                                            <div class="text-muted small">nguyenvana@gmail.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3"><span class="badge bg-primary rounded-pill">H?c sinh</span></td>
                                <td class="py-3 text-muted">10/10/2026</td>
                                <td class="py-3"><span class="badge glass-badge-success rounded-pill px-3 py-2">Ho?t d?ng</span></td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-danger"><i class="fa-solid fa-lock me-2"></i> Ch?n</button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="avatar-glow">
                                            <img src="https://ui-avatars.com/api/?name=Le+B&background=random" alt="Avatar" class="rounded-circle" width="40" height="40">
                                        </div>
                                        <div>
                                            <div class="fw-bold text-dark">Lê Th? B</div>
                                            <div class="text-muted small">lethib@gmail.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3"><span class="badge bg-info rounded-pill">Gi?ng viên</span></td>
                                <td class="py-3 text-muted">08/10/2026</td>
                                <td class="py-3"><span class="badge glass-badge-danger rounded-pill px-3 py-2">B? ch?n</span></td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-success"><i class="fa-solid fa-unlock me-2"></i> M? ch?n</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    \,
    'vip-packages.html': \
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Qu?n lý Gói VIP</h3>
                    <p class="text-muted mb-0">Thi?t l?p các gói d?ch v? cao c?p cho gi?ng viên</p>
                </div>
                <button class="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                    <i class="fa-solid fa-plus me-2"></i>T?o gói m?i
                </button>
            </div>
            
            <div class="row g-4 mt-2">
                <div class="col-md-4 stagger-fade-up">
                    <div class="card glass-card border-0 h-100 p-4">
                        <div class="text-center">
                            <h4 class="fw-bold text-dark">Gói Pro 1 Tháng</h4>
                            <h2 class="fw-bold text-primary-glow my-3">199.000d</h2>
                            <p class="text-muted">Phù h?p cho ngu?i m?i b?t d?u</p>
                        </div>
                        <ul class="list-unstyled mt-4 mb-5">
                            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> Ðang t?i da 10 khóa h?c</li>
                            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> H? tr? uu tiên 24/7</li>
                        </ul>
                        <div class="mt-auto">
                            <button class="btn btn-outline-primary w-100 rounded-pill mb-2">Ch?nh s?a</button>
                            <button class="btn btn-outline-danger w-100 rounded-pill">Xóa gói</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    \,
    'settings.html': \
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Cài d?t h? th?ng</h3>
                    <p class="text-muted mb-0">C?u hình các thông s? c?t lõi</p>
                </div>
                <button class="btn btn-glass-primary fw-bold rounded-pill px-4 py-2">
                    <i class="fa-solid fa-save me-2"></i>Luu thay d?i
                </button>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <h5 class="fw-bold mb-4">C?u hình doanh thu</h5>
                <form>
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium">Ph?n tram hoa h?ng chi?t kh?u (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control glass-input" value="15">
                                <span class="input-group-text glass-input">%</span>
                            </div>
                            <div class="form-text">T? l? n?n t?ng s? gi? l?i khi gi?ng viên bán du?c khóa h?c.</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted fw-medium">Ph?n tram thu?ng n?p ví (%)</label>
                            <div class="input-group">
                                <input type="number" class="form-control glass-input" value="5">
                                <span class="input-group-text glass-input">%</span>
                            </div>
                            <div class="form-text">T? l? c?ng thêm khi h?c sinh n?p ti?n vào ví.</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    \,
    'withdrawals.html': \
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Yêu c?u rút ti?n</h3>
                    <p class="text-muted mb-0">Duy?t và x? lý các kho?n rút ti?n t? gi?ng viên</p>
                </div>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="border-0 rounded-start-3 px-4 py-3">Mã GD</th>
                                <th class="border-0 py-3">Gi?ng viên</th>
                                <th class="border-0 py-3">S? ti?n</th>
                                <th class="border-0 py-3">Tr?ng thái</th>
                                <th class="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr>
                                <td class="px-4 py-3 fw-bold">#WD1023</td>
                                <td class="py-3 text-dark">Tr?n Van C</td>
                                <td class="py-3 fw-bold text-danger">5.000.000d</td>
                                <td class="py-3"><span class="badge bg-warning rounded-pill px-3 py-2">Ch? duy?t</span></td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-success me-2">Duy?t</button>
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-danger">T? ch?i</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    \,
    'reports.html': \
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Qu?n lý Báo cáo vi ph?m</h3>
                    <p class="text-muted mb-0">X? lý các báo cáo t? c?ng d?ng</p>
                </div>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="border-0 rounded-start-3 px-4 py-3">Ngu?i báo cáo</th>
                                <th class="border-0 py-3">N?i dung báo cáo</th>
                                <th class="border-0 py-3">Lo?i vi ph?m</th>
                                <th class="border-0 py-3">Tr?ng thái</th>
                                <th class="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr>
                                <td class="px-4 py-3 text-dark fw-bold">Nguy?n Van A</td>
                                <td class="py-3 text-muted">Khóa h?c có n?i dung không phù h?p...</td>
                                <td class="py-3"><span class="badge bg-danger rounded-pill px-3 py-2">Spam / C?m</span></td>
                                <td class="py-3"><span class="badge bg-warning text-dark rounded-pill px-3 py-2">Ch? x? lý</span></td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-primary">Chi ti?t</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    \
};

for (const [filename, newContent] of Object.entries(files)) {
    let content = fs.readFileSync(filename, 'utf8');
    content = content.replace(/<div class="content-area">[\s\S]*?<\/div>\s*<\/main>/, newContent + '\n    </main>');
    fs.writeFileSync(filename, content);
}
