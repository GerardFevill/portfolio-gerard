// ===============================================
// PARTICLES BACKGROUND
// ===============================================
class ParticlesBackground {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        const isLightMode = document.body.classList.contains('light-mode');

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 1 - distance / 120;
                    if (isLightMode) {
                        this.ctx.strokeStyle = `rgba(0, 85, 170, ${opacity * 0.5})`;
                    } else {
                        this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.3})`;
                    }
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
    }

    update(mouse) {
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x -= directionX * force * this.density * 0.5;
                this.y -= directionY * force * this.density * 0.5;
            }
        }

        // Movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundaries
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw(ctx) {
        const isLightMode = document.body.classList.contains('light-mode');
        if (isLightMode) {
            ctx.fillStyle = 'rgba(0, 85, 170, 0.9)';
        } else {
            ctx.fillStyle = 'rgba(0, 217, 255, 0.8)';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===============================================
// TYPING EFFECT
// ===============================================
class TypeWriter {
    constructor(element, texts, speed = 100, pause = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        // Add cursor
        if (!this.element.querySelector('.cursor')) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            this.element.appendChild(cursor);
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===============================================
// SCROLL REVEAL
// ===============================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        this.checkReveal();
        window.addEventListener('scroll', () => this.checkReveal());
    }

    checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
}

// ===============================================
// SKILL BARS ANIMATION
// ===============================================
class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.checkAnimation());
    }

    checkAnimation() {
        if (this.animated) return;

        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const sectionTop = skillsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 200) {
            this.animateBars();
            this.animated = true;
        }
    }

    animateBars() {
        this.bars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, index * 100);
        });
    }
}

// ===============================================
// COUNTER ANIMATION
// ===============================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.checkAnimation());
    }

    checkAnimation() {
        if (this.animated) return;

        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;

        const sectionTop = aboutSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 200) {
            this.animateCounters();
            this.animated = true;
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ===============================================
// SMOOTH SCROLL
// ===============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    document.querySelector('.nav-links').classList.remove('active');
                }
            });
        });
    }
}

// ===============================================
// MOBILE NAVIGATION
// ===============================================
class MobileNav {
    constructor() {
        this.toggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
                this.toggle.classList.toggle('active');
            });
        }
    }
}

// ===============================================
// NAVBAR SCROLL EFFECT
// ===============================================
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        const handleScroll = () => {
            const isDarkMode = document.body.classList.contains('dark-mode');

            if (window.scrollY > 100) {
                if (isDarkMode) {
                    this.navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                    this.navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
                } else {
                    this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    this.navbar.style.boxShadow = '0 5px 30px rgba(79, 70, 229, 0.1)';
                }
            } else {
                if (isDarkMode) {
                    this.navbar.style.background = 'rgba(10, 10, 15, 0.8)';
                    this.navbar.style.boxShadow = 'none';
                } else {
                    this.navbar.style.background = 'rgba(255, 255, 255, 0.9)';
                    this.navbar.style.boxShadow = 'none';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Run once on init to handle page reload position
        handleScroll();
    }
}

// ===============================================
// FORM HANDLING - Securite + Validation + Anti-XSS + Popup
// ===============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;
        this.lastSubmit = 0;
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    // Protection XSS - Echappe les caracteres dangereux
    sanitizeInput(str) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return str.replace(/[&<>"'`=/]/g, char => map[char]);
    }

    // Detecte les patterns XSS dangereux
    containsXSS(str) {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi,
            /<link/gi,
            /<meta/gi,
            /eval\s*\(/gi,
            /document\./gi,
            /window\./gi,
            /alert\s*\(/gi,
            /innerHTML/gi,
            /outerHTML/gi
        ];
        return xssPatterns.some(pattern => pattern.test(str));
    }

    // Afficher popup
    showPopup(type, title, message) {
        // Supprimer popup existant
        const existing = document.querySelector('.popup-overlay');
        if (existing) existing.remove();

        const isSuccess = type === 'success';

        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-box ${type}">
                <div class="popup-icon">
                    ${isSuccess
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
            }
                </div>
                <h3 class="popup-title">${title}</h3>
                <p class="popup-message">${message}</p>
                <button class="popup-close">OK</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Animation d'entree
        setTimeout(() => popup.classList.add('active'), 10);

        // Fermer popup
        popup.querySelector('.popup-close').addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => popup.remove(), 300);
        });

        // Fermer en cliquant dehors
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                setTimeout(() => popup.remove(), 300);
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const now = Date.now();

        // Rate limiting - 30 secondes entre chaque envoi
        if (now - this.lastSubmit < 30000 && this.lastSubmit !== 0) {
            this.showPopup('error', 'Attendez', 'Veuillez patienter 30 secondes avant de renvoyer un message.');
            return;
        }

        // Recuperer les valeurs
        const nameInput = this.form.querySelector('#name');
        const emailInput = this.form.querySelector('#email');
        const messageInput = this.form.querySelector('#message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Detection XSS
        if (this.containsXSS(name) || this.containsXSS(email) || this.containsXSS(message)) {
            this.showPopup('error', 'Erreur', 'Contenu non autorise detecte.');
            return;
        }

        // Verifier les liens suspects dans le message
        const suspiciousPatterns = /(http|www\.|\.ru|\.cn|viagra|casino|crypto|bitcoin)/i;
        if (suspiciousPatterns.test(message) && message.length < 50) {
            this.showPopup('error', 'Spam detecte', 'Votre message a ete detecte comme spam.');
            return;
        }

        // Verifier email valide
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showPopup('error', 'Email invalide', 'Veuillez entrer une adresse email valide.');
            return;
        }

        // Feedback visuel
        const originalBtnText = this.submitBtn.innerHTML;
        this.submitBtn.innerHTML = '<span class="btn-spinner"></span><span>Envoi...</span>';
        this.submitBtn.disabled = true;

        try {
            // Envoyer via Formspree
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: new FormData(this.form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.lastSubmit = now;
                this.showPopup('success', 'Message envoye !', 'Merci pour votre message. Je vous repondrai dans les plus brefs delais.');
                this.form.reset();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Erreur serveur');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showPopup('error', 'Erreur d\'envoi', 'Une erreur est survenue. Veuillez reessayer ou me contacter directement par email.');
        }

        // Reset bouton
        this.submitBtn.innerHTML = originalBtnText;
        this.submitBtn.disabled = false;
    }
}

