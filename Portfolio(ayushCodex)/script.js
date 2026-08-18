/* =========================================================
   UMANG KUMAR GUPTA — PREMIUM PORTFOLIO SCRIPT
   Vanilla JS only: particle canvas, nav behavior, typing
   effect, scroll reveals, animated counters & skill bars,
   contact form, hero photo fallback.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: blur / border on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onNavScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  onNavScroll();
  window.addEventListener('scroll', onNavScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('mobile-open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('mobile-open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinkEls = document.querySelectorAll('[data-nav]');

  const setActiveLink = (id) => {
    navLinkEls.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveLink(entry.target.id); }),
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- Generic scroll-reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Hero photo fallback (no profile.jpg uploaded yet) ---------- */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto) {
    heroPhoto.addEventListener('error', () => heroPhoto.classList.add('broken'));
  }

  /* ---------- Hero role typing / deleting loop ---------- */
  const typedRoleEl = document.getElementById('typedRole');
  const roles = [
    'Computer Science Student',
    'DSA Enthusiast',
    'Java & Python Developer',
    'Git & GitHub Regular',
    'AI-Curious Coder',
  ];

  if (typedRoleEl) {
    if (prefersReducedMotion) {
      typedRoleEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const typeLoop = () => {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex += 1;
          typedRoleEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, 1600); // pause on full word
            return;
          }
          setTimeout(typeLoop, 55);
        } else {
          charIndex -= 1;
          typedRoleEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeLoop, 300);
            return;
          }
          setTimeout(typeLoop, 30);
        }
      };

      setTimeout(typeLoop, 500);
    }
  }

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));

  /* ---------- Animated skill progress bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  const animateSkillBar = (bar) => {
    const fill = bar.querySelector('.skill-fill');
    const pctEl = bar.querySelector('.skill-pct');
    const target = parseInt(fill.dataset.fill, 10) || 0;

    fill.style.width = target + '%';

    if (prefersReducedMotion) {
      pctEl.textContent = target + '%';
      return;
    }

    const duration = 1000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      pctEl.textContent = Math.round(progress * target) + '%';
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ---------- Contact form (front-end only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();

      if (!contactForm.checkValidity()) {
        formStatus.textContent = '// please fill in all fields correctly';
        formStatus.style.color = 'var(--accent-amber)';
        return;
      }

      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      formStatus.textContent = '// sending...';
      formStatus.style.color = 'var(--text-muted)';

      setTimeout(() => {
        formStatus.textContent = `// message sent — thanks, ${name || 'friend'}! I'll reply soon.`;
        formStatus.style.color = 'var(--accent-green)';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 900);
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Cursor glow (desktop pointer only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  /* =========================================================
     PARTICLE BACKGROUND — lightweight canvas, connecting dots
     that drift slowly and link when close together.
     ========================================================= */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let animationId;
    let isVisible = true;

    const COLORS = ['rgba(95, 212, 212,', 'rgba(139, 124, 246,'];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const density = Math.min(width, 1600) / 14000; // scales with viewport
      const count = Math.max(28, Math.round(width * height * density / 1000));
      particles = Array.from({ length: Math.min(count, 90) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // update + draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.55)';
        ctx.fill();
      });

      // connecting lines for nearby particles
      const linkDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(95, 212, 212, ${0.12 * (1 - dist / linkDist)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (isVisible) animationId = requestAnimationFrame(step);
    }

    resize();
    createParticles();
    animationId = requestAnimationFrame(step);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        createParticles();
      }, 200);
    });

    document.addEventListener('visibilitychange', () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        animationId = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(animationId);
      }
    });
  } else if (canvas) {
    // reduced-motion: hide canvas entirely, rely on static glow blobs
    canvas.style.display = 'none';
  }

});