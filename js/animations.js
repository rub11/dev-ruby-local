// ============================================================
// ANIMAÇÕES COM INTERSECTION OBSERVER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Observar elementos com classes de animação
    const animatedElements = document.querySelectorAll('.fade-in, .fade-up, .slide-in');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Se quiser manter visível após sair, não remover
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: mostrar tudo
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================================
    // CONTADOR DE NÚMEROS (ANIMAÇÃO)
    // ============================================================
    const counters = document.querySelectorAll('.stat-number[data-count], .stats-number[data-count]');
    
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            counter.textContent = target;
        });
    }

    function animateCounter(el, target) {
        let current = 0;
        const increment = Math.ceil(target / 60); // 60 frames
        const duration = 2000; // 2 segundos
        const stepTime = Math.floor(duration / 60);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = current;
            }
        }, stepTime);
    }
});

// ============================================================
// EFEITO DE PARALLAX NO HERO (opcional)
// ============================================================
document.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero-visual');
    if (!hero) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    hero.style.transform = `translate(${x}px, ${y}px)`;
});

// ============================================================
// PARTICULAS (CANVAS)
// ============================================================
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 120;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        width = canvas.width;
        height = canvas.height;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1,
                isRed: Math.random() < 0.08 // alguns pontos vermelhos
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            if (p.isRed) {
                ctx.fillStyle = `rgba(255, 51, 51, ${p.opacity * 0.8})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            }
            ctx.fill();
            
            // Movimento
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebater nas bordas
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        
        requestAnimationFrame(drawParticles);
    }

    function init() {
        resize();
        createParticles();
        drawParticles();
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    init();
}

document.addEventListener('DOMContentLoaded', initParticles);