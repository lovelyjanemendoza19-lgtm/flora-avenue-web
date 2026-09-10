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

            <nav>

                <a href="${basePath}index.html" class="menu-link">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/home-icon.png" alt="Home">
                    </span>
                    <span class="menu-text">Home</span>
                </a>

                <a href="${basePath}pages/products/products.html" class="menu-link">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/product-icon.png" alt="Products">
                    </span>
                    <span class="menu-text">Products</span>
                </a>

                <a href="${basePath}pages/inquiries/inquiries.html" class="menu-link">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/inquiry-icon.png" alt="My Inquiries">
                    </span>
                    <span class="menu-text">My Inquiries</span>
                </a>

                <a href="${basePath}pages/orders/orders.html" class="menu-link">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/order-icon.png" alt="My Orders">
                    </span>
                    <span class="menu-text">My Orders</span>
                </a>

                <a href="${basePath}pages/payments/payments.html" class="menu-link">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/payment-icon.png" alt="Payments">
                    </span>
                    <span class="menu-text">Payments</span>
                </a>

                <a href="${basePath}pages/profile/profile.html" class="menu-link">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/profile-icon.png" alt="Profile">
                    </span>
                    <span class="menu-text">Profile</span>
                </a>

                <a href="#" class="menu-link" id="logoutButton">
                    <span class="menu-icon">
                        <img src="${basePath}public/images/logout-icon.png" alt="Log Out">
                    </span>
                    <span class="menu-text">Log Out</span>
                </a>

            </nav>

        </aside>
    `;

    document.body.prepend(navigation);

    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const logoutButton = document.getElementById("logoutButton");

    function openMenu() {
        sideMenu.classList.add("active");
        menuOverlay.classList.add("active");
    }

    function closeMenu() {
        sideMenu.classList.remove("active");
        menuOverlay.classList.remove("active");
    }

    if (menuButton) {
        menuButton.addEventListener("click", openMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", closeMenu);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
        });
    }
})();