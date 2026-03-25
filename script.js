// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile menu toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-menu a');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => observerNav.observe(section));

// ===== Scroll fade-in animations =====
const fadeElements = document.querySelectorAll(
  '.member-card, .highlight-card, .extra-card, .concert-card, .contact-card, .gallery-item'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const observerFade = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => observerFade.observe(el));

// ===== Repertoire filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const songItems = document.querySelectorAll('.song-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    songItems.forEach(item => {
      const isInactive = item.querySelector('.song-inactive');
      if (filter === 'all') {
        item.classList.remove('hidden');
      } else if (filter === 'active') {
        item.classList.toggle('hidden', !!isInactive);
      }
    });
  });
});
