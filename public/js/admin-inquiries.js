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
      emptyState.className = "figma-muted";
      emptyState.textContent = "No customer inquiries have been submitted yet.";
      list.appendChild(emptyState);
      return;
    }

    inquiries.forEach(function (inquiry) {
      const link = document.createElement("a");
      link.className = "figma-message";
      link.href = `inquiry-details.html?reference=${encodeURIComponent(inquiry.reference)}`;

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
      status.className = `figma-status ${inquiry.response ? "verified" : "pending"}`;
      status.style.marginLeft = "auto";
      status.textContent = inquiry.response ? "Responded" : inquiry.status || "New";
      header.append(avatar, customer, status);

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
})();
