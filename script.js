document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");
  const form = document.getElementById("contactForm");

  // Back to Top
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 200 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Contact Form Validation + Toast
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    // Show Bootstrap toast
    const toastEl = document.getElementById("successToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    form.reset();
  });
});
