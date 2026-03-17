/* ===========================
   MAIN.JS — DUAL STACK
   =========================== */

// ——— Navbar scroll effect ———
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ——— Hamburger menu ———
const toggleMenu = () => {
  navbar.classList.toggle('menu-open');
  // Lock scroll when menu is open
  if (navbar.classList.contains('menu-open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

hamburger?.addEventListener('click', toggleMenu);

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    // Add effect class
    link.classList.add('active-selection');
    
    // Small delay to see the color effect before closing
    setTimeout(() => {
      navbar.classList.remove('menu-open');
      document.body.style.overflow = '';
      link.classList.remove('active-selection');
    }, 250);
  });
});

// Reset menu on resize (prevent locked scroll if transitioning to desktop)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navbar.classList.contains('menu-open')) {
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  }
});

// ——— Reveal on scroll ———
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger children in the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const i = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ——— Parallax orbs on mouse move ———
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { offsetWidth: w, offsetHeight: h } = currentTarget;
    const dx = (clientX / w - 0.5) * 30;
    const dy = (clientY / h - 0.5) * 30;

    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
      const factor = (i + 1) * 0.4;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
}

// ——— Smooth active nav link highlight ———
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ——— Contact form submission with Formspree ———
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// ——— Contact form submission with FormSubmit ———
// ——— Contact form submission (AJAX for live server) ———
/* 
form?.addEventListener('submit', async (e) => {
  // Comentado temporalmente para permitir un envío web tradicional. 
  // Esto forzará al servidor de FormSubmit a enviar el mail de activación 
  // vitalicio a la cuenta de Dual Stack sin ser bloqueado por AJAX.
});
*/

// ——— Dynamic year in footer ———
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  yearEl.innerHTML = yearEl.innerHTML.replace('2026', new Date().getFullYear());
}

// ——— Canvas particle network (contact background) ———
(function createParticleNetwork() {
  const section = document.querySelector('.contact');
  if (!section) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.45;';
  section.insertBefore(canvas, section.firstChild);

  const ctx = canvas.getContext('2d');
  let w, h, particles, animFrame;

  const colors = ['#4F8CFF', '#7B61FF', '#00E5FF'];
  const NUM = 60;

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / 140) * 0.18;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // particles
    particles.forEach(p => {
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ——— Hero floating cards subtle mouse parallax ———
document.querySelectorAll('.hero-float-card').forEach((card, i) => {
  document.addEventListener('mousemove', (e) => {
    const factor = (i + 1) * 0.008;
    const dx = (e.clientX - window.innerWidth / 2) * factor;
    const dy = (e.clientY - window.innerHeight / 2) * factor;
    card.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});

// ——— Active nav link style ———
const style = document.createElement('style');
style.textContent = '.nav-links a.active-link { color: #E8EEFF; } .nav-links a.active-link::after { width: 100%; }';
document.head.appendChild(style);
