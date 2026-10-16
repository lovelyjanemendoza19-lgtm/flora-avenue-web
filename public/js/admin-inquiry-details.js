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
  let inquiry = store.load().find(function (item) {
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

  sendButton.addEventListener("click", function () {
    try {
      inquiry = store.addMessage(inquiry.reference, "Seller", response.value);
      response.value = "";
      render();
      feedback.textContent = "Reply sent.";
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
