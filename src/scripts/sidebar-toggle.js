let desktopToggleIcon = document.getElementById("desktop-toggle-icon");
let mobileToggleIcon = document.getElementById("mobile-toggle-icon");
const desktopSidebar = document.getElementById("desktop-navbar");
const mobileSidebar = document.getElementById("mobile-navbar");
const modalOverlayHide = document.getElementById("modal-overlay-hide");

// Toggle for desktop sidebar
function toggleSidebarDesktop() {
  if (window.innerWidth > 768) {
    desktopSidebar.classList.toggle("collapsed");

    // Store collapsed state
    const collapsed = desktopSidebar.classList.contains("collapsed");
    sessionStorage.setItem("sidebarCollapsed", collapsed);
  } else {
    desktopSidebar.classList.toggle("active");
    modalOverlayHide.classList.remove("active");
  }
}

// Toggle for mobile sidebar
function toggleSidebarMobile() {
  desktopSidebar.classList.toggle("active");
  modalOverlayHide.classList.add("active");
}

function adjustSidebarOnResize() {
  if (window.innerWidth > 768) {
    desktopSidebar.classList.remove("active");
    modalOverlayHide.classList.remove("active");

    // Restore 'collapsed' state
    const collapsed = sessionStorage.getItem("sidebarCollapsed") === "true";
    if (collapsed) {
      desktopSidebar.classList.add("collapsed");
    } else {
      desktopSidebar.classList.remove("collapsed");
    }

    desktopSidebar.classList.remove("resizing");
  } else {
    desktopSidebar.classList.add("resizing");

    desktopSidebar.classList.remove("collapsed");

    setTimeout(() => {
      desktopSidebar.classList.remove("resizing");
    }, 100);
  }
}

// Event listeners
if (desktopToggleIcon) {
  desktopToggleIcon.addEventListener("click", toggleSidebarDesktop);
}

if (mobileToggleIcon) {
  mobileToggleIcon.addEventListener("click", toggleSidebarMobile);
}

// Adjust sidebar on page load and window resize
adjustSidebarOnResize();
window.addEventListener("resize", adjustSidebarOnResize);
