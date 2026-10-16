(function () {
  const list = document.getElementById("adminInquiryList");
  if (!list) return;

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  function render() {
    const inquiries = window.floraAvenueInquiryStore.load()
      .sort(function (left, right) {
        return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
      });
    list.replaceChildren();

    if (inquiries.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "figma-muted admin-inquiry-empty";
      emptyState.textContent = "No customer inquiries have been submitted yet.";
      list.appendChild(emptyState);
      return;
    }

    inquiries.forEach(function (inquiry) {
      const inquiryIdentifier = inquiry.reference || inquiry.inquiryId || inquiry.id;
      if (!inquiryIdentifier) {
        console.warn("Skipping an inquiry without a reference or ID.", inquiry);
        return;
      }
      const link = document.createElement("a");
      link.className = "figma-message";
      link.href = `inquiry-details.html?reference=${encodeURIComponent(inquiryIdentifier)}`;

      const header = document.createElement("div");
      header.className = "msg-head";
      const avatar = document.createElement("div");
      avatar.className = "figma-avatar-sm";
      avatar.textContent = (inquiry.customerName || "C")
        .split(/\s+/)
        .slice(0, 2)
        .map(function (part) { return part.charAt(0); })
        .join("")
        .toUpperCase();
      const customer = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = inquiry.customerName || "Customer";
      const time = document.createElement("div");
      time.className = "msg-time";
      const createdAt = new Date(inquiry.createdAt || inquiry.date);
      time.textContent = Number.isNaN(createdAt.getTime())
        ? inquiry.date || ""
        : dateFormatter.format(createdAt);
      customer.append(name, time);

      const status = document.createElement("span");
      status.className = `figma-status ${String(inquiry.status || "Pending").toLowerCase()}`;
      status.style.marginLeft = "auto";
      status.textContent = inquiry.status || "Pending";
      const statusGroup = document.createElement("span");
      statusGroup.className = "admin-inquiry-status-group";
      const conversation = Array.isArray(inquiry.conversation) ? inquiry.conversation : [];
      const hasUnreadCustomerReply = window.floraAvenueInquiryStore.countReplies(inquiry).customer > 0
        && conversation[conversation.length - 1]?.sender === "Customer";
      if (hasUnreadCustomerReply) {
        const replyCount = document.createElement("span");
        replyCount.className = "admin-inquiry-reply-count";
        replyCount.textContent = "1";
        replyCount.setAttribute("aria-label", "New customer reply");
        statusGroup.appendChild(replyCount);
      }
      statusGroup.appendChild(status);
      header.append(avatar, customer, statusGroup);

      const summary = document.createElement("p");
      summary.textContent = `${inquiry.subject || inquiry.type || "Customer inquiry"}\n${inquiry.message || ""}`;
      link.append(header, summary);
      list.appendChild(link);
    });
  }

  render();
  window.addEventListener("storage", function (event) {
    if (event.key === "floraAvenueInquiries") render();
  });
  window.addEventListener("floraAvenueInquiriesChanged", render);
})();
