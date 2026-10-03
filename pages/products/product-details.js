
const IMAGE_BASE = "../../public/images/";

const products = [
  {
    id: "plain-tulip",
    name: "Plain Tulip / Satin Rose",
    category: "Flowers & Bouquets",
    price: 45,
    description: "Tulips are a simple way to share affection, while satin roses offer a thoughtful gesture for celebrations or everyday appreciation.",
    customizable: false,
    colors: ["Pink", "Red", "Blue", "Purple", "Yellow"],
    preparationTime: "",
    images: ["plain-tulip.jpeg"]
  },
  {
    id: "satin-rose",
    name: "Satin Rose",
    category: "Flowers & Bouquets",
    description: "Pink roses symbolize admiration, sweetness, and gratitude. A thoughtful choice for birthdays, thank-you gifts, or showing someone you appreciate them.",
    colors: ["Pink", "Red", "Blue", "Purple", "Yellow"],
    customizable: false,
    variants: [
      { label: "Small — 1 stem", price: 69 },
      { label: "Small — 3 stems", price: 169 },
      { label: "Small — 5 stems", price: 290 },
      { label: "Medium — 3 stems + lights", price: 250 },
      { label: "Medium — 6 stems + lights", price: 550 },
      { label: "Medium — 8 stems + lights", price: 600 },
      { label: "Big — 10–12 stems + free card", price: 800 },
      { label: "Big — 15–18 stems + free card", price: 1299 },
      { label: "Big — 20–25 stems + free card", price: 1499 }
    ],
    preparationTime: "",
    images: ["satin-rose.jpeg"]
  },
  {
    id: "eternal-rose",
    name: "Eternal Rose / Glittered",
    category: "Flowers & Bouquets",
    description: "An eternal rose is a lasting reminder of love and special memories. A thoughtful keepsake for anniversaries, romantic occasions, or someone special.",
    colors: ["Pink", "Red", "Blue", "Purple", "Yellow"],
    customizable: false,
    variants: [
      { label: "7 stems", price: 749 },
      { label: "12 stems", price: 1199 },
      { label: "15 stems", price: 1299 },
      { label: "18 stems", price: 1499 },
      { label: "20 stems", price: 1999 },
      { label: "21–25 stems", price: 2399 },
      { label: "30 stems", price: 2799 },
      { label: "35 stems", price: 2849 },
      { label: "40 stems", price: 3299 },
      { label: "50 stems", price: 4299 },
      { label: "100 stems", price: 7999 }
    ],
    preparationTime: "",
    images: ["eternal-rose.jpeg"]
  },
  {
    id: "sunflower",
    name: "Sunflower Bouquet",
    category: "Flowers & Bouquets",
    description: "Sunflowers symbolize happiness, positivity, and warmth. A cheerful gift for celebrations, encouragement, or simply brightening someone's day.",
    customizable: true,
    variants: [
      { label: "1 stem", price: 119 },
      { label: "3 stems", price: 399 },
      { label: "5 stems luxe", price: 599 },
      { label: "10 stems luxe", price: 1249 },
      { label: "Custom stem count — inquire", price: 0 }
    ],
    preparationTime: "",
    images: ["sunflower.jpeg"]
  },
  {
    id: "artificial-tulip",
    name: "Artificial Tulip Bouquet",
    category: "Flowers & Bouquets",
    description: "A simple, elegant gift for birthdays, celebrations, or a thoughtful everyday surprise.",
    customizable: false,
    variants: [
      { label: "1 stem", price: 119 },
      { label: "3 stems", price: 219 },
      { label: "5 stems", price: 319 },
      { label: "8 stems", price: 499 },
      { label: "10 stems", price: 619 },
      { label: "12 stems", price: 719 },
      { label: "15–18 stems", price: 999 }
    ],
    preparationTime: "",
    images: ["artificial-tulip.jpeg"]
  },
  {
    id: "roria",
    name: "Roria Bouquet",
    category: "Flowers & Bouquets",
    price: 450,
    description: "A thoughtful floral gift for birthdays, celebrations, or simply brightening someone's day.",
    customizable: false,
    preparationTime: "",
    images: ["roria.jpeg"]
  },
  {
    id: "thumbelina",
    name: "Thumbelina Bouquet",
    category: "Flowers & Bouquets",
    price: 749,
    description: "A sweet way to celebrate a special moment or let someone know you are thinking of them.",
    customizable: false,
    preparationTime: "",
    images: ["thumbelina.jpeg"]
  },
  {
    id: "dahlia",
    name: "Dahlia Satin Rose",
    category: "Flowers & Bouquets",
    description: "Dahlias symbolize strength, elegance, and lasting commitment. A meaningful choice for special celebrations or someone you admire.",
    customizable: false,
    variants: [
      { label: "1 stem", price: 119 },
      { label: "7 stems round bouquet", price: 749 }
    ],
    preparationTime: "",
    images: ["dahlia.jpeg"]
  },
  {
    id: "amore",
    name: "Amore Blooms",
    category: "Flowers & Bouquets",
    description: "A graceful arrangement for birthdays, anniversaries, and other moments worth celebrating.",
    customizable: false,
    variants: [
      { label: "Code 01 Small — 2 roses, 1 daisy, 2 plumeria, 3 tulips", price: 550 },
      { label: "Code 02 Medium — 6 roses, 4 tulips, butterfly and fillers", price: 999 },
      { label: "Code 03 Large — 12 roses, 1 peony, 7 tulips, butterfly and fillers", price: 1389 },
      { label: "Code 04 Large — 6 roses, 4 plumeria, 1 orchid, 1 tulip, 2 daisies, butterfly and fillers", price: 949 },
      { label: "Code 05 Large — 6 roses, 4 tulips, 1 peony, 1 orchid, 2 daisies, butterfly and fillers", price: 1389 }
    ],
    preparationTime: "",
    images: ["amore.jpeg"]
  },
  {
    id: "butterfly",
    name: "Butterfly Bouquet with Lights",
    category: "Butterfly Bouquets",
    description: "A cheerful bouquet with lights, available in Purple, Pink, Blue, and Yellow. A fun surprise for birthdays and celebrations.",
    customizable: false,
    variants: [
      { label: "10 butterflies", price: 199 },
      { label: "20 butterflies", price: 449 },
      { label: "40 butterflies", price: 799 }
    ],
    colors: ["Purple", "Pink", "Blue", "Yellow"],
    preparationTime: "",
    images: ["butterfly.jpeg"]
  },
  {
    id: "butterfly-flowers",
    name: "Butterfly × Flowers with Lights",
    category: "Butterfly Bouquets",
    description: "A bright gift for birthdays, celebrations, or a little surprise to make someone's day.",
    customizable: false,
    variants: [
      { label: "Small — 1 satin rose + 8 butterflies", price: 260 },
      { label: "Medium — 3 flower stems + 20 butterflies", price: 599 },
      { label: "Large — 5 flower stems + 30 butterflies", price: 899 }
    ],
    preparationTime: "",
    images: ["butterfly-flowers.jpeg"]
  },
  {
    id: "buldak",
    name: "Buldak Bouquet",
    category: "Food & Gift Bouquets",
    price: 1100,
    description: "A playful gift for birthdays and celebrations, with the option to request more items.",
    customizable: false,
    variants: [{ label: "5 pcs", price: 1100 }],
    preparationTime: "",
    images: ["buldak.jpeg"]
  },
  {
    id: "chocolate-bouquet",
    name: "Chocolate Bouquet",
    category: "Food & Gift Bouquets",
    description: "A sweet surprise for birthdays, celebrations, and thoughtful moments with someone special.",
    customizable: false,
    variants: [
      { label: "Big — around 20–30 chocolates", price: 1349 },
      { label: "3 Hershey chocolates", price: 699 }
    ],
    preparationTime: "",
    images: ["chocolate-bouquet.jpeg"]
  },
  {
    id: "blossom-bag",
    name: "Blossom Bag",
    category: "Blossom Series",
    price: 155,
    description: "A thoughtful gift set for birthdays, congratulations, and other special occasions.",
    customizable: false,
    preparationTime: "",
    images: ["blossom-bag.jpeg"]
  },
  {
    id: "blossom-box",
    name: "Blossom Box + Mini Photostrip",
    category: "Blossom Series",
    description: "A ready-to-gift set for birthdays and celebrations, with a choice to include a Pandora ring.",
    customizable: false,
    variants: [
      { label: "With Pandora ring", price: 350 },
      { label: "Without Pandora ring", price: 219 }
    ],
    preparationTime: "",
    images: ["blossom-box.jpeg"]
  },
  {
    id: "chocolate-box",
    name: "Chocolate Box + Satin Rose",
    category: "Blossom Series",
    description: "Out of stock.",
    customizable: false,
    outOfStock: true,
    variants: [
      { label: "With pink Pandora", price: 399 },
      { label: "With pocket mirror", price: 349 }
    ],
    preparationTime: "",
    images: ["chocolate-box.jpeg"]
  },
  {
    id: "money-bouquet",
    name: "Money Bouquet",
    category: "Food & Gift Bouquets",
    description: "A creative way to combine a meaningful gift with something practical. A memorable choice for birthdays, graduations, and celebrations.",
    customizable: true,
    variants: [
      { label: "Round style — starts at ₱399", price: 399 },
      { label: "Mermaid style — starts at ₱399", price: 399 }
    ],
    preparationTime: "",
    images: ["money-bouquet.jpeg"]
  },
  {
    id: "white-ring",
    name: "Pandora White Ring",
    category: "Jewelry",
    price: 100,
    description: "Pandora white ring.",
    customizable: false,
    preparationTime: "",
    images: ["white-ringg.jpg"]
  },
  {
    id: "pink-ring",
    name: "Pandora Pink Ring",
    category: "Jewelry",
    description: "Choose a ring option.",
    customizable: true,
    variants: [
      { label: "Pink ring", price: 110 },
      { label: "Pink ring with chosen design", price: 120 }
    ],
    preparationTime: "",
    images: ["pink-ring.jpeg"]
  },
  {
    id: "couple-ring",
    name: "Couple Ring",
    category: "Jewelry",
    price: 180,
    description: "Couple ring.",
    customizable: false,
    preparationTime: "",
    images: ["couple-ring.jpeg"]
  },
  {
    id: "necklace",
    name: "Pandora Necklace",
    category: "Jewelry",
    price: 180,
    description: "Pandora necklace.",
    customizable: false,
    preparationTime: "",
    images: ["necklace.jpeg"]
  },
  {
    id: "regular-keychain",
    name: "Regular Keychain",
    category: "Keychains & Small Gifts",
    description: "Choose single or pair.",
    customizable: true,
    variants: [
      { label: "1 piece", price: 40 },
      { label: "2 pieces", price: 75 }
    ],
    preparationTime: "",
    images: ["regular-keychain.jpg"]
  },
  {
    id: "spotify-keychain",
    name: "Spotify Keychain",
    category: "Keychains & Small Gifts",
    description: "Choose single or pair.",
    customizable: true,
    variants: [
      { label: "1 piece", price: 55 },
      { label: "2 pieces", price: 100 }
    ],
    preparationTime: "",
    images: ["spotify-keychain.jpg"]
  },
  {
    id: "mini-cd",
    name: "Mini CD Keychain",
    category: "Keychains & Small Gifts",
    price: 149,
    description: "Mini CD keychain.",
    customizable: true,
    preparationTime: "",
    images: ["mini-cd.jpeg"]
  },
  {
    id: "ref-magnet",
    name: "Ref Magnets",
    category: "Keychains & Small Gifts",
    price: null,
    description: "Price not specified. Please inquire for the price.",
    customizable: true,
    preparationTime: "",
    images: ["ref-magnet.jpeg"]
  },
  {
    id: "phone-lanyard",
    name: "Phone Lanyard",
    category: "Keychains & Small Gifts",
    description: "Out of stock.",
    customizable: true,
    outOfStock: true,
    preparationTime: "",
    images: ["phone-lanyard.jpeg"]
  },
  {
    id: "button-pin",
    name: "Button Pin 50mm",
    category: "Keychains & Small Gifts",
    price: 40,
    description: "50mm button pin.",
    customizable: true,
    preparationTime: "",
    images: ["button-pin.jpeg"]
  },
  {
    id: "pocket-mirror",
    name: "Pocket Mirror",
    category: "Keychains & Small Gifts",
    price: 50,
    description: "Pocket mirror.",
    customizable: true,
    preparationTime: "",
    images: ["pocket-mirror.jpeg"]
  },
  {
    id: "polaroid",
    name: "Polaroid / Instax-inspired Photos",
    category: "Printing",
    description: "Price ranges from ₱6 to ₱18 each.",
    customizable: true,
    variants: [
      { label: "₱6 each", price: 6 },
      { label: "₱18 each", price: 18 }
    ],
    preparationTime: "",
    images: ["polaroid.jpeg"]
  },
  {
    id: "mini-photo-strip",
    name: "Mini Photo Strip",
    category: "Printing",
    description: "Price ranges from ₱25 to ₱35.",
    customizable: true,
    variants: [
      { label: "₱25", price: 25 },
      { label: "₱35", price: 35 }
    ],
    preparationTime: "",
    images: ["mini-photo-strip.jpg"]
  },
  {
    id: "regular-photo-strip",
    name: "Regular Photo Strip",
    category: "Printing",
    description: "Price ranges from ₱55 to ₱65.",
    customizable: true,
    variants: [
      { label: "₱55", price: 55 },
      { label: "₱65", price: 65 }
    ],
    preparationTime: "",
    images: ["regular-photo-strip.jpg"]
  },
  {
    id: "makeup-bouquet",
    name: "Makeup Bouquet",
    category: "Customized Creations",
    price: null,
    description: "A fun, personal gift for someone who enjoys beauty and self-care. A thoughtful choice for birthdays and celebrations.",
    customizable: true,
    preparationTime: "",
    images: ["makeup-bouquet.jpeg"]
  },
  {
    id: "beverage-bouquet",
    name: "Beverage Bouquet",
    category: "Customized Creations",
    price: null,
    description: "Personalize this gift to celebrate a birthday, milestone, or someone special.",
    customizable: true,
    preparationTime: "",
    images: ["custom-bouquet.jpeg"]
  },
  {
    id: "money-garland",
    name: "Money Garland",
    category: "Customized Creations",
    price: null,
    description: "Personalize the details to create a meaningful gift for a celebration or special occasion.",
    customizable: true,
    preparationTime: "",
    images: ["money garland.jpeg"]
  },
  {
    id: "lei-garland",
    name: "Lei Garland",
    category: "Customized Creations",
    price: null,
    description: "Personalize the details to create a meaningful gift for a celebration or special occasion.",
    customizable: true,
    preparationTime: "",
    images: ["lei-garland.jpeg"]
  },
  {
    id: "custom-bouquet",
    name: "Fully Customized Bouquet",
    category: "Customized Creations",
    price: null,
    description: "Made especially for you or someone special. Personalize the details to create a memorable gift.",
    customizable: true,
    preparationTime: "",
    images: ["custom-bouquet.jpeg"]
  }
];

