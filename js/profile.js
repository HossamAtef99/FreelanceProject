(function () {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  const PHOTO_KEY = 'op_user_photo';

  const STATUS_ORDER = ['pending', 'completed'];

  document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('op_user_logged') !== '1') {
      window.location.href = 'login.html';
      return;
    }

    loadProfile();
    initPhotoUpload();
    initLogout();
    initTabs();
    await loadOrders();
  });

  function loadProfile() {
    const name = localStorage.getItem('op_user_name') || '—';
    const els = document.querySelectorAll('#profileName, #profileNameField');
    els.forEach(el => el.textContent = name);

    const photo = localStorage.getItem(PHOTO_KEY);
    const img = document.getElementById('profileAvatar');
    if (photo && photo.startsWith('data:image')) {
      img.src = photo;
    } else {
      img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="1"><circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/></svg>');
    }

    loadEmail();
  }

  async function loadEmail() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user?.email) {
        const email = session.user.email;
        const els = document.querySelectorAll('#profileEmail, #profileEmailField');
        els.forEach(el => el.textContent = email);
      }
    } catch (err) { console.warn('Session load failed:', err); }
  }

  function initPhotoUpload() {
    const wrap = document.getElementById('avatarWrap');
    const input = document.getElementById('avatarInput');
    if (!wrap || !input) return;

    wrap.addEventListener('click', () => input.click());

    input.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        if (window.OmarPhone) window.OmarPhone.showToast('Please select an image file', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        if (window.OmarPhone) window.OmarPhone.showToast('Image must be under 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        localStorage.setItem(PHOTO_KEY, dataUrl);
        document.getElementById('profileAvatar').src = dataUrl;
        if (window.OmarPhone) window.OmarPhone.showToast('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  function initLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      localStorage.removeItem('op_user_logged');
      localStorage.removeItem('op_user_name');
      localStorage.removeItem('op_admin_logged');
      localStorage.removeItem(PHOTO_KEY);

      try {
        await supabase.auth.signOut();
      } catch (err) { console.warn('Sign out failed:', err); }

      window.location.href = 'login.html';
    });
  }

  /* ----- Orders ----- */

  async function getUserEmail() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.email || null;
    } catch { return null; }
  }

  async function fetchUserOrders(email) {
    const orders = [];
    try {
      const storedName = localStorage.getItem('op_user_name') || '';
      const res = await fetch(API_BASE + '/api/orders/user/' + encodeURIComponent(email) + (storedName ? '?name=' + encodeURIComponent(storedName) : ''));
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) orders.push(...data);
      }
    } catch (_) {}
    const local = localStorage.getItem('op_orders');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          const storedName = localStorage.getItem('op_user_name') || '';
          parsed.forEach(o => {
            if (!o.customer) return;
            const matchEmail = o.customer.email && o.customer.email === email;
            const matchName = !matchEmail && storedName && o.customer.name === storedName;
            if ((matchEmail || matchName) && !orders.some(x => x.id === o.id)) orders.push(o);
          });
        }
      } catch (_) {}
    }
    return orders;
  }

  async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(API_BASE + '/api/orders/' + encodeURIComponent(orderId) + '/cancel', { method: 'PUT' });
      if (res.ok) {
        if (window.OmarPhone) window.OmarPhone.showToast('Order cancelled!', 'success');
        await loadOrders();
      } else {
        const err = await res.json().catch(() => ({}));
        if (window.OmarPhone) window.OmarPhone.showToast(err.error || 'Failed to cancel order', 'error');
      }
    } catch (_) {
      if (window.OmarPhone) window.OmarPhone.showToast('Server unreachable', 'error');
    }
  }

  function getStatusIndex(status) {
    const idx = STATUS_ORDER.indexOf(status);
    return idx >= 0 ? idx : -1;
  }

  function getStatusColor(status) {
    const map = { pending: '#f59e0b', completed: '#10b981', cancelled: '#ef4444' };
    return map[status] || '#6b7280';
  }

  function renderTimeline(status) {
    if (status === 'cancelled') {
      return `
        <div class="timeline" style="justify-content:center;">
          <div class="timeline-step" style="flex:none;">
            <div class="timeline-dot cancelled" style="width:36px;height:36px;font-size:0.875rem;">✕</div>
            <div class="timeline-label cancelled">Cancelled</div>
          </div>
        </div>`;
    }
    const currentIdx = getStatusIndex(status);
    return `<div class="timeline">` + STATUS_ORDER.map((s, i) => {
      const cls = i < currentIdx ? 'done' : i === currentIdx ? 'active' : '';
      const label = s === 'completed' ? 'Delivered' : s.charAt(0).toUpperCase() + s.slice(1);
      return `
        <div class="timeline-step">
          <div class="timeline-dot ${cls}">${i < currentIdx ? '✓' : i === currentIdx ? '●' : '○'}</div>
          <div class="timeline-label ${cls}">${label}</div>
          ${i < STATUS_ORDER.length - 1 ? `<div class="timeline-line ${i < currentIdx ? 'done' : ''}"></div>` : ''}
        </div>`;
    }).join('') + `</div>`;
  }

  function initTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const profileSection = document.getElementById('profileSection');
    const ordersSection = document.getElementById('ordersSection');
    if (!tabs.length || !profileSection || !ordersSection) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.id === 'tabProfile') {
          profileSection.style.display = '';
          ordersSection.style.display = 'none';
        } else {
          profileSection.style.display = 'none';
          ordersSection.style.display = '';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  async function loadOrders() {
    const section = document.getElementById('ordersSection');
    const container = document.getElementById('ordersContainer');
    if (!section || !container) return;

    section.style.display = '';
    const userEmail = await getUserEmail();
    let orders = [];
    if (userEmail) orders = await fetchUserOrders(userEmail);

    if (!orders.length) {
      const local = localStorage.getItem('op_orders');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length) orders = parsed;
        } catch (_) {}
      }
    }

    if (!orders.length) { container.innerHTML = '<div class="orders-empty"><p>No orders found yet.</p></div>'; return; }
    renderOrders(orders);
  }

  function renderOrders(orders) {
    const container = document.getElementById('ordersContainer');
    if (!container) return;
    const h = window.OmarPhone ? window.OmarPhone.escapeHtml : (s => s);

    container.innerHTML = orders.map(order => {
      const date = order.created_at
        ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : order.date ? new Date(order.date).toLocaleDateString() : '—';
      const items = order.items || [];
      const itemsHtml = items.map(item => `
        <div class="order-item">
          <span>${h(item.name || 'Item')} × ${item.quantity || 1}</span>
          <span>EGP ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
        </div>`).join('');
      const statusColor = getStatusColor(order.status || 'pending');
      const canCancel = order.status === 'pending';
      return `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">#${h(order.id)}</span>
            <span class="order-date">${date}</span>
          </div>
          ${renderTimeline(order.status || 'pending')}
          <div class="order-items">${itemsHtml}</div>
          <div class="order-total">
            <span>Total</span>
            <span style="color:${statusColor};">EGP ${(order.total || 0).toLocaleString()}</span>
          </div>
          <div class="order-actions">
            ${canCancel ? `<button class="btn cancel-order-btn" data-id="${h(order.id)}" style="border:1px solid var(--danger);color:var(--danger);background:transparent;padding:8px 20px;font-size:0.813rem;border-radius:var(--radius-md);cursor:pointer;">Cancel Order</button>` : ''}
          </div>
        </div>`;
    }).join('');

    container.querySelectorAll('.cancel-order-btn').forEach(btn => {
      btn.addEventListener('click', () => cancelOrder(btn.dataset.id));
    });
  }

})();