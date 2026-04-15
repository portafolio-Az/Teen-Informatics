// ============================================================
//  TEEN INFORMATICS — script.js  (optimizado)
// ============================================================

// ── DATOS DEL HERO SLIDER ────────────────────────────────────
const SLIDES_DATA = [
    {
        img:       'assets/img-hero/hero-1.png',
        imgMobile: 'assets/img-hero/hero-1-2.jpg',
        small:  '¿Tus Clientes no te encuentran?',
        title:  'Tu Negocio Necesita una Página web',
        desc:   'Creamos experiencias digitales que posicionan tu negocio y atraen clientes.'
    },
    {
        img:       'assets/img-hero/hero-2.png',
        imgMobile: 'assets/img-hero/hero-2-2.jpg',
        small:  'Servicios de diseño e impresión de tarjetas',
        title:  'Tarjetas de Presentación de alta calidad',
        desc:   'Diseñamos tarjetas de presentación que reflejan la identidad de tu marca. Materiales de alta calidad, una impresión que deja huella.'
    },
    {
        img:       'assets/img-hero/hero-3.png',
        imgMobile: 'assets/img-hero/hero-3-2.jpg',
        small:  'DISEÑO QUE CONECTA',
        title:  'Diseños para Redes Sociales',
        desc:   'Posts, stories y feeds con coherencia de marca. Atrae a tu audiencia con una estética profesional y estratégica.'
    },
    {
        img:       'assets/img-hero/hero-4.png',
        imgMobile: 'assets/img-hero/hero-4-2.jpg',
        small:  'Haz que tu negocio destaque desde el primer vistazo',
        title:  'Diseño de identidad visual',
        desc:   'Creamos papelería profesional alineada a tu marca para destacar y aumentar el valor percibido de tu negocio.'
    },
    {
        img:       'assets/img-hero/hero-5.png',
        imgMobile: 'assets/img-hero/hero-5-2.jpg',
        small:  'Impacto visual inmediato para tu marca.',
        title:  'Brochures corporativos a medida.',
        desc:   'Diseñamos brochures corporativos que proyectan profesionalismo, comunican con claridad y convierten clientes.'
    }
];

// ── TIEMPOS DEL SLIDER ───────────────────────────────────────
const SLIDE_DELAY_FIRST  = 1000; // ms antes de mostrar el primer texto
const SLIDE_TRANSITION   = 400;  // ms entre cada línea de texto
const SLIDE_DISPLAY_TIME = 4000; // ms que permanece el texto visible
const SLIDE_PAUSE        = 200;  // ms entre slides

// ============================================================
//  HERO SLIDER
// ============================================================
function initSlider() {
    const container  = document.getElementById('slidesContainer');
    const elSmall    = document.getElementById('heroSmallText');
    const elTitle    = document.getElementById('heroTitleText');
    const elDesc     = document.getElementById('heroDescText');
    if (!container || !elSmall || !elTitle || !elDesc) return;

    let current      = 0;
    let timers       = [];
    let running      = false;
    let prevWidth    = window.innerWidth;
    let slides       = [];

    const isMobile = () => window.innerWidth <= 768;

    /* Construye los slides según el viewport */
    function build() {
        container.innerHTML = '';
        SLIDES_DATA.forEach((d, i) => {
            const div = document.createElement('div');
            div.className = 'slide' + (i === 0 ? ' active' : '');
            div.style.backgroundImage = `url('${isMobile() && d.imgMobile ? d.imgMobile : d.img}')`;
            container.appendChild(div);
        });
        slides = container.querySelectorAll('.slide');
    }

    function setText(i) {
        const d = SLIDES_DATA[i];
        elSmall.textContent  = d.small;
        elTitle.innerHTML    = d.title;
        elDesc.textContent   = d.desc;
    }

    function hide() {
        elSmall.classList.remove('visible');
        elTitle.classList.remove('visible');
        elDesc.classList.remove('visible');
        void elSmall.offsetHeight; // fuerza reflow para re-animar
    }

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
        running = false;
    }

    function push(fn, ms) {
        const id = setTimeout(fn, ms);
        timers.push(id);
        return id;
    }

    /* Aparece texto de forma escalonada; llama a cb cuando termina */
    function appear(cb) {
        hide();
        push(() => {
            elSmall.classList.add('visible');
            push(() => {
                elTitle.classList.add('visible');
                push(() => {
                    elDesc.classList.add('visible');
                    push(cb, SLIDE_TRANSITION);
                }, SLIDE_TRANSITION);
            }, SLIDE_TRANSITION);
        }, SLIDE_DELAY_FIRST);
    }

    /* Desaparece en orden inverso; llama a cb cuando termina */
    function disappear(cb) {
        elDesc.classList.remove('visible');
        push(() => {
            elTitle.classList.remove('visible');
            push(() => {
                elSmall.classList.remove('visible');
                push(cb, SLIDE_TRANSITION);
            }, SLIDE_TRANSITION);
        }, SLIDE_TRANSITION);
    }

    function goTo(index) {
        if (index === current) return;
        clearTimers();
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        current = index;
        setText(current);
        hide();
        startCycle();
    }

    function startCycle() {
        if (running) return;
        running = true;
        appear(() => {
            push(() => {
                disappear(() => {
                    push(() => goTo((current + 1) % SLIDES_DATA.length), SLIDE_PAUSE);
                });
            }, SLIDE_DISPLAY_TIME);
        });
    }

    /* Ajusta altura del hero al viewport (evita barra de dirección móvil) */
    function setHeroHeight() {
        const hero = document.querySelector('.hero');
        if (hero) hero.style.height = window.innerHeight + 'px';
    }

    /* Reconstruye si el tipo de breakpoint cambia (móvil ↔ escritorio) */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setHeroHeight();
            const nowMobile = isMobile();
            if (nowMobile !== (prevWidth <= 768)) {
                const saved = current;
                clearTimers();
                build();
                slides.forEach((s, i) => s.classList.toggle('active', i === saved));
                current = saved;
                setText(current);
                hide();
                startCycle();
            }
            prevWidth = window.innerWidth;
        }, 150);
    });

    build();
    setText(0);
    hide();
    setHeroHeight();
    startCycle();
}

