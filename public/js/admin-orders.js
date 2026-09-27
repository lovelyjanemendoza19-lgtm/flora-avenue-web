(function () {
  const store = window.floraAvenueCustomerOrders;
  if (!store) return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
  const formatAmount = value => Number(value) > 0
    ? `₱${Number(value).toLocaleString("en-PH")}`
    : "To be discussed";
  const statusFilter = status => String(status || "Pending").toLowerCase().replace(/\s+/g, "-");
  const getOrders = () => store.load().sort((left, right) =>
    String(right.createdAt || "").localeCompare(String(left.createdAt || ""))
  );

  function renderOrderList() {
    const list = document.getElementById("orderList");
    if (!list) return;

    const search = document.getElementById("orderSearch");
    const filters = document.getElementById("orderFilters");
    const activeFilter = filters?.querySelector("button.active")?.dataset.filter || "all";
    const term = (search?.value || "").trim().toLowerCase();
    const orders = getOrders().filter(order => {
      const matchesStatus = activeFilter === "all" || statusFilter(order.status) === activeFilter;
      const searchable = [
        order.reference,
        order.customerName || order.contactName,
        order.customerEmail || order.contactEmail,
        order.style
      ].join(" ").toLowerCase();
      return matchesStatus && (!term || searchable.includes(term));
    });

    if (!orders.length) {
      list.innerHTML = `<p class="figma-muted order-empty">${getOrders().length
        ? "No orders match this filter."
        : "No customer orders yet. New customer orders will appear here."}</p>`;
      return;
    }

    list.innerHTML = orders.map(order => `
      <a class="figma-card figma-list-card" href="order-details.html?order=${encodeURIComponent(order.reference)}"
        data-status="${escapeHtml(statusFilter(order.status))}">
        <div>
          <span class="ref">${escapeHtml(order.reference)}</span>
          <div class="name">${escapeHtml(order.style || "Order")}</div>
          <span class="meta">${escapeHtml(order.customerName || order.contactName || order.customerEmail || "Customer")}
            · ${escapeHtml(order.customerEmail || order.contactEmail || "No email")}
            <br>${escapeHtml(order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date not recorded")}</span>
        </div>
        <span class="figma-status ${escapeHtml(statusFilter(order.status))}">${escapeHtml(order.status || "Pending")}</span>
        <strong class="price">${formatAmount(order.amount)}</strong>
      </a>`).join("");
  }

  function renderOrderDetails() {
    const root = document.getElementById("adminOrderDetails");
    if (!root) return;

    const reference = new URLSearchParams(window.location.search).get("order");
    const order = getOrders().find(item => item.reference === reference);
    if (!order) {
      root.innerHTML = `<p class="figma-muted order-empty">Order not found. <a href="orders.html">Return to orders</a>.</p>`;
      return;
    }

    const infoRows = [
      ["Product", order.style],
      ["Variation", order.size],
      ["Color", order.colors],
      ["Quantity", order.qty],
      ["Add-ons", order.addons],
      ["Notes", order.notes],
      ["Fulfillment", order.fulfil],
      ["Preferred date", order.date],
      ["Delivery address", order.address]
    ].filter(([, value]) => value !== undefined && value !== null && value !== "");
    const customerRows = [
      ["Name", order.customerName || order.contactName],
      ["Email", order.customerEmail || order.contactEmail],
      ["Contact", order.contactNumber]
    ].filter(([, value]) => value);
    const proposal = order.sellerProposal;

    root.innerHTML = `
      <div class="row"><div><span class="label">Order Reference</span><strong>${escapeHtml(order.reference)}</strong></div>
        <span class="figma-status ${escapeHtml(statusFilter(order.status))}">${escapeHtml(order.status || "Pending")}</span></div>
      <div class="figma-product"><img src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(order.style || "Order")}">
        <div><div class="product-name">${escapeHtml(order.style || "Order")}</div><div class="product-meta">${escapeHtml(order.type || "Customer order")}</div>
        <div class="product-price">${formatAmount(order.amount)}</div></div></div>
      <h2>Order information</h2><dl>${infoRows.map(([label, value]) =>
        `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>
      <h2>Customer information</h2><dl>${customerRows.map(([label, value]) =>
        `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("") || "<dd>Customer details unavailable.</dd>"}</dl>
      <div class="seller-proposal-current"><h2>Seller response</h2>
        <p>${escapeHtml(proposal?.notes || "No suggestion has been sent.")}</p>
        ${proposal?.amount ? `<p>Suggested total: ${formatAmount(proposal.amount)}</p>` : ""}
      </div>
      <div class="order-admin-actions">
        <button class="figma-btn" id="approveOrder" type="button">Approve order</button>
        <button class="figma-btn secondary" id="declineOrder" type="button">Decline order</button>
      </div>
      <form id="sellerProposalForm" class="seller-proposal-form">
        <h2>Suggest a change to the customer</h2>
        <label>Suggestion<textarea id="sellerProposalNotes" class="figma-textarea" required
          placeholder="Explain an alternative product, design, or change to the order.">${escapeHtml(proposal?.notes || "")}</textarea></label>
        <label>Suggested total price (optional)<input id="sellerProposalAmount" class="figma-input" type="number" min="0" step="0.01"
          value="${proposal?.amount ? escapeHtml(proposal.amount) : ""}"></label>
        <button class="figma-btn" type="submit">Send suggestion</button>
      </form>
      <p id="orderAdminFeedback" class="figma-muted" role="status" aria-live="polite"></p>`;

    const feedback = document.getElementById("orderAdminFeedback");
    const saveOrder = () => {
      try {
        store.update(order);
        feedback.textContent = "Order updated. The customer can now see this change in My Orders.";
        window.setTimeout(() => window.location.reload(), 700);
      } catch (error) {
        console.error("Unable to update the customer order from the admin portal.", error);
        feedback.textContent = "Unable to save the order update. Please try again.";
      }
    };

    document.getElementById("approveOrder").addEventListener("click", () => {
      order.status = "Confirmed";
      order.sellerResponseAt = new Date().toISOString();
      saveOrder();
    });
    document.getElementById("declineOrder").addEventListener("click", () => {
      order.status = "Declined";
      order.sellerResponseAt = new Date().toISOString();
      saveOrder();
    });
    document.getElementById("sellerProposalForm").addEventListener("submit", event => {
      event.preventDefault();
      const notes = document.getElementById("sellerProposalNotes").value.trim();
      const amountValue = document.getElementById("sellerProposalAmount").value;
      if (!notes) {
        document.getElementById("sellerProposalNotes").focus();
        return;
      }
      order.sellerProposal = {
        notes,
        amount: amountValue === "" ? null : Number(amountValue),
        updatedAt: new Date().toISOString()
      };
      order.status = "Awaiting Customer";
      saveOrder();
    });
  }

  function renderDashboard() {
    const recentOrders = document.getElementById("recentOrders");
    if (!recentOrders) return;

    const orders = getOrders();
    const pendingCount = orders.filter(order =>
      ["Pending", "Awaiting Customer"].includes(order.status)
    ).length;
    const revenue = orders
      .filter(order => !["Pending", "Awaiting Customer", "Declined", "Cancelled"].includes(order.status))
      .reduce((total, order) => total + (Number(order.amount) || 0), 0);
    const pendingMetric = document.getElementById("pendingOrderCount");
    const revenueMetric = document.getElementById("orderRevenue");
    if (pendingMetric) pendingMetric.textContent = String(pendingCount);
    if (revenueMetric) revenueMetric.textContent = `₱${revenue.toLocaleString("en-PH")}`;

    recentOrders.innerHTML = orders.length
      ? orders.slice(0, 5).map(order => `
        <a class="pro-order" href="order-details.html?order=${encodeURIComponent(order.reference)}">
          <div><span class="ref">${escapeHtml(order.reference)}</span><span class="customer">
            ${escapeHtml(order.customerName || order.contactName || order.customerEmail || "Customer")} · ${escapeHtml(order.style || "Order")}
          </span></div><span class="pro-badge">${escapeHtml(order.status || "Pending")}</span>
          <span class="amount">${formatAmount(order.amount)}</span>
        </a>`).join("")
      : `<p class="figma-muted order-empty">No customer orders yet.</p>`;
  }

  renderOrderList();
  renderOrderDetails();
  renderDashboard();

  document.getElementById("orderSearch")?.addEventListener("input", renderOrderList);
  document.getElementById("orderFilters")?.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("#orderFilters button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderOrderList();
    });
  });
  window.addEventListener("storage", event => {
    if (event.key === "floraAvenueOrders") {
      renderOrderList();
      renderDashboard();
      renderOrderDetails();
    }
  });
})();
