/* ═══════════════════════════════════════════════════════════════
   MAYER ROMANY — PORTFOLIO v2  JAVASCRIPT
   Features: Preloader · Sticky Nav · Typed text · Tabs ·
             Skill bars · Scroll reveals · Form · Back-to-top
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   UTILITY
───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────
   1. PRELOADER
───────────────────────────────────────── */
(function initPreloader() {
  const loader  = $('#preloader');
  const fill    = $('#preFill');
  if (!loader) return;

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    fill.style.width = pct + '%';
    if (pct >= 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        // Trigger hero reveals after loader hides
        triggerHeroAnimations();
      }, 300);
    }
  }, 90);

  document.body.style.overflow = 'hidden';
})();

function triggerHeroAnimations() {
  $$('.hero .reveal, .hero [data-reveal]').forEach(el => el.classList.add('visible'));
}

/* ─────────────────────────────────────────
   2. STICKY HEADER
───────────────────────────────────────── */
(function initHeader() {
  const header = $('#header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   3. MOBILE BURGER MENU
───────────────────────────────────────── */
(function initBurger() {
  const burger  = $('#burger');
  const navList = $('#navList');
  if (!burger || !navList) return;

  burger.addEventListener('click', () => {
    const open = navList.classList.toggle('mob-open');
    burger.setAttribute('aria-expanded', open);
    navList.style.display = open ? 'flex' : '';
  });

  // Close when a link is clicked
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('mob-open');
      navList.style.display = '';
    });
  });
})();

/* ─────────────────────────────────────────
   4. SMOOTH SCROLL & ACTIVE NAV LINK
───────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_H = 70;

  // Smooth scroll on anchor click
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - NAV_H, behavior: 'smooth' });
    });
  });

  // Active nav highlighting via IntersectionObserver
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = navLinks.find(l => l.getAttribute('data-section') === entry.target.id);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: `-${NAV_H}px 0px -60% 0px`, threshold: 0 }
  );
  sections.forEach(s => observer.observe(s));
})();

/* ─────────────────────────────────────────
   5. TYPED HERO TEXT
───────────────────────────────────────── */
(function initTyped() {
  const el = $('#heroRole');
  if (!el) return;

  const roles = [
    'Data Scientist',
    'ML Engineer',
    'Deep Learning Dev',
    'Problem Solver',
    'CS Student @ AASTMT',
  ];

  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const current = roles[ri];
    if (deleting) {
      el.textContent = current.slice(0, --ci);
      if (ci <= 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(tick, 400); }
      return setTimeout(tick, 40);
    }
    el.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; return setTimeout(tick, 1800); }
    setTimeout(tick, 75);
  }

  setTimeout(tick, 1200); // start after preloader
})();

/* ─────────────────────────────────────────
   6. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
    { threshold: 0.1 }
  );
  // Observe all .reveal elements outside the hero (hero handled by preloader)
  $$('.reveal').forEach(el => {
    if (!el.closest('.hero')) observer.observe(el);
  });
})();

/* ─────────────────────────────────────────
   7. SKILL BAR ANIMATION
───────────────────────────────────────── */
(function initSkillBars() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const pct  = e.target.getAttribute('data-pct');
        const fill = e.target.querySelector('.bar-fill');
        if (fill) setTimeout(() => { fill.style.width = pct + '%'; }, 200);
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.3 }
  );
  $$('.bar-item').forEach(b => observer.observe(b));

  // GPA bar
  const gpaFills = $$('.gpa-fill');
  const gpaObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const pct = e.target.getAttribute('data-pct') || '97.25';
      setTimeout(() => { e.target.style.width = pct + '%'; }, 300);
      gpaObs.unobserve(e.target);
    }
  }), { threshold: 0.3 });
  gpaFills.forEach(f => gpaObs.observe(f));
})();

/* ─────────────────────────────────────────
   8. SKILLS TABS
───────────────────────────────────────── */
(function initTabs() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      // Update buttons
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Update panels
      $$('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = $(`#tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Trigger reveals inside panel
        $$('.reveal', panel).forEach(el => {
          if (!el.classList.contains('visible')) {
            setTimeout(() => el.classList.add('visible'), 50);
          }
        });
        // Re-trigger bar fills
        $$('.bar-item', panel).forEach(b => {
          const pct  = b.getAttribute('data-pct');
          const fill = b.querySelector('.bar-fill');
          if (fill) { fill.style.width = '0'; setTimeout(() => { fill.style.width = pct + '%'; }, 100); }
        });
      }
    });
  });
})();

/* ─────────────────────────────────────────
   9. CONTACT FORM
───────────────────────────────────────── */
(function initForm() {
  const form   = $('#contactForm');
  const status = $('#formStatus');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      return showStatus('Please fill in all required fields (*).', 'error');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showStatus('Please enter a valid email address.', 'error');
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    // Simulate send — swap with Formspree/EmailJS for real sending
    setTimeout(() => {
      showStatus('✅ Message sent! Mayer will reply to you soon.', 'success');
      form.reset();
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      btn.disabled = false;
    }, 1400);
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status ' + type;
  }
})();

/* ─────────────────────────────────────────
   10. BACK TO TOP BUTTON
───────────────────────────────────────── */
(function initBackTop() {
  const btn = $('#backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   11. FOOTER YEAR
───────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────
   12. PHOTO PLACEHOLDER — hover tooltip toggle
───────────────────────────────────────── */
(function initPhoto() {
  const ph   = $('#photoPlaceholder');
  const hint = ph ? ph.querySelector('.photo-hint') : null;
  if (!ph || !hint) return;
  hint.style.opacity = '0';
  hint.style.transition = 'opacity .3s ease';
  ph.addEventListener('mouseenter', () => { hint.style.opacity = '1'; });
  ph.addEventListener('mouseleave', () => { hint.style.opacity = '0'; });
})();
