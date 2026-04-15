// ================= DATOS DEL SLIDER =================
const slidesData = [
    {
        img: "assets/img-hero/hero-1.png",
        imgMobile: "assets/img-hero/hero-1-2.jpg",
        smallText: "¿Tus Clientes no te encuentran?",
        titleText: "Tu Negocio Necesita una Página web ",
        descText: "Creamos experiencias digitales que posicionan tu negocio y atraen clientes"
    },
    {
        img: "assets/img-hero/hero-2.png",
        imgMobile: "assets/img-hero/hero-2-2.jpg",
        smallText: "Servicios de diseño e impresión de tarjetas",
        titleText: "Tarjetas de Presentación de alta calidad",
        descText: "Diseñamos tarjetas de presentación que reflejan la identidad de tu marca. Materiales de alta calidad, una impresión que deja huella."
    },
    {
        img: "assets/img-hero/hero-3.png",
        imgMobile: "assets/img-hero/hero-3-2.jpg",
        smallText: "DISEÑO QUE CONECTA",
        titleText: "Diseños para Redes Sociales",
        descText: "Posts, stories y feeds con coherencia de marca. Atrae a tu audiencia con una estética profesional y estratégica."
    },
    {
        img: "assets/img-hero/hero-4.png",
        imgMobile: "assets/img-hero/hero-4-2.jpg",
        smallText: "Haz que tu negocio destaque desde el primer vistazo",
        titleText: "Diseño de identidad visual",
        descText: "Creamos papelería profesional alineada a tu marca para destacar y aumentar el valor percibido de tu negocio."
    },
    {
        img: "assets/img-hero/hero-5.png",
        imgMobile: "assets/img-hero/hero-5-2.jpg",
        smallText: "Impacto visual inmediato para tu marca.",
        titleText: "Brochures corporativos a medida.",
        descText: "Diseñamos brochures corporativos que proyectan profesionalismo, comunican con claridad y convierten clientes.",
    }
];

// Elementos DOM
const slidesContainer = document.getElementById('slidesContainer');
const smallTextEl = document.getElementById('heroSmallText');
const titleTextEl = document.getElementById('heroTitleText');
const descTextEl = document.getElementById('heroDescText');

let currentIndex = 0;
let slides = [];
let activeTimers = [];
let isCycleRunning = false;
let previousWidth = window.innerWidth;

// ================= AJUSTES DE TIEMPO =================
const DELAY_BEFORE_FIRST_BLOCK = 1000;
const TRANSITION_DURATION = 400;
const DISPLAY_TIME = 4000;
const PAUSE_AFTER_DISAPPEAR = 200;

// ================= FUNCIONES DEL SLIDER =================
function getImageForSlide(data) {
    return (window.innerWidth <= 768 && data.imgMobile) ? data.imgMobile : data.img;
}

