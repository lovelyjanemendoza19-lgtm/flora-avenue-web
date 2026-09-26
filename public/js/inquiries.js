const inquiryStore = window.floraAvenueInquiryStore;
let inquiries = inquiryStore.load();
let currentInquiry = null;

function getCustomerEmail() {
  return (localStorage.getItem("floraAvenueUserEmail") || "").trim().toLowerCase();
}

function loadProductInquiryDetails() {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get("product");
  const productRow = document.querySelector("#formScreen .product-row");
  if (!productName) {
    if (productRow) productRow.hidden = true;
    return;
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
  if (message) {
    message.value = [
      params.get("notes"),
      params.get("addons") ? `Add-ons: ${params.get("addons")}` : ""
    ].filter(Boolean).join("\n");
  }

  if (params.get("new") === "1" && localStorage.getItem("floraAvenueSignedIn") === "true") {
    startInquiry();
  }
}

function startInquiry() {
  if (localStorage.getItem("floraAvenueSignedIn") !== "true" || !getCustomerEmail()) {
    localStorage.setItem("floraAvenuePendingAction", JSON.stringify({
      action: "inquiry",
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
  if (screenId === "inquiriesScreen") {
    renderInquiries("All");
  }
}

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
    status: "New",
    image: params.get("image")
      ? `../../public/images/${encodeURIComponent(params.get("image"))}`
      : "../../public/images/custom-bouquet.jpeg",
    product: params.get("product") || "",
    type: type,
    subject: subject,
    message: message,
    response: "",
    customerEmail: customerEmail,
    customerName: getCustomerName(customerEmail),
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
  currentInquiry = inquiry;
  document.getElementById("detailRef").textContent = inquiry.reference;
  document.getElementById("detailDate").textContent = inquiry.date || "";
  document.getElementById("detailMessage").textContent = inquiry.message;
  document.getElementById("detailResponseDate").textContent = inquiry.respondedAt || "";
  document.getElementById("detailResponse").textContent =
    inquiry.response || "We will respond to your inquiry as soon as possible.";

  const productRow = document.querySelector("#detailsScreen .product-row");
  if (productRow) productRow.hidden = !inquiry.product;
  const productName = productRow?.querySelector("strong");
  const productPrice = productRow?.querySelector(".price");
  if (productName) productName.textContent = inquiry.product || inquiry.subject;
  if (productPrice) productPrice.textContent = inquiry.type || "";

  const imageElement = document.getElementById("detailInquiryProductImage");
  if (imageElement) {
    imageElement.src = inquiry.image || "../../public/images/custom-bouquet.jpeg";
    imageElement.alt = inquiry.product || "Selected product";
  }
  showScreen(screenId);
}

function renderInquiries(filter = "All") {
  const list = document.getElementById("inquiryList");
  if (!list) return;
  list.replaceChildren();
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.status === filter);
  });

  const customerEmail = getCustomerEmail();
  const customerInquiries = inquiries.filter(function (inquiry) {
    return inquiry.customerEmail?.toLowerCase() === customerEmail
      && (filter === "All" || inquiry.status === filter);
  });

  if (customerInquiries.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "inquiry-empty";
    emptyState.textContent = "You have no inquiries yet.";
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

    const imageWrap = document.createElement("span");
    imageWrap.className = "item-img";
    const image = document.createElement("img");
    image.src = inquiry.image || "../../public/images/custom-bouquet.jpeg";
    image.alt = "";
    imageWrap.appendChild(image);

    const info = document.createElement("span");
    info.className = "item-info";
    const reference = document.createElement("strong");
    reference.textContent = inquiry.reference;
    const date = document.createElement("span");
    date.textContent = inquiry.date || "";
    info.append(reference, date);

    const status = document.createElement("span");
    status.className = `inquiry-status ${String(inquiry.status).toLowerCase()}`;
    status.textContent = inquiry.status;

    item.append(imageWrap, info, status);
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
document.querySelector("#detailsScreen .primary")?.addEventListener("click", function () {
  alert("We will help you proceed with an order soon.");
});

renderInquiries();
loadProductInquiryDetails();

try {
  const pendingAction = JSON.parse(localStorage.getItem("floraAvenuePendingAction"));
  if (pendingAction?.action === "inquiry" && localStorage.getItem("floraAvenueSignedIn") === "true") {
    startInquiry();
  }
} catch (error) {
  localStorage.removeItem("floraAvenuePendingAction");
  console.warn("Unable to resume the inquiry action.", error);
}

window.addEventListener("storage", function (event) {
  if (event.key === "floraAvenueInquiries") {
    inquiries = inquiryStore.load();
    if (document.getElementById("inquiriesScreen").classList.contains("active")) {
      renderInquiries();
    }
    if (currentInquiry) {
      const updated = inquiries.find(function (inquiry) {
        return inquiry.reference === currentInquiry.reference;
      });
      if (updated) showDetails(updated);
    }
  }
});
