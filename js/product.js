(function() {
  'use strict';

  const hardcodedProducts = [
    { id: 'iphone15pm', name: 'iPhone 15 Pro Max', brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=center', price: 57499, oldPrice: 62499, storage: '256GB', ram: '8GB', color: 'Titanium', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 128, stock: true, category: 'phones', badge: 'New', popular: 95 },
    { id: 's24ultra', name: 'Galaxy S24 Ultra', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&crop=center', price: 52499, oldPrice: 62499, storage: '512GB', ram: '12GB', color: 'Titanium Gray', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 94, stock: true, category: 'phones', badge: 'Sale', popular: 90 },
    { id: 'pixel8pro', name: 'Pixel 8 Pro', brand: 'Google', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop&crop=center', price: 42999, oldPrice: 47999, storage: '128GB', ram: '12GB', color: 'Obsidian', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 76, stock: true, category: 'phones', badge: '', popular: 88 },
    { id: 'oneplus12', name: 'OnePlus 12', brand: 'OnePlus', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=600&fit=crop&crop=center', price: 33499, oldPrice: 37999, storage: '256GB', ram: '16GB', color: 'Flowy Emerald', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 52, stock: true, category: 'phones', badge: 'Best Seller', popular: 85 },
    { id: 'iphone15', name: 'iPhone 15', brand: 'Apple', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=center', price: 37999, oldPrice: 0, storage: '128GB', ram: '6GB', color: 'Pink', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 210, stock: true, category: 'phones', badge: 'New', popular: 92 },
    { id: 'zfold5', name: 'Galaxy Z Fold 5', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=600&h=600&fit=crop&crop=center', price: 86499, oldPrice: 0, storage: '256GB', ram: '12GB', color: 'Icy Blue', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 43, stock: true, category: 'phones', badge: 'Premium', popular: 78 },
    { id: 'mi14pro', name: 'Xiaomi 14 Pro', brand: 'Xiaomi', image: 'https://images.unsplash.com/photo-1774437342043-12ffa8880899?w=600&h=600&fit=crop&crop=center', price: 35999, oldPrice: 0, storage: '256GB', ram: '12GB', color: 'Black', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 67, stock: true, category: 'phones', badge: '', popular: 80 },
    { id: 'nothing2', name: 'Phone 2', brand: 'Nothing', image: 'https://images.unsplash.com/photo-1675557009285-b55f562641b9?w=600&h=600&fit=crop&crop=center', price: 28499, oldPrice: 0, storage: '256GB', ram: '12GB', color: 'White', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 38, stock: true, category: 'phones', badge: 'New', popular: 82 },
    { id: 's23', name: 'Galaxy S23', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1689804847601-9648c50078bc?w=600&h=600&fit=crop&crop=center', price: 28499, oldPrice: 35999, storage: '128GB', ram: '8GB', color: 'Phantom Black', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 210, stock: true, category: 'phones', badge: '-20%', popular: 75 },
    { id: 'ip14pm', name: 'iPhone 14 Pro Max', brand: 'Apple', image: 'https://images.unsplash.com/photo-1727093493864-0bcbd16c7e6d?w=600&h=600&fit=crop&crop=center', price: 42999, oldPrice: 52499, storage: '256GB', ram: '6GB', color: 'Deep Purple', condition: 'new', battery: 100, warranty: '12 Months', rating: 5, reviews: 186, stock: true, category: 'phones', badge: '-18%', popular: 70 },
    { id: 'mi13tp', name: 'Xiaomi 13T Pro', brand: 'Xiaomi', image: 'https://images.unsplash.com/photo-1754331732629-d281d5797956?w=600&h=600&fit=crop&crop=center', price: 23999, oldPrice: 30999, storage: '256GB', ram: '12GB', color: 'Alpine Blue', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 92, stock: true, category: 'phones', badge: '-25%', popular: 65 },
    { id: 'op11', name: 'OnePlus 11', brand: 'OnePlus', image: 'https://images.unsplash.com/photo-1527747471697-174c755627dd?w=600&h=600&fit=crop&crop=center', price: 23999, oldPrice: 30999, storage: '256GB', ram: '16GB', color: 'Eternal Green', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 78, stock: false, category: 'phones', badge: '-22%', popular: 60 },
    { id: 'honor90', name: 'Honor 90', brand: 'Honor', image: 'https://images.unsplash.com/photo-1551636898-47668aa61de2?w=600&h=600&fit=crop&crop=center', price: 21499, oldPrice: 0, storage: '256GB', ram: '12GB', color: 'Emerald Green', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 34, stock: true, category: 'phones', badge: 'New', popular: 55 },
    { id: 'oppofindn3', name: 'OPPO Find N3 Flip', brand: 'Oppo', image: 'https://images.unsplash.com/photo-1649859394614-dc4f7290b7f2?w=600&h=600&fit=crop&crop=center', price: 47999, oldPrice: 0, storage: '256GB', ram: '12GB', color: 'Gold', condition: 'new', battery: 100, warranty: '12 Months', rating: 4, reviews: 22, stock: true, category: 'phones', badge: 'New', popular: 58 },
  ];

  let products;

  function getProducts() {
    if (products) return products;
    try {
      const stored = localStorage.getItem('op_admin_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          products = parsed;
          return products;
        }
      }
    } catch {}
    products = hardcodedProducts;
    return products;
  }

  const galleryImages = {
    iphone15pm: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=600&h=600&fit=crop&crop=center',
    ],
    default: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=600&h=600&fit=crop&crop=center',
    ],
  };

  const colorMap = {
    'Titanium Gray': '#8a8d91',
    'Deep Purple': '#4a1a6b',
    'Gold': '#d4af37',
    'Black': '#1a1a1a',
    'Titanium': '#8a8d91',
    'Obsidian': '#2d2d2d',
    'Flowy Emerald': '#2e8b57',
    'Pink': '#ffb6c1',
    'Icy Blue': '#a8d8ea',
    'White': '#f0f0f0',
    'Phantom Black': '#1a1a2e',
    'Alpine Blue': '#2c3e50',
    'Eternal Green': '#1b4332',
    'Midnight': '#191970',
    'Phantom White': '#e8e8e8',
    'Lemongrass': '#d4e157',
    'Stellar Black': '#0d0d0d',
    'Emerald Green': '#2ecc71',
  };

  let currentProduct = null;
  let selectedColor = '';
  let selectedStorage = '';
  let currentTab = 'description';

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
      document.getElementById('pageTitle').textContent = 'Product Not Found';
      return;
    }

    const product = getProducts().find(p => p.id === id);
    if (!product) {
      document.getElementById('pageTitle').textContent = 'Product Not Found';
      return;
    }

    currentProduct = product;
    selectedColor = product.color;
    selectedStorage = product.storage;
    renderProduct(product);
    renderRelatedProducts(product);
    initEvents(product);
  });

  function renderProduct(p) {
    const images = galleryImages[p.id] || galleryImages.default;
    document.getElementById('mainImage').src = images[0];
    document.getElementById('mainImage').alt = p.name;

    const thumbsHtml = images.map((img, i) => `
      <button class="product-gallery-thumb ${i === 0 ? 'active' : ''}" data-src="${img}">
        <img src="${img}" alt="${p.name} view ${i + 1}" loading="lazy">
      </button>
    `).join('');
    document.getElementById('galleryThumbs').innerHTML = thumbsHtml;

    document.getElementById('productBrand').textContent = p.brand;
    document.getElementById('productName').textContent = p.name;
    document.getElementById('breadcrumbProduct').textContent = p.name;
    document.getElementById('pageTitle').textContent = p.name;
    document.getElementById('pageSubtitle').textContent = `${p.brand} — ${p.storage} ${p.ram}`;

    const starsHtml = getStars(p.rating);
    document.getElementById('productRating').innerHTML = `
      <div class="product-info-stars">${starsHtml}</div>
      <span class="product-info-review-count">(${p.reviews} reviews)</span>
    `;

    const oldPriceHtml = p.oldPrice ? `<span class="product-info-old">EGP ${p.oldPrice.toLocaleString()}</span>` : '';
    const discountHtml = p.oldPrice ? `<span class="product-info-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '';
    document.getElementById('productPrice').innerHTML = `
      <span class="product-info-current">EGP ${p.price.toLocaleString()}</span>
      ${oldPriceHtml}
      ${discountHtml}
    `;

    const descHtml = `<p>Experience the pinnacle of mobile technology with the ${p.name}. Featuring a stunning design, blazing-fast performance, and an advanced camera system, this smartphone sets a new standard for what a mobile device can do. Powered by the latest processor and featuring ${p.ram} of RAM, every task feels effortless.</p><p>The ${p.name} comes with ${p.storage} of internal storage, providing ample space for all your apps, photos, and videos. With an all-day battery, stunning display, and the latest software enhancements, this device is built to keep up with your lifestyle. Backed by a ${p.warranty} manufacturer warranty for complete peace of mind.</p>`;
    document.getElementById('productDescription').innerHTML = descHtml;

    const descTabHtml = descHtml;
    document.getElementById('tabDescription').innerHTML = descTabHtml;

    const specs = getSpecs(p);
    const specsHtml = `
      <table class="specs-table">
        ${specs.map(s => `<tr><td>${s.label}</td><td>${s.value}</td></tr>`).join('')}
      </table>
    `;
    document.getElementById('tabSpecifications').innerHTML = specsHtml;

    const reviews = getReviews(p);
    const reviewsHtml = reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.avatar}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-date">${r.date}</div>
          </div>
          <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        </div>
        <p class="review-text">${r.text}</p>
      </div>
    `).join('');
    document.getElementById('tabReviews').innerHTML = reviewsHtml;

    const colorOptions = getColorOptions(p.brand);
    document.getElementById('colorSelector').innerHTML = colorOptions.map(c => `
      <button class="product-info-color ${c === selectedColor ? 'active' : ''}" data-color="${c}" style="background: ${colorMap[c] || '#ccc'}" title="${c}"></button>
    `).join('');

    const storageOptions = ['128GB', '256GB', '512GB', '1TB'];
    document.getElementById('storageSelector').innerHTML = storageOptions.map(s => `
      <button class="product-info-storage-btn ${s === selectedStorage ? 'active' : ''}" data-storage="${s}">${s}</button>
    `).join('');

    const metaHtml = `
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M16 17h-5a2 2 0 0 1-2-2v-2"/><rect x="15" y="7" width="7" height="6" rx="1"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
        Free Delivery
      </div>
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        12-Month Warranty
      </div>
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        100% Original
      </div>
      <div class="product-info-meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Easy Returns
      </div>
    `;
    document.getElementById('productMeta').innerHTML = metaHtml;

    document.querySelector('.product-info-qty input').value = 1;
  }

  function renderRelatedProducts(p) {
    const related = products
      .filter(item => item.id !== p.id && (item.brand === p.brand || Math.abs(item.price - p.price) < 300))
      .sort((a, b) => b.popular - a.popular)
      .slice(0, 4);

    const container = document.getElementById('relatedProducts');
    container.innerHTML = related.map(item => buildProductCard(item)).join('');
  }

  function buildProductCard(p) {
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '½' : '');
    const badgeHtml = p.badge ? `<div class="product-card-badges"><span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span></div>` : '';
    const oldPriceHtml = p.oldPrice ? `<span class="product-card-old-price">EGP ${p.oldPrice.toLocaleString()}</span>` : '';
    const discountHtml = p.oldPrice ? `<span class="product-card-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '';
    const stockHtml = p.stock
      ? '<div class="product-card-stock in-stock">In Stock</div>'
      : '<div class="product-card-stock out-of-stock">Out of Stock</div>';

    return `
      <div class="product-card">
        <a href="product-detail.html?id=${p.id}" class="product-card-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${badgeHtml}
        </a>
        <div class="product-card-body">
          <div class="product-card-brand">${p.brand}</div>
          <h3 class="product-card-title">${p.name}</h3>
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
          <a href="product-detail.html?id=${p.id}" class="product-card-add">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            View Details
          </a>
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

  function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function getColorOptions(brand) {
    const brandColors = {
      'Apple': ['Titanium', 'Deep Purple', 'Gold', 'Black'],
      'Samsung': ['Titanium Gray', 'Deep Purple', 'Gold', 'Black'],
      'Google': ['Obsidian', 'Deep Purple', 'Gold', 'Black'],
      'OnePlus': ['Flowy Emerald', 'Deep Purple', 'Gold', 'Black'],
      'Xiaomi': ['Black', 'Deep Purple', 'Gold', 'Titanium Gray'],
      'Nothing': ['White', 'Black', 'Deep Purple', 'Gold'],
      'Honor': ['Emerald Green', 'Black', 'Deep Purple', 'Gold'],
      'Oppo': ['Gold', 'Black', 'Deep Purple', 'Titanium Gray'],
    };
    return brandColors[brand] || ['Titanium Gray', 'Deep Purple', 'Gold', 'Black'];
  }

  function getSpecs(p) {
    const cameraMap = {
      'Apple': '48MP + 12MP + 12MP',
      'Samsung': '200MP + 50MP + 12MP + 10MP',
      'Google': '50MP + 48MP + 48MP',
      'OnePlus': '50MP + 48MP + 64MP',
      'Xiaomi': '50MP + 50MP + 50MP',
      'Nothing': '50MP + 50MP',
      'Honor': '200MP + 12MP + 50MP',
      'Oppo': '50MP + 48MP + 32MP',
    };
    const processorMap = {
      'Apple': 'A17 Pro',
      'Samsung': 'Snapdragon 8 Gen 3',
      'Google': 'Google Tensor G3',
      'OnePlus': 'Snapdragon 8 Gen 3',
      'Xiaomi': 'Snapdragon 8 Gen 3',
      'Nothing': 'Snapdragon 8+ Gen 1',
      'Honor': 'Snapdragon 8 Gen 2',
      'Oppo': 'MediaTek Dimensity 9200',
    };
    const displayMap = {
      'Apple': '6.7" Super Retina XDR OLED',
      'Samsung': '6.8" Dynamic AMOLED 2X',
      'Google': '6.7" LTPO OLED',
      'OnePlus': '6.82" LTPO AMOLED',
      'Xiaomi': '6.73" LTPO AMOLED',
      'Nothing': '6.7" LTPO OLED',
      'Honor': '6.78" OLED',
      'Oppo': '6.8" AMOLED',
    };
    const batteryMap = {
      'Apple': '4422 mAh',
      'Samsung': '5000 mAh',
      'Google': '5050 mAh',
      'OnePlus': '5400 mAh',
      'Xiaomi': '5000 mAh',
      'Nothing': '4700 mAh',
      'Honor': '5000 mAh',
      'Oppo': '4300 mAh',
    };
    const osMap = {
      'Apple': 'iOS 17',
      'Samsung': 'One UI 6.1 (Android 14)',
      'Google': 'Android 14',
      'OnePlus': 'OxygenOS 14 (Android 14)',
      'Xiaomi': 'HyperOS (Android 14)',
      'Nothing': 'Nothing OS 2.5 (Android 14)',
      'Honor': 'MagicOS 8.0 (Android 14)',
      'Oppo': 'ColorOS 14 (Android 14)',
    };

    return [
      { label: 'Display', value: displayMap[p.brand] || '6.7" AMOLED' },
      { label: 'Processor', value: processorMap[p.brand] || 'Octa-core' },
      { label: 'RAM', value: p.ram },
      { label: 'Storage', value: p.storage },
      { label: 'Camera', value: cameraMap[p.brand] || '50MP + 12MP' },
      { label: 'Battery', value: batteryMap[p.brand] || '5000 mAh' },
      { label: 'Operating System', value: osMap[p.brand] || 'Android 14' },
      { label: 'Condition', value: 'Brand New' },
      { label: 'Warranty', value: p.warranty },
      { label: 'Battery Health', value: '100%' },
    ];
  }

  function getReviews(p) {
    return [
      {
        avatar: 'AH',
        name: 'Ahmed Hassan',
        date: 'March 15, 2026',
        stars: 5,
        text: `Absolutely love my ${p.name}! The camera quality is outstanding and the battery life easily lasts me a full day of heavy use. The delivery was incredibly fast and the phone was well-packaged. Highly recommend Omar Phone for anyone looking for premium devices at the best prices.`,
      },
      {
        avatar: 'SN',
        name: 'Sara Nasser',
        date: 'February 28, 2026',
        stars: 5,
        text: `This is my third phone from Omar Phone and they never disappoint. The ${p.name} feels premium in hand, the display is gorgeous, and performance is buttery smooth. The 12-month warranty gives great peace of mind. Will definitely be coming back for more.`,
      },
    ];
  }

  function initEvents(p) {
    const galleryThumbs = document.getElementById('galleryThumbs');
    if (galleryThumbs) {
      galleryThumbs.addEventListener('click', (e) => {
        const thumb = e.target.closest('.product-gallery-thumb');
        if (!thumb) return;
        document.querySelectorAll('.product-gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('mainImage').src = thumb.dataset.src;
      });
    }

    const colorSelector = document.getElementById('colorSelector');
    if (colorSelector) {
      colorSelector.addEventListener('click', (e) => {
        const swatch = e.target.closest('.product-info-color');
        if (!swatch) return;
        document.querySelectorAll('.product-info-color').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        selectedColor = swatch.dataset.color;
      });
    }

    const storageSelector = document.getElementById('storageSelector');
    if (storageSelector) {
      storageSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.product-info-storage-btn');
        if (!btn) return;
        document.querySelectorAll('.product-info-storage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedStorage = btn.dataset.storage;
      });
    }

    const qtySelector = document.getElementById('qtySelector');
    if (qtySelector) {
      qtySelector.addEventListener('click', (e) => {
        const input = qtySelector.querySelector('input');
        const minus = e.target.closest('.qty-minus');
        const plus = e.target.closest('.qty-plus');
        let val = parseInt(input.value, 10) || 1;
        if (minus && val > 1) input.value = val - 1;
        if (plus && val < 99) input.value = val + 1;
      });

      qtySelector.querySelector('input').addEventListener('change', function() {
        let val = parseInt(this.value, 10);
        if (isNaN(val) || val < 1) this.value = 1;
        if (val > 99) this.value = 99;
      });
    }

    const tabsNav = document.querySelector('.tabs-nav');
    if (tabsNav) {
      tabsNav.addEventListener('click', (e) => {
        const btn = e.target.closest('.tabs-nav-btn');
        if (!btn) return;
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tabs-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
        currentTab = tab;
      });
    }

    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!window.OmarPhone) return;
        const qtyInput = document.querySelector('.product-info-qty input');
        const quantity = parseInt(qtyInput ? qtyInput.value : 1, 10);
        const product = {
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          storage: selectedStorage,
          color: selectedColor,
          quantity,
        };
        window.OmarPhone.addToCart(product);
      });
    }

    const wishBtn = document.getElementById('wishlistBtn');
    if (wishBtn) {
      const isLoved = window.OmarPhone && window.OmarPhone.isInWishlist(p.id);
      if (isLoved) {
        wishBtn.querySelector('svg').setAttribute('fill', 'currentColor');
      }

      wishBtn.addEventListener('click', () => {
        if (!window.OmarPhone) return;
        const product = {
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price,
          storage: selectedStorage,
          color: selectedColor,
        };
        const added = window.OmarPhone.toggleWishlist(product);
        const svg = wishBtn.querySelector('svg');
        svg.setAttribute('fill', added ? 'currentColor' : 'none');
      });
    }
  }

})();
