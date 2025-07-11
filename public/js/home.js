

// Login Form Handling
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  let userDetails = {
    email,
    password,
  };

  await axios
    .post(`http://localhost:3000/api/user/find`, userDetails)
    .then((result) => {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem('isPremium', result.data.user.isPremium)
      localStorage.setItem('name', result.data.user.name)
      //console.log(result);
      //
      loginMessage.classList.remove("d-none", "alert-danger", "alert-success");
      loginMessage.classList.add("alert-success");
      loginMessage.textContent = `Login successful! Redirecting...`;

      // Redirect after 2 seconds
       setTimeout(() => {
         window.location.href = "/dashboard.html";
       }, 2000);
    })
    .catch((err) => {
      //console.log(err);
      loginMessage.classList.remove("d-none", "alert-danger", "alert-success");
      loginMessage.classList.add("alert-success");
      loginMessage.textContent = `${err.response.data}`;
    });

  
});

// Signup Form Handling
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword"
  ).value;

  if (password !== confirmPassword) {
    signupMessage.classList.remove("d-none", "alert-success");
    signupMessage.classList.add("alert-danger");
    signupMessage.textContent = "Passwords do not match!";
    return;
  }

  let newUser = {
    name: name,
    email: email,
    password: password,
  };

  const result = await axios.post(
    `http://localhost:3000/api/user/create`,
    newUser
  );
  //console.log(result);

  // Simulate API call
  setTimeout(() => {
    signupMessage.classList.remove("d-none", "alert-danger");
    signupMessage.classList.add("alert-success");
    signupMessage.textContent = "Account created successfully!";

    // Close modal after 2 seconds
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("signupModal")
      );
      modal.hide();
    }, 2000);
  }, 1000);
});

// Forgot Password Form Handling
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

forgotPasswordForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value;

  await axios.post('/api/user/forgotpassword', {email: email});
  
  // Simulate API call
  setTimeout(() => {
    forgotPasswordMessage.classList.remove("d-none", "alert-danger");
    forgotPasswordMessage.classList.add("alert-success");
    forgotPasswordMessage.textContent =
      "Password reset link sent to your email!";

      
    // Close modal after 3 seconds
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("forgotPasswordModal")
      );
      modal.hide();
    }, 3000);
  }, 1000);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Initialize tooltips
const tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});


// Premium Modal Handler
document.getElementById("upgradeButton").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // If not logged in, show login modal
    $("#premiumModal").modal("hide");
    $("#loginModal").modal("show");
  } else {
    // If logged in, redirect to dashboard
    window.location.href = "/dashboard.html";
  }
});

function showError(message) {
  const messageDiv =
    document.getElementById("premiumMessage") || document.createElement("div");
  messageDiv.className = "alert alert-danger mt-3";
  messageDiv.textContent = message;
  document.querySelector("#premiumModal .modal-body").appendChild(messageDiv);
}


