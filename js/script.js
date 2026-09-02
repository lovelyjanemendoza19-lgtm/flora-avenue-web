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

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

menuLinks.forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }
});

if (category === "all") {
    document.querySelector(".catalog-page").classList.add("show-all");
} else {
    document.querySelector(".catalog-page").classList.remove("show-all");
}