const addOnOptions = [
  { id: "butterfly", label: "Butterfly — ₱5 each", price: 5 },
  { id: "crown", label: "Crown — ₱80", price: 80 },
  { id: "fairy-lights", label: "Fairy lights — ₱20", price: 20 },
  { id: "message-card", label: "Printed message card — ₱10", price: 10 }
];

const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id") || params.get("product") || params.get("query");

const product = products.find(item => item.id === requestedId) || products[0];

const imageElement = document.getElementById("productImage");
const thumbnailsElement = document.getElementById("productThumbnails");
const categoryElement = document.getElementById("productCategory");
const nameElement = document.getElementById("productName");
const priceElement = document.getElementById("productPrice");
const descriptionElement = document.getElementById("productDescription");
const preparationEstimateElement = document.getElementById("preparationEstimateValue");
const customizationElement = document.getElementById("productCustomization");
const stockMessage = document.getElementById("stockMessage");
const variantField = document.getElementById("variantField");
const variantSelect = document.getElementById("variantSelect");
const colorField = document.getElementById("colorField");
const colorOptions = document.getElementById("colorOptions");
const styleField = document.getElementById("styleField");
const styleSelect = document.getElementById("styleSelect");
const addOnsElement = document.getElementById("addOns");
const quantityInput = document.getElementById("quantity");
const totalPriceElement = document.getElementById("totalPrice");
const mainActionButton = document.getElementById("mainActionButton");
const inquiryActionButton = document.getElementById("inquiryActionButton");
const productOrderForm = document.getElementById("productOrderForm");
const selectedProductSummary = document.getElementById("selectedProductSummary");


