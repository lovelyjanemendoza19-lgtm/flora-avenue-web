const inquiryStore = window.floraAvenueInquiryStore;
let inquiries = inquiryStore.load();
let currentInquiry = null;

function getCustomerEmail() {
  return (localStorage.getItem("floraAvenueUserEmail") || "").trim().toLowerCase();
}

function hasUnreadSellerReply(inquiry) {
  const conversation = Array.isArray(inquiry.conversation) ? inquiry.conversation : [];
  return conversation[conversation.length - 1]?.sender === "Seller";
}

function imageFileName(imagePath) {
  const imageName = String(imagePath || "").split(/[\\/]/).pop() || "";
  try {
    const decoded = decodeURIComponent(imageName);
    return decoded.includes("/") || decoded.includes("\\") ? "" : decoded;
  } catch (error) {
    console.warn("Unable to decode the inquiry product image name.", error);
    return imageName;
  }
}

function loadProductInquiryDetails() {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get("product");
  const productId = params.get("id");
  const productRow = document.querySelector("#formScreen .product-row");
  if (!productName) {
    if (productRow) productRow.hidden = true;
    return;
  }

  const backLink = document.getElementById("backToProductDetails");
  if (backLink && productId) {
    backLink.href = `../products/product-details.html?id=${encodeURIComponent(productId)}`;
    backLink.hidden = false;
  }

  const imageName = params.get("image");
  const imageElement = document.getElementById("formInquiryProductImage");
  if (imageElement && imageName) {
    imageElement.src = `../../public/images/${encodeURIComponent(imageName)}`;
    imageElement.alt = productName;
  }
  const name = productRow?.querySelector("strong");
  const price = productRow?.querySelector(".price");
  if (name) name.textContent = productName;
  if (price) {
    price.textContent = [
      params.get("variant"),
      params.get("color"),
      `Qty ${params.get("quantity") || 1}`
    ].filter(Boolean).join(" • ");
  }
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  if (subject) subject.value = `Inquiry about ${productName}`;
  if (message) message.value = params.get("notes") || "";

  if (params.get("new") === "1" && localStorage.getItem("floraAvenueSignedIn") === "true") {
    startInquiry();
  }
}

function startInquiry() {
  if (localStorage.getItem("floraAvenueSignedIn") !== "true" || !getCustomerEmail()) {
    localStorage.setItem("floraAvenuePendingAction", JSON.stringify({
      action: "inquiry",
      intent: "new-inquiry",
      url: window.location.href
    }));
    window.location.href = "../../pages/login/login.html";
    return;
  }

  localStorage.removeItem("floraAvenuePendingAction");
  showScreen("formScreen");
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.classList.toggle("active", screen.id === screenId);
  });
  const detailsScreen = document.getElementById("detailsScreen");
  detailsScreen?.setAttribute("aria-hidden", String(screenId !== "detailsScreen"));
  if (screenId === "inquiriesScreen") {
    renderInquiries("All");
  }
}

function closeInquiryDetails() {
  currentInquiry = null;
  const params = new URLSearchParams(window.location.search);
  params.delete("reference");
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  showScreen("inquiriesScreen");
}

document.getElementById("backToInquiries")?.addEventListener("click", function (event) {
  event.preventDefault();
  closeInquiryDetails();
});

function getCustomerName(email) {
  const profileKey = `floraAvenueProfile:${encodeURIComponent(email)}`;
  try {
    const profile = JSON.parse(localStorage.getItem(profileKey) || "null");
    if (profile && typeof profile.name === "string" && profile.name.trim()) {
      return profile.name.trim();
    }
  } catch (error) {
    console.warn("Unable to load the customer name for the inquiry.", error);
  }
  return "Customer";
}

function submitInquiry() {
  const customerEmail = getCustomerEmail();
  if (localStorage.getItem("floraAvenueSignedIn") !== "true" || !customerEmail) {
    startInquiry();
    return;
  }

  const type = document.getElementById("inquiryType").value;
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!type || !subject || !message) {
    alert("Please complete Inquiry Type, Subject, and Your Message.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const now = new Date();
  currentInquiry = {
    reference: `INQ-${now.getFullYear()}-${String(Date.now()).slice(-8)}`,
    date: now.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }),
    status: "Pending",
    image: params.get("image")
      ? `../../public/images/${encodeURIComponent(params.get("image"))}`
      : "",
    product: params.get("product") || "",
    type: type,
    subject: subject,
    message: message,
    response: "",
    conversation: [{
      sender: "Customer",
      message: message,
      sentAt: now.toISOString()
    }],
    customerEmail: customerEmail,
    customerName: getCustomerName(customerEmail),
    hideCustomizationDetails: params.get("new") === "1" || !params.get("product"),
    productId: params.get("id") || "",
    variant: params.get("variant") || "",
    color: params.get("color") || "",
    quantity: params.get("quantity") || "1",
    addons: params.get("addons") || "",
    notes: params.get("notes") || "",
    createdAt: now.toISOString()
  };

  inquiries = inquiryStore.load();
  inquiries.unshift(currentInquiry);
  try {
    inquiryStore.save(inquiries);
  } catch (error) {
    alert("Unable to submit your inquiry. Please try again.");
    return;
  }

  document.getElementById("inquiryType").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";
  document.getElementById("submittedRef").textContent = currentInquiry.reference;
  showScreen("submittedScreen");
}

function showDetails(inquiry = currentInquiry, screenId = "detailsScreen") {
  if (!inquiry) return;
  if (localStorage.getItem("floraAvenueSignedIn") !== "true"
      || getCustomerEmail() !== inquiry.customerEmail?.toLowerCase()) {
    return;
  }
  currentInquiry = inquiry;
  document.getElementById("detailRef").textContent = inquiry.reference;
  const hasProduct = Boolean(inquiry.product && inquiry.product !== "General inquiry");
  document.getElementById("detailProductLabel").hidden = !hasProduct;
  document.getElementById("detailProductName").hidden = !hasProduct;
  document.getElementById("detailProductName").textContent = inquiry.product || "";
  document.getElementById("detailInquiryType").textContent = inquiry.type || "Not specified";
  document.getElementById("detailSubject").textContent = inquiry.subject || "Not provided";
  const showCustomizationDetails = !inquiry.hideCustomizationDetails
    && Boolean(inquiry.product)
    && inquiry.product !== "General inquiry";
  document.getElementById("inquiryCustomizationDetails").hidden = !showCustomizationDetails;
  document.getElementById("detailVariant").textContent = inquiry.variant || "Not specified";
  document.getElementById("detailColor").textContent = inquiry.color || "Not specified";
  document.getElementById("detailQuantity").textContent = inquiry.quantity || "Not specified";
  document.getElementById("detailAddons").textContent = inquiry.addons || "None";
  document.getElementById("detailDate").textContent = inquiry.date || "";
  renderCustomerConversation(inquiry);

  const imageElement = document.getElementById("detailInquiryProductImage");
  if (imageElement) {
    const hasProductImage = Boolean(inquiry.product && inquiry.image);
    imageElement.hidden = !hasProductImage;
    if (hasProductImage) {
      imageElement.src = inquiry.image;
      imageElement.alt = inquiry.product;
    }
  }
  const orderAction = document.getElementById("inquiryOrderAction");
  if (orderAction) {
    const relatedOrder = window.floraAvenueCustomerOrders.load().find(function (order) {
      return window.floraAvenueCustomerOrders.belongsToCustomer(order)
        && order.sourceInquiryReference === inquiry.reference;
    });
    const orderReference = inquiry.orderReference || relatedOrder?.reference;
    if (orderReference) {
      orderAction.href = `../orders/order%20details.html?order=${encodeURIComponent(orderReference)}`;
      orderAction.textContent = "View Related Order";
    } else {
      const customizationParams = new URLSearchParams({
        sourceInquiry: inquiry.reference,
        id: inquiry.productId || "customization-request",
        product: inquiry.product || inquiry.subject || "Custom Request",
        design: inquiry.product || inquiry.subject || "",
        image: imageFileName(inquiry.image) || "custom-bouquet.jpeg",
        variant: inquiry.variant || "",
        quantity: inquiry.quantity || "1",
        items: inquiry.quantity || "",
        color: inquiry.color || "",
        addons: inquiry.addons || "",
        notes: inquiry.notes || "",
        message: inquiry.message || "",
        response: inquiry.response || ""
      });
      orderAction.href = `../products/customization.html?${customizationParams.toString()}`;
      orderAction.textContent = "Proceed With Order";
    }
  }
  showScreen(screenId);
}

