(function() {
  'use strict';

  const config = {
    phones:      { title: 'Phones',        subtitle: 'Discover the latest smartphones at the best prices.', label: 'Phones',       file: 'data/phones.json' },
    tablets:     { title: 'Tablets',       subtitle: 'Discover our range of premium tablets.',        label: 'Tablets',      file: 'data/tablets.json' },
    watches:     { title: 'Smart Watches',  subtitle: 'Premium smart watches for every lifestyle.',    label: 'Smart Watches', file: 'data/watches.json' },
    earbuds:     { title: 'Earbuds',        subtitle: 'Premium wireless audio for every lifestyle.',   label: 'Earbuds',      file: 'data/earbuds.json' },
    chargers:    { title: 'Chargers',       subtitle: 'Fast and reliable charging solutions.',          label: 'Chargers',     file: 'data/chargers.json' },
    powerbanks:  { title: 'Power Banks',    subtitle: 'Portable power for your devices on the go.',    label: 'Power Banks',  file: 'data/powerbanks.json' },
  };

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const info = config[type];

  if (!info) {
    document.getElementById('pageTitle').textContent = 'Category Not Found';
    return;
  }

  document.title = info.title + ' — Omar Phone';
  document.getElementById('pageTitle').textContent = info.title;
  document.getElementById('pageSubtitle').textContent = info.subtitle;
  document.getElementById('breadcrumbCurrent').textContent = info.label;

  const grid = document.getElementById('categoryGrid');

  fetch(info.file)
    .then(r => r.json())
    .then(products => {
      if (!products.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 24px;"><h3 style="font-size:1.25rem;margin-bottom:8px;">No products found</h3></div>';
        return;
      }

      grid.innerHTML = products.map(p => {
        const stars = '★'.repeat(Math.floor(p.rating || 5)) + (p.rating % 1 >= 0.5 ? '½' : '');
        const badgeHtml = p.badge ? `<div class="product-card-badges"><span class="badge badge-new">${p.badge}</span></div>` : '';
        const brandHtml = p.brand ? `<div class="product-card-brand">${p.brand}</div>` : '';
        const specsHtml = (p.storage || p.ram) ? `
          <div class="product-card-specs">
            ${p.storage ? `<span class="product-card-spec">${p.storage}</span>` : ''}
            ${p.ram ? `<span class="product-card-spec">${p.ram} RAM</span>` : ''}
          </div>` : '';
        const ratingHtml = p.rating ? `
          <div class="product-card-rating">
            <div class="product-card-stars">${stars}</div>
            ${p.reviews ? `<span class="product-card-reviews">(${p.reviews} reviews)</span>` : ''}
          </div>` : '';
        const stockHtml = p.stock !== undefined ? (p.stock
          ? '<div class="product-card-stock in-stock">In Stock</div>'
          : '<div class="product-card-stock out-of-stock">Out of Stock</div>') : '';
        const oldPriceHtml = p.oldPrice ? `<span class="product-card-old-price">EGP ${p.oldPrice.toLocaleString()}</span>` : '';
        const discountHtml = p.oldPrice ? `<span class="product-card-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '';
        const isLoved = window.OmarPhone && window.OmarPhone.isInWishlist(p.id);

        return `
          <div class="product-card">
            <div class="product-card-image">
              <a href="product-detail.html?id=${p.id}">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
              </a>
              ${badgeHtml}
              <div class="product-card-actions">
                <button class="product-card-action wishlist-btn ${isLoved ? 'active' : ''}" data-id="${p.id}" aria-label="Add to wishlist">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLoved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
                <a href="product-detail.html?id=${p.id}" class="product-card-action" title="Quick view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </a>
              </div>
            </div>
            <div class="product-card-body">
              ${brandHtml}
              <a href="product-detail.html?id=${p.id}" style="text-decoration:none;color:inherit;">
                <div class="product-card-title">${p.name}</div>
              </a>
              ${specsHtml}
              ${ratingHtml}
              <div class="product-card-price-row">
                <span class="product-card-price">EGP ${p.price.toLocaleString()}</span>
                ${oldPriceHtml}
                ${discountHtml}
              </div>
              ${stockHtml}
              <button class="product-card-add add-cart-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Add to Cart
              </button>
            </div>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.OmarPhone) {
            window.OmarPhone.addToCart({
              id: btn.dataset.id,
              name: btn.dataset.name,
              price: parseFloat(btn.dataset.price),
              image: btn.dataset.image,
            });
          }
        });
      });

      grid.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = products.find(p => p.id === id);
          if (item && window.OmarPhone) {
            window.OmarPhone.toggleWishlist({
              id: item.id,
              name: item.name,
              image: item.image,
              price: item.price,
            });
            btn.classList.toggle('active', window.OmarPhone.isInWishlist(item.id));
          }
        });
      });

      grid.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.dataset.id;
        if (window.OmarPhone && window.OmarPhone.isInWishlist(id)) {
          btn.classList.add('active');
        }
      });
    })
    .catch(() => {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 24px;"><h3 style="font-size:1.25rem;margin-bottom:8px;">Failed to load products</h3></div>';
    });
})();