let selectedAddOns = new Set();
let selectedColor = "";

function money(amount) {
  return amount == null ? "Price upon inquiry" : `₱${Number(amount).toLocaleString("en-PH")}`;
}

function getSelectedVariant() {
  if (product.variants && product.variants.length) {
    return product.variants[Number(variantSelect.value)] || product.variants[0];
  }
  return { label: "", price: product.price };
}

function getAddOnTotal() {
  return addOnOptions.reduce((sum, addOn) => {
    return sum + (selectedAddOns.has(addOn.id) ? addOn.price : 0);
  }, 0);
}

function savePendingProductAction(action) {
  const pendingAction = {
    action,
    url: window.location.href,
    productId: product.id,
    selection: {
      variantIndex: variantSelect.value,
      color: selectedColor,
      addOns: Array.from(selectedAddOns),
      quantity: quantityInput.value,
      notes: document.getElementById("specialInstructions").value
    }
  };

  try {
    localStorage.setItem("floraAvenuePendingAction", JSON.stringify(pendingAction));
    return true;
  } catch (error) {
    console.error("Unable to save the product selection before sign-in.", error);
    alert("Unable to continue on this device. Please check your browser storage settings.");
    return false;
  }
}

function restorePendingProductSelection(pendingAction) {
  const selection = pendingAction?.productId === product.id
    ? pendingAction.selection
    : null;
  if (!selection || typeof selection !== "object") return;

  const variantIndex = Number(selection.variantIndex);
  if (
    product.variants?.length
    && Number.isInteger(variantIndex)
    && variantIndex >= 0
    && variantIndex < product.variants.length
  ) {
    variantSelect.value = String(variantIndex);
  }

  if (product.colors?.includes(selection.color)) {
    Array.from(colorOptions.querySelectorAll(".color-circle"))
      .find(button => button.getAttribute("aria-label") === selection.color)
      ?.click();
  }

  selectedAddOns = new Set(
    Array.isArray(selection.addOns)
      ? selection.addOns.filter(id => addOnOptions.some(addOn => addOn.id === id))
      : []
  );
  renderAddOns();

  const quantity = Number(selection.quantity);
  if (Number.isFinite(quantity) && quantity >= 1) {
    quantityInput.value = String(Math.floor(quantity));
  }

  if (typeof selection.notes === "string") {
    document.getElementById("specialInstructions").value =
      selection.notes.slice(0, document.getElementById("specialInstructions").maxLength);
  }

  updateTotal();
}

