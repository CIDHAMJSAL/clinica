/**
 * Site CIDHA - Clínica de Direitos Humanos da Amazônia (UFPA)
 * Programa Mais Justiça Socioambiental na Amazônia Legal (MJSAL)
 * JavaScript Engine - Modern, Lightweight & Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initScrollspy();
  initAnimatedCounters();
  initGalleryFilters();
  initLightbox();
  initBackToTop();
  initSmoothScroll();
});

/* ==========================================================================
   1. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isActive);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. Sticky Header with Scroll Effect
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Scrollspy (Highlight active menu item)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   4. Animated Stat Counters
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let animated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();
    const suffix = el.getAttribute('data-suffix') || '';

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(start + (target - start) * ease);

      el.innerText = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const statsContainer = document.querySelector('.stats-bar');
  if (statsContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(animateCounter);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsContainer);
  }
}

/* ==========================================================================
   5. Gallery Category Filters
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Lightbox Modal (Gallery & Case Studies)
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-desc');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');

  let currentIndex = 0;
  let activeItems = [];

  const updateActiveList = (groupClass) => {
    if (groupClass === 'case-media-item') {
      activeItems = Array.from(document.querySelectorAll('.case-media-item'));
    } else {
      activeItems = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => item.style.display !== 'none');
    }
  };

  const showImage = (index) => {
    if (!activeItems.length) return;

    if (index < 0) index = activeItems.length - 1;
    if (index >= activeItems.length) index = 0;

    currentIndex = index;
    const currentItem = activeItems[currentIndex];
    const imgEl = currentItem.querySelector('img');
    const title = currentItem.getAttribute('data-title') || imgEl.alt;
    const desc = currentItem.getAttribute('data-desc') || '';

    lightboxImg.src = imgEl.src;
    lightboxImg.alt = title;
    lightboxTitle.innerText = title;
    lightboxDesc.innerText = desc;
    lightboxCounter.innerText = `${currentIndex + 1} de ${activeItems.length}`;
  };

  const openLightbox = (item, groupClass) => {
    updateActiveList(groupClass);
    currentIndex = activeItems.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;

    showImage(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item, 'gallery-item'));
  });

  document.querySelectorAll('.case-media-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item, 'case-media-item'));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrap')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      showImage(currentIndex + 1); // swipe left
    }
    if (touchEndX > touchStartX + 50) {
      showImage(currentIndex - 1); // swipe right
    }
  }, { passive: true });
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. Smooth Scroll for Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
