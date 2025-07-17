// Show/Hide commands for each category
window.addEventListener('DOMContentLoaded', function() {
    // === Starfield Background ===
    const canvas = document.getElementById('starfield-bg');
    if (canvas) {
        // Shooting stars
        let shootingStars = [];
        let lastShootingStar = 0;
        function spawnShootingStar() {
            // Allow up to 3 shooting stars at once
            if (shootingStars.length < 3 && Date.now() - lastShootingStar > Math.random() * 2000 + 1200) {
                lastShootingStar = Date.now();
                // Randomly pick a side: 0=left, 1=top, 2=right, 3=bottom
                const side = Math.floor(Math.random() * 4);
                let x, y, angle;
                if (side === 0) { // left
                    x = -40;
                    y = Math.random() * h;
                    angle = Math.random() * Math.PI / 2 - Math.PI / 4; // -45deg to 45deg
                } else if (side === 1) { // top
                    x = Math.random() * w;
                    y = -40;
                    angle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 2; // 45deg to 135deg
                } else if (side === 2) { // right
                    x = w + 40;
                    y = Math.random() * h;
                    angle = Math.PI + Math.random() * Math.PI / 2 - Math.PI / 4; // 135deg to 225deg
                } else { // bottom
                    x = Math.random() * w;
                    y = h + 40;
                    angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 2; // -135deg to -45deg
                }
                shootingStars.push({
                    x,
                    y,
                    len: Math.random() * 80 + 80,
                    speed: Math.random() * 6 + 7,
                    angle,
                    alpha: 1,
                    life: 0
                });
            }
        }
        function drawShootingStars() {
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                const dx = Math.cos(s.angle) * s.speed;
                const dy = Math.sin(s.angle) * s.speed;
                s.x += dx;
                s.y += dy;
                s.life += 1;
                s.alpha *= 0.985;
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.strokeStyle = 'white';
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
                ctx.lineWidth = 2.2;
                ctx.stroke();
                ctx.restore();
                // Remove if faded or out of bounds
                if (
                    s.alpha < 0.05 ||
                    s.x < -120 || s.x > w + 120 ||
                    s.y < -120 || s.y > h + 120
                ) {
                    shootingStars.splice(i, 1);
                }
            }
        }
        const ctx = canvas.getContext('2d');
        let w = window.innerWidth;
        let h = window.innerHeight;
        let stars = [];
        const STAR_COUNT = Math.floor((w * h) / 1800);
        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        }
        function createStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                // 1 in 18 stars is highlighted
                const highlighted = Math.random() < 1/18;
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: highlighted ? Math.random() * 1.7 + 1.1 : Math.random() * 0.9 + 0.15,
                    o: highlighted ? Math.random() * 0.25 + 0.7 : Math.random() * 0.25 + 0.15,
                    s: Math.random() * 0.2 + 0.05,
                    tw: Math.random() * Math.PI * 2,
                    highlighted
                });
            }
        }
        function drawFourPointStar(ctx, x, y, r, rotation = 0) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.moveTo(0, -r); // top
            ctx.lineTo(r * 0.45, -r * 0.45); // top-right
            ctx.lineTo(r, 0); // right
            ctx.lineTo(r * 0.45, r * 0.45); // bottom-right
            ctx.lineTo(0, r); // bottom
            ctx.lineTo(-r * 0.45, r * 0.45); // bottom-left
            ctx.lineTo(-r, 0); // left
            ctx.lineTo(-r * 0.45, -r * 0.45); // top-left
            ctx.closePath();
            ctx.restore();
        }

        function drawStars() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                ctx.save();
                ctx.globalAlpha = star.o * (0.7 + 0.3 * Math.sin(star.tw));
                ctx.fillStyle = '#fff';
                ctx.shadowColor = star.highlighted ? '#fff' : '#fff';
                ctx.shadowBlur = star.highlighted ? 16 : 3;
                // Estrella de 4 puntas
                drawFourPointStar(ctx, star.x, star.y, star.r, star.tw);
                ctx.fill();
                if (star.highlighted) {
                    // Brillo extra para destacadas
                    ctx.shadowColor = '#ffcdcd';
                    ctx.shadowBlur = 32;
                    ctx.globalAlpha *= 0.7;
                    drawFourPointStar(ctx, star.x, star.y, star.r * 1.7, star.tw);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
                ctx.restore();
                // Twinkle
                star.tw += star.s * 0.5;
            }
        }
        function animate() {
            drawStars();
            drawShootingStars();
            spawnShootingStar();
            requestAnimationFrame(animate);
        }
        window.addEventListener('resize', () => {
            resize();
            createStars();
        });
        resize();
        createStars();
        animate();
    }
    const showBtn = document.getElementById('showCommandsBtn');
    cards = document.querySelectorAll('.card');
    let commandsVisible = false;

    if (showBtn) {
        showBtn.addEventListener('click', function() {
            commandsVisible = !commandsVisible;
            cards.forEach(card => {
                const commands = card.querySelector('.commands-list');
                if (commands) {
                    commands.style.display = commandsVisible ? 'block' : 'none';
                }
            });
            showBtn.textContent = commandsVisible ? 'Hide Commands' : 'Show Commands';
        });
    }


    // === Feedback Carousel Logic ===
    const feedbackCards = Array.from(document.querySelectorAll('.feedback-card'));
    const feedbackCardsContainer = document.querySelector('.feedback-cards');
    const dots = Array.from(document.querySelectorAll('.feedback-dot'));
    const leftArrow = document.querySelector('.feedback-arrow-left');
    const rightArrow = document.querySelector('.feedback-arrow-right');
    const CARDS_PER_PAGE = 3;
    let currentPage = 0;
    const totalPages = Math.ceil(feedbackCards.length / CARDS_PER_PAGE);

    function showPage(page) {
        // Clamp page
        currentPage = Math.max(0, Math.min(page, totalPages - 1));
        // Hide all cards
        feedbackCards.forEach(card => card.style.display = 'none');
        // Show only cards for current page
        const start = currentPage * CARDS_PER_PAGE;
        const end = start + CARDS_PER_PAGE;
        feedbackCards.slice(start, end).forEach(card => card.style.display = 'flex');
        // Update dots
        dots.forEach((dot, i) => {
            if (i === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showPage(i);
            });
        });
    }
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            showPage(currentPage - 1);
        });
    }
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            showPage(currentPage + 1);
        });
    }
    // Init
    showPage(0);

    // Currency toggle functionality
    const currencySwitch = document.getElementById('currencySwitch');
    const currencyLabel = document.getElementById('currencyLabel');
    const priceElements = document.querySelectorAll('.price');

    if (currencySwitch && currencyLabel && priceElements.length > 0) {
        currencySwitch.addEventListener('change', function() {
            if (currencySwitch.checked) {
                // Show USD
                priceElements.forEach(el => {
                    el.textContent = el.getAttribute('data-usd');
                });
            } else {
                // Show ARS
                priceElements.forEach(el => {
                    el.textContent = el.getAttribute('data-ars');
                });
            }
            currencyLabel.textContent = 'Show in USD';
        });
    }
});
// ----------------------
// Tabs dinÃ¡micas
// ----------------------
const buttons = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.style.display = 'none');

        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.target);
        if (target) target.style.display = 'block';
    });
});

