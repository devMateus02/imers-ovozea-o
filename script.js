
  

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. SCROLL ANIMATION OBSERVER ─────────────────────── */
  const animElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animElements.forEach(el => observer.observe(el));


  /* ─── 2. TESTIMONIALS CAROUSEL ──────────────────────────── */
  const carousel      = document.getElementById('testimonialsCarousel');
  const prevBtn       = document.getElementById('prevTestimonial');
  const nextBtn       = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialDots');

  if (carousel && prevBtn && nextBtn) {
    const cards        = carousel.querySelectorAll('.testimonial-card');
    let currentIndex   = 0;
    let isDragging     = false;
    let startX         = 0;
    let scrollStart    = 0;
    const CARD_WIDTH   = () => cards[0]?.offsetWidth + 19 || 319; // card + gap

    /* Build dots */
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function updateDots() {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function getMaxIndex() {
      const visible = Math.floor(carousel.offsetWidth / CARD_WIDTH());
      return Math.max(0, cards.length - visible);
    }

    function goTo(index) {
      const max   = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, max));
      carousel.scrollTo({ left: currentIndex * CARD_WIDTH(), behavior: 'smooth' });
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    /* Drag / swipe */
    carousel.addEventListener('mousedown', e => {
      isDragging  = true;
      startX      = e.pageX;
      scrollStart = carousel.scrollLeft;
      carousel.classList.add('is-dragging');
    });
    document.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove('is-dragging');
      const diff = startX - e.pageX;
      if (Math.abs(diff) > 60) diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      carousel.scrollLeft = scrollStart + (startX - e.pageX);
    });

    /* Touch */
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    });

    /* Sync dots on native scroll */
    carousel.addEventListener('scroll', () => {
      currentIndex = Math.round(carousel.scrollLeft / CARD_WIDTH());
      updateDots();
    }, { passive: true });
  }


  /* ─── 3. GALLERY LIGHTBOX ───────────────────────────────── */
  const lightbox        = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose   = document.getElementById('lightboxClose');
  const galleryItems    = document.querySelectorAll('.gallery-item');

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        // If placeholder, do nothing (no real image)
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxContent.innerHTML = ''; }, 300);
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }


  /* ─── 4. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ─── 5. HERO PARALLAX (subtle) ────────────────────────── */
  const heroBg = document.querySelector('.hero__bg-texture');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.15}px)`;
    }, { passive: true });
  }


  /* ─── 6. STAGGER PAIN CARDS ────────────────────────────── */
  const painGrid = document.querySelector('.pain__grid');
  if (painGrid) {
    const painCards = painGrid.querySelectorAll('.pain__card');
    const painObs   = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        painCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 80);
        });
        painObs.unobserve(painGrid);
      }
    }, { threshold: 0.1 });

    painCards.forEach(card => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    painObs.observe(painGrid);
  }


  /* ─── 7. BENEFIT CARDS STAGGER ─────────────────────────── */
  const benefitsGrid = document.querySelector('.benefits__grid');
  if (benefitsGrid) {
    const bCards = benefitsGrid.querySelectorAll('.benefit-card');
    const bObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        bCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, i * 70);
        });
        bObs.unobserve(benefitsGrid);
      }
    }, { threshold: 0.1 });

    bCards.forEach(card => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(28px)';
      card.style.transition = 'opacity 0.55s ease, transform 0.55s ease, border-color 0.35s, background 0.35s, box-shadow 0.35s';
    });
    bObs.observe(benefitsGrid);
  }


  /* ─── 8. STAT COUNTER ANIMATION ────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''));
      const suffix = raw.replace(/[\d]/g, '');
      if (!num) return;

      let start = 0;
      const duration = 1200;
      const step     = 16;
      const increment = num / (duration / step);

      const timer = setInterval(() => {
        start += increment;
        if (start >= num) {
          el.textContent = suffix ? (suffix.startsWith('+') ? '+' + num + suffix.slice(1) : num + suffix) : String(num);
          clearInterval(timer);
        } else {
          el.textContent = suffix
            ? (suffix.startsWith('+') ? '+' + Math.floor(start) + suffix.slice(1) : Math.floor(start) + suffix)
            : String(Math.floor(start));
        }
      }, step);

      statObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(n => statObs.observe(n));


  /* ─── 9. ACTIVE NAV HIGHLIGHT (optional) ────────────────── */
  // No fixed nav in this design, but keeping logic ready if needed.


  /* ─── 10. GOLD SHIMMER ON HERO TITLE ────────────────────── */
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    setTimeout(() => {
      heroTitle.style.opacity = '1';
    }, 100);
  }

}); // end DOMContentLoaded