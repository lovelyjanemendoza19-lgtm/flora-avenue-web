const inquiries = [
  {
    reference: "INQ-2026-0521-0001",
    date: "May 21, 2026",
    status: "Responded",
    message: "I would like to inquire if you can make this bouquet in pastel pink and add fairy lights.",
    response: "Yes, we can customize it in pastel pink and add fairy lights. The total price will be ₱450."
  },
  {
    reference: "INQ-2026-0518-0002",
    date: "May 18, 2026",
    status: "Accepted",
    message: "I would like to ask about the available customization options.",
    response: "Yes, customization is available."
  },
  {
    reference: "INQ-2026-0515-0001",
    date: "May 15, 2026",
    status: "Responded",
    message: "Is this item still available?",
    response: "Yes, the product is currently available."
  },
  {
    reference: "INQ-2026-0510-0001",
    date: "May 10, 2026",
    status: "New",
    message: "I want to know more about this product.",
    response: ""
  }
];

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
    reference: `INQ-2026-0521-${String(inquiries.length + 1).padStart(4, "0")}`,
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    status: "New",
    message,
    response: ""
  };
  inquiries.unshift(currentInquiry);
  document.getElementById("inquiryType").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";
  showDetails(currentInquiry, "submittedScreen");
}

function showDetails(inquiry = currentInquiry, screenId = "detailsScreen") {
  currentInquiry = inquiry;
  document.getElementById("submittedRef").textContent = inquiry.reference;
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
      <div class="item-img">💐</div>
      <div class="item-info">
        <strong>${inquiry.reference}</strong>
        <span>${inquiry.date}</span>
      </div>
      <span class="inquiry-status ${inquiry.status.toLowerCase()}">${inquiry.status}</span>
      <div class="chevron">›</div>
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
