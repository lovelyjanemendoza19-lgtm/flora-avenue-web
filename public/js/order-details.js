(function () {
  const customerOrderStore = window.floraAvenueCustomerOrders;
  const pageParams = new URLSearchParams(location.search);
  const orderReference = pageParams.get("order");
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
  const hasFinalPreparationTime = order => typeof order.preparationTime === "string"
    && Boolean(order.preparationTime.trim())
    && order.preparationTime.trim().toLowerCase() !== "to be confirmed";
  const normalizeOrderStatus = value => ({
    pending: "To Pay",
    "awaiting customer": "Awaiting Approval",
    "cancellation requested": "To Pay",
    confirmed: "Confirmed",
    processing: "Preparing",
    preparing: "Preparing",
    "to ship/pickup": "To Ship/Pickup",
    "ready for pickup": "To Ship/Pickup",
    "ready for delivery": "To Ship/Pickup",
    "shipped out": "To Ship/Pickup",
    "on the way": "To Ship/Pickup",
    shipped: "To Ship/Pickup",
    delivered: "Completed",
    declined: "Cancelled"
  }[String(value || "").toLowerCase()] || value || "To Pay");
  const getCustomerOrderStatus = adminStatus => {
    if (["Cancelled", "Completed"].includes(adminStatus)) return adminStatus;
    if (["Preparing", "To Ship/Pickup"].includes(adminStatus)) return adminStatus;
    return "To Pay";
  };
  const getCustomerPaymentStatus = status => ({
    Unpaid: "Pending Payment",
    "Pending Verification": "Payment Under Review",
    Rejected: "Payment Rejected",
    "Fully Paid": "Paid"
  }[status] || status);

  if (!customerOrderStore.requireSignIn()) {
    root.textContent = "Sign in to view your order.";
    return;
  }

  function findCustomerOrder() {
    return customerOrderStore.load().find(item =>
      item.reference === orderReference && customerOrderStore.belongsToCustomer(item)
    );
  }

  function showConfirmDialog(title, message, confirmLabel) {
    return new Promise(resolve => {
      const dialog = document.createElement("dialog");
      const heading = document.createElement("h2");
      const description = document.createElement("p");
      const actions = document.createElement("div");
      const icon = document.createElement("span");
      const closeButton = document.createElement("button");
      const cancelButton = document.createElement("button");
      const confirmButton = document.createElement("button");

      dialog.className = "customer-confirm-dialog";
      dialog.setAttribute("aria-labelledby", "customer-confirm-title");
      dialog.setAttribute("aria-describedby", "customer-confirm-description");
      icon.className = "customer-confirm-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "!";
      heading.id = "customer-confirm-title";
      heading.textContent = title;
      description.id = "customer-confirm-description";
      description.textContent = message;
      closeButton.className = "customer-confirm-close";
      closeButton.type = "button";
      closeButton.setAttribute("aria-label", "Keep order and close dialog");
      closeButton.textContent = "×";
      actions.className = "customer-confirm-actions";
      cancelButton.className = "customer-confirm-dismiss";
      cancelButton.type = "button";
      cancelButton.textContent = "Keep Order";
      confirmButton.className = "customer-confirm-accept";
      confirmButton.type = "button";
      confirmButton.textContent = confirmLabel;
      actions.append(cancelButton, confirmButton);
      dialog.append(closeButton, icon, heading, description, actions);

      const finish = confirmed => {
        if (!dialog.open) return;
        dialog.close();
        dialog.remove();
        resolve(confirmed);
      };

      cancelButton.addEventListener("click", () => finish(false));
      closeButton.addEventListener("click", () => finish(false));
      confirmButton.addEventListener("click", () => finish(true));
      dialog.addEventListener("cancel", event => {
        event.preventDefault();
        finish(false);
      });
      dialog.addEventListener("click", event => {
        if (event.target === dialog) finish(false);
      });
      document.body.append(dialog);
      dialog.showModal();
      cancelButton.focus();
    });
  }

  function closePaymentModal() {
    const dialog = document.getElementById("customerPaymentModal");
    if (dialog?.open) dialog.close();
    document.body.classList.remove("customer-payment-modal-open");
    document.getElementById("payNowButton")?.setAttribute("aria-expanded", "false");
  }

  function render() {
    if (!orderReference) return;
    closePaymentModal();
    const order = findCustomerOrder();
    if (!order) {
      root.innerHTML = "<h1>Order not found</h1><p>This order is unavailable for the signed-in account.</p>";
      return;
    }

    const payment = customerOrderStore.getPaymentSummary(order);
    const adminStatus = normalizeOrderStatus(order.status);
    const isCustomized = order.type === "Customization Request";
    const cancellationRequestPending = order.cancellationRequest?.status === "Pending";
    const customizationConfirmed = Boolean(
      order.customizationConfirmedAt
      || ["Confirmed", "Preparing", "To Ship/Pickup", "Ready for Pickup", "Ready for Delivery", "On the Way", "Completed"].includes(adminStatus)
      || (!order.customizationConfirmedAt && (
        order.sellerProposal?.acceptedAt || payment.amountPaid > 0
      ))
    );
    const customizationAccepted = Boolean(
      order.customizationAcceptedAt
      || order.sellerProposal?.acceptedAt
      || (!order.customizationConfirmedAt && (
        payment.amountPaid > 0
        || ["Preparing", "To Ship/Pickup", "Ready for Pickup", "Ready for Delivery", "On the Way", "Completed"].includes(adminStatus)
      ))
    ) && hasFinalPreparationTime(order);
    const awaitingCustomerDecision = isCustomized
      && customizationConfirmed
      && !customizationAccepted
      && !order.customizationVoidedAt
      && !cancellationRequestPending;
    const awaitingSellerOffer = isCustomized
      && !customizationConfirmed
      && !order.customizationVoidedAt
      && !cancellationRequestPending;
    const status = getCustomerOrderStatus(adminStatus);
    const displayStatus = status;
    const isTerminal = ["Completed", "Cancelled"].includes(status);
    const canConfirmReceived = adminStatus === "To Ship/Pickup" && !cancellationRequestPending;
    const amountDue = Math.max(0, payment.total - payment.amountPaid);
    const canSubmitProof = amountDue > 0
      && (!isCustomized || (customizationConfirmed && customizationAccepted))
      && payment.status !== "Pending Verification"
      && !isTerminal
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
    const cancellationNotice = cancellationRequestPending
      ? '<p class="payment-notice" role="status">Your cancellation request has been sent. The administrator will review it before payment verification.</p>'
      : order.cancellationRequest?.status === "Declined"
        ? '<p class="payment-notice payment-rejected-notice" role="status">Your cancellation request was declined. You can request cancellation again or continue with payment.</p>'
        : "";
    const isFullyPaid = payment.status === "Fully Paid"
      && payment.total > 0
      && payment.amountPaid >= payment.total;
    const cancellationAction = payment.status === "Pending Verification"
      && payment.amountPaid === 0
      && !isTerminal
      ? cancellationRequestPending
        ? ""
        : '<button id="requestCancellation" type="button">Request Cancellation</button>'
      : !isFullyPaid && !["Cancelled", "Completed", "Cancellation Requested"].includes(status)
        ? '<button id="cancelOrder" type="button">Cancel Order</button>'
        : "";
    const paymentMethod = payment.method || proof?.method || "";
    const canPay = canSubmitProof && !cancellationRequestPending;
    const hasAdditionalDetails = isCustomized
      || awaitingCustomerDecision
      || Boolean(sourceInquiry)
      || Boolean(proposalMessage)
      || Boolean(customerMessage)
      || Boolean(cancellationNotice)
      || payment.status === "Pending Verification"
      || payment.status === "Rejected"
      || Boolean(proof);
    root.innerHTML = `
      <section class="customer-order-main-card">
      <div class="customer-order-status-card" aria-label="Order status">
        <div class="customer-order-status-heading">
          <p>Order ID: ${escapeHtml(order.reference)}</p>
        </div>
        <strong class="order-status-${displayStatus.toLowerCase().replace(/\s+/g, "-")}">${displayValue(displayStatus)}</strong>
      </div>
      ${hasFinalPreparationTime(order) ? `<div class="customer-preparation-notice" role="status" aria-live="polite">
        <span>Seller's preparation estimate</span>
        <strong>${displayValue(order.preparationTime)}</strong>
        <p>Please allow this time for the seller to prepare your order.</p>
      </div>` : ""}
      <article class="customer-order-product-card">
        <img class="order-image" src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(order.style || "Order")}">
        <div class="customer-order-product-description">
          <h2>${displayValue(order.style || (isCustomized ? "Custom order" : "Order"))}</h2>
          <div class="customer-order-product-attributes">
            <span>Variation:</span><span>${displayValue(order.size || "Standard")}</span>
            <span>Quantity:</span><span>${displayValue(order.qty || 1)}</span>
            ${order.colors ? `<span>Color:</span><span>${displayValue(order.colors)}</span>` : ""}
            ${order.addons ? `<span>Add-ons:</span><span>${displayValue(order.addons)}</span>` : ""}
            <span>Fulfillment method:</span><span>${displayValue(order.fulfil || "To be confirmed")}</span>
            ${order.fulfil === "Delivery" && order.address ? `<span>Delivery address:</span><span>${displayValue(order.address)}</span>` : ""}
            ${order.date ? `<span>Preferred date:</span><span>${displayValue(order.date)}</span>` : ""}
            ${!isCustomized ? `<span>Seller response:</span><span>${order.sellerAcceptedAt ? "Order accepted" : "Awaiting seller acceptance"}</span>` : ""}
            <span>Customer notes:</span><span>${displayValue(order.notes || "None")}</span>
          </div>
        </div>
      </article>
      ${canConfirmReceived ? `<button id="confirmOrderReceived" class="confirm-order-received" type="button">I've Received My Order</button>` : ""}
      <section class="customer-order-additional-details${hasAdditionalDetails ? "" : " is-empty"}">
          ${isCustomized ? `<section class="customer-order-extra"><h3>Customization status</h3>
            <p>Seller confirmation: ${!customizationConfirmed ? "Awaiting review" : awaitingCustomerDecision ? "Awaiting your decision" : order.customizationVoidedAt ? "Voided" : "Confirmed and accepted"}</p></section>` : ""}
          ${awaitingCustomerDecision ? `
            <section class="customer-order-extra custom-offer-response" aria-labelledby="custom-offer-title">
              <h3 id="custom-offer-title">Seller's Customized Offer</h3>
              <p>Review the seller's edited design, final price, and preparation time. Choose whether to continue to payment or cancel the order.</p>
              <p><strong>Final price: ${formatAmount(payment.total)}</strong></p>
              <div class="custom-offer-actions">
                ${hasFinalPreparationTime(order) ? '<button id="acceptCustomizedOffer" type="button">Accept &amp; Continue to Payment</button>' : ""}
              </div>
              ${hasFinalPreparationTime(order) ? "" : '<p class="payment-notice">Please wait while the seller confirms the estimated preparation time.</p>'}
              <p id="customOfferFeedback" class="payment-form-feedback" role="status" aria-live="polite"></p>
            </section>` : ""}
          ${sourceInquiry ? `<section class="customer-order-extra"><h3>Related Inquiry</h3><p><a class="related-inquiry-link" href="../inquiries/inquiries.html?reference=${encodeURIComponent(sourceInquiry.reference)}">${escapeHtml(sourceInquiry.subject || sourceInquiry.reference)} · ${escapeHtml(sourceInquiry.reference)}</a></p></section>` : ""}
          ${proposalMessage ? `<section class="customer-order-extra">${proposalMessage}</section>` : ""}
          ${customerMessage ? `<p class="payment-notice customer-update-note">Update from Flora Avenue: ${displayValue(customerMessage)}</p>` : ""}
          ${cancellationNotice}
          ${payment.status === "Pending Verification" ? '<p class="payment-notice">Payment Under Review. Your payment proof is awaiting manual verification.</p>' : ""}
          ${payment.status === "Rejected" ? `<p class="payment-notice payment-rejected-notice" role="alert" aria-live="assertive">Payment for order ${escapeHtml(order.reference)} was rejected.${proof?.rejectionReason ? ` Reason: ${displayValue(proof.rejectionReason)}` : ""} Please submit new payment proof.</p>` : ""}
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
      </section>
      </section>
      ${canPay ? `<button id="payNowButton" class="pay-now-button" type="button" aria-expanded="false" aria-controls="customerPaymentModal">${payment.status === "Rejected" ? "Submit New Payment Proof" : "Pay Now"}</button>` : ""}
      ${cancellationAction ? `<div class="customer-order-cancel-action">${cancellationAction}</div>` : ""}
      ${canPay ? `
        <dialog id="customerPaymentModal" class="customer-payment-modal" aria-labelledby="customer-payment-modal-title">
          <button class="payment-modal-close" type="button" aria-label="Close payment dialog">&times;</button>
          <div class="customer-payment-modal-heading">
            <h2 id="customer-payment-modal-title">Complete Your Payment</h2>
            <p>Order ID: <strong>${escapeHtml(order.reference)}</strong></p>
          </div>
          <form id="customerPaymentForm" class="customer-payment-form" novalidate>
            <p class="payment-modal-total"><span>Total Amount</span><strong>${formatAmount(payment.total)}</strong></p>
            ${payment.amountPaid > 0 ? `<p class="payment-modal-due"><span>Remaining Balance</span><strong>${formatAmount(amountDue)}</strong></p>` : ""}
            <label>Payment Method
              <select name="method" required>
                <option value="">Select a payment method</option>
                <option value="GCash"${paymentMethod.toLowerCase() === "gcash" ? " selected" : ""}>GCash</option>
                <option value="Bank Transfer"${paymentMethod.toLowerCase() === "bank transfer" ? " selected" : ""}>Bank Transfer</option>
              </select>
            </label>
            <label>Reference Number<input name="referenceNumber" type="text" maxlength="120" placeholder="Enter payment reference number" required></label>
            <label>Upload Payment Proof<input name="proofFile" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required><small>PNG, JPG, WebP, or PDF — max 2 MB</small></label>
            <button type="submit">Submit Payment for Verification</button>
            <p class="payment-form-feedback" role="alert" aria-live="assertive"></p>
          </form>
        </dialog>` : ""}`;
    document.getElementById("payNowButton")?.addEventListener("click", event => {
      const button = event.currentTarget;
      const dialog = document.getElementById("customerPaymentModal");
      dialog.showModal();
      document.body.classList.add("customer-payment-modal-open");
      button.setAttribute("aria-expanded", "true");
      dialog.querySelector(".payment-modal-close").focus();
    });
    document.querySelector(".payment-modal-close")?.addEventListener("click", closePaymentModal);
    const paymentModal = document.getElementById("customerPaymentModal");
    paymentModal?.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePaymentModal();
      }
    });
    paymentModal?.addEventListener("cancel", event => {
      event.preventDefault();
      closePaymentModal();
    });
    paymentModal?.addEventListener("close", () => {
      document.body.classList.remove("customer-payment-modal-open");
      document.getElementById("payNowButton")?.setAttribute("aria-expanded", "false");
    });
    document.getElementById("acceptCustomizedOffer")?.addEventListener("click", () => {
      if (!hasFinalPreparationTime(order)) return;
      order.customizationAcceptedAt = new Date().toISOString();
      order.status = "Pending";
      updateOrder(order, "Unable to accept the seller's customized order. Please try again.");
    });
    document.getElementById("confirmOrderReceived")?.addEventListener("click", () => {
      const latestOrder = findCustomerOrder();
      if (!latestOrder || normalizeOrderStatus(latestOrder.status) !== "To Ship/Pickup") {
        render();
        return;
      }
      const receivedAt = new Date().toISOString();
      latestOrder.customerReceivedAt = receivedAt;
      latestOrder.completedAt = receivedAt;
      latestOrder.status = "Completed";
      latestOrder.statusUpdatedAt = receivedAt;
      updateOrder(latestOrder, "Unable to confirm receipt. Please try again.");
    });
    document.getElementById("cancelOrder")?.addEventListener("click", () => {
      showConfirmDialog(
        "Cancel Order",
        "Are you sure you want to cancel this order? This action cannot be undone.",
        "Yes, Cancel Order"
      ).then(confirmed => {
        if (!confirmed) return;
        const latestOrder = findCustomerOrder();
        const latestPayment = latestOrder && customerOrderStore.getPaymentSummary(latestOrder);
        const fullPaymentVerified = latestPayment
          && latestPayment.status === "Fully Paid"
          && latestPayment.total > 0
          && latestPayment.amountPaid >= latestPayment.total;
        if (!latestOrder || fullPaymentVerified) {
          window.alert("Full payment was verified while this page was open. This order can no longer be cancelled.");
          render();
          return;
        }
        latestOrder.status = "Cancelled";
        latestOrder.cancelledAt = new Date().toISOString();
        latestOrder.statusUpdatedAt = latestOrder.cancelledAt;
        latestOrder.payment = { ...(latestOrder.payment || {}), status: "Cancelled" };
        if (latestOrder.type === "Customization Request" && !latestOrder.customizationAcceptedAt) {
          latestOrder.customizationVoidedAt = latestOrder.cancelledAt;
        }
        updateOrder(latestOrder, "Unable to cancel the order. Please try again.");
      });
    });
    document.getElementById("requestCancellation")?.addEventListener("click", () => {
      showConfirmDialog("Request cancellation?", "The administrator will review your request.", "Request Cancellation").then(confirmed => {
        if (!confirmed) return;
      const latestOrder = findCustomerOrder();
      const latestPayment = latestOrder && customerOrderStore.getPaymentSummary(latestOrder);
      if (!latestOrder || latestPayment.amountPaid > 0 || latestPayment.status !== "Pending Verification") {
        window.alert("Payment was updated while this page was open. Refresh the order before continuing.");
        render();
        return;
      }
      latestOrder.cancellationRequest = {
        status: "Pending",
        requestedAt: new Date().toISOString(),
        previousOrderStatus: latestOrder.status
      };
      updateOrder(latestOrder, "Unable to request cancellation. Please try again.");
      });
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
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      reader.onerror = () => {
        submitButton.disabled = false;
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
        const saved = updateOrder(
          order,
          "Unable to submit payment proof. Please check your browser storage and try again.",
          closePaymentModal
        );
        if (!saved) submitButton.disabled = false;
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

  function updateOrder(order, errorMessage, onSuccess) {
    try {
      customerOrderStore.update(order);
      onSuccess?.();
      render();
      return true;
    } catch (error) {
      console.error("Unable to update the customer order.", error);
      const feedback = document.querySelector(".payment-form-feedback");
      if (feedback) feedback.textContent = errorMessage;
      else alert(errorMessage);
      return false;
    }
  }

  render();
  window.addEventListener("storage", function (event) {
    if (event.key === "floraAvenueOrders") render();
  });
  window.addEventListener("floraAvenueOrdersChanged", render);
})();
