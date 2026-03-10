/* ═══════════════════════════════════════════════════════════════════
   script.js  —  Ankit Singh Portfolio
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   DOM REFS
────────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose= document.getElementById('mobileClose');
const downloadBtn= document.getElementById('downloadBtn');
const sendBtn    = document.getElementById('sendBtn');
const toast      = document.getElementById('toast');
const toastMsg   = document.getElementById('toastMsg');

const cname    = document.getElementById('cname');
const cemail   = document.getElementById('cemail');
const csubject = document.getElementById('csubject');
const cmessage = document.getElementById('cmessage');


/* ──────────────────────────────────────────────
   MOBILE MENU
────────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileClose.addEventListener('click', closeMobileMenu);

// close on nav link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}


/* ──────────────────────────────────────────────
   STICKY NAV — shadow on scroll
────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  updateActiveNav();
});


/* ──────────────────────────────────────────────
   ACTIVE NAV LINK
────────────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}


/* ──────────────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings slightly
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let idx = Array.from(siblings).indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.08) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ──────────────────────────────────────────────
   SKILL PROGRESS BARS
────────────────────────────────────────────── */
const skillsSection = document.getElementById('skills');

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.progress-bar').forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        // slight stagger per bar
        const idx = Array.from(document.querySelectorAll('.progress-bar')).indexOf(bar);
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, idx * 80);
      });
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

if (skillsSection) skillsObserver.observe(skillsSection);


/* ──────────────────────────────────────────────
   TOAST NOTIFICATION
────────────────────────────────────────────── */
let toastTimer = null;

function showToast(message, isError = false) {
  toastMsg.textContent = message;
  toast.querySelector('i').className = isError
    ? 'fas fa-exclamation-circle'
    : 'fas fa-check-circle';
  toast.style.borderColor = isError
    ? 'rgba(239,68,68,0.4)'
    : 'rgba(14,165,233,0.3)';
  toast.querySelector('i').style.color = isError ? '#ef4444' : 'var(--cyan)';

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
}


/* ──────────────────────────────────────────────
   RESUME DOWNLOAD BUTTON
────────────────────────────────────────────── */
if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Resume download started! 📄');
    // In production, replace href with actual PDF path:
    // window.open('assets/AnkitSingh_Resume.pdf', '_blank');
  });
}


/* ──────────────────────────────────────────────
   CONTACT FORM
────────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (sendBtn) {
  sendBtn.addEventListener('click', handleContactSubmit);
}

function handleContactSubmit() {
  const name    = cname.value.trim();
  const email   = cemail.value.trim();
  const subject = csubject.value.trim();
  const message = cmessage.value.trim();

  // Validation
  if (!name) {
    showToast('Please enter your name.', true);
    cname.focus();
    return;
  }
  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address.', true);
    cemail.focus();
    return;
  }
  if (!message) {
    showToast('Please enter a message.', true);
    cmessage.focus();
    return;
  }

  // Loading state
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate async send (replace with real fetch/EmailJS in production)
  setTimeout(() => {
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    showToast('Message sent! I\'ll get back to you soon 🚀');

    // Clear form
    cname.value    = '';
    cemail.value   = '';
    csubject.value = '';
    cmessage.value = '';
  }, 1200);
}

// Allow submit on Enter key in inputs (except textarea)
[cname, cemail, csubject].forEach(input => {
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleContactSubmit();
    });
  }
});


/* ──────────────────────────────────────────────
   SMOOTH SCROLL for all anchor links
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ──────────────────────────────────────────────
   ORB PARALLAX  (subtle mouse tracking)
────────────────────────────────────────────── */
const heroOrb = document.getElementById('heroOrb');

if (heroOrb) {
  document.addEventListener('mousemove', (e) => {
    const xFraction = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
    const yFraction = (e.clientY / window.innerHeight - 0.5) * 2;
    heroOrb.style.transform = `translateY(-50%) translate(${xFraction * 14}px, ${yFraction * 10}px)`;
  });
}


/* ──────────────────────────────────────────────
   TYPING EFFECT  (hero tagline cycling)
────────────────────────────────────────────── */
const taglines = [
  'BCA Student',
  'Aspiring Web Developer',
  'Tech Enthusiast',
  'Problem Solver',
  'Future Full-Stack Dev'
];

const taglineSpan = document.querySelector('.hero-tagline span');
if (taglineSpan) {
  let tagIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimer;

  function typeEffect() {
    const current = taglines[tagIndex];
    if (isDeleting) {
      taglineSpan.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      taglineSpan.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      // pause at end
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      tagIndex = (tagIndex + 1) % taglines.length;
      speed = 400;
    }

    typingTimer = setTimeout(typeEffect, speed);
  }

  // start after 1.5 s
  setTimeout(typeEffect, 1500);
}


/* ──────────────────────────────────────────────
   PROJECT CARD  — tilt on hover
────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, border-color 0.3s';
  });
});


/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
updateActiveNav();
