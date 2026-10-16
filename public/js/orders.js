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

    function normalizeOrderStatus(status) {
        return {
            pending: "To Pay",
            "awaiting customer": "Awaiting Approval",
            confirmed: "Confirmed",
            processing: "Preparing",
            preparing: "Preparing",
            "ready for pickup": "Ready for Pickup",
            "ready for delivery": "Ready for Delivery",
            shipped: "On the Way",
            "shipped out": "On the Way",
            delivered: "Completed",
            completed: "Completed",
            declined: "Cancelled",
            cancelled: "Cancelled"
        }[String(status || "").toLowerCase()] || status || "To Pay";
    }

    function isAwaitingApproval(order) {
        if (order.type !== "Customization Request" || order.customizationVoidedAt) return false;
        const status = normalizeOrderStatus(order.status);
        const payment = orderStore.getPaymentSummary(order);
        const customizationConfirmed = Boolean(
            order.customizationConfirmedAt
            || order.sellerProposal
            || payment.amountPaid > 0
            || ["Confirmed", "Preparing", "Ready for Pickup", "Ready for Delivery", "On the Way", "Completed"].includes(status)
        );
        const customizationAccepted = Boolean(
            order.customizationAcceptedAt
            || order.sellerProposal?.acceptedAt
            || payment.amountPaid > 0
            || ["Preparing", "Ready for Pickup", "Ready for Delivery", "On the Way", "Completed"].includes(status)
        );
        return !customizationConfirmed || !customizationAccepted;
    }

    function getCustomerStatus(order) {
        const status = normalizeOrderStatus(order.status);
        if (order.cancellationRequest?.status === "Pending") return "Cancellation Requested";
        if (isAwaitingApproval(order)) return "Awaiting Approval";
        if (status === "Cancelled" || status === "Completed") return status;

        const payment = orderStore.getPaymentSummary(order);
        if (payment.status !== "Fully Paid") return "Pending Payment";
        if (status === "To Pay" || status === "Pending") return "Confirmed";
        return status;
    }

    function getTrackingStatus(order) {
        const status = normalizeOrderStatus(order.status);
        if (status === "Completed") return "completed";
        if (status === "Cancelled") return "cancelled";
        if (order.cancellationRequest?.status === "Pending") return "cancellation-requested";
        if (isAwaitingApproval(order)) return "awaiting-approval";

        const payment = orderStore.getPaymentSummary(order);
        if (payment.status !== "Fully Paid") return "to-pay";
        return "to-receive";
    }

    function formatAmount(value) {
        return `₱${Number(value || 0).toLocaleString("en-PH")}`;
    }

    function renderOrders(filter = "all") {
        const visibleOrders = orders.filter(function (order) {
            return filter === "all" || getTrackingStatus(order) === filter;
        });

        if (!visibleOrders.length) {
            orderList.replaceChildren();
            const emptyState = document.createElement("p");
            emptyState.className = "empty-orders";
            if (orderStore.getCustomerEmail()) {
                emptyState.textContent = "No orders found.";
            } else {
                const signInLink = document.createElement("a");
                signInLink.className = "orders-sign-in-link";
                signInLink.href = "../../pages/login/login.html";
                signInLink.textContent = "Sign in";
                emptyState.append(signInLink, document.createTextNode(" to view your orders."));
            }
            orderList.appendChild(emptyState);
            return;
        }

        orderList.innerHTML = visibleOrders.map(function (order) {
            const title = order.type === "Customization Request"
                ? order.style || "Customization Request"
                : order.style || "Order";
            const details = order.type === "Customization Request"
                ? "Custom order"
                : `${order.size || "Standard"} · Qty ${order.qty || 1}`;
            const payment = orderStore.getPaymentSummary(order);
            const trackingStatus = getTrackingStatus(order);
            const orderStatus = getCustomerStatus(order);
            const customizationPendingPrice = order.type === "Customization Request"
                && !order.customizationConfirmedAt
                && !["confirmed", "preparing", "ready for pickup", "ready for delivery", "shipped", "shipped out", "completed"]
                    .includes(String(order.status || "").toLowerCase());
            const total = customizationPendingPrice
                ? "Awaiting final price"
                : payment.total > 0
                ? formatAmount(payment.total)
                : formatAmount(order.amount);
            return `<a class="order-item" data-tracking-status="${trackingStatus}" href="order%20details.html?order=${encodeURIComponent(order.reference)}" aria-label="View details for order ${escapeHtml(order.reference)}">
                <div class="order-item-product">
                    <img src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(title)}" loading="lazy" decoding="async">
                    <div class="order-info">
                        <strong>${escapeHtml(title)}</strong>
                        <span>${escapeHtml(details)}</span>
                        <span>Order ID: ${escapeHtml(order.reference)}</span>
                        <span>Fulfillment: ${escapeHtml(order.fulfil || "Not specified")}</span>
                    </div>
                </div>
                <div class="order-item-actions">
                    <div class="order-status-group">
                        <span class="order-status-value tracking-${trackingStatus}">${escapeHtml(orderStatus)}</span>
                    </div>
                    ${orderStatus === "Cancelled" ? "" : `<div class="order-item-total"><span>Total</span><strong>${escapeHtml(total)}</strong></div>`}
                </div>
            </a>`;
        }).join("");
    }

    orderList.addEventListener("keydown", function (event) {
        if (event.key !== " " || !event.target.closest(".order-item")) return;
        event.preventDefault();
        window.location.assign(event.target.closest(".order-item").href);
    });

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            filterButtons.forEach(function (item) {
                item.setAttribute("aria-selected", String(item === button));
            });
            renderOrders(button.dataset.filter);
        });
    });

    renderOrders("all");

    function refreshOrders() {
        orders = orderStore.load().filter(function (order) {
            return orderStore.belongsToCustomer(order);
        });
        const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || "all";
        renderOrders(activeFilter);
    }

    window.addEventListener("storage", function (event) {
        if (event.key !== "floraAvenueOrders" && event.key !== "floraAvenueUserEmail") return;
        refreshOrders();
    });
    window.addEventListener("floraAvenueOrdersChanged", refreshOrders);
})();
