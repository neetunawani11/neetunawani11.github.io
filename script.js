
"use strict";

/* =====================================
   NEETU'S LITTLE UNIVERSE
   PORTFOLIO INTERACTIONS
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* CURRENT YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* MOBILE NAVIGATION */

  const mobileToggle = document.getElementById("mobileToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileMenu() {
    if (!mobileToggle || !mobileNav) return;

    mobileNav.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-label", "Open navigation");
    mobileToggle.textContent = "☰";
  }

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");

      mobileToggle.setAttribute("aria-expanded", String(isOpen));
      mobileToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      mobileToggle.textContent = isOpen ? "✕" : "☰";
    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  /* SCROLL PROGRESS */

  const scrollProgress = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    if (!scrollProgress) return;

    const pageHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress = pageHeight > 0
      ? (window.scrollY / pageHeight) * 100
      : 0;

    scrollProgress.style.width =
      `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  updateScrollProgress();

  /* REVEAL ON SCROLL */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const revealElements = document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    !reducedMotion.matches
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  /* INTERACTIVE COMPASS */

  const compass = document.querySelector(".compass");
  const compassNeedle = document.getElementById("compassNeedle");

  if (compass && compassNeedle && !reducedMotion.matches) {
    const targets = compass.querySelectorAll(".compass-target");

    const angles = {
      "target-top": 0,
      "target-right": 90,
      "target-bottom": 180,
      "target-left": -90
    };

    targets.forEach(target => {
      target.addEventListener("mouseenter", () => {
        for (const className in angles) {
          if (target.classList.contains(className)) {
            compassNeedle.style.transform =
              `rotate(${angles[className]}deg)`;
            break;
          }
        }
      });
    });

    compass.addEventListener("mouseleave", () => {
      compassNeedle.style.transform = "rotate(-30deg)";
    });
  }

  /* MINI TERMINAL */

  const terminalOutput = document.getElementById("terminalOutput");

  const terminalCommands = {
    whoami: [
      "Name: Neetu Nawani",
      "Role: Python & Backend Developer",
      "Mission: Keep learning. Keep building."
    ],
    skills: [
      "Loading skills...",
      "Python | SQL | FastAPI | Git",
      "RAG | Ollama | Testing",
      "Status: Always improving."
    ],
    motivation: [
      "Here's a thought:",
      "Every developer was once a beginner.",
      "Small progress is still progress."
    ]
  };

  const commandButtons = document.querySelectorAll(".command-button");

  commandButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (!terminalOutput) return;

      const command = button.dataset.command;
      const lines = terminalCommands[command];

      if (!lines) return;

      terminalOutput.replaceChildren();

      const commandLine = document.createElement("p");
      commandLine.textContent = `$ ${command}`;
      terminalOutput.appendChild(commandLine);

      lines.forEach(line => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        terminalOutput.appendChild(paragraph);
      });
    });
  });

  /* FORTUNE GENERATOR */

  const fortuneButton = document.getElementById("fortuneButton");
  const fortuneText = document.getElementById("fortuneText");

  const fortunes = [
    "The bug is temporary. The learning stays.",
    "Your next big idea might start with a tiny script.",
    "Build something small. Make it better tomorrow.",
    "It's not magic. It's debugging and a little patience.",
    "The best way to learn how things work? Build one.",
    "A failed test is useful information in disguise.",
    "Stay curious. That is your best developer tool.",
    "Every good project starts with an interesting question."
  ];

  let previousFortune = -1;

  if (fortuneButton && fortuneText) {
    fortuneButton.addEventListener("click", () => {
      let index;

      do {
        index = Math.floor(Math.random() * fortunes.length);
      } while (
        fortunes.length > 1 &&
        index === previousFortune
      );

      previousFortune = index;
      fortuneText.textContent = fortunes[index];
    });
  }

  /* CUSTOM STEERING WHEEL CURSOR */

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const cursor = document.getElementById("custom-cursor");

  if (
    !cursor ||
    !finePointer.matches ||
    reducedMotion.matches
  ) {
    return;
  }

  const wheel = cursor.querySelector(".cursor-wheel");

  if (!wheel) return;

  document.documentElement.classList.add(
    "custom-cursor-enabled"
  );

  let targetX = -100;
  let targetY = -100;

  let currentX = -100;
  let currentY = -100;

  let previousX = null;
  let previousY = null;

  let rotation = 0;
  let initialized = false;
  let animationFrameId = null;

  function handlePointerMove(event) {
    if (event.pointerType !== "mouse") return;

    targetX = event.clientX;
    targetY = event.clientY;

    if (!initialized) {
      currentX = targetX;
      currentY = targetY;
      previousX = targetX;
      previousY = targetY;
      initialized = true;
    }

    cursor.classList.add("visible");

    const dx = targetX - previousX;
    const dy = targetY - previousY;

    const movement = Math.hypot(dx, dy);

    if (movement > 0) {
      const direction = dx >= 0 ? 1 : -1;

      rotation += direction * Math.min(movement * 0.8, 20);
    }

    previousX = targetX;
    previousY = targetY;

    const interactive = event.target instanceof Element
      ? event.target.closest(
          "a, button, input, textarea, select, .project-card, .compass-target"
        )
      : null;

    cursor.classList.toggle(
      "is-hovering",
      Boolean(interactive)
    );
  }

  document.addEventListener(
    "pointermove",
    handlePointerMove,
    { passive: true }
  );

  function animateCursor() {
    if (initialized) {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;

      cursor.style.transform =
        `translate3d(${currentX - 23}px, ${currentY - 23}px, 0)`;

      wheel.style.transform = `rotate(${rotation}deg)`;
    }

    animationFrameId = requestAnimationFrame(animateCursor);
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
      cursor.classList.remove("is-hovering");
      cursor.classList.remove("is-clicking");
      initialized = false;
      previousX = null;
      previousY = null;
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cursor.classList.remove("visible");
      cursor.classList.remove("is-clicking");
      initialized = false;
      previousX = null;
      previousY = null;
    }
  });

  window.addEventListener("pagehide", () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  });
});
