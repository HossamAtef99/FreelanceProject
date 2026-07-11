/* ============================================
   OMAR PHONE — Main JavaScript
   Core Functionality
   ============================================ */

(function() {
  'use strict';

  /* ----- DOM Ready ----- */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initMobileMenu();


    initStickyHeader();
    initScrollReveal();
    initBackToTop();
    initCounters();
    initTestimonials();
    initAccordions();
    initQuantityControls();
    initCartBadge();
    initWishlistBadge();
    initSearchToggle();
    initHeroReveal();
    initNewsletter();
    initToast();
    initProductCardLinks();
    initAdminLink();
    initAccountLink();
  });

  /* ----- Preloader ----- */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 800);
    });
    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
      }
    }, 3000);
  }

  /* ----- Mobile Menu ----- */
  function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const close = document.getElementById('mobileClose');
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    if (!toggle || !menu) return;

    function open() {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ----- Navbar Dropdown ----- */
  /* ----- Sticky Header ----- */
  function initStickyHeader() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ----- Scroll Reveal ----- */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ----- Back to Top ----- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Animated Counters ----- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          if (isNaN(target)) return;
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el, target) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const suffix = el.dataset.suffix || '+';

    function tick() {
      step++;
      current = Math.min(Math.round(increment * step), target);
      el.textContent = current.toLocaleString() + suffix;
      if (current < target) {
        setTimeout(tick, stepDuration);
      }
    }
    tick();
  }

  /* ----- Testimonials Slider ----- */
  function initTestimonials() {
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!track || !dots.length) return;

    let current = 0;
    let interval;
    const total = dots.length;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[current].classList.add('active');
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        resetInterval();
      });
    });

    function resetInterval() {
      if (interval) clearInterval(interval);
      interval = setInterval(() => goTo(current + 1), 5000);
    }

    resetInterval();
    goTo(0);
  }

  /* ----- Accordion ----- */
  function initAccordions() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item.active').forEach(el => {
          el.classList.remove('active');
        });

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });

    // Sidebar filter accordions
    document.querySelectorAll('.sidebar-heading').forEach(heading => {
      heading.addEventListener('click', () => {
        heading.classList.toggle('collapsed');
        const content = heading.nextElementSibling;
        if (content) {
          content.classList.toggle('collapsed');
        }
      });
    });
  }

  /* ----- Quantity Controls ----- */
  function initQuantityControls() {
    document.querySelectorAll('.product-info-qty, .cart-item-qty').forEach(container => {
      const input = container.querySelector('input');
      const minus = container.querySelector('.qty-minus');
      const plus = container.querySelector('.qty-plus');
      if (!input) return;

      const min = parseInt(input.min, 10) || 1;
      const max = parseInt(input.max, 10) || 99;

      if (minus) {
        minus.addEventListener('click', () => {
          let val = parseInt(input.value, 10) || min;
          if (val > min) {
            input.value = val - 1;
            triggerEvent(input, 'change');
          }
        });
      }

      if (plus) {
        plus.addEventListener('click', () => {
          let val = parseInt(input.value, 10) || min;
          if (val < max) {
            input.value = val + 1;
            triggerEvent(input, 'change');
          }
        });
      }

      input.addEventListener('change', () => {
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < min) input.value = min;
        if (val > max) input.value = max;
      });
    });
  }

  /* ----- Cart Badge ----- */
  function initCartBadge() {
    updateBadge('cartBadge', getCart());
  }

  function initWishlistBadge() {
    updateBadge('wishlistBadge', getWishlist());
  }

  function updateBadge(id, items) {
    const badge = document.getElementById(id);
    if (!badge) return;
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  /* ----- Cart Management ----- */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('omar_cart')) || [];
    } catch { return []; }
  }

  function setCart(items) {
    localStorage.setItem('omar_cart', JSON.stringify(items));
    updateBadge('cartBadge', items);
    triggerEvent(document, 'cartUpdated');
  }

  function isLoggedIn() {
    return localStorage.getItem('op_user_logged') === '1';
  }

  function requireAuth() {
    if (isLoggedIn()) return true;
    showToast('Please sign in first', 'error');
    setTimeout(() => window.location.href = 'login.html', 800);
    return false;
  }

  function addToCart(product) {
    if (!requireAuth()) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id && item.storage === product.storage && item.color === product.color);
    if (existing) {
      existing.quantity += product.quantity || 1;
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }
    setCart(cart);
    showToast('Added to cart!', 'success');
  }

  function removeFromCart(id, storage, color) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === id && item.storage === storage && item.color === color));
    setCart(cart);
    showToast('Removed from cart', 'error');
  }

  function updateCartQuantity(id, storage, color, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === id && item.storage === storage && item.color === color);
    if (item) {
      item.quantity = quantity;
      setCart(cart);
    }
  }

  function clearCart() {
    setCart([]);
  }

  /* ----- Wishlist Management ----- */
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('omar_wishlist')) || [];
    } catch { return []; }
  }

  function setWishlist(items) {
    localStorage.setItem('omar_wishlist', JSON.stringify(items));
    updateBadge('wishlistBadge', items);
    triggerEvent(document, 'wishlistUpdated');
  }

  function toggleWishlist(product) {
    if (!requireAuth()) return false;
    const wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      wishlist.splice(index, 1);
      setWishlist(wishlist);
      showToast('Removed from wishlist', 'error');
      return false;
    } else {
      wishlist.push({ id: product.id, name: product.name, image: product.image, price: product.price, storage: product.storage, color: product.color });
      setWishlist(wishlist);
      showToast('Added to wishlist!', 'success');
      return true;
    }
  }

  function isInWishlist(id) {
    return getWishlist().some(item => item.id === id);
  }

  /* ----- Search Toggle ----- */
  function initSearchToggle() {
    const btn = document.getElementById('searchToggle');
    const bar = document.getElementById('searchBar');
    const input = document.getElementById('searchBarInput');
    const close = document.getElementById('searchBarClose');
    if (!btn || !bar || !input || !close) return;

    btn.addEventListener('click', () => {
      bar.classList.toggle('open');
      if (bar.classList.contains('open')) {
        setTimeout(() => input.focus(), 100);
      }
    });

    close.addEventListener('click', () => {
      bar.classList.remove('open');
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });

    document.addEventListener('click', (e) => {
      if (!bar.contains(e.target) && !btn.contains(e.target)) {
        bar.classList.remove('open');
        input.value = '';
      }
    });
  }

  /* ----- Hero Reveal on Scroll ----- */
  function initHeroReveal() {
    const hero = document.querySelector('.hero');
    const phone = document.querySelector('.hero-phone-main');
    if (!hero || !phone) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          phone.style.animation = 'none';
          void phone.offsetWidth;
          phone.style.animation = '';
        }
      });
    }, { threshold: 0.3 });

    obs.observe(hero);
  }

  /* ----- Newsletter ----- */
  function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        showToast('Subscribed successfully!', 'success');
        input.value = '';
      }
    });
  }

  /* ----- Toast Notification ----- */
  function initToast() {
    if (!document.querySelector('.toast')) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast';
    if (type) toast.classList.add(type);
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ----- Helpers ----- */
  function getIcon(name) {
    const icons = {
      'dark_mode': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      'light_mode': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
      'search': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'heart': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
      'cart': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
      'user': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/></svg>',
      'menu': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
      'close': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
      'arrow_up': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
      'phone': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>',
      'check': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      'star': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      'star_empty': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      'truck': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M16 17h-5a2 2 0 0 1-2-2v-2"/><rect x="15" y="7" width="7" height="6" rx="1"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>',
      'shield': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      'refresh': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
      'tag': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" x2="7.01" y1="7" y2="7"/></svg>',
      'message': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      'mail': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
      'clock': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      'map_pin': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      'whatsapp': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>',
      'phone_call': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      'trash': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      'eye': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
      'compare': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>',
      'plus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      'minus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    };
    return icons[name] || '';
  }

  function triggerEvent(el, type) {
    const event = new Event(type, { bubbles: true });
    el.dispatchEvent(event);
  }

  function initProductCardLinks() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('button, a')) return;
        const btn = card.querySelector('.wishlist-btn');
        if (btn) {
          const id = btn.dataset.id;
          if (id) window.location.href = 'product-detail.html?id=' + id;
        }
      });
    });
  }

  /* ----- Expose to global scope ----- */
  function initAdminLink() {
    if (localStorage.getItem('op_admin_logged') === '1') {
      const nav = document.getElementById('adminNavLink');
      if (nav) nav.style.display = '';
      const mobile = document.getElementById('adminMobileLink');
      if (mobile) mobile.style.display = '';
    }
  }

  function initAccountLink() {
    const link = document.getElementById('accountLink');
    if (!link) return;
    if (localStorage.getItem('op_user_logged') === '1') {
      link.href = 'profile.html';
      addProfileMobileLink();
    } else {
      link.href = 'login.html';
    }
  }

  function addProfileMobileLink() {
    const container = document.querySelector('.mobile-menu-links');
    if (!container) return;
    if (container.querySelector('.profile-mobile-link')) return;
    const divider = container.querySelector('.mobile-menu-divider');
    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.className = 'mobile-menu-link profile-mobile-link';
    profileLink.textContent = 'Profile';
    if (divider && divider.nextSibling) {
      container.insertBefore(profileLink, divider.nextSibling);
    } else {
      container.appendChild(profileLink);
    }
  }

  window.OmarPhone = {
    getCart,
    setCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getWishlist,
    setWishlist,
    toggleWishlist,
    isInWishlist,
    showToast,
    getIcon,
    updateBadge,
    isLoggedIn,
    requireAuth,
  };

})();
