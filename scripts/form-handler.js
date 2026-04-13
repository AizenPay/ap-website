/* ============================================================
   AiZenPay — Form Handler
   scripts/form-handler.js
   Netlify Forms · Validation · Success States
   ============================================================ */

(function () {
  'use strict';

  /* ── Validation Helpers ── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  const URL_RE   = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/\S*)?$/i;

  function showError(field, message) {
    field.classList.add('error');
    const errEl = field.parentElement.querySelector('.form-error');
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add('visible');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errEl = field.parentElement.querySelector('.form-error');
    if (errEl) errEl.classList.remove('visible');
  }

  function validateField(field) {
    const val = field.value.trim();
    const type = field.getAttribute('data-validate') || field.type;

    if (field.required && !val) {
      showError(field, 'This field is required.');
      return false;
    }
    if (val && type === 'email' && !EMAIL_RE.test(val)) {
      showError(field, 'Please enter a valid email address.');
      return false;
    }
    if (val && type === 'tel' && !PHONE_RE.test(val)) {
      showError(field, 'Please enter a valid phone number.');
      return false;
    }
    if (val && type === 'url' && !URL_RE.test(val)) {
      showError(field, 'Please enter a valid website URL.');
      return false;
    }
    clearError(field);
    return true;
  }

  /* ── Wire up real-time validation on blur ── */
  function wireFieldValidation(form) {
    form.querySelectorAll('.form-field').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    // Required checkboxes
    form.querySelectorAll('input[type="checkbox"][required]').forEach(cb => {
      cb.addEventListener('change', () => {
        const errEl = cb.closest('.form-group') && cb.closest('.form-group').querySelector('.form-error');
        if (cb.checked && errEl) errEl.classList.remove('visible');
      });
    });
  }

  /* ── Submit via Fetch (Netlify Forms) ── */
  function encode(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }

  function handleFormSubmit(form, successEl) {
    let isValid = true;

    // Validate all fields
    form.querySelectorAll('.form-field').forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    // Required checkboxes
    form.querySelectorAll('input[type="checkbox"][required]').forEach(cb => {
      if (!cb.checked) {
        isValid = false;
        const errEl = cb.closest('.form-group') && cb.closest('.form-group').querySelector('.form-error');
        if (errEl) {
          errEl.textContent = 'You must agree to continue.';
          errEl.classList.add('visible');
        }
      }
    });

    if (!isValid) return;

    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // Disable submit button
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': form.getAttribute('name'), ...data })
    })
      .then(() => {
        // Show success
        form.style.display = 'none';
        if (successEl) successEl.classList.add('visible');
        // Scroll to success message
        if (successEl) successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
        }
        alert('There was an error submitting the form. Please try again or email us at info@aizenpay.com.');
      });
  }

  /* ── Init all forms on the page ── */
  function initForms() {
    document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
      wireFieldValidation(form);

      const successEl = document.getElementById(form.getAttribute('data-success-id') || 'form-success');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form, successEl);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

})();