function renderImages() {
  const images = product.images && product.images.length
    ? product.images
    : ["plain-tulip.jpeg"];

  imageElement.src = IMAGE_BASE + images[0];
  imageElement.alt = product.name;
  thumbnailsElement.innerHTML = "";

  images.forEach((filename, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumbnail-button" + (index === 0 ? " active" : "");
    button.setAttribute("aria-label", `View product image ${index + 1}`);

    const img = document.createElement("img");
    img.src = IMAGE_BASE + filename;
    img.alt = `${product.name} photo ${index + 1}`;
    img.loading = "lazy";
    img.decoding = "async";

    button.appendChild(img);
    button.addEventListener("click", () => {
      imageElement.src = IMAGE_BASE + filename;
      thumbnailsElement.querySelectorAll(".thumbnail-button")
        .forEach(item => item.classList.remove("active"));
      button.classList.add("active");
    });

    thumbnailsElement.appendChild(button);
  });

  imageElement.onerror = () => {
    imageElement.onerror = null;
    imageElement.src = IMAGE_BASE + "banner-flower.png";
    imageElement.alt = `${product.name} image unavailable`;
  };
}


function renderVariants() {
  variantField.classList.remove("hidden");
  variantSelect.innerHTML = "";

  if (product.variants && product.variants.length) {
    product.variants.forEach((variant, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent =
        `${variant.label} — ${money(variant.price)}`;

      variantSelect.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = product.name;
    variantSelect.appendChild(option);
  }
}


const colorPalette = {
  Pink: "#F2BAC9",
  Red: "#D9555C",
  Blue: "#4A88D7",
  Purple: "#8F6CCB",
  Yellow: "#E9C85A"
};

function renderColors() {
  colorOptions.innerHTML = "";
  selectedColor = "";

  if (product.colors && product.colors.length) {
    colorField.classList.remove("hidden");

    product.colors.forEach(color => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "color-circle";
      button.style.backgroundColor = colorPalette[color] || "#d9d9d9";
      button.setAttribute("aria-label", color);
      button.setAttribute("title", color);
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {
        selectedColor = color;
        stockMessage.textContent = "";
        stockMessage.classList.remove("selection-error");

        colorOptions.querySelectorAll(".color-circle")
          .forEach(circle => {
            circle.classList.remove("selected");
            circle.setAttribute("aria-pressed", "false");
          });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      });

      colorOptions.appendChild(button);
    });
  } else {
    colorField.classList.add("hidden");
  }
}

