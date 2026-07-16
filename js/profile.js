(function () {
  'use strict';

  const PHOTO_KEY = 'op_user_photo';

  document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('op_user_logged') !== '1') {
      window.location.href = 'login.html';
      return;
    }

    loadProfile();
    initPhotoUpload();
    initLogout();
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
})();
