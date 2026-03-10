/* ============================================================
   INK MASTER — app.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. SPLASH SCREEN
    // ============================================================
    const splash = document.getElementById('splash-screen');
    if (splash) {
        // Wait for bar animation to finish (approx 2.2s total)
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 950);
        }, 2200);
    }


    // ============================================================
    // 2. NAVBAR — scroll class
    // ============================================================
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (window.scrollY > 60) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();


    // ============================================================
    // 3. HAMBURGER / MOBILE MENU
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu?.classList.toggle('open');
        document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu?.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ============================================================
    // 4. HERO PARALLAX (subtle)
    // ============================================================
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }


    // ============================================================
    // 5. GALLERY FILTERS
    // ============================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            masonryItems.forEach((item, i) => {
                const matches = filterValue === 'all' || item.getAttribute('data-categoria') === filterValue;
                if (matches) {
                    item.classList.remove('hide');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, i * 60 + 30);
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });


    // ============================================================
    // 6. LIGHTBOX
    // ============================================================
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn    = document.querySelector('.close-lightbox');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.masonry-item img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn?.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', e => {
            if (!e.target.closest('.lightbox-inner')) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeLightbox();
        });
    }


    // ============================================================
    // 7. FAQ ACCORDION
    // ============================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            // Toggle current
            if (!isOpen) item.classList.add('active');
        });
    });


    // ============================================================
    // 8. WHATSAPP FORM
    // ============================================================
    const tattooForm = document.getElementById('tattoo-form');

    if (tattooForm) {
        tattooForm.addEventListener('submit', e => {
            e.preventDefault();

            const nombre = document.getElementById('nombre')?.value.trim();
            const idea   = document.getElementById('idea')?.value.trim();
            const zona   = document.getElementById('zona')?.value.trim();
            const tamano = document.getElementById('tamano')?.value.trim();

            if (!nombre || !idea || !zona || !tamano) return;

            const telefono = '573205578471';
            const mensaje =
                `🔥 *NUEVA COTIZACIÓN — INK MASTER* 🔥%0A%0A` +
                `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
                `💡 *Idea:* ${encodeURIComponent(idea)}%0A` +
                `📍 *Zona:* ${encodeURIComponent(zona)}%0A` +
                `📏 *Tamaño:* ${encodeURIComponent(tamano)} cm%0A%0A` +
                `_Enviado desde Ink Master PWA_`;

            window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
        });
    }


    // ============================================================
    // 9. REVEAL ON SCROLL (IntersectionObserver)
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-child');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything
        revealElements.forEach(el => el.classList.add('visible'));
    }


    // ============================================================
    // 10. CUSTOM CURSOR (desktop/fine pointer only)
    // ============================================================
    const cursor     = document.getElementById('cursor');
    const cursorDot  = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');

    // Hide cursor completely on touch devices
    if (cursor && window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
    }

    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;
        let animId;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Dot follows instantly
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Ring lags behind (smooth follow)
        const animRing = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            if (cursorRing) {
                cursorRing.style.transform = `translate(${ringX - mouseX}px, ${ringY - mouseY}px)`;
            }
            animId = requestAnimationFrame(animRing);
        };
        animRing();

        // Hover state
        const hoverEls = document.querySelectorAll('a, button, .masonry-item, .faq-question, .filter-btn, .ig-item');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
    }

}); // end DOMContentLoaded


// ============================================================
// 11. SERVICE WORKER (PWA)
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg  => console.log('✅ SW registrado:', reg.scope))
            .catch(err => console.warn('❌ SW error:', err));
    });
}
