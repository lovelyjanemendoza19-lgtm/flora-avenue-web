(function () {
  const storageKey = "floraAvenueProductOverrides";
  const categories = {
    flowers: "Flowers & Bouquets",
    gifts: "Gift Bouquets",
    "gift-sets": "Gift Sets",
    jewelry: "Jewelry",
    "small-gifts": "Small Gifts",
    printing: "Printing",
    custom: "Customized Creations"
  };

  function readAll() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Saved product edits are not in a valid format.");
    }
    return parsed;
  }

  function canonicalId(id) {
    return id === "plain-tulip-satin" ? "plain-tulip" : id;
  }

  function get(id) {
    const override = readAll()[canonicalId(id)];
    if (override == null) return null;
    if (
      typeof override !== "object"
      || Array.isArray(override)
      || typeof override.name !== "string"
      || typeof override.category !== "string"
      || !Object.prototype.hasOwnProperty.call(categories, override.category)
      || (override.price !== undefined && (!Number.isFinite(override.price) || override.price < 0))
      || (override.description !== undefined && typeof override.description !== "string")
      || (override.image !== undefined && typeof override.image !== "string")
    ) {
      throw new Error(`Saved edits for "${id}" are not valid.`);
    }
    return override;
  }

  function save(id, data) {
    const overrides = readAll();
    overrides[canonicalId(id)] = data;
    localStorage.setItem(storageKey, JSON.stringify(overrides));
  }

  window.FloraAvenueProductStore = {
    categories,
    canonicalId,
    get,
    readAll,
    save
  };
})();
