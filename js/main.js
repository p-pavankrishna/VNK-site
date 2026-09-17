/**
 * VNK Personal Training — Interactive Scripts
 * Founder & Head Coach: Vadlakonda Naveen Kumar (VNK)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initAccordions();
  initConsultationModal();
  initFormHandling();
  initSmoothScroll();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  if (!menuBtn || !drawer) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    menuBtn.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('menu-open', isOpen);
  };

  menuBtn.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. FAQ ACCORDIONS (ACCESSIBLE & SMOOTH)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isExpanded = item.classList.contains('active');

      // Close all other items in the same list
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 32 + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. CONSULTATION BOOKING MODAL
   -------------------------------------------------------------------------- */
function initConsultationModal() {
  const backdrop = document.querySelector('.modal-backdrop');
  const modalContainer = document.querySelector('.modal-container');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const triggerBtns = document.querySelectorAll('[data-open-modal="consultation"]');

  if (!backdrop) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Reset form view in case it was submitted before
    const form = backdrop.querySelector('.consultation-form');
    const success = backdrop.querySelector('.modal-success-state');
    if (form) form.style.display = 'flex';
    if (success) success.style.display = 'none';

    // Focus first input
    const firstInput = backdrop.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeModal = () => {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close when clicking outside container
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. CONSULTATION FORM SUBMISSION & PHONE VALIDATION
   -------------------------------------------------------------------------- */
function initFormHandling() {
  const forms = document.querySelectorAll('.consultation-form');
  const coachWhatsapp = '8520808871';

  forms.forEach(form => {
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const confirmPhoneInput = form.querySelector('input[name="confirm_phone"]');
    const errorMsg = form.querySelector('.phone-mismatch-error');

    // Helper to sanitize phone digits
    const cleanNumber = (val) => (val || '').replace(/[\s\-\(\)\+]/g, '');

    const validateMatch = () => {
      if (!phoneInput || !confirmPhoneInput) return true;
      const p1 = cleanNumber(phoneInput.value);
      const p2 = cleanNumber(confirmPhoneInput.value);

      if (!p2) {
        if (errorMsg) errorMsg.style.display = 'none';
        confirmPhoneInput.classList.remove('input-error', 'input-success');
        return false;
      }

      if (p1 !== p2) {
        if (errorMsg) {
          errorMsg.innerText = 'Phone numbers do not match. Please verify both numbers.';
          errorMsg.style.display = 'block';
        }
        confirmPhoneInput.classList.add('input-error');
        confirmPhoneInput.classList.remove('input-success');
        return false;
      } else {
        if (errorMsg) errorMsg.style.display = 'none';
        confirmPhoneInput.classList.remove('input-error');
        confirmPhoneInput.classList.add('input-success');
        return true;
      }
    };

    if (confirmPhoneInput) {
      confirmPhoneInput.addEventListener('input', validateMatch);
      confirmPhoneInput.addEventListener('blur', validateMatch);
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        if (confirmPhoneInput && confirmPhoneInput.value) validateMatch();
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const confirmVal = confirmPhoneInput ? confirmPhoneInput.value.trim() : '';

      const p1 = cleanNumber(phoneVal);
      const p2 = cleanNumber(confirmVal);

      if (p1 !== p2 || !p1) {
        if (errorMsg) {
          errorMsg.innerText = 'Phone numbers do not match. Please ensure both fields have the same number.';
          errorMsg.style.display = 'block';
        }
        if (confirmPhoneInput) {
          confirmPhoneInput.classList.add('input-error');
          confirmPhoneInput.focus();
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      // Prepare WhatsApp message URL
      const waMessage = encodeURIComponent(`Hi VNK, my name is ${nameVal} (${phoneVal}). I would like to book a consultation for personal training.`);
      const waUrl = `https://wa.me/91${coachWhatsapp}?text=${waMessage}`;

      // Simulate network submission
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }

        const container = form.parentElement;
        const modalSuccess = container ? container.querySelector('.modal-success-state') : null;

        if (modalSuccess) {
          form.style.display = 'none';
          modalSuccess.style.display = 'block';

          // Update WhatsApp quick action button if present in success state
          const waActionBtn = modalSuccess.querySelector('.wa-action-btn');
          if (waActionBtn) {
            waActionBtn.setAttribute('href', waUrl);
          }

          form.reset();
          if (confirmPhoneInput) confirmPhoneInput.classList.remove('input-success', 'input-error');
        } else {
          // If in-page form without success state
          alert(`Thank you, ${nameVal}! Your request has been received. You can also message VNK directly on WhatsApp at +91 ${coachWhatsapp}.`);
          window.open(waUrl, '_blank');
          form.reset();
          if (confirmPhoneInput) confirmPhoneInput.classList.remove('input-success', 'input-error');
        }
      }, 600);
    });
  });
}

/* --------------------------------------------------------------------------
   6. SMOOTH ANCHOR SCROLLING
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SUBTLE SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const revealElements = document.querySelectorAll(
    '.principle-card, .audience-card, .process-step, .include-card, .testimonial-slot, .story-card, .faq-item'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
