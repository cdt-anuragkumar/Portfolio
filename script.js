// EmailJS Contact Form Integration
document.addEventListener('DOMContentLoaded', function() {
    if (window.emailjs) {
        emailjs.init('dSOmkqyH-YiLDLKla');
    }
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('formStatus');
    if (form && window.emailjs) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status sending';
            // Log form field names and values for debugging
            try {
                const fd = new FormData(form);
                console.log('Contact form contents:');
                for (const pair of fd.entries()) {
                    console.log('  ', pair[0], ':', pair[1]);
                }
            } catch (e) { console.warn('Could not serialize form data', e); }

            // Ensure hidden recipient fields are set (some templates expect these)
            try {
                const toEmailEl = document.getElementById('to_email');
                const toNameEl = document.getElementById('to_name');
                if (toEmailEl) toEmailEl.value = 'cdt.anuragkumar@gmail.com';
                if (toNameEl) toNameEl.value = 'Anurag Kumar';
            } catch (e) { /* ignore */ }

            // Prefer sendForm to send the entire form and preserve field names
            emailjs.sendForm('service_gpwesz5', 'template_c5y0ule', '#contact-form')
                .then(function(response) {
                    // response may contain status and text
                    console.log('EmailJS response:', response);
                    const statusText = (response && response.status) ? ('Status: ' + response.status) : '';
                    formStatus.textContent = 'Message sent successfully! ' + statusText;
                    formStatus.className = 'form-status success';
                    form.reset();
                    if (submitBtn) submitBtn.disabled = false;
                })
                .catch(function(error) {
                    console.error('EmailJS error:', error);
                    // show more detailed error information if available
                    let details = '';
                    try { details = error && (error.text || error.toString()); } catch (ex) { details = '' }
                    formStatus.textContent = 'Failed to send message. ' + (details ? details : 'Please try again later.');
                    formStatus.className = 'form-status error';
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }

    // test-send removed
});
/* ========================================================
   ANURAG KUMAR — PORTFOLIO  |  SPA Script
   Smooth Scroll · Active Nav · Typing · Particles · Animations
   ======================================================== */

(function () {
    // ...existing code...
    'use strict';

    /* ==================== NAVBAR ==================== */
    const navbar    = document.getElementById('navbar');
    const navLinks  = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const indicator   = document.getElementById('navIndicator');
    const sections    = document.querySelectorAll('section[id]');

    // — Scroll detection (add .scrolled to navbar) —
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // — Mobile toggle —
    if (navToggle) {
        // Create overlay for closing mobile menu by tapping outside
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        function toggleMobileMenu() {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            overlay.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        function closeMobileMenu() {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        navToggle.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);
    }

    // — Smooth scroll on nav click —
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 2;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
            // Close mobile menu
            navToggle?.classList.remove('active');
            navLinks?.classList.remove('open');
            document.querySelector('.nav-overlay')?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // — Sliding pill indicator —
    function moveIndicator(el) {
        if (!indicator || !el) return;
        const pill = el.closest('.nav-pill') || el.closest('.nav-links');
        if (!pill) return;
        const pillRect = pill.getBoundingClientRect();
        const linkRect = el.getBoundingClientRect();
        indicator.style.width  = linkRect.width + 'px';
        indicator.style.left   = (linkRect.left - pillRect.left) + 'px';
    }

    // Position indicator on the active link on load
    function initIndicator() {
        const active = document.querySelector('.nav-link.active');
        if (active && window.innerWidth > 768) moveIndicator(active);
    }
    window.addEventListener('load', initIndicator);
    window.addEventListener('resize', initIndicator);

    // — Active link on scroll —
    function updateActiveNav() {
        const scrollY = window.scrollY + navbar.offsetHeight + 120;

        let currentId = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                currentId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });

        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink && window.innerWidth > 768) moveIndicator(activeLink);
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ==================== SCROLL ANIMATIONS ==================== */
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

    /* ==================== COUNT-UP ==================== */
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 1800;
                const start = performance.now();

                function tick(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    el.textContent = Math.round(target * ease);
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

    /* ==================== TYPING EFFECT ==================== */
    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        const phrases = [
            'Software Engineer',
            'AI & ML Engineer',
            'Fullstack Developer'
        ];
        let phraseIdx = 0, charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const current = phrases[phraseIdx];

            if (!isDeleting) {
                typedEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(typeLoop, 2000);
                    return;
                }
                setTimeout(typeLoop, 60);
            } else {
                typedEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(typeLoop, 400);
                    return;
                }
                setTimeout(typeLoop, 30);
            }
        }
        setTimeout(typeLoop, 800);
    }

    /* ==================== PARTICLES ==================== */
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        const count = 40;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            p.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-duration: ${Math.random() * 12 + 8}s;
                animation-delay: ${Math.random() * 6}s;
                opacity: ${Math.random() * 0.4 + 0.1};
            `;
            particleContainer.appendChild(p);
        }
    }

    /* ==================== CONTACT FORM ==================== */
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                form.reset();
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                btn.disabled = false;

                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 4000);
            }, 1500);
        });
    }

    /* ==================== SMOOTH SCROLL FOR ALL #LINKS ==================== */
    // Handle "View My Work" button and any other anchor links pointing to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip nav links (already handled above)
        if (anchor.classList.contains('nav-link')) return;

        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return; // external resume link
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();

// Rolling Name Animation — slot-machine style, cycles continuously through languages
(function() {
    const names = [
        { first: 'अनुराग', last: 'कुमार' },       // Hindi
        { first: 'অনুরাগ', last: 'কুমার' },        // Bengali
        { first: 'அனுராக்', last: 'குமார்' },       // Tamil
        { first: 'అనురాగ్', last: 'కుమార్' },       // Telugu
        { first: 'ਅਨੁਰਾਗ', last: 'ਕੁਮਾਰ' },        // Punjabi
        { first: 'ಅನುರಾಗ್', last: 'ಕುಮಾರ್' },      // Kannada
        { first: 'Анураг', last: 'Кумар' },         // Russian
        { first: 'アヌラグ', last: 'クマール' },       // Japanese
        { first: '阿努拉格', last: '库马尔' },         // Chinese
        { first: 'أنوراغ', last: 'كومار' },          // Arabic
        { first: 'Anurag', last: 'Kumar' }           // English
    ];

    const firstEl = document.getElementById('rolling-first');
    const lastEl = document.getElementById('rolling-last');
    if (!firstEl || !lastEl) return;

    // Style for vertical slide effect
    [firstEl, lastEl].forEach(function(el) {
        el.style.display = 'inline-block';
        el.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out, filter 0.35s ease-out';
        el.style.willChange = 'transform, opacity, filter';
    });

    let index = 0;

    function rollName() {
        var isEnglish = (index === names.length - 1);
        var holdTime = isEnglish ? 4000 : 1000;  // pause longer on English

        // Slide up and blur out
        firstEl.style.transform = 'translateY(-20px)';
        lastEl.style.transform = 'translateY(-20px)';
        firstEl.style.opacity = '0';
        lastEl.style.opacity = '0';
        firstEl.style.filter = 'blur(4px)';
        lastEl.style.filter = 'blur(4px)';

        setTimeout(function() {
            // Set new text, position below
            firstEl.textContent = names[index].first;
            lastEl.textContent = names[index].last;
            firstEl.style.transition = 'none';
            lastEl.style.transition = 'none';
            firstEl.style.transform = 'translateY(20px)';
            lastEl.style.transform = 'translateY(20px)';

            // Force reflow
            void firstEl.offsetWidth;

            // Slide into place
            var dur = isEnglish ? '0.6s' : '0.35s';
            var ease = isEnglish ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out';
            firstEl.style.transition = 'transform ' + dur + ' ' + ease + ', opacity ' + dur + ' ease-out, filter ' + dur + ' ease-out';
            lastEl.style.transition = 'transform ' + dur + ' ' + ease + ', opacity ' + dur + ' ease-out, filter ' + dur + ' ease-out';
            firstEl.style.transform = 'translateY(0)';
            lastEl.style.transform = 'translateY(0)';
            firstEl.style.opacity = '1';
            lastEl.style.opacity = '1';
            firstEl.style.filter = 'blur(0px)';
            lastEl.style.filter = 'blur(0px)';

            index = (index + 1) % names.length; // loop back to start
            setTimeout(rollName, holdTime);
        }, isEnglish ? 300 : 200);
    }

    // Start rolling after a short delay
    setTimeout(rollName, 600);
})();

// ==================== RESEARCH POPUP ====================
function openResearchPopup() {
    document.getElementById('researchOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeResearchPopup(e, force) {
    if (force || e.target === document.getElementById('researchOverlay')) {
        document.getElementById('researchOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchResearchTab(tab) {
    document.querySelectorAll('.research-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.research-tab[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.research-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tab}`).classList.add('active');
}

