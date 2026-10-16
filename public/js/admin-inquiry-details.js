(function () {
  const store = window.floraAvenueInquiryStore;
  const params = new URLSearchParams(window.location.search);
  const reference = params.get("reference");
  const title = document.getElementById("adminInquiryTitle");
  const customer = document.getElementById("adminInquiryCustomer");
  const received = document.getElementById("adminInquiryReceived");
  const status = document.getElementById("adminInquiryStatus");
  const product = document.getElementById("adminInquiryProduct");
  const conversationThread = document.getElementById("adminConversation");
  const statusControl = document.getElementById("adminInquiryStatusControl");
  const response = document.getElementById("adminReplyMessage");
  const feedback = document.getElementById("inquiryResponseFeedback");
  const sendButton = document.getElementById("sendResponse");
<<<<<<< HEAD
  let inquiry = store.load().find(function (item) {
=======
  let isEditingResponse = false;
  let inquiries = store.load();
  let inquiry = inquiries.find(function (item) {
>>>>>>> c7b1bff56b366454db02bf6abf1b51471f8c8d1b
    return item.reference === reference;
  });

  function appendConversationMessage(message) {
    const entry = document.createElement("article");
    entry.className = `admin-conversation-message from-${message.sender.toLowerCase()}`;
    const header = document.createElement("header");
    const sender = document.createElement("strong");
    sender.textContent = message.sender;
    const sentAt = document.createElement("time");
    sentAt.dateTime = message.sentAt;
    sentAt.textContent = store.formatMessageDate(message.sentAt);
    const body = document.createElement("p");
    body.textContent = message.message;
    header.append(sender, sentAt);
    entry.append(header, body);
    conversationThread.appendChild(entry);
  }

  function render() {
    if (!inquiry) return;
    title.textContent = inquiry.subject || inquiry.type || "Customer Inquiry";
    customer.textContent = `Customer: ${inquiry.customerName || "Customer"} (${inquiry.customerEmail || "Email unavailable"})`;
    received.textContent = `Received: ${inquiry.date || ""}`;
    status.textContent = inquiry.status;
    status.className = `figma-status ${inquiry.status.toLowerCase()}`;
    product.textContent = inquiry.product
      ? `Product: ${inquiry.product}`
      : `Type: ${inquiry.type || "General inquiry"}`;

    statusControl.value = inquiry.status;
    statusControl.disabled = false;
    conversationThread.replaceChildren();
    inquiry.conversation.forEach(appendConversationMessage);

    const isResolved = inquiry.status === "Resolved";
    response.disabled = isResolved;
    sendButton.disabled = isResolved;
    if (isResolved) {
      feedback.textContent = "This inquiry is resolved and no longer accepts replies.";
    } else if (feedback.textContent === "This inquiry is resolved and no longer accepts replies.") {
      feedback.textContent = "";
    }
  }

  if (!inquiry) {
    title.textContent = "Inquiry not found";
    customer.textContent = "";
    received.textContent = "";
    product.textContent = "";
    conversationThread.textContent = "This inquiry may have been removed.";
    statusControl.disabled = true;
    response.disabled = true;
    sendButton.disabled = true;
    return;
  }

<<<<<<< HEAD
  sendButton.addEventListener("click", function () {
    try {
      inquiry = store.addMessage(inquiry.reference, "Seller", response.value);
      response.value = "";
      render();
      feedback.textContent = "Reply sent.";
=======
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
>>>>>>> c7b1bff56b366454db02bf6abf1b51471f8c8d1b
    } catch (error) {
      feedback.textContent = error.message || "Unable to send the reply. Please try again.";
    }
  });

  statusControl.addEventListener("change", function () {
    try {
      inquiry = store.setStatus(inquiry.reference, statusControl.value);
      render();
      feedback.textContent = `Inquiry marked ${inquiry.status.toLowerCase()}.`;
    } catch (error) {
      feedback.textContent = error.message || "Unable to update inquiry status.";
      render();
    }
  });

  function refreshInquiry() {
    inquiry = store.load().find(function (item) {
      return item.reference === reference;
    });
    render();
  }

  window.addEventListener("storage", function (event) {
    if (event.key === "floraAvenueInquiries") refreshInquiry();
  });
  window.addEventListener("floraAvenueInquiriesChanged", refreshInquiry);

  render();
})();
