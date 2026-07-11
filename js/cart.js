(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('applyCoupon')?.addEventListener('click', applyCoupon);
    document.getElementById('shippingSelect')?.addEventListener('change', updateSummary);
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
    document.addEventListener('cartUpdated', renderCart);
  });

  function getCart() {
    return window.OmarPhone ? window.OmarPhone.getCart() : [];
  }

  let appliedCoupon = null;

  function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');

    if (!container || !summary) return;

    if (!cart.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="21" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h2 class="empty-state-title">Your cart is empty</h2>
          <p class="empty-state-text">Looks like you haven't added anything yet.</p>
          <a href="shop.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      document.getElementById('cartLayout').style.gridTemplateColumns = '1fr';
      summary.style.display = 'none';
      return;
    }

    document.getElementById('cartLayout').style.gridTemplateColumns = '';
    summary.style.display = 'block';

    let html = '';
    cart.forEach((item, index) => {
      const specs = [];
      if (item.storage) specs.push(item.storage);
      if (item.color) specs.push(item.color);
      const image = item.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop';
      html += `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item-image">
            <img src="${image}" alt="${item.name || 'Product'}" loading="lazy">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name || 'Product'}</div>
            <div class="cart-item-specs">${specs.length ? specs.join(' / ') : 'Standard'}</div>
            <div class="cart-item-price">EGP ${(item.price || 0).toFixed(2)}</div>
            <div class="cart-item-actions">
              <div class="cart-item-qty">
                <button class="qty-minus" data-index="${index}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <input type="text" value="${item.quantity || 1}" readonly aria-label="Quantity">
                <button class="qty-plus" data-index="${index}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              <button class="cart-item-remove" data-index="${index}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Remove
              </button>
            </div>
          </div>
          <div class="cart-item-subtotal">EGP ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        changeQuantity(idx, -1);
      });
    });

    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        changeQuantity(idx, 1);
      });
    });

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        removeItem(idx);
      });
    });

    updateSummary();
  }

  function changeQuantity(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    const newQty = (cart[index].quantity || 1) + delta;
    if (newQty < 1) return;
    if (window.OmarPhone) {
      window.OmarPhone.updateCartQuantity(cart[index].id, cart[index].storage, cart[index].color, newQty);
    }
  }

  function removeItem(index) {
    const cart = getCart();
    if (!cart[index]) return;
    if (window.OmarPhone) {
      window.OmarPhone.removeFromCart(cart[index].id, cart[index].storage, cart[index].color);
    }
  }

  function applyCoupon() {
    const input = document.getElementById('couponInput');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (code === 'OMAR10') {
      appliedCoupon = 'OMAR10';
      if (window.OmarPhone) window.OmarPhone.showToast('Coupon applied! 10% discount', 'success');
    } else {
      appliedCoupon = null;
      if (window.OmarPhone) window.OmarPhone.showToast('Invalid coupon code', 'error');
    }
    document.getElementById('discountRow').style.display = appliedCoupon ? 'flex' : 'none';
    updateSummary();
  }

  function updateSummary() {
    const cart = getCart();
    if (!cart.length) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const discount = appliedCoupon ? subtotal * 0.1 : 0;
    const shipping = parseFloat(document.getElementById('shippingSelect')?.value || 0);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.15;
    const total = afterDiscount + shipping + tax;

    document.getElementById('summarySubtotal').textContent = 'EGP ' + subtotal.toFixed(2);
    if (appliedCoupon) {
      document.getElementById('summaryDiscount').textContent = '-EGP ' + discount.toFixed(2);
    }
    document.getElementById('summaryTax').textContent = 'EGP ' + tax.toFixed(2);
    document.getElementById('summaryTotal').textContent = 'EGP ' + total.toFixed(2);
  }

  function checkout() {
    if (window.OmarPhone && !window.OmarPhone.requireAuth()) return;
    const cart = getCart();
    if (!cart.length) {
      if (window.OmarPhone) window.OmarPhone.showToast('Your cart is empty', 'error');
      return;
    }
    const order = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      items: cart,
      total: parseFloat(document.getElementById('summaryTotal')?.textContent?.replace('EGP ', '') || 0),
      date: new Date().toISOString(),
      status: 'pending',
      payment: 'Cash on Delivery',
    };
    try {
      const orders = JSON.parse(localStorage.getItem('op_orders') || '[]');
      orders.push(order);
      localStorage.setItem('op_orders', JSON.stringify(orders));
    } catch {}
    if (window.OmarPhone) {
      window.OmarPhone.showToast('Order placed! Pay with cash upon delivery.', 'success');
      window.OmarPhone.clearCart();
    }
  }

})();
