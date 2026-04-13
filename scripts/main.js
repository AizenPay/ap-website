/* ============================================================
   AiZenPay — Main Script
   scripts/main.js
   Nav · Mobile Drawer · Cookie Banner · Active Nav Links
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behavior ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger / drawer ── */
  const hamburger = document.querySelector('.navbar__hamburger');
  const drawer    = document.querySelector('.navbar__drawer');
  const overlay   = document.getElementById('nav-overlay');

  function openDrawer() {
    hamburger && hamburger.classList.add('open');
    drawer    && drawer.classList.add('open');
    overlay   && overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    hamburger && hamburger.classList.remove('open');
    drawer    && drawer.classList.remove('open');
    overlay   && overlay.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer && drawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close drawer when a nav link inside it is clicked
  if (drawer) {
    drawer.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* ── Active Nav Link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Cookie Banner ── */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && !localStorage.getItem('az_cookies_accepted')) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 1500);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('az_cookies_accepted', '1');
      if (cookieBanner) {
        cookieBanner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        cookieBanner.style.opacity = '0';
        cookieBanner.style.transform = 'translateY(20px)';
        setTimeout(() => cookieBanner.remove(), 350);
      }
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
