const defaultInquiries = [
  {
    reference: "INQ-2026-0521-0001",
    date: "May 21, 2026",
    status: "Responded",
    image: "../../public/images/eternal-rose.jpeg",
    message: "I would like to inquire if you can make this bouquet in pastel pink and add fairy lights.",
    response: "Yes, we can customize it in pastel pink and add fairy lights. The total price will be ₱450."
  },
  {
    reference: "INQ-2026-0518-0002",
    date: "May 18, 2026",
    status: "Accepted",
    image: "../../public/images/custom-bouquet.jpeg",
    message: "I would like to ask about the available customization options.",
    response: "Yes, customization is available."
  },
  {
    reference: "INQ-2026-0515-0001",
    date: "May 15, 2026",
    status: "Responded",
    image: "../../public/images/satin-rose.jpeg",
    message: "Is this item still available?",
    response: "Yes, the product is currently available."
  },
  {
    reference: "INQ-2026-0510-0001",
    date: "May 10, 2026",
    status: "New",
    image: "../../public/images/sunflower.jpeg",
    message: "I want to know more about this product.",
    response: ""
  }
];
let inquiries = loadInquiries();

function loadInquiries() {
  try {
    const saved = JSON.parse(localStorage.getItem("floraAvenueInquiries") || "null");
    return Array.isArray(saved) ? saved : defaultInquiries.slice();
  } catch (error) {
    console.warn("Unable to load saved inquiries.", error);
    return defaultInquiries.slice();
  }
}

function saveInquiries() {
  localStorage.setItem("floraAvenueInquiries", JSON.stringify(inquiries));
}

function loadProductInquiryDetails() {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get("product");
  if (!productName) return;
  const productRow = document.querySelector("#formScreen .product-row");
  const name = productRow?.querySelector("strong");
  const price = productRow?.querySelector(".price");
  if (name) name.textContent = productName;
  if (price) price.textContent = [params.get("variant"), params.get("color"), `Qty ${params.get("quantity") || 1}`].filter(Boolean).join(" • ");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  if (subject) subject.value = `Inquiry about ${productName}`;
  if (message) message.value = [params.get("notes"), params.get("addons") ? `Add-ons: ${params.get("addons")}` : ""].filter(Boolean).join("\n");

  if (params.get("new") === "1" && localStorage.getItem("floraAvenueSignedIn") === "true") {
    startInquiry();
  }
}

function startInquiry() {
  if (localStorage.getItem("floraAvenueSignedIn") !== "true") {
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

let currentInquiry = inquiries[0];

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(function (screen) {
    screen.classList.toggle("active", screen.id === screenId);
  });
  if (screenId === "inquiriesScreen") {
    renderInquiries("All");
  }
}

function submitInquiry() {
  const type = document.getElementById("inquiryType").value;
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!type || !subject || !message) {
    alert("Please complete Inquiry Type, Subject, and Your Message.");
    return;
  }

  currentInquiry = {
    reference: `INQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    status: "New",
    image: new URLSearchParams(window.location.search).get("image")
      ? `../../public/images/${encodeURIComponent(new URLSearchParams(window.location.search).get("image"))}`
      : "../../public/images/custom-bouquet.jpeg",
    product: new URLSearchParams(window.location.search).get("product") || "",
    type,
    subject,
    message,
    response: ""
  };
  inquiries.unshift(currentInquiry);
  saveInquiries();
  document.getElementById("inquiryType").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";
  document.getElementById("submittedRef").textContent = currentInquiry.reference;
  showScreen("submittedScreen");
}

function showDetails(inquiry = currentInquiry, screenId = "detailsScreen") {
  currentInquiry = inquiry;
  document.getElementById("detailRef").textContent = inquiry.reference;
  document.getElementById("detailDate").textContent = inquiry.date;
  document.getElementById("detailMessage").textContent = inquiry.message;
  document.getElementById("detailResponse").textContent = inquiry.response || "We will respond to your inquiry as soon as possible.";
  showScreen(screenId);
}

function renderInquiries(filter = "All") {
  const list = document.getElementById("inquiryList");
  if (!list) return;
  list.innerHTML = "";
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.classList.toggle("active", tab.dataset.status === filter);
  });

  inquiries.filter(function (inquiry) {
    return filter === "All" || inquiry.status === filter;
  }).forEach(function (inquiry) {
    const item = document.createElement("div");
    item.className = "inquiry-item";
    item.dataset.status = inquiry.status;
    item.onclick = function () { showDetails(inquiry); };
    item.innerHTML = `
      <div class="item-img"><img src="${inquiry.image}" alt=""></div>
      <div class="item-info">
        <strong>${inquiry.reference}</strong>
        <span>${inquiry.date}</span>
      </div>
      <span class="inquiry-status ${inquiry.status.toLowerCase()}">${inquiry.status}</span>
    `;
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