function renderAddOns() {
  addOnsElement.innerHTML = "";

  addOnOptions.forEach(addOn => {
    const label = document.createElement("label");
    label.className = "addon-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = addOn.id;
    checkbox.checked = selectedAddOns.has(addOn.id);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedAddOns.add(addOn.id);
      else selectedAddOns.delete(addOn.id);
      updateTotal();
    });

    const text = document.createElement("span");
    text.textContent = addOn.label;

    label.append(checkbox, text);
    addOnsElement.appendChild(label);
  });
}

function updateTotal() {
  const variant = getSelectedVariant();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  quantityInput.value = String(quantity);

  const selectedPrice = variant.price ?? product.price;
  const totalRow = document.querySelector(".total-row");
  if (totalRow) totalRow.style.display = selectedPrice == null ? "none" : "flex";
  totalPriceElement.textContent = selectedPrice == null
    ? "Price upon inquiry"
    : money((Number(selectedPrice) + getAddOnTotal()) * quantity);

  priceElement.textContent = product.price == null && !product.variants
    ? "Price upon inquiry"
    : money(variant.price ?? product.price);
  renderSelectedProductSummary();
}

function renderSelectedProductSummary() {
  if (!selectedProductSummary) return;
  const variant = getSelectedVariant();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const addOns = Array.from(selectedAddOns)
    .map(id => addOnOptions.find(addOn => addOn.id === id)?.label || id)
    .join(", ") || "None";
  const amount = (Number(variant.price ?? product.price ?? 0) + getAddOnTotal()) * quantity;
  const colorDisplay = selectedColor
    ? `<span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${colorPalette[selectedColor] || '#d9d9d9'}; border:1px solid rgba(51,45,47,0.2); vertical-align:middle; margin-right:8px;"></span>${selectedColor}`
    : "Not specified";
  selectedProductSummary.innerHTML = `
    <img class="summary-product-image" src="${IMAGE_BASE}${product.images?.[0] || "banner-flower.png"}" alt="${product.name}">
    <dl>
      <dt>Product</dt><dd>${product.name}</dd>
      <dt>Variation</dt><dd>${variant.label || "Standard"}</dd>
      <dt>Color</dt><dd>${colorDisplay}</dd>
      <dt>Quantity</dt><dd>${quantity}</dd>
      <dt>Add-ons</dt><dd>${addOns}</dd>
      <dt>Total</dt><dd>${money(amount)}</dd>
    </dl>`;
}

