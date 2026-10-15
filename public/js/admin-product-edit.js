(function () {
  const store = window.FloraAvenueProductStore;
  const params = new URLSearchParams(window.location.search);
  const productId = store.canonicalId(params.get("product") || "");
  const form = document.getElementById("productForm");
  const nameInput = document.getElementById("productName");
  const categoryInput = document.getElementById("productCategory");
  const priceInput = document.getElementById("productPrice");
  const descriptionInput = document.getElementById("productDescription");
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("productImagePreview");
  const imageStatus = document.getElementById("productImageStatus");
  const feedback = document.getElementById("productFormFeedback");
  const submitButton = form.querySelector('[type="submit"]');
  let selectedImage = "";

  if (!productId) {
    feedback.textContent = "Select a product from Manage Products to edit it.";
    submitButton.disabled = true;
    return;
  }

  const currentCategory = params.get("category") || "flowers";
  const currentImage = params.get("image") || "";

  try {
    const override = store.get(productId);
    nameInput.value = override?.name || params.get("name") || "";
    categoryInput.value = override?.category || currentCategory;
    priceInput.value = override?.price ?? params.get("price") ?? "";
    if (override?.description) descriptionInput.value = override.description;
    if (override?.image) selectedImage = override.image;
    if (selectedImage || currentImage) {
      imagePreview.src = selectedImage || `../../public/images/${currentImage}`;
      imagePreview.hidden = false;
    }
    if (params.get("priceEditable") !== "true") {
      priceInput.disabled = true;
      document.getElementById("priceHelp").textContent =
        "This product uses variants or custom pricing. Its existing price options are preserved.";
    }
  } catch (error) {
    feedback.textContent = `Unable to load this product: ${error.message}`;
    submitButton.disabled = true;
    return;
  }

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 500 * 1024) {
      imageInput.value = "";
      imageStatus.textContent = "Choose a JPG, PNG, or WebP image smaller than 500 KB.";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      if (typeof reader.result !== "string") {
        imageStatus.textContent = "Unable to read the selected image.";
        return;
      }
      selectedImage = reader.result;
      imagePreview.src = selectedImage;
      imagePreview.hidden = false;
      imageStatus.textContent = file.name;
    });
    reader.addEventListener("error", function () {
      imageStatus.textContent = "Unable to read the selected image.";
    });
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const previous = store.get(productId) || {};
    const edited = {
      ...previous,
      name: nameInput.value.trim(),
      category: categoryInput.value
    };
    if (selectedImage) edited.image = selectedImage;
    if (params.get("priceEditable") === "true") edited.price = Number(priceInput.value);
    const description = descriptionInput.value.trim();
    if (description) edited.description = description;

    try {
      store.save(productId, edited);
      feedback.textContent = "Product updated. Changes are visible in the customer catalog on this device.";
      feedback.classList.add("success");
    } catch (error) {
      console.error("Unable to save product edits.", error);
      feedback.textContent = "Unable to save changes. Check available browser storage and try again.";
      feedback.classList.remove("success");
    }
  });
})();
