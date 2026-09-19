const params = new URLSearchParams(window.location.search);
const reference = params.get("reference") || "ORD-PENDING";
const style = params.get("style") || "Product";
const image = params.get("image");

document.getElementById("orderReference").textContent = reference;
const imageElement = document.getElementById("productImage");
if (image) {
  imageElement.src = `../../public/images/${encodeURIComponent(image)}`;
  imageElement.alt = style;
} else {
  imageElement.hidden = true;
}

document.getElementById("detailsLink").href = `Order%20details.html?order=${encodeURIComponent(reference)}`;