// ============================================================
//  MENÚ MÓVIL
// ============================================================
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.querySelector('.nav-links');
    if (!toggle || !nav) return;

    const close = () => { nav.classList.remove('active'); toggle.classList.remove('active'); };
    const open  = () => { nav.classList.add('active');    toggle.classList.add('active'); };

    toggle.addEventListener('click', e => {
        e.stopPropagation();
        nav.classList.contains('active') ? close() : open();
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    document.addEventListener('click', e => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
    });
}

// ============================================================
//  CARD ALTERNANTE (banner después del hero)
// ============================================================
function initAlternatingCard() {
    const wrap = document.querySelector('.alternating-card');
    if (!wrap) return;

    const all = [...wrap.querySelectorAll('.card-image')];
    if (!all.length) return;

    let idx      = 0;
    let interval = null;

    function visible() {
        const mobile = window.innerWidth <= 768;
        return all.filter(img =>
            mobile ? img.classList.contains('mobile-image')
                   : img.classList.contains('desktop-image')
        );
    }

    function show(list, i) {
        list.forEach((img, j) => img.classList.toggle('active', j === i));
    }

    function start() {
        const list = visible();
        if (!list.length) return;
        if (interval) clearInterval(interval);
        idx = 0;
        show(list, idx);
        interval = setInterval(() => {
            idx = (idx + 1) % list.length;
            show(visible(), idx);
        }, 4000);
    }

    let resizeT;
    window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(start, 150); });
    start();
}

// ============================================================
//  ANIMACIONES DE ENTRADA (scroll)
//  Un único IntersectionObserver para sección "Por qué" Y cards de planes
// ============================================================
function initScrollAnimations() {
    const targets = document.querySelectorAll(
        '.porque-titulo-main, .porque-parrafo, .servicio-card, .porque-confianza, .plan-card'
    );
    if (!targets.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
    }, { threshold: 0.15 });

    targets.forEach(el => obs.observe(el));
}

// ============================================================
//  ESTADÍSTICAS (conteo animado)
// ============================================================
function initStats() {
    const items = document.querySelectorAll('.stat-item');
    if (!items.length) return;

    /* Dirección de entrada: izquierda / derecha / izquierda */
    const dirs = ['left', 'right', 'left'];
    items.forEach((item, i) => item.setAttribute('data-direction', dirs[i] ?? 'left'));

    function countUp(el, target) {
        const decimal  = target % 1 !== 0;
        const suffix   = el.closest('.stat-item')?.getAttribute('data-suffix') ?? '';
        const steps    = 75;    // número de pasos
        const interval = 20;    // ms entre pasos
        let   step     = 0;

        const timer = setInterval(() => {
            step++;
            const val = (target * step) / steps;
            el.innerHTML = (decimal ? val.toFixed(1) : Math.floor(val)) +
                           (suffix ? `<span class="stat-suffix">${suffix}</span>` : '');
            if (step >= steps) {
                clearInterval(timer);
                el.innerHTML = target + (suffix ? `<span class="stat-suffix">${suffix}</span>` : '');
            }
        }, interval);
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const item   = e.target;
            const numEl  = item.querySelector('.stat-number');
            if (!numEl || numEl.dataset.counted) return;

            setTimeout(() => {
                item.classList.add('visible');
                countUp(numEl, parseFloat(item.getAttribute('data-target')));
                numEl.dataset.counted = '1';
            }, 500);
        });
    }, { threshold: 0.2 });

    items.forEach(item => obs.observe(item));
}

