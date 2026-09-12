const inquiries = [
  {
    ref: "INQ-2026-0521-0001",
    date: "May 21, 2026",
    status: "Responded",
    message: "I would like to inquire if you can make this bouquet in pastel pink and add fairy lights."
  },
  {
    ref: "INQ-2026-0518-0002",
    date: "May 18, 2026",
    status: "Accepted",
    message: "I would like to ask about the available customization options."
  },
  {
    ref: "INQ-2026-0515-0001",
    date: "May 15, 2026",
    status: "Responded",
    message: "Is this item still available?"
  },
  {
    ref: "INQ-2026-0510-0001",
    date: "May 10, 2026",
    status: "New",
    message: "I want to know more about this product."
  }
];

let currentInquiry = inquiries[0];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  const screen = document.getElementById(id);
  if (screen) {
    screen.classList.add("active");
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

  const inquiryNumber = String(inquiries.length + 1).padStart(4, "0");
  const submittedInquiry = {
    ref: `INQ-2026-0521-${inquiryNumber}`,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    status: "New",
    message
  };

  inquiries.unshift(submittedInquiry);
  currentInquiry = submittedInquiry;

  document.getElementById("submittedRef").textContent = currentInquiry.ref;
  document.getElementById("detailRef").textContent = currentInquiry.ref;
  document.getElementById("detailMessage").textContent = currentInquiry.message;

  document.getElementById("inquiryType").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";

  showScreen("submittedScreen");
}

function showDetails(inquiry = currentInquiry) {
  currentInquiry = inquiry;

  document.getElementById("detailRef").textContent = inquiry.ref;
  document.getElementById("submittedRef").textContent = inquiry.ref;
  document.getElementById("detailMessage").textContent = inquiry.message;

  showScreen("detailsScreen");
}

function renderInquiries() {
  const list = document.getElementById("inquiryList");
  if (!list) {
    return;
  }

  list.innerHTML = "";

  inquiries.forEach(inquiry => {
    const item = document.createElement("div");
    item.className = "inquiry-item";
    item.dataset.status = inquiry.status;
    item.onclick = () => showDetails(inquiry);

    const statusClass = inquiry.status.toLowerCase();

    item.innerHTML = `
      <div class="item-img">💐</div>
      <div class="item-info">
        <strong>${inquiry.ref}</strong>
        <span>${inquiry.date}</span>
      </div>
      <span class="inquiry-status ${statusClass}">${inquiry.status}</span>
      <div class="chevron">›</div>
    `;

    list.appendChild(item);
  });
}

function filterInquiries(status, activeTab) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab === activeTab);
  });

  document.querySelectorAll(".inquiry-item").forEach(item => {
    const itemStatus = item.dataset.status;
    item.hidden = status !== "All" && itemStatus !== status;
  });
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", function () {
    filterInquiries(tab.textContent.trim(), tab);
  });
});

function goHome() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.textContent.trim() === "All");
  });
  renderInquiries();
  showScreen("inquiriesScreen");
}

renderInquiries();
