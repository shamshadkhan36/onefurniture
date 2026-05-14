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

    /* =============================================
       START ESTIMATOR BUTTON
       ============================================= */
    const startEstimatorBtn = document.getElementById('startEstimatorBtn');
    const configuratorContainer = document.getElementById('configuratorContainer');
    const heroContent = document.getElementById('heroContent');

    if (startEstimatorBtn && configuratorContainer) {
        startEstimatorBtn.addEventListener('click', () => {
            configuratorContainer.style.display = 'block';
            startEstimatorBtn.style.display = 'none';
            if (heroContent) heroContent.style.display = 'none';
        });
    }

});



/* ===================== CONFIGURATOR APP LOGIC ===================== */

const userConfig = {
    type: '',
    budget: '',
    rate: 0,
    fee: 0,
    style: '',
    rooms: '',
    area: 0
};

let currentStep = 1;
const totalSteps = 6;

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('config-progress').style.width = progress + '%';
}

function showStep(step) {
    document.querySelectorAll('.config-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step-' + step).classList.add('active');
    currentStep = step;
    updateProgress();
}

function nextStep(step) {
    showStep(step + 1);
}

function selectConfig(key, value, step, el) {
    userConfig[key] = value;
    
    // Handle specific budget logic
    if (key === 'budget' && el) {
        userConfig.rate = parseInt(el.getAttribute('data-rate'));
        userConfig.fee = parseInt(el.getAttribute('data-fee'));
    }

    let targetEl = el;
    if (!targetEl && typeof event !== 'undefined') {
        targetEl = event.target;
        while (targetEl && !targetEl.classList.contains('option-card') && targetEl !== document.body) {
            targetEl = targetEl.parentElement;
        }
    }

    // Highlight selected card
    if (targetEl && targetEl.parentElement) {
        const siblings = targetEl.parentElement.children;
        for(let sibling of siblings) {
            sibling.classList.remove('selected');
        }
        targetEl.classList.add('selected');
    }

    // Automatically go to next step
    setTimeout(() => {
        nextStep(step);
    }, 400); // short delay for visual feedback
}



function calculateResult() {
    const areaInput = document.getElementById('area-input').value;
    if (!areaInput || areaInput < 100) {
        alert('Please enter a valid area starting from 100 SqFt.');
        return;
    }
    
    // Validate previous steps
    if (!userConfig.type || !userConfig.budget || !userConfig.style) {
        alert('Please complete all previous steps before generating an estimate.');
        showStep(1);
        return;
    }

    userConfig.area = parseInt(areaInput);
    
    document.getElementById('out-budget').innerText = userConfig.budget;

    showStep(6);
}

function sendWhatsApp() {
    const name = document.getElementById('cust-name').value.trim() || 'Valued Customer';
    const loc = document.getElementById('cust-loc').value.trim() || 'Not Provided';
    
    const message = `Hi 👋 Thank you for contacting The One Furniture\n\nWe have received your requirements ✨\n\nOur team will guide you step-by-step for:\n✅ Design\n✅ Material\n✅ Budget planning\n\nYour Selection:\nName: ${name}\n📍 Location: ${loc}\n📏 Area: ${userConfig.area} sqft (${userConfig.rooms})\nBudget Range: ${userConfig.budget}\nDesign Style: ${userConfig.style}\nProject Type: ${userConfig.type}\n\nYou will receive a detailed estimate shortly 📋\n\n🔥 "Clarity + Control + Convenience"\n\nYou will get connected shortly`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "+919309558584";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}
