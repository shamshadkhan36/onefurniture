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
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        // Smooth scroll to contact section
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Auto-select BHK / service type in the contact form if contactBHK exists
        const contactBhkSelect = document.getElementById('contactBHK');
        if (contactBhkSelect && bhkValue) {
            if (bhkValue.includes('1 BHK')) {
                contactBhkSelect.value = '1 BHK';
            } else if (bhkValue.includes('2 BHK')) {
                contactBhkSelect.value = '2 BHK';
            } else if (bhkValue.includes('3 BHK')) {
                contactBhkSelect.value = '3 BHK';
            } else if (bhkValue.includes('4 BHK')) {
                contactBhkSelect.value = '4 BHK';
            } else if (bhkValue.includes('Villa') || bhkValue.includes('Full Home')) {
                contactBhkSelect.value = 'Villa / Custom';
            }
        }
        return;

        // Access configurator elements and configure them based on bhkValue
        const projectTypeCards = document.querySelectorAll('.config-card[data-group="project-type"]');
        const roomCards = document.querySelectorAll('.room-checkbox-card');
        const configAreaSlider = document.getElementById('configAreaSlider');
        const configAreaNum = document.getElementById('configAreaNum');
        
        if (bhkValue) {
            // Uncheck all room cards first
            roomCards.forEach(c => c.classList.remove('checked'));
            let selectedRooms = [];
            let projectType = 'Turnkey';
            let sqft = 1000;

            if (bhkValue.includes('Kitchen')) {
                projectType = 'Turnkey';
                selectedRooms = ['Kitchen'];
                sqft = 250;
            } else if (bhkValue.includes('Wardrobe')) {
                projectType = 'Furniture';
                selectedRooms = ['Bedroom 1'];
                sqft = 200;
            } else if (bhkValue.includes('1 BHK')) {
                projectType = 'Turnkey';
                selectedRooms = ['Kitchen', 'Living Room/Hall', 'Bedroom 1'];
                sqft = 600;
            } else if (bhkValue.includes('2 BHK')) {
                projectType = 'Turnkey';
                selectedRooms = ['Kitchen', 'Living Room/Hall', 'Bedroom 1', 'Bedroom 2', 'Bathroom'];
                sqft = 1000;
            } else if (bhkValue.includes('3 BHK')) {
                projectType = 'Turnkey';
                selectedRooms = ['Kitchen', 'Living Room/Hall', 'Bedroom 1', 'Bedroom 2', 'Bathroom', 'Balcony'];
                sqft = 1500;
            } else if (bhkValue.includes('4 BHK') || bhkValue.includes('Full Home') || bhkValue.includes('Villa')) {
                projectType = 'Turnkey';
                selectedRooms = ['Kitchen', 'Living Room/Hall', 'Bedroom 1', 'Bedroom 2', 'Bathroom', 'Balcony', 'Other'];
                sqft = 2000;
            }

            // Update project type selection
            projectTypeCards.forEach(card => {
                if (card.getAttribute('data-value') === projectType) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });

            // Update rooms checkbox elements
            roomCards.forEach(card => {
                const roomVal = card.getAttribute('data-value');
                if (selectedRooms.includes(roomVal)) {
                    card.classList.add('checked');
                }
            });

            // Update area
            if (configAreaSlider && configAreaNum) {
                configAreaSlider.value = sqft;
                configAreaNum.value = sqft;
            }

            // Select active presets tag
            document.querySelectorAll('.area-preset-btn').forEach(btn => {
                const presetSqft = parseInt(btn.getAttribute('data-sqft'));
                if (presetSqft === sqft) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Trigger configurator update if state sync function exists
            if (window.syncConfiguratorState) {
                window.syncConfiguratorState(projectType, selectedRooms, sqft);
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
    // 11. LIGHTBOX MODAL CONTROLLER
    // ==========================================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');

    function openLightbox(imgSrc) {
        if (!lightboxModal || !lightboxImage) return;
        lightboxImage.src = imgSrc;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Dynamic click delegation for zoom buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-large-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const src = btn.getAttribute('data-src');
            openLightbox(src);
        }
    });

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // ==========================================
    // 12. INTERIOR CONFIGURATOR SYSTEM LOGIC
    // ==========================================
    const configForm = document.getElementById('configuratorSystemForm');
    if (configForm) {
        // State variables
        let configState = {
            projectType: 'Turnkey', // default selected
            budgetGrade: 'Standard', // Standard, Affordable, Premium
            designStyle: 'Modern',
            rooms: ['Kitchen', 'Living Room/Hall', 'Bedroom 1'], // default checked
            area: 679, // default sqft
            italianMarble: false,
            fullName: '',
            phone: '',
            city: '',
            pincode: '',
            currentStep: 1
        };

        const totalSteps = 6;
        
        // Element bindings
        const stepElements = document.querySelectorAll('.config-step');
        const fillBar = document.getElementById('configProgressBarFill');
        const activeStepText = document.getElementById('configActiveStepText');
        const stepTitleText = document.getElementById('configStepTitleText');
        
        const btnPrev = document.getElementById('configBtnPrev');
        const btnNext = document.getElementById('configBtnNext');
        const btnSubmit = document.getElementById('configBtnSubmit');
        const sideWhatsappBtn = document.getElementById('configSideWhatsappBtn');
        
        // Live Summary Panel updates elements
        const summaryProjectType = document.getElementById('summaryProjectType');
        const summaryBudgetGrade = document.getElementById('summaryBudgetGrade');
        const summaryDesignStyle = document.getElementById('summaryDesignStyle');
        const summaryRoomsSelected = document.getElementById('summaryRoomsSelected');
        const summaryAreaVal = document.getElementById('summaryAreaVal');
        const summaryTimeline = document.getElementById('summaryTimeline');
        const summaryMLCost = document.getElementById('summaryMLCost');
        const summaryFeesCost = document.getElementById('summaryFeesCost');
        const configCostVal = document.getElementById('configCostVal');
        
        const configAreaSlider = document.getElementById('configAreaSlider');
        const configAreaNum = document.getElementById('configAreaNum');
        const marbleUpgradeCheckbox = document.getElementById('marbleUpgradeCheckbox');
        const marbleAddonBox = document.getElementById('marbleAddonBox');
        
        const dynamicSpecsGrid = document.getElementById('dynamicSpecsGrid');
        
        const specsCollapseHeader = document.getElementById('specsCollapseHeader');
        const specsCollapseContent = document.getElementById('specsCollapseContent');
        const specsChevronIcon = document.getElementById('specsChevronIcon');

        // Material specification templates (drawn from Sheet 2 of Excel)
        const specifications = {
            Standard: [
                { category: 'Flooring', val: 'Vitrified tiles (2x2, 2x4) max Rs.40/sqft' },
                { category: 'Wall Paint', val: 'Cement Putty + Tractor Emulsion (Semi Plastic Paint)' },
                { category: 'False Ceiling', val: 'Gypsum Corner Design (Less Surface Area)' },
                { category: 'Electrical', val: 'Normal panel & cab lights, White switches. Polycab/Havells wires' },
                { category: 'Master Wall', val: 'Wallpaper, Texture, or Wall Moulding' },
                { category: 'Cabinet Core', val: 'MR Grade Ply' },
                { category: 'Cabinet Finish', val: 'Laminate finish' },
                { category: 'Hardware/Fittings', val: 'Ozone / Ebco branded normal hardware' },
                { category: 'TV Unit', val: 'MR Grade Ply + Laminate (No Back Panel)' },
                { category: 'Doors & Locks', val: 'Hollow/Cellular Core + Laminate with normal branded locks' },
                { category: 'Kitchen Counter', val: 'Granite Top (Rs.100/sqft) with MR Grade core' },
                { category: 'Bathroom Work', val: '2x2 flooring/wall tiles, single piece WC, pedestal wash basin' },
                { category: 'Railing', val: 'Mild Steel (M.S) Railing' }
            ],
            Affordable: [
                { category: 'Flooring', val: 'Vitrified tiles (2x4, 2.5x5) max Rs.60/sqft' },
                { category: 'Wall Paint', val: 'Acrylic Putty + Premium Emulsion Royal paint' },
                { category: 'False Ceiling', val: 'POP complete ceiling design with less coves' },
                { category: 'Electrical', val: 'Profile Light + color switches. Polycab/Havells/Finolex/Kei wires' },
                { category: 'Master Wall', val: 'PVC, WPC, Charcoal, or UV panels' },
                { category: 'Cabinet Core', val: 'BWR (Boiling Water Resistant) Ply or HDHMR' },
                { category: 'Cabinet Finish', val: 'Polish Acrylic finish' },
                { category: 'Hardware/Fittings', val: 'Hettich / Godrej premium hardware' },
                { category: 'TV Unit', val: 'BWR/HDHMR + Acrylic (Semi Back Panel)' },
                { category: 'Doors & Locks', val: 'Solid Core Flush Doors + Laminate/Veneer with upgraded locks' },
                { category: 'Kitchen Counter', val: 'Granite/Tiles top (Rs.120-150/sqft) with BWR/HDHMR core' },
                { category: 'Bathroom Work', val: '2x2 floor/2x4 wall tiles, wall mounted WC, counter-top basin' },
                { category: 'Railing', val: 'Stainless Steel (S.S. 304) Railing' }
            ],
            Premium: [
                { category: 'Flooring', val: 'Vitrified tiles (2.5x5, 4x4, 4x6) max Rs.80/sqft' },
                { category: 'Wall Paint', val: 'POP Punning + Royal Aspire high-end paint' },
                { category: 'False Ceiling', val: 'POP multi-layer complete luxury ceiling' },
                { category: 'Electrical', val: 'Track & Linear Lights, Designer switches. Premium wiring' },
                { category: 'Master Wall', val: 'Luxury Wooden Panelling' },
                { category: 'Cabinet Core', val: 'BWP (Boiling Water Proof) Marine Ply' },
                { category: 'Cabinet Finish', val: 'Duco or PU Paint finish' },
                { category: 'Hardware/Fittings', val: 'Häfele / Blum premium high-end fittings' },
                { category: 'TV Unit', val: 'BWP Marine + Duco/PU (Full Back Panel & elements)' },
                { category: 'Doors & Locks', val: 'Solid Core Panel Door + Veneer/Deco/PU with Smart Lock' },
                { category: 'Kitchen Counter', val: 'Quartz top (Rs.200-250/sqft) with BWP core & Häfele/Blum' },
                { category: 'Bathroom Work', val: '4x2 luxury tiles, wall mounted WC, vanity, BWP wood work' },
                { category: 'Railing', val: 'Glass Railing (1200/Rft)' }
            ]
        };

        const stepTitles = [
            "Project Type",
            "Budget Range",
            "Design Style",
            "Select Rooms",
            "Flat Area",
            "Contact Details"
        ];

        // Step Navigation Logic
        function updateStepView() {
            // Show current step block, hide others
            stepElements.forEach(stepEl => {
                const stepNum = parseInt(stepEl.getAttribute('data-step'));
                if (stepNum === configState.currentStep) {
                    stepEl.classList.add('active');
                } else {
                    stepEl.classList.remove('active');
                }
            });

            // Update progress fill
            const fillPercent = ((configState.currentStep) / totalSteps) * 100;
            fillBar.style.width = `${fillPercent}%`;
            activeStepText.textContent = configState.currentStep;
            stepTitleText.textContent = stepTitles[configState.currentStep - 1];

            // Adjust navigation buttons
            if (configState.currentStep === 1) {
                btnPrev.style.display = 'none';
                btnNext.style.display = 'inline-flex';
                btnSubmit.style.display = 'none';
            } else if (configState.currentStep === totalSteps) {
                btnPrev.style.display = 'inline-flex';
                btnNext.style.display = 'none';
                btnSubmit.style.display = 'inline-flex';
            } else {
                btnPrev.style.display = 'inline-flex';
                btnNext.style.display = 'inline-flex';
                btnSubmit.style.display = 'none';
            }
        }

        btnNext.addEventListener('click', () => {
            if (validateStep(configState.currentStep)) {
                configState.currentStep++;
                updateStepView();
            }
        });

        btnPrev.addEventListener('click', () => {
            configState.currentStep--;
            updateStepView();
        });

        // Validation for each step
        function validateStep(stepNum) {
            if (stepNum === 4 && configState.rooms.length === 0) {
                alert('Please select at least one room.');
                return false;
            }
            if (stepNum === 5) {
                const areaVal = parseInt(configAreaNum.value);
                if (isNaN(areaVal) || areaVal < 200 || areaVal > 5000) {
                    alert('Please enter a valid flat area between 200 and 5000 SqFt.');
                    configAreaNum.focus();
                    return false;
                }
            }
            return true;
        }

        // Selection Cards click listeners (Steps 1, 2, 3)
        const selectCards = document.querySelectorAll('.config-card[data-group]');
        selectCards.forEach(card => {
            card.addEventListener('click', () => {
                const group = card.getAttribute('data-group');
                const val = card.getAttribute('data-value');
                
                // Unselect siblings
                document.querySelectorAll(`.config-card[data-group="${group}"]`).forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Select active card
                card.classList.add('selected');

                // Update state
                if (group === 'project-type') {
                    configState.projectType = val;
                } else if (group === 'budget-grade') {
                    configState.budgetGrade = val;
                } else if (group === 'design-style') {
                    configState.designStyle = val;
                }

                // Call recalculate
                recalculateEstimate();
            });
        });

        // Room selection checkboxes click listeners (Step 4)
        const roomCards = document.querySelectorAll('.room-checkbox-card');
        roomCards.forEach(card => {
            card.addEventListener('click', () => {
                const val = card.getAttribute('data-value');
                card.classList.toggle('checked');

                if (card.classList.contains('checked')) {
                    if (!configState.rooms.includes(val)) {
                        configState.rooms.push(val);
                    }
                } else {
                    configState.rooms = configState.rooms.filter(room => room !== val);
                }

                recalculateEstimate();
            });
        });

        // Area slider listeners (Step 5)
        configAreaSlider.addEventListener('input', (e) => {
            configAreaNum.value = e.target.value;
            configState.area = parseInt(e.target.value);
            
            // Remove active state on presets unless it matches
            document.querySelectorAll('.area-preset-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            recalculateEstimate();
        });

        configAreaNum.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val)) val = 679;
            if (val < 200) val = 200;
            if (val > 5000) val = 5000;
            
            e.target.value = val;
            configAreaSlider.value = val;
            configState.area = val;
            
            recalculateEstimate();
        });

        // Preset buttons trigger
        const presetBtns = document.querySelectorAll('.area-preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetSqft = parseInt(btn.getAttribute('data-sqft'));
                configAreaNum.value = targetSqft;
                configAreaSlider.value = targetSqft;
                configState.area = targetSqft;

                // Sync rooms based on preset rooms attribute
                const targetRoomsStr = btn.getAttribute('data-rooms');
                if (targetRoomsStr) {
                    const presetRooms = targetRoomsStr.split(',');
                    configState.rooms = [...presetRooms];
                    
                    // Update checkbox elements
                    roomCards.forEach(card => {
                        const roomVal = card.getAttribute('data-value');
                        if (presetRooms.includes(roomVal)) {
                            card.classList.add('checked');
                        } else {
                            card.classList.remove('checked');
                        }
                    });
                }

                recalculateEstimate();
            });
        });

        // Italian Marble upgrade trigger
        marbleUpgradeCheckbox.addEventListener('change', (e) => {
            configState.italianMarble = e.target.checked;
            recalculateEstimate();
        });

        // Specs Collapsible Box
        if (specsCollapseHeader) {
            specsCollapseHeader.addEventListener('click', () => {
                const isOpen = specsCollapseContent.style.maxHeight !== '0px' && specsCollapseContent.style.maxHeight !== '';
                if (isOpen) {
                    specsCollapseContent.style.maxHeight = '0px';
                    specsChevronIcon.style.transform = 'rotate(0deg)';
                } else {
                    specsCollapseContent.style.maxHeight = specsCollapseContent.scrollHeight + 'px';
                    specsChevronIcon.style.transform = 'rotate(180deg)';
                }
            });
            
            // Set initial height as collapsed or auto-adjusted
            specsCollapseContent.style.maxHeight = '0px';
            specsCollapseContent.style.overflow = 'hidden';
            specsCollapseContent.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
            specsChevronIcon.style.transition = 'transform 0.3s ease';
        }

        // Global Sync function for external triggers
        window.syncConfiguratorState = function(projectType, selectedRooms, sqft) {
            configState.projectType = projectType;
            configState.rooms = [...selectedRooms];
            configState.area = sqft;
            
            // Sync step navigation back to Step 2 to encourage budget/aesthetic selection
            configState.currentStep = 2;
            updateStepView();
            recalculateEstimate();
        };

        // Real-Time Cost Calculation & Summary updates
        function recalculateEstimate() {
            // 1. Show/hide Marble addon based on budgetGrade (Premium only)
            if (configState.budgetGrade === 'Premium') {
                marbleAddonBox.style.display = 'flex';
            } else {
                marbleAddonBox.style.display = 'none';
                configState.italianMarble = false;
                marbleUpgradeCheckbox.checked = false;
            }

            // 2. Base Rates from Excel
            let mlRate = 1500;
            let feeRate = 200;

            if (configState.budgetGrade === 'Standard') {
                mlRate = 1500;
                feeRate = 200;
            } else if (configState.budgetGrade === 'Affordable') {
                mlRate = 2000;
                feeRate = 275;
            } else if (configState.budgetGrade === 'Premium') {
                mlRate = 2500;
                feeRate = 350;
                // Add Italian marble cost if checked
                if (configState.italianMarble) {
                    mlRate += 400; // adds 400 per sqft to material & labor
                }
            }

            const area = configState.area;
            const mlCost = area * mlRate;
            const feeCost = area * feeRate;
            const totalCost = mlCost + feeCost;

            // Format numbers to Indian Currency Standard (e.g. 11,54,300)
            function formatIndianNumber(num) {
                let s = num.toString();
                let lastThree = s.slice(-3);
                let otherBits = s.slice(0, -3);
                if (otherBits !== '') {
                    lastThree = ',' + lastThree;
                }
                let res = otherBits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                return res;
            }

            // Update calculations in Summary Panel
            summaryMLCost.textContent = formatIndianNumber(mlCost);
            summaryFeesCost.textContent = formatIndianNumber(feeCost);
            configCostVal.textContent = formatIndianNumber(totalCost);

            // 3. Update Text Details in Summary
            summaryProjectType.textContent = configState.projectType + " Project";
            
            let gradeLabel = 'Essential (A3-RS)';
            if (configState.budgetGrade === 'Affordable') gradeLabel = 'Premium (A2-RS)';
            else if (configState.budgetGrade === 'Premium') gradeLabel = 'Luxe (A1-RS)';
            summaryBudgetGrade.textContent = gradeLabel;

            summaryDesignStyle.textContent = configState.designStyle + " Style";
            summaryRoomsSelected.textContent = configState.rooms.join(', ');
            summaryAreaVal.textContent = area;

            // 4. Timeline
            if (configState.projectType === 'Furniture') {
                summaryTimeline.textContent = "15 - 25 Days";
            } else {
                summaryTimeline.textContent = "45 - 60 Days";
            }

            // 5. Dynamic Material Specification Sheet Update
            const activeSpecs = specifications[configState.budgetGrade];
            let specsHtml = '';
            activeSpecs.forEach(spec => {
                specsHtml += `
                    <div class="spec-compact-row">
                        <span class="spec-compact-label">${spec.category}:</span>
                        <span class="spec-compact-val">${spec.val}</span>
                    </div>
                `;
            });
            dynamicSpecsGrid.innerHTML = specsHtml;
            
            // Keep collapsible size aligned if open
            const isSpecsOpen = specsCollapseContent.style.maxHeight !== '0px' && specsCollapseContent.style.maxHeight !== '';
            if (isSpecsOpen) {
                specsCollapseContent.style.maxHeight = specsCollapseContent.scrollHeight + 'px';
            }
        }

        // Form Submit triggers WhatsApp message builder
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Read contact inputs
            configState.fullName = document.getElementById('configFullName').value.trim();
            configState.phone = document.getElementById('configPhone').value.trim();
            configState.city = document.getElementById('configCity').value.trim();
            configState.pincode = document.getElementById('configPincode').value.trim();

            triggerConfiguratorWhatsApp(configState);
        });

        // Right side WhatsApp CTA button click
        sideWhatsappBtn.addEventListener('click', () => {
            // If on the final step, submit form. If on earlier step, jump to step 6 (Contact details) to gather info first!
            if (configState.currentStep === 6) {
                if (configForm.checkValidity()) {
                    configForm.dispatchEvent(new Event('submit'));
                } else {
                    configForm.reportValidity();
                }
            } else {
                configState.currentStep = 6;
                updateStepView();
                document.getElementById('configFullName').focus();
            }
        });

        // Trigger WhatsApp with configuration data
        function triggerConfiguratorWhatsApp(state) {
            // Calculate costs for text summary
            let mlRate = 1500;
            let feeRate = 200;

            if (state.budgetGrade === 'Standard') {
                mlRate = 1500;
                feeRate = 200;
            } else if (state.budgetGrade === 'Affordable') {
                mlRate = 2000;
                feeRate = 275;
            } else if (state.budgetGrade === 'Premium') {
                mlRate = 2500;
                feeRate = 350;
                if (state.italianMarble) mlRate += 400;
            }

            const mlCost = state.area * mlRate;
            const feeCost = state.area * feeRate;
            const totalCost = mlCost + feeCost;

            function formatCurrencyText(num) {
                return num.toLocaleString('en-IN');
            }

            const timelineStr = (state.projectType === 'Furniture') ? "15-25 Days" : "45-60 Days";
            const gradeName = (state.budgetGrade === 'Standard') ? 'Essential (A3-RS)' : (state.budgetGrade === 'Affordable') ? 'Premium (A2-RS)' : 'Luxe (A1-RS)';

            // Build whatsapp text
            let fullMsg = `*NEW INTERIOR CONFIGURATION ESTIMATE*\n`;
            fullMsg += `*The One Furniture & Interior Solutions*\n\n`;
            fullMsg += `Hi 👋 I've configured my home interior requirements on the website.\n\n`;
            
            fullMsg += `*MY CONFIGURATION:*\n`;
            fullMsg += `- Project Type: ${state.projectType} Project\n`;
            fullMsg += `- Budget Grade: ${gradeName} (₹${(mlRate - (state.italianMarble ? 400 : 0)) + feeRate}/sqft)\n`;
            fullMsg += `- Design Style: ${state.designStyle} Style\n`;
            fullMsg += `- Rooms Selected: ${state.rooms.join(', ')}\n`;
            fullMsg += `- Carpet Area: ${state.area} SqFt\n`;
            fullMsg += `- Italian Marble Flooring: ${state.italianMarble ? 'Yes (+₹400/sqft)' : 'No'}\n\n`;
            
            fullMsg += `*ESTIMATED COST BREAKDOWN:*\n`;
            fullMsg += `- Material & Labour: ₹${formatCurrencyText(mlCost)}\n`;
            fullMsg += `- Designer's Fees: ₹${formatCurrencyText(feeCost)}\n`;
            fullMsg += `*TOTAL PROJECT ESTIMATE: ₹${formatCurrencyText(totalCost)}*\n`;
            fullMsg += `- Delivery Timeline: ${timelineStr}\n\n`;
            
            fullMsg += `*CLIENT INFORMATION:*\n`;
            fullMsg += `- Name: ${state.fullName}\n`;
            fullMsg += `- Phone: ${state.phone}\n`;
            fullMsg += `- Location: ${state.city}`;
            if (state.pincode) {
                fullMsg += ` (Pincode: ${state.pincode})`;
            }
            fullMsg += `\n\n`;
            
            fullMsg += `---\n`;
            fullMsg += `Please guide me step-by-step for design and project execution. Thank you!`;

            const encodedText = encodeURIComponent(fullMsg);
            const whatsappNumber = '919309558584';
            const url = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
            window.open(url, '_blank');
        }

        // Initialize estimates on load
        recalculateEstimate();
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

});