function saveProductOrder() {
  if (!productOrderForm.reportValidity()) return;
  const fulfil = document.getElementById("orderFulfil").value;
  const addressInput = document.getElementById("orderAddress");
  const error = document.getElementById("orderFormError");
  addressInput.setCustomValidity("");
  error.textContent = "";
  if (fulfil === "Delivery" && !addressInput.value.trim()) {
    addressInput.setCustomValidity("Please enter a delivery address.");
    addressInput.reportValidity();
    return;
  }

  const variant = getSelectedVariant();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const amount = (Number(variant.price ?? product.price ?? 0) + getAddOnTotal()) * quantity;
  const order = {
    reference: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString(),
    customerEmail: window.floraAvenueCustomerOrders.getCustomerEmail(),
    customerName: window.floraAvenueCustomerOrders.getCustomerName(
      window.floraAvenueCustomerOrders.getCustomerEmail()
    ),
    productId: product.id,
    style: product.name,
    image: product.images?.[0] || "",
    size: variant.label || "Standard",
    qty: quantity,
    colors: selectedColor,
    addons: Array.from(selectedAddOns).map(id => addOnOptions.find(item => item.id === id)?.label || id).join(", "),
    notes: document.getElementById("specialInstructions").value.trim() + (document.getElementById("orderNotes").value.trim() ? ` ${document.getElementById("orderNotes").value.trim()}` : ""),
    contactName: document.getElementById("orderContactName").value.trim(),
    contactNumber: document.getElementById("orderContactNumber").value.trim(),
    contactEmail: document.getElementById("orderContactEmail").value.trim(),
    fulfil,
    date: document.getElementById("orderDate").value,
    address: addressInput.value.trim(),
    amount,
    status: "Pending",
    payment: { total: amount, requiredDownPayment: 0, amountPaid: 0, proof: null }
  };
  try {
    window.floraAvenueCustomerOrders.save(order);
  } catch (error) {
    document.getElementById("orderFormError").textContent = "Unable to save your order. Please try again.";
    return;
  }
  window.location.href = `../orders/Order%20completed.html?reference=${encodeURIComponent(order.reference)}&style=${encodeURIComponent(order.style)}&image=${encodeURIComponent(order.image)}`;
}

