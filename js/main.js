/**
 * DHARSON HOSPITAL - MAIN INTERACTIVE LOGIC
 * Location: Namakkal, Tamil Nadu, India
 * Speciality: Orthopaedics / Bone & Joint Care
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNavigation();
  initActiveNavLinkObserver();
  initFaqAccordion();
  initAppointmentForm();
  initTreatmentModal();
  initScrollAnimations();
  initDateConstraints();
});

/* --------------------------------------------------------------------------
   1. STICKY NAVBAR ON SCROLL
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  if (!menuToggle || !mobileNav) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    menuToggle.classList.toggle('active', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', () => toggleMenu());

  // Close when clicking overlay outside the drawer
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      toggleMenu(false);
    }
  });

  // Close when clicking any link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. ACTIVE NAV HIGHLIGHTING VIA INTERSECTION OBSERVER
   -------------------------------------------------------------------------- */
function initActiveNavLinkObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. ACCORDION (FAQ)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close all other accordions for clean single-expanded experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isAlreadyActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. APPOINTMENT FORM HANDLING & VALIDATION
   -------------------------------------------------------------------------- */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const formContainer = document.getElementById('appointmentFormContainer');
  const successContainer = document.getElementById('appointmentSuccessState');
  const refCodeSpan = document.getElementById('appointmentRefCode');
  const resetBtn = document.getElementById('appointmentResetBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Field references
    const nameInput = document.getElementById('patientName');
    const phoneInput = document.getElementById('patientPhone');
    const emailInput = document.getElementById('patientEmail');
    const dateInput = document.getElementById('preferredDate');
    const treatmentInput = document.getElementById('preferredTreatment');
    const submitBtn = form.querySelector('.form-submit-btn');

    let isValid = true;

    // Validate Name (min 2 characters)
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, true);
      isValid = false;
    } else {
      setFieldError(nameInput, false);
    }

    // Validate Phone (10 digits Indian phone format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phoneInput.value.replace(/[\s\-+]/g, '').slice(-10);
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setFieldError(phoneInput, true);
      isValid = false;
    } else {
      setFieldError(phoneInput, false);
    }

    // Validate Email (optional, but must be valid format if provided)
    if (emailInput && emailInput.value.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, true);
        isValid = false;
      } else {
        setFieldError(emailInput, false);
      }
    } else if (emailInput) {
      setFieldError(emailInput, false);
    }

    // Validate Date (must not be empty)
    if (!dateInput.value) {
      setFieldError(dateInput, true);
      isValid = false;
    } else {
      setFieldError(dateInput, false);
    }

    // Validate Treatment (must select one)
    if (!treatmentInput.value) {
      setFieldError(treatmentInput, true);
      isValid = false;
    } else {
      setFieldError(treatmentInput, false);
    }

    if (!isValid) {
      showToast('Please check the highlighted fields and try again.');
      return;
    }

    // Simulate loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Processing Request...
    `;

    // Generate reference ID: DHAR-2026-XXXX
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const refCode = `DHAR-2026-${randomId}`;

    const appointmentData = {
      refCode: refCode,
      name: nameInput.value.trim(),
      phone: cleanPhone,
      email: emailInput.value.trim(),
      date: dateInput.value,
      treatment: treatmentInput.options[treatmentInput.selectedIndex]?.text || treatmentInput.value,
      treatmentId: treatmentInput.value,
      message: (document.getElementById('patientMessage')?.value || "").trim(),
      source: "Dharson Hospital Website"
    };

    const webhookUrl = (typeof HOSPITAL_CONFIG !== 'undefined' && HOSPITAL_CONFIG.api && HOSPITAL_CONFIG.api.appointmentWebhookUrl) 
      ? HOSPITAL_CONFIG.api.appointmentWebhookUrl.trim() 
      : "";

    const finishSuccess = (code) => {
      if (refCodeSpan) {
        refCodeSpan.textContent = code;
      }
      if (formContainer && successContainer) {
        formContainer.style.display = 'none';
        successContainer.classList.add('active');
      }
      showToast(`Appointment request registered! Reference: ${code}`);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    };

    if (webhookUrl && webhookUrl.startsWith("http")) {
      // Send directly to Google Apps Script Web App
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(appointmentData),
        mode: 'no-cors' // Avoid CORS preflight OPTIONS rejection by Google Apps Script
      })
      .then(() => {
        finishSuccess(refCode);
      })
      .catch((err) => {
        console.warn("Webhook submission warning, falling back to local confirmation:", err);
        finishSuccess(refCode);
      });
    } else {
      // Fallback local simulation (no webhook configured yet)
      setTimeout(() => {
        finishSuccess(refCode);
      }, 1000);
    }
  });

  // Reset form button in success state
  if (resetBtn && formContainer && successContainer) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      formContainer.style.display = 'block';
      successContainer.classList.remove('active');
    });
  }

  // Clear errors on input
  form.querySelectorAll('.form-control').forEach(control => {
    control.addEventListener('input', () => {
      setFieldError(control, false);
    });
  });
}

function setFieldError(field, hasError) {
  if (hasError) {
    field.classList.add('has-error');
  } else {
    field.classList.remove('has-error');
  }
}

/* --------------------------------------------------------------------------
   6. TREATMENT DETAIL MODAL
   -------------------------------------------------------------------------- */
function initTreatmentModal() {
  const modalOverlay = document.getElementById('treatmentModal');
  const closeBtn = document.getElementById('treatmentModalClose');
  const modalTitle = document.getElementById('modalTreatmentTitle');
  const modalDesc = document.getElementById('modalTreatmentDesc');
  const modalConditions = document.getElementById('modalTreatmentConditions');
  const modalApproach = document.getElementById('modalTreatmentApproach');
  const bookBtn = document.getElementById('modalBookBtn');

  if (!modalOverlay) return;

  const openModal = (treatmentData) => {
    if (!treatmentData) return;

    if (modalTitle) modalTitle.textContent = treatmentData.title;
    if (modalDesc) modalDesc.textContent = treatmentData.fullDesc;
    if (modalApproach) modalApproach.textContent = treatmentData.careApproach;

    if (modalConditions) {
      modalConditions.innerHTML = '';
      (treatmentData.commonConditions || []).forEach(cond => {
        const li = document.createElement('li');
        li.className = 'modal-list-item';
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${cond}</span>
        `;
        modalConditions.appendChild(li);
      });
    }

    // Set treatment in appointment form if user clicks Book
    if (bookBtn) {
      bookBtn.onclick = () => {
        closeModal();
        const treatmentSelect = document.getElementById('preferredTreatment');
        if (treatmentSelect) {
          treatmentSelect.value = treatmentData.id;
        }
        const appointmentSec = document.getElementById('appointment');
        if (appointmentSec) {
          appointmentSec.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  // Attach click listener to "Learn More" buttons in treatment cards
  document.querySelectorAll('[data-treatment-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-treatment-id');
      if (typeof HOSPITAL_CONFIG !== 'undefined' && HOSPITAL_CONFIG.treatments) {
        const item = HOSPITAL_CONFIG.treatments.find(t => t.id === id);
        if (item) openModal(item);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SCROLL-TRIGGERED REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-item');
  if (!reveals.length) return;

  // If user prefers reduced motion, reveal everything immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. DATE INPUT CONSTRAINTS (PREVENT PAST DATES)
   -------------------------------------------------------------------------- */
function initDateConstraints() {
  const dateInput = document.getElementById('preferredDate');
  if (!dateInput) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

/* --------------------------------------------------------------------------
   9. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Inline animation for spinner in submit button
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .spin-icon { animation: spin 1s linear infinite; }
`;
document.head.appendChild(styleSheet);
