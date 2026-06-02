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
