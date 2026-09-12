const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const closeButton = document.getElementById("closeButton");
const logoutButton = document.getElementById("logoutButton");
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
    sideMenu.classList.remove("show-menu");
    menuOverlay.classList.remove("show-overlay");
    logoutModal.classList.add("show-logout");
    logoutCancel.focus();
}

if (menuButton) {
    menuButton.onclick = function () {
        sideMenu.classList.add("show-menu");
        menuOverlay.classList.add("show-overlay");
    };
}

if (closeButton) {
    closeButton.onclick = function () {
        sideMenu.classList.remove("show-menu");
        menuOverlay.classList.remove("show-overlay");
    };
}

menuOverlay.onclick = function () {
    sideMenu.classList.remove("show-menu");
    menuOverlay.classList.remove("show-overlay");
};

logoutButton.onclick = function (event) {
    event.preventDefault();
    openLogoutModal();
};

logoutClose.onclick = closeLogoutModal;
logoutCancel.onclick = closeLogoutModal;
logoutModal.addEventListener("click", function (event) {
    if (event.target === logoutModal) {
        closeLogoutModal();
    }
});

logoutConfirm.onclick = function () {
    closeLogoutModal();
};

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeLogoutModal();
    }
});


/* CURRENT PAGE HIGHLIGHT */

const menuLinks = document.querySelectorAll(
    ".menu-link:not(#logoutButton)"
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
