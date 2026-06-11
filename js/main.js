/* =============================================
   OSHADHI KUMARASINGHE — PORTFOLIO  |  main.js
============================================= */

'use strict';

// ---- NAV: scroll effect + active link ----
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  const scrollY = window.scrollY;

  // Scrolled state
  if (scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active link highlighting
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${current}`
    );
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  const isOpen = navLinksContainer.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // animate hamburger into X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
navLinksContainer.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

// ---- SCROLL SPINE ----
const spineLine = document.getElementById('spineLine');
const spineDot = document.getElementById('spineDot');

function updateSpine() {
  if (!spineLine || !spineDot) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min((scrollTop / docHeight) * 100, 100);
  spineLine.style.height = progress + '%';
  spineDot.style.top = progress + '%';
}

window.addEventListener('scroll', updateSpine, { passive: true });
updateSpine();

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        entry.target.querySelectorAll('.reveal').forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 90);
        });
        entry.target.classList.add('visible');
        // Don't unobserve so elements persist
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

// Add reveal class to elements we want to animate
const revealSelectors = [
  '.project-card',
  '.cert-card',
  '.reflect-card',
  '.career__item',
  '.info-card',
  '.gallery__item',
  '.about__text',
  '.about__card-col',
  '.contact__info',
  '.contact__form',
  '.section__heading',
  '.section__sub',
  '.hero__content',
  '.hero__visual',
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, idx) => {
    el.classList.add('reveal');
    // Cascade delay for grid items
    if (
      el.closest('.projects__grid') ||
      el.closest('.certs__grid') ||
      el.closest('.reflective__timeline') ||
      el.closest('.gallery__grid')
    ) {
      el.style.transitionDelay = `${idx * 0.08}s`;
    }
  });
});

// Observe all sections
sections.forEach(section => {
  revealObserver.observe(section);
});

// Also observe individual elements for top-level sections
document.querySelectorAll('.reveal').forEach(el => {
  const directObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  directObserver.observe(el);
});

// ---- GALLERY FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery__item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');

    // Simple validation
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      shakeForm(btn);
      return;
    }

    // Simulate send
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      formSuccess.hidden = false;
      setTimeout(() => { formSuccess.hidden = true; }, 5000);
    }, 1400);
  });
}

function shakeForm(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  if (!document.querySelector('#shakeStyle')) {
    const style = document.createElement('style');
    style.id = 'shakeStyle';
    style.textContent = `
      @keyframes shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)}
        40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)}
        80%{transform:translateX(4px)}
      }
    `;
    document.head.appendChild(style);
  }
}

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- CURSOR TEAL GLOW (desktop only) ----
if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: left 0.18s ease, top 0.18s ease;
    left: -200px; top: -200px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