// ============================================================
//  TÍTULOS TYPEWRITER
// ============================================================
function initDynamicTitles() {
    document.querySelectorAll('.dynamic-title-container').forEach(container => {
        const opts = [...container.querySelectorAll('.title-option')];
        if (opts.length < 2) return;

        opts.forEach(o => {
            o.dataset.original = o.textContent;
            o.style.display    = 'none';
        });

        let idx     = 0;
        let cur     = opts[idx];
        let deleting = false;
        cur.style.display = 'inline-block';
        cur.textContent   = '';

        function tick() {
            const full = cur.dataset.original;
            const len  = cur.textContent.length;

            if (!deleting) {
                if (len < full.length) {
                    cur.textContent = full.slice(0, len + 1);
                    setTimeout(tick, 80);
                } else {
                    deleting = true;
                    setTimeout(tick, 2000);
                }
            } else {
                if (len > 0) {
                    cur.textContent = full.slice(0, len - 1);
                    setTimeout(tick, 50);
                } else {
                    cur.style.display = 'none';
                    idx = (idx + 1) % opts.length;
                    cur = opts[idx];
                    cur.style.display = 'inline-block';
                    cur.textContent   = '';
                    deleting = false;
                    setTimeout(tick, 300);
                }
            }
        }
        tick();
    });
}

// ============================================================
//  PESTAÑAS DE INVITACIONES
// ============================================================
function initInvitacionesTabs() {
    const btns  = document.querySelectorAll('.invitacion-tab-btn');
    const panes = document.querySelectorAll('.invitacion-tab-pane');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b  => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`inv-tab-${btn.dataset.invTab}`)?.classList.add('active');
        });
    });
}

// ============================================================
//  SACUDIDA PERIÓDICA — botones "Solicitar ahora" de invitaciones
// ============================================================
function initShakeInvitacionButtons() {
    document.querySelectorAll('.btn-invitacion').forEach(btn => {
        setInterval(() => {
            btn.classList.add('shake-button-trigger');
            setTimeout(() => btn.classList.remove('shake-button-trigger'), 300);
        }, 2000);
    });
}

// ============================================================
//  BOTÓN "IR ARRIBA"
// ============================================================
function initScrollToTop() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
//  CARRUSEL DE LOGOS (animación por rAF)
// ============================================================
function initSmoothCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    let pos  = 0;
    let half = 0;
    const SPEED = 1; // px por frame; aumenta para más velocidad

    function calcHalf() {
        const imgs    = [...track.children];
        const count   = Math.floor(imgs.length / 2);
        let   width   = 0;
        for (let i = 0; i < count; i++) {
            const s = getComputedStyle(imgs[i]);
            width += imgs[i].offsetWidth +
                     parseFloat(s.marginLeft) +
                     parseFloat(s.marginRight);
        }
        return width;
    }

    function loop() {
        if (!half) { half = calcHalf(); }
        if (!half) { requestAnimationFrame(loop); return; }
        pos += SPEED;
        if (pos >= half) pos -= half;
        track.style.transform = `translateX(-${pos}px)`;
        requestAnimationFrame(loop);
    }

    /* Recalcula al redimensionar */
    let resizeT;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => { half = calcHalf(); }, 200);
    });

    requestAnimationFrame(loop);
}

// ============================================================
//  TESTIMONIOS (giro automático)
// ============================================================
function initTestimonials() {
    const TESTIMONIALS = [
        { name:'Ana García',      company:'Estudio Creativo',    comment:'Excelente servicio, el diseño superó mis expectativas. Muy profesionales y atentos a cada detalle.',          photo:'https://randomuser.me/api/portraits/women/1.jpg' },
        { name:'Carlos Méndez',   company:'Tech Solutions',      comment:'La página web que desarrollaron ha aumentado nuestras ventas un 30%. Muy recomendados.',                      photo:'https://randomuser.me/api/portraits/men/2.jpg'   },
        { name:'Laura Fernández', company:'Eventos Mágicos',     comment:'Las invitaciones digitales fueron un éxito total. Nuestros invitados quedaron encantados.',                   photo:'https://randomuser.me/api/portraits/women/3.jpg' },
        { name:'Roberto Díaz',    company:'Impresiones Rápidas', comment:'La impresión de tarjetas con acabados premium nos dio una imagen profesional increíble.',                     photo:'https://randomuser.me/api/portraits/men/4.jpg'   },
        { name:'Patricia López',  company:'Branding Lab',        comment:'El equipo entiende realmente las necesidades del cliente. Trabajo impecable.',                                photo:'https://randomuser.me/api/portraits/women/5.jpg' },
        { name:'Javier Ramírez',  company:'Constructora MAQ',    comment:'Sitio web moderno y funcional, justo lo que necesitábamos. Muy contentos.',                                   photo:'https://randomuser.me/api/portraits/men/6.jpg'   },
        { name:'Sofía Herrera',   company:'Mercadotecnia Total', comment:'El diseño de redes sociales aumentó nuestra interacción un 50%.',                                             photo:'https://randomuser.me/api/portraits/women/7.jpg' },
        { name:'Luis Torres',     company:'Estudio Fotográfico', comment:'Brochures de excelente calidad, el diseño fue exactamente lo que pedimos.',                                   photo:'https://randomuser.me/api/portraits/men/8.jpg'   },
        { name:'Mariana Soto',    company:'Eventos Elegantes',   comment:'Invitación web con RSVP, una experiencia única para nuestros invitados.',                                     photo:'https://randomuser.me/api/portraits/women/9.jpg' },
        { name:'Andrés Castro',   company:'Digital Marketing',   comment:'Muy profesionales, cumplieron los plazos y el resultado fue espectacular.',                                   photo:'https://randomuser.me/api/portraits/men/10.jpg'  },
        { name:'Gabriela Ríos',   company:'Agencia Click',       comment:'El mejor servicio de diseño que he contratado. Superaron todas mis expectativas.',                            photo:'https://randomuser.me/api/portraits/women/11.jpg'},
        { name:'Fernando Vargas', company:'InnovaTech',          comment:'La nueva web es increíble. Nuestros clientes nos felicitan por la mejora.',                                   photo:'https://randomuser.me/api/portraits/men/12.jpg'  }
    ];

    const grid = document.getElementById('testimoniosGrid');
    if (!grid) return;

    const TOTAL = TESTIMONIALS.length;
    const COUNT = 4; // tarjetas visibles simultáneamente

    /* Construye las 4 tarjetas vacías */
    grid.innerHTML = '';
    for (let i = 0; i < COUNT; i++) {
        grid.insertAdjacentHTML('beforeend',
            `<div class="testimonial-card">
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back"></div>
                </div>
            </div>`
        );
    }

    const cards = [...grid.querySelectorAll('.testimonial-card')];
    let indices  = [0, 1, 2, 3];
    let flipped  = false;

    function fill(face, idx) {
        const t = TESTIMONIALS[idx % TOTAL];
        face.innerHTML =
            `<img src="${t.photo}" alt="Avatar" class="testimonial-avatar">
             <div class="testimonial-name">${t.name}</div>
             <div class="testimonial-company">${t.company}</div>
             <div class="testimonial-comment">${t.comment}</div>`;
    }

    function init() {
        cards.forEach((card, i) => {
            fill(card.querySelector('.card-front'), indices[i]);
            fill(card.querySelector('.card-back'),  indices[i] + COUNT);
        });
    }

    function cycle() {
        if (!flipped) {
            /* prepara caras traseras con el siguiente lote */
            cards.forEach((card, i) => fill(card.querySelector('.card-back'), indices[i] + COUNT));
        } else {
            /* avanza índices y prepara caras delanteras */
            indices = indices.map(n => (n + 2) % TOTAL);
            cards.forEach((card, i) => fill(card.querySelector('.card-front'), indices[i]));
        }
        cards.forEach(c => c.classList.toggle('flipped'));
        flipped = !flipped;
    }

    init();
    setInterval(cycle, 6000);
}

// ============================================================
//  TRANSICIÓN ENTRE PÁGINAS (overlay de carga)
// ============================================================
function initPageTransitions() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        /* Solo links internos relativos (no #, no http, no mailto, no tel) */
        if (!href || /^(#|http|mailto|tel)/.test(href)) return;
        link.addEventListener('click', e => {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => { window.location.href = href; }, 1000);
        });
    });
}

// ============================================================
//  FORMULARIO DE CONTACTO (mailto)
// ============================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nombre   = document.getElementById('nombre')  ?.value.trim() ?? '';
        const email    = document.getElementById('email')   ?.value.trim() ?? '';
        const telefono = document.getElementById('telefono')?.value.trim() ?? '';
        const mensaje  = document.getElementById('mensaje') ?.value.trim() ?? '';

        const subject = encodeURIComponent(`Solicitud de servicio para Teen Informatics - ${nombre}`);
        const body    = `Nombre: ${nombre}%0D%0AEmail: ${email}%0D%0ATeléfono: ${telefono}%0D%0AMensaje: ${mensaje}`;
        window.location.href = `mailto:teeninformatics@gmail.com?subject=${subject}&body=${body}`;
    });
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();
    initAlternatingCard();
    initScrollAnimations();
    initStats();
    initDynamicTitles();
    initInvitacionesTabs();
    initShakeInvitacionButtons();
    initScrollToTop();
    initSmoothCarousel();
    initTestimonials();
    initPageTransitions();
    initContactForm();
});