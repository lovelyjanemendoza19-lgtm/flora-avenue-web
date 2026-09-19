(function () {
    const filterButtons = document.querySelectorAll(".filter-button");
    const orderList = document.getElementById("orderList");
    const orders = JSON.parse(localStorage.getItem("floraAvenueOrders") || "[]");

    function formatDate(value) {
        if (!value) return "Date not specified";
        return new Date(value).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, character => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[character]));
    }

    function renderOrders(filter) {
        orderList.innerHTML = "";
        const visibleOrders = orders.filter(order => order.reference && (
            filter === "all" || String(order.status).toLowerCase() === filter
        ));

        if (!visibleOrders.length) {
            orderList.innerHTML = '<p class="empty-orders">No orders found.</p>';
            return;
        }

        visibleOrders.forEach(order => {
            const item = document.createElement("a");
            const status = String(order.status || "Pending");
            item.className = "order-item";
            item.href = `Order%20details.html?order=${encodeURIComponent(order.reference)}`;
            item.dataset.status = status.toLowerCase();
            item.innerHTML = `
                <img src="../../public/images/${encodeURIComponent(order.image || "custom-bouquet.jpeg")}" alt="">
                <div class="order-info">
                    <strong>${escapeHtml(order.reference)}</strong>
                    <span>${escapeHtml(formatDate(order.createdAt))}</span>
                    <b>${order.amount ? `₱${Number(order.amount).toLocaleString("en-PH")}` : "Price upon inquiry"}</b>
                </div>
                <span class="status ${status.toLowerCase()}">${escapeHtml(status)}</span>
            `;
            orderList.appendChild(item);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            renderOrders(button.dataset.filter);
        });
    });

    renderOrders("all");
})();