// Close popup on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('researchOverlay');
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        const certOverlay = document.getElementById('certOverlay');
        if (certOverlay && certOverlay.classList.contains('active')) {
            certOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        const sportsOverlay = document.getElementById('sportsOverlay');
        if (sportsOverlay && sportsOverlay.classList.contains('active')) {
            sportsOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ==================== SPORTS POPUP ====================
function openSportsPopup() {
    document.getElementById('sportsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSportsPopup(e, force) {
    if (force || e.target === document.getElementById('sportsOverlay')) {
        document.getElementById('sportsOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchSportsTab(tab) {
    const overlay = document.getElementById('sportsOverlay');
    overlay.querySelectorAll('.research-tab').forEach(t => t.classList.remove('active'));
    overlay.querySelector(`.research-tab[data-tab="${tab}"]`).classList.add('active');
    overlay.querySelectorAll('.research-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tab}`).classList.add('active');
}

// ==================== CERTIFICATIONS POPUP ====================
function openCertPopup() {
    document.getElementById('certOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertPopup(e, force) {
    if (force || e.target === document.getElementById('certOverlay')) {
        document.getElementById('certOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchCertTab(tab) {
    const overlay = document.getElementById('certOverlay');
    overlay.querySelectorAll('.research-tab').forEach(t => t.classList.remove('active'));
    overlay.querySelector(`.research-tab[data-tab="${tab}"]`).classList.add('active');
    overlay.querySelectorAll('.research-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tab}`).classList.add('active');
}

/* ==================== PAGE PRELOADER ==================== */
(function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    function hidePreloader() {
        preloader.classList.add('hidden');
        setTimeout(() => { preloader.style.display = 'none'; }, 900);
    }

    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 600);
    });

    // Fallback: hide after 3s max
    setTimeout(hidePreloader, 3000);
})();

/* ==================== SCROLL-TO-TOP BUTTON ==================== */
(function() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ==================== CURSOR GLOW FOLLOWER ==================== */
(function() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let mouseX = -500, mouseY = -500;
    let glowX = -500, glowY = -500;
    let active = false;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!active) {
            active = true;
            glow.classList.add('active');
        }
    });

    document.addEventListener('mouseleave', function() {
        active = false;
        glow.classList.remove('active');
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);
})();

/* ==================== PROJECT CARD 3D TILT ==================== */
(function() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.project-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var cx = rect.width / 2;
            var cy = rect.height / 2;
            var rotateX = ((y - cy) / cy) * -4;
            var rotateY = ((x - cx) / cx) * 4;

            card.style.transform =
                'translateY(-8px) scale(1.02) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
})();
