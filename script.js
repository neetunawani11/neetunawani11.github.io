
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        menuToggle.textContent = "☰";
      });
    });

    // Reset navigation when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        menuToggle.textContent = "☰";
      }
    });
  }

  // Automatically update the footer year
  const footer = document.querySelector(".footer p");

  if (footer) {
    footer.textContent =
      `© ${new Date().getFullYear()} Neetu Nawani. Built with HTML, CSS & JavaScript.`;
  }
});
