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
  const hasFinalPreparationTime = order => typeof order.preparationTime === "string"
    && Boolean(order.preparationTime.trim())
    && order.preparationTime.trim().toLowerCase() !== "to be confirmed";
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
      const cancelButton = document.createElement("button");
      const confirmButton = document.createElement("button");

      dialog.className = "customer-confirm-dialog";
      dialog.setAttribute("aria-labelledby", "customer-confirm-title");
      heading.id = "customer-confirm-title";
      heading.textContent = title;
      description.textContent = message;
      actions.className = "customer-confirm-actions";
      cancelButton.className = "customer-confirm-dismiss";
      cancelButton.type = "button";
      cancelButton.textContent = "Keep Order";
      confirmButton.className = "customer-confirm-accept";
      confirmButton.type = "button";
      confirmButton.textContent = confirmLabel;
      actions.append(cancelButton, confirmButton);
      dialog.append(heading, description, actions);

      const finish = confirmed => {
        if (!dialog.open) return;
        dialog.close();
        dialog.remove();
        resolve(confirmed);
      };

      cancelButton.addEventListener("click", () => finish(false));
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

  function render() {
    if (!orderReference) return;
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
    const status = cancellationRequestPending
      ? "Cancellation Requested"
      : awaitingCustomerDecision || awaitingSellerOffer
      ? "Awaiting Approval"
      : payment.status === "Fully Paid" && adminStatus === "To Pay"
        ? "Confirmed"
        : adminStatus;
    const displayStatus = status === "To Pay" ? "Pending Payment" : status;
    const isTerminal = ["Completed", "Cancelled", "Cancellation Requested"].includes(status);
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
    const cancellationAction = payment.amountPaid === 0 && payment.status === "Pending Verification" && !isTerminal
      ? cancellationRequestPending
        ? ""
        : '<button id="requestCancellation" type="button">Request Cancellation</button>'
      : payment.amountPaid === 0 && ["Unpaid", "Rejected"].includes(payment.status) && !isTerminal && !awaitingCustomerDecision
        ? '<button id="cancelOrder" type="button">Cancel Order</button>'
        : "";

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
              <span>Order Status</span><strong>${displayValue(displayStatus)}</strong>
            </div>
            <div class="customer-order-total"><span>Total Amount</span><strong>${isCustomized && !customizationConfirmed ? "Awaiting final price" : payment.total > 0 ? formatAmount(payment.total) : "To be discussed"}</strong></div>
            ${cancellationAction}
          </article>
          <section class="customer-message-card" aria-labelledby="order-notes-title">
            <h3 id="order-notes-title">${isCustomized ? "Customization Details" : "Customer Special Instructions / Notes"}</h3>
            <p>${displayValue(order.notes || "None")}</p>
          </section>
          ${isCustomized ? `<section class="customer-order-extra"><h3>Customization status</h3>
            <p>Seller confirmation: ${!customizationConfirmed ? "Awaiting review" : awaitingCustomerDecision ? "Awaiting your decision" : order.customizationVoidedAt ? "Voided" : "Confirmed and accepted"}</p></section>` : ""}
          ${awaitingCustomerDecision ? `
            <section class="customer-order-extra custom-offer-response" aria-labelledby="custom-offer-title">
              <h3 id="custom-offer-title">Seller's Customized Offer</h3>
              <p>Review the seller's edited design, final price, and preparation time. Choose whether to continue to payment or cancel the order.</p>
              <p><strong>Final price: ${formatAmount(payment.total)}</strong></p>
              <p><strong>Estimated preparation: ${hasFinalPreparationTime(order) ? displayValue(order.preparationTime) : "Awaiting seller confirmation"}</strong></p>
              <div class="custom-offer-actions">
                ${hasFinalPreparationTime(order) ? '<button id="acceptCustomizedOffer" type="button">Accept &amp; Continue to Payment</button>' : ""}
                <button id="voidCustomizedOffer" class="secondary" type="button">Cancel Order</button>
              </div>
              ${hasFinalPreparationTime(order) ? "" : '<p class="payment-notice">Please wait while the seller confirms the estimated preparation time.</p>'}
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
            ${cancellationNotice}
            ${payment.status === "Pending Verification" ? '<p class="payment-notice">Your payment proof has been submitted. Please wait for the seller to verify your payment.</p>' : ""}
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
      if (!hasFinalPreparationTime(order)) return;
      order.customizationAcceptedAt = new Date().toISOString();
      order.status = "Pending";
      updateOrder(order, "Unable to accept the seller's customized order. Please try again.");
    });
    document.getElementById("voidCustomizedOffer")?.addEventListener("click", () => {
      showConfirmDialog("Cancel customized order?", "This order cannot be paid after cancellation.", "Cancel Order").then(confirmed => {
        if (!confirmed) return;
      const latestOrder = findCustomerOrder();
      if (!latestOrder || customerOrderStore.getPaymentSummary(latestOrder).amountPaid > 0) {
        window.alert("Payment was updated while this page was open. Refresh the order before continuing.");
        render();
        return;
      }
      latestOrder.customizationVoidedAt = new Date().toISOString();
      latestOrder.status = "Cancelled";
      latestOrder.cancelledAt = new Date().toISOString();
      latestOrder.payment = { ...(latestOrder.payment || {}), status: "Cancelled" };
      updateOrder(latestOrder, "Unable to void the customized order. Please try again.");
      });
    });
    document.getElementById("cancelOrder")?.addEventListener("click", () => {
      showConfirmDialog("Cancel this order?", "This action cannot be undone.", "Cancel Order").then(confirmed => {
        if (!confirmed) return;
      const latestOrder = findCustomerOrder();
      const latestPayment = latestOrder && customerOrderStore.getPaymentSummary(latestOrder);
      if (!latestOrder || latestPayment.amountPaid > 0 || !["Unpaid", "Rejected"].includes(latestPayment.status)) {
        window.alert("Payment was updated while this page was open. Refresh the order before continuing.");
        render();
        return;
      }
      latestOrder.status = "Cancelled";
      latestOrder.cancelledAt = new Date().toISOString();
      latestOrder.payment = { ...(latestOrder.payment || {}), status: "Cancelled" };
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
      latestOrder.status = "Cancellation Requested";
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
      render();
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
