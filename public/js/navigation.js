(function () {
    const body = document.body;
    const basePath = body.dataset.navigationBase || "";
    const persistent = body.classList.contains("persistent-sidebar");

    const navigation = document.createElement("div");

    navigation.innerHTML = `
        <div class="menu-overlay" id="menuOverlay"></div>
        <aside class="side-menu" id="sideMenu">
            <div class="sidebar-brand">Flora Avenue</div>
            <button class="close-button" id="closeButton" aria-label="Close menu">×</button>
            <nav>
                <a href="${basePath}index.html" class="menu-link">Home</a>
                <a href="${basePath}pages/products/products.html" class="menu-link">Products</a>
                <a href="${basePath}pages/inquiries/inquiries.html" class="menu-link">My Inquiries</a>
                <a href="${basePath}pages/orders/orders.html" class="menu-link">My Orders</a>
                <a href="${basePath}pages/payments/payments.html" class="menu-link">Payments</a>
                <a href="${basePath}pages/profile/profile.html" class="menu-link">Profile</a>
                <a href="#" class="menu-link" id="logoutButton">Log Out</a>
            </nav>
        </aside>
    `;

    body.prepend(navigation);

    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeButton = document.getElementById("closeButton");

    function closeMenu() {
        sideMenu.classList.remove("active");
        menuOverlay.classList.remove("active");
    }

    function openMenu() {
        sideMenu.classList.add("active");
        menuOverlay.classList.add("active");
    }

    menuButton?.addEventListener("click", openMenu);
    closeButton?.addEventListener("click", closeMenu);
    menuOverlay.addEventListener("click", closeMenu);

    document.getElementById("logoutButton")?.addEventListener("click", function (event) {
        event.preventDefault();
        closeMenu();
        alert("You are logged out.");
    });

    function updateNavigation() {
        const desktop = window.innerWidth >= 768;

        if (persistent && desktop) {
            closeMenu();
        }
    }

    updateNavigation();
    window.addEventListener("resize", updateNavigation);
})();