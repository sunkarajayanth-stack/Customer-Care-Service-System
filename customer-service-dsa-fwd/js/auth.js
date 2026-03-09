(function () {
  const usersKey = 'acsms_users';
  const authKey = 'acsms_auth';

  const readUsers = () => JSON.parse(localStorage.getItem(usersKey) || '[]');
  const saveUsers = (users) => localStorage.setItem(usersKey, JSON.stringify(users));

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const msg = document.getElementById('authMsg');
      const user = readUsers().find((u) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem(authKey, JSON.stringify({ email: user.email, role: user.role }));
        msg.textContent = 'Login successful. Redirecting...';
        setTimeout(() => (window.location.href = 'dashboard.html'), 700);
      } else {
        msg.textContent = 'Invalid credentials. Use register first.';
      }
    });
  }

  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const role = document.getElementById('regRole').value;
      const password = document.getElementById('regPassword').value;
      const msg = document.getElementById('regMsg');

      if (!name || !email || !password) {
        msg.textContent = 'Please complete all fields.';
        return;
      }
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        msg.textContent = 'Email already exists.';
        return;
      }
      users.push({ id: Date.now(), name, email, role, password });
      saveUsers(users);
      msg.textContent = 'Registration successful. Redirecting to login...';
      setTimeout(() => (window.location.href = 'login.html'), 800);
    });
  }

  if (location.pathname.endsWith('/index.html') || location.pathname.endsWith('/')) {
    if (!readUsers().length) {
      saveUsers([{ id: 1, name: 'Admin', email: 'admin@service.com', role: 'Admin', password: '1234' }]);
    }
  }
})();
