document.addEventListener("DOMContentLoaded", () => {
  const loginToggle = document.getElementById("loginToggle");
  const signupToggle = document.getElementById("signupToggle");
  const teacherToggle = document.getElementById("teacherToggle");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const teacherForm = document.getElementById("teacherForm");

  loginToggle.addEventListener("click", () => {
    showForm(loginForm);
    activateButton(loginToggle);
  });

  signupToggle.addEventListener("click", () => {
    showForm(signupForm);
    activateButton(signupToggle);
  });

  teacherToggle.addEventListener("click", () => {
    showForm(teacherForm);
    activateButton(teacherToggle);
  });

  function showForm(form) {
    // Hide all forms
    loginForm.classList.remove("active-form");
    signupForm.classList.remove("active-form");
    teacherForm.classList.remove("active-form");

    // Show the selected form
    form.classList.add("active-form");
  }

  function activateButton(button) {
    // Deactivate all toggle buttons
    loginToggle.classList.remove("active");
    signupToggle.classList.remove("active");
    teacherToggle.classList.remove("active");

    // Activate the clicked button
    button.classList.add("active");
  }
});

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    // Send login request to the backend
    console.log(email, password);
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect; // Redirect on success
        } else {
          console.error("Login failed:", data.error); // Handle errors
        }
      })
      .catch((error) => console.error("Error:", error));

    const result = await response.json();
    if (response.ok) {
      alert(result.message); // Show success message
    } else {
      alert(result.error); // Show error message
    }
  });

// Handle Sign-Up
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const full_name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const type = "STUDENT";

    // Send sign-up request to the backend
    const response = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, type }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message); // Show success message
    } else {
      alert(result.error); // Show error message
    }
  });

document
  .getElementById("teacherForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const id = document.getElementById("teacherId").value;
    const password = document.getElementById("teacherPassword").value;
    // Send login request to the backend
    const response = await fetch("/teacher-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect; // Redirect on success
        } else {
          console.error("Login failed:", data.error); // Handle errors
        }
      })
      .catch((error) => console.error("Error:", error));

    const result = await response.json();
    if (response.ok) {
      alert(result.message); // Show success message
    } else {
      alert(result.error); // Show error message
    }
  });
