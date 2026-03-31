// Simplified JavaScript for Vibe Tracker
(function () {
  "use strict";

  // DOM Elements
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const sideNav = document.querySelector(".side-nav");
  const overlay = document.querySelector(".overlay");
  const tabs = document.querySelectorAll(".tab");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const actionButtons = document.querySelectorAll(".action-btn");
  const resetButtons = document.querySelectorAll(".reset-btn");
  const vibeDots = document.querySelectorAll(".vibe-dot");
  const mapContainers = document.querySelectorAll(".map-container");
  const highlightCanvases = document.querySelectorAll(".highlight-canvas");

  const vibeData = {
    places: [
      { name: "Central Park Cafe",     type: "Coffee Shop",  address: "123 Park Avenue",      vibeScore: "4.2/5", lastReported: "2 hours ago" },
      { name: "River View Restaurant", type: "Restaurant",   address: "456 Riverside Drive",  vibeScore: "4.5/5", lastReported: "1 day ago" },
      { name: "Downtown Art Gallery",  type: "Gallery",      address: "789 Arts District",    vibeScore: "4.7/5", lastReported: "3 hours ago" },
      { name: "Sunset Beach Bar",      type: "Bar",          address: "321 Beachfront Way",   vibeScore: "4.8/5", lastReported: "30 minutes ago" },
      { name: "Mountain View Lookout", type: "Scenic Spot",  address: "555 Hilltop Road",     vibeScore: "4.3/5", lastReported: "1 hour ago" },
    ],
    plans: [
      { name: "Jazz Night at Blue Moon", type: "Live Music Event", address: "234 Music Row",       date: "Tonight 8PM",   attendees: 45 },
      { name: "Food Truck Festival",     type: "Food Event",       address: "Central Square",       date: "Tomorrow 12PM", attendees: 150 },
      { name: "Yoga in the Park",        type: "Wellness Event",   address: "Greenfield Park",      date: "Sunday 9AM",    attendees: 28 },
      { name: "Rooftop Movie Night",     type: "Cinema Event",     address: "Sky Terrace Building", date: "Friday 7PM",    attendees: 72 },
    ],
  };

  // Initialize app
  function init() {
    setupEventListeners();
    updateActiveNavLink();
    setupMapInteractions();
    setupVibeDotInteractions();
  }

  // Setup all event listeners
  function setupEventListeners() {
    // Hamburger menu toggle
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener("click", toggleSideNav);
    }

    // Overlay click to close menu
    if (overlay) {
      overlay.addEventListener("click", closeSideNav);
    }

    // Tab switching
    tabs.forEach((tab) => {
      tab.addEventListener("click", handleTabClick);
    });

    // Action button interactions
    actionButtons.forEach((button) => {
      button.addEventListener("click", handleActionButtonClick);
    });

    // Escape key to close menu
    document.addEventListener("keydown", handleGlobalKeydown);

    // Window resize handling
    window.addEventListener("resize", handleResize);
  }

  // Toggle side navigation
  function toggleSideNav() {
    const isActive = sideNav.classList.contains("active");

    if (isActive) {
      closeSideNav();
    } else {
      openSideNav();
    }
  }

  // Open side navigation
  function openSideNav() {
    sideNav.classList.add("active");
    overlay.classList.add("active");
    hamburgerMenu.classList.add("active");
    hamburgerMenu.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  // Close side navigation
  function closeSideNav() {
    sideNav.classList.remove("active");
    overlay.classList.remove("active");
    hamburgerMenu.classList.remove("active");
    hamburgerMenu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    hamburgerMenu.focus();
  }

  // Handle tab clicks
  function handleTabClick(e) {
    const clickedTab = e.target;
    const targetPanel = clickedTab.getAttribute("aria-controls");

    // Remove active class from all tabs and panels
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    tabPanels.forEach((panel) => {
      panel.classList.remove("active");
    });

    // Add active class to clicked tab and corresponding panel
    clickedTab.classList.add("active");
    clickedTab.setAttribute("aria-selected", "true");

    const targetPanelElement = document.getElementById(targetPanel);
    if (targetPanelElement) {
      targetPanelElement.classList.add("active");
    }

    // Resize canvases after tab switch
    setTimeout(() => {
      mapContainers.forEach((container, index) => {
        const canvas = highlightCanvases[index];
        if (canvas && container.offsetParent !== null) {
          resizeCanvas(container, canvas);
        }
      });
    }, 100);
  }

  // Handle action button clicks
  function handleActionButtonClick(e) {
    const button = e.currentTarget;
    const action = button.getAttribute("data-action");
    actionButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    handleAction(action);
  }

  function handleAction(action) {
    switch (action) {
      case "add":
        if (!window.location.pathname.includes("add-vibe.html")) {
          window.location.href = "add-vibe.html";
        }
        break;
      case "save":
        saveVibeEntry();
        break;
      case "cancel":
        window.history.length > 1 ? window.history.back() : (window.location.href = "index.html");
        break;
    }
  }

  // Save vibe entry
  function saveVibeEntry() {
    const form = document.querySelector(".vibe-form");
    if (!form) return;

    const formData = new FormData(form);
    const vibeData = {
      place: formData.get("place"),
      rating: formData.get("rating"),
      note: formData.get("note"),
    };

    showNotification("Vibe saved successfully!");

    // Navigate back to home after saving
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }

  // Update active navigation link
  function updateActiveNavLink() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");

      const linkHref = link.getAttribute("href");
      if (
        linkHref === currentPage ||
        (currentPage === "" && linkHref === "index.html")
      ) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  // Handle global keydown events
  function handleGlobalKeydown(e) {
    // Close menu with Escape key
    if (e.key === "Escape" && sideNav.classList.contains("active")) {
      closeSideNav();
    }
  }

  // Handle window resize
  function handleResize() {
    // Resize canvases on window resize
    mapContainers.forEach((container, index) => {
      const canvas = highlightCanvases[index];
      if (canvas && container.offsetParent !== null) {
        resizeCanvas(container, canvas);
      }
    });
  }

  function showNotification(message) {
    const n = document.createElement("div");
    n.className = "notification";
    n.textContent = message;
    n.setAttribute("role", "alert");
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = "1"; }, 10);
    setTimeout(() => {
      n.style.opacity = "0";
      setTimeout(() => n.parentNode && n.parentNode.removeChild(n), 300);
    }, 2500);
  }

  // Global resize function for canvases
  function resizeCanvas(container, canvas) {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  // Setup map interactions
  function setupMapInteractions() {
    mapContainers.forEach((container, index) => {
      const canvas = highlightCanvases[index];
      const resetBtn = resetButtons[index];
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
      let fadeTimeout = null;
      let fadeInterval = null;

      resizeCanvas(container, canvas);

      // Create rainbow gradient
      function createRainbowGradient(x1, y1, x2, y2) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "#ff0000");
        gradient.addColorStop(0.17, "#ff7f00");
        gradient.addColorStop(0.33, "#ffff00");
        gradient.addColorStop(0.5, "#00ff00");
        gradient.addColorStop(0.67, "#0000ff");
        gradient.addColorStop(0.83, "#4b0082");
        gradient.addColorStop(1, "#9400d3");
        return gradient;
      }

      function clearFade() {
        if (fadeTimeout)  { clearTimeout(fadeTimeout);   fadeTimeout = null; }
        if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
      }

      function startFadeOut() {
        clearFade();
        fadeTimeout = setTimeout(() => {
          let opacity = 0.5;
          fadeInterval = setInterval(() => {
            opacity -= 0.025;
            if (opacity <= 0) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              clearInterval(fadeInterval);
              fadeInterval = null;
              canvas.style.opacity = "1";
            } else {
              canvas.style.opacity = opacity;
            }
          }, 200);
        }, 10000);
      }

      // Get mouse/touch position relative to canvas
      function getEventPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX =
          e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY =
          e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      }

      function startDrawing(e) {
        isDrawing = true;
        clearFade();
        const pos = getEventPos(e);
        lastX = pos.x;
        lastY = pos.y;
        canvas.style.opacity = "0.5";
        e.preventDefault();
      }

      // Draw rainbow line
      function draw(e) {
        if (!isDrawing) return;

        const pos = getEventPos(e);

        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Create rainbow gradient for this stroke
        const gradient = createRainbowGradient(lastX, lastY, pos.x, pos.y);
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;

        e.preventDefault();
      }

      // Stop drawing
      function stopDrawing() {
        if (isDrawing) {
          isDrawing = false;
          startFadeOut(); // Start fade out timer
        }
      }

      // Mouse events
      container.addEventListener("mousedown", startDrawing);
      container.addEventListener("mousemove", draw);
      container.addEventListener("mouseup", stopDrawing);
      container.addEventListener("mouseout", stopDrawing);

      // Touch events
      container.addEventListener("touchstart", startDrawing);
      container.addEventListener("touchmove", draw);
      container.addEventListener("touchend", stopDrawing);

      function clearCanvas() {
        clearFade();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = "1";
        showNotification("Map highlights cleared!");
      }

      if (resetBtn) resetBtn.addEventListener("click", clearCanvas);
      container.addEventListener("dblclick", clearCanvas);
    });
  }

  function setupVibeDotInteractions() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("vibe-dot")) {
        e.preventDefault();
        handleVibeDotClick(e.target, e);
      } else if (!e.target.closest(".info-box")) {
        closeAllInfoBoxes();
      }
    });
  }

  // Handle vibe dot clicks
  function handleVibeDotClick(dot, event) {
    event.stopPropagation();

    // Close any existing info boxes
    closeAllInfoBoxes();

    // Get the tab panel to determine if it's places or plans
    const tabPanel = dot.closest(".tab-panel");
    const isPlacesTab = tabPanel && tabPanel.id === "places-panel";
    const dataKey = isPlacesTab ? "places" : "plans";

    // Get the index of this dot within its container
    const container = dot.closest(".vibe-indicators");
    const dots = container.querySelectorAll(".vibe-dot");
    const dotIndex = Array.from(dots).indexOf(dot);

    // Get the data for this vibe dot
    const data = vibeData[dataKey][dotIndex];

    if (!data) {
      return;
    }

    // Create and show info box
    createInfoBox(dot, data, isPlacesTab);
  }

  let openInfoBox = null;

  function makeEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function createInfoBox(dot, data, isPlacesTab) {
    const fields = isPlacesTab
      ? [
          { label: "Type",         value: data.type },
          { label: "Address",      value: data.address },
          { label: "Vibe Score",   value: data.vibeScore },
          { label: "Last Updated", value: data.lastReported },
        ]
      : [
          { label: "Event Type",         value: data.type },
          { label: "Location",           value: data.address },
          { label: "When",               value: data.date },
          { label: "Expected Attendees", value: data.attendees + " people" },
        ];

    const infoBox = makeEl("div", "info-box");

    const header = makeEl("div", "info-box-header");
    header.appendChild(makeEl("h3", "info-box-title", data.name));
    const closeBtn = makeEl("button", "info-box-close", "×");
    closeBtn.setAttribute("aria-label", "Close");
    header.appendChild(closeBtn);
    infoBox.appendChild(header);

    const content = makeEl("div", "info-box-content");
    fields.forEach(f => {
      const section = makeEl("div", "info-box-section");
      section.appendChild(makeEl("div", "info-box-label", f.label));
      section.appendChild(makeEl("div", null, f.value));
      content.appendChild(section);
    });
    infoBox.appendChild(content);

    const mapContainer = dot.closest(".map-container");
    const rect = mapContainer.getBoundingClientRect();
    infoBox.style.left = rect.width / 2 - 150 + "px";
    infoBox.style.top = rect.height / 2 - 100 + "px";

    openInfoBox = infoBox;
    mapContainer.appendChild(infoBox);
    setTimeout(() => infoBox.classList.add("active"), 10);
    closeBtn.addEventListener("click", () => closeInfoBox(infoBox));
  }

  function closeInfoBox(infoBox) {
    if (openInfoBox === infoBox) openInfoBox = null;
    infoBox.classList.remove("active");
    setTimeout(() => infoBox.parentNode && infoBox.parentNode.removeChild(infoBox), 300);
  }

  function closeAllInfoBoxes() {
    if (openInfoBox) closeInfoBox(openInfoBox);
  }

  // Initialize app when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
