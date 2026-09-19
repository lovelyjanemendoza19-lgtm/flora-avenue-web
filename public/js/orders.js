(function () {
    const orderList = document.getElementById("orderList");
    const filterButtons = document.querySelectorAll(".filter-button");
    const orders = JSON.parse(localStorage.getItem("floraAvenueOrders") || "[]");

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
            Confirmed: "verified",
            Cancelled: "rejected"
        }[status] || "pending";
    }

    function renderOrders(filter) {
        const visibleOrders = orders.filter(function (order) {
            return filter === "all" || String(order.status).toLowerCase() === filter;
        });

        if (!visibleOrders.length) {
            orderList.innerHTML = "<p class=\"empty-orders\">No orders found.</p>";
            return;
        }

        orderList.innerHTML = visibleOrders.map(function (order) {
            const title = order.type === "Customization Request"
                ? "Customization Request"
                : order.style || "Order";
            const details = order.type === "Customization Request"
                ? order.style || "Custom creation"
                : `${order.size || "Standard"} x ${order.qty || 1}`;
            const amount = Number(order.amount || 0).toLocaleString("en-PH");

            return `<a class="order-item" href="order%20details.html?order=${encodeURIComponent(order.reference)}" data-status="${escapeHtml(String(order.status).toLowerCase())}">
                <img src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(title)}">
                <div class="order-info">
                    <strong>${escapeHtml(title)}</strong>
                    <span>${escapeHtml(details)} · ${escapeHtml(order.reference)}</span>
                    <b>₱${amount}</b>
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
})();
