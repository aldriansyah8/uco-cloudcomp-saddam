// =========================================================
// AUTENTIKASI (dipakai di index.html, login.html, register.html)
// Halaman dikenali lewat atribut <body data-page="...">
// =========================================================

function showToast(message, type = "success") {
  const toastEl = document.getElementById("mainToast");
  const toastBody = document.getElementById("toastBody");
  if (!toastEl || !toastBody) return;

  toastEl.classList.remove("bg-success", "bg-danger", "bg-info");
  toastEl.classList.add(
    type === "error" ? "bg-danger" : type === "info" ? "bg-info" : "bg-success"
  );
  toastBody.textContent = message;
  new bootstrap.Toast(toastEl, { delay: 2500 }).show();
}

// Toggle Show/Hide Password
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", function () {
    const input = this.previousElementSibling;
    const iconBi = this.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      iconBi.classList.remove("bi-eye");
      iconBi.classList.add("bi-eye-slash");
    } else {
      input.type = "password";
      iconBi.classList.remove("bi-eye-slash");
      iconBi.classList.add("bi-eye");
    }
  });
});

// ---------- Guard / Redirect berdasarkan status login ----------
const currentPage = document.body.dataset.page; // "index" | "login" | "register"

auth.onAuthStateChanged((user) => {
  if (user && (currentPage === "login" || currentPage === "register")) {
    // Sudah login -> tidak perlu di halaman login/register
    window.location.replace("index.html");
  } else if (!user && currentPage === "index") {
    // Belum login -> tidak boleh masuk ke halaman utama
    window.location.replace("login.html");
  }
});

// ---------- Register ----------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;
    const passConfirm = document.getElementById("regPasswordConfirm").value;

    if (pass !== passConfirm) {
      showToast("Registrasi gagal: Password tidak cocok!", "error");
      return;
    }

    auth.createUserWithEmailAndPassword(email, pass)
      .then(() => {
        showToast("Berhasil mendaftar akun!");
        registerForm.reset();
        // Redirect ditangani onAuthStateChanged
      })
      .catch((err) => showToast("Gagal mendaftar: " + err.message, "error"));
  });
}

// ---------- Login ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        showToast("Berhasil login!");
        loginForm.reset();
        // Redirect ditangani onAuthStateChanged
      })
      .catch((err) => showToast("Gagal login: " + err.message, "error"));
  });
}

// ---------- Logout ----------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    auth.signOut()
      .catch((err) => showToast("Gagal logout: " + err.message, "error"));
    // Redirect ke login.html ditangani onAuthStateChanged
  });
}
