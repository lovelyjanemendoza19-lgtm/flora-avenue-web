const customerOrderStore = window.floraAvenueCustomerOrders;
const orderParams = new URLSearchParams(location.search);
const orderReference = orderParams.get("order");
const root = document.getElementById("details");
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));
const displayValue = value => value === null || value === undefined || value === ""
  ? "Not provided"
  : escapeHtml(value);

if (!customerOrderStore.requireSignIn()) {
  root.textContent = "Sign in to view your order.";
} else {
  const order = customerOrderStore.load().find(item =>
    item.reference === orderReference && customerOrderStore.belongsToCustomer(item)
  );

  if (!order) {
    root.innerHTML = "<h1>Order not found</h1><p>This order is unavailable for the signed-in account.</p>";
  } else {
    const isCustomization = order.type === "Customization Request";
    const accepted = ["Confirmed", "Processing", "Shipped", "Delivered"].includes(order.status);
    const amount = Number(order.amount || 0);
    const paymentTotal = Number(order.payment?.total || amount);
    const amountPaid = Number(order.payment?.amountPaid || 0);
    const rows = isCustomization
      ? [
          ["Request type", "Customization Request"],
          ["Selected product option", order.size],
          ["Preferred design", order.style],
          ["Color", order.colors],
          ["Number of stems/items", order.qty],
          ["Add-ons", order.addons],
          ["Occasion and notes", order.notes],
          ["Budget", amount > 0 ? `₱${amount.toLocaleString("en-PH")}` : "To be discussed"]
        ]
      : [
          ["Product", order.style],
          ["Variation", order.size],
          ["Color", order.colors],
          ["Quantity", order.qty],
          ["Add-ons", order.addons],
          ["Notes", order.notes],
          ["Total", `₱${amount.toLocaleString("en-PH")}`]
        ];
    const sourceInquiry = order.sourceInquiryReference
      ? window.floraAvenueInquiryStore.load().find(inquiry =>
          inquiry.reference === order.sourceInquiryReference
          && inquiry.customerEmail?.toLowerCase() === customerOrderStore.getCustomerEmail()
        )
      : null;

    root.innerHTML = `
      <h1>${isCustomization ? "Customization Request" : "Order Details"}</h1>
      <img class="order-image" src="../../public/images/${encodeURIComponent(order.image || "banner-flower.png")}" alt="${escapeHtml(order.style || "Order")}">
      <h2>${escapeHtml(order.reference)}</h2>
      <p class="status">Status: ${displayValue(order.status)}</p>
      <h3>${isCustomization ? "Customization Summary" : "Order Information"}</h3>
      <dl>${rows.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${displayValue(value)}</dd>`).join("")}</dl>
      ${sourceInquiry ? `<h3>Related Inquiry</h3><p><a class="related-inquiry-link" href="../inquiries/inquiries.html?reference=${encodeURIComponent(sourceInquiry.reference)}">${escapeHtml(sourceInquiry.subject || sourceInquiry.reference)} · ${escapeHtml(sourceInquiry.reference)}</a></p>` : ""}
      <h3>Customer Information</h3>
      <dl><dt>Name</dt><dd>${displayValue(order.customerName || order.contactName)}</dd><dt>Email</dt><dd>${displayValue(order.customerEmail || order.contactEmail)}</dd><dt>Contact</dt><dd>${displayValue(order.contactNumber)}</dd></dl>
      ${isCustomization ? "" : `<h3>Fulfillment</h3><dl><dt>Method</dt><dd>${displayValue(order.fulfil)}</dd><dt>Preferred date</dt><dd>${displayValue(order.date)}</dd><dt>Address</dt><dd>${displayValue(order.address)}</dd></dl>`}
      <h3>Seller Response</h3>
      <p>${displayValue(order.sellerProposal?.notes || (
        order.status === "Declined" ? "The seller is unable to accept this order." : "Waiting for seller response."
      ))}</p>
      ${order.sellerProposal?.amount
        ? `<p>Suggested total: ₱${Number(order.sellerProposal.amount).toLocaleString("en-PH")}</p>`
        : ""}
      ${order.status === "Awaiting Customer" && order.sellerProposal
        ? '<p>Please accept or decline the seller suggestion.</p><button id="accept">Accept Suggestion</button><button id="cancel" class="secondary">Decline Suggestion</button>'
        : ""}
      <h3>Payment Information</h3>
      ${accepted
        ? `<p>Total amount: ₱${paymentTotal.toLocaleString("en-PH")}</p><p>Required down payment: ₱${Number(order.payment?.requiredDownPayment || 0).toLocaleString("en-PH")}</p><p>Amount paid: ₱${amountPaid.toLocaleString("en-PH")}</p><p>Remaining balance: ₱${Math.max(0, paymentTotal - amountPaid).toLocaleString("en-PH")}</p><input id="proof" type="file" accept="image/*,.pdf">`
        : "<p>Waiting for seller acceptance before payment.</p>"}`;

    const save = (status, acceptProposal = false) => {
      order.status = status;
      if (acceptProposal && order.sellerProposal?.amount !== null && order.sellerProposal?.amount !== undefined) {
        order.amount = Number(order.sellerProposal.amount);
        order.payment = {
          ...order.payment,
          total: order.amount
        };
      }
      try {
        customerOrderStore.update(order);
        location.reload();
      } catch (error) {
        alert("Unable to update this order. Please try again.");
      }
    };
    document.getElementById("accept")?.addEventListener("click", () => save("Confirmed", true));
    document.getElementById("cancel")?.addEventListener("click", () => save("Cancelled"));
    document.getElementById("proof")?.addEventListener("change", event => {
      const proof = event.target.files[0]?.name || "";
      order.payment = { ...order.payment, proof };
      try {
        customerOrderStore.update(order);
      } catch (error) {
        alert("Unable to save the payment proof selection. Please try again.");
        console.error("Unable to save the order payment proof.", error);
      }
    });
  }
}
