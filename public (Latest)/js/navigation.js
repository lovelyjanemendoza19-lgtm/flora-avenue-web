(function () {
    const body = document.body;
    const basePath = body.dataset.navigationBase || "";
    const persistent = body.classList.contains("persistent-sidebar");
    const isHomepage = /(^|\/)index\.html$/.test(window.location.pathname);
    const isMobileSignInPage = isHomepage || /\/pages\/(products|orders|inquiries|payments|profile)\//.test(window.location.pathname);
    const isSignedIn = localStorage.getItem("floraAvenueSignedIn") === "true";

    const navigation = document.createElement("div");

    navigation.innerHTML = `
        <div class="menu-overlay" id="menuOverlay"></div>
        ${isHomepage && !isSignedIn ? `<a class="desktop-sign-in" href="${basePath}pages/login/login.html">Sign In</a>` : ""}
        <aside class="side-menu" id="sideMenu">
            <div class="side-menu-brand">FLORA AVENUE</div>
            <nav>
                <a href="${basePath}index.html" class="menu-link"><span class="menu-icon"><img src="${basePath}public/images/home-icon.png" alt=""></span><span class="menu-text">Home</span></a>
                <a href="${basePath}pages/products/products.html" class="menu-link"><span class="menu-icon"><img src="${basePath}public/images/product-icon.png" alt=""></span><span class="menu-text">Products</span></a>
                <a href="${basePath}pages/inquiries/inquiries.html" class="menu-link"><span class="menu-icon"><img src="${basePath}public/images/inquiry-icon.png" alt=""></span><span class="menu-text">My Inquiries</span></a>
                <a href="${basePath}pages/orders/orders.html" class="menu-link"><span class="menu-icon"><img src="${basePath}public/images/order-icon.png" alt=""></span><span class="menu-text">My Orders</span></a>
                <a href="${basePath}pages/profile/profile.html" class="menu-link"><span class="menu-icon"><img src="${basePath}public/images/profile-icon.png" alt=""></span><span class="menu-text">Profile</span></a>
                <a href="#" class="menu-link" id="logoutButton"><span class="menu-icon"><img src="${basePath}public/images/logout-icon.png" alt=""></span><span class="menu-text">Log Out</span></a>
            </nav>
            ${isMobileSignInPage && !isSignedIn ? `<a class="mobile-sign-in" href="${basePath}pages/login/login.html">Sign In</a>` : ""}
        </aside>
    `;

    body.prepend(navigation);

    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    function closeMenu() {
        sideMenu.classList.remove("show-menu");
        menuOverlay.classList.remove("show-overlay");
        menuButton?.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
        sideMenu.classList.add("show-menu");
        menuOverlay.classList.add("show-overlay");
        menuButton?.setAttribute("aria-expanded", "true");
    }

    menuButton?.addEventListener("click", openMenu);
    menuOverlay.addEventListener("click", closeMenu);

    function updateNavigation() {
        const desktop = window.innerWidth >= 768;

        if (persistent && desktop) {
            closeMenu();
        }
    }

    updateNavigation();
    window.addEventListener("resize", updateNavigation);
})();