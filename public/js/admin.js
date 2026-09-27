
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

function buildAdminSidebar() {
  if (!document.body.classList.contains("admin-app")) return;
  const shell = document.querySelector(".admin-shell");
  if (!shell) return;
  const existingSidebar = shell.querySelector(".admin-sidebar-fx");
  if (existingSidebar) {
    const current = (window.location.pathname.split("/").pop() || "admin.html").toLowerCase();
    existingSidebar.querySelectorAll(".fx-side-nav a").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href")?.toLowerCase() === current);
    });
    const existingLogout = existingSidebar.querySelector("#fxLogoutButton");
    existingLogout?.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out?")) {
        sessionStorage.removeItem("floraAdminLoggedIn");
        window.location.href = "login.html";
      }
    });
    setupMobileAdminNavigation(
      shell,
      existingSidebar,
      shell.querySelector(".admin-topbar"),
      "adminMobileMenuButton"
    );
    return;
  }

  const current = (window.location.pathname.split("/").pop() || "admin.html").toLowerCase();
  const links = [
    ["dashboard.html", "▦", "Dashboard"],
    ["products.html", "▤", "Products"],
    ["inquiries.html", "✉", "Inquiries"],
    ["orders.html", "▣", "Orders"],
    ["profile.html", "♙", "Profile"]
  ];

  const aside = document.createElement("aside");
  aside.className = "admin-sidebar-fx";
  aside.innerHTML = `
    <a class="fx-side-brand" href="dashboard.html">
      <img src="../../public/images/logo.png" alt="Flora Avenue">
      <span><strong>Flora Avenue</strong><small>Admin Portal</small></span>
    </a>
    <div class="fx-side-label">Management</div>
    <nav class="fx-side-nav" aria-label="Admin navigation">
      ${links.map(([href, icon, label]) => `
        <a href="${href}" class="${current === href ? "active" : ""}">
          <span class="fx-side-icon">${icon}</span><span>${label}</span>
        </a>`).join("")}
    </nav>
    <div class="fx-side-bottom">
      <div class="fx-side-admin"><div class="fx-side-avatar">♙</div><div><strong>Juan Dela Cruz</strong><small>Administrator</small></div></div>
      <button class="fx-side-logout" id="fxLogoutButton" type="button"><span class="fx-side-icon">↪</span><span>Log Out</span></button>
    </div>`;

  shell.prepend(aside);
  document.getElementById("fxLogoutButton")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
      sessionStorage.removeItem("floraAdminLoggedIn");
      window.location.href = "login.html";
    }
  });
  setupMobileAdminNavigation(
    shell,
    aside,
    shell.querySelector(".admin-topbar"),
    "adminMobileMenuButton"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  buildAdminSidebar();
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

  // Logout confirmation
  const logoutButton = document.getElementById("logoutButton");
  const modal = document.getElementById("logoutModal");
  const cancelLogout = document.getElementById("logoutCancel");
  const confirmLogout = document.getElementById("logoutConfirm");

  logoutButton?.addEventListener("click", () => {
    modal?.classList.add("show");
    modal?.setAttribute("aria-hidden", "false");
  });

  cancelLogout?.addEventListener("click", () => {
    modal?.classList.remove("show");
    modal?.setAttribute("aria-hidden", "true");
  });

  confirmLogout?.addEventListener("click", () => {
    sessionStorage.removeItem("floraAdminLoggedIn");
  });

  // Profile edit
  const editButton = document.getElementById("editProfileButton");
  const form = document.getElementById("adminProfileForm");
  const cancelEdit = document.getElementById("cancelProfileEdit");

  editButton?.addEventListener("click", () => {
    if (form) form.hidden = false;
    document.getElementById("profileName")?.focus();
  });

  cancelEdit?.addEventListener("click", () => {
    if (form) form.hidden = true;
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();

    if (!name || !email) return;

    const displayName = document.getElementById("profileDisplayName");
    const displayEmail = document.getElementById("profileDisplayEmail");
    const infoName = document.getElementById("infoName");
    const infoEmail = document.getElementById("infoEmail");

    if (displayName) displayName.textContent = name;
    if (displayEmail) displayEmail.textContent = email;
    if (infoName) infoName.textContent = name;
    if (infoEmail) infoEmail.textContent = email;

    if (form) form.hidden = true;
  });

  document.getElementById("changePasswordButton")?.addEventListener("click", () => {
    alert("Change Password is ready for backend/database integration.");
  });

  document.getElementById("addressBookButton")?.addEventListener("click", () => {
    alert("Address Book is ready for the next admin module.");
  });

  document.getElementById("helpButton")?.addEventListener("click", () => {
    alert("Help Center is ready for the next admin module.");
  });
});