// ----------------------
// ProtecciÃ³n bÃ¡sica
// ----------------------
document.addEventListener('keydown', function(e) {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || 
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// ----------------------
// Mensaje disuasivo en consola
// ----------------------
setTimeout(() => {
    if (window.console) {
        console.log("%cðŸš« No intentes inspeccionar ni copiar esta pÃ¡gina.", "color: red; font-size: 16px; font-weight: bold;");
    }
}, 500);

// ----------------------
// Burbuja de partner
// ----------------------
function closeBubble() {
    const bubble = document.getElementById('bubble-partner');
    if (bubble) bubble.style.display = 'none';
}

// ----------------------
// terms
// ----------------------
document.addEventListener("DOMContentLoaded", function() {
    // TÃ©rminos
    const openTerms = document.getElementById('openTerms');
    const termsModal = document.getElementById('termsModal');
    const closeTerms = document.getElementById('closeTerms');

    openTerms.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
    });

    closeTerms.addEventListener('click', function() {
        termsModal.style.display = 'none';
    });

    // Privacidad
    const openPrivacy = document.getElementById('openPrivacy');
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacy = document.getElementById('closePrivacy');

    openPrivacy.addEventListener('click', function(e) {
        e.preventDefault();
        privacyModal.style.display = 'block';
    });

    closePrivacy.addEventListener('click', function() {
        privacyModal.style.display = 'none';
    });

    // Cerrar haciendo clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });
});
