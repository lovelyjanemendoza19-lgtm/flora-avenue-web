(function () {
    const body = document.body;
    const basePath = body.dataset.navigationBase || "";
    const persistent = body.classList.contains("persistent-sidebar");

    const navigation = document.createElement("div");

    navigation.innerHTML = `
        <div class="menu-overlay" id="menuOverlay"></div>
        <aside class="side-menu" id="sideMenu">
            <nav>
                <a href="${basePath}index.html" class="menu-link">Home</a>
                <a href="${basePath}pages/products/products.html" class="menu-link">Products</a>
                <a href="${basePath}pages/inquiries/inquiries.html" class="menu-link">My Inquiries</a>
                <a href="${basePath}pages/orders/orders.html" class="menu-link">My Orders</a>
                <a href="${basePath}pages/payments/payments.html" class="menu-link">Payments</a>
                <a href="${basePath}pages/profile/profile.html" class="menu-link">Profile</a>
                <a href="#" class="menu-link" id="logoutButton">Log Out</a>
            </nav>
            <a href="#" class="menu-link" id="logoutButton">
                <span class="menu-icon">
                </span>
            </a>

            </nav>

            <div class="admin-login-bottom">
                <a href="${basePath}admin/login.html">
                    Admin Login
                </a>
            </div>

        </aside>
    `;

    body.prepend(navigation);

    const menuButton = 
        document.getElementById("menuButton");
    const sideMenu = 
        document.getElementById("sideMenu");
    const menuOverlay =    
        document.getElementById("menuOverlay");

    function closeMenu() {
        sideMenu.classList.remove("show-menu");
        menuOverlay.classList.remove("show-overlay");
    }

    function openMenu() {
        sideMenu.classList.add("show-menu");
        menuOverlay.classList.add("show-overlay");
    }

    menuButton?.addEventListener("click", openMenu);
    menuOverlay.addEventListener("click", closeMenu);
);

    function updateNavigation() {
        const desktop = window.innerWidth >= 768;

        if (persistent && desktop) {
            closeMenu();
        }
    }

    updateNavigation();
    window.addEventListener(
        "resize", 
        updateNavigation
    );
})();