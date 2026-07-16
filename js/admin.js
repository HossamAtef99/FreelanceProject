(function() {
  'use strict';

  const API_BASE = 'http://localhost:3000';
  const STORAGE_KEY = 'op_admin_products';

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
    } catch (e) { console.warn('localStorage read failed:', e); return null; }
  }




  async function getProducts() {
    if (window.OmarPhone && window.OmarPhone.getProducts) {
      const data = await window.OmarPhone.getProducts();
      if (Array.isArray(data) && data.length) return data;
    }
    const stored = getStoredProducts();
    if (stored && Array.isArray(stored) && stored.length) {
      console.warn('Server unavailable, using local data');
      return stored;
    }
    return [];
  }

  async function renderTable() {
    const products = await getProducts();
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;
    const h = window.OmarPhone ? window.OmarPhone.escapeHtml : (s => s);
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image}" alt="${h(p.name)}" style="width:48px;height:48px;object-fit:cover;border-radius:var(--radius-sm);"></td>
        <td style="font-size:0.813rem;color:var(--text-secondary);">${h(p.id)}</td>
        <td><strong>${h(p.name)}</strong></td>
        <td>${h(p.brand)}</td>
        <td>EGP ${p.price.toLocaleString()}</td>
        <td>${p.oldPrice ? 'EGP ' + p.oldPrice.toLocaleString() : '—'}</td>
        <td>${p.stock ? '<span style="color:var(--success);">In Stock</span>' : '<span style="color:var(--danger);">Out</span>'}</td>
        <td style="font-size:0.813rem;">${h(p.category || 'phones')}</td>
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

  function renderImagePreview(images) {
    const preview = document.getElementById('imagePreview');
    if (!images || !images.length) {
      preview.innerHTML = '';
      preview.style.display = 'none';
      document.getElementById('formImageData').value = '';
      return;
    }
    document.getElementById('formImageData').value = JSON.stringify(images);
    preview.innerHTML = images.map((url, idx) => `
      <div style="position:relative;display:inline-block;">
        <img src="${url}" alt="" style="width:90px;height:90px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--border);">
        <button type="button" class="img-remove-btn" data-index="${idx}" style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;border:none;background:#dc3545;color:#fff;font-size:14px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">&times;</button>
      </div>
    `).join('');
    preview.style.display = '';
    preview.querySelectorAll('.img-remove-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.dataset.index);
        const current = JSON.parse(document.getElementById('formImageData').value || '[]');
        current.splice(idx, 1);
        renderImagePreview(current);
      });
    });
  }

  function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('formSubmitBtn').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('formProductId').value = '';
    document.getElementById('formStock').checked = true;
    document.getElementById('formImageFile').value = '';
    renderImagePreview([]);
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
    document.getElementById('formImageFile').value = '';
    renderImagePreview(existingImages);
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
    const id = document.getElementById('formProductId').value || generateId(document.getElementById('formName').value);
    let images = getImageData();
    if (!images || !images.length && editingId) {
      try {
        const existing = await window.OmarPhone.getProducts().then(ps => ps.find(p => p.id === editingId));
        if (existing) images = existing.images || (existing.image ? [existing.image] : []);
      } catch (_) {}
    }
    if (!images || !images.length) {
      showToast('Please upload at least one product image.');
      return;
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

    try {
      if (editingId) {
        await window.OmarPhone.updateProduct(editingId, data);
      } else {
        await window.OmarPhone.createProduct(data);
      }
    } catch (err) {
      showToast('Failed to save to server: ' + err.message);
      return;
    }

    renderTable();
    closeModal();
    showToast(editingId ? 'Product updated!' : 'Product added!');
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await window.OmarPhone.deleteProduct(id);
    } catch (err) {
      showToast('Failed to delete on server: ' + err.message);
      return;
    }
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
      const promises = files.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
      }));
      Promise.all(promises).then(dataUrls => {
        const existingRaw = document.getElementById('formImageData').value;
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        renderImagePreview([...existing, ...dataUrls]);
      });
    });

    /* ----- Tab Switching ----- */
    const tabProducts = document.getElementById('tabProducts');
    const tabOrders = document.getElementById('tabOrders');
    const productsPanel = document.getElementById('adminProductsTab');
    const ordersPanel = document.getElementById('adminOrdersTab');

    function switchTab(tab) {
      [tabProducts, tabOrders].forEach(t => t.style.background = '');
      [tabProducts, tabOrders].forEach(t => t.style.color = '');
      productsPanel.style.display = 'none';
      ordersPanel.style.display = 'none';
      if (tab === 'products') {
        tabProducts.style.background = 'var(--primary)';
        tabProducts.style.color = '#fff';
        productsPanel.style.display = '';
      } else {
        tabOrders.style.background = 'var(--primary)';
        tabOrders.style.color = '#fff';
        ordersPanel.style.display = '';
        renderOrders();
      }
    }

    tabProducts.addEventListener('click', () => switchTab('products'));
    tabOrders.addEventListener('click', () => switchTab('orders'));
  });

  /* ----- Orders Functions ----- */

  async function fetchOrders() {
    try {
      const res = await fetch(API_BASE + '/api/admin/orders');
      if (res.ok) return await res.json();
    } catch (_) {}
    try {
      const stored = localStorage.getItem('op_orders');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  }

  function getStatusBadge(status) {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    const bg = colors[status] || '#6b7280';
    return `<span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:600;color:#fff;background:${bg};">${status}</span>`;
  }

  async function renderOrders() {
    const orders = await fetchOrders();
    const tbody = document.getElementById('ordersBody');
    if (!tbody) return;
    const h = window.OmarPhone ? window.OmarPhone.escapeHtml : (s => s);

    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:48px 0;color:var(--text-secondary);">No orders yet.</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(order => {
      const date = order.created_at
        ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : order.date ? new Date(order.date).toLocaleDateString() : '—';
      const customer = order.customer || {};
      const items = order.items || [];
      const itemsHtml = items.map(i => `<div style="font-size:0.75rem;color:var(--text-secondary);">${h(i.name || 'Item')} x${i.quantity || 1}</div>`).join('');
      return `
        <tr>
          <td style="font-size:0.813rem;white-space:nowrap;">${date}</td>
          <td>${h(customer.name || '—')}</td>
          <td>${h(customer.phone || '—')}</td>
          <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${h(customer.address || '')}">${h(customer.address || '—')}</td>
          <td>${itemsHtml}</td>
          <td style="font-weight:700;white-space:nowrap;">EGP ${(order.total || 0).toLocaleString()}</td>
          <td>${getStatusBadge(order.status || 'pending')}</td>
          <td>
            <select class="form-input status-select" data-id="${h(order.id)}" style="padding:4px 8px;font-size:0.75rem;width:auto;">
              <option value="pending" ${(order.status || 'pending') === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => updateOrderStatus(sel.dataset.id, sel.value));
    });
  }

  async function updateOrderStatus(id, status) {
    try {
      const res = await fetch(API_BASE + '/api/admin/orders/' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast('Order status updated!');
      } else {
        showToast('Failed to update order status', 'error');
      }
    } catch (err) {
      showToast('Server unreachable', 'error');
    }
  }

})();
