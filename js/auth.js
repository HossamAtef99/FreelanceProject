(function() {
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
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const emailErr = document.getElementById('loginEmailError');
        const passErr = document.getElementById('loginPasswordError');

        const validEmail = validateField(email, emailErr, email.value.trim() && email.validity.valid);
        const validPass = validateField(password, passErr, password.value.trim().length >= 6);

        if (validEmail && validPass) {
          showToast('Signed in successfully! Redirecting...', 'success');
          setTimeout(() => window.location.href = 'index.html', 1500);
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
      registerForm.addEventListener('submit', (e) => {
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

        if (validName && validEmail && validPass && validConfirm) {
          showToast('Account created successfully! Redirecting...', 'success');
          setTimeout(() => window.location.href = 'index.html', 1500);
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

  document.addEventListener('DOMContentLoaded', () => {
    initAuthForms();
  });
})();