function goToPage(page) {
  const variant = getSelectedVariant();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const notes = document.getElementById("specialInstructions")?.value.trim() || "";
  const addOns = Array.from(selectedAddOns)
    .map(id => addOnOptions.find(addOn => addOn.id === id)?.label || id)
    .join(", ");

  if (page === "order-form") {
    const orderQuery = new URLSearchParams({
      id: product.id,
      image: product.images?.[0] || "",
      style: product.name,
      size: variant.label || "Standard",
      qty: String(quantity),
      colors: selectedColor,
      notes,
      addons: addOns
      ,amount: String((variant.price ?? product.price ?? 0) * quantity + getAddOnTotal() * quantity)
      ,customizable: product.customizable ? "true" : "false"
    });

    window.location.href = `../orders/order%20form.html?${orderQuery.toString()}`;
    return;
  }

  const query = new URLSearchParams({
    id: product.id,
    product: product.name,
    image: product.images?.[0] || "",
    design: product.name,
    variant: variant.label || "",
    price: String(variant.price ?? product.price ?? ""),
    quantity: String(quantity),
    items: String(quantity),
    color: selectedColor,
    addons: addOns,
    notes
  });

  window.location.href = `${page}?${query.toString()}`;
}

function goToInquiry() {
  const inquiryQuery = new URLSearchParams({
    new: "1",
    id: product.id,
    product: product.name,
    image: product.images?.[0] || "",
    variant: getSelectedVariant().label || "Standard",
    quantity: String(Math.max(1, Number(quantityInput.value) || 1)),
    color: selectedColor,
    addons: Array.from(selectedAddOns)
      .map(id => addOnOptions.find(addOn => addOn.id === id)?.label || id)
      .join(", "),
    notes: document.getElementById("specialInstructions")?.value.trim() || ""
  });
  const inquiryUrl = `../inquiries/inquiries.html?${inquiryQuery.toString()}`;
  if (localStorage.getItem("floraAvenueSignedIn") !== "true") {
    localStorage.setItem("floraAvenuePendingAction", JSON.stringify({
      action: "inquiry",
      url: inquiryUrl
    }));
    window.location.href = "../login/login.html";
    return;
  }
  localStorage.removeItem("floraAvenuePendingAction");
  window.location.href = inquiryUrl;
}

