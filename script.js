/* ============================================
   PORTFOLIO SCRIPT – GSAP + AOS + BI ICONS
   Author: Sri Vimal Raj S
============================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     1. AOS INITIALIZATION
  ============================================ */
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
    delay: 0,
  });

  /* ============================================
     2. GSAP SETUP
  ============================================ */
  gsap.registerPlugin(ScrollTrigger);

  // Hero content entrance stagger (GSAP)
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl.from(".hero-badge", { opacity: 0, y: -20, duration: 0.6, ease: "power2.out" })
        .from(".hero-greeting", { opacity: 0, x: -30, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .from("#user-display-name", { opacity: 0, y: 40, duration: 0.8, ease: "power4.out" }, "-=0.3")
        .from(".hero-title-type", { opacity: 0, x: -30, duration: 0.5, ease: "power2.out" }, "-=0.5")
        .from(".hero-desc", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .from(".hero-cta .btn", { opacity: 0, scale: 0.9, duration: 0.5, ease: "back.out(1.7)", stagger: 0.15 }, "-=0.3")
        .from(".hero-socials .social-link", { opacity: 0, y: 15, duration: 0.5, ease: "power2.out", stagger: 0.1 }, "-=0.3")
        .from(".hero-visual", { opacity: 0, scale: 0.85, duration: 1, ease: "power3.out" }, "-=1")
        .from(".stat-chip", { opacity: 0, x: 30, duration: 0.6, ease: "power2.out", stagger: 0.15 }, "-=0.5");

  // Skill bars – ScrollTrigger
  document.querySelectorAll(".skill-bar-progress").forEach((bar) => {
    const pct = bar.getAttribute("data-percent");
    gsap.to(bar, {
      width: pct + "%",
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: bar,
        start: "top 90%",
        once: true,
      },
    });
  });

  // Project cards stagger on scroll
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        once: true,
      },
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: "power3.out",
      delay: (i % 3) * 0.1,
    });
  });

  // Timeline cards
  gsap.utils.toArray(".timeline-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        once: true,
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: "power3.out",
    });
  });

  /* ============================================
     3. CUSTOM CURSOR
  ============================================ */
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    });

    // Smooth ring follow
    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animRing);
    })();

    // Hover enlarge
    document.querySelectorAll("a, button, .project-card, .filter-btn, .social-link").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
    });
  } else {
    // Hide cursor elements on touch devices
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  /* ============================================
     4. THEME SWITCHER & VANTA BACKGROUND
  ============================================ */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon   = document.getElementById("theme-icon");
  const savedTheme  = localStorage.getItem("theme") || "dark";

  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  let vantaInstance = null;

  function initVanta(theme) {
    if (vantaInstance) {
      vantaInstance.destroy();
    }
    
    const isDark = theme === "dark";
    const bgColor = isDark ? 0x030712 : 0xf8fafc;
    const globeColor = isDark ? 0x142b3e : 0xe2e8f0;
    const color2 = isDark ? 0x22133e : 0xe8e5f8;
    
    if (typeof VANTA !== "undefined" && VANTA.GLOBE) {
      vantaInstance = VANTA.GLOBE({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: globeColor,
        color2: color2,
        size: 0.90,
        backgroundColor: bgColor
      });
    }
  }

  // Initial load
  initVanta(savedTheme);

  themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const nxt = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nxt);
    localStorage.setItem("theme", nxt);
    updateThemeIcon(nxt);
    initVanta(nxt);

    // GSAP flip animation
    gsap.to(themeToggle, {
      rotate: 360, duration: 0.5, ease: "power2.out",
      onComplete: () => gsap.set(themeToggle, { rotate: 0 }),
    });
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
  }

  /* ============================================
     5. MOBILE NAVIGATION
  ============================================ */
  const hamburger = document.getElementById("nav-hamburger");
  const navLinks  = document.getElementById("navigation-menu");

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    const lines  = hamburger.querySelectorAll("span");

    if (isOpen) {
      gsap.to(lines[0], { rotate: 45, y: 7, duration: 0.3, ease: "power2.out" });
      gsap.to(lines[1], { opacity: 0, duration: 0.2 });
      gsap.to(lines[2], { rotate: -45, y: -7, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(lines[1], { opacity: 1, duration: 0.2 });
      gsap.to(lines[2], { rotate: 0, y: 0, duration: 0.3, ease: "power2.out" });
    }
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const lines = hamburger.querySelectorAll("span");
      gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(lines[1], { opacity: 1, duration: 0.2 });
      gsap.to(lines[2], { rotate: 0, y: 0, duration: 0.3, ease: "power2.out" });
    });
  });

  /* ============================================
     6. SCROLL: ACTIVE NAV + HEADER STYLE
  ============================================ */
  const header   = document.getElementById("main-header");
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  const onScroll = () => {
    // Scrolled header style
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Active nav item
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 160) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============================================
     7. TYPED TEXT EFFECT
  ============================================ */
  const typedEl = document.getElementById("typed-text");
  const phrases = [
    "Aspiring Software Developer",
    "Frontend & Backend Developer",
    "Full-Stack Creator",
    "Automation Enthusiast",
    "Problem Solver",
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false, speed = 100;

  function typeEffect() {
    const cur = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = cur.substring(0, charIdx - 1);
      charIdx--;
      speed = 45;
    } else {
      typedEl.textContent = cur.substring(0, charIdx + 1);
      charIdx++;
      speed = 100;
    }

    if (!isDeleting && charIdx === cur.length) {
      isDeleting = true;
      speed = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(typeEffect, speed);
  }

  if (typedEl) setTimeout(typeEffect, 1200);

  /* ============================================
     8. PROJECT FILTER
  ============================================ */
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      // GSAP stagger-in filtered cards
      const visible = [];
      const hidden  = [];

      projectCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          visible.push(card);
        } else {
          hidden.push(card);
        }
      });

      // Hide
      gsap.to(hidden, {
        opacity: 0, scale: 0.92, duration: 0.25, ease: "power2.in",
        onComplete: () => hidden.forEach((c) => (c.style.display = "none")),
      });

      // Show after slight delay
      setTimeout(() => {
        visible.forEach((c) => {
          c.style.display = "flex";
          c.style.opacity = "0";
        });
        gsap.to(visible, {
          opacity: 1, scale: 1, duration: 0.4,
          ease: "power3.out",
          stagger: 0.07,
        });
      }, 200);
    });
  });

  /* ============================================
     9. PROJECT MODAL DATABASE
  ============================================ */
  const projectDetails = {
    sprintora: {
      title: "Sprintora AI Agile Workspace",
      subtitle: "AI-Native Multi-Tenant Agile Platform",
      icon: "bi-robot",
      problem: "Engineering teams struggle to break down high-level requirements into trackable tasks, often spending hours in planning meetings without clear role assignments or time estimates.",
      solution: "Sprintora uses Llama-3.3 (via Groq API) to automatically decompose requirements into structured sprint tasks, estimate hours, map roles, and generate Kanban boards with real-time updates — all within a secure multi-tenant workspace.",
      techs: ["React.js", "Fastify", "PostgreSQL", "Llama-3.3 (Groq)", "JWT Auth"],
      link: "https://github.com/vimalRaj45/vsgrps_agile_frontend",
    },
    certifypro: {
      title: "CertifyPro",
      subtitle: "Credentials & Assessment Center",
      icon: "bi-award-fill",
      problem: "Organizations hosting events or training programs lack an efficient way to issue, track, and verify bulk certificates while simultaneously assessing participant competency.",
      solution: "CertifyPro provides a cloud-based studio for designing and bulk-printing certificates, an interactive quiz engine with real-time scoring, and biometric face-verification using face-api.js to ensure assessment integrity.",
      techs: ["React.js", "Node.js", "PostgreSQL", "pdf-lib", "face-api.js"],
      link: "https://github.com/vimalRaj45/certify_front",
    },
    cryptosign: {
      title: "CryptoSign Identity Engine",
      subtitle: "RSA-PSS Signature Signing & Validation",
      icon: "bi-pen-fill",
      problem: "Digital documents are often shared without any cryptographic proof of authenticity, making them vulnerable to tampering and impersonation attacks.",
      solution: "CryptoSign generates RSA-2048 key pairs in-browser, performs digital signing using WebCrypto's SHA-256 with RSA-PSS padding, and validates document integrity entirely on the client-side with no server dependency.",
      techs: ["HTML5", "JavaScript", "WebCrypto API", "Bootstrap 5"],
      link: "https://github.com/vimalRaj45/cryptos",
    },
    crm: {
      title: "CRM Ingestion Engine",
      subtitle: "Email Automation & Headless CRM Daemon",
      icon: "bi-envelope-check-fill",
      problem: "Sales teams waste hours manually reading emails, copying lead data, and entering it into CRM systems — a repetitive, error-prone process that slows down the sales pipeline.",
      solution: "This Node.js daemon connects to email servers via IMAPFlow, parses structured lead data using MailParser, then automates CRM data entry using Playwright headless browser scripting — eliminating manual data entry entirely.",
      techs: ["Node.js", "Playwright", "IMAPFlow", "MailParser", "Google APIs"],
      link: "https://github.com/vimalRaj45/crm-finalv1",
    },
    drkankas: {
      title: "Dr. Kanak's Speciality Clinic",
      subtitle: "Patient Portal & Booking Console",
      icon: "bi-heart-pulse-fill",
      problem: "Small clinics rely on phone calls and paper records for appointment management, causing scheduling conflicts, delayed prescriptions, and no digital payment trail.",
      solution: "A full-stack clinic management system with online appointment scheduling, digital prescription management, integrated Razorpay payment checkout, and push notification reminders — all wrapped in a patient-friendly React interface.",
      techs: ["React.js", "Fastify", "PostgreSQL", "Razorpay", "Service Workers"],
      link: "https://github.com/vimalRaj45/drkankasfrontend",
    },
    vschats: {
      title: "VSChats – Real-Time Chat Engine",
      subtitle: "Full-Stack WebSockets Application",
      icon: "bi-chat-dots-fill",
      problem: "Standard HTTP polling-based chat apps suffer from latency and wasted server resources. Users expect instant message delivery across multiple devices simultaneously.",
      solution: "VSChats uses Socket.io WebSockets for sub-50ms message delivery, React.js for a fluid UI with presence indicators and room-based messaging, backed by Express.js and persistent room state management.",
      techs: ["React.js", "Express.js", "Socket.io", "Node.js", "PWA"],
      link: "https://github.com/vimalRaj45/vschats",
    },
    edwyna: {
      title: "EventHub (Edwyna)",
      subtitle: "Event Coordination Platform",
      icon: "bi-calendar-event-fill",
      problem: "Event coordinators lack a centralized platform to manage schedules, communicate announcements, and handle attendee check-ins simultaneously for large-scale events.",
      solution: "A comprehensive event planning web platform featuring interactive schedule mapping, organizer dashboards with real-time announcements, and digital participant check-in workflows built with pure HTML/CSS/JavaScript.",
      techs: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      link: "https://github.com/vimalRaj45/edwyna",
    },
    aadhira: {
      title: "AADHIRA Hackathon Portal",
      subtitle: "Team Registry & Fastify Backend",
      icon: "bi-trophy-fill",
      problem: "Hackathon organizers managing hundreds of teams from multiple colleges need a reliable, fast registration system that prevents duplicate entries and automates communication.",
      solution: "Built on Fastify and Neon serverless PostgreSQL, this portal handles multi-member team registrations, college affiliation validation, duplicate detection, and automated email communication pipelines for all registered teams.",
      techs: ["Node.js", "Fastify", "Neon PostgreSQL", "HTML5", "CSS3"],
      link: "https://github.com/vimalRaj45/aadhirasolutions_hacakthon",
    },
    hybrid_crypto: {
      title: "Hybrid Encryption Hub",
      subtitle: "AES-128-GCM & RSA-2048 Data Transmission",
      icon: "bi-lock-fill",
      problem: "Sharing sensitive files over the internet without end-to-end encryption exposes data to interception. Most tools either use only symmetric (key-sharing risk) or only asymmetric (slow for large data) encryption.",
      solution: "Hybrid Crypto combines AES-128-GCM for fast symmetric payload encryption with RSA-2048 for secure asymmetric key exchange — modeling real-world confidential data transmission using WebCrypto APIs entirely in the browser.",
      techs: ["HTML5", "CSS3", "JavaScript", "WebCrypto API (AES-GCM + RSA-OAEP)"],
      link: "https://github.com/vimalRaj45/Crypto",
    },
    smb: {
      title: "Sri Mayil Builders",
      subtitle: "Construction Cost Estimator & Web Portal",
      icon: "bi-buildings-fill",
      problem: "Construction firms lack visually compelling web presences that can engage potential clients, showcase projects, and provide instant cost estimates without requiring in-person meetings.",
      solution: "A construction firm portal with GSAP ScrollTrigger-powered animations, a residential project showcase, and a Vastu-compliant interactive building cost estimator that computes material and labor costs dynamically.",
      techs: ["React.js", "GSAP", "ScrollTrigger", "TailwindCSS", "tsparticles"],
      link: "https://github.com/vimalRaj45/SMB",
    },
    easanmart: {
      title: "EasanMart Catalog",
      subtitle: "Grocery SPA & Google Sheets Inventory",
      icon: "bi-cart4",
      problem: "Local supermarkets struggle to provide customers with up-to-date product catalogs and stock availability without investing in expensive e-commerce infrastructure.",
      solution: "A lightweight, single-page grocery catalog app that reads live inventory directly from Google Sheets via API, with real-time search-and-filter capabilities and mobile-responsive layouts — zero backend server required.",
      techs: ["HTML5", "CSS3", "JavaScript", "Bootstrap 5", "Google Sheets API"],
      link: "https://github.com/vimalRaj45/easanmart",
    },
    threads26: {
      title: "THREADS '26 Event Portal",
      subtitle: "Ticketing & On-Spot Registration System",
      icon: "bi-ticket-perforated-fill",
      problem: "College symposiums managing hundreds of participants face bottlenecks at registration, ticket issuance, and check-in — leading to long queues and missed entries.",
      solution: "A high-throughput ticketing engine backed by Fastify and Upstash Redis for real-time rate-limiting and visitor tracking. Automatically sends PDF tickets via email and validates attendance via QR-code scanning at the gate.",
      techs: ["Node.js", "Fastify", "PostgreSQL", "Upstash Redis", "PDFKit"],
      link: "https://github.com/vimalRaj45/threads26",
    },
    sona_rd: {
      title: "Sona College R&D Portal",
      subtitle: "Centralized Research Management System",
      icon: "bi-book-fill",
      problem: "College R&D departments rely on email chains and manual spreadsheets to track research publications, project proposals, and fund allocations — creating opacity and inefficiency in the research lifecycle.",
      solution: "A centralized research management portal with Spring Boot REST APIs and React.js frontend. Features role-based access control (Admin/Faculty/Student), publication tracking, seed money document management, and automated SDLC workflow approvals.",
      techs: ["React.js", "Spring Boot", "Java", "MySQL", "REST APIs"],
      link: "https://github.com/naveenraj59/sona-rd-portal-backend",
    },
  };

  /* ============================================
     10. MODAL CONTROL
  ============================================ */
  const modal        = document.getElementById("project-modal");
  const modalClose   = document.querySelector(".modal-close");
  const modalTitle   = document.getElementById("modal-project-title");
  const modalSubtitle = document.getElementById("modal-project-subtitle");
  const modalProblem = document.getElementById("modal-problem");
  const modalSolution = document.getElementById("modal-solution");
  const modalTechs   = document.getElementById("modal-tech-list");
  const modalLink    = document.getElementById("modal-repo-link");
  const modalIcon    = document.getElementById("modal-icon");

  document.querySelectorAll(".view-project-details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.getAttribute("data-project");
      const d   = projectDetails[key];
      if (!d) return;

      modalTitle.textContent   = d.title;
      modalSubtitle.textContent = d.subtitle;
      modalProblem.textContent = d.problem;
      modalSolution.textContent = d.solution;
      modalLink.setAttribute("href", d.link);
      if (modalIcon) modalIcon.innerHTML = `<i class="${d.icon}"></i>`;

      modalTechs.innerHTML = "";
      d.techs.forEach((t) => {
        const tag = document.createElement("span");
        tag.className = "tech-tag";
        tag.textContent = t;
        modalTechs.appendChild(tag);
      });

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ============================================
     11. CONTACT FORM
  ============================================ */
  window.handleFormSubmit = function() {
    const btn = document.querySelector("#contact-form-el button[type='submit']");
    const orig = btn.innerHTML;

    btn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Message Sent!`;
    btn.style.background = "linear-gradient(135deg, #059669 0%, #34d399 100%)";
    btn.disabled = true;

    gsap.from(btn, { scale: 0.95, duration: 0.4, ease: "back.out(2)" });

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = "";
      btn.disabled = false;
      document.getElementById("contact-form-el").reset();
    }, 3500);
  };



});
