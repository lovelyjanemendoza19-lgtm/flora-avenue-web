(function () {
  const store = window.floraAvenueInquiryStore;
  const params = new URLSearchParams(window.location.search);
  const reference = params.get("reference");
  const title = document.getElementById("adminInquiryTitle");
  const customer = document.getElementById("adminInquiryCustomer");
  const received = document.getElementById("adminInquiryReceived");
  const status = document.getElementById("adminInquiryStatus");
  const product = document.getElementById("adminInquiryProduct");
  const message = document.getElementById("adminInquiryMessage");
  const response = document.getElementById("inquiryResponse");
  const feedback = document.getElementById("inquiryResponseFeedback");
  const sendButton = document.getElementById("sendResponse");
  let isEditingResponse = false;
  let inquiries = store.load();
  let inquiry = inquiries.find(function (item) {
    return item.reference === reference;
  });

  if (!inquiry) {
    title.textContent = "Inquiry not found";
    customer.textContent = "";
    received.textContent = "";
    status.textContent = "";
    product.textContent = "";
    message.textContent = "This inquiry may have been removed.";
    response.disabled = true;
    sendButton.disabled = true;
    return;
  }

  function render() {
    title.textContent = inquiry.subject || inquiry.type || "Customer Inquiry";
    customer.textContent = `Customer: ${inquiry.customerName || "Customer"} (${inquiry.customerEmail || "Email unavailable"})`;
    received.textContent = `Received: ${inquiry.date || ""}`;
    status.textContent = inquiry.response ? "Responded" : inquiry.status || "New";
    status.className = `figma-status ${inquiry.response ? "verified" : "pending"}`;
    product.textContent = inquiry.product ? `Product: ${inquiry.product}` : `Type: ${inquiry.type || "General inquiry"}`;
    message.textContent = inquiry.message || "";
    response.value = inquiry.response || "";
    response.readOnly = Boolean(inquiry.response) && !isEditingResponse;
    sendButton.textContent = inquiry.response
      ? isEditingResponse ? "Save Changes" : "Edit Response"
      : "Send Response";
  }

  sendButton.addEventListener("click", function () {
    if (inquiry.response && !isEditingResponse) {
      isEditingResponse = true;
      render();
      response.focus();
      feedback.textContent = "Edit the response, then save your changes.";
      return;
    }

    const reply = response.value.trim();
    if (!reply) {
      feedback.textContent = "Please enter a response before sending.";
      return;
    }

    const isUpdatingResponse = Boolean(inquiry.response);
    const updatedInquiry = {
      ...inquiry,
      response: reply,
      status: "Responded",
      respondedAt: new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      })
    };
    inquiries = store.load().map(function (item) {
      return item.reference === reference ? updatedInquiry : item;
    });

    try {
      store.save(inquiries);
      inquiry = updatedInquiry;
      isEditingResponse = false;
      render();
      feedback.textContent = isUpdatingResponse
        ? "Response updated. The customer can see the changes in My Inquiries."
        : "Response sent. The customer can now see it in My Inquiries.";
    } catch (error) {
      feedback.textContent = "Unable to send the response. Please try again.";
    }
  });

  render();
})();
