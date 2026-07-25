document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar & Mobile Toggle ---
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const body = document.body;

    if (sidebarToggle) sidebarToggle.addEventListener('click', () => body.classList.toggle('sidebar-open'));
    if (sidebarClose) sidebarClose.addEventListener('click', () => body.classList.remove('sidebar-open'));

    // --- Sidebar Menu Indicator Animation ---
    const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');
    const indicator = document.querySelector('.menu-indicator');
    
    function moveIndicator(el) {
        if (!indicator) return;
        const topPos = el.offsetTop;
        indicator.style.top = `${topPos + 6}px`; // Adjusting for padding
    }

    // Set initial position
    const activeLink = document.querySelector('.sidebar-menu .nav-link.active');
    if (activeLink) moveIndicator(activeLink);

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            moveIndicator(this);
        });
        link.addEventListener('mouseleave', function() {
            const currentActive = document.querySelector('.sidebar-menu .nav-link.active');
            if (currentActive) moveIndicator(currentActive);
        });
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            moveIndicator(this);
        });
    });

    // --- Stagger Fade-Up Animation (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // 100ms stagger
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-fade-up').forEach(el => observer.observe(el));

    // --- Advanced CountUp with Spring Easing ---
    function easeOutBack(t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }

    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progressTime = timestamp - startTimestamp;
            
            if (progressTime < duration) {
                const currentVal = easeOutBack(progressTime, start, end - start, duration, 1.2);
                el.textContent = Math.round(currentVal).toLocaleString('vi-VN');
                window.requestAnimationFrame(step);
            } else {
                el.textContent = end.toLocaleString('vi-VN');
            }
        };
        window.requestAnimationFrame(step);
    }

    setTimeout(() => {
        document.querySelectorAll('.count-up').forEach((el, index) => {
            const endVal = parseInt(el.getAttribute('data-value'), 10);
            if (!isNaN(endVal)) {
                setTimeout(() => {
                    animateValue(el, 0, endVal, 2000);
                }, index * 150); // Stagger counter start
            }
        });
    }, 500);

    // --- Chart.js Nâng cấp "Ảo diệu" ---
    setTimeout(() => {
        document.getElementById('chartSkeleton').classList.add('d-none');
        const chartContainer = document.getElementById('chartContainer');
        chartContainer.classList.remove('d-none');
        
        // --- Main Line Chart ---
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Multi-stop Gradient cho Line Chart
        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, 'rgba(79, 172, 254, 0.6)'); // Primary glow
        gradient.addColorStop(0.5, 'rgba(79, 172, 254, 0.2)');
        gradient.addColorStop(1, 'rgba(79, 172, 254, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7'],
                datasets: [{
                    label: 'Doanh thu',
                    data: [15, 22, 18, 35, 28, 45, 42],
                    borderColor: '#4facfe',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#4facfe',
                    pointBorderWidth: 2,
                    pointRadius: 0, // Ẩn point bình thường, chỉ hiện khi hover
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#4facfe',
                    pointHoverBorderColor: '#ffffff',
                    fill: true,
                    tension: 0.4 // Cong mềm
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    x: { duration: 1500, easing: 'easeOutQuart', from: NaN },
                    y: { duration: 1000, easing: 'easeOutQuart', from: 0 }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1e293b',
                        bodyColor: '#4facfe',
                        borderColor: 'rgba(79, 172, 254, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: { family: 'Space Grotesk', size: 13 },
                        bodyFont: { family: 'Space Grotesk', size: 16, weight: 'bold' },
                        displayColors: false,
                        callbacks: {
                            label: (context) => context.raw + ' Triệu VNĐ'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#94a3b8', font: { family: 'Space Grotesk' } }
                    },
                    y: {
                        border: { display: false },
                        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: 'Space Grotesk' },
                            callback: (value) => value + 'M'
                        }
                    }
                }
            }
        });

        // --- Donut Progress Chart ---
        const ctxDonut = document.getElementById('completionChart').getContext('2d');
        const gradientDonut = ctxDonut.createLinearGradient(0, 0, 200, 200);
        gradientDonut.addColorStop(0, '#4facfe');
        gradientDonut.addColorStop(1, '#a18cd1');

        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Hoàn thành', 'Chưa hoàn thành'],
                datasets: [{
                    data: [76, 24],
                    backgroundColor: [gradientDonut, 'rgba(148, 163, 184, 0.1)'],
                    borderWidth: 0,
                    borderRadius: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '85%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                animation: { animateScale: true, animateRotate: true, duration: 2000, easing: 'easeOutQuart' }
            }
        });

    }, 800);

    // --- Sparklines (Mini charts on cards) ---
    const drawSparkline = (id, data, color) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1','2','3','4','5','6','7'],
                datasets: [{
                    data: data,
                    borderColor: color,
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false, min: Math.min(...data) - 5 } },
                animation: { duration: 2000 }
            }
        });
    };

    setTimeout(() => {
        drawSparkline('spark1', [10, 20, 15, 30, 25, 40, 35], '#4facfe'); // Primary
        drawSparkline('spark2', [30, 25, 35, 20, 45, 30, 40], '#43e97b'); // Success
        drawSparkline('spark3', [5, 10, 8, 15, 12, 10, 8], '#f6d365');    // Warning
        drawSparkline('spark4', [2, 5, 3, 8, 4, 2, 1], '#fa709a');        // Danger
    }, 1000);

    // --- Spotlight Hover Effect on Glass Cards ---
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Lấy màu nền của card từ data attribute hoặc set mặc định
            const colorVar = card.getAttribute('data-color') || '--primary-glow';
            const color = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
            
            card.style.background = `
                radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 40%),
                radial-gradient(circle at ${x}px ${y}px, ${color}22 0%, transparent 50%)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(255, 255, 255, 0.65)';
        });
    });

});