function initializePage() {
  categoryElement.textContent = product.category;
  nameElement.textContent = product.name;
  descriptionElement.textContent = product.description || "Product details will be confirmed with your inquiry.";
  preparationEstimateElement.textContent = product.preparationTime || "To be confirmed";
  customizationElement.classList.toggle("hidden", !product.customizable);
  renderImages();
  renderVariants();
  variantField.classList.toggle("hidden", !product.variants || product.variants.length <= 1);
  renderColors();
  renderAddOns();
  addOnsElement.closest(".form-field")?.classList.toggle("hidden", product.customizable);

  if (product.outOfStock) {
    stockMessage.textContent = "Out of stock";
    stockMessage.classList.add("out-of-stock");
    mainActionButton.disabled = true;
    mainActionButton.textContent = "Out of Stock";
  } else {
    stockMessage.textContent = "";
    mainActionButton.textContent = product.customizable ? "Customize" : "Order Now";
  }

  updateTotal();
}

variantSelect.addEventListener("change", updateTotal);
quantityInput.addEventListener("input", updateTotal);

document.getElementById("decreaseQuantity").addEventListener("click", () => {
  quantityInput.value = String(Math.max(1, Number(quantityInput.value || 1) - 1));
  updateTotal();
});

document.getElementById("increaseQuantity").addEventListener("click", () => {
  quantityInput.value = String(Math.max(1, Number(quantityInput.value || 1) + 1));
  updateTotal();
});

mainActionButton.addEventListener("click", () => {
  if (product.outOfStock) return;
  if (product.colors?.length && !selectedColor) {
    stockMessage.textContent = "Please choose a color before ordering.";
    stockMessage.classList.add("selection-error");
    colorField.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (localStorage.getItem("floraAvenueSignedIn") !== "true") {
    if (!savePendingProductAction(product.customizable ? "customize" : "order")) return;
    window.location.href = "../login/login.html";
    return;
  }
  localStorage.removeItem("floraAvenuePendingAction");
  goToPage(product.customizable ? "customization.html" : "order-form");
});

inquiryActionButton.addEventListener("click", goToInquiry);


initializePage();
let pendingProductAction = null;
try {
  pendingProductAction = JSON.parse(localStorage.getItem("floraAvenuePendingAction") || "null");
} catch (error) {
  console.warn("Unable to restore the saved product selection.", error);
  localStorage.removeItem("floraAvenuePendingAction");
}
restorePendingProductSelection(pendingProductAction);

productOrderForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (localStorage.getItem("floraAvenueSignedIn") !== "true") {
    if (!savePendingProductAction("order")) return;
    window.location.href = "../login/login.html";
    return;
  }
  saveProductOrder();
});

try {
  const pendingAction = pendingProductAction;
  const isProductAction = pendingAction?.action === "order" || pendingAction?.action === "customize";
  if (
    isProductAction
    && pendingAction?.url === window.location.href
    && pendingAction?.productId === product.id
    && localStorage.getItem("floraAvenueSignedIn") === "true"
  ) {
    mainActionButton.click();
  }
} catch (error) {
  localStorage.removeItem("floraAvenuePendingAction");
  console.warn("Unable to resume the product action.", error);
}