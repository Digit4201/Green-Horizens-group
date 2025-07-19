document.addEventListener('DOMContentLoaded', () => {
  // --- Caching DOM Elements ---
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const statNumbers = document.querySelectorAll('.stat-number');
  const timeline = document.querySelector('.process-timeline');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  const cookieBanner = document.getElementById('cookie-banner');
  const contactModal = document.getElementById('contact-modal');

  // --- Utility Functions ---
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // --- Initializations ---
  const initOverlay = () => {
    const overlay = document.querySelector('.photo-overlay');
    if (overlay) {
      overlay.addEventListener('animationend', () => body.classList.add('overlay-hidden'), { once: true });
    }
  };

  const initNavbar = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
  };

  const initModal = () => {
    if (!contactModal) return;
    const openContactModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtns = document.querySelectorAll('.modal-close-btn');

    const open = () => contactModal.classList.add('visible');
    const close = () => contactModal.classList.remove('visible');

    openContactModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    }));

    closeModalBtns.forEach(btn => btn.addEventListener('click', close));
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && contactModal.classList.contains('visible')) {
        close();
      }
    });
  };

  const initCookieBanner = () => {
    if (!cookieBanner) return;
    const acceptCookieBtn = cookieBanner.querySelector('.cookie-accept-btn');
    if (localStorage.getItem('cookiesAccepted')) return;

    setTimeout(() => cookieBanner.classList.add('visible'), 2000);

    if (acceptCookieBtn) {
      acceptCookieBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('visible');
      });
    }
  };

  const initTimeline = () => {
    if (!timeline) return;
    const timelineProgress = timeline.querySelector('.timeline-progress');
    const timelineItems = timeline.querySelectorAll('.timeline-item');

    const updateTimelineOnScroll = () => {
      if (timeline.classList.contains('is-hovered')) return;
      const timelineRect = timeline.getBoundingClientRect();
      const scrollPercent = (window.scrollY - (timeline.offsetTop - window.innerHeight * 0.8)) / (timeline.offsetHeight - window.innerHeight * 0.5);
      timelineProgress.style.height = `${Math.min(1, Math.max(0, scrollPercent)) * 100}%`;
    };

    timelineItems.forEach(item => {
      const marker = item.querySelector('.timeline-marker');
      item.addEventListener('mouseenter', () => {
        timeline.classList.add('is-hovered');
        const newHeight = item.offsetTop + marker.offsetHeight / 2;
        timelineProgress.style.height = `${newHeight}px`;
      });
    });

    timeline.addEventListener('mouseleave', () => {
      timeline.classList.remove('is-hovered');
      updateTimelineOnScroll();
    });

    window.addEventListener('scroll', updateTimelineOnScroll);
  };

  const initScrollBehavior = () => {
    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        if (!this.classList.contains('open-modal-btn')) {
          e.preventDefault();
          const targetElement = document.querySelector(this.getAttribute('href'));
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Scroll-to-top button
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  };

  const handleScrollEffects = () => {
    const scrollY = window.scrollY;
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const parallaxElements = document.querySelectorAll('.float-element');

    // Navbar scroll effect
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }

    // Parallax effect
    parallaxElements.forEach((element, index) => {
      const speed = 0.3 + (index * 0.1);
      element.style.transform = `translateY(${scrollY * -speed}px)`;
    });

    // Scroll-to-top button visibility
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('visible', scrollY > 300);
    }

    // Active nav link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionRect = section.getBoundingClientRect();
      if (sectionRect.top <= window.innerHeight * 0.2 && sectionRect.bottom >= window.innerHeight * 0.2) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const dataSection = link.getAttribute('data-section');
      if (dataSection && dataSection === currentSectionId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        // Optional: Update title based on section
        // if (document.title !== `Green Horizons - ${link.textContent}`) {
        //   document.title = `Green Horizons - ${link.textContent}`;
        // }
      }
    });
  };

  const initIntersectionObservers = () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    const animateCountUp = (el) => {
      const target = +el.getAttribute('data-target');
      const duration = 2000;
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      let currentFrame = 0;

      const counter = setInterval(() => {
        currentFrame++;
        const progress = currentFrame / totalFrames;
        const currentNum = Math.round(target * progress);
        el.textContent = currentNum > 0 ? `${currentNum}` : `-${Math.abs(currentNum)}`;


        if (currentFrame === totalFrames) {
          clearInterval(counter);
          el.textContent = target > 0 ? `${target}` : `-${Math.abs(target)}`;
        }
      }, frameRate);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.matches('.stat-number')) {
            animateCountUp(entry.target);
          }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeInElements.forEach(el => observer.observe(el));
    statNumbers.forEach(el => observer.observe(el));
  };

  // --- Main Execution ---
  initOverlay();
  initNavbar();
  initModal();
  initCookieBanner();
  initTimeline();
  initScrollBehavior();
  initIntersectionObservers();
  window.addEventListener('scroll', debounce(handleScrollEffects, 10));
});