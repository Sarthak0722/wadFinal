// Run based on page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").addEventListener("submit", registerUser);
  } else if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", loginUser);
  } else if (document.getElementById("userTableBody")) {
    loadUsersTable();
  }
});

// Validate & Register
function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value.trim();
  const address = document.getElementById("address").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!/^\d{10}$/.test(mobile)) return alert("Enter valid 10-digit mobile number.");
  if (password.length < 6) return alert("Password must be at least 6 characters.");
  if (!isOldEnough(dob)) return alert("Must be 13 or older to register.");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "fake-register-url", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let users = JSON.parse(localStorage.getItem("users")) || [];    
      if (users.some(u => u.username === username)) {
        return alert("Username already exists!");
      }

      users.push({ name, email, mobile, dob, city, address, username, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registered successfully!");
      window.location.href = "login.html";
    }
  };

  const user = { name, email, mobile, dob, city, address, username, password };
  xhr.send(JSON.stringify(user));
}

// Login User
function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "fake-login-url", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        // ✅ Store login session
        localStorage.setItem("loggedInUser", user.username);

        alert("Login successful!");
        window.location.href = "users.html";
      } else {
        alert("Invalid credentials.");
      }
    }
  };

  xhr.send(JSON.stringify({ username, password }));
}


// Load users
function loadUsersTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tbody = document.getElementById("userTableBody");
  users.forEach(u => {
    const row = `<tr>
      <td>${u.name}</td><td>${u.email}</td><td>${u.mobile}</td>
      <td>${u.dob}</td><td>${u.city}</td><td>${u.address}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// DOB age check
function isOldEnough(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age > 13 || (age === 13 && today >= new Date(birthDate.setFullYear(today.getFullYear())));
}
// Load only logged-in user data
function loadUsersTable() {
  const loggedInUsername = localStorage.getItem("loggedInUser");
  if (!loggedInUsername) {
    alert("Unauthorized! Please login.");
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users.find(u => u.username === loggedInUsername);

  if (!currentUser) {
    alert("User not found.");
    window.location.href = "login.html";
    return;
  }

  // Set welcome name
  document.getElementById("welcomeUser").textContent = currentUser.name;

  // Fill table with current user
  const row = `<tr>
    <td>${currentUser.name}</td><td>${currentUser.email}</td><td>${currentUser.mobile}</td>
    <td>${currentUser.dob}</td><td>${currentUser.city}</td><td>${currentUser.address}</td>
  </tr>`;
  document.getElementById("userTableBody").innerHTML = row;

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("Logged out!");
    window.location.href = "login.html";
  });
}