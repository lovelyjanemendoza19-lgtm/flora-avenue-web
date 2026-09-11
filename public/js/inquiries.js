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
  document.getElementById(id).classList.add("active");
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
    ref: "INQ-2026-0521-0001",
    date: "May 21, 2026",
    status: "Responded",
    message
  };

  document.getElementById("submittedRef").textContent = currentInquiry.ref;
  document.getElementById("detailRef").textContent = currentInquiry.ref;
  document.getElementById("detailMessage").textContent = currentInquiry.message;

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
  list.innerHTML = "";

  inquiries.forEach(inquiry => {
    const item = document.createElement("div");
    item.className = "inquiry-item";
    item.onclick = () => showDetails(inquiry);

    const statusClass =
      inquiry.status.toLowerCase() === "accepted" ? "accepted" :
      inquiry.status.toLowerCase() === "responded" ? "responded" : "";

    item.innerHTML = `
      <div class="item-img">💐</div>
      <div class="item-info">
        <strong>${inquiry.ref}</strong>
        <span>${inquiry.date} · <span class="${statusClass}">${inquiry.status}</span></span>
      </div>
      <div class="chevron">›</div>
    `;

    list.appendChild(item);
  });
}

function goHome() {
  renderInquiries();
  showScreen("inquiriesScreen");
}

renderInquiries();