function renderCustomerConversation(inquiry) {
  const thread = document.getElementById("customerConversation");
  const input = document.getElementById("customerReplyInput");
  const sendButton = document.getElementById("customerSendReply");
  const feedback = document.getElementById("customerReplyFeedback");
  if (!thread || !input || !sendButton || !feedback) return;

  thread.replaceChildren();
  inquiry.conversation?.forEach(function (message) {
    const entry = document.createElement("article");
    entry.className = `conversation-message ${message.sender === "Customer" ? "from-customer" : "from-seller"}`;
    const header = document.createElement("div");
    header.className = "conversation-message-header";
    const sender = document.createElement("strong");
    sender.textContent = message.sender;
    const sentAt = document.createElement("time");
    sentAt.dateTime = message.sentAt;
    sentAt.textContent = inquiryStore.formatMessageDate(message.sentAt);
    const body = document.createElement("p");
    body.textContent = message.message;
    header.append(sender, sentAt);
    entry.append(header, body);
    thread.appendChild(entry);
  });

  const isResolved = inquiry.status === "Resolved";
  const canReply = localStorage.getItem("floraAvenueSignedIn") === "true"
    && getCustomerEmail() === inquiry.customerEmail?.toLowerCase()
    && !isResolved;
  input.disabled = !canReply;
  sendButton.disabled = !canReply;
  feedback.textContent = isResolved
    ? "This inquiry is resolved and no longer accepts replies."
    : "";
}

document.getElementById("customerSendReply")?.addEventListener("click", function () {
  const feedback = document.getElementById("customerReplyFeedback");
  const input = document.getElementById("customerReplyInput");
  if (!currentInquiry || !feedback || !input) return;
  if (localStorage.getItem("floraAvenueSignedIn") !== "true"
      || getCustomerEmail() !== currentInquiry.customerEmail?.toLowerCase()) {
    feedback.textContent = "Sign in to the customer account that submitted this inquiry to reply.";
    return;
  }

  try {
    currentInquiry = inquiryStore.addMessage(
      currentInquiry.reference,
      "Customer",
      input.value
    );
    inquiries = inquiryStore.load();
    input.value = "";
    showDetails(currentInquiry);
    feedback.textContent = "Your reply has been sent.";
  } catch (error) {
    feedback.textContent = error.message || "Unable to send your reply. Please try again.";
  }
});

