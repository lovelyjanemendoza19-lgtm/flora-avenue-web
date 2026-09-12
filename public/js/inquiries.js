// ========================================
// INQUIRY DATA
// ========================================

const inquiries = [
  {
    reference: "INQ-2026-0521-0001",
    date: "May 21, 2026",
    status: "Responded",
    message:
      "I would like to inquire if you can make this bouquet in pastel pink and add fairy lights.",
    response:
      "Yes, we can customize it in pastel pink and add fairy lights. The total price will be ₱450."
  },

  {
    reference: "INQ-2026-0518-0002",
    date: "May 18, 2026",
    status: "Accepted",
    message:
      "I would like to know if this bouquet is available.",
    response:
      "Yes, the product is currently available."
  },

  {
    reference: "INQ-2026-0515-0001",
    date: "May 15, 2026",
    status: "Responded",
    message:
      "Can I customize the color of the flowers?",
    response:
      "Yes, customization is available."
  },

  {
    reference: "INQ-2026-0510-0001",
    date: "May 10, 2026",
    status: "New",
    message:
      "I would like to ask about this product.",
    response:
      ""
  }
];


// ========================================
// SHOW SCREEN
// ========================================

function showScreen(screenId) {

  const screens = document.querySelectorAll(".screen");

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const selectedScreen = document.getElementById(screenId);

  if (selectedScreen) {
    selectedScreen.classList.add("active");
  }

  // Kapag My Inquiries ang screen,
  // automatic i-load ang list
  if (screenId === "inquiriesScreen") {
    filterInquiries("All");
  }
}


// ========================================
// GO HOME / BACK
// ========================================

function goHome() {

  // Kung may previous page,
  // babalik sa previous page.
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // fallback
    window.location.href = "../../index.html";
  }
}


// ========================================
// LOAD INQUIRIES
// ========================================

function loadInquiries(list = inquiries) {

  const inquiryList = document.getElementById("inquiryList");

  if (!inquiryList) {
    return;
  }

  inquiryList.innerHTML = "";

  if (list.length === 0) {

    inquiryList.innerHTML = `
      <div style="
        text-align:center;
        padding:40px 20px;
        color:#777;
        font-size:13px;
      ">
        No inquiries found.
      </div>
    `;

    return;
  }


  list.forEach((inquiry, index) => {

    const item = document.createElement("div");

    item.className = "inquiry-item";

    item.onclick = function () {
      showInquiryDetails(index);
    };


    let statusClass = "";

    if (inquiry.status === "Responded") {
      statusClass = "responded";
    }

    if (inquiry.status === "Accepted") {
      statusClass = "accepted";
    }


    item.innerHTML = `

      <div class="item-img">
        💐
      </div>

      <div class="item-info">

        <strong>
          ${inquiry.reference}
        </strong>

        <span>
          ${inquiry.date}
          ·
          <span class="${statusClass}">
            ${inquiry.status}
          </span>
        </span>

      </div>

      <div class="chevron">
        ›
      </div>

    `;


    inquiryList.appendChild(item);

  });

}


// ========================================
// FILTER INQUIRIES
// ========================================

function filterInquiries(status, button = null) {

  let filtered;

  if (status === "All") {

    filtered = inquiries;

  } else {

    filtered = inquiries.filter(
      inquiry => inquiry.status === status
    );

  }


  // Remove active sa lahat ng tabs
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.classList.remove("active");
  });


  // Lagyan ng active yung pinindot
  if (button) {
    button.classList.add("active");
  } else {

    // Kapag automatic load
    tabs.forEach(tab => {

      if (tab.dataset.status === status) {
        tab.classList.add("active");
      }

    });

  }


  loadInquiries(filtered);
}


// ========================================
// SHOW INQUIRY DETAILS
// ========================================

function showInquiryDetails(index) {

  const inquiry = inquiries[index];

  if (!inquiry) {
    return;
  }


  document.getElementById("detailRef").textContent =
    inquiry.reference;


  document.getElementById("detailDate").textContent =
    inquiry.date;


  document.getElementById("detailMessage").textContent =
    inquiry.message;


  showScreen("detailsScreen");
}


// ========================================
// SUBMIT INQUIRY
// ========================================

function submitInquiry() {

  const type =
    document.getElementById("inquiryType").value;

  const subject =
    document.getElementById("subject").value.trim();

  const message =
    document.getElementById("message").value.trim();


  // Validation
  if (!type) {

    alert("Please select an inquiry type.");

    return;
  }


  if (!subject) {

    alert("Please enter a subject.");

    return;
  }


  if (!message) {

    alert("Please enter your message.");

    return;
  }


  // Generate reference
  const reference =
    "INQ-" +
    new Date().getFullYear() +
    "-" +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    String(new Date().getDate()).padStart(2, "0") +
    "-0001";


  document.getElementById("submittedRef").textContent =
    reference;


  document.getElementById("detailRef").textContent =
    reference;


  document.getElementById("detailMessage").textContent =
    message;


  document.getElementById("detailDate").textContent =
    new Date().toLocaleString();


  showScreen("submittedScreen");
}


// ========================================
// VIEW MY INQUIRY
// ========================================

function showDetails() {

  showScreen("detailsScreen");

}


// ========================================
// PROCEED WITH ORDER
// ========================================

function proceedOrder() {

  alert("Proceed With Order clicked.");

}


// ========================================
// INITIAL LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  loadInquiries(inquiries);

});
