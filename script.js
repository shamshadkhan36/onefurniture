/**
 * One Furniture — Main JavaScript
 * Theme: TheOneDesign.co Minimalist Style
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       NAVBAR SCROLL EFFECT
       ============================================= */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });


    /* =============================================
       FULLSCREEN OVERLAY MENU
       ============================================= */
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const openMenu = () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });


    /* =============================================
       SCROLL REVEAL ANIMATIONS
       ============================================= */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // fire once
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    /* =============================================
       SCROLL INDICATOR
       ============================================= */
    const scrollIndicator = document.getElementById('scrollIndicator');

    if (scrollIndicator) {
        // Click scrolls back to top
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        scrollIndicator.style.cursor = 'pointer';

        // Hide when at the very top
        window.addEventListener('scroll', () => {
            if (window.scrollY < 300) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });

        // Initial state
        scrollIndicator.classList.add('hidden');
    }


    /* =============================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const offsetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: offsetPos, behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });


    /* =============================================
       DYNAMIC COPYRIGHT YEAR
       ============================================= */
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.innerHTML = `&copy; ${new Date().getFullYear()} The One Interior. All Rights Reserved.`;
    }


    /* =============================================
       FAQ ACCORDION
       ============================================= */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Close all other open items
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle the clicked one
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* =============================================
       MATERIALS TABLE ACCORDION
       ============================================= */
    document.querySelectorAll('.mat-row-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.mat-row-group');
            const isOpen = group.classList.contains('open');

            document.querySelectorAll('.mat-row-group.open').forEach(g => g.classList.remove('open'));

            if (!isOpen) group.classList.add('open');
        });
    });

});

