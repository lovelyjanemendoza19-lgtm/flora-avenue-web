const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const closeButton = document.getElementById("closeButton");
const logoutButton = document.getElementById("logoutButton");
const menuOverlay = document.getElementById("menuOverlay");

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

    alert("You are logged out.");

    sideMenu.classList.remove("show-menu");
    menuOverlay.classList.remove("show-overlay");
};


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

