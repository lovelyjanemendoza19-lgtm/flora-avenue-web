const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const closeButton = document.getElementById("closeButton");
const logoutButton = document.getElementById("logoutButton");
const menuOverlay = document.getElementById("menuOverlay");

menuButton.onclick = function () {
    sideMenu.classList.add("show-menu");
    menuOverlay.classList.add("show-overlay");
};

closeButton.onclick = function () {
    sideMenu.classList.remove("show-menu");
    menuOverlay.classList.remove("show-overlay");
};

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

const currentPath =
    window.location.pathname.replace(/\\/g, "/");

menuLinks.forEach(function (link) {
    const linkPath =
        new URL(link.href, window.location.href).pathname
            .replace(/\\/g, "/");

    if (linkPath === currentPath) {
        link.classList.add("active");
    }
});

