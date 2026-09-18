
/* =====================================================
   FLORA AVENUE - PRODUCT DETAILS
   Images are expected inside: public/images/
===================================================== */

const IMAGE_BASE = "../../public/images/";

const products = [
  {
    id: "plain-tulip",
    name: "Plain Tulip / Satin Rose",
    category: "Flowers & Bouquets",
    price: 45,
    description: "Plain tulip or satin rose.",
    customizable: false,
    colors: ["Pink", "Red", "Blue", "Purple", "Yellow"],
    images: ["plain-tulip.jpeg"]
  },
  {
    id: "satin-rose",
    name: "Satin Rose",
    category: "Flowers & Bouquets",
    description: "Choose your preferred size and stem count.",
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
    images: ["satin-rose.jpeg"]
  },
  {
    id: "eternal-rose",
    name: "Eternal Rose / Glittered",
    category: "Flowers & Bouquets",
    description: "Eternal rose bouquet with your chosen stem count.",
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
    images: ["eternal-rose.jpeg"]
  },
  {
    id: "sunflower",
    name: "Sunflower Bouquet",
    category: "Flowers & Bouquets",
    description: "Custom stem count is available upon request.",
    customizable: true,
    variants: [
      { label: "1 stem", price: 119 },
      { label: "3 stems", price: 399 },
      { label: "5 stems luxe", price: 599 },
      { label: "10 stems luxe", price: 1249 },
      { label: "Custom stem count — inquire", price: 0 }
    ],
    images: ["sunflower.jpeg"]
  },
  {
    id: "artificial-tulip",
    name: "Artificial Tulip Bouquet",
    category: "Flowers & Bouquets",
    description: "Artificial tulip bouquet.",
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
    images: ["artificial-tulip.jpeg"]
  },
  {
    id: "roria",
    name: "Roria Bouquet",
    category: "Flowers & Bouquets",
    price: 450,
    description: "Roria bouquet.",
    customizable: false,
    images: ["roria.jpeg"]
  },
  {
    id: "thumbelina",
    name: "Thumbelina Bouquet",
    category: "Flowers & Bouquets",
    price: 749,
    description: "Thumbelina bouquet.",
    customizable: false,
    images: ["thumbelina.jpeg"]
  },
  {
    id: "dahlia",
    name: "Dahlia Satin Rose",
    category: "Flowers & Bouquets",
    description: "Choose your preferred arrangement.",
    customizable: false,
    variants: [
      { label: "1 stem", price: 119 },
      { label: "7 stems round bouquet", price: 749 }
    ],
    images: ["dahlia.jpeg"]
  },
  {
    id: "amore",
    name: "Amore Blooms",
    category: "Flowers & Bouquets",
    description: "Mixed flower bouquets.",
    customizable: false,
    variants: [
      { label: "Code 01 Small — 2 roses, 1 daisy, 2 plumeria, 3 tulips", price: 550 },
      { label: "Code 02 Medium — 6 roses, 4 tulips, butterfly and fillers", price: 999 },
      { label: "Code 03 Large — 12 roses, 1 peony, 7 tulips, butterfly and fillers", price: 1389 },
      { label: "Code 04 Large — 6 roses, 4 plumeria, 1 orchid, 1 tulip, 2 daisies, butterfly and fillers", price: 949 },
      { label: "Code 05 Large — 6 roses, 4 tulips, 1 peony, 1 orchid, 2 daisies, butterfly and fillers", price: 1389 }
    ],
    images: ["amore.jpeg"]
  },
  {
    id: "butterfly",
    name: "Butterfly Bouquet with Lights",
    category: "Butterfly Bouquets",
    description: "Butterfly bouquet with lights. Available in Purple, Pink, Blue, and Yellow.",
    customizable: false,
    variants: [
      { label: "10 butterflies", price: 199 },
      { label: "20 butterflies", price: 449 },
      { label: "40 butterflies", price: 799 }
    ],
    colors: ["Purple", "Pink", "Blue", "Yellow"],
    images: ["butterfly.jpeg"]
  },
  {
    id: "butterfly-flowers",
    name: "Butterfly × Flowers with Lights",
    category: "Butterfly Bouquets",
    description: "Flower and butterfly bouquet with lights.",
    customizable: false,
    variants: [
      { label: "Small — 1 satin rose + 8 butterflies", price: 260 },
      { label: "Medium — 3 flower stems + 20 butterflies", price: 599 },
      { label: "Large — 5 flower stems + 30 butterflies", price: 899 }
    ],
    images: ["butterfly-flowers.jpeg"]
  },
  {
    id: "buldak",
    name: "Buldak Bouquet",
    category: "Food & Gift Bouquets",
    price: 1100,
    description: "5 pieces. Can add more items upon request.",
    customizable: false,
    variants: [{ label: "5 pcs", price: 1100 }],
    images: ["buldak.jpeg"]
  },
  {
    id: "chocolate-bouquet",
    name: "Chocolate Bouquet",
    category: "Food & Gift Bouquets",
    description: "Chocolate bouquet.",
    customizable: false,
    variants: [
      { label: "Big — around 20–30 chocolates", price: 1349 },
      { label: "3 Hershey chocolates", price: 699 }
    ],
    images: ["chocolate-bouquet.jpeg"]
  },
  {
    id: "blossom-bag",
    name: "Blossom Bag",
    category: "Blossom Series",
    price: 155,
    description: "Blossom bag.",
    customizable: false,
    images: ["blossom-bag.jpeg"]
  },
  {
    id: "blossom-box",
    name: "Blossom Box + Mini Photostrip",
    category: "Blossom Series",
    description: "Choose whether to include a Pandora ring.",
    customizable: false,
    variants: [
      { label: "With Pandora ring", price: 350 },
      { label: "Without Pandora ring", price: 219 }
    ],
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
    images: ["chocolate-box.jpeg"]
  },
  {
    id: "money-bouquet",
    name: "Money Bouquet",
    category: "Food & Gift Bouquets",
    description: "Starts at ₱399. Price depends on bill slots and design. Customer may provide an inspiration/reference.",
    customizable: true,
    variants: [
      { label: "Round style — starts at ₱399", price: 399 },
      { label: "Mermaid style — starts at ₱399", price: 399 }
    ],
    images: ["money-bouquet.jpeg"]
  },
  {
    id: "white-ring",
    name: "Pandora White Ring",
    category: "Jewelry",
    price: 100,
    description: "Pandora white ring.",
    customizable: false,
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
    images: ["pink-ring.jpeg"]
  },
  {
    id: "couple-ring",
    name: "Couple Ring",
    category: "Jewelry",
    price: 180,
    description: "Couple ring.",
    customizable: false,
    images: ["couple-ring.jpeg"]
  },
  {
    id: "necklace",
    name: "Pandora Necklace",
    category: "Jewelry",
    price: 180,
    description: "Pandora necklace.",
    customizable: false,
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
    images: ["spotify-keychain.jpg"]
  },
  {
    id: "mini-cd",
    name: "Mini CD Keychain",
    category: "Keychains & Small Gifts",
    price: 149,
    description: "Mini CD keychain.",
    customizable: true,
    images: ["mini-cd.jpeg"]
  },
  {
    id: "ref-magnet",
    name: "Ref Magnets",
    category: "Keychains & Small Gifts",
    price: null,
    description: "Price not specified. Please inquire for the price.",
    customizable: true,
    images: ["ref-magnet.jpeg"]
  },
  {
    id: "phone-lanyard",
    name: "Phone Lanyard",
    category: "Keychains & Small Gifts",
    description: "Out of stock.",
    customizable: true,
    outOfStock: true,
    images: ["phone-lanyard.jpeg"]
  },
  {
    id: "button-pin",
    name: "Button Pin 50mm",
    category: "Keychains & Small Gifts",
    price: 40,
    description: "50mm button pin.",
    customizable: true,
    images: ["button-pin.jpeg"]
  },
  {
    id: "pocket-mirror",
    name: "Pocket Mirror",
    category: "Keychains & Small Gifts",
    price: 50,
    description: "Pocket mirror.",
    customizable: true,
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
    images: ["regular-photo-strip.jpg"]
  },
  {
    id: "makeup-bouquet",
    name: "Makeup Bouquet",
    category: "Customized Creations",
    price: null,
    description: "Customized order. Final price depends on the requested items and design.",
    customizable: true,
    images: ["makeup-bouquet.jpeg"]
  },
  {
    id: "beverage-bouquet",
    name: "Beverage Bouquet",
    category: "Customized Creations",
    price: null,
    description: "Customized order. Final price depends on the requested items and design.",
    customizable: true,
    images: ["custom-bouquet.jpeg"]
  },
  {
    id: "money-garland",
    name: "Money Garland",
    category: "Customized Creations",
    price: null,
    description: "Customized order. Final price depends on the requested design.",
    customizable: true,
    images: ["money garland.jpeg"]
  },
  {
    id: "lei-garland",
    name: "Lei Garland",
    category: "Customized Creations",
    price: null,
    description: "Customized order. Final price depends on the requested design.",
    customizable: true,
    images: ["lei-garland.jpeg"]
  },
  {
    id: "custom-bouquet",
    name: "Fully Customized Bouquet",
    category: "Customized Creations",
    price: null,
    description: "Fully customized bouquet. Customer may provide an inspiration/reference.",
    customizable: true,
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


let selectedAddOns = new Set();
let selectedColor = "";

function money(amount) {
  return amount == null ? "Price upon inquiry" : `₱${Number(amount).toLocaleString("en-PH")}`;
}

function getSelectedVariant() {
  if (product.variants && product.variants.length) {
    return product.variants[Number(variantSelect.value)] || product.variants[0];
  }
  return { label: "", price: product.price ?? 0 };
}

function getAddOnTotal() {
  return addOnOptions.reduce((sum, addOn) => {
    return sum + (selectedAddOns.has(addOn.id) ? addOn.price : 0);
  }, 0);
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


function renderColors() {
  colorOptions.innerHTML = "";
  selectedColor = "";

  if (product.colors && product.colors.length) {
    colorField.classList.remove("hidden");

    const colors = {
      Pink: "#F4A6B7",
      Red: "#E53945",
      Blue: "#4A90E2",
      Purple: "#9B59B6",
      Yellow: "#F4D03F"
    };

    product.colors.forEach(color => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "color-circle";
      button.style.backgroundColor = colors[color];
      button.setAttribute("aria-label", color);
      button.setAttribute("title", color);
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {
        selectedColor = color;

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

  const unitPrice = Number(variant.price ?? product.price ?? 0) + getAddOnTotal();
  totalPriceElement.textContent = money(unitPrice * quantity);

  priceElement.textContent = product.price == null && !product.variants
    ? "Price upon inquiry"
    : money(variant.price ?? product.price);
}

function goToPage(page) {
  const variant = getSelectedVariant();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const query = new URLSearchParams({
    id: product.id,
    product: product.name,
category: product.category,
    variant: variant.label || "",
    price: String(variant.price ?? product.price ?? ""),
    quantity: String(quantity),
    color: selectedColor,
    addons: Array.from(selectedAddOns).join(",")
  });

  window.location.href = `${page}?${query.toString()}`;
}

function initializePage() {
  categoryElement.textContent = product.category;
  nameElement.textContent = product.name;
  descriptionElement.textContent = product.description || "";
  renderImages();
  renderVariants();
  // hide choose
if (!product.variants || product.variants.length <= 1) {
  variantField.classList.add("hidden");
}
// Hide Add-ons and Quantity for customizable products
if (product.customizable) {
  const addOnsField = addOnsElement.closest(".form-field");
  const quantityRow = document.querySelector(".quantity-row");

  //special instructions
  const notesField = document.querySelector("#specialInstructions")?.closest(".form-field");

  if (addOnsField) addOnsField.style.display = "none";
  if (quantityRow) quantityRow.style.display = "none";
  if (notesField) notesField.style.display = "none";
}
// Hide Choose variant for customizable products
if (product.customizable) {
  variantField.classList.add("hidden");
} else {
  variantField.classList.remove("hidden");
}
  renderColors();
  renderAddOns();
  if (product.customizable === true) {
  const totalField = document.querySelector(".total-row");

  if (totalField) {
    totalField.style.display = "none";
  }
}
  

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


const loginRequiredModal = document.getElementById("loginRequiredModal");
const cancelLoginButton = document.getElementById("cancelLoginButton");
const goToLoginButton = document.getElementById("goToLoginButton");

mainActionButton.addEventListener("click", () => {
  if (product.outOfStock) return;

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    loginRequiredModal.hidden = false;
    return;
  }

  if (product.customizable) {
    const query = new URLSearchParams({
      id: product.id,
      product: product.name,
      category: product.category
    });

    window.location.href = `customization.html?${query.toString()}`;
  } else {
    goToPage("order.html");
  }
});

cancelLoginButton.addEventListener("click", () => {
  loginRequiredModal.hidden = true;
});

goToLoginButton.addEventListener("click", () => {
  window.location.href = "../login/login.html";
});

/* =========================================================
   HIDE VARIANT DROPDOWN WHEN THERE IS ONLY ONE VARIANT
   ========================================================= */

function updateVariantVisibility() {
    const variantSelect = document.getElementById("variantSelect");

    if (!variantSelect) return;

    
    const actualVariants = Array.from(variantSelect.options).filter(option => {
        return option.value && option.value.trim() !== "";
    });

    // container variant
    const variantGroup =
        variantSelect.closest(".form-group") ||
        variantSelect.closest(".product-option") ||
        variantSelect.closest(".variant-group") ||
        variantSelect.parentElement;

    if (!variantGroup) return;


    
    if (actualVariants.length <= 1) {
        variantGroup.style.display = "none";

        // Automatically select the only variant
        if (actualVariants.length === 1) {
            variantSelect.value = actualVariants[0].value;
            variantSelect.dispatchEvent(new Event("change"));
        }
    } else {
      
        variantGroup.style.display = "";
    }
}


/* =========================================================
   CHECK AGAIN AFTER PRODUCT DETAILS LOADS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    updateVariantVisibility();

    // Check again after dynamic product data is loaded
    setTimeout(updateVariantVisibility, 100);
    setTimeout(updateVariantVisibility, 300);
    setTimeout(updateVariantVisibility, 500);
});

initializePage();
