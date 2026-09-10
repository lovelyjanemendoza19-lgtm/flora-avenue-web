(function () {
    const basePath = document.body.dataset.navigationBase || "";
    const existingMenu = document.querySelector(".side-menu");
    const existingOverlay = document.querySelector(".menu-overlay");

    if (existingMenu) {
        existingMenu.remove();
    }

    if (existingOverlay) {
        existingOverlay.remove();
    }

    const navigation = document.createElement("div");
    navigation.innerHTML = `
        <div class="menu-overlay" id="menuOverlay"></div>
        <aside class="side-menu" id="sideMenu">
            <button class="close-button" id="closeButton" type="button" aria-label="Close menu">×</button>
            <nav>
                <a href="${basePath}index.html" class="menu-link">
                    <span class="menu-icon">⌂</span>
                    <span class="menu-text">Home</span>
                </a>
                <a href="${basePath}pages/products/products.html" class="menu-link">
                    <span class="menu-icon">▦</span>
                    <span class="menu-text">Products</span>
                </a>
                <a href="${basePath}pages/help/inquiries.html" class="menu-link">
                    <span class="menu-icon">□</span>
                    <span class="menu-text">My Inquiries</span>
                </a>
                <a href="${basePath}pages/orders/orders.html" class="menu-link">
                    <span class="menu-icon">▤</span>
                    <span class="menu-text">My Orders</span>
                </a>
                <a href="${basePath}pages/help/payments.html" class="menu-link">
                    <span class="menu-icon">▣</span>
                    <span class="menu-text">Payments</span>
                </a>
                <a href="${basePath}pages/profile/profile.html" class="menu-link">
                    <span class="menu-icon">○</span>
                    <span class="menu-text">Profile</span>
                </a>
                <a href="#" class="menu-link" id="logoutButton">
                    <span class="menu-icon">↪</span>
                    <span class="menu-text">Log Out</span>
                </a>
            </nav>
        </aside>
    `;

    document.body.prepend(navigation);
})();
