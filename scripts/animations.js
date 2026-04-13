/* ============================================================
   AiZenPay — Animations Script
   scripts/animations.js
   IntersectionObserver · Scroll Reveal · Count-Up
   ============================================================ */

(function () {
  'use strict';

  /* Respect prefers-reduced-motion */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    if (!revealEls.length) return;

    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Count-Up Animation for Stat Blocks ── */
  function animateCountUp(el) {
    const rawText  = el.getAttribute('data-target') || el.textContent.trim();
    const suffix   = rawText.replace(/[\d.,]/g, '');  // e.g. '+', '%', 'ms'
    const target   = parseFloat(rawText.replace(/[^0-9.]/g, ''));
    const duration = 1800;
    const start    = performance.now();
    const isDecimal = rawText.includes('.');
    const decimals  = isDecimal ? (rawText.split('.')[1] || '').replace(/[^0-9]/g, '').length : 0;

    if (isNaN(target)) return;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;

      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current))
        .toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = rawText; // Ensure final value is exact
      }
    }

    requestAnimationFrame(update);
  }

  function initCountUp() {
    const statEls = document.querySelectorAll('.stat-block__number');
    if (!statEls.length) return;

    if (prefersReduced) return; // Skip animation, show final value

    // Store the target value before zeroing
    statEls.forEach(el => {
      if (!el.getAttribute('data-target')) {
        el.setAttribute('data-target', el.textContent.trim());
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCountUp(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach(el => observer.observe(el));
  }

  /* ── Feature Cards Stagger ── */
  function initCardStagger() {
    const grids = document.querySelectorAll('.grid-3, .grid-2, .grid-4');
    grids.forEach(grid => {
      const cards = grid.querySelectorAll('.feature-card, .industry-card, .team-card');
      cards.forEach((card, i) => {
        card.classList.add('reveal');
        card.classList.add(`reveal-delay-${Math.min(i + 1, 6)}`);
      });
    });
  }

  /* ── Init ── */
  function init() {
    initCardStagger();   // Must run before observer
    initScrollReveal();
    initCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
