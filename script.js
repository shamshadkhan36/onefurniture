/**
 * One Furniture - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && closeMenu && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });

        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeMenu.addEventListener('click', closeMobileMenu);

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Trigger point offset

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Initial check on load
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    /* --- Smooth Scrolling for Anchor Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                // Get offset taking navbar height into account
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- Dynamic Copyright Year --- */
    const updateYear = () => {
        const currentYear = new Date().getFullYear();
        const yearElement = document.querySelector('.footer-bottom p');
        if (yearElement) {
            yearElement.innerHTML = `&copy; ${currentYear} One Furniture. All Rights Reserved.`;
        }
    };

    // updateYear();
});
