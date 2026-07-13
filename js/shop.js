/* ============================================
   OMAR PHONE — Shop Page JavaScript
   ============================================ */

(function() {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  const fallbackProducts = [
    { id: 'iphone15pm', name: 'iPhone 15 Pro Max', brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center', price: 57499, oldPrice: 62499, storage: '256GB', ram: '8GB', colors: ['Titanium'], color: 'Titanium', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 128, stock: true, category: 'phones', badge: 'New', popular: 95 },
    { id: 's24ultra', name: 'Galaxy S24 Ultra', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', price: 52499, oldPrice: 62499, storage: '512GB', ram: '12GB', colors: ['Titanium Gray'], color: 'Titanium Gray', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 94, stock: true, category: 'phones', badge: 'Sale', popular: 90 },
    { id: 'pixel8pro', name: 'Pixel 8 Pro', brand: 'Google', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&crop=center', price: 42999, oldPrice: 47999, storage: '128GB', ram: '12GB', colors: ['Obsidian'], color: 'Obsidian', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 76, stock: true, category: 'phones', badge: '', popular: 88 },
    { id: 'oneplus12', name: 'OnePlus 12', brand: 'OnePlus', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop&crop=center', price: 33499, oldPrice: 37999, storage: '256GB', ram: '16GB', colors: ['Flowy Emerald'], color: 'Flowy Emerald', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 52, stock: true, category: 'phones', badge: 'Best Seller', popular: 85 },
    { id: 'iphone15', name: 'iPhone 15', brand: 'Apple', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', price: 37999, oldPrice: 0, storage: '128GB', ram: '6GB', colors: ['Pink'], color: 'Pink', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 210, stock: true, category: 'phones', badge: 'New', popular: 92 },
    { id: 'zfold5', name: 'Galaxy Z Fold 5', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center', price: 86499, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Icy Blue'], color: 'Icy Blue', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 43, stock: true, category: 'phones', badge: 'Premium', popular: 78 },
    { id: 'mi14pro', name: 'Xiaomi 14 Pro', brand: 'Xiaomi', image: 'https://images.unsplash.com/photo-1774437342043-12ffa8880899?w=400&h=400&fit=crop&crop=center', price: 35999, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Black'], color: 'Black', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 67, stock: true, category: 'phones', badge: '', popular: 80 },
    { id: 'nothing2', name: 'Phone 2', brand: 'Nothing', image: 'https://images.unsplash.com/photo-1675557009285-b55f562641b9?w=400&h=400&fit=crop&crop=center', price: 28499, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['White'], color: 'White', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 38, stock: true, category: 'phones', badge: 'New', popular: 82 },
    { id: 's23', name: 'Galaxy S23', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1689804847601-9648c50078bc?w=400&h=400&fit=crop&crop=center', price: 28499, oldPrice: 35999, storage: '128GB', ram: '8GB', colors: ['Phantom Black'], color: 'Phantom Black', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 210, stock: true, category: 'phones', badge: '-20%', popular: 75 },
    { id: 'ip14pm', name: 'iPhone 14 Pro Max', brand: 'Apple', image: 'https://images.unsplash.com/photo-1727093493864-0bcbd16c7e6d?w=400&h=400&fit=crop&crop=center', price: 42999, oldPrice: 52499, storage: '256GB', ram: '6GB', colors: ['Deep Purple'], color: 'Deep Purple', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 186, stock: true, category: 'phones', badge: '-18%', popular: 70 },
    { id: 'mi13tp', name: 'Xiaomi 13T Pro', brand: 'Xiaomi', image: 'https://images.unsplash.com/photo-1754331732629-d281d5797956?w=400&h=400&fit=crop&crop=center', price: 23999, oldPrice: 30999, storage: '256GB', ram: '12GB', colors: ['Alpine Blue'], color: 'Alpine Blue', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 92, stock: true, category: 'phones', badge: '-25%', popular: 65 },
    { id: 'op11', name: 'OnePlus 11', brand: 'OnePlus', image: 'https://images.unsplash.com/photo-1527747471697-174c755627dd?w=400&h=400&fit=crop&crop=center', price: 23999, oldPrice: 30999, storage: '256GB', ram: '16GB', colors: ['Eternal Green'], color: 'Eternal Green', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 78, stock: false, category: 'phones', badge: '-22%', popular: 60 },
    { id: 'honor90', name: 'Honor 90', brand: 'Honor', image: 'https://images.unsplash.com/photo-1551636898-47668aa61de2?w=400&h=400&fit=crop&crop=center', price: 21499, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Emerald Green'], color: 'Emerald Green', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 34, stock: true, category: 'phones', badge: 'New', popular: 55 },
    { id: 'oppofindn3', name: 'OPPO Find N3 Flip', brand: 'Oppo', image: 'https://images.unsplash.com/photo-1649859394614-dc4f7290b7f2?w=400&h=400&fit=crop&crop=center', price: 47999, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Gold'], color: 'Gold', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 22, stock: true, category: 'phones', badge: 'New', popular: 58 },
  ];

  let activeProducts = null;
  let filteredProducts = [];

  async function loadProducts() {
    try {
      const res = await fetch(API_BASE + '/api/products/all');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          activeProducts = data;
          return;
        }
      }
    } catch {}
    try {
      const stored = localStorage.getItem('op_admin_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          activeProducts = parsed;
          return;
        }
      }
    } catch {}
    activeProducts = fallbackProducts;
  }

  function getProducts() {
    return activeProducts || fallbackProducts;
  }

  function initProducts() {
    filteredProducts = [...getProducts()];
  }
  let currentPage = 1;
  const perPage = 9;

  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');

  document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    initProducts();
    renderProducts();

    if (searchParam) {
      document.getElementById('sidebarSearch').value = searchParam;
      applyFilters();
    }

    document.querySelectorAll('.filter-checkbox input').forEach(input => {
      input.addEventListener('change', applyFilters);
    });

    document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

    document.querySelectorAll('.sidebar-heading').forEach(h => {
      h.addEventListener('click', () => {
        h.classList.toggle('collapsed');
        const content = h.nextElementSibling;
        if (content) content.classList.toggle('collapsed');
      });
    });

    document.getElementById('sidebarSearch')?.addEventListener('input', debounce(applyFilters, 300));

    initPriceRange();

    initFilterSidebar();

    document.querySelector('.shop-container')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.wishlist-btn');
      if (btn) {
        const id = btn.dataset.id;
        const card = btn.closest('.product-card');
        if (!card) return;
        const name = card.querySelector('.product-card-title').textContent;
        const image = card.querySelector('.product-card-image img').src;
        const priceText = card.querySelector('.product-card-price').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const product = { id, name, image, price, storage: '', color: '' };

        if (window.OmarPhone) {
          window.OmarPhone.toggleWishlist(product);
          btn.classList.toggle('active');
        }
        return;
      }

      const addBtn = e.target.closest('.product-card-add');
      if (!addBtn) return;
      try {
        const product = JSON.parse(addBtn.dataset.product);
        if (window.OmarPhone) {
          window.OmarPhone.addToCart(product);
        }
      } catch (err) {}
    });

    initPriceRangeDisplay();
  });

  function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageItems = filteredProducts.slice(start, end);
    const totalPages = Math.ceil(filteredProducts.length / perPage);

    document.getElementById('resultCount').textContent = `Showing ${start + 1}-${Math.min(end, filteredProducts.length)} of ${filteredProducts.length} results`;

    if (pageItems.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 80px 24px;">
          <div style="font-size: 3rem; margin-bottom: 16px; opacity: 0.3;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 8px;">No products found</h3>
          <p style="color: var(--text-secondary);">Try adjusting your filters.</p>
        </div>
      `;
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    grid.innerHTML = pageItems.map(p => buildProductCard(p)).join('');

    renderPagination(totalPages);
  }

  function buildProductCard(p) {
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '½' : '');
    const badgeHtml = p.badge ? `<div class="product-card-badges"><span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span></div>` : '';
    const oldPriceHtml = p.oldPrice ? `<span class="product-card-old-price">EGP ${p.oldPrice.toLocaleString()}</span>` : '';
    const discountHtml = p.oldPrice ? `<span class="product-card-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '';
    const stockHtml = p.stock
      ? '<div class="product-card-stock in-stock">In Stock</div>'
      : '<div class="product-card-stock out-of-stock">Out of Stock</div>';
    const isLoved = window.OmarPhone && window.OmarPhone.isInWishlist(p.id);

    return `
      <div class="product-card">
        <div class="product-card-image">
          <a href="product-detail.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </a>
          ${badgeHtml}
          <div class="product-card-actions">
            <button class="product-card-action wishlist-btn ${isLoved ? 'active' : ''}" data-id="${p.id}" title="Add to wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLoved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <a href="product-detail.html?id=${p.id}" class="product-card-action" title="Quick view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
          </div>
        </div>
        <div class="product-card-body">
          <a href="product-detail.html?id=${p.id}">
            <div class="product-card-brand">${p.brand}</div>
            <h3 class="product-card-title">${p.name}</h3>
          </a>
          <div class="product-card-specs">
            <span class="product-card-spec">${p.storage}</span>
            <span class="product-card-spec">${p.ram} RAM</span>

          </div>
          <div class="product-card-rating">
            <div class="product-card-stars">${stars}</div>
            <span class="product-card-reviews">(${p.reviews} reviews)</span>
          </div>
          <div class="product-card-price-row">
            <span class="product-card-price">EGP ${p.price.toLocaleString()}</span>
            ${oldPriceHtml}
            ${discountHtml}
          </div>
          ${stockHtml}
          <button class="product-card-add" ${p.stock ? `data-product='${JSON.stringify({ id: p.id, name: p.name, image: p.image, price: p.price, storage: p.storage, color: p.color })}'` : 'disabled'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            ${p.stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    `;
  }

  function getBadgeClass(badge) {
    if (badge === 'New' || badge === 'Premium') return 'badge-new';
    if (badge.includes('%') || badge === 'Sale') return 'badge-sale';
    if (badge === 'Best Seller') return 'badge-excellent';
    return 'badge-new';
  }

  function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container || totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    if (currentPage > 1) {
      html += `<button class="pagination-btn" data-page="${currentPage - 1}">←</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (currentPage < totalPages) {
      html += `<button class="pagination-btn" data-page="${currentPage + 1}">→</button>`;
    }

    container.innerHTML = html;
    container.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        currentPage = parseInt(btn.dataset.page);
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function applyFilters() {
    const search = (document.getElementById('sidebarSearch')?.value || '').toLowerCase();
    const brands = getCheckedValues('brand');
    const ramValues = getCheckedValues('ram');
    const storageValues = getCheckedValues('storage');
    const sort = document.getElementById('sortSelect')?.value || 'popularity';

    filteredProducts = getProducts().filter(p => {
      if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false;
      if (brands.length && !brands.includes(p.brand.toLowerCase())) return false;
      if (ramValues.length && !ramValues.includes(p.ram.toLowerCase())) return false;
      if (storageValues.length && !storageValues.some(s => p.storage.toLowerCase() === s)) return false;

      const minPrice = parseFloat(document.getElementById('minPrice')?.value || 0);
      const maxPrice = parseFloat(document.getElementById('maxPrice')?.value || 9999);
      if (p.price < minPrice || p.price > maxPrice) return false;

      return true;
    });

    switch (sort) {
      case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
      case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
      case 'newest': filteredProducts.sort((a, b) => (a.badge === 'New' ? -1 : 1)); break;
      case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      default: filteredProducts.sort((a, b) => b.popular - a.popular); break;
    }

    currentPage = 1;
    renderProducts();
  }

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value.toLowerCase());
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  function initPriceRange() {
    const slider = document.getElementById('priceSlider');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');
    if (!slider || !minInput || !maxInput) return;

    const min = 0, max = 90000;

    minInput.addEventListener('change', () => { validateRange(); applyFilters(); });
    maxInput.addEventListener('change', () => { validateRange(); applyFilters(); });

    function validateRange() {
      let minVal = parseInt(minInput.value) || min;
      let maxVal = parseInt(maxInput.value) || max;
      if (minVal < min) minVal = min;
      if (maxVal > max) maxVal = max;
      if (minVal > maxVal) minVal = maxVal;
      minInput.value = minVal;
      maxInput.value = maxVal;
    }
  }

  function initPriceRangeDisplay() {
    document.querySelectorAll('.sidebar-heading').forEach(h => {
      const content = h.nextElementSibling;
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
    });
  }

  function initFilterSidebar() {
    const btn = document.getElementById('filterBtn');
    const sidebar = document.getElementById('shopSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const close = document.getElementById('sidebarClose');
    if (!btn || !sidebar) return;

    function open() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', open);
    if (close) close.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });
  }

})();