function renderInquiries(filter = "All") {
  const list = document.getElementById("inquiryList");
  if (!list) return;
  list.replaceChildren();
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.status === filter);
  });

  const customerEmail = getCustomerEmail();
  const allCustomerInquiries = inquiries.filter(function (inquiry) {
    return inquiry.customerEmail?.toLowerCase() === customerEmail;
  });
  const respondedCount = allCustomerInquiries.filter(hasUnreadSellerReply).length;
  const respondedBadge = document.getElementById("respondedInquiryCount");
  if (respondedBadge) {
    respondedBadge.textContent = respondedCount ? String(respondedCount) : "";
    respondedBadge.hidden = respondedCount === 0;
    respondedBadge.setAttribute("aria-label", `${respondedCount} seller ${respondedCount === 1 ? "reply" : "replies"}`);
  }
  const customerInquiries = allCustomerInquiries.filter(function (inquiry) {
    return filter === "All" || inquiry.status === filter;
  });

  if (customerInquiries.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "inquiry-empty";
    if (localStorage.getItem("floraAvenueSignedIn") !== "true" || !customerEmail) {
      const signInLink = document.createElement("a");
      signInLink.className = "inquiry-sign-in-link";
      signInLink.href = "../login/login.html";
      signInLink.textContent = "Sign in";
      emptyState.append(signInLink, document.createTextNode(" to continue."));
    } else {
      emptyState.textContent = "You have no inquiries yet.";
    }
    list.appendChild(emptyState);
    return;
  }

  customerInquiries.forEach(function (inquiry) {
    const item = document.createElement("button");
    item.className = "inquiry-item";
    item.type = "button";
    item.dataset.status = inquiry.status;
    item.addEventListener("click", function () {
      showDetails(inquiry);
    });

    if (inquiry.product && inquiry.image) {
      const imageWrap = document.createElement("span");
      imageWrap.className = "item-img";
      const image = document.createElement("img");
      image.src = inquiry.image;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      imageWrap.appendChild(image);
      item.appendChild(imageWrap);
    }

    const info = document.createElement("span");
    info.className = "item-info";
    const reference = document.createElement("strong");
    reference.textContent = inquiry.subject || inquiry.product || "General inquiry";
    const type = document.createElement("span");
    type.textContent = inquiry.type || "General inquiry";
    const inquiryReference = document.createElement("span");
    inquiryReference.textContent = inquiry.reference;
    const date = document.createElement("span");
    date.textContent = inquiry.date;
    info.append(reference, type, inquiryReference, date);

    const statusGroup = document.createElement("span");
    statusGroup.className = "inquiry-status-group";
    if (hasUnreadSellerReply(inquiry)) {
      const replyCount = document.createElement("span");
      replyCount.className = "inquiry-response-count";
      replyCount.textContent = "1";
      replyCount.setAttribute("aria-label", "New seller reply");
      statusGroup.appendChild(replyCount);
    }
    const status = document.createElement("span");
    status.className = `inquiry-status ${String(inquiry.status).toLowerCase()}`;
    status.textContent = inquiry.status;
    statusGroup.appendChild(status);

    item.append(info, statusGroup);
    list.appendChild(item);
  });
}

document.querySelectorAll(".tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    renderInquiries(tab.dataset.status);
  });
});

function goHome() {
  window.location.href = "../../index.html";
}

document.querySelector(".new-inquiry-button")?.addEventListener("click", startInquiry);

renderInquiries();
loadProductInquiryDetails();
const inquiryReference = new URLSearchParams(window.location.search).get("reference");
if (inquiryReference) {
  const linkedInquiry = inquiries.find(function (inquiry) {
    return inquiry.reference === inquiryReference
      && inquiry.customerEmail?.toLowerCase() === getCustomerEmail();
  });
  if (linkedInquiry) showDetails(linkedInquiry);
}

try {
  const pendingAction = JSON.parse(localStorage.getItem("floraAvenuePendingAction"));
  if (
    pendingAction?.action === "inquiry"
    && pendingAction?.intent === "new-inquiry"
    && localStorage.getItem("floraAvenueSignedIn") === "true"
  ) {
    startInquiry();
  }
} catch (error) {
  localStorage.removeItem("floraAvenuePendingAction");
  console.warn("Unable to resume the inquiry action.", error);
}

function refreshInquiries() {
  inquiries = inquiryStore.load();
  if (document.getElementById("inquiriesScreen").classList.contains("active")) {
    const activeFilter = document.querySelector(".tab.active")?.dataset.status || "All";
    renderInquiries(activeFilter);
  }
  if (currentInquiry) {
    const updated = inquiries.find(function (inquiry) {
      return inquiry.reference === currentInquiry.reference
        && inquiry.customerEmail?.toLowerCase() === getCustomerEmail()
        && localStorage.getItem("floraAvenueSignedIn") === "true";
    });
    if (updated) {
      showDetails(updated);
    } else {
      currentInquiry = null;
      showScreen("inquiriesScreen");
    }
  }
}

window.addEventListener("storage", function (event) {
  if (["floraAvenueInquiries", "floraAvenueSignedIn", "floraAvenueUserEmail"].includes(event.key)) {
    refreshInquiries();
  }
});
window.addEventListener("floraAvenueInquiriesChanged", refreshInquiries);
