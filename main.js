/* =====================================================
   ESTRO — AI Creative Production Landing Page
   JavaScript — Interactions & Form Handling
   ===================================================== */

(function () {
  'use strict';

  /* --- Navbar: scroll state & mobile menu --- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll animations --- */
  const animatedEls = document.querySelectorAll('.animate-on-scroll, .problem__item');

  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animatedEls.forEach(el => observer.observe(el));
  } else {
    animatedEls.forEach(el => el.classList.add('in-view'));
  }

  /* --- Form handling --- */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{6,20}$/.test(phone.trim());
  }

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = input.closest('.form__group')?.querySelector('.form__error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('visible');
    }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.closest('.form__group')?.querySelector('.form__error-msg');
    if (errEl) errEl.classList.remove('visible');
  }

  function validateForm(form) {
    let isValid = true;

    const fields = form.querySelectorAll('[required]');
    fields.forEach(field => {
      clearError(field);
      if (!field.value.trim()) {
        showError(field, 'Questo campo è obbligatorio.');
        isValid = false;
        return;
      }
      if (field.type === 'email' && !validateEmail(field.value)) {
        showError(field, 'Inserisci un indirizzo email valido.');
        isValid = false;
      }
      if (field.dataset.type === 'phone' && !validatePhone(field.value)) {
        showError(field, 'Inserisci un numero di telefono valido.');
        isValid = false;
      }
    });

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Invio in corso…';
    btn.disabled = true;

    // Simulate async submission — replace with real endpoint
    setTimeout(() => {
      form.querySelector('.form__fields')?.classList.add('hidden');
      const success = form.querySelector('.form__success');
      if (success) {
        success.classList.add('visible');
      } else {
        btn.textContent = 'Messaggio inviato ✓';
      }
    }, 1200);
  }

  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);

    // Live validation on blur
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.hasAttribute('required') && !field.value.trim()) {
          showError(field, 'Questo campo è obbligatorio.');
        } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
          showError(field, 'Inserisci un indirizzo email valido.');
        } else {
          clearError(field);
        }
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('error') && field.value.trim()) {
          clearError(field);
        }
      });
    });
  });

  /* --- Carousel ── */
  (() => {
    const carousel = document.getElementById('solution-carousel');
    if (!carousel) return;

    const slides  = carousel.querySelectorAll('.carousel__slide');
    const dots    = carousel.querySelectorAll('.carousel__dot');
    const btnPrev = carousel.querySelector('.carousel__btn--prev');
    const btnNext = carousel.querySelector('.carousel__btn--next');
    const n = slides.length;
    let current = 0;
    let timer;

    const goTo = (idx) => {
      slides[current].classList.remove('carousel__slide--active');
      dots[current].classList.remove('carousel__dot--active');
      dots[current].setAttribute('aria-selected', 'false');
      current = (idx + n) % n;
      slides[current].classList.add('carousel__slide--active');
      dots[current].classList.add('carousel__dot--active');
      dots[current].setAttribute('aria-selected', 'true');
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const resetTimer = () => { clearInterval(timer); timer = setInterval(next, 4000); };

    btnNext.addEventListener('click', () => { next(); resetTimer(); });
    btnPrev.addEventListener('click', () => { prev(); resetTimer(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

    /* swipe touch */
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetTimer(); }
    }, { passive: true });

    /* pausa hover */
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', resetTimer);

    resetTimer();
  })();

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
