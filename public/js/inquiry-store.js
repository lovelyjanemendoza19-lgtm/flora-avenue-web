(function () {
  const storageKey = "floraAvenueInquiries";
  const sampleReferences = new Set([
    "INQ-2026-0521-0001",
    "INQ-2026-0518-0002",
    "INQ-2026-0515-0001",
    "INQ-2026-0510-0001"
  ]);

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
    });
    if (currentInquiries.length !== inquiries.length) {
      save(currentInquiries);
    }
    return currentInquiries;
  }

  function save(inquiries) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(inquiries));
    } catch (error) {
      console.error("Unable to save inquiries.", error);
      throw error;
    }
  }

  window.floraAvenueInquiryStore = { load: load, save: save };
})();
