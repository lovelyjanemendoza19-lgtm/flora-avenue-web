const productId = new URLSearchParams(window.location.search).get("id");
const product = window.products && window.products[productId];

const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productImage = document.getElementById("productImage");
const variationSelect = document.getElementById("variationSelect");
const colorSelect = document.getElementById("colorSelect");
const colorGroup = document.getElementById("colorGroup");
const productPrice = document.getElementById("productPrice");
const totalPrice = document.getElementById("totalPrice");
const orderButton = document.querySelector(".order-button");
const addonCheckboxes = document.querySelectorAll('.addons input[type="checkbox"]');

function formatPrice(price) {
    return price > 0 ? "₱" + price.toLocaleString() : "Custom Price";
}

function updateTotal() {
    if (!product) {
        return;
    }

    const selectedVariation = product.variations.find(function (variation) {
        return variation.value === variationSelect.value;
    });

    if (!selectedVariation) {
        return;
    }

    let total = selectedVariation.price;

    addonCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            total += Number(checkbox.value);
        }
    });

    totalPrice.textContent = formatPrice(total);
}

function updateProduct() {
    if (!product) {
        return;
    }

    const selectedVariation = product.variations.find(function (variation) {
        return variation.value === variationSelect.value;
    });

    if (!selectedVariation) {
        return;
    }

    productPrice.textContent = formatPrice(selectedVariation.price);
    updateTotal();
}

function showProduct() {
    productName.textContent = product.name;
    productDescription.textContent = product.description;
    document.title = product.name + " | Flora Avenue";

    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.onerror = function () {
        productImage.src = "../../public/images/rose.jpg";
    };

    product.variations.forEach(function (variation) {
        const option = document.createElement("option");
        option.value = variation.value;
        option.textContent = variation.name;
        variationSelect.appendChild(option);
    });

    if (product.colors.length === 0) {
        colorGroup.hidden = true;
    } else {
        product.colors.forEach(function (color) {
            const option = document.createElement("option");
            option.value = color;
            option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
            colorSelect.appendChild(option);
        });
    }

    if (product.available === false) {
        orderButton.disabled = true;
        orderButton.textContent = "Out of Stock";
    } else if (product.type === "customized") {
        orderButton.textContent = "Customize";
    }

    updateProduct();
}

function showProductNotFound() {
    productName.textContent = "Product Not Found";
    productDescription.textContent = "The selected product is not available.";
    document.querySelector(".product-content").hidden = true;
}

if (product) {
    showProduct();
} else {
    showProductNotFound();
}

variationSelect.addEventListener("change", updateProduct);
colorSelect.addEventListener("change", updateProduct);

addonCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateTotal);
});
