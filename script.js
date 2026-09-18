// ===== Protected booking contact links =====
// Keep the contact details out of the initial HTML so simple scrapers do not
// collect them, while exposing normal readable and clickable links to people.
(function initBookingContacts() {
  const phoneLink = document.getElementById('booking-phone');
  const emailLink = document.getElementById('booking-email');

  if (!phoneLink || !emailLink) return;

  const phoneParts = ['+420', '604', '518', '184'];
  const phone = phoneParts.join(' ');
  const emailParts = ['JakubHusty', 'seznam', 'cz'];
  const email = `${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`;

  phoneLink.href = `tel:${phone.replace(/\s/g, '')}`;
  phoneLink.querySelector('span').textContent = phone;

  emailLink.href = `mailto:${email}`;
  emailLink.querySelector('span').textContent = email;
})();

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== Mobile menu toggle =====
const menuToggle = document.getElementById('menuToggle') || document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-menu');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('.section, .hero');
const navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];

if (sections.length && navAnchors.length) {
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observerNav.observe(section));
}

// ===== Scroll fade-in animations =====
const fadeElements = document.querySelectorAll(
  '.member-card, .highlight-card, .extra-card, .concert-card, .contact-card, .gallery-item, .media-video-card, .media-audio-card'
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

// ===== Audio soundboard player =====
const sTracks = document.querySelectorAll('.s-track');

sTracks.forEach(track => {
  const btn = track.querySelector('.s-track-btn');
  const audio = track.querySelector('audio');
  const iconPlay = track.querySelector('.icon-play');
  const iconPause = track.querySelector('.icon-pause');

  btn.addEventListener('click', () => {
    const isPlaying = !audio.paused;

    // Stop all other tracks first
    sTracks.forEach(other => {
      if (other !== track) {
        const otherAudio = other.querySelector('audio');
        const otherPlay = other.querySelector('.icon-play');
        const otherPause = other.querySelector('.icon-pause');
        otherAudio.pause();
        otherAudio.currentTime = 0;
        otherPlay.style.display = '';
        otherPause.style.display = 'none';
        other.classList.remove('active');
      }
    });

    if (isPlaying) {
      audio.pause();
      iconPlay.style.display = '';
      iconPause.style.display = 'none';
      track.classList.remove('active');
    } else {
      audio.play();
      iconPlay.style.display = 'none';
      iconPause.style.display = '';
      track.classList.add('active');
    }
  });

  // Reset icon when track ends naturally
  audio.addEventListener('ended', () => {
    iconPlay.style.display = '';
    iconPause.style.display = 'none';
    track.classList.remove('active');
  });
});

// ===== Photo Gallery Lightbox =====
(function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));

  if (galleryItems.length === 0) return;

  const galleryData = galleryItems.map((item, idx) => {
    const img = item.querySelector('img');
    const caption = item.dataset.caption || (item.querySelector('h4') ? item.querySelector('h4').textContent : '') || (img ? img.alt : '');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') || caption : caption,
      caption: caption
    };
  });

  let currentIndex = 0;

  function updateLightbox(index) {
    if (index < 0) {
      index = galleryData.length - 1;
    } else if (index >= galleryData.length) {
      index = 0;
    }
    currentIndex = index;

    const data = galleryData[currentIndex];
    lightboxImg.classList.remove('loaded');
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;

    // Preload image before showing fade
    lightboxImg.onload = () => {
      lightboxImg.classList.add('loaded');
    };
  }

  function openLightbox(index) {
    updateLightbox(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      updateLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightbox(currentIndex + 1);
    }
  }

  // Click on gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Event delegation on lightbox controls
  lightbox.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'close') {
      closeLightbox();
    } else if (action === 'prev') {
      updateLightbox(currentIndex - 1);
    } else if (action === 'next') {
      updateLightbox(currentIndex + 1);
    }
  });
})();
