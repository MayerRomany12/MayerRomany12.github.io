/* ═══════════════════════════════════════════════════════════════
   MAYER ROMANY — PORTFOLIO JAVASCRIPT
   Features: typed text, scroll reveals, skill bars, theme toggle,
             custom cursor, smooth nav, contact form feedback
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────
// 1. LUCIDE ICONS — initialise after DOM ready
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  initCursor();
  initNav();
  initTheme();
  initTyped();
  initReveal();
  initSkillBars();
  initContactForm();
  setYear();
});

// ─────────────────────────────────────────
// 2. CUSTOM CURSOR
// ─────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Lerp the trail
  (function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  })();

  // Scale on interactive elements
  document.querySelectorAll('a, button, .project-card, .skill-group').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      trail.style.transform  = 'translate(-50%,-50%) scale(0.5)';
      trail.style.opacity    = '0.15';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
      trail.style.opacity    = '0.4';
    });
  });
}

// ─────────────────────────────────────────
// 3. NAVIGATION — sticky + mobile burger
// ─────────────────────────────────────────
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Burger
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ─────────────────────────────────────────
// 4. DARK / LIGHT THEME TOGGLE
// ─────────────────────────────────────────
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // Re-init icons so sun/moon visibility is correct
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
}

// ─────────────────────────────────────────
// 5. TYPED TEXT ANIMATION
// ─────────────────────────────────────────
function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;

  const strings = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Deep Learning Enthusiast',
    'Computer Science Student',
  ];

  let si = 0, ci = 0, deleting = false;
  const typeSpeed = 80, deleteSpeed = 45, pause = 1800;

  function tick() {
    const current = strings[si];
    if (deleting) {
      el.textContent = current.substring(0, ci--);
      if (ci < 0) { deleting = false; si = (si + 1) % strings.length; setTimeout(tick, 400); return; }
      setTimeout(tick, deleteSpeed);
    } else {
      el.textContent = current.substring(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(tick, pause); return; }
      setTimeout(tick, typeSpeed);
    }
  }

  tick();
}

// ─────────────────────────────────────────
// 6. SCROLL REVEAL
// ─────────────────────────────────────────
function initReveal() {
  // Hero elements trigger immediately
  document.querySelectorAll('.hero .reveal, .hero [class*="reveal-delay"]').forEach(el => {
    el.classList.add('in-view');
  });

  // Other sections via IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Auto-wrap every direct child of .section in reveal class
  document.querySelectorAll('.section .container > *, .section .about-grid > *, .section .skills-grid > *, .section .projects-grid > *, .section .timeline-item, .section .edu-grid > *, .section .contact-channels > *, .section .contact-form-wrap').forEach((el, i) => {
    if (!el.classList.contains('section-label') && !el.classList.contains('section-title') && !el.classList.contains('contact-sub')) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.07) + 's';
    }
    observer.observe(el);
  });

  // Also observe section labels and titles
  document.querySelectorAll('.section-label, .section-title, .contact-sub').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ─────────────────────────────────────────
// 7. SKILL BAR ANIMATION
// ─────────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-item');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const pct  = item.getAttribute('data-pct') || '0';
          const fill = item.querySelector('.skill-fill');
          if (fill) {
            // Small delay for staggered feel
            setTimeout(() => { fill.style.width = pct + '%'; }, 150);
          }
          observer.unobserve(item);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

// ─────────────────────────────────────────
// 8. CONTACT FORM — client-side feedback
//    (real email requires a backend / Formspree / EmailJS)
// ─────────────────────────────────────────
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const notice = document.getElementById('formNotice');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showNotice('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotice('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate success (swap for real Formspree / EmailJS endpoint)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      showNotice('✅ Message sent! Mayer will get back to you soon.', 'success');
      form.reset();
      btn.innerHTML = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
      btn.disabled = false;
    }, 1200);
  });

  function showNotice(msg, type) {
    notice.textContent = msg;
    notice.className = 'form-notice ' + type;
  }
}

// ─────────────────────────────────────────
// 9. FOOTER YEAR
// ─────────────────────────────────────────
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─────────────────────────────────────────
// 10. SMOOTH SCROLL for anchor links
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - navH + 2, behavior: 'smooth' });
  });
});
