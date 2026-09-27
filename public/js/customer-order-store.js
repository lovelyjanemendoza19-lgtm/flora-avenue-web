(function () {
  const storageKey = "floraAvenueOrders";

  function getCustomerEmail() {
    try {
      if (localStorage.getItem("floraAvenueSignedIn") !== "true") return "";
      return (localStorage.getItem("floraAvenueUserEmail") || "").trim().toLowerCase();
    } catch (error) {
      console.error("Unable to read the signed-in customer account.", error);
      return "";
    }
  }

  function requireSignIn(returnUrl) {
    const email = getCustomerEmail();
    if (email) {
      try {
        const pendingAction = JSON.parse(localStorage.getItem("floraAvenuePendingAction") || "null");
        if (pendingAction?.url === window.location.href) {
          localStorage.removeItem("floraAvenuePendingAction");
        }
      } catch (error) {
        console.warn("Unable to clear the resumed order action.", error);
      }
      return true;
    }

    try {
      localStorage.setItem("floraAvenuePendingAction", JSON.stringify({
        action: "order",
        url: returnUrl || window.location.href
      }));
    } catch (error) {
      console.error("Unable to save the pending order action.", error);
      alert("Unable to continue on this device. Please check your browser storage settings.");
      return false;
    }

    window.location.href = "../../pages/login/login.html";
    return false;
  }

  function getCustomerName(email) {
    const profileKey = `floraAvenueProfile:${encodeURIComponent(email)}`;
    try {
      const profile = JSON.parse(localStorage.getItem(profileKey) || "null");
      if (profile && typeof profile.name === "string" && profile.name.trim()) {
        return profile.name.trim();
      }
    } catch (error) {
      console.warn("Unable to load the customer profile for an order.", error);
    }
    return "";
  }

  function getCustomerContact(email) {
    const profileKey = `floraAvenueProfile:${encodeURIComponent(email)}`;
    try {
      const profile = JSON.parse(localStorage.getItem(profileKey) || "null");
      return profile && typeof profile.contact === "string" ? profile.contact.trim() : "";
    } catch (error) {
      console.warn("Unable to load the customer contact for an order.", error);
      return "";
    }
  }

  function readStoredOrders() {
    const orders = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(orders)) {
      throw new Error("Saved orders are not a list.");
    }
    return orders.filter(order => order && typeof order === "object");
  }

  function load() {
    try {
      return readStoredOrders();
    } catch (error) {
      console.error("Unable to load saved orders.", error);
      return [];
    }
  }

  function belongsToCustomer(order, email = getCustomerEmail()) {
    const orderEmail = String(order.customerEmail || order.contactEmail || "")
      .trim()
      .toLowerCase();
    return Boolean(email && orderEmail === email);
  }

  function save(order) {
    try {
      const orders = readStoredOrders();
      orders.unshift(order);
      localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (error) {
      console.error("Unable to save the customer order.", error);
      throw error;
    }
  }

  function update(order) {
    try {
      const orders = readStoredOrders();
      const index = orders.findIndex(item => item.reference === order.reference);
      if (index < 0) {
        throw new Error("The order to update could not be found.");
      }
      orders[index] = order;
      localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (error) {
      console.error("Unable to update the customer order.", error);
      throw error;
    }
  }

  window.floraAvenueCustomerOrders = {
    getCustomerEmail,
    getCustomerName,
    getCustomerContact,
    requireSignIn,
    load,
    belongsToCustomer,
    save,
    update
  };
})();
