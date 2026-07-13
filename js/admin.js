(function() {
  'use strict';

  const STORAGE_KEY = 'op_admin_products';
  const API_BASE = 'http://localhost:3000';

  let editingId = null;

  const COMMON_COLORS = [
    'Titanium', 'Deep Purple', 'Gold', 'Black', 'White', 'Pink',
    'Icy Blue', 'Obsidian', 'Flowy Emerald', 'Phantom Black',
    'Alpine Blue', 'Eternal Green', 'Midnight', 'Stellar Black',
    'Emerald Green', 'Red', 'Blue', 'Silver', 'Space Gray', 'Purple',
    'Orange', 'Yellow', 'Green', 'Brown',
  ];

  const COLOR_HEX = {
    'Titanium': '#8a8d91', 'Deep Purple': '#4a1a6b', 'Gold': '#d4af37',
    'Black': '#1a1a1a', 'White': '#f0f0f0', 'Pink': '#ffb6c1',
    'Icy Blue': '#a8d8ea', 'Obsidian': '#2d2d2d', 'Flowy Emerald': '#2e8b57',
    'Phantom Black': '#1a1a2e', 'Alpine Blue': '#2c3e50', 'Eternal Green': '#1b4332',
    'Midnight': '#191970', 'Stellar Black': '#0d0d0d', 'Emerald Green': '#2ecc71',
    'Red': '#e74c3c', 'Blue': '#3498db', 'Silver': '#bdc3c7',
    'Space Gray': '#636e72', 'Purple': '#9b59b6', 'Orange': '#e67e22',
    'Yellow': '#f1c40f', 'Green': '#27ae60', 'Brown': '#8B4513',
  };

  function renderColorPicker(selectedColors) {
    const container = document.getElementById('colorPicker');
    if (!container) return;
    const selected = selectedColors || [];
    container.innerHTML = COMMON_COLORS.map(c => {
      const isChecked = selected.includes(c);
      const hex = COLOR_HEX[c] || '#ccc';
      return `
        <label style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;background:${isChecked ? 'var(--primary-light, #e8f0fe)' : 'transparent'};font-size:0.813rem;">
          <input type="checkbox" value="${c}" ${isChecked ? 'checked' : ''} style="accent-color:var(--primary);">
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${hex};border:1px solid rgba(0,0,0,0.1);"></span>
          ${c}
        </label>
      `;
    }).join('');
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const label = cb.closest('label');
        label.style.background = cb.checked ? 'var(--primary-light, #e8f0fe)' : 'transparent';
      });
    });
  }

  function getSelectedColors() {
    const checked = Array.from(document.querySelectorAll('#colorPicker input[type="checkbox"]:checked')).map(cb => cb.value);
    const custom = document.getElementById('formCustomColors').value.split(',').map(s => s.trim()).filter(Boolean);
    return [...new Set([...checked, ...custom])];
  }

  function getStoredProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('adminProductsUpdated'));
  }

  function getDefaultProducts() {
    return [
      { id: 'iphone15pm', name: 'iPhone 15 Pro Max', brand: 'Apple', images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center', price: 57499, oldPrice: 62499, storage: '256GB', ram: '8GB', colors: ['Titanium'], color: 'Titanium', rating: 5, reviews: 128, stock: true, category: 'phones', badge: 'New', popular: 95 },
      { id: 's24ultra', name: 'Galaxy S24 Ultra', brand: 'Samsung', images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', price: 52499, oldPrice: 62499, storage: '512GB', ram: '12GB', colors: ['Titanium Gray'], color: 'Titanium Gray', rating: 5, reviews: 94, stock: true, category: 'phones', badge: 'Sale', popular: 90 },
      { id: 'pixel8pro', name: 'Pixel 8 Pro', brand: 'Google', images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&crop=center', price: 42999, oldPrice: 47999, storage: '128GB', ram: '12GB', colors: ['Obsidian'], color: 'Obsidian', rating: 5, reviews: 76, stock: true, category: 'phones', badge: '', popular: 88 },
      { id: 'oneplus12', name: 'OnePlus 12', brand: 'OnePlus', images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop&crop=center', price: 33499, oldPrice: 37999, storage: '256GB', ram: '16GB', colors: ['Flowy Emerald'], color: 'Flowy Emerald', rating: 5, reviews: 52, stock: true, category: 'phones', badge: 'Best Seller', popular: 85 },
      { id: 'iphone15', name: 'iPhone 15', brand: 'Apple', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', price: 37999, oldPrice: 0, storage: '128GB', ram: '6GB', colors: ['Pink'], color: 'Pink', rating: 4, reviews: 210, stock: true, category: 'phones', badge: 'New', popular: 92 },
      { id: 'zfold5', name: 'Galaxy Z Fold 5', brand: 'Samsung', images: ['https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center', price: 86499, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Icy Blue'], color: 'Icy Blue', rating: 5, reviews: 43, stock: true, category: 'phones', badge: 'Premium', popular: 78 },
      { id: 'mi14pro', name: 'Xiaomi 14 Pro', brand: 'Xiaomi', images: ['https://images.unsplash.com/photo-1774437342043-12ffa8880899?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1774437342043-12ffa8880899?w=400&h=400&fit=crop&crop=center', price: 35999, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Black'], color: 'Black', rating: 4, reviews: 67, stock: true, category: 'phones', badge: '', popular: 80 },
      { id: 'nothing2', name: 'Phone 2', brand: 'Nothing', images: ['https://images.unsplash.com/photo-1675557009285-b55f562641b9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1675557009285-b55f562641b9?w=400&h=400&fit=crop&crop=center', price: 28499, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['White'], color: 'White', rating: 4, reviews: 38, stock: true, category: 'phones', badge: 'New', popular: 82 },
      { id: 's23', name: 'Galaxy S23', brand: 'Samsung', images: ['https://images.unsplash.com/photo-1689804847601-9648c50078bc?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1689804847601-9648c50078bc?w=400&h=400&fit=crop&crop=center', price: 28499, oldPrice: 35999, storage: '128GB', ram: '8GB', colors: ['Phantom Black'], color: 'Phantom Black', rating: 5, reviews: 210, stock: true, category: 'phones', badge: '-20%', popular: 75 },
      { id: 'ip14pm', name: 'iPhone 14 Pro Max', brand: 'Apple', images: ['https://images.unsplash.com/photo-1727093493864-0bcbd16c7e6d?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1727093493864-0bcbd16c7e6d?w=400&h=400&fit=crop&crop=center', price: 42999, oldPrice: 52499, storage: '256GB', ram: '6GB', colors: ['Deep Purple'], color: 'Deep Purple', rating: 5, reviews: 186, stock: true, category: 'phones', badge: '-18%', popular: 70 },
      { id: 'mi13tp', name: 'Xiaomi 13T Pro', brand: 'Xiaomi', images: ['https://images.unsplash.com/photo-1754331732629-d281d5797956?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1754331732629-d281d5797956?w=400&h=400&fit=crop&crop=center', price: 23999, oldPrice: 30999, storage: '256GB', ram: '12GB', colors: ['Alpine Blue'], color: 'Alpine Blue', rating: 4, reviews: 92, stock: true, category: 'phones', badge: '-25%', popular: 65 },
      { id: 'op11', name: 'OnePlus 11', brand: 'OnePlus', images: ['https://images.unsplash.com/photo-1527747471697-174c755627dd?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1527747471697-174c755627dd?w=400&h=400&fit=crop&crop=center', price: 23999, oldPrice: 30999, storage: '256GB', ram: '16GB', colors: ['Eternal Green'], color: 'Eternal Green', rating: 4, reviews: 78, stock: false, category: 'phones', badge: '-22%', popular: 60 },
      { id: 'honor90', name: 'Honor 90', brand: 'Honor', images: ['https://images.unsplash.com/photo-1551636898-47668aa61de2?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1551636898-47668aa61de2?w=400&h=400&fit=crop&crop=center', price: 21499, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Emerald Green'], color: 'Emerald Green', rating: 4, reviews: 34, stock: true, category: 'phones', badge: 'New', popular: 55 },
      { id: 'oppofindn3', name: 'OPPO Find N3 Flip', brand: 'Oppo', images: ['https://images.unsplash.com/photo-1649859394614-dc4f7290b7f2?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center', 'https://images.unsplash.com/photo-1692307441614-c88d37a5ecaa?w=400&h=400&fit=crop&crop=center'], image: 'https://images.unsplash.com/photo-1649859394614-dc4f7290b7f2?w=400&h=400&fit=crop&crop=center', price: 47999, oldPrice: 0, storage: '256GB', ram: '12GB', colors: ['Gold'], color: 'Gold', rating: 4, reviews: 22, stock: true, category: 'phones', badge: 'New', popular: 58 },
    ];
  }

  async function getProducts() {
    try {
      const res = await fetch(API_BASE + '/api/admin/products');
      if (res.ok) {
        const all = await res.json();
        const merged = Object.values(all).flat();
        if (merged.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch {}
    const stored = getStoredProducts();
    if (stored && Array.isArray(stored) && stored.length) return stored;
    const defaults = getDefaultProducts();
    saveProducts(defaults);
    return defaults;
  }

  async function apiRequest(url, method, body) {
    try {
      await fetch(API_BASE + url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {}
  }

  async function renderTable() {
    const products = await getProducts();
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image}" alt="${p.name}" style="width:48px;height:48px;object-fit:cover;border-radius:var(--radius-sm);"></td>
        <td style="font-size:0.813rem;color:var(--text-secondary);">${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.brand}</td>
        <td>EGP ${p.price.toLocaleString()}</td>
        <td>${p.oldPrice ? 'EGP ' + p.oldPrice.toLocaleString() : '—'}</td>
        <td>${p.stock ? '<span style="color:var(--success);">In Stock</span>' : '<span style="color:var(--danger);">Out</span>'}</td>
        <td style="font-size:0.813rem;">${p.category || 'phones'}</td>
        <td>
          <div style="display:flex;gap:8px;">
            <button class="btn edit-btn" data-id="${p.id}" style="padding:6px 12px;font-size:0.813rem;border:1px solid var(--border);">Edit</button>
            <button class="btn delete-btn" data-id="${p.id}" style="padding:6px 12px;font-size:0.813rem;background:var(--danger);color:#FFFFFF;">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
  }

  function generateId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substring(2, 6);
  }

  function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('formSubmitBtn').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('formProductId').value = '';
    document.getElementById('formStock').checked = true;
    document.getElementById('formImageData').value = '';
    document.getElementById('formImageFile').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('formCustomColors').value = '';
    renderColorPicker([]);
    document.getElementById('productModal').style.display = 'flex';
  }

  async function openEditModal(id) {
    const products = await getProducts();
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('formSubmitBtn').textContent = 'Save Changes';
    document.getElementById('formProductId').value = id;
    document.getElementById('formName').value = p.name || '';
    document.getElementById('formBrand').value = p.brand || '';
    document.getElementById('formPrice').value = p.price || 0;
    document.getElementById('formOldPrice').value = p.oldPrice || 0;
    document.getElementById('formStorage').value = p.storage || '';
    document.getElementById('formRam').value = p.ram || '';
    document.getElementById('formCategory').value = p.category || 'phones';
    const existingImages = p.images || (p.image ? [p.image] : []);
    document.getElementById('formImageData').value = existingImages.length ? JSON.stringify(existingImages) : '';
    document.getElementById('formImageFile').value = '';
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = existingImages.map(url => `
      <img src="${url}" alt="" style="width:90px;height:90px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--border);">
    `).join('');
    preview.style.display = existingImages.length ? '' : 'none';
    document.getElementById('formRating').value = p.rating || 5;
    document.getElementById('formReviews').value = p.reviews || 0;
    document.getElementById('formBadge').value = p.badge || '';
    document.getElementById('formPopular').value = p.popular || 50;
    document.getElementById('formStock').checked = p.stock !== false;
    const productColors = p.colors || (p.color ? [p.color] : []);
    renderColorPicker(productColors);
    document.getElementById('formCustomColors').value = '';
    document.getElementById('productModal').style.display = 'flex';
  }

  function getImageData() {
    const raw = document.getElementById('formImageData').value;
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  async function saveForm(e) {
    e.preventDefault();
    const products = await getProducts();
    const id = document.getElementById('formProductId').value || generateId(document.getElementById('formName').value);
    let images = getImageData();
    if (!images || !images.length) {
      if (editingId) {
        const existing = products.find(p => p.id === editingId);
        if (existing) images = existing.images || (existing.image ? [existing.image] : []);
      }
      if (!images || !images.length) {
        showToast('Please upload at least one product image.');
        return;
      }
    }
    const colors = getSelectedColors();
    const data = {
      id,
      name: document.getElementById('formName').value.trim(),
      brand: document.getElementById('formBrand').value.trim(),
      price: parseFloat(document.getElementById('formPrice').value) || 0,
      oldPrice: parseFloat(document.getElementById('formOldPrice').value) || 0,
      storage: document.getElementById('formStorage').value.trim(),
      ram: document.getElementById('formRam').value.trim(),
      colors,
      color: colors[0] || '',
      category: document.getElementById('formCategory').value,
      images,
      image: images[0] || '',
      rating: parseInt(document.getElementById('formRating').value) || 5,
      reviews: parseInt(document.getElementById('formReviews').value) || 0,
      badge: document.getElementById('formBadge').value.trim(),
      popular: parseInt(document.getElementById('formPopular').value) || 50,
      stock: document.getElementById('formStock').checked,
    };

    if (editingId) {
      const idx = products.findIndex(x => x.id === editingId);
      if (idx !== -1) products[idx] = data;
      await apiRequest('/api/products/' + editingId, 'PUT', data);
    } else {
      products.push(data);
      await apiRequest('/api/products', 'POST', data);
    }

    saveProducts(products);
    renderTable();
    closeModal();
    showToast(editingId ? 'Product updated!' : 'Product added!');
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    let products = await getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    await apiRequest('/api/products/' + id, 'DELETE');
    renderTable();
    showToast('Product deleted.');
  }

  function closeModal() {
    document.getElementById('productModal').style.display = 'none';
  }

  function showToast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2500);
  }

  async function checkAdminSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || session.user?.email !== 'admin@omarphone.com') {
      localStorage.removeItem('op_admin_logged');
      window.location.href = 'login.html';
      return false;
    }
    localStorage.setItem('op_admin_logged', '1');
    return true;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const authed = await checkAdminSession();
    if (!authed) return;

    document.getElementById('adminDashboardSection').style.display = '';
    renderTable();

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('op_admin_logged');
      window.location.href = 'login.html';
    });

    document.getElementById('addProductBtn').addEventListener('click', openAddModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('productModal').addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('productForm').addEventListener('submit', saveForm);

    document.getElementById('formImageFile').addEventListener('change', function() {
      const files = Array.from(this.files).slice(0, 4);
      if (!files.length) return;
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = '';
      preview.style.display = '';
      const promises = files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          preview.innerHTML += `<img src="${e.target.result}" alt="" style="width:90px;height:90px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--border);">`;
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      }));
      Promise.all(promises).then(dataUrls => {
        document.getElementById('formImageData').value = JSON.stringify(dataUrls);
      });
    });
  });
})();
