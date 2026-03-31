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

  // Vibe data for info boxes
  const vibeData = {
    places: {
      0: {
        name: "Central Park Cafe",
        type: "Coffee Shop",
        address: "123 Park Avenue",
        vibeScore: "4.2/5",
        lastReported: "2 hours ago",
      },
      1: {
        name: "River View Restaurant",
        type: "Restaurant",
        address: "456 Riverside Drive",
        vibeScore: "4.5/5",
        lastReported: "1 day ago",
      },
      2: {
        name: "Downtown Art Gallery",
        type: "Gallery",
        address: "789 Arts District",
        vibeScore: "4.7/5",
        lastReported: "3 hours ago",
      },
      3: {
        name: "Sunset Beach Bar",
        type: "Bar",
        address: "321 Beachfront Way",
        vibeScore: "4.8/5",
        lastReported: "30 minutes ago",
      },
      4: {
        name: "Mountain View Lookout",
        type: "Scenic Spot",
        address: "555 Hilltop Road",
        vibeScore: "4.3/5",
        lastReported: "1 hour ago",
      },
    },
    plans: {
      0: {
        name: "Jazz Night at Blue Moon",
        type: "Live Music Event",
        address: "234 Music Row",
        date: "Tonight 8PM",
        attendees: 45,
      },
      1: {
        name: "Food Truck Festival",
        type: "Food Event",
        address: "Central Square",
        date: "Tomorrow 12PM",
        attendees: 150,
      },
      2: {
        name: "Yoga in the Park",
        type: "Wellness Event",
        address: "Greenfield Park",
        date: "Sunday 9AM",
        attendees: 28,
      },
      3: {
        name: "Rooftop Movie Night",
        type: "Cinema Event",
        address: "Sky Terrace Building",
        date: "Friday 7PM",
        attendees: 72,
      },
    },
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

    // Remove selected state from other buttons
    actionButtons.forEach((btn) => btn.classList.remove("selected"));

    // Add selected state to clicked button
    button.classList.add("selected");

    // Handle specific actions
    handleAction(action, button);
  }

  // Handle specific actions
  function handleAction(action, button) {
    switch (action) {
      case "add":
        // Navigate to add vibe page if not already there
        if (!window.location.pathname.includes("add-vibe.html")) {
          window.location.href = "add-vibe.html";
        }
        break;
      case "search":
        console.log("Search action triggered");
        break;
      case "down":
        console.log("Down action triggered");
        break;
      case "save":
        // Save vibe entry
        saveVibeEntry();
        break;
      case "cancel":
        // Navigate back or reset form
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "index.html";
        }
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
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

    // Simulate saving (would be API call in production)
    console.log("Saving vibe:", vibeData);
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

  // Show notification
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.setAttribute("role", "alert");

    // Style notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#000",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      zIndex: "10000",
      fontSize: "14px",
      textAlign: "center",
      opacity: "0",
      transition: "opacity 0.3s ease",
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
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

      // Resize canvas to match container
      function resizeCanvasLocal() {
        resizeCanvas(container, canvas);
      }

      resizeCanvasLocal();
      window.addEventListener("resize", resizeCanvasLocal);

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

      // Start fade out effect
      function startFadeOut() {
        // Clear any existing fade timeout
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
        }

        fadeTimeout = setTimeout(() => {
          let opacity = 0.5; // Start from current opacity
          const fadeInterval = setInterval(() => {
            opacity -= 0.025; // Gradual fade
            if (opacity <= 0) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              clearInterval(fadeInterval);
            } else {
              canvas.style.opacity = opacity;
            }
          }, 200); // Fade step every 200ms for smooth transition
        }, 10000); // Start fading after 10 seconds
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

      // Start drawing
      function startDrawing(e) {
        isDrawing = true;
        const pos = getEventPos(e);
        lastX = pos.x;
        lastY = pos.y;

        // Reset canvas opacity when starting new drawing
        canvas.style.opacity = 0.5;

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

      // Reset button functionality
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.opacity = 1;
          showNotification("Map highlights cleared!");
        });
      }

      // Clear canvas on double click/tap
      container.addEventListener("dblclick", () => {
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
          fadeTimeout = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = 1;
        showNotification("Map highlights cleared!");
      });
    });
  }

  // Setup vibe dot interactions
  function setupVibeDotInteractions() {
    // Handle both click and touch events
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("vibe-dot")) {
        e.preventDefault();
        handleVibeDotClick(e.target, e);
      } else if (!e.target.closest(".info-box")) {
        closeAllInfoBoxes();
      }
    });

    // Add touch events for mobile
    document.addEventListener("touchend", (e) => {
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

  // Create info box
  function createInfoBox(dot, data, isPlacesTab) {
    const infoBox = document.createElement("div");
    infoBox.className = "info-box";

    // Center the info box in the map container
    const mapContainer = dot.closest(".map-container");
    const containerRect = mapContainer.getBoundingClientRect();

    // Position in center of map container
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Info box is 300px wide, so offset by half
    infoBox.style.left = centerX - 150 + "px";
    infoBox.style.top = centerY - 100 + "px";

    // Create content based on tab type
    if (isPlacesTab) {
      infoBox.innerHTML = createPlacesContent(data);
    } else {
      infoBox.innerHTML = createPlansContent(data);
    }

    // Add to container
    mapContainer.appendChild(infoBox);

    // Show with animation
    setTimeout(() => {
      infoBox.classList.add("active");
    }, 10);

    // Add close button functionality
    const closeBtn = infoBox.querySelector(".info-box-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeInfoBox(infoBox);
      });
      closeBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        closeInfoBox(infoBox);
      });
    }
  }

  // Create places content
  function createPlacesContent(data) {
    return `
            <div class="info-box-header">
                <h3 class="info-box-title">${data.name}</h3>
                <button class="info-box-close" aria-label="Close">×</button>
            </div>
            <div class="info-box-content">
                <div class="info-box-section">
                    <div class="info-box-label">Type</div>
                    <div>${data.type}</div>
                </div>
                <div class="info-box-section">
                    <div class="info-box-label">Address</div>
                    <div>${data.address}</div>
                </div>
                <div class="info-box-section">
                    <div class="info-box-label">Vibe Score</div>
                    <div>${data.vibeScore}</div>
                </div>
                <div class="info-box-section">
                    <div class="info-box-label">Last Updated</div>
                    <div>${data.lastReported}</div>
                </div>
            </div>
        `;
  }

  // Create plans content
  function createPlansContent(data) {
    return `
            <div class="info-box-header">
                <h3 class="info-box-title">${data.name}</h3>
                <button class="info-box-close" aria-label="Close">×</button>
            </div>
            <div class="info-box-content">
                <div class="info-box-section">
                    <div class="info-box-label">Event Type</div>
                    <div>${data.type}</div>
                </div>
                <div class="info-box-section">
                    <div class="info-box-label">Location</div>
                    <div>${data.address}</div>
                </div>
                <div class="info-box-section">
                    <div class="info-box-label">When</div>
                    <div>${data.date}</div>
                </div>
                <div class="info-box-section">
                    <div class="info-box-label">Expected Attendees</div>
                    <div>${data.attendees} people</div>
                </div>
            </div>
        `;
  }

  // Close info box with animation
  function closeInfoBox(infoBox) {
    infoBox.classList.remove("active");
    setTimeout(() => {
      if (infoBox.parentNode) {
        infoBox.parentNode.removeChild(infoBox);
      }
    }, 300);
  }

  // Close all info boxes
  function closeAllInfoBoxes() {
    const infoBoxes = document.querySelectorAll(".info-box");
    infoBoxes.forEach((box) => closeInfoBox(box));
  }

  // Initialize app when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
