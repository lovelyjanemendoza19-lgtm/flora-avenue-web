
function setupMobileAdminNavigation(shell, sidebar, header, buttonId) {
  if (!shell || !sidebar || !header) return;

  let menuButton = document.getElementById(buttonId);
  if (!menuButton) {
    menuButton = document.createElement("button");
    menuButton.id = buttonId;
    menuButton.className = buttonId === "adminProMobileMenu"
      ? "pro-mobile-menu"
      : "fx-mobile-menu";
    menuButton.type = "button";
    menuButton.textContent = "☰";
    menuButton.setAttribute("aria-label", "Open admin navigation");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-controls", sidebar.id);
    header.insertBefore(menuButton, header.firstChild);
  }
  sidebar.id = sidebar.id || `${buttonId}-sidebar`;
  menuButton.setAttribute("aria-controls", sidebar.id);

  let overlay = shell.querySelector(".fx-mobile-overlay");
  if (!overlay) {
    overlay = document.createElement("button");
    overlay.className = "fx-mobile-overlay";
    overlay.type = "button";
    overlay.setAttribute("aria-label", "Close admin navigation");
    overlay.setAttribute("aria-hidden", "true");
    shell.appendChild(overlay);
  }

  const closeMenu = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open admin navigation");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("admin-menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    overlay.classList.toggle("show", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close admin navigation" : "Open admin navigation");
    overlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("admin-menu-open", isOpen);
  });
  overlay.addEventListener("click", closeMenu);
  sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

