(function () {
    const orderList = document.getElementById("orderList");
    const filterButtons = document.querySelectorAll(".filter-button");
    const orderStore = window.floraAvenueCustomerOrders;
    let orders = orderStore.load().filter(function (order) {
        return orderStore.belongsToCustomer(order);
    });

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function statusClass(status) {
        return {
            Pending: "pending",
            "Awaiting Customer": "pending",
            Confirmed: "verified",
            Processing: "verified",
            Shipped: "verified",
            Delivered: "verified",
            Declined: "rejected",
            Cancelled: "rejected"
        }[status] || "pending";
    }

    function renderOrders(filter) {
        const visibleOrders = orders.filter(function (order) {
            const status = String(order.status).toLowerCase();
            if (filter === "all") return true;
            if (filter === "confirmed") return ["confirmed", "processing", "shipped", "delivered"].includes(status);
            return status === filter;
        });

        if (!visibleOrders.length) {
            orderList.replaceChildren();
            const emptyState = document.createElement("p");
            emptyState.className = "empty-orders";
            emptyState.textContent = orderStore.getCustomerEmail()
                ? "No orders found."
                : "Sign in to view your orders.";
            orderList.appendChild(emptyState);
            if (!orderStore.getCustomerEmail()) {
                const signInLink = document.createElement("a");
                signInLink.className = "orders-sign-in";
                signInLink.href = "../../pages/login/login.html";
                signInLink.textContent = "Sign In";
                orderList.appendChild(signInLink);
            }
            return;
        }

        orderList.innerHTML = visibleOrders.map(function (order) {
            const title = order.type === "Customization Request"
                ? "Customization Request"
                : order.style || "Order";
            const details = order.type === "Customization Request"
                ? order.style || "Custom creation"
                : `${order.size || "Standard"} x ${order.qty || 1}`;
            const amount = Number(order.amount || 0) > 0
                ? `₱${Number(order.amount).toLocaleString("en-PH")}`
                : order.type === "Customization Request" ? "Budget to be discussed" : "₱0";
            const inquiryReference = order.sourceInquiryReference
                ? `<span>Inquiry: ${escapeHtml(order.sourceInquiryReference)}</span>`
                : "";

            return `<a class="order-item" href="order%20details.html?order=${encodeURIComponent(order.reference)}" data-status="${escapeHtml(String(order.status).toLowerCase())}">
                <img src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(title)}">
                <div class="order-info">
                    <strong>${escapeHtml(title)}</strong>
                    <span>${escapeHtml(details)} · ${escapeHtml(order.reference)}</span>
                    ${inquiryReference}
                    <b>${escapeHtml(amount)}</b>
                </div>
                <span class="status ${statusClass(order.status)}">${escapeHtml(order.status || "Pending")}</span>
            </a>`;
        }).join("");
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            renderOrders(button.dataset.filter);
        });
    });

    renderOrders("all");

    window.addEventListener("storage", function (event) {
        if (event.key !== "floraAvenueOrders" && event.key !== "floraAvenueUserEmail") return;
        orders = orderStore.load().filter(function (order) {
            return orderStore.belongsToCustomer(order);
        });
        const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || "all";
        renderOrders(activeFilter);
    });
})();
