
"use strict";

/* ========================================
   PORTFOLIO JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", () => {

  // FOOTER YEAR

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // MOBILE NAVIGATION

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // PROJECT FILTERS

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      const filter = button.dataset.filter;

      filterButtons.forEach(btn => {
        const active = btn === button;

        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      projects.forEach(project => {

        const categories = project.dataset.category.split(" ");

        project.hidden =
          filter !== "all" &&
          !categories.includes(filter);

      });

    });

  });

  // SCROLL REVEAL

  const revealElements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (
    "IntersectionObserver" in window &&
    !reducedMotion.matches
  ) {

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach(element => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }

  // STEERING WHEEL CURSOR

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!finePointer.matches || reducedMotion.matches) return;

  const cursor = document.getElementById("custom-cursor");

  if (!cursor) return;

  const wheel = cursor.querySelector(".cursor-wheel");

  if (!wheel) return;

  let mouseX = -100;
  let mouseY = -100;
  let currentX = -100;
  let currentY = -100;
  let rotation = 0;
  let lastMouseX = 0;
  let initialized = false;

  document.addEventListener("pointermove", event => {

    if (event.pointerType !== "mouse") return;

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!initialized) {
      currentX = mouseX;
      currentY = mouseY;
      lastMouseX = mouseX;
      initialized = true;
    }

    cursor.classList.add("visible");

    const movementX = mouseX - lastMouseX;
    const movementY = mouseY - (window.lastCursorY ?? mouseY);

    const movement = Math.hypot(movementX, movementY);

    if (movement > 0) {
      const direction = movementX >= 0 ? 1 : -1;
      rotation += direction * Math.min(movement * .9, 25);
    }

    lastMouseX = mouseX;
    window.lastCursorY = mouseY;

    const interactive = event.target instanceof Element
      ? event.target.closest(
          "a, button, input, textarea, select, .project, .skill-card"
        )
      : null;

    cursor.classList.toggle(
      "is-hovering",
      Boolean(interactive)
    );

  }, { passive: true });

  function animateCursor() {

    if (initialized) {

      currentX += (mouseX - currentX) * .22;
      currentY += (mouseY - currentY) * .22;

      cursor.style.transform =
        `translate3d(${currentX - 26}px, ${currentY - 26}px, 0)`;

      wheel.style.transform =
        `rotate(${rotation}deg)`;
    }

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse") {
      cursor.classList.add("is-clicking");
    }
  });

  document.addEventListener("pointerup", () => {
    cursor.classList.remove("is-clicking");
  });

  document.addEventListener("pointercancel", () => {
    cursor.classList.remove("is-clicking");
  });

  document.addEventListener("mouseout", event => {

    if (!event.relatedTarget) {
      cursor.classList.remove("visible");
      cursor.classList.remove("is-clicking");
      initialized = false;
    }

  });

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
      cursor.classList.remove("visible");
      cursor.classList.remove("is-clicking");
      initialized = false;
    }

  });

});
