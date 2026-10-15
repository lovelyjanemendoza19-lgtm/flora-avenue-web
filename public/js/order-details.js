(function () {
  const customerOrderStore = window.floraAvenueCustomerOrders;
  const orderReference = new URLSearchParams(location.search).get("order");
  const root = document.getElementById("details");
  const maxProofBytes = 2 * 1024 * 1024;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
  const formatAmount = value => `₱${Number(value || 0).toLocaleString("en-PH")}`;
  const displayValue = value => value === null || value === undefined || value === ""
    ? "Not provided"
    : escapeHtml(value);
  const normalizeOrderStatus = value => ({
    pending: "To Pay",
    "awaiting customer": "Awaiting Approval",
    confirmed: "Confirmed",
    processing: "Preparing",
    preparing: "Preparing",
    "ready for pickup": "Ready for Pickup",
    "ready for delivery": "Ready for Delivery",
    "shipped out": "On the Way",
    shipped: "On the Way",
    delivered: "Completed",
    declined: "Cancelled"
  }[String(value || "").toLowerCase()] || value || "To Pay");

  if (!customerOrderStore.requireSignIn()) {
    root.textContent = "Sign in to view your order.";
    return;
  }

  function render() {
    if (!orderReference) return;
    const order = customerOrderStore.load().find(item =>
      item.reference === orderReference && customerOrderStore.belongsToCustomer(item)
    );
    if (!order) {
      root.innerHTML = "<h1>Order not found</h1><p>This order is unavailable for the signed-in account.</p>";
      return;
    }

    const payment = customerOrderStore.getPaymentSummary(order);
    const adminStatus = normalizeOrderStatus(order.status);
    const isCustomized = order.type === "Customization Request";
    const customizationConfirmed = Boolean(
      order.customizationConfirmedAt
      || ["Confirmed", "Preparing", "Ready for Pickup", "Ready for Delivery", "On the Way", "Completed"].includes(adminStatus)
      || (!order.customizationConfirmedAt && (
        order.sellerProposal?.acceptedAt || payment.amountPaid > 0
      ))
    );
    const customizationAccepted = Boolean(
      order.customizationAcceptedAt
      || order.sellerProposal?.acceptedAt
      || (!order.customizationConfirmedAt && (
        payment.amountPaid > 0
        || ["Preparing", "Ready for Pickup", "Ready for Delivery", "On the Way", "Completed"].includes(adminStatus)
      ))
    );
    const awaitingCustomerDecision = isCustomized
      && customizationConfirmed
      && !customizationAccepted
      && !order.customizationVoidedAt;
    const awaitingSellerOffer = isCustomized
      && !customizationConfirmed
      && !order.customizationVoidedAt;
    const status = awaitingCustomerDecision || awaitingSellerOffer
      ? "Awaiting Approval"
      : payment.status === "Fully Paid" && adminStatus === "To Pay"
        ? "Confirmed"
        : adminStatus;
    const isTerminal = ["Completed", "Cancelled"].includes(status);
    const amountDue = Math.max(0, payment.total - payment.amountPaid);
    const canSubmitProof = amountDue > 0
      && (!isCustomized || (customizationConfirmed && customizationAccepted))
      && payment.status !== "Pending Verification"
      && !["Cancelled", "Completed"].includes(status)
      && payment.status !== "Fully Paid";
    const proof = payment.proof;
    const sourceInquiry = order.sourceInquiryReference
      ? window.floraAvenueInquiryStore.load().find(inquiry =>
          inquiry.reference === order.sourceInquiryReference
          && inquiry.customerEmail?.toLowerCase() === customerOrderStore.getCustomerEmail()
        )
      : null;
    const proposalMessage = order.sellerProposal?.notes
      ? `<h3>Seller Response</h3><p>${displayValue(order.sellerProposal.notes)}</p>
        ${order.sellerProposal.amount ? `<p>Suggested total: ${formatAmount(order.sellerProposal.amount)}</p>` : ""}
        <p>${order.sellerProposal.acceptedAt ? "You accepted the suggestion; the administrator will update your order." : order.sellerProposal.declinedAt ? "You declined the suggestion; the administrator will review your order." : "Please choose whether to accept the seller suggestion."}</p>
        ${!order.sellerProposal.acceptedAt && !order.sellerProposal.declinedAt && !isTerminal
          ? '<button id="acceptProposal" type="button">Accept Suggestion</button><button id="declineProposal" class="secondary" type="button">Decline Suggestion</button>'
          : ""}`
      : "";

    const proofPreview = proof?.dataUrl && /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(proof.dataUrl)
      ? `<img class="customer-payment-proof-thumbnail" src="${escapeHtml(proof.dataUrl)}" alt="Payment proof preview">`
      : "";
    const proofUrl = proof?.dataUrl && /^data:(?:image\/(?:png|jpeg|webp|gif)|application\/pdf);base64,/i.test(proof.dataUrl)
      ? proof.dataUrl
      : "";
    const customerMessage = order.customerMessage || "";

    root.innerHTML = `
      <div class="customer-order-detail-layout">
        <section class="customer-order-information">
          <div class="customer-order-detail-heading">
            <h1>Order Details</h1>
            <p>Order ID: ${escapeHtml(order.reference)}</p>
          </div>
          <article class="customer-order-product-card">
            <img class="order-image" src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(order.style || "Order")}">
            <div class="customer-order-product-description">
              <h2>${displayValue(order.style || (isCustomized ? "Custom order" : "Order"))}</h2>
              <p>${displayValue(order.size || "Standard")} · Qty ${displayValue(order.qty || 1)}</p>
              ${order.colors ? `<p>Color: ${displayValue(order.colors)}</p>` : ""}
              ${order.addons ? `<p>Add-ons: ${displayValue(order.addons)}</p>` : ""}
              <p>Fulfillment: ${displayValue(order.fulfil || "To be confirmed")}</p>
              ${order.fulfil === "Delivery" && order.address ? `<p>Delivery address: ${displayValue(order.address)}</p>` : ""}
              ${order.preparationTime ? `<p>Estimated preparation: ${displayValue(order.preparationTime)}</p>` : ""}
              ${order.date ? `<p>Preferred date: ${displayValue(order.date)}</p>` : ""}
            </div>
            <div class="customer-order-total customer-current-order-status">
              <span>Order Status</span><strong>${displayValue(status)}</strong>
            </div>
            <div class="customer-order-total"><span>Total Amount</span><strong>${isCustomized && !customizationConfirmed ? "Awaiting final price" : payment.total > 0 ? formatAmount(payment.total) : "To be discussed"}</strong></div>
          </article>
          <section class="customer-message-card" aria-labelledby="customer-message-title">
            <h3 id="customer-message-title">Customer Message</h3>
            <p>${customerMessage ? displayValue(customerMessage) : "None"}</p>
          </section>
          ${isCustomized ? `<section class="customer-order-extra"><h3>Customization details</h3><p>${displayValue(order.notes || "None")}</p>
            <p>Seller confirmation: ${!customizationConfirmed ? "Awaiting review" : awaitingCustomerDecision ? "Awaiting your decision" : order.customizationVoidedAt ? "Voided" : "Confirmed and accepted"}</p></section>` : ""}
          ${awaitingCustomerDecision ? `
            <section class="customer-order-extra custom-offer-response" aria-labelledby="custom-offer-title">
              <h3 id="custom-offer-title">Seller's Customized Offer</h3>
              <p>Review the seller's edited design and final price. Choose whether to continue to payment or cancel the order.</p>
              <p><strong>Final price: ${formatAmount(payment.total)}</strong></p>
              <div class="custom-offer-actions">
                <button id="acceptCustomizedOffer" type="button">Accept &amp; Continue to Payment</button>
                <button id="voidCustomizedOffer" class="secondary" type="button">Cancel Order</button>
              </div>
              <p id="customOfferFeedback" class="payment-form-feedback" role="status" aria-live="polite"></p>
            </section>` : ""}
          ${sourceInquiry ? `<section class="customer-order-extra"><h3>Related Inquiry</h3><p><a class="related-inquiry-link" href="../inquiries/inquiries.html?reference=${encodeURIComponent(sourceInquiry.reference)}">${escapeHtml(sourceInquiry.subject || sourceInquiry.reference)} · ${escapeHtml(sourceInquiry.reference)}</a></p></section>` : ""}
          ${proposalMessage ? `<section class="customer-order-extra">${proposalMessage}</section>` : ""}
          ${customerMessage ? `<p class="payment-notice customer-update-note">Update from Flora Avenue: ${displayValue(customerMessage)}</p>` : ""}
        </section>
        <div class="customer-order-payment">
          <section class="customer-payment-card" aria-labelledby="customer-payment-title">
            <h2 id="customer-payment-title">Payment</h2>
            <div class="customer-payment-summary">
              <div><span>Payment Status</span><strong class="customer-payment-status payment-status-${payment.status.toLowerCase().replace(/\s+/g, "-")}">${displayValue(payment.status)}</strong></div>
              <div><span>Total Amount</span><strong>${isCustomized && !customizationConfirmed ? "Awaiting final price" : formatAmount(payment.total)}</strong></div>
              <div><span>Payment Method</span><strong>${displayValue(payment.method || proof?.method || "Not provided")}</strong></div>
            </div>
            ${payment.status === "Pending Verification" ? '<p class="payment-notice">Your payment proof has been submitted. Please wait for the seller to verify your payment.</p>' : ""}
            ${payment.status === "Rejected" && proof?.rejectionReason ? `<p class="payment-notice payment-rejected-notice">Payment rejected: ${displayValue(proof.rejectionReason)}</p>` : ""}
            ${proof ? `<div class="customer-proof-card"><h3>Payment Proof</h3><div class="customer-proof-details">
              ${proofPreview}
              <div><span>${displayValue(proof.fileName || "Payment proof")}</span>
                <small>Submitted ${displayValue(proof.submittedAt ? new Date(proof.submittedAt).toLocaleString("en-PH") : "date unavailable")}</small>
                ${proof.referenceNumber ? `<small>Reference: ${displayValue(proof.referenceNumber)}</small>` : ""}
              </div>
              ${proofUrl ? `<a class="customer-proof-open" href="${escapeHtml(proofUrl)}" target="_blank" rel="noopener">${proof.mimeType === "application/pdf" ? "View PDF" : "View Image"}</a>` : ""}
            </div></div>` : ""}
            ${isCustomized && !customizationConfirmed
              ? '<p class="payment-notice">The seller is reviewing your customized request and will confirm the final details and price before payment is available.</p>'
              : ""}
            ${awaitingCustomerDecision
              ? '<p class="payment-notice">Accept the seller-edited order above before submitting any payment.</p>'
              : ""}
            ${canSubmitProof ? `
              <form id="customerPaymentForm" class="customer-payment-form" novalidate>
                <h3>${payment.status === "Rejected" ? "Submit New Payment Proof" : "Pay Total Price"}</h3>
                <p>Amount due now: <strong>${formatAmount(amountDue)}</strong></p>
                <label>Payment method<input name="method" type="text" maxlength="80" required placeholder="e.g. GCash, bank transfer"></label>
                <label>Payment reference number<input name="referenceNumber" type="text" maxlength="120" required></label>
                <label>Upload payment proof<input name="proofFile" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required><small>PNG, JPG, WebP, or PDF up to 2 MB.</small></label>
                <button type="submit">Submit Payment for Verification</button>
                <p class="payment-form-feedback" role="alert" aria-live="assertive"></p>
              </form>` : ""}
          </section>
        </div>
      </div>`;
    document.getElementById("acceptCustomizedOffer")?.addEventListener("click", () => {
      order.customizationAcceptedAt = new Date().toISOString();
      order.status = "Pending";
      updateOrder(order, "Unable to accept the seller's customized order. Please try again.");
    });
    document.getElementById("voidCustomizedOffer")?.addEventListener("click", () => {
      if (!window.confirm("Cancel this customized order? It cannot be paid after cancellation.")) return;
      order.customizationVoidedAt = new Date().toISOString();
      order.status = "Cancelled";
      updateOrder(order, "Unable to void the customized order. Please try again.");
    });

    document.getElementById("acceptProposal")?.addEventListener("click", () => {
      order.sellerProposal.acceptedAt = new Date().toISOString();
      if (order.sellerProposal.amount !== null && order.sellerProposal.amount !== undefined) {
        order.amount = Number(order.sellerProposal.amount);
        order.payment = { ...order.payment, total: order.amount };
      }
      updateOrder(order, "Unable to accept the seller suggestion. Please try again.");
    });
    document.getElementById("declineProposal")?.addEventListener("click", () => {
      order.sellerProposal.declinedAt = new Date().toISOString();
      updateOrder(order, "Unable to record your response. Please try again.");
    });
    document.getElementById("customerPaymentForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const feedback = form.querySelector(".payment-form-feedback");
      const amount = amountDue;
      const file = form.elements.proofFile.files[0];
      const requiredFields = [
        { field: form.elements.method, label: "Payment method" },
        { field: form.elements.referenceNumber, label: "Payment reference number" },
        { field: form.elements.proofFile, label: "Payment proof" }
      ];
      const missingFields = requiredFields.filter(({ field }) =>
        field.type === "file" ? !field.files.length : !field.value.trim()
      );
      form.querySelectorAll("[aria-invalid='true']").forEach(field => field.removeAttribute("aria-invalid"));
      if (missingFields.length) {
        missingFields.forEach(({ field }) => field.setAttribute("aria-invalid", "true"));
        feedback.textContent = `Complete the required fields: ${missingFields.map(({ label }) => label).join(", ")}.`;
        missingFields[0].field.focus();
        return;
      }
      if (isCustomized && (!customizationConfirmed || !customizationAccepted)) {
        feedback.textContent = "Payment is available after you accept the seller's confirmed customized order and final price.";
        return;
      }
      if (!file || !Number.isFinite(amount) || amount <= 0) {
        feedback.textContent = "The total price is unavailable for payment. Please contact Flora Avenue.";
        return;
      }
      if (!/^(image\/(png|jpeg|webp)|application\/pdf)$/.test(file.type) || file.size > maxProofBytes) {
        form.elements.proofFile.setAttribute("aria-invalid", "true");
        feedback.textContent = "Choose a PNG, JPG, WebP, or PDF file no larger than 2 MB.";
        form.elements.proofFile.focus();
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => {
        feedback.textContent = "Unable to read the payment proof. Please try another file.";
      };
      reader.onload = () => {
        order.payment = {
          ...(order.payment || {}),
          method: form.elements.method.value.trim(),
          status: "Pending Verification",
          proof: {
            fileName: file.name,
            mimeType: file.type,
            dataUrl: String(reader.result || ""),
            amount,
            method: form.elements.method.value.trim(),
            referenceNumber: form.elements.referenceNumber.value.trim(),
            submittedAt: new Date().toISOString()
          }
        };
        updateOrder(order, "Unable to submit payment proof. Please check your browser storage and try again.");
      };
      reader.readAsDataURL(file);
    });
    document.getElementById("customerPaymentForm")?.addEventListener("input", event => {
      event.target.removeAttribute("aria-invalid");
      const feedback = event.currentTarget.querySelector(".payment-form-feedback");
      if (feedback) feedback.textContent = "";
    });
    document.getElementById("customerPaymentForm")?.addEventListener("change", event => {
      event.target.removeAttribute("aria-invalid");
      const feedback = event.currentTarget.querySelector(".payment-form-feedback");
      if (feedback) feedback.textContent = "";
    });
  }

  function updateOrder(order, errorMessage) {
    try {
      customerOrderStore.update(order);
    } catch (error) {
      console.error("Unable to update the customer order.", error);
      const feedback = document.querySelector(".payment-form-feedback");
      if (feedback) feedback.textContent = errorMessage;
      else alert(errorMessage);
    }
  }

  render();
  window.addEventListener("storage", function (event) {
    if (event.key === "floraAvenueOrders") render();
  });
  window.addEventListener("floraAvenueOrdersChanged", render);
})();
