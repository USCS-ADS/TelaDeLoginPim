(() => {
    'use strict';

    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const googleBtn = document.getElementById('googleBtn');
    const rememberCheckbox = document.getElementById('remember');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    const STORAGE_KEY = 'marques_remember_email';

    const savedEmail = localStorage.getItem(STORAGE_KEY);
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }

    const validators = {
        email(value) {
            if (!value.trim()) return 'Por favor, informe seu e-mail.';
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(value)) return 'E-mail inválido. Verifique o formato.';
            return null;
        },
        password(value) {
            if (!value) return 'Por favor, informe sua senha.';
            if (value.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
            return null;
        }
    };

    function setFieldError(input, errorEl, message) {
        const field = input.closest('.field');
        if (message) {
            field.classList.add('field--error');
            errorEl.textContent = message;
        } else {
            field.classList.remove('field--error');
            errorEl.textContent = '';
        }
    }

    emailInput.addEventListener('blur', () => {
        const err = validators.email(emailInput.value);
        setFieldError(emailInput, emailError, err);
    });

    passwordInput.addEventListener('blur', () => {
        const err = validators.password(passwordInput.value);
        setFieldError(passwordInput, passwordError, err);
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.closest('.field').classList.contains('field--error')) {
            setFieldError(emailInput, emailError, null);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.closest('.field').classList.contains('field--error')) {
            setFieldError(passwordInput, passwordError, null);
        }
    });

    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.setAttribute(
            'aria-label',
            isPassword ? 'Ocultar senha' : 'Mostrar senha'
        );

        togglePassword.innerHTML = isPassword
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                 <line x1="1" y1="1" x2="23" y2="23"/>
               </svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                 <circle cx="12" cy="12" r="3"/>
               </svg>`;
    });

    let toastTimeout;
    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.classList.toggle('toast--error', type === 'error');
        toast.querySelector('.toast__icon').textContent = type === 'error' ? '⚠' : '✓';
        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailErr = validators.email(emailInput.value);
        const passwordErr = validators.password(passwordInput.value);

        setFieldError(emailInput, emailError, emailErr);
        setFieldError(passwordInput, passwordError, passwordErr);

        if (emailErr || passwordErr) {
            if (emailErr) emailInput.focus();
            else passwordInput.focus();
            return;
        }

        if (rememberCheckbox.checked) {
            localStorage.setItem(STORAGE_KEY, emailInput.value.trim());
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            await simulateLogin({
                email: emailInput.value.trim(),
                password: passwordInput.value,
                remember: rememberCheckbox.checked
            });

            showToast('Login realizado com sucesso! Redirecionando...', 'success');

        } catch (err) {
            showToast(err.message || 'Erro ao realizar login. Tente novamente.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function simulateLogin(payload) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (payload.password === 'errado') {
                    reject(new Error('E-mail ou senha incorretos.'));
                } else {
                    resolve({ token: 'fake-jwt-token', user: payload.email });
                }
            }, 1400);
        });
    }

    googleBtn.addEventListener('click', () => {
        showToast('Redirecionando para o Google...', 'success');
    });

    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });

    if (!savedEmail) {
        setTimeout(() => emailInput.focus(), 800);
    } else {
        setTimeout(() => passwordInput.focus(), 800);
    }
})();
