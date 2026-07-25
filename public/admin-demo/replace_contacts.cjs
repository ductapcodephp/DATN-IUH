const fs = require('fs');
let content = fs.readFileSync('contacts.html', 'utf8');
const newContent = \
        <div class="content-area">
            <div class="d-flex justify-content-between align-items-center section-block stagger-fade-up">
                <div>
                    <h3 class="m-0 fw-bold text-dark">Qu?n lý Liên h?</h3>
                    <p class="text-muted mb-0">Danh sách các yêu c?u, l?i nh?n t? khách hàng và d?i tác</p>
                </div>
            </div>
            
            <div class="card border-0 shadow-none glass-card rounded-4 p-4 stagger-fade-up mt-4">
                <div class="d-flex justify-content-between mb-4">
                    <div class="position-relative w-25">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input type="text" class="form-control glass-input ps-5 rounded-pill" placeholder="Tìm ki?m l?i nh?n...">
                    </div>
                    <div class="d-flex gap-2">
                        <select class="form-select glass-input rounded-pill">
                            <option value="">Tr?ng thái</option>
                            <option value="pending">Chua x? lý</option>
                            <option value="resolved">Ðã ph?n h?i</option>
                        </select>
                        <select class="form-select glass-input rounded-pill">
                            <option value="">Ch? d?</option>
                            <option value="tu_van">Tu v?n khóa h?c</option>
                            <option value="bao_loi">Báo l?i</option>
                            <option value="hop_tac">H?p tác</option>
                        </select>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="border-0 rounded-start-3 px-4 py-3">Ngu?i g?i</th>
                                <th class="border-0 py-3">Thông tin liên l?c</th>
                                <th class="border-0 py-3">Ch? d?</th>
                                <th class="border-0 py-3">Tr?ng thái</th>
                                <th class="border-0 py-3">Ngày g?i</th>
                                <th class="border-0 rounded-end-3 text-end px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="border-top-0">
                            <tr>
                                <td class="px-4 py-3 text-dark fw-bold">Nguy?n Van A</td>
                                <td class="py-3">
                                    <div class="text-dark small"><i class="fa-solid fa-phone me-1 text-muted"></i> 0912345678</div>
                                    <div class="text-muted small"><i class="fa-solid fa-envelope me-1"></i> name@example.com</div>
                                </td>
                                <td class="py-3"><span class="badge bg-primary rounded-pill">Tu v?n khóa h?c</span></td>
                                <td class="py-3"><span class="badge bg-warning text-dark rounded-pill px-3 py-2">Chua x? lý</span></td>
                                <td class="py-3 text-muted small">24/07/2026</td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-glass-primary">Chi ti?t</button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 text-dark fw-bold">Tr?n Th? B</td>
                                <td class="py-3">
                                    <div class="text-dark small"><i class="fa-solid fa-phone me-1 text-muted"></i> 0987654321</div>
                                    <div class="text-muted small"><i class="fa-solid fa-envelope me-1"></i> b.tran@example.com</div>
                                </td>
                                <td class="py-3"><span class="badge bg-danger rounded-pill">Báo l?i</span></td>
                                <td class="py-3"><span class="badge glass-badge-success rounded-pill px-3 py-2">Ðã ph?n h?i</span></td>
                                <td class="py-3 text-muted small">23/07/2026</td>
                                <td class="px-4 py-3 text-end">
                                    <button class="btn btn-sm rounded-pill px-3 btn-outline-secondary">Xem l?i</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
\;
content = content.replace(/<div class="content-area">[\s\S]*?<\/div>\s*<\/main>/, newContent + '\n    </main>');
fs.writeFileSync('contacts.html', content);
