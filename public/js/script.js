const sideMenu = document.getElementById("sideMenu");
const logoutButtons = document.querySelectorAll("[data-logout-button]");
const menuOverlay = document.getElementById("menuOverlay");

const logoutModal = document.createElement("div");
logoutModal.className = "logout-modal";
logoutModal.setAttribute("role", "dialog");
logoutModal.setAttribute("aria-modal", "true");
logoutModal.setAttribute("aria-labelledby", "logoutModalTitle");
logoutModal.innerHTML = `
    <div class="logout-dialog">
        <button class="logout-close" type="button" aria-label="Close logout dialog">&times;</button>
        <div class="logout-icon" aria-hidden="true">↪</div>
        <h2 id="logoutModalTitle">Log out?</h2>
        <p>Are you sure you want to log out of Flora Avenue?</p>
        <div class="logout-actions">
            <button class="logout-cancel" type="button">Cancel</button>
            <button class="logout-confirm" type="button">Log Out</button>
        </div>
    </div>
`;
document.body.appendChild(logoutModal);

const logoutClose = logoutModal.querySelector(".logout-close");
const logoutCancel = logoutModal.querySelector(".logout-cancel");
const logoutConfirm = logoutModal.querySelector(".logout-confirm");

function closeLogoutModal() {
    logoutModal.classList.remove("show-logout");
}

function openLogoutModal() {
    sideMenu?.classList.remove("show-menu");
    menuOverlay?.classList.remove("show-overlay");
    sideMenu?.setAttribute("aria-hidden", "true");
    document.querySelectorAll(".profile-toggle").forEach(function (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        document.getElementById(toggle.getAttribute("aria-controls")).hidden = true;
        toggle.closest(".profile-menu").classList.remove("is-open");
    });
    logoutModal.classList.add("show-logout");
    logoutCancel.focus();
}

logoutButtons.forEach(function (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();
        openLogoutModal();
    });
});

logoutClose.onclick = closeLogoutModal;
logoutCancel.onclick = closeLogoutModal;
logoutModal.addEventListener("click", function (event) {
    if (event.target === logoutModal) {
        closeLogoutModal();
    }
});

logoutConfirm.onclick = function () {
    localStorage.removeItem("floraAvenueSignedIn");
    localStorage.removeItem("floraAvenueUserEmail");
    closeLogoutModal();
    window.location.reload();
};

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeLogoutModal();
    }
});


/* CURRENT PAGE HIGHLIGHT */

const menuLinks = document.querySelectorAll(
    "a.menu-link:not([data-logout-button])"
);

function normalizePath(path) {
    const normalizedPath = path.replace(/\\/g, "/").replace(/\/index\.html$/, "/");

    return normalizedPath.length > 1
        ? normalizedPath.replace(/\/$/, "")
        : normalizedPath;
}

const currentPath = normalizePath(window.location.pathname);

menuLinks.forEach(function (link) {
    const linkPath = normalizePath(
        new URL(link.href, window.location.href).pathname
    );

    if (linkPath === currentPath) {
        link.classList.add("active");
    }
});

if (/\/(profile|orders|inquiries)\//.test(currentPath)) {
    document.querySelectorAll(".profile-toggle").forEach(function (toggle) {
        toggle.classList.add("active");
    });
}