(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    document.addEventListener('wishlistUpdated', renderWishlist);
  });

  function getWishlist() {
    return window.OmarPhone ? window.OmarPhone.getWishlist() : [];
  }

  function renderWishlist() {
    const items = getWishlist();
    const grid = document.getElementById('wishlistGrid');
    const countEl = document.getElementById('wishlistCount');
    if (!grid) return;

    if (countEl) countEl.textContent = items.length;

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h2 class="empty-state-title">Your wishlist is empty</h2>
          <p class="empty-state-text">Save items you love and come back to them later.</p>
          <a href="shop.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    const h = window.OmarPhone ? window.OmarPhone.escapeHtml : (s => s);
    let html = '';
    items.forEach(item => {
      const image = item.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop';
      html += `
        <div class="product-card" data-id="${item.id}">
          <div class="product-card-image">
            <img src="${image}" alt="${h(item.name || 'Product')}" loading="lazy">
          </div>
          <div class="product-card-body">
            <h3 class="product-card-title">${h(item.name || 'Product')}</h3>
            <div class="product-card-price-row">
              <span class="product-card-price">EGP ${(item.price || 0).toLocaleString()}</span>
            </div>
            <button class="product-card-add wishlist-add-cart" data-id="${item.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Buy
            </button>
            <button class="product-card-add" style="background:var(--danger);margin-top:8px;font-size:0.813rem;padding:10px;" data-id="${item.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              Remove
            </button>
          </div>
        </div>
      `;
    });

    if (items.length) {
      html += `
        <div style="grid-column:1/-1;display:flex;justify-content:center;padding:32px 0;">
          <button class="btn btn-primary" id="buyAllBtn" style="padding:14px 40px;font-size:1rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;vertical-align:middle;"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Buy All (${items.length})
          </button>
        </div>
      `;
    }

    grid.innerHTML = html;
    if (window.OmarPhone) window.OmarPhone.initImageFallbacks();

    grid.querySelectorAll('.wishlist-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = items.find(i => i.id === id);
        if (item && window.OmarPhone) {
          window.OmarPhone.addToCart({ id: item.id, name: item.name, image: item.image, price: item.price, storage: item.storage, color: item.color, quantity: 1 });
          window.OmarPhone.toggleWishlist(item);
        }
      });
    });

    grid.querySelectorAll('.product-card-add:not(.wishlist-add-cart)').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = items.find(i => i.id === id);
        if (item && window.OmarPhone) {
          window.OmarPhone.toggleWishlist(item);
        }
      });
    });

    const buyAll = document.getElementById('buyAllBtn');
    if (buyAll) {
      buyAll.addEventListener('click', () => {
        if (!window.OmarPhone) return;
        items.forEach(item => {
          window.OmarPhone.addToCart({ id: item.id, name: item.name, image: item.image, price: item.price, storage: item.storage, color: item.color, quantity: 1 });
        });
        window.OmarPhone.showToast('All items added to cart!', 'success');
      });
    }
  }

})();
