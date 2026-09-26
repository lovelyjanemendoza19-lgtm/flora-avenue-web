const navigationBase = document.body.dataset.navigationBase || "";
const isSignedIn = localStorage.getItem("floraAvenueSignedIn") === "true";
const navigationPath = window.location.pathname.replace(/\\/g, "/");
const isHomeOrCatalog = navigationPath.endsWith("/index.html")
    || navigationPath.endsWith("/products/products.html")
    || navigationPath.endsWith("/");

const navigationLinks = [
    ["Home", "index.html", "home-icon.png"],
    ["Products", "pages/products/products.html", "product-icon.png"],
    ["My Inquiries", "pages/inquiries/inquiries.html", "inquiry-icon.png"],
    ["My Orders", "pages/orders/orders.html", "order-icon.png"],
    ["Profile", "pages/profile/profile.html", "profile-icon.png"]
];

const menu = document.createElement("aside");
menu.className = "side-menu";
menu.id = "sideMenu";
menu.setAttribute("aria-label", "Main navigation");
menu.innerHTML = `
    <p class="side-menu-brand">FLORA AVENUE</p>
    <nav>
        ${navigationLinks.map(function ([label, path, icon]) {
            return `<a class="menu-link" href="${navigationBase}${path}">
                <span class="menu-icon"><img src="${navigationBase}public/images/${icon}" alt=""></span>
                <span class="menu-text">${label}</span>
            </a>`;
        }).join("")}
        ${!isSignedIn ? `<a class="menu-link side-sign-in mobile-sign-in" href="${navigationBase}pages/login/login.html">
            <span class="menu-icon"><img src="${navigationBase}public/images/profile-icon.png" alt=""></span>
            <span class="menu-text">Sign In</span>
        </a>` : ""}
        ${isSignedIn ? `<button class="menu-link menu-action" id="logoutButton" type="button">
            <span class="menu-icon"><img src="${navigationBase}public/images/logout-icon.png" alt=""></span>
            <span class="menu-text">Log Out</span>
        </button>` : ""}
    </nav>
`;

const overlay = document.createElement("div");
overlay.className = "menu-overlay";
overlay.id = "menuOverlay";
overlay.setAttribute("aria-hidden", "true");

document.body.append(menu, overlay);

if (!isSignedIn && isHomeOrCatalog) {
    const signIn = document.createElement("a");
    signIn.className = "desktop-sign-in";
    signIn.href = `${navigationBase}pages/login/login.html`;
    signIn.textContent = "Sign In";
    signIn.setAttribute("aria-label", "Sign in");
    document.body.append(signIn);
}

const menuButton = document.getElementById("menuButton");

function closeMenu() {
    menu.classList.remove("show-menu");
    overlay.classList.remove("show-overlay");
    menuButton?.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    const isOpen = menu.classList.toggle("show-menu");
    overlay.classList.toggle("show-overlay", isOpen);
    menuButton?.setAttribute("aria-expanded", String(isOpen));
}

menuButton?.addEventListener("click", toggleMenu);
overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});