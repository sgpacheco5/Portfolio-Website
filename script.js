// script.js
// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);

  if (newTheme === "dark") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
});

// Music Toggle - Fixed to actually play/pause audio
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const musicOnIcon = document.getElementById("musicOnIcon");
const musicOffIcon = document.getElementById("musicOffIcon");
let musicPlaying = false;

// Set initial state to off
musicOffIcon.style.display = "block";
musicOnIcon.style.display = "none";

musicToggle.addEventListener("click", () => {
  musicPlaying = !musicPlaying;

  if (musicPlaying) {
    bgMusic.play().catch((error) => {
      console.log("Error playing music:", error);
      musicPlaying = false;
    });
    musicOnIcon.style.display = "block";
    musicOffIcon.style.display = "none";
    console.log("Music started");
  } else {
    bgMusic.pause();
    musicOnIcon.style.display = "none";
    musicOffIcon.style.display = "block";
    console.log("Music stopped");
  }
});

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById("hamburgerMenu");
const mobileMenu = document.getElementById("mobileMenu");

hamburgerMenu.addEventListener("click", () => {
  hamburgerMenu.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

// Close mobile menu when clicking a link
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburgerMenu.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburgerMenu.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
});

// Social Links
document.getElementById("linkedinBtn").onclick = () =>
  window.open("https://www.linkedin.com/in/sydneypacheco/", "_blank");
document.getElementById("githubBtn").onclick = () =>
  window.open("https://github.com/sgpacheco5", "_blank");

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Resume Modal
const resumeLink = document.querySelector(".resume-link");
const modal = document.getElementById("resumeModal");
const closeModal = document.querySelector(".close-modal");
const downloadBtn = document.getElementById("downloadResume");

resumeLink.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Download resume
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = "assets/resume/Sydney-Pacheco-Resume.pdf";
  link.download = "Sydney_Pacheco_Resume.pdf";
  link.click();
});

// Contact Form
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector(".submit-btn");
  const formData = new FormData(contactForm);

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Create mailto link as fallback
  const mailtoLink = `mailto:sgpacheco5@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;

  try {
    // Try using Web3Forms API
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "36b5c77c-4afd-43a5-8076-eddab85b7a4c", // replace with env-protected key later
        name,
        email,
        subject,
        message,
        to: "sgpacheco5@gmail.com",
      }),
    });

    const result = await response.json();

    if (result.success) {
      showToast(
        "✅ Message sent successfully! I'll get back to you soon.",
        "success"
      );
      contactForm.reset();
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    console.log("Using mailto fallback");
    window.location.href = mailtoLink;
    showToast("📧 Opening your email client...", "info");

    setTimeout(() => {
      contactForm.reset();
    }, 2000);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});

// ============================
// Toast notification function
// ============================
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  // Remove after a few seconds
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
