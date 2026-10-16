(function () {
  const params = new URLSearchParams(window.location.search);
  const inquiryIdentifier = params.get("reference")
    || params.get("inquiryId")
    || params.get("id")
    || "";

  function showError(error) {
    console.error("Unable to initialize admin inquiry details.", error);
    const title = document.getElementById("adminInquiryTitle");
    if (title) title.textContent = "Unable to load inquiry";
    const thread = document.getElementById("adminConversation");
    if (thread) thread.textContent = "An error occurred while loading this inquiry. Please refresh the page or return to Manage Inquiries.";
    const doneButton = document.getElementById("markInquiryDone");
    const response = document.getElementById("adminReplyMessage");
    const sendButton = document.getElementById("sendResponse");
    if (doneButton) doneButton.disabled = true;
    if (response) response.disabled = true;
    if (sendButton) sendButton.disabled = true;
    const feedback = document.getElementById("inquiryResponseFeedback");
    if (feedback) feedback.textContent = "The inquiry could not be loaded.";
  }

  function getIdentifier(inquiry) {
    return String(inquiry.reference || inquiry.inquiryId || inquiry.id || "");
  }

  function getConversation(inquiry) {
    const source = Array.isArray(inquiry.conversation) && inquiry.conversation.length
      ? inquiry.conversation
      : Array.isArray(inquiry.messages)
        ? inquiry.messages
        : Array.isArray(inquiry.conversation)
          ? inquiry.conversation
          : [];
    const conversation = source
      .filter(message => message && typeof (message.message || message.text) === "string")
      .map(message => {
        const senderValue = String(message.sender || message.author || message.from || "Customer");
        const sender = /seller|admin|flora avenue/i.test(senderValue) ? "Seller" : "Customer";
        return {
          sender,
          message: String(message.message || message.text).trim(),
          sentAt: message.sentAt || message.createdAt || message.date || ""
        };
      })
      .filter(message => message.message);

    const initialMessages = [
      { sender: "Customer", message: inquiry.message || inquiry.initialMessage || "", sentAt: inquiry.createdAt || inquiry.date || "" },
      { sender: "Seller", message: inquiry.response || inquiry.reply || "", sentAt: inquiry.respondedAt || inquiry.updatedAt || inquiry.date || "" }
    ];
    initialMessages.forEach(initial => {
      if (typeof initial.message !== "string" || !initial.message.trim()) return;
      if (!conversation.some(message => message.sender === initial.sender && message.message === initial.message.trim())) {
        conversation.push({ ...initial, message: initial.message.trim() });
      }
    });

    return conversation.sort((left, right) => {
      const leftDate = new Date(left.sentAt).getTime();
      const rightDate = new Date(right.sentAt).getTime();
      return (Number.isNaN(leftDate) ? 0 : leftDate) - (Number.isNaN(rightDate) ? 0 : rightDate);
    });
  }

  function initialize() {
    const store = window.floraAvenueInquiryStore;
    const title = document.getElementById("adminInquiryTitle");
    const customer = document.getElementById("adminInquiryCustomer");
    const received = document.getElementById("adminInquiryReceived");
    const status = document.getElementById("adminInquiryStatus");
    const product = document.getElementById("adminInquiryProduct");
    const conversationThread = document.getElementById("adminConversation");
    const doneButton = document.getElementById("markInquiryDone");
    const response = document.getElementById("adminReplyMessage");
    const feedback = document.getElementById("inquiryResponseFeedback");
    const sendButton = document.getElementById("sendResponse");

    if (!store || typeof store.load !== "function" || typeof store.save !== "function") {
      throw new Error("The shared inquiry store is unavailable.");
    }
    if (![title, customer, received, status, product, conversationThread, doneButton, response, feedback, sendButton].every(Boolean)) {
      throw new Error("One or more inquiry detail page elements are missing.");
    }

    let inquiries = store.load();
    if (!Array.isArray(inquiries)) {
      throw new Error("The saved inquiry data is not a list.");
    }
    let inquiry = inquiries.find(item => getIdentifier(item) === inquiryIdentifier);

    if (!inquiryIdentifier || !inquiry) {
      title.textContent = "Inquiry not found";
      customer.textContent = "";
      received.textContent = "";
      product.textContent = "";
      conversationThread.textContent = "This inquiry may have been removed or the link is invalid.";
      status.textContent = "";
      doneButton.disabled = true;
      response.disabled = true;
      sendButton.disabled = true;
      return;
    }

    function appendConversationMessage(message) {
      const entry = document.createElement("article");
      entry.className = `admin-conversation-message from-${message.sender.toLowerCase()}`;
      const header = document.createElement("header");
      const sender = document.createElement("strong");
      sender.textContent = message.sender;
      const sentAt = document.createElement("time");
      sentAt.dateTime = message.sentAt;
      sentAt.textContent = store.formatMessageDate
        ? store.formatMessageDate(message.sentAt)
        : message.sentAt || "Date unavailable";
      const body = document.createElement("p");
      body.textContent = message.message;
      header.append(sender, sentAt);
      entry.append(header, body);
      conversationThread.appendChild(entry);
    }

    function render() {
      const currentStatus = ["Pending", "Responded", "Resolved"].includes(inquiry.status)
        ? inquiry.status
        : (getConversation(inquiry).some(message => message.sender === "Seller") ? "Responded" : "Pending");
      title.textContent = inquiry.subject || inquiry.title || inquiry.type || "Customer Inquiry";
      customer.textContent = `Customer: ${inquiry.customerName || inquiry.name || "Customer"} (${inquiry.customerEmail || inquiry.email || "Email unavailable"})`;
      received.textContent = `Received: ${inquiry.date || inquiry.createdAt || inquiry.timestamp || "Date unavailable"}`;
      status.textContent = currentStatus;
      status.className = `figma-status ${currentStatus.toLowerCase()}`;
      product.textContent = inquiry.product || inquiry.productName
        ? `Product: ${inquiry.product || inquiry.productName}`
        : `Type: ${inquiry.type || inquiry.inquiryType || "General inquiry"}`;

      conversationThread.replaceChildren();
      getConversation(inquiry).forEach(appendConversationMessage);

      const isResolved = currentStatus === "Resolved";
      doneButton.hidden = isResolved;
      doneButton.disabled = false;
      response.disabled = isResolved;
      sendButton.disabled = isResolved;
      feedback.textContent = isResolved
        ? "This inquiry is resolved and no longer accepts replies."
        : "";
    }

    function persistUpdatedInquiry(updatedInquiry) {
      inquiries = inquiries.map(item =>
        getIdentifier(item) === inquiryIdentifier ? updatedInquiry : item
      );
      store.save(inquiries);
      inquiry = updatedInquiry;
    }

    sendButton.addEventListener("click", function () {
      try {
        const conversationIsCanonical = Array.isArray(inquiry.conversation)
          && inquiry.conversation.every(message =>
            message
            && ["Customer", "Seller"].includes(message.sender)
            && typeof message.message === "string"
          );
        if (
          typeof store.addMessage === "function"
          && inquiry.reference
          && conversationIsCanonical
          && !(Array.isArray(inquiry.messages) && !inquiry.conversation.length)
        ) {
          inquiry = store.addMessage(inquiry.reference, "Seller", response.value);
        } else {
          const message = response.value.trim();
          if (!message) throw new Error("Enter a message before sending.");
          if (inquiry.status === "Resolved") throw new Error("This inquiry is resolved and no longer accepts replies.");
          const sentAt = new Date().toISOString();
          const updatedInquiry = {
            ...inquiry,
            conversation: [...getConversation(inquiry), { sender: "Seller", message, sentAt }],
            response: message,
            respondedAt: sentAt,
            status: "Responded"
          };
          persistUpdatedInquiry(updatedInquiry);
        }
        response.value = "";
        render();
        feedback.textContent = "Reply sent.";
      } catch (error) {
        console.error("Unable to send admin inquiry reply.", error);
        feedback.textContent = error.message || "Unable to send the reply. Please try again.";
      }
    });

    doneButton.addEventListener("click", function () {
      try {
        if (typeof store.setStatus === "function" && inquiry.reference) {
          inquiry = store.setStatus(inquiry.reference, "Resolved");
        } else {
          persistUpdatedInquiry({ ...inquiry, status: "Resolved" });
        }
        render();
        feedback.textContent = "Inquiry marked resolved.";
      } catch (error) {
        console.error("Unable to update admin inquiry status.", error);
        feedback.textContent = error.message || "Unable to update inquiry status.";
        render();
      }
    });

    function refreshInquiry() {
      try {
        inquiries = store.load();
        inquiry = inquiries.find(item => getIdentifier(item) === inquiryIdentifier);
        if (!inquiry) {
          title.textContent = "Inquiry not found";
          customer.textContent = "";
          received.textContent = "";
          product.textContent = "";
          conversationThread.textContent = "This inquiry may have been removed.";
          status.textContent = "";
          status.className = "figma-status";
          doneButton.hidden = true;
          doneButton.disabled = true;
          response.disabled = true;
          sendButton.disabled = true;
          return;
        }
        render();
      } catch (error) {
        showError(error);
      }
    }

    window.addEventListener("storage", event => {
      if (event.key === "floraAvenueInquiries") refreshInquiry();
    });
    window.addEventListener("floraAvenueInquiriesChanged", refreshInquiry);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      try {
        initialize();
      } catch (error) {
        showError(error);
      }
    }, { once: true });
  } else {
    try {
      initialize();
    } catch (error) {
      showError(error);
    }
  }
})();
