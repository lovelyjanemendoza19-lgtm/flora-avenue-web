(function () {
  const store = window.floraAvenueCustomerOrders;
  if (!store) return;

  const orderStages = ["To Pay", "Preparing", "Ready for Pickup", "Completed"];
  const deliveryStages = ["To Pay", "Preparing", "Ready for Delivery", "Shipped Out", "Completed"];
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
  const formatAmount = value => Number(value) > 0
    ? `₱${Number(value).toLocaleString("en-PH")}`
    : "₱0";
  const formatOrderDate = value => {
    const date = new Date(value || "");
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-PH");
  };
  const slug = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const normalizeOrderStatus = value => ({
    pending: "To Pay",
    confirmed: "To Pay",
    "awaiting customer": "To Pay",
    processing: "Preparing",
    preparing: "Preparing",
    "ready for pickup": "Ready for Pickup",
    "ready for delivery": "Ready for Delivery",
    shipped: "Shipped Out",
    "shipped out": "Shipped Out",
    delivered: "Completed",
    completed: "Completed",
    declined: "Cancelled",
    cancelled: "Cancelled"
  }[String(value || "").toLowerCase()] || value || "To Pay");
  const getOrders = () => store.load().sort((left, right) =>
    String(right.createdAt || "").localeCompare(String(left.createdAt || ""))
  );
  const paymentSummary = order => store.getPaymentSummary(order);
  const formatPaymentStatus = order => paymentSummary(order).status;
  const isCustomizationOrder = order => order.type === "Customization Request";
  const hasCustomizationConfirmation = order => Boolean(
    order.customizationConfirmedAt
    || order.sellerProposal?.acceptedAt
    || Number(order.payment?.amountPaid) > 0
    || ["Confirmed", "Preparing", "Ready for Pickup", "Ready for Delivery", "Shipped Out", "Completed"]
      .includes(normalizeOrderStatus(order.status))
  );
  const hasCustomizationAcceptance = order => Boolean(
    order.customizationAcceptedAt
    || (!order.customizationConfirmedAt && (
      order.sellerProposal?.acceptedAt
      || Number(order.payment?.amountPaid) > 0
      || ["Confirmed", "Preparing", "Ready for Pickup", "Ready for Delivery", "Shipped Out", "Completed"]
        .includes(normalizeOrderStatus(order.status))
    ))
  );
  const fulfillmentType = order => order.fulfil === "Pickup" || order.fulfil === "Delivery"
    ? order.fulfil
    : "Not specified";
  const getStages = order => order.fulfil === "Delivery" ? deliveryStages : orderStages;

  function matchesFilter(order, filter) {
    const orderStatus = normalizeOrderStatus(order.status);
    const paymentStatus = formatPaymentStatus(order);
    if (!filter || filter === "all") return true;
    if (filter === "to-verify") return paymentStatus === "Pending Verification";
    if (filter === "to-prepare") {
      return paymentStatus === "Fully Paid" && ["To Pay", "Preparing"].includes(orderStatus);
    }
    if (filter === "to-ship") {
      return ["Ready for Pickup", "Ready for Delivery", "Shipped Out"].includes(orderStatus);
    }
    if (filter === "completed") return orderStatus === "Completed";
    if (filter === "cancelled") return orderStatus === "Cancelled";
    if (filter === "payment-unpaid") return paymentStatus === "Unpaid";
    return orderStatus.toLowerCase() === filter.replace(/-/g, " ").toLowerCase();
  }

  function renderOrderList() {
    const list = document.getElementById("orderList");
    if (!list) return;

    const search = document.getElementById("orderSearch");
    const filters = document.getElementById("orderFilters");
    const activeFilter = filters?.querySelector("button.active")?.dataset.filter || "all";
    const term = (search?.value || "").trim().toLowerCase();
    const allOrders = getOrders();
    const orders = allOrders.filter(order => {
      const searchable = [
        order.reference,
        order.customerName || order.contactName,
        order.customerEmail || order.contactEmail,
        order.style,
        order.fulfil
      ].join(" ").toLowerCase();
      return matchesFilter(order, activeFilter) && (!term || searchable.includes(term));
    });

    if (!orders.length) {
      list.innerHTML = `<p class="figma-muted order-empty">${allOrders.length
        ? "No orders match this filter."
        : "No customer orders yet. New customer orders will appear here."}</p>`;
      return;
    }

    list.innerHTML = `
      <div class="admin-orders-table-wrap">
        <table class="admin-orders-table">
          <thead><tr><th scope="col">Order ID</th><th scope="col">Customer</th><th scope="col">Product</th><th scope="col">Payment</th><th scope="col">Order Status</th><th scope="col">Actions</th></tr></thead>
          <tbody>${orders.map(order => {
            const detailsUrl = `order-details.html?order=${encodeURIComponent(order.reference)}`;
            return `<tr>
              <td data-label="Order ID"><a class="admin-order-id-link" href="${detailsUrl}">${escapeHtml(order.reference || "—")}</a></td>
              <td data-label="Customer">${escapeHtml(order.customerName || order.contactName || "Customer")}</td>
              <td data-label="Product">${escapeHtml(order.style || (isCustomizationOrder(order) ? "Custom Order" : "Order"))}</td>
              <td data-label="Payment">${escapeHtml(formatPaymentStatus(order))}</td>
              <td data-label="Order Status">${escapeHtml(normalizeOrderStatus(order.status))}</td>
              <td data-label="Actions"><a class="admin-order-id-link" href="${detailsUrl}">View Details</a></td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>`;
  }

  function proofMarkup(proof) {
    if (!proof) return `<p class="admin-payment-no-proof">No payment proof has been submitted.</p>`;
    const proofUrl = typeof proof.dataUrl === "string" ? proof.dataUrl : "";
    const proofName = escapeHtml(proof.fileName || "Payment proof");
    let preview = `<p class="admin-payment-no-proof">Preview unavailable for this legacy file entry.</p>`;
    if (proofUrl && /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(proofUrl)) {
      preview = `<img class="admin-payment-proof-image" src="${escapeHtml(proofUrl)}" alt="Customer payment proof">`;
    } else if (proofUrl && /^data:application\/pdf;base64,/i.test(proofUrl)) {
      preview = `<a class="admin-payment-proof-link" href="${escapeHtml(proofUrl)}" target="_blank" rel="noopener">Open ${proofName}</a>`;
    }
    return `<div class="admin-payment-proof">${preview}
      <dl><dt>File</dt><dd>${proofName}</dd>
      <dt>Submitted</dt><dd>${escapeHtml(proof.submittedAt ? new Date(proof.submittedAt).toLocaleString() : "Date unavailable")}</dd>
      <dt>Reference number</dt><dd>${escapeHtml(proof.referenceNumber || "Not provided")}</dd>
      <dt>Submitted amount</dt><dd>${escapeHtml(formatAmount(proof.amount))}</dd></dl>
    </div>`;
  }

  function customizationReferenceMarkup(order) {
    const referenceImage = order.referenceImage;
    const fileName = referenceImage && typeof referenceImage.fileName === "string"
      ? referenceImage.fileName
      : "";
    const dataUrl = referenceImage && typeof referenceImage.dataUrl === "string"
      ? referenceImage.dataUrl
      : "";
    if (dataUrl && /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(dataUrl)) {
      return `<div class="admin-customization-reference">
        <strong>Customer Reference Image</strong>
        <a href="${escapeHtml(dataUrl)}" target="_blank" rel="noopener">
          <img src="${escapeHtml(dataUrl)}" alt="Customer's customization reference image">
        </a>
        <span>${escapeHtml(fileName || "Reference image")}</span>
      </div>`;
    }

    const legacyName = fileName
      || String(order.notes || "").match(/(?:^|\n)Reference image:\s*([^\n]+)/i)?.[1]
      || "";
    return `<div class="admin-customization-reference">
      <strong>Customer Reference Image</strong>
      <p>${legacyName
        ? `${escapeHtml(legacyName)} · Preview is unavailable for this older request.`
        : "No reference image was attached."}</p>
    </div>`;
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

    const payment = paymentSummary(order);
    const proof = payment.proof;
    const status = normalizeOrderStatus(order.status);
    const isCustomized = isCustomizationOrder(order);
    const customizationConfirmed = hasCustomizationConfirmation(order);
    const customizationAccepted = hasCustomizationAcceptance(order);
    const awaitingCustomerAcceptance = isCustomized
      && customizationConfirmed
      && !customizationAccepted
      && !order.customizationVoidedAt;
    const paymentStarted = payment.amountPaid > 0 || Boolean(payment.proof);
    const customizationLocked = customizationConfirmed && paymentStarted;
    const fulfillment = fulfillmentType(order);
    const fulfillmentMissing = fulfillment === "Not specified";
    const stages = getStages(order);
    const options = [...stages];
    options.push("Cancelled");

    root.innerHTML = `
      <div class="admin-order-detail-heading">
        <div><span class="admin-order-eyebrow">Order Details</span><h2>${escapeHtml(order.reference)}</h2>
          <p>${escapeHtml(order.customerName || order.contactName || "Customer")} · ${escapeHtml(order.style || "Order")}</p></div>
        <a class="admin-order-back" href="orders.html">Back to Orders</a>
      </div>
      <div class="admin-order-detail-grid">
        <section class="admin-order-section" aria-labelledby="order-information-title">
          <div class="admin-order-section-heading"><div><span>01</span><h2 id="order-information-title">Order Information</h2></div></div>
          <div class="admin-order-product">
            <img src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(order.style || "Order")}">
            <div><strong>${escapeHtml(order.style || "Order")}</strong><span>${escapeHtml(order.type || "Customer Order")}</span></div>
          </div>
          ${isCustomized ? `
            <form id="customizationConfirmationForm" class="admin-order-form admin-customization-confirmation">
              <h3>Seller Confirmation</h3>
              <p class="admin-customization-status">${customizationConfirmed
                ? awaitingCustomerAcceptance
                  ? "Customized order offer sent. Waiting for the customer to accept or void it."
                  : "Customized order accepted. The customer can submit payment."
                : "Review and edit the customized order, then confirm the final price before the customer can pay."}</p>
              ${customizationReferenceMarkup(order)}
              ${!customizationConfirmed && Number(order.amount) > 0
                ? `<p class="admin-customization-budget">Customer budget: ${escapeHtml(formatAmount(order.amount))}</p>`
                : ""}
              <label>Product / design<input class="figma-input" name="style" type="text" maxlength="160" value="${escapeHtml(order.style || "")}" required${customizationLocked ? " disabled" : ""}></label>
              <label>Size / variant<input class="figma-input" name="size" type="text" maxlength="120" value="${escapeHtml(order.size || "")}"${customizationLocked ? " disabled" : ""}></label>
              <label>Quantity<input class="figma-input" name="qty" type="number" min="1" step="1" value="${escapeHtml(order.qty || 1)}" required${customizationLocked ? " disabled" : ""}></label>
              <label>Color<input class="figma-input" name="colors" type="text" maxlength="160" value="${escapeHtml(order.colors || "")}"${customizationLocked ? " disabled" : ""}></label>
              <label>Add-ons<input class="figma-input" name="addons" type="text" maxlength="300" value="${escapeHtml(order.addons || "")}"${customizationLocked ? " disabled" : ""}></label>
              <label>Customization details<textarea class="figma-textarea" name="notes" maxlength="2000"${customizationLocked ? " disabled" : ""}>${escapeHtml(order.notes || "")}</textarea></label>
              <label>Final price<input class="figma-input" name="finalPrice" type="number" min="0.01" step="0.01" value="${customizationConfirmed ? payment.total : ""}" required${customizationLocked ? " disabled" : ""}></label>
              <button class="figma-btn" type="submit"${customizationLocked ? " disabled" : ""}>${customizationConfirmed ? "Save Customized Order" : "Confirm Customized Order & Set Price"}</button>
              ${customizationLocked ? '<p class="admin-customization-locked">Customization details are locked because payment has been submitted.</p>' : ""}
            </form>` : ""}
          <dl class="admin-order-summary">
            <dt>Order ID</dt><dd>${escapeHtml(order.reference)}</dd>
            <dt>Order Date</dt><dd>${escapeHtml(formatOrderDate(order.createdAt))}</dd>
            <dt>Order Type</dt><dd>${escapeHtml(fulfillment)}</dd>
            <dt>Product Details</dt><dd>${escapeHtml([order.size, `Qty ${order.qty || 1}`, order.colors].filter(Boolean).join(" · ") || "Not specified")}</dd>
            <dt>Customization</dt><dd>${escapeHtml([order.addons, order.notes].filter(Boolean).join(" · ") || "None")}</dd>
            <dt>Delivery Address</dt><dd>${escapeHtml(order.fulfil === "Delivery" ? order.address || "Not provided" : "Not applicable")}</dd>
            <dt>Estimated Preparation</dt><dd>${escapeHtml(order.preparationTime || "To be confirmed")}</dd>
          </dl>
          ${fulfillmentMissing
            ? `<p class="admin-order-type-error" role="alert">Select Pickup or Delivery before updating order status.</p>`
            : ""}
          <label class="admin-order-form admin-order-type-control">
            Fulfillment
            <select class="figma-select" id="orderFulfillment" required aria-invalid="${fulfillmentMissing}">
              <option value=""${fulfillmentMissing ? " selected" : ""} disabled>Select Pickup or Delivery</option>
              <option value="Pickup"${order.fulfil === "Pickup" ? " selected" : ""}>Pickup</option>
              <option value="Delivery"${order.fulfil === "Delivery" ? " selected" : ""}>Delivery</option>
            </select>
          </label>
        </section>
        <section class="admin-order-section" aria-labelledby="payment-section-title">
          <div class="admin-order-section-heading"><div><span>02</span><h2 id="payment-section-title">Payment Verification</h2></div>
            <strong class="admin-order-badge payment-${slug(payment.status)}">${escapeHtml(payment.status)}</strong></div>
          <dl class="admin-order-summary">
            <dt>Total Price</dt><dd>${escapeHtml(isCustomized && !customizationConfirmed ? "Awaiting seller confirmation" : payment.total > 0 ? formatAmount(payment.total) : "To be discussed")}</dd>
            <dt>Amount Paid</dt><dd>${escapeHtml(formatAmount(payment.amountPaid))}</dd>
            <dt>Payment Status</dt><dd>${escapeHtml(payment.status)}</dd>
          </dl>
          <div class="admin-proof-review">
            <h3>Customer Payment Proof</h3>
            ${proofMarkup(proof)}
            ${proof ? `<p class="admin-payment-method">Payment method: ${escapeHtml(proof.method || payment.method || "Not provided")}</p>` : ""}
            ${payment.status === "Pending Verification" && proof
              ? `<div class="admin-payment-review-actions">
                  <button class="figma-btn" id="verifyPayment" type="button"${isCustomized && !customizationConfirmed ? " disabled" : ""}>Verify</button>
                  <button class="figma-btn secondary" id="rejectPayment" type="button">Reject</button>
                </div>`
              : ""}
            ${isCustomized && !customizationConfirmed && payment.status === "Pending Verification"
              ? `<p class="admin-customization-locked">Confirm the customized order and final price before verifying this payment.</p>`
              : ""}
          </div>
        </section>
        <section class="admin-order-section" id="order-progress" aria-labelledby="order-progress-title">
          <div class="admin-order-section-heading"><div><span>03</span><h2 id="order-progress-title">Order Status</h2></div>
            <strong class="admin-order-badge order-${slug(status)}">${escapeHtml(status)}</strong></div>
          <label class="admin-order-form admin-status-control">Order status
              <select class="figma-select" id="orderStatus" name="status">
                ${options.map(stage => `<option value="${escapeHtml(stage)}"${stage === status ? " selected" : ""}>${escapeHtml(stage)}</option>`).join("")}
              </select>
          </label>
        </section>
      </div>
      <p class="admin-order-feedback" id="orderAdminFeedback" role="status" aria-live="polite"></p>`;

    function persistOrder(message) {
      try {
        store.update(order);
        renderOrderList();
        renderDashboard();
        renderOrderDetails();
        const refreshedFeedback = document.getElementById("orderAdminFeedback");
        if (refreshedFeedback) {
          refreshedFeedback.textContent = message;
          refreshedFeedback.dataset.error = "false";
        }
      } catch (error) {
        console.error("Unable to update the customer order from the admin portal.", error);
        const feedback = document.getElementById("orderAdminFeedback");
        if (feedback) {
          feedback.textContent = "Unable to save the order update. Please try again.";
          feedback.dataset.error = "true";
        }
      }
    }

    document.getElementById("customizationConfirmationForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const finalPrice = Number(form.elements.finalPrice.value);
      const quantity = Number(form.elements.qty.value);
      if (!form.reportValidity() || !Number.isFinite(finalPrice) || finalPrice <= 0
        || !Number.isInteger(quantity) || quantity < 1) {
        return;
      }
      if (customizationLocked) {
        const feedback = document.getElementById("orderAdminFeedback");
        feedback.textContent = "Customized order details are locked after payment has been submitted.";
        feedback.dataset.error = "true";
        return;
      }

      order.style = form.elements.style.value.trim();
      order.size = form.elements.size.value.trim();
      order.qty = quantity;
      order.colors = form.elements.colors.value.trim();
      order.addons = form.elements.addons.value.trim();
      order.notes = form.elements.notes.value.trim();
      order.amount = finalPrice;
      order.payment = { ...(order.payment || {}), total: finalPrice };
      order.customizationConfirmedAt = new Date().toISOString();
      delete order.customizationAcceptedAt;
      delete order.customizationVoidedAt;
      order.status = "Awaiting Customer";
      persistOrder("Customized order details and final price confirmed.");
    });

    document.getElementById("verifyPayment")?.addEventListener("click", () => {
      const currentPayment = paymentSummary(order);
      const submittedAmount = Number(currentPayment.proof?.amount);
      const validProof = (!isCustomized || (hasCustomizationConfirmation(order) && hasCustomizationAcceptance(order)))
        && currentPayment.status === "Pending Verification"
        && currentPayment.proof
        && Number.isFinite(submittedAmount)
        && submittedAmount > 0
        && Math.abs(submittedAmount - currentPayment.remainingBalance) < 0.01
        && currentPayment.total > 0;
      if (!validProof) {
        const feedback = document.getElementById("orderAdminFeedback");
        feedback.textContent = "There is no valid payment proof awaiting verification.";
        feedback.dataset.error = "true";
        return;
      }
      order.payment = {
        ...(order.payment || {}),
        amountPaid: currentPayment.total,
        status: "Fully Paid",
        proof: { ...currentPayment.proof, verifiedAt: new Date().toISOString(), rejectionReason: "" }
      };
      order.status = "To Pay";
      persistOrder("Payment verified.");
    });

    document.getElementById("rejectPayment")?.addEventListener("click", () => {
      if (paymentSummary(order).status !== "Pending Verification" || !payment.proof) return;
      order.payment = {
        ...(order.payment || {}),
        status: "Rejected",
        proof: { ...payment.proof, rejectedAt: new Date().toISOString() }
      };
      persistOrder("Payment proof rejected.");
    });

    const statusSelect = document.getElementById("orderStatus");
    statusSelect.addEventListener("change", () => {
      const nextStatus = statusSelect.value;
      const currentStatus = normalizeOrderStatus(order.status);
      const currentStages = getStages(order);
      const nextIndex = stages.indexOf(nextStatus);
      const currentIndex = currentStages.indexOf(currentStatus);
      const feedback = document.getElementById("orderAdminFeedback");
      const isCancelled = nextStatus === "Cancelled";
      const rejectStatusUpdate = message => {
        feedback.textContent = message;
        feedback.dataset.error = "true";
        statusSelect.value = currentStatus;
      };

      if (!["Pickup", "Delivery"].includes(order.fulfil) && !isCancelled) {
        rejectStatusUpdate("Select Pickup or Delivery as the order type before updating the order status.");
        return;
      }
      if (isCustomized && !hasCustomizationConfirmation(order) && !isCancelled && nextIndex > 0) {
        rejectStatusUpdate("Confirm the customized order details and final price before progressing the order.");
        return;
      }
      if (isCustomized && hasCustomizationConfirmation(order) && !hasCustomizationAcceptance(order)
        && !isCancelled && nextStatus !== "To Pay") {
        rejectStatusUpdate("Wait for the customer to accept the customized order before progressing it.");
        return;
      }
      if (!isCancelled && nextIndex < 0) {
        rejectStatusUpdate("Choose a status that matches the order's fulfillment method.");
        return;
      }
      const paymentState = paymentSummary(order);
      if (!isCancelled && nextIndex > 0 && paymentState.status !== "Fully Paid") {
        rejectStatusUpdate("Verify the full payment before preparing this order.");
        return;
      }
      if (
        !isCancelled
        && nextStatus !== currentStatus
        && currentIndex >= 0
        && nextIndex > currentIndex + 1
      ) {
        rejectStatusUpdate("Move the order through each status in sequence.");
        return;
      }
      if (nextStatus === "Completed" && paymentSummary(order).status !== "Fully Paid") {
        rejectStatusUpdate("Verify full payment before completing this order.");
        return;
      }
      order.status = nextStatus;
      order.statusUpdatedAt = new Date().toISOString();
      persistOrder("Order status updated.");
    });

    document.getElementById("orderFulfillment").addEventListener("change", event => {
      const nextFulfillment = event.currentTarget.value;
      if (!["Pickup", "Delivery"].includes(nextFulfillment)) {
        event.currentTarget.setAttribute("aria-invalid", "true");
        const feedback = document.getElementById("orderAdminFeedback");
        feedback.textContent = "Choose Pickup or Delivery as the order type.";
        feedback.dataset.error = "true";
        return;
      }
      order.fulfil = nextFulfillment;
      order.fulfilmentUpdatedAt = new Date().toISOString();
      persistOrder("Order type saved.");
    });

  }

  function renderLegacyOrderDetails() {
    const root = document.getElementById("adminOrderDetails");
    if (!root) return;

    const reference = new URLSearchParams(window.location.search).get("order");
    const order = getOrders().find(item => item.reference === reference);
    if (!order) {
      root.innerHTML = `<p class="figma-muted order-empty">Order not found. <a href="orders.html">Return to orders</a>.</p>`;
      return;
    }

    const payment = paymentSummary(order);
    const proof = payment.proof;
    const status = normalizeOrderStatus(order.status);
    const stages = getStages(order);
    const selectedStatus = stages.includes(status) || status === "Cancelled" ? status : "Pending";
    const proposal = order.sellerProposal;
    const fulfillment = order.fulfil === "Delivery" ? "Delivery" : "Pickup";

    root.innerHTML = `
      <div class="admin-order-detail-heading">
        <div><span class="admin-order-eyebrow">Order Details</span><h2>${escapeHtml(order.reference)}</h2>
          <p>${escapeHtml(order.customerName || order.contactName || "Customer")} · ${escapeHtml(order.style || "Order")}</p></div>
        <a class="admin-order-back" href="orders.html">Back to Orders</a>
      </div>
      <div class="admin-order-detail-grid">
        <section class="admin-order-section" aria-labelledby="payment-section-title">
          <div class="admin-order-section-heading"><div><span>01</span><h2 id="payment-section-title">Payment Information</h2></div>
            <strong class="admin-order-badge payment-${slug(payment.status)}">${escapeHtml(payment.status)}</strong></div>
          <dl class="admin-order-summary">
            <dt>Payment method</dt><dd>${escapeHtml(payment.proof?.method || payment.method || "Not submitted")}</dd>
            <dt>Total amount</dt><dd>${escapeHtml(payment.total > 0 ? formatAmount(payment.total) : "To be discussed")}</dd>
            <dt>Required down payment</dt><dd>${escapeHtml(formatAmount(payment.requiredDownPayment))}</dd>
            <dt>Amount paid</dt><dd>${escapeHtml(formatAmount(payment.amountPaid))}</dd>
            <dt>Remaining balance</dt><dd>${escapeHtml(formatAmount(payment.remainingBalance))}</dd>
            <dt>Cash arrangement</dt><dd>${escapeHtml(payment.arrangement)}</dd>
            <dt>Cash received</dt><dd>${payment.cashReceipt
              ? `${escapeHtml(formatAmount(payment.cashReceipt.amount))} · ${escapeHtml(new Date(payment.cashReceipt.receivedAt).toLocaleString())}`
              : "Not recorded"}</dd>
          </dl>
          ${isCashArrangement(order) && payment.remainingBalance > 0 && status !== "Cancelled"
            ? `<div class="admin-cash-receipt">
                <p>Cash due at ${order.fulfil === "Pickup" ? "pickup" : "delivery"}: <strong>${escapeHtml(formatAmount(payment.remainingBalance))}</strong></p>
                <button class="figma-btn secondary" id="recordCashReceived" type="button">Record Cash Received</button>
              </div>`
            : ""}
          <form id="paymentSettingsForm" class="admin-order-form admin-payment-settings">
            <h3>Payment terms</h3>
            <label>Total amount<input class="figma-input" name="total" type="number" min="0" step="0.01" value="${payment.total}" required></label>
            <label>Required down payment<input class="figma-input" name="requiredDownPayment" type="number" min="0" step="0.01" value="${payment.requiredDownPayment}" required></label>
            <label>Authorized payment arrangement<select class="figma-select" name="arrangement">
              <option value="Standard"${payment.arrangement === "Standard" ? " selected" : ""}>Standard — payment before completion</option>
              <option value="Cash on Pickup"${payment.arrangement === "Cash on Pickup" ? " selected" : ""}>Cash on Pickup</option>
              <option value="Cash on Delivery"${payment.arrangement === "Cash on Delivery" ? " selected" : ""}>Cash on Delivery</option>
            </select></label>
            <button class="figma-btn secondary" type="submit">Save Payment Terms</button>
          </form>
          <div class="admin-proof-review"><h3>Customer Payment Proof</h3>${proofMarkup(proof)}
            ${proof?.rejectionReason ? `<p class="admin-payment-rejection"><strong>Rejection reason:</strong> ${escapeHtml(proof.rejectionReason)}</p>` : ""}
            <div class="admin-payment-review-actions">
              <button class="figma-btn" id="verifyPayment" type="button"${payment.status !== "Pending Verification" || !proof ? " disabled" : ""}>Verify Payment</button>
              <button class="figma-btn secondary" id="showRejectPayment" type="button"${payment.status !== "Pending Verification" || !proof ? " disabled" : ""}>Reject Payment</button>
            </div>
            <form id="rejectPaymentForm" class="admin-order-form" hidden>
              <label>Reason for rejection<textarea class="figma-textarea" name="reason" required maxlength="500"></textarea></label>
              <button class="figma-btn secondary" type="submit">Save Rejection</button>
            </form>
          </div>
        </section>
        <section class="admin-order-section" id="order-progress" aria-labelledby="order-progress-title">
          <div class="admin-order-section-heading"><div><span>02</span><h2 id="order-progress-title">Order Progress</h2></div>
            <strong class="admin-order-badge order-${slug(status)}">${escapeHtml(status)}</strong></div>
          <div class="admin-order-product">
            <img src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(order.style || "Order")}">
            <div><strong>${escapeHtml(order.style || "Order")}</strong><span>${escapeHtml(order.type || "Customer Order")}</span></div>
          </div>
          <dl class="admin-order-summary">
            <dt>Product details</dt><dd>${escapeHtml([order.size, `Qty ${order.qty || 1}`, order.colors].filter(Boolean).join(" · ") || "Not specified")}</dd>
            <dt>Customization requests</dt><dd>${escapeHtml([order.addons, order.notes].filter(Boolean).join(" · ") || "None")}</dd>
            <dt>Pickup or delivery</dt><dd>${escapeHtml(fulfillment)}${order.address && fulfillment === "Delivery" ? ` · ${escapeHtml(order.address)}` : ""}</dd>
            <dt>Preferred date</dt><dd>${escapeHtml(order.date || "Not specified")}</dd>
            <dt>Estimated preparation</dt><dd>${escapeHtml(order.preparationTime || "To be confirmed")}</dd>
          </dl>
          ${proposal ? `<div class="admin-seller-proposal"><strong>Seller suggestion</strong><p>${escapeHtml(proposal.notes || "")}</p><span>Customer response: ${proposal.acceptedAt ? "Accepted" : proposal.declinedAt ? "Declined" : "Awaiting response"}</span></div>` : ""}
          <form id="orderProgressForm" class="admin-order-form">
            <label>Fulfillment type<select class="figma-select" name="fulfil">
              <option value="Pickup"${fulfillment === "Pickup" ? " selected" : ""}>Pickup</option>
              <option value="Delivery"${fulfillment === "Delivery" ? " selected" : ""}>Delivery</option>
            </select></label>
            <label>Estimated preparation time<input class="figma-input" name="preparationTime" type="text" maxlength="100" value="${escapeHtml(order.preparationTime || "")}" placeholder="e.g. 2–3 days"></label>
            <label>Order status<select class="figma-select" name="status">
              ${[...new Set([...orderStages, ...deliveryStages, "Cancelled"])].map(stage => `<option value="${escapeHtml(stage)}"${stage === selectedStatus ? " selected" : ""}>${escapeHtml(stage)}</option>`).join("")}
            </select></label>
            <button class="figma-btn" type="submit">Update Order Progress</button>
          </form>
          <div class="seller-proposal-current"><h3>Seller response</h3>
            <p>${escapeHtml(proposal?.notes || "No suggestion has been sent.")}</p>
            ${proposal?.amount ? `<p>Suggested total: ${formatAmount(proposal.amount)}</p>` : ""}
          </div>
          <form id="sellerProposalForm" class="admin-order-form seller-proposal-form">
            <h3>Suggest a change to the customer</h3>
            <label>Suggestion<textarea name="notes" class="figma-textarea" required maxlength="1000">${escapeHtml(proposal?.notes || "")}</textarea></label>
            <label>Suggested total price (optional)<input name="amount" class="figma-input" type="number" min="0" step="0.01" value="${proposal?.amount ? escapeHtml(proposal.amount) : ""}"></label>
            <button class="figma-btn secondary" type="submit">Send Suggestion</button>
          </form>
        </section>
      </div>
      <p id="orderAdminFeedback" class="admin-order-feedback" role="status" aria-live="polite"></p>`;

    const feedback = document.getElementById("orderAdminFeedback");
    const persistOrder = message => {
      try {
        store.update(order);
        renderOrderList();
        renderDashboard();
        renderOrderDetails();
        const refreshedFeedback = document.getElementById("orderAdminFeedback");
        refreshedFeedback.textContent = message;
        refreshedFeedback.dataset.error = "false";
      } catch (error) {
        console.error("Unable to update the customer order from the admin portal.", error);
        feedback.textContent = "Unable to save the order update. Please try again.";
        feedback.dataset.error = "true";
      }
    };

    document.getElementById("paymentSettingsForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const total = Number(form.elements.total.value);
      const requiredDownPayment = Number(form.elements.requiredDownPayment.value);
      if (!Number.isFinite(total) || total < 0 || !Number.isFinite(requiredDownPayment)
        || requiredDownPayment < 0 || requiredDownPayment > total) {
        feedback.textContent = "Enter a valid total and a down payment between zero and the total.";
        feedback.dataset.error = "true";
        return;
      }
      order.amount = total;
      order.payment = {
        ...(order.payment || {}),
        total,
        requiredDownPayment,
        arrangement: form.elements.arrangement.value
      };
      persistOrder("Payment terms saved.");
    });

    document.getElementById("verifyPayment").addEventListener("click", () => {
      const currentPayment = paymentSummary(order);
      const submittedAmount = Number(currentPayment.proof?.amount);
      if (currentPayment.status !== "Pending Verification" || !currentPayment.proof || !Number.isFinite(submittedAmount)
        || submittedAmount <= 0 || submittedAmount > currentPayment.remainingBalance || currentPayment.total <= 0) {
        feedback.textContent = "There is no valid payment proof awaiting verification.";
        feedback.dataset.error = "true";
        return;
      }
      const updatedAmountPaid = currentPayment.amountPaid + submittedAmount;
      if (updatedAmountPaid < currentPayment.requiredDownPayment && updatedAmountPaid < currentPayment.total) {
        feedback.textContent = "The verified amount would not meet the required down payment. Reject the proof with a reason or update the payment terms.";
        feedback.dataset.error = "true";
        return;
      }
      order.payment = {
        ...(order.payment || {}),
        amountPaid: updatedAmountPaid,
        status: currentPayment.total > 0 && updatedAmountPaid >= currentPayment.total
          ? "Fully Paid"
          : "Verified (Down Payment)",
        proof: { ...currentPayment.proof, verifiedAt: new Date().toISOString(), rejectionReason: "" }
      };
      persistOrder("Payment verified and recorded. Order progress was not changed.");
    });

    document.getElementById("recordCashReceived")?.addEventListener("click", () => {
      const currentPayment = paymentSummary(order);
      const matchesArrangement = isCashArrangement(order);
      if (!matchesArrangement || currentPayment.remainingBalance <= 0 || currentPayment.status === "Fully Paid") {
        feedback.textContent = "There is no outstanding cash balance for this authorized arrangement.";
        feedback.dataset.error = "true";
        return;
      }
      if (!window.confirm(`Record ${formatAmount(currentPayment.remainingBalance)} cash received for this order?`)) return;

      const receivedAt = new Date().toISOString();
      order.payment = {
        ...(order.payment || {}),
        amountPaid: currentPayment.total,
        status: "Fully Paid",
        cashReceipt: {
          amount: currentPayment.remainingBalance,
          receivedAt
        }
      };
      persistOrder("Cash payment recorded. Order progress was not changed.");
    });

    document.getElementById("showRejectPayment").addEventListener("click", () => {
      document.getElementById("rejectPaymentForm").hidden = false;
      document.querySelector("#rejectPaymentForm [name=reason]").focus();
    });
    document.getElementById("rejectPaymentForm").addEventListener("submit", event => {
      event.preventDefault();
      const reason = event.currentTarget.elements.reason.value.trim();
      if (!reason) return;
      order.payment = {
        ...(order.payment || {}),
        status: "Rejected",
        proof: { ...payment.proof, rejectionReason: reason, rejectedAt: new Date().toISOString() }
      };
      persistOrder("Payment proof rejected. The order status was not changed.");
    });

    document.getElementById("orderProgressForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const nextFulfillment = form.elements.fulfil.value;
      const nextStatus = form.elements.status.value;
      const nextStages = nextFulfillment === "Delivery" ? deliveryStages : orderStages;
      const currentStatus = normalizeOrderStatus(order.status);
      const currentStages = getStages(order);
      const currentIndex = currentStages.indexOf(currentStatus);
      const nextIndex = nextStages.indexOf(nextStatus);
      const paymentInfo = paymentSummary(order);
      const cashArrangement = (order.payment?.arrangement === "Cash on Pickup" && nextFulfillment === "Pickup")
        || (order.payment?.arrangement === "Cash on Delivery" && nextFulfillment === "Delivery");
      const paymentIsVerified = ["Verified (Down Payment)", "Fully Paid"].includes(paymentInfo.status);
      if (nextStatus !== "Cancelled" && nextIndex > 0 && !paymentIsVerified && !cashArrangement) {
        feedback.textContent = "Verify the required down payment before confirming or preparing this order, or authorize a matching cash-at-pickup/delivery arrangement.";
        feedback.dataset.error = "true";
        return;
      }
      if (nextStatus !== "Cancelled" && nextIndex < 0) {
        feedback.textContent = "Choose an order stage that matches the selected pickup or delivery method.";
        feedback.dataset.error = "true";
        return;
      }
      if (nextFulfillment !== order.fulfil
        && !["Pending", "Confirmed", "Preparing", "Cancelled"].includes(currentStatus)) {
        feedback.textContent = "Pickup or delivery cannot be changed after the order is ready.";
        feedback.dataset.error = "true";
        return;
      }
      if (nextStatus !== "Cancelled" && nextStatus !== currentStatus
        && currentStatus !== "Cancelled" && currentIndex >= 0 && nextIndex > currentIndex + 1) {
        feedback.textContent = "Move the order through each preparation stage in sequence.";
        feedback.dataset.error = "true";
        return;
      }
      if (nextStatus === "Completed" && paymentInfo.status !== "Fully Paid" && !cashArrangement) {
        feedback.textContent = "This order cannot be completed until the remaining balance is paid, unless a matching cash arrangement is authorized.";
        feedback.dataset.error = "true";
        return;
      }
      order.fulfil = nextFulfillment;
      order.preparationTime = form.elements.preparationTime.value.trim() || "To be confirmed";
      order.status = nextStatus;
      order.statusUpdatedAt = new Date().toISOString();
      persistOrder("Order progress updated.");
    });

    document.getElementById("sellerProposalForm").addEventListener("submit", event => {
      event.preventDefault();
      const notes = event.currentTarget.elements.notes.value.trim();
      const amountValue = event.currentTarget.elements.amount.value;
      if (!notes) return;
      order.sellerProposal = {
        notes,
        amount: amountValue === "" ? null : Number(amountValue),
        updatedAt: new Date().toISOString(),
        acceptedAt: proposal?.acceptedAt || "",
        declinedAt: proposal?.declinedAt || ""
      };
      persistOrder("Suggestion sent. Order progress remains under admin control.");
    });
  }

  function renderDashboard() {
    const recentOrders = document.getElementById("recentOrders");
    const orders = getOrders();
    const normalized = orders.map(order => ({ order, status: normalizeOrderStatus(order.status) }));
    const pendingCount = normalized.filter(item => ["Pending", "Awaiting Customer"].includes(item.status)).length;
    const verificationCount = orders.filter(order => formatPaymentStatus(order) === "Pending Verification").length;
    const preparingCount = normalized.filter(item => item.status === "Preparing").length;
    const readyCount = normalized.filter(item => ["Ready for Pickup", "Shipped Out"].includes(item.status)).length;
    const revenue = orders
      .filter(order => !["Pending", "Cancelled"].includes(normalizeOrderStatus(order.status)))
      .reduce((total, order) => total + paymentSummary(order).amountPaid, 0);
    const metrics = {
      pendingOrderCount: pendingCount,
      paymentsAwaitingVerificationCount: verificationCount,
      ordersInPreparationCount: preparingCount,
      readyOrdersCount: readyCount,
      orderRevenue: `₱${revenue.toLocaleString("en-PH")}`
    };
    Object.entries(metrics).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value);
    });

    const inquiryMetric = document.getElementById("newInquiryCount");
    const inquiryStore = window.floraAvenueInquiryStore;
    if (inquiryMetric && inquiryStore) {
      inquiryMetric.textContent = String(inquiryStore.load().filter(inquiry => !inquiry.response).length);
    }
    if (!recentOrders) return;

    const rows = orders.length
      ? orders.slice(0, 5).map(order => `
        <tr>
          <td>${escapeHtml(order.reference || "—")}</td>
          <td>${escapeHtml(order.customerName || order.contactName || order.customerEmail || "Customer")}</td>
          <td>${escapeHtml(order.style || "Order")}</td>
          <td>${escapeHtml(formatOrderDate(order.createdAt))}</td>
          <td><span class="pro-badge">${escapeHtml(normalizeOrderStatus(order.status))}</span></td>
          <td>${escapeHtml(isCustomizationOrder(order) && !hasCustomizationConfirmation(order)
            ? "Awaiting seller confirmation"
            : formatAmount(order.amount))}</td>
          <td><a class="pro-order-view" href="order-details.html?order=${encodeURIComponent(order.reference)}">View</a></td>
        </tr>`).join("")
      : `<tr><td class="pro-orders-empty" colspan="7">
          <svg class="pro-orders-empty-icon" aria-hidden="true" viewBox="0 0 48 48" fill="none">
            <path d="m6 14 18-9 18 9v20l-18 9-18-9V14Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="m6 14 18 9 18-9M24 23v20M15 9l18 9v9" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
          </svg>
          <strong>No customer orders yet.</strong>
          <span>Orders will appear here once customers place an order.</span>
        </td></tr>`;
    recentOrders.innerHTML = `<div class="pro-orders-table-wrap"><table class="pro-orders-table">
      <thead><tr><th scope="col">Order ID</th><th scope="col">Customer</th><th scope="col">Product</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Amount</th><th scope="col">Actions</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function initializeFilters() {
    const filters = document.getElementById("orderFilters");
    if (!filters) return;
    const requestedFilter = new URLSearchParams(window.location.search).get("filter") || "all";
    const initialButton = filters.querySelector(`[data-filter="${CSS.escape(requestedFilter)}"]`) || filters.querySelector('[data-filter="all"]');
    filters.querySelectorAll("button").forEach(button => button.classList.toggle("active", button === initialButton));
    filters.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        renderOrderList();
      });
    });
  }

  initializeFilters();
  renderOrderList();
  renderOrderDetails();
  renderDashboard();

  document.getElementById("orderSearch")?.addEventListener("input", renderOrderList);
  window.addEventListener("storage", event => {
    if (event.key === "floraAvenueOrders") {
      renderOrderList();
      renderDashboard();
      renderOrderDetails();
    } else if (event.key === "floraAvenueInquiries") {
      renderDashboard();
    }
  });
  window.addEventListener("floraAvenueOrdersChanged", () => {
    renderOrderList();
    renderDashboard();
    renderOrderDetails();
  });
  window.addEventListener("floraAvenueInquiriesChanged", renderDashboard);

  if (window.location.hash === "#order-progress") {
    window.setTimeout(() => document.getElementById("order-progress")?.scrollIntoView(), 0);
  }
})();