// ===============================================
// TECH ICONS ANIMATION
// ===============================================
class TechIconsAnimation {
    constructor() {
        this.icons = document.querySelectorAll('.tech-icon');
        this.init();
    }

    init() {
        this.icons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.1}s`;
            icon.classList.add('fade-in');
        });
    }
}

// ===============================================
// THEME TOGGLE
// ===============================================
class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('theme-toggle');
        this.body = document.body;
        this.init();
    }

    init() {
        // Check saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Default is LIGHT now, so we toggle DARK if needed
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.body.classList.add('dark-mode');
        }

        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.body.classList.toggle('dark-mode');

        // Update navbar background if needed (CSS handles most, but for JS dynamic changes)
        const isDarkMode = this.body.classList.contains('dark-mode');

        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Force navbar update by triggering scroll event
        window.dispatchEvent(new Event('scroll'));
    }
}



// ===============================================
// INITIALIZE ALL
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    new ParticlesBackground();

    // Typing effect (only for role)
    const roleElement = document.getElementById('role-typing');

    if (roleElement) {
        new TypeWriter(roleElement, [
            'Architecture Hybrid AI / Cloud',
            'Deployment RAG & LLM Ops',
            'Secure Enterprise Agents'
        ], 80, 2000);
    }

    // Other initializations
    new ScrollReveal();
    new SkillBars();
    new CounterAnimation();
    new SmoothScroll();
    new MobileNav();
    new NavbarScroll();
    new ContactForm();
    new TechIconsAnimation();
    new ThemeToggle();

    // Boot Loader (Only on first visit or forced)
    new BootLoader();

    // 3D Tilt Effect
    new TiltEffect();
});

// ===============================================
// 3D TILT EFFECT
// ===============================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.tilt-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }

    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Glare effect
        this.updateGlare(card, x, y);
    }

    handleLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const glare = card.querySelector('.glare');
        if (glare) glare.style.opacity = '0';
    }

    updateGlare(card, x, y) {
        let glare = card.querySelector('.glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'glare';
            card.appendChild(glare);
        }

        glare.style.left = `${x}px`;
        glare.style.top = `${y}px`;
        glare.style.opacity = '1';
    }
}

// ===============================================
// BOOT LOADER
// ===============================================
class BootLoader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.sequence = document.getElementById('boot-sequence');
        this.bar = document.getElementById('loader-bar');
        this.messages = [
            { text: '> INIT: Neural Interface v2.0...', delay: 200 },
            { text: '> LOADING: RAG Inference Engine...', delay: 400 },
            { text: '> CONNECTING: Secure Sovereign Cloud...', delay: 600 },
            { text: '> OPTIMIZING: Vector Embeddings...', delay: 500 },
            { text: '> MOUNTING: Enterprise Knowledge Base...', delay: 400 },
            { text: '> SYSTEM: AI Architect Skills Loaded.', delay: 500, class: 'highlight' }
        ];

        // Check if already visited (session storage)
        if (!sessionStorage.getItem('booted')) {
            this.runSequence();
        } else {
            this.quickHide();
        }
    }

    async runSequence() {
        let totalDelay = 0;

        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            totalDelay += msg.delay;

            setTimeout(() => {
                this.addLine(msg);
                this.updateProgress((i + 1) / this.messages.length * 100);
            }, totalDelay);
        }

        setTimeout(() => {
            this.finish();
        }, totalDelay + 800);
    }

    addLine(msg) {
        const line = document.createElement('div');
        line.className = `boot-line ${msg.class || ''}`;
        line.textContent = msg.text;
        this.sequence.appendChild(line);
        this.sequence.scrollTop = this.sequence.scrollHeight;
    }

    updateProgress(percent) {
        this.bar.style.width = `${percent}%`;
    }

    finish() {
        document.body.classList.add('loaded');
        sessionStorage.setItem('booted', 'true');
    }

    quickHide() {
        // Instant hide for returning visitors, but ensure smooth transition
        this.bar.style.width = '100%';
        document.body.classList.add('loaded');
    }
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