function setupAdminLogoutConfirmation() {
  const logoutButtons = document.querySelectorAll("#logoutButton, #fxLogoutButton");
  if (!logoutButtons.length) return;

  let modal = document.getElementById("logoutModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "logoutModal";
    modal.className = "admin-modal";
    modal.setAttribute("aria-hidden", "true");
    document.body.appendChild(modal);
  }
  modal.classList.add("admin-logout-modal");
  modal.setAttribute("role", "presentation");
  modal.innerHTML = `
    <section class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="adminLogoutTitle" aria-describedby="adminLogoutDescription">
      <span class="admin-modal-icon" aria-hidden="true">↪</span>
      <h2 id="adminLogoutTitle">Log out?</h2>
      <p id="adminLogoutDescription">Are you sure you want to log out?</p>
      <div class="admin-modal-actions">
        <button class="admin-btn secondary" id="adminLogoutCancel" type="button">Cancel</button>
        <button class="admin-btn" id="adminLogoutConfirm" type="button">Log Out</button>
      </div>
    </section>`;

  const cancelButton = modal.querySelector("#adminLogoutCancel");
  const confirmButton = modal.querySelector("#adminLogoutConfirm");
  let previousFocus = null;

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    previousFocus?.focus();
  }

  function openModal(event) {
    event.preventDefault();
    previousFocus = event.currentTarget;
    event.currentTarget.closest(".admin-sidebar-fx, .pro-sidebar")
      ?.classList.remove("open");
    document.querySelector(".fx-mobile-overlay, .admin-overlay")?.classList.remove("show");
    document.body.classList.remove("admin-menu-open");
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    cancelButton.focus();
  }

  logoutButtons.forEach(button => button.addEventListener("click", openModal));
  cancelButton.addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  confirmButton.addEventListener("click", () => {
    sessionStorage.removeItem("floraAdminLoggedIn");
    window.location.href = "login.html";
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
}

function buildAdminSidebar() {
  if (!document.body.classList.contains("admin-app")) return;
  const shell = document.querySelector(".admin-shell");
  if (!shell) return;
  const current = (window.location.pathname.split("/").pop() || "admin.html").toLowerCase();
  const links = [
    ["dashboard.html", "home-icon.png", "Dashboard", ["dashboard.html"]],
    ["products.html", "product-icon.png", "Products", ["products.html", "add-product.html"]],
    ["inquiries.html", "inquiry-icon.png", "Inquiries", ["inquiries.html", "inquiry-details.html"]],
    ["orders.html", "order-icon.png", "Orders", ["orders.html", "order-details.html"]],
    ["profile.html", "profile-icon.png", "Profile", ["profile.html"]]
  ];

  const sidebar = shell.querySelector(".admin-sidebar-fx") || document.createElement("aside");
  sidebar.className = "admin-sidebar-fx";
  sidebar.innerHTML = `
    <div class="pro-side-brand">
      <img src="../../public/images/logo.png" alt="Flora Avenue">
      <div><strong>Flora Avenue</strong><small>Admin Portal</small></div>
    </div>
    <nav class="pro-nav" aria-label="Admin navigation">
      ${links.map(([href, icon, label, activePaths]) => `
        <a href="${href}" class="${activePaths.includes(current) ? "active" : ""}">
          <img src="../../public/images/${icon}" alt=""><span>${label}</span>
        </a>`).join("")}
    </nav>
    <div class="pro-side-bottom">
      <button class="pro-logout" id="fxLogoutButton" type="button"><img src="../../public/images/logout-icon.png" alt=""><span>Log Out</span></button>
    </div>`;
  if (!sidebar.isConnected) shell.prepend(sidebar);

  setupMobileAdminNavigation(
    shell,
    sidebar,
    shell.querySelector(".admin-topbar"),
    "adminMobileMenuButton"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  buildAdminSidebar();
  setupAdminLogoutConfirmation();
  const dashboardShell = document.querySelector(".pro-dash-shell");
  if (dashboardShell) {
    setupMobileAdminNavigation(
      dashboardShell,
      dashboardShell.querySelector(".pro-sidebar"),
      dashboardShell.querySelector(".pro-header"),
      "adminProMobileMenu"
    );
  }
  const path = window.location.pathname.toLowerCase();
  const isLogin = path.endsWith("/admin/login.html") || path.endsWith("/admin/login");
  const loggedIn = sessionStorage.getItem("floraAdminLoggedIn") === "true";

  // Keep the admin area private in this frontend demo.
  if (!isLogin && document.body.classList.contains("admin-app") && !loggedIn) {
    window.location.href = "login.html";
    return;
  }

  const login = document.getElementById("adminLoginForm");
  if (login) {
    login.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("adminEmail").value.trim().toLowerCase();
      const password = document.getElementById("adminPassword").value;

      if (email === "admin@floraavenue.com" && password === "admin123") {
        sessionStorage.setItem("floraAdminLoggedIn", "true");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid admin login. Please check your email and password.");
      }
    });
  }

  // Mobile sidebar
  const menuButton = document.getElementById("adminMobileMenu");
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("adminOverlay");

  const closeMenu = () => {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
  };

  menuButton?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
    overlay?.classList.toggle("show");
  });

  overlay?.addEventListener("click", closeMenu);
  sidebar?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  // Profile edit
  const form = document.getElementById("adminProfileForm");
  if (form) {
    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const saveButton = form.querySelector('button[type="submit"]');
    let editButton = document.getElementById("editProfileButton");
    let isEditing = false;

    if (!editButton) {
      editButton = document.createElement("button");
      editButton.id = "editProfileButton";
      editButton.className = "figma-btn secondary admin-profile-edit-button";
      editButton.type = "button";
      editButton.textContent = "Edit Profile";
      form.after(editButton);
    }

    try {
      const savedProfile = JSON.parse(localStorage.getItem("floraAdminProfile") || "null");
      if (savedProfile && typeof savedProfile === "object") {
        if (typeof savedProfile.name === "string" && savedProfile.name.trim() && nameInput) {
          nameInput.value = savedProfile.name;
        }
        if (typeof savedProfile.email === "string" && savedProfile.email.trim() && emailInput) {
          emailInput.value = savedProfile.email;
        }
      }
    } catch (error) {
      console.warn("Unable to load the admin profile.", error);
    }

    let originalName = nameInput?.value.trim() || "";
    let originalEmail = emailInput?.value.trim() || "";
    const displayName = document.getElementById("profileDisplayName");
    if (displayName) displayName.textContent = originalName;
    form.style.display = "grid";
    if (nameInput) nameInput.disabled = true;
    if (emailInput) emailInput.disabled = true;
    if (saveButton) saveButton.style.display = "none";

    const updateSaveButton = () => {
      if (!saveButton) return;
      const hasChanges = nameInput?.value.trim() !== originalName
        || emailInput?.value.trim() !== originalEmail;
      saveButton.style.display = isEditing && hasChanges ? "" : "none";
    };

    editButton.addEventListener("click", () => {
      if (isEditing) {
        if (nameInput) nameInput.value = originalName;
        if (emailInput) emailInput.value = originalEmail;
        isEditing = false;
        if (nameInput) nameInput.disabled = true;
        if (emailInput) emailInput.disabled = true;
        editButton.textContent = "Edit Profile";
        updateSaveButton();
        return;
      }

      isEditing = true;
      if (nameInput) nameInput.disabled = false;
      if (emailInput) emailInput.disabled = false;
      editButton.textContent = "Cancel";
      nameInput?.focus();
    });
    nameInput?.addEventListener("input", updateSaveButton);
    emailInput?.addEventListener("input", updateSaveButton);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";

      if (!name || !email) return;

      try {
        localStorage.setItem("floraAdminProfile", JSON.stringify({ name, email }));
      } catch (error) {
        console.error("Unable to save the admin profile.", error);
        alert("Unable to save your profile. Please try again.");
        return;
      }

      const displayEmail = document.getElementById("profileDisplayEmail");
      const infoName = document.getElementById("infoName");
      const infoEmail = document.getElementById("infoEmail");

      if (displayName) displayName.textContent = name;
      if (displayEmail) displayEmail.textContent = email;
      if (infoName) infoName.textContent = name;
      if (infoEmail) infoEmail.textContent = email;

      originalName = name;
      originalEmail = email;
      isEditing = false;
      if (nameInput) nameInput.disabled = true;
      if (emailInput) emailInput.disabled = true;
      editButton.textContent = "Edit Profile";
      updateSaveButton();
    });
  }

});