function buildSlides() {
    slidesContainer.innerHTML = '';
    slidesData.forEach((data, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${idx === 0 ? 'active' : ''}`;
        const imgUrl = getImageForSlide(data);
        slideDiv.style.backgroundImage = `url('${imgUrl}')`;
        slidesContainer.appendChild(slideDiv);
    });
    slides = document.querySelectorAll('.slide');
}

function updateTexts(index) {
    const data = slidesData[index];
    smallTextEl.textContent = data.smallText;
    titleTextEl.innerHTML = data.titleText;
    descTextEl.textContent = data.descText;
}

function resetVisibility() {
    smallTextEl.classList.remove('visible');
    titleTextEl.classList.remove('visible');
    descTextEl.classList.remove('visible');
    void smallTextEl.offsetHeight;
}

function clearAllTimers() {
    activeTimers.forEach(timer => clearTimeout(timer));
    activeTimers = [];
}

function appearSequential(callback) {
    resetVisibility();
    const delayTimer = setTimeout(() => {
        smallTextEl.classList.add('visible');
        const timer1 = setTimeout(() => {
            titleTextEl.classList.add('visible');
            const timer2 = setTimeout(() => {
                descTextEl.classList.add('visible');
                const timer3 = setTimeout(() => {
                    callback();
                }, TRANSITION_DURATION);
                activeTimers.push(timer3);
            }, TRANSITION_DURATION);
            activeTimers.push(timer2);
        }, TRANSITION_DURATION);
        activeTimers.push(timer1);
    }, DELAY_BEFORE_FIRST_BLOCK);
    activeTimers.push(delayTimer);
}

function disappearSequential(callback) {
    descTextEl.classList.remove('visible');
    const timer1 = setTimeout(() => {
        titleTextEl.classList.remove('visible');
        const timer2 = setTimeout(() => {
            smallTextEl.classList.remove('visible');
            const timer3 = setTimeout(() => {
                callback();
            }, TRANSITION_DURATION);
            activeTimers.push(timer3);
        }, TRANSITION_DURATION);
        activeTimers.push(timer2);
    }, TRANSITION_DURATION);
    activeTimers.push(timer1);
}

function goToSlide(index) {
    if (index === currentIndex) return;
    clearAllTimers();
    isCycleRunning = false;
    slides.forEach((slide, i) => {
        if (i === index) slide.classList.add('active');
        else slide.classList.remove('active');
    });
    currentIndex = index;
    updateTexts(currentIndex);
    resetVisibility();
    startSlideCycle();
}

function startSlideCycle() {
    if (isCycleRunning) return;
    isCycleRunning = true;
    appearSequential(() => {
        const displayTimer = setTimeout(() => {
            disappearSequential(() => {
                const pauseTimer = setTimeout(() => {
                    const nextIndex = (currentIndex + 1) % slidesData.length;
                    goToSlide(nextIndex);
                }, PAUSE_AFTER_DISAPPEAR);
                activeTimers.push(pauseTimer);
            });
        }, DISPLAY_TIME);
        activeTimers.push(displayTimer);
    });
}

function refreshSlides() {
    clearAllTimers();
    isCycleRunning = false;
    const previousIndex = currentIndex;
    buildSlides();
    slides.forEach((slide, i) => {
        if (i === previousIndex) slide.classList.add('active');
        else slide.classList.remove('active');
    });
    currentIndex = previousIndex;
    updateTexts(currentIndex);
    resetVisibility();
    startSlideCycle();
}

let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const wasMobile = previousWidth <= 768;
        const isMobile = currentWidth <= 768;
        const hero = document.querySelector('.hero');
        if (hero) hero.style.height = `${window.innerHeight}px`;
        if (wasMobile !== isMobile) refreshSlides();
        previousWidth = currentWidth;
    }, 150);
}

function initSlider() {
    buildSlides();
    slides = document.querySelectorAll('.slide');
    currentIndex = 0;
    slides.forEach((slide, i) => {
        if (i === 0) slide.classList.add('active');
        else slide.classList.remove('active');
    });
    updateTexts(0);
    resetVisibility();
    startSlideCycle();
    const setHeroHeight = () => {
        const hero = document.querySelector('.hero');
        if (hero) hero.style.height = `${window.innerHeight}px`;
    };
    setHeroHeight();
    window.addEventListener('resize', handleResize);
}

// ================= MENÚ MÓVIL =================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    const allLinks = navLinks.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// ================= OBSERVADOR PARA SECCIÓN "POR QUÉ ELEGIRNOS" =================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.porque-titulo-main, .porque-titulo-sub, .porque-parrafo, .servicio-card, .porque-confianza');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.2 });
    animatedElements.forEach(el => observer.observe(el));
}

// ================= ESTADÍSTICAS: CONTEO Y ENTRADA =================
function animateNumber(element, target, suffix = '') {
    let current = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    const isDecimal = target % 1 !== 0;
    const updateNumber = () => {
        current += increment;
        if (current >= target) {
            element.innerHTML = target + (suffix ? `<span class="stat-suffix">${suffix}</span>` : '');
            return;
        }
        let displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
        element.innerHTML = displayValue + (suffix ? `<span class="stat-suffix">${suffix}</span>` : '');
        setTimeout(updateNumber, stepTime);
    };
    updateNumber();
}

function initStats() {
    const statsSection = document.querySelector('.stats-overlay');
    if (!statsSection) return;

    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length === 3) {
        statItems[0].setAttribute('data-direction', 'left');
        statItems[1].setAttribute('data-direction', 'right');
        statItems[2].setAttribute('data-direction', 'left');
    } else {
        statItems.forEach(item => item.setAttribute('data-direction', 'left'));
    }

    const timeouts = new Map();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const item = entry.target;
            if (entry.isIntersecting) {
                const numberElem = item.querySelector('.stat-number');
                if (numberElem && !numberElem.getAttribute('data-counted')) {
                    const timerId = setTimeout(() => {
                        item.classList.add('visible');
                        const target = parseFloat(item.getAttribute('data-target'));
                        const suffix = item.getAttribute('data-suffix') || '';
                        animateNumber(numberElem, target, suffix);
                        numberElem.setAttribute('data-counted', 'true');
                        timeouts.delete(item);
                    }, 500);
                    timeouts.set(item, timerId);
                }
            } else {
                if (timeouts.has(item)) {
                    clearTimeout(timeouts.get(item));
                    timeouts.delete(item);
                }
            }
        });
    }, { threshold: 0.2 });

    statItems.forEach(item => observer.observe(item));
}

// ================= TABS PARA SERVICIOS =================
function initServicesTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            btn.classList.add('active');
            const activePane = document.getElementById(`tab-${tabId}`);
            if (activePane) activePane.classList.add('active');
        });
    });
}

// ================= EFECTO DE OLA EN EL TÍTULO (servicios-tabs) =================
function initWaveTitle() {
    const title = document.querySelector('.servicios-tabs .section-title');
    if (!title) return;
    if (title.classList.contains('wave-title')) return;

    const text = title.innerText;
    title.innerHTML = '';
    title.classList.add('wave-title');

    const spans = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            title.appendChild(document.createTextNode(' '));
            spans.push(null);
        } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', i);
            title.appendChild(span);
            spans.push(span);
        }
    }

    const colorStops = [
        { pos: 0,   color: '#9b4dff' },
        { pos: 0.5, color: '#1e90ff' },
        { pos: 1,   color: '#2ecc71' }
    ];

    function interpolateColor(color1, color2, t) {
        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1,3), 16);
            const g = parseInt(hex.slice(3,5), 16);
            const b = parseInt(hex.slice(5,7), 16);
            return [r, g, b];
        };
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
        const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
        const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function getColorAtPosition(t) {
        if (t <= colorStops[0].pos) return colorStops[0].color;
        if (t >= colorStops[colorStops.length-1].pos) return colorStops[colorStops.length-1].color;
        for (let i = 0; i < colorStops.length - 1; i++) {
            const s = colorStops[i];
            const e = colorStops[i+1];
            if (t >= s.pos && t <= e.pos) {
                const r = (t - s.pos) / (e.pos - s.pos);
                return interpolateColor(s.color, e.color, r);
            }
        }
        return '#000000';
    }

    function applyContinuousGradient() {
        const totalWidth = Array.from(spans).reduce((sum, span) => sum + (span ? span.offsetWidth : 0), 0);
        if (totalWidth === 0) {
            setTimeout(applyContinuousGradient, 50);
            return;
        }
        let currentLeft = 0;
        spans.forEach(span => {
            if (!span) return;
            const charWidth = span.offsetWidth;
            const leftPos = currentLeft / totalWidth;
            const rightPos = (currentLeft + charWidth) / totalWidth;
            const leftColor = getColorAtPosition(leftPos);
            const rightColor = getColorAtPosition(rightPos);
            span.style.background = `linear-gradient(90deg, ${leftColor}, ${rightColor})`;
            span.style.webkitBackgroundClip = 'text';
            span.style.backgroundClip = 'text';
            span.style.color = 'transparent';
            currentLeft += charWidth;
        });
    }

    setTimeout(applyContinuousGradient, 20);
    window.addEventListener('resize', () => setTimeout(applyContinuousGradient, 100));

    const waveDuration = 0.6;
    const delayBetween = 0.12;

    function runWave() {
        spans.forEach(span => {
            if (span) {
                span.style.animation = 'none';
                void span.offsetHeight;
                span.style.animation = '';
            }
        });
        spans.forEach((span, idx) => {
            if (span) {
                span.style.animation = `wave ${waveDuration}s ease-in-out forwards`;
                span.style.animationDelay = `${idx * delayBetween}s`;
            }
        });
        const totalDuration = (spans.filter(s => s).length - 1) * delayBetween + waveDuration;
        setTimeout(runWave, totalDuration * 1000);
    }
    runWave();
}

// ================= RESPIRACIÓN EN IMÁGENES =================
function initBreathingImages() {
    const images = document.querySelectorAll('.service-image img');
    images.forEach(img => img.classList.add('breathing-image'));
}

// ================= SACUDIDA PERIÓDICA EN BOTONES (servicios) =================
function initShakeButtons() {
    const buttons = document.querySelectorAll('.btn-service');
    buttons.forEach(btn => {
        setInterval(() => {
            btn.classList.add('shake-button');
            setTimeout(() => {
                btn.classList.remove('shake-button');
            }, 500);
        }, 3500);
    });
}

// ================= TÍTULOS DINÁMICOS (typewriter) =================
function initDynamicTitles() {
    const containers = document.querySelectorAll('.dynamic-title-container');
    containers.forEach(container => {
        const options = Array.from(container.querySelectorAll('.title-option'));
        if (options.length < 2) return;

        options.forEach(opt => {
            if (!opt.getAttribute('data-original')) {
                opt.setAttribute('data-original', opt.textContent);
            }
        });

        let currentIndex = 0;
        let currentOption = options[currentIndex];
        let isDeleting = false;
        let loopTimeout = null;

        options.forEach(opt => opt.style.display = 'none');
        currentOption.style.display = 'inline-block';
        currentOption.textContent = '';

        function typeEffect() {
            const fullText = currentOption.getAttribute('data-original');
            if (!isDeleting) {
                const currentText = currentOption.textContent;
                if (currentText.length < fullText.length) {
                    currentOption.textContent = fullText.substring(0, currentText.length + 1);
                    loopTimeout = setTimeout(typeEffect, 80);
                } else {
                    isDeleting = true;
                    loopTimeout = setTimeout(typeEffect, 2000);
                }
            } else {
                const currentText = currentOption.textContent;
                if (currentText.length > 0) {
                    currentOption.textContent = currentText.substring(0, currentText.length - 1);
                    loopTimeout = setTimeout(typeEffect, 50);
                } else {
                    currentOption.style.display = 'none';
                    currentIndex = (currentIndex + 1) % options.length;
                    currentOption = options[currentIndex];
                    currentOption.style.display = 'inline-block';
                    currentOption.textContent = '';
                    isDeleting = false;
                    loopTimeout = setTimeout(typeEffect, 300);
                }
            }
        }
        typeEffect();
    });
}

// ================= ANIMACIÓN DE PLANES (scroll) =================
function initPlanesAnimation() {
    const planCards = document.querySelectorAll('.plan-card');
    if (!planCards.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.2 });
    planCards.forEach(card => observer.observe(card));
}

// ================= PESTAÑAS DE INVITACIONES =================
function initInvitacionesTabs() {
    const tabBtns = document.querySelectorAll('.invitacion-tab-btn');
    const tabPanes = document.querySelectorAll('.invitacion-tab-pane');
    if (!tabBtns.length) return;
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-inv-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            btn.classList.add('active');
            const activePane = document.getElementById(`inv-tab-${tabId}`);
            if (activePane) activePane.classList.add('active');
        });
    });
}

// ================= SACUDIDA PERIÓDICA EN BOTONES DE INVITACIONES =================
function initShakeInvitacionButtons() {
    const buttons = document.querySelectorAll('.btn-invitacion');
    buttons.forEach(btn => {
        setInterval(() => {
            btn.classList.add('shake-button-trigger');
            setTimeout(() => {
                btn.classList.remove('shake-button-trigger');
            }, 300);
        }, 2000);
    });
}

// ================= BOTÓN "IR ARRIBA" =================
function initScrollToTop() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ================= CARRUSEL INFINITO SUAVE =================
function initSmoothCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    let animationId = null;
    let currentPosition = 0;
    let totalWidth = 0;
    const speed = 1;

    function getTotalWidth() {
        const images = Array.from(track.children);
        const halfCount = images.length / 2;
        let width = 0;
        for (let i = 0; i < halfCount; i++) {
            const img = images[i];
            width += img.offsetWidth + parseFloat(getComputedStyle(img).marginLeft) + parseFloat(getComputedStyle(img).marginRight);
        }
        return width;
    }

    function animate() {
        if (totalWidth === 0) {
            totalWidth = getTotalWidth();
            if (totalWidth === 0) {
                animationId = requestAnimationFrame(animate);
                return;
            }
        }
        currentPosition += speed;
        if (currentPosition >= totalWidth) {
            currentPosition -= totalWidth;
        }
        track.style.transform = `translateX(-${currentPosition}px)`;
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        totalWidth = getTotalWidth();
        if (totalWidth === 0) {
            setTimeout(startAnimation, 200);
            return;
        }
        currentPosition = 0;
        track.style.transform = `translateX(0px)`;
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAnimation);
    } else {
        startAnimation();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newWidth = getTotalWidth();
            if (newWidth !== totalWidth && newWidth > 0) {
                totalWidth = newWidth;
                if (currentPosition >= totalWidth) currentPosition -= totalWidth;
                track.style.transform = `translateX(-${currentPosition}px)`;
            }
        }, 200);
    });
}

// ================= TESTIMONIOS CON GIRO ÚNICO =================
let testimonialsInitialized = false;

function initTestimonials() {
    if (testimonialsInitialized) return;
    testimonialsInitialized = true;

    const testimonials = [
        { name: "Ana García", company: "Estudio Creativo", comment: "Excelente servicio, el diseño superó mis expectativas. Muy profesionales y atentos a cada detalle.", photo: "https://randomuser.me/api/portraits/women/1.jpg" },
        { name: "Carlos Méndez", company: "Tech Solutions", comment: "La página web que desarrollaron ha aumentado nuestras ventas un 30%. Muy recomendados.", photo: "https://randomuser.me/api/portraits/men/2.jpg" },
        { name: "Laura Fernández", company: "Eventos Mágicos", comment: "Las invitaciones digitales fueron un éxito total. Nuestros invitados quedaron encantados.", photo: "https://randomuser.me/api/portraits/women/3.jpg" },
        { name: "Roberto Díaz", company: "Impresiones Rápidas", comment: "La impresión de tarjetas con acabados premium nos dio una imagen profesional increíble.", photo: "https://randomuser.me/api/portraits/men/4.jpg" },
        { name: "Patricia López", company: "Branding Lab", comment: "El equipo entiende realmente las necesidades del cliente. Trabajo impecable.", photo: "https://randomuser.me/api/portraits/women/5.jpg" },
        { name: "Javier Ramírez", company: "Constructora MAQ", comment: "Sitio web moderno y funcional, justo lo que necesitábamos. Muy contentos.", photo: "https://randomuser.me/api/portraits/men/6.jpg" },
        { name: "Sofía Herrera", company: "Mercadotecnia Total", comment: "El diseño de redes sociales aumentó nuestra interacción un 50%.", photo: "https://randomuser.me/api/portraits/women/7.jpg" },
        { name: "Luis Torres", company: "Estudio Fotográfico", comment: "Brochures de excelente calidad, el diseño fue exactamente lo que pedimos.", photo: "https://randomuser.me/api/portraits/men/8.jpg" },
        { name: "Mariana Soto", company: "Eventos Elegantes", comment: "Invitación web con RSVP, una experiencia única para nuestros invitados.", photo: "https://randomuser.me/api/portraits/women/9.jpg" },
        { name: "Andrés Castro", company: "Digital Marketing", comment: "Muy profesionales, cumplieron los plazos y el resultado fue espectacular.", photo: "https://randomuser.me/api/portraits/men/10.jpg" },
        { name: "Gabriela Ríos", company: "Agencia Click", comment: "El mejor servicio de diseño que he contratado. Superaron todas mis expectativas.", photo: "https://randomuser.me/api/portraits/women/11.jpg" },
        { name: "Fernando Vargas", company: "InnovaTech", comment: "La nueva web es increíble. Nuestros clientes nos felicitan por la mejora.", photo: "https://randomuser.me/api/portraits/men/12.jpg" }
    ];

    const grid = document.getElementById('testimoniosGrid');
    if (!grid) return;

    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back"></div>
            </div>
        `;
        grid.appendChild(card);
    }

    const cards = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonials.length;
    const groupSize = 4;
    let currentIndices = [0, 1, 2, 3];
    let isFlipped = false;

    function fillFace(faceElement, idx) {
        const t = testimonials[idx % totalTestimonials];
        faceElement.innerHTML = `
            <img src="${t.photo}" alt="Avatar" class="testimonial-avatar">
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-company">${t.company}</div>
            <div class="testimonial-comment">${t.comment}</div>
        `;
    }

    function initCards() {
        cards.forEach((card, i) => {
            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');
            fillFace(front, currentIndices[i]);
            fillFace(back, currentIndices[i] + 4);
        });
    }

    function updateNextFace() {
        if (!isFlipped) {
            cards.forEach((card, i) => {
                const back = card.querySelector('.card-back');
                fillFace(back, currentIndices[i] + 4);
            });
        } else {
            for (let i = 0; i < cards.length; i++) {
                currentIndices[i] = (currentIndices[i] + 2) % totalTestimonials;
            }
            cards.forEach((card, i) => {
                const front = card.querySelector('.card-front');
                fillFace(front, currentIndices[i]);
            });
        }
    }

    function doFlip() {
        cards.forEach(card => card.classList.toggle('flipped'));
        isFlipped = !isFlipped;
    }

    const FLIP_INTERVAL_MS = 6000;

    function startCycle() {
        initCards();
        setInterval(() => {
            updateNextFace();
            doFlip();
        }, FLIP_INTERVAL_MS);
    }

    startCycle();
}

// ================= CARD ALTERNANTE =================
function initAlternatingCard() {
    const cardContainer = document.querySelector('.alternating-card');
    if (!cardContainer) return;

    const allImages = Array.from(cardContainer.querySelectorAll('.card-image'));
    if (allImages.length === 0) return;

    function getVisibleImages() {
        const isMobile = window.innerWidth <= 768;
        return allImages.filter(img => {
            if (isMobile) {
                return img.classList.contains('mobile-image');
            } else {
                return img.classList.contains('desktop-image');
            }
        });
    }

    let currentIndex = 0;
    let visibleImages = getVisibleImages();
    let interval = null;

    function showImage(index) {
        visibleImages.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }

    function startCycle() {
        visibleImages = getVisibleImages();
        if (visibleImages.length === 0) return;
        showImage(0);
        currentIndex = 0;
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % visibleImages.length;
            showImage(currentIndex);
        }, 4000);
    }

    startCycle();
    window.addEventListener('resize', () => startCycle());
}

// ================= TRANSICIÓN ENTRE PÁGINAS =================
function initPageTransitions() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#')) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        });
    });
}

// ================= ENVÍO DE FORMULARIO (mailto) =================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        const subject = `Solicitud de servicio para Teen Informatics - ${nombre}`;
        const body = `Nombre: ${nombre}%0D%0AEmail: ${email}%0D%0ATeléfono: ${telefono}%0D%0AMensaje: ${mensaje}`;

        window.location.href = `mailto:teeninformatics@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
}

// ================= INICIALIZACIÓN ÚNICA =================
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();
    initScrollAnimations();
    initStats();
    initServicesTabs();
    initWaveTitle();
    initBreathingImages();
    initShakeButtons();
    initDynamicTitles();
    initPlanesAnimation();
    initInvitacionesTabs();
    initShakeInvitacionButtons();
    initScrollToTop();
    initContactForm();
    initSmoothCarousel();
    initTestimonials();
    initAlternatingCard();
    initPageTransitions();
});
