const navigationBase = document.body.dataset.navigationBase || "";
const isSignedIn = localStorage.getItem("floraAvenueSignedIn") === "true";

const navigationItems = [
    ["Home", "index.html", "home-icon.png"],
    ["Products", "pages/products/products.html", "product-icon.png"]
];

function createNavigationLinks(mobile = false) {
    return navigationItems.map(function ([label, path, icon]) {
        const iconMarkup = mobile
            ? `<span class="menu-icon" aria-hidden="true"><img src="${navigationBase}public/images/${icon}" alt=""></span>`
            : "";
        return `<a class="menu-link" href="${navigationBase}${path}">${iconMarkup}<span class="menu-text">${label}</span></a>`;
    }).join("");
}

function createAccountNavigation(mobile) {
    if (mobile) {
        const inquiryLabel = "Inquiries";
        const ordersLabel = "Orders";
        const accountAction = isSignedIn
            ? `<a class="menu-link" href="${navigationBase}pages/profile/profile.html">
                    <span class="menu-icon" aria-hidden="true"><img src="${navigationBase}public/images/profile-icon.png" alt=""></span>
                    <span class="menu-text">My Profile</span>
                </a>
                <button class="menu-link menu-action" data-logout-button type="button">
                    <span class="menu-icon" aria-hidden="true"><img src="${navigationBase}public/images/logout-icon.png" alt=""></span>
                    <span class="menu-text">Log Out</span>
                </button>`
            : `<a class="menu-link nav-sign-in mobile-nav-sign-in" href="${navigationBase}pages/login/login.html">Sign In</a>`;

        return `
            <a class="menu-link" href="${navigationBase}pages/inquiries/inquiries.html">
                <span class="menu-icon" aria-hidden="true"><img src="${navigationBase}public/images/inquiry-icon.png" alt=""></span>
                <span class="menu-text">${inquiryLabel}</span>
                <span class="customer-nav-badge" data-count-for="inquiries" hidden></span>
            </a>
            <a class="menu-link" href="${navigationBase}pages/orders/orders.html">
                <span class="menu-icon" aria-hidden="true"><img src="${navigationBase}public/images/order-icon.png" alt=""></span>
                <span class="menu-text">${ordersLabel}</span>
                <span class="customer-nav-badge" data-count-for="orders" hidden></span>
            </a>
            ${accountAction}
        `;
    }

    if (isSignedIn) {
        return createProfileMenu(mobile);
    }

    return `<a class="menu-link nav-sign-in" href="${navigationBase}pages/login/login.html">Sign In</a>`;
}

function createProfileMenu(mobile) {
    const menuId = mobile ? "mobileProfileSubmenu" : "desktopProfileSubmenu";
    const profileUrl = `${navigationBase}pages/profile/profile.html`;
    const trigger = `<button class="menu-link profile-toggle" type="button" aria-label="My Profile and account menu" title="My Profile" aria-haspopup="true" aria-expanded="false" aria-controls="${menuId}"><span class="menu-icon profile-menu-icon" aria-hidden="true"><img src="${navigationBase}public/images/profile-icon.png" alt=""></span><span class="profile-chevron" aria-hidden="true"></span></button>`;

    return `
        <div class="profile-menu${mobile ? " mobile-profile-menu" : " desktop-profile-menu"}">
            ${trigger}
            <div class="profile-submenu" id="${menuId}" hidden>
                <a class="menu-link" href="${profileUrl}">My Profile</a>
                <a class="menu-link" href="${navigationBase}pages/orders/orders.html"><span>My Orders</span><span class="customer-nav-badge" data-count-for="orders" hidden></span></a>
                <a class="menu-link" href="${navigationBase}pages/inquiries/inquiries.html"><span>My Inquiries</span><span class="customer-nav-badge" data-count-for="inquiries" hidden></span></a>
                <button class="menu-link menu-action" data-logout-button type="button">Log Out</button>
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
    ${createAccountNavigation(false)}
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
        ${createNavigationLinks(true)}
        ${createAccountNavigation(true)}
    </nav>
`;

const overlay = document.createElement("div");
overlay.className = "menu-overlay";
overlay.id = "menuOverlay";
overlay.setAttribute("aria-hidden", "true");

document.body.append(menu, overlay);

function renderCustomerNavigationBadges() {
    const badges = document.querySelectorAll(".customer-nav-badge");
    if (!badges.length) return;

    let email = "";
    let orders = [];
    let inquiries = [];
    try {
        if (localStorage.getItem("floraAvenueSignedIn") === "true") {
            email = (localStorage.getItem("floraAvenueUserEmail") || "").trim().toLowerCase();
        }
        orders = JSON.parse(localStorage.getItem("floraAvenueOrders") || "[]");
        inquiries = JSON.parse(localStorage.getItem("floraAvenueInquiries") || "[]");
        if (!Array.isArray(orders) || !Array.isArray(inquiries)) {
            throw new Error("Customer order and inquiry data must be lists.");
        }
    } catch (error) {
        console.error("Unable to load customer navigation counts.", error);
        badges.forEach(function (badge) {
            badge.hidden = true;
            badge.textContent = "";
            badge.removeAttribute("aria-label");
        });
        return;
    }

    const pendingOrderCount = email
        ? orders.filter(function (order) {
            const customerEmail = String(order.customerEmail || order.contactEmail || "").trim().toLowerCase();
            const status = String(order.status || "Pending").trim().toLowerCase();
            return customerEmail === email && ["pending", "awaiting customer"].includes(status);
        }).length
        : 0;
    const unansweredInquiryCount = email
        ? inquiries.filter(function (inquiry) {
            return String(inquiry.customerEmail || "").trim().toLowerCase() === email
                && !String(inquiry.response || "").trim();
        }).length
        : 0;

    badges.forEach(function (badge) {
        const type = badge.dataset.countFor;
        const count = type === "orders" ? pendingOrderCount : unansweredInquiryCount;
        badge.textContent = count > 99 ? "99+" : String(count);
        badge.hidden = count === 0;
        badge.setAttribute("aria-label", `${count} pending ${type}`);
    });
}

renderCustomerNavigationBadges();
window.addEventListener("storage", function (event) {
    if (["floraAvenueOrders", "floraAvenueInquiries", "floraAvenueSignedIn", "floraAvenueUserEmail"].includes(event.key)) {
        renderCustomerNavigationBadges();
    }
});
window.addEventListener("floraAvenueOrdersChanged", renderCustomerNavigationBadges);
window.addEventListener("floraAvenueInquiriesChanged", renderCustomerNavigationBadges);

const siteFooterLoader = document.createElement("script");
siteFooterLoader.src = `${navigationBase}public/js/footer.js`;
document.body.append(siteFooterLoader);

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
