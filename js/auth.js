(function () {
  'use strict';

  function validateField(input, errorEl, condition) {
    if (!condition) {
      input.classList.add('input-error');
      errorEl.classList.add('show');
      return false;
    }
    input.classList.remove('input-error');
    errorEl.classList.remove('show');
    return true;
  }

  function initAuthForms() {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginCard = document.getElementById('loginForm');
    const registerCard = document.getElementById('registerForm');

    if (showRegister && showLogin && loginCard && registerCard) {
      showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
      });

      showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerCard.style.display = 'none';
        loginCard.style.display = 'block';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const emailErr = document.getElementById('loginEmailError');
        const passErr = document.getElementById('loginPasswordError');

        const validEmail = validateField(email, emailErr, email.value.trim() && email.validity.valid);
        const validPass = validateField(password, passErr, password.value.trim().length >= 6);

        if (!validEmail || !validPass) return;

        const btn = loginForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Signing in...';

        try {
          if (!supabase) {
            throw new Error('Authentication service is unavailable. Please try again later.');
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value.trim(),
            password: password.value,
          });

          if (error) {
            showToast(error.message, 'error');
            return;
          }

          localStorage.setItem('op_user_logged', '1');
          if (data.user?.email === 'admin@omarphone.com') {
            localStorage.setItem('op_admin_logged', '1');
          }
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, role')
              .eq('id', data.user.id)
              .maybeSingle();
            if (profileData?.name) {
              localStorage.setItem('op_user_name', profileData.name);
            }
            if (profileData?.role === 'admin') {
              localStorage.setItem('op_admin_logged', '1');
            }
          } catch (e) { console.warn('Profile fetch failed:', e); }
          if (localStorage.getItem('op_admin_logged') === '1') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        } catch (err) {
          showToast(err.message || 'Login failed. Please try again.', 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Sign In';
        }
      });

      document.querySelectorAll('#loginFormElement .form-input').forEach(input => {
        input.addEventListener('input', () => {
          input.classList.remove('input-error');
          const err = document.getElementById(input.id + 'Error');
          if (err) err.classList.remove('show');
        });
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName');
        const email = document.getElementById('regEmail');
        const password = document.getElementById('regPassword');
        const confirm = document.getElementById('regConfirm');
        const nameErr = document.getElementById('regNameError');
        const emailErr = document.getElementById('regEmailError');
        const passErr = document.getElementById('regPasswordError');
        const confirmErr = document.getElementById('regConfirmError');

        const validName = validateField(name, nameErr, name.value.trim().length > 0);
        const validEmail = validateField(email, emailErr, email.value.trim() && email.validity.valid);
        const validPass = validateField(password, passErr, password.value.trim().length >= 6);
        const validConfirm = validateField(confirm, confirmErr, confirm.value === password.value && confirm.value.trim().length > 0);

        if (!validName || !validEmail || !validPass || !validConfirm) return;

        if (email.value.trim() === 'admin@omarphone.com') {
          showToast('This email is reserved for admin.', 'error');
          return;
        }

        const btn = registerForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Creating account...';

        try {
          if (!supabase) {
            throw new Error('Authentication service is unavailable. Please try again later.');
          }

          const { data, error } = await supabase.auth.signUp({
            email: email.value.trim(),
            password: password.value,
          });

          if (error) {
            showToast(error.message, 'error');
            return;
          }

          if (data?.user?.identities?.length === 0) {
            showToast('This email is already registered. Please sign in.', 'error');
            return;
          }

          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, name: name.value.trim(), email: email.value.trim(), role: 'customer' }]);

            if (profileError) {
              console.warn('Profile insert failed:', profileError.message);
            }
          } catch (e) { console.warn('Profile insert failed:', e); }

          localStorage.setItem('op_user_name', name.value.trim());
          showToast('Account created! Check your email to confirm.', 'success');
          setTimeout(() => window.location.href = 'login.html', 2000);
        } catch (err) {
          showToast(err.message || 'Registration failed. Please try again.', 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Create Account';
        }
      });

      document.querySelectorAll('#registerFormElement .form-input').forEach(input => {
        input.addEventListener('input', () => {
          input.classList.remove('input-error');
          const err = document.getElementById(input.id + 'Error');
          if (err) err.classList.remove('show');
        });
      });
    }
  }

  function showToast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAuthForms();
  });
})();
