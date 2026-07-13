(function() {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  let allProducts = [];

  function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function getBadgeClass(badge) {
    if (badge === 'New' || badge === 'Premium') return 'badge-new';
    if (badge && (badge.includes('%') || badge === 'Sale')) return 'badge-sale';
    if (badge === 'Best Seller') return 'badge-excellent';
    return 'badge-new';
  }

  function buildProductCard(p) {
    const stars = getStars(p.rating || 5);
    const badgeHtml = p.badge ? `<div class="product-card-badges"><span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span></div>` : '';
    const oldPriceHtml = p.oldPrice ? `<span class="product-card-old-price">EGP ${p.oldPrice.toLocaleString()}</span>` : '';
    const discountHtml = p.oldPrice ? `<span class="product-card-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '';
    const stockText = p.stock === false ? 'Out of Stock' : (p.stock === 0 ? 'Out of Stock' : 'In Stock');
    const stockClass = p.stock === false ? 'out-of-stock' : 'in-stock';
    const specsHtml = [p.storage, p.ram, p.color].filter(Boolean).map(s => `<span class="product-card-spec">${s}</span>`).join('');

    return `
      <div class="product-card">
        <div class="product-card-image">
          <a href="product-detail.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </a>
          ${badgeHtml}
          <div class="product-card-actions">
            <button class="product-card-action wishlist-btn" data-id="${p.id}" title="Add to wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <a href="product-detail.html?id=${p.id}" class="product-card-action" title="Quick view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
          </div>
        </div>
        <div class="product-card-body">
          <a href="product-detail.html?id=${p.id}">
            <div class="product-card-brand">${p.brand || ''}</div>
            <h3 class="product-card-title">${p.name}</h3>
          </a>
          ${specsHtml ? `<div class="product-card-specs">${specsHtml}</div>` : ''}
          ${p.rating ? `
          <div class="product-card-rating">
            <div class="product-card-stars">${stars}</div>
            ${p.reviews ? `<span class="product-card-reviews">(${p.reviews} reviews)</span>` : ''}
          </div>` : ''}
          <div class="product-card-price-row">
            <span class="product-card-price">EGP ${p.price.toLocaleString()}</span>
            ${oldPriceHtml}
            ${discountHtml}
          </div>
          <div class="product-card-stock ${stockClass}">${stockText}</div>
          <button class="product-card-add" ${p.stock === false ? 'disabled' : `data-product='${JSON.stringify({id:p.id,name:p.name,image:p.image,price:p.price,storage:p.storage||'',color:p.color||''})}'`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            ${p.stock === false ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;
  }

  function renderSection(containerId, products) {
    const el = document.getElementById(containerId);
    if (!el || !products.length) return;
    el.innerHTML = products.map(buildProductCard).join('');
  }

  async function init() {
    try {
      const res = await fetch(API_BASE + '/api/products/all');
      if (res.ok) {
        allProducts = await res.json();
      }
    } catch {}
    if (!allProducts.length) return;

    const phones = allProducts.filter(p => p.category === 'phones' || !p.category);

    const featured = phones.filter(p => p.badge === 'New' || p.badge === 'Premium' || p.badge === 'Best Seller' || (p.popular || 0) >= 80).slice(0, 4);
    if (featured.length < 4) {
      const extra = phones.filter(p => !featured.find(f => f.id === p.id)).slice(0, 4 - featured.length);
      featured.push(...extra);
    }
    renderSection('featuredGrid', featured);

    const latest = phones.filter(p => p.badge === 'New').slice(0, 4);
    if (latest.length < 4) {
      const extra = phones.filter(p => !latest.find(l => l.id === p.id) && !featured.find(f => f.id === p.id)).slice(0, 4 - latest.length);
      latest.push(...extra);
    }
    renderSection('latestGrid', latest);

    const deals = phones.filter(p => p.oldPrice && p.oldPrice > p.price).sort((a, b) => {
      const aDisc = (a.price / a.oldPrice);
      const bDisc = (b.price / b.oldPrice);
      return aDisc - bDisc;
    }).slice(0, 4);
    renderSection('dealsGrid', deals);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
