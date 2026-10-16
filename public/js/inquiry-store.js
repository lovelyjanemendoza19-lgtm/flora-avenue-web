(function () {
  const storageKey = "floraAvenueInquiries";
  const sampleReferences = new Set([
    "INQ-2026-0521-0001",
    "INQ-2026-0518-0002",
    "INQ-2026-0515-0001",
    "INQ-2026-0510-0001"
  ]);

  function notifyInquiriesChanged() {
    window.dispatchEvent(new Event("floraAvenueInquiriesChanged"));
  }

  function normalizeStatus(status, hasSellerResponse) {
    if (status === "Resolved" || status === "Responded" || status === "Pending") {
      return status;
    }
    return hasSellerResponse ? "Responded" : "Pending";
  }

  function parseMessageDate(value) {
    let date = new Date(value);
    if (Number.isNaN(date.getTime()) && typeof value === "string") {
      date = new Date(value.replace(/\s+at\s+/, " "));
    }
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function normalizeMessageDate(value) {
    const date = parseMessageDate(value);
    return date ? date.toISOString() : typeof value === "string" ? value : "";
  }

  function normalizeConversation(inquiry) {
    const conversation = Array.isArray(inquiry.conversation)
      ? inquiry.conversation.filter(function (message) {
        return message
          && (message.sender === "Customer" || message.sender === "Seller")
          && typeof message.message === "string"
          && message.message.trim();
      }).map(function (message) {
        return {
          sender: message.sender,
          message: message.message.trim(),
          sentAt: normalizeMessageDate(message.sentAt)
        };
      })
      : [];

    const initialMessage = typeof inquiry.message === "string" ? inquiry.message.trim() : "";
    if (initialMessage && !conversation.some(function (message) {
      return message.sender === "Customer" && message.message === initialMessage;
    })) {
      conversation.push({
        sender: "Customer",
        message: initialMessage,
        sentAt: normalizeMessageDate(inquiry.createdAt || inquiry.date || "")
      });
    }

    const initialResponse = typeof inquiry.response === "string" ? inquiry.response.trim() : "";
    if (initialResponse && !conversation.some(function (message) {
      return message.sender === "Seller" && message.message === initialResponse;
    })) {
      conversation.push({
        sender: "Seller",
        message: initialResponse,
        sentAt: normalizeMessageDate(inquiry.respondedAt || inquiry.createdAt || inquiry.date || "")
      });
    }

    conversation.sort(function (left, right) {
      const leftTime = parseMessageDate(left.sentAt)?.getTime() || 0;
      const rightTime = parseMessageDate(right.sentAt)?.getTime() || 0;
      return leftTime - rightTime;
    });
    return conversation;
  }

  function normalizeInquiry(inquiry) {
    const conversation = normalizeConversation(inquiry);
    const hasSellerResponse = conversation.some(function (message) {
      return message.sender === "Seller";
    });
    return {
      ...inquiry,
      conversation: conversation,
      status: normalizeStatus(inquiry.status, hasSellerResponse)
    };
  }

  function load() {
    let inquiries;
    try {
      const storedInquiries = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(storedInquiries)) {
        console.warn("Saved inquiries are not a list; showing an empty inquiry list.");
        return [];
      }
      inquiries = storedInquiries;
    } catch (error) {
      console.warn("Unable to load saved inquiries.", error);
      return [];
    }

    const currentInquiries = inquiries.filter(function (inquiry) {
      return inquiry && typeof inquiry === "object" && !sampleReferences.has(inquiry.reference);
    }).map(normalizeInquiry);
    if (JSON.stringify(currentInquiries) !== JSON.stringify(inquiries)) {
      save(currentInquiries);
    }
    return currentInquiries;
  }

  function save(inquiries) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(inquiries));
      notifyInquiriesChanged();
    } catch (error) {
      console.error("Unable to save inquiries.", error);
      throw error;
    }
  }

  function update(reference, updateInquiry) {
    const inquiries = load();
    let updatedInquiry = null;
    const updatedInquiries = inquiries.map(function (inquiry) {
      if (inquiry.reference !== reference) return inquiry;
      updatedInquiry = updateInquiry(inquiry);
      return updatedInquiry;
    });
    if (!updatedInquiry) {
      throw new Error("The inquiry could not be found.");
    }
    save(updatedInquiries);
    return updatedInquiry;
  }

  function addMessage(reference, sender, message) {
    const trimmedMessage = String(message || "").trim();
    if (!trimmedMessage) {
      throw new Error("Enter a message before sending.");
    }
    if (sender !== "Customer" && sender !== "Seller") {
      throw new Error("The message sender is invalid.");
    }

    return update(reference, function (inquiry) {
      if (inquiry.status === "Resolved") {
        throw new Error("This inquiry is resolved and no longer accepts replies.");
      }
      const sentAt = new Date().toISOString();
      const conversation = normalizeConversation(inquiry);
      conversation.push({ sender: sender, message: trimmedMessage, sentAt: sentAt });
      const updatedInquiry = {
        ...inquiry,
        conversation: conversation,
        status: sender === "Seller" ? "Responded" : "Pending"
      };
      if (sender === "Seller") {
        updatedInquiry.response = trimmedMessage;
        updatedInquiry.respondedAt = sentAt;
      }
      return updatedInquiry;
    });
  }

  function setStatus(reference, status) {
    if (!["Pending", "Responded", "Resolved"].includes(status)) {
      throw new Error("The inquiry status is invalid.");
    }
    return update(reference, function (inquiry) {
      return { ...inquiry, status: status };
    });
  }

  function formatMessageDate(value) {
    const date = parseMessageDate(value);
    if (!date) return "Date unavailable";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  window.floraAvenueInquiryStore = {
    load: load,
    save: save,
    addMessage: addMessage,
    setStatus: setStatus,
    formatMessageDate: formatMessageDate
  };
})();
