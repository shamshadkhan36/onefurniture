/* ======================================================
   THE ONE FURNITURE — Premium Redesign JavaScript
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NAVBAR SCROLL EFFECT & MOBILE MENU
    // ==========================================
    const navbar = document.getElementById('mainNavbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Simple mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. HERO MULTI-STEP FORM LOGIC
    // ==========================================
    const form = document.getElementById('heroMultistepForm');
    const steps = document.querySelectorAll('.form-step');
    const dots = document.querySelectorAll('.step-dot');
    const progressLine = document.getElementById('stepProgress');
    const secureTag = document.getElementById('secureTag');
    const stepIndicator = document.getElementById('stepIndicator');
    const successView = document.getElementById('formSuccessView');
    const leadSummary = document.getElementById('leadSummary');

    // Input fields from markup
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const whatsappCheckbox = document.getElementById('whatsappUpdates');
    const cityInput = document.getElementById('formCity');
    const pincodeInput = document.getElementById('formPincode');
    const serviceSelect = document.getElementById('formServiceType');
    const budgetSelect = document.getElementById('formEstimatedBudget');
    const timelineSelect = document.getElementById('formPossessionTimeline');

    let currentStep = 1;
    let formData = {
        name: '',
        phone: '',
        whatsapp: true,
        city: '',
        pincode: '',
        serviceType: '',
        budgetRange: '',
        timeline: ''
    };

    // Step 1: Next Action
    document.getElementById('btnNext1').addEventListener('click', () => {
        if (validateStep1()) {
            formData.name = nameInput.value.trim();
            formData.phone = phoneInput.value.trim();
            formData.whatsapp = whatsappCheckbox.checked;
            goToStep(2);
        }
    });

    // Step 2: Actions
    document.getElementById('btnPrev2').addEventListener('click', () => goToStep(1));
    document.getElementById('btnNext2').addEventListener('click', () => {
        if (validateStep2()) {
            formData.city = cityInput.value.trim();
            formData.pincode = pincodeInput.value.trim();
            goToStep(3);
        }
    });

    // Step 3: Actions
    document.getElementById('btnPrev3').addEventListener('click', () => goToStep(2));
    document.getElementById('btnNext3').addEventListener('click', () => {
        if (validateStep3()) {
            formData.serviceType = serviceSelect.value;
            formData.budgetRange = budgetSelect.value;
            goToStep(4);
        }
    });

    // Step 4: Actions
    document.getElementById('btnPrev4').addEventListener('click', () => goToStep(3));

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep4()) {
            formData.timeline = timelineSelect.value;

            // Show Success View
            form.style.display = 'none';
            stepIndicator.style.display = 'none';
            secureTag.style.display = 'none';
            successView.style.display = 'block';

            // Fill Lead Summary Box
            leadSummary.innerHTML = `
                <div><strong>Name:</strong> ${formData.name}</div>
                <div><strong>Location:</strong> ${formData.city} (Pincode: ${formData.pincode})</div>
                <div><strong>Type of Service:</strong> ${formData.serviceType}</div>
                <div><strong>Possession Timeline:</strong> ${formData.timeline}</div>
            `;

            // Set up WhatsApp button action
            const whatsappBtn = document.getElementById('btnWhatsAppRedirect');
            whatsappBtn.addEventListener('click', () => {
                redirectToWhatsApp(formData);
            });
        }
    });

    // Step navigation transitions
    function goToStep(stepNum) {
        steps.forEach(step => step.classList.remove('active'));
        const targetStep = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        if (targetStep) targetStep.classList.add('active');

        // Update Dots
        dots.forEach(dot => {
            const dotStep = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'completed');
            if (dotStep === stepNum) {
                dot.classList.add('active');
            } else if (dotStep < stepNum) {
                dot.classList.add('completed');
            }
        });

        // Update Progress Bar
        const percent = ((stepNum - 1) / 3) * 100;
        progressLine.style.width = `${percent}%`;
        currentStep = stepNum;
    }

    // Step Validations
    function validateStep1() {
        const nameVal = nameInput.value.trim();
        const phoneVal = phoneInput.value.trim();

        if (nameVal.length < 2) {
            alert('Please enter your full name.');
            nameInput.focus();
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneVal)) {
            alert('Please enter a valid 10-digit mobile number.');
            phoneInput.focus();
            return false;
        }

        return true;
    }

    function validateStep2() {
        const cityVal = cityInput.value.trim();
        const pincodeVal = pincodeInput.value.trim();

        if (cityVal.length < 2) {
            alert('Please enter your city.');
            cityInput.focus();
            return false;
        }

        const pinRegex = /^[0-9]{6}$/;
        if (!pinRegex.test(pincodeVal)) {
            alert('Please enter a valid 6-digit pincode.');
            pincodeInput.focus();
            return false;
        }

        return true;
    }

    function validateStep3() {
        if (!serviceSelect.value) {
            alert('Please select a type of service.');
            serviceSelect.focus();
            return false;
        }
        if (!budgetSelect.value) {
            alert('Please select your estimated budget range.');
            budgetSelect.focus();
            return false;
        }
        return true;
    }

    // Validation for Step 4
    function validateStep4() {
        if (!timelineSelect.value) {
            alert('Please select your possession timeline.');
            timelineSelect.focus();
            return false;
        }
        return true;
    }

    // ==========================================
    // 3. WHATSAPP REDIRECTION BUILDER
    // ==========================================
    function redirectToWhatsApp(data) {
        let fullMessage = `*NEW INTERIOR ENQUIRY*\n`;
        fullMessage += `*The One Furniture & Interior Solutions*\n\n`;
        fullMessage += `Hi The One Furniture Team! I've filled out your enquiry form on the website and would love to connect for a detailed estimate.\n\n`;
        
        fullMessage += `*CLIENT INFORMATION*\n`;
        fullMessage += `- Name: ${data.name}\n`;
        if (data.phone && data.phone !== 'Shared on Chat') {
            fullMessage += `- Phone: ${data.phone}\n`;
        }
        fullMessage += `- Location: ${data.city}`;
        if (data.pincode && data.pincode !== 'N/A') {
            fullMessage += ` (Pincode: ${data.pincode})`;
        }
        fullMessage += `\n\n`;
        
        fullMessage += `*PROJECT DETAILS*\n`;
        fullMessage += `- Service Type: ${data.serviceType}\n`;
        fullMessage += `- Timeline/Scope: ${data.timeline}\n\n`;
        
        fullMessage += `---\n`;
        fullMessage += `Please share the estimate and guide me step-by-step for:\n`;
        fullMessage += `- Design Planning\n`;
        fullMessage += `- Material Specifications\n`;
        fullMessage += `- Budget Options\n\n`;
        fullMessage += `Thank you! I look forward to your reply.`;

        const encodedText = encodeURIComponent(fullMessage);
        const whatsappNumber = '919309558584';
        const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        window.open(url, '_blank');
    }

    // ==========================================
    // 4. CALCULATOR & PACKAGE BUTTONS SCROLLER
    // ==========================================
    // ==========================================
    // 10. ESTIMATOR FORM MODAL CONTROLLER
    // ==========================================
    const estimatorCard = document.getElementById('estimatorCard');
    const estimatorModal = document.getElementById('estimatorModal');
    const modalPlaceholder = document.getElementById('modalFormPlaceholder');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Create a hero placeholder so layout remains clean when card moves
    let heroPlaceholder = null;
    if (estimatorCard) {
        heroPlaceholder = document.createElement('div');
        heroPlaceholder.id = 'heroFormPlaceholder';
        heroPlaceholder.style.display = 'none';
        estimatorCard.parentNode.insertBefore(heroPlaceholder, estimatorCard);
    }
    
    let modalTimer = null;
    let modalHasOpened = false;

    function openEstimatorModal() {
        if (modalHasOpened || !estimatorCard || !estimatorModal || !modalPlaceholder) return;
        modalHasOpened = true;
        
        // Clear any auto-open timer
        if (modalTimer) clearTimeout(modalTimer);
        
        // Move the estimator card into the modal
        modalPlaceholder.appendChild(estimatorCard);
        estimatorModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // lock background scroll
    }
    
    function closeEstimatorModal() {
        if (!estimatorModal || !estimatorCard || !heroPlaceholder) return;
        estimatorModal.classList.remove('active');
        document.body.style.overflow = ''; // restore background scroll
        
        // Move the estimator card back to the hero grid
        heroPlaceholder.parentNode.insertBefore(estimatorCard, heroPlaceholder);
    }
    
    // Make open & close functions available globally for button triggers
    window.openEstimatorModal = openEstimatorModal;
    window.closeEstimatorModal = closeEstimatorModal;

    // Auto open after 5 seconds (5000ms)
    if (estimatorCard && estimatorModal) {
        modalTimer = setTimeout(openEstimatorModal, 5000);
        
        // Close modal button event
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeEstimatorModal);
        }
        
        // Close on clicking overlay outside the container
        estimatorModal.addEventListener('click', (e) => {
            if (e.target === estimatorModal) {
                closeEstimatorModal();
            }
        });
    }

    window.scrollToEstimator = function (bhkValue) {
        // Pre-select service type based on trigger configuration value
        if (serviceSelect) {
            if (bhkValue.includes('BHK') || bhkValue.includes('Villa') || bhkValue.includes('Full Home')) {
                serviceSelect.value = 'Full Home Interior';
            } else if (bhkValue.includes('Kitchen')) {
                serviceSelect.value = 'Modular Kitchen';
            } else if (bhkValue.includes('Wardrobe')) {
                serviceSelect.value = 'Wardrobe Design';
            } else {
                serviceSelect.value = 'Full Home Interior';
            }
            formData.serviceType = serviceSelect.value;
        }

        // Open modal or scroll
        if (estimatorModal && modalPlaceholder) {
            openEstimatorModal();
            setTimeout(() => {
                if (currentStep === 1) {
                    nameInput.focus();
                } else {
                    goToStep(3);
                }
            }, 500);
        } else {
            // Smooth scroll to estimator card fallback
            const targetElement = document.getElementById('estimatorCard');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Focus on input step to encourage completion
                setTimeout(() => {
                    if (currentStep === 1) {
                        nameInput.focus();
                    } else {
                        goToStep(3);
                    }
                }, 800);
            }
        }
    };

    // ==========================================
    // 5. FAQ ACCORDION INTERACTION
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.closest('.faq-item');
            const isOpen = faqItem.classList.contains('open');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = '';
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                faqItem.classList.add('open');
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });

    // ==========================================
    // 6. CONTACT PAGE FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactPageForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const contactName = document.getElementById('contactName').value.trim();
            const contactLocation = document.getElementById('contactLocation').value.trim();
            const contactBhk = document.getElementById('contactBHK').value;
            const contactStatus = document.getElementById('contactStatus').value;
            const contactScope = document.getElementById('contactScope').value.trim();

            if (!contactName || !contactLocation || !contactBhk || !contactStatus) {
                alert('Please fill out all required fields.');
                return;
            }

            const data = {
                name: contactName,
                phone: 'Shared on Chat',
                city: contactLocation,
                pincode: 'N/A',
                serviceType: contactBhk,
                budgetRange: 'TBD',
                timeline: `Status: ${contactStatus} | Scope: ${contactScope}`
            };

            redirectToWhatsApp(data);
        });
    }

    // ==========================================
    // 7. SCROLL-TRIGGERED REVEAL OBSERVER
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ==========================================
    // 8. DYNAMIC NUMBER COUNTER ANIMATION
    // ==========================================
    const statsSection = document.querySelector('.stats-section');
    const counterVals = document.querySelectorAll('.counter-val');
    
    if (statsSection && counterVals.length > 0) {
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        countObserver.observe(statsSection);
    }
    
    function animateCounters() {
        counterVals.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target'));
            const decimals = parseInt(el.getAttribute('data-decimals') || '0');
            const duration = 1500; // 1.5 seconds animation
            let startTime = null;
            
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                // Ease out quad
                const easeProgress = progress * (2 - progress);
                const value = easeProgress * target;
                
                el.textContent = value.toFixed(decimals);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target.toFixed(decimals);
                }
            }
            
            requestAnimationFrame(step);
        });
    }

    // ==========================================
    // 9. TOP SCROLL PROGRESS BAR
    // ==========================================
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / docHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ==========================================
    // 10. CATALOG FILTER LOGIC
    // ==========================================
    const tabBtns = document.querySelectorAll('.catalog-tab-btn');
    const catalogCards = document.querySelectorAll('.catalog-card');

    if (tabBtns.length > 0 && catalogCards.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                catalogCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

});
