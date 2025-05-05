document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const userTable = document.getElementById('userTable');

  // ---------- REGISTER ----------
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        dob: document.getElementById('dob').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      };

      // Save using XHR
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/register',true); // Fake endpoint
      xhr.onload = () => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        registerForm.reset();
      };
      xhr.send(); // We're just using this to trigger the function
    });
  }

  // ---------- LOGIN ----------
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/login',true); // Fake endpoint
      xhr.onload = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const found = users.find(u => u.username === username && u.password === password);

        if (found) {
          alert('Login successful!');
          window.location.href = 'users.html';
        } else {
          alert('Invalid credentials!');
        }
      };
      xhr.send(); // Trigger check
    });
  }

  // ---------- DISPLAY USERS ----------
  if (userTable) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-users',true); // Fake endpoint
    xhr.onload = () => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      users.forEach(user => {
        const row = document.getElementById('tbody');
        tbody.innerHTML = `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.mobile}</td>
          <td>${user.dob}</td>
          <td>${user.city}</td>
          <td>${user.address}</td>
        <tr>
        `;
      });
    };
    xhr.send();
  }
});
