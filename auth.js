const API_URL = "http://localhost:5000/api";

// Correctly select the signup form and add the event listener
document.querySelector("#signup-form form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    // Use the IDs from Login.html for registration
    name: document.getElementById("signup-name").value,
    email: document.getElementById("signup-email").value,
    password: document.getElementById("signup-password").value,
  };

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    const data = await res.json();
    window.location.href = "Login.html"; 
  } catch (error) {
    console.error("Registration failed:", error);
    alert("Registration failed. Please try again.");
  }
});

// Correctly select the login form and add the event listener
document.querySelector("#login-form form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const creds = {
    // Use the IDs from Login.html for login
    email: document.getElementById("login-email").value,
    password: document.getElementById("login-password").value,
  };

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
    });
    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.name);
        // Redirect to a dashboard or another page on successful login
        
        window.location.href = "Cities.html"; 
    } else {
        alert(data.msg || "Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please try again.");
  }
});
