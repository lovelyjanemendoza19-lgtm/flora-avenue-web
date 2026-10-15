(function () {
  const store = window.FloraAvenueProductStore;
  const sections = Array.from(document.querySelectorAll(".catalog-section"));
  const baseCards = new Map();

  sections.forEach(section => {
    section.querySelectorAll(".catalog-card").forEach(card => {
      const id = new URL(card.href).searchParams.get("product");
      if (id) baseCards.set(store.canonicalId(id), { card, section });
    });
  });

  function decorate(card, baseCard, section, id) {
    const override = store.get(id);
    const title = card.querySelector("h3");
    const image = card.querySelector("img");
    const price = card.querySelector("p");
    if (override) {
      title.textContent = override.name;
      image.alt = override.name;
      if (override.image) image.src = override.image;
      if (override.price !== undefined) price.textContent = `₱${Number(override.price).toLocaleString("en-PH")}`;
      if (override.category && baseCard) {
        const sectionTarget = sections.find(item => item.dataset.category === override.category);
        if (sectionTarget && baseCard.parentElement !== sectionTarget.querySelector(".catalog-grid")) {
          sectionTarget.querySelector(".catalog-grid").appendChild(baseCard);
        }
      }
    }

    const params = new URLSearchParams();
    params.set("product", id);
    params.set("name", title.textContent);
    params.set("category", (override && override.category) || section.dataset.category);
    params.set("price", price.textContent.replace(/[^\d.]/g, ""));
    params.set(
      "priceEditable",
      !price.textContent.toLowerCase().includes("from")
        && !price.textContent.toLowerCase().includes("custom")
        && !price.textContent.toLowerCase().includes("varies")
        ? "true"
        : "false"
    );
    if (!override?.image) params.set("image", image.getAttribute("src").split("/").pop());
    card.href = `add-product.html?${params.toString()}`;
  }

  try {
    const overrides = store.readAll();
    document.querySelectorAll(".catalog-card").forEach(card => {
      const id = store.canonicalId(new URL(card.href).searchParams.get("product") || "");
      const base = baseCards.get(id);
      decorate(card, base && base.card, base ? base.section : card.closest(".catalog-section"), id);
    });
  } catch (error) {
    console.error("Unable to load saved product edits.", error);
  }
})();
