

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
    return;
  }

  const current = (window.location.pathname.split("/").pop() || "admin.html").toLowerCase();
  const links = [
    ["dashboard.html", "▦", "Dashboard"],
    ["products.html", "▤", "Products"],
    ["inquiries.html", "✉", "Inquiries"],
    ["orders.html", "▣", "Orders"],
    ["payments.html", "▤", "Payments"],
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
}

document.addEventListener("DOMContentLoaded", () => {
  buildAdminSidebar();
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

document.addEventListener("DOMContentLoaded", () => {
  function setupManagement(listId, filterId, searchId) {
    const list = document.getElementById(listId);
    const filters = document.getElementById(filterId);
    const search = document.getElementById(searchId);
    if (!list || !filters) return;

    const items = [...list.querySelectorAll(".management-item, .figma-list-card")];
    let active = "all";

    function apply() {
      const term = (search?.value || "").trim().toLowerCase();
      items.forEach(item => {
        const matchesStatus = active === "all" || item.dataset.status === active;
        const matchesSearch = !term || (item.dataset.search || item.textContent).toLowerCase().includes(term);
        item.style.display = matchesStatus && matchesSearch ? "grid" : "none";
      });
    }

    filters.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        active = button.dataset.filter;
        apply();
      });
    });
    search?.addEventListener("input", apply);
  }

  setupManagement("orderList", "orderFilters", "orderSearch");
  setupManagement("paymentList", "paymentFilters", "paymentSearch");

  const statusButtons = document.querySelectorAll("#orderStatus button");
  const saveStatus = document.getElementById("saveOrderStatus");
  statusButtons.forEach(button => {
    button.addEventListener("click", () => {
      statusButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
    });
  });
  saveStatus?.addEventListener("click", () => {
    const selected = document.querySelector("#orderStatus button.active");
    alert(`Order status updated to ${selected?.dataset.status || "selected status"}.`);
  });

  const verify = document.getElementById("verifyPayment");
  const reject = document.getElementById("rejectPayment");
  const paymentStatus = document.getElementById("paymentStatus");
  verify?.addEventListener("click", () => {
    if (paymentStatus) {
      paymentStatus.textContent = "Verified";
      paymentStatus.className = "admin-status verified";
    }
    alert("Payment verified successfully.");
  });
  reject?.addEventListener("click", () => {
    if (paymentStatus) {
      paymentStatus.textContent = "Failed";
      paymentStatus.className = "admin-status failed";
    }
    alert("Payment marked for rejection.");
  });
});
