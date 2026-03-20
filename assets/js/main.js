/* =========================================================
   Main Site JS — Mecasimetra / CodexRoxas
   Navigation, scroll effects, misc interactions
   ========================================================= */

(function () {
  'use strict';

  /* ── Mobile nav toggle ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    /* Close on link click */
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navAnchors.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, observerOpts);

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Scroll-reveal for cards ── */
  const revealEls = document.querySelectorAll(
    '.about-feature, .service-card, .founder-card, .about-grid > *'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => {
      /* Only if prefers-reduced-motion is not set */
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }
      revealObserver.observe(el);
    });
  }

  /* ── Smooth scroll for nav anchor clicks ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Neon cursor trail (desktop only, reduced-motion aware) ── */
  if (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(pointer: fine)').matches
  ) {
    const trail = document.createElement('div');
    trail.id = 'cursor-trail';
    trail.style.cssText =
      'position:fixed;pointer-events:none;z-index:9999;width:6px;height:6px;border-radius:50%;' +
      'background:var(--accent-magenta);box-shadow:0 0 8px var(--accent-magenta),0 0 20px rgba(255,0,170,0.4);' +
      'transform:translate(-50%,-50%);transition:opacity 0.2s;opacity:0;';
    document.body.appendChild(trail);

    let raf;
    let tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      trail.style.opacity = '1';
      clearTimeout(raf);
      raf = setTimeout(() => { trail.style.opacity = '0'; }, 1200);
    });

    let cx = 0, cy = 0;
    function animateTrail() {
      cx += (tx - cx) * 0.25;
      cy += (ty - cy) * 0.25;
      trail.style.left = `${cx}px`;
      trail.style.top  = `${cy}px`;
      requestAnimationFrame(animateTrail);
    }
    requestAnimationFrame(animateTrail);
  }

  /* ── Typed effect on hero subtitle (opt-in) ── */
  const typedTarget = document.getElementById('hero-typed');
  if (typedTarget && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const phrases = [
      'Continuity-first control systems.',
      'κ · λ · β_c governance.',
      'Built on Kappology.',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let paused = false;

    function tick() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        typedTarget.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          paused = true;
          setTimeout(() => { paused = false; deleting = true; }, 2400);
        }
      } else {
        typedTarget.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      if (!paused) setTimeout(tick, deleting ? 40 : 65);
    }
    setTimeout(tick, 1000);
  }
})();
