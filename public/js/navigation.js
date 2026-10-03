const navigationBase = document.body.dataset.navigationBase || "";
const isSignedIn = localStorage.getItem("floraAvenueSignedIn") === "true";
const navigationPath = window.location.pathname.replace(/\\/g, "/");
const isHomeOrCatalog = navigationPath.endsWith("/index.html")
    || navigationPath.endsWith("/products/products.html")
    || navigationPath.endsWith("/");

const navigationItems = [
    ["Home", "index.html"],
    ["Products", "pages/products/products.html"]
];

function createNavigationLinks() {
    return navigationItems.map(function ([label, path]) {
        return `<a class="menu-link" href="${navigationBase}${path}">${label}</a>`;
    }).join("");
}

function createProfileMenu(mobile) {
    const menuId = mobile ? "mobileProfileSubmenu" : "desktopProfileSubmenu";
    const logoutButton = isSignedIn
        ? `<button class="menu-link menu-action" data-logout-button type="button">Log Out</button>`
        : "";

    return `
        <div class="profile-menu${mobile ? " mobile-profile-menu" : " desktop-profile-menu"}">
            <button
                class="menu-link profile-toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="${menuId}"
            >Profile<span class="profile-chevron" aria-hidden="true">⌄</span></button>
            <div class="profile-submenu" id="${menuId}" hidden>
                <a class="menu-link" href="${navigationBase}pages/profile/profile.html">My Profile</a>
                <a class="menu-link" href="${navigationBase}pages/orders/orders.html">My Orders</a>
                <a class="menu-link" href="${navigationBase}pages/inquiries/inquiries.html">My Inquiries</a>
                ${logoutButton}
            </div>
        </div>
    `;
}

let header = document.querySelector(".website > header");
if (!header) {
    header = document.createElement("header");
    header.className = "generated-site-header";
    const logo = document.createElement("div");
    logo.className = "logo";
    logo.innerHTML = `<img src="${navigationBase}public/images/logo.png" alt="Flora Avenue Logo">`;
    header.append(logo);
    const website = document.querySelector(".website");
    website?.prepend(header);
}

const menuButton = document.getElementById("menuButton");
if (menuButton) {
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-controls", "sideMenu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("type", "button");
}

const desktopNavigation = document.createElement("nav");
desktopNavigation.className = "desktop-navigation";
desktopNavigation.setAttribute("aria-label", "Main navigation");
desktopNavigation.innerHTML = `
    ${createNavigationLinks()}
    ${createProfileMenu(false)}
`;
header.append(desktopNavigation);

const menu = document.createElement("aside");
menu.className = "side-menu";
menu.id = "sideMenu";
menu.setAttribute("aria-label", "Mobile navigation");
menu.setAttribute("aria-hidden", "true");
menu.innerHTML = `
    <p class="side-menu-brand">FLORA AVENUE</p>
    <nav aria-label="Main navigation">
        ${createNavigationLinks()}
        ${createProfileMenu(true)}
        ${!isSignedIn ? `<a class="menu-link side-sign-in mobile-sign-in" href="${navigationBase}pages/login/login.html">Sign In</a>` : ""}
    </nav>
`;

const overlay = document.createElement("div");
overlay.className = "menu-overlay";
overlay.id = "menuOverlay";
overlay.setAttribute("aria-hidden", "true");

document.body.append(menu, overlay);

const siteFooterLoader = document.createElement("script");
siteFooterLoader.src = `${navigationBase}public/js/footer.js`;
document.body.append(siteFooterLoader);

if (!isSignedIn && isHomeOrCatalog) {
    const signIn = document.createElement("a");
    signIn.className = "desktop-sign-in";
    signIn.href = `${navigationBase}pages/login/login.html`;
    signIn.textContent = "Sign In";
    signIn.setAttribute("aria-label", "Sign in");
    header.append(signIn);
}

function setProfileMenuOpen(toggle, isOpen) {
    const submenu = document.getElementById(toggle.getAttribute("aria-controls"));
    toggle.setAttribute("aria-expanded", String(isOpen));
    submenu.hidden = !isOpen;
    toggle.closest(".profile-menu").classList.toggle("is-open", isOpen);
}

document.querySelectorAll(".profile-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
        const isOpen = toggle.getAttribute("aria-expanded") !== "true";
        setProfileMenuOpen(toggle, isOpen);
    });
});

function closeProfileMenus() {
    document.querySelectorAll(".profile-toggle[aria-expanded='true']").forEach(function (toggle) {
        setProfileMenuOpen(toggle, false);
    });
}

function closeMenu() {
    menu.classList.remove("show-menu");
    overlay.classList.remove("show-overlay");
    menu.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
    closeProfileMenus();
}

function toggleMenu() {
    const isOpen = menu.classList.toggle("show-menu");
    overlay.classList.toggle("show-overlay", isOpen);
    menu.setAttribute("aria-hidden", String(!isOpen));
    menuButton?.setAttribute("aria-expanded", String(isOpen));
}

menuButton?.addEventListener("click", toggleMenu);
overlay.addEventListener("click", closeMenu);

document.addEventListener("click", function (event) {
    if (!event.target.closest(".desktop-profile-menu")) {
        const desktopToggle = document.querySelector(".desktop-profile-menu .profile-toggle");
        if (desktopToggle?.getAttribute("aria-expanded") === "true") {
            setProfileMenuOpen(desktopToggle, false);
        }
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});
