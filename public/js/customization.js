const customizationForm = document.getElementById("customizationForm");
const customStatus = document.getElementById("customStatus");
const ordersLink = document.getElementById("ordersLink");

function createReference() {
	return `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
}

function getCustomizationOrder() {
	const params = new URLSearchParams(window.location.search);
	const referenceImage = document.getElementById("reference").files[0]?.name || "";
	const design = document.getElementById("design").value.trim();
	const color = document.getElementById("color").value.trim();
	const items = document.getElementById("items").value.trim();
	const budget = Number(document.getElementById("budget").value) || 0;
	const addons = document.getElementById("addons").value.trim();
	const occasion = document.getElementById("occasion").value.trim();
	const notes = document.getElementById("notes").value.trim();

	return {
		reference: createReference(),
		createdAt: new Date().toISOString(),
		productId: params.get("id") || "customization-request",
		style: design,
		image: "banner-flower.png",
		size: "Customized",
		qty: Number(items) || 1,
		colors: color,
		addons,
		notes: [occasion && `Occasion: ${occasion}`, notes, referenceImage && `Reference image: ${referenceImage}`]
			.filter(Boolean)
			.join(" "),
		contactName: "",
		contactNumber: "",
		contactEmail: "",
		fulfil: "",
		date: "",
		address: "",
		amount: budget,
		status: "Pending",
		type: "Customization Request",
		payment: { total: budget, requiredDownPayment: 0, amountPaid: 0, proof: null }
	};
}

customizationForm.addEventListener("submit", function (event) {
	event.preventDefault();

	if (!customizationForm.reportValidity()) {
		return;
	}

	const order = getCustomizationOrder();
	const orders = JSON.parse(localStorage.getItem("floraAvenueOrders") || "[]");
	orders.unshift(order);
	localStorage.setItem("floraAvenueOrders", JSON.stringify(orders));

	customStatus.textContent = `Customization request submitted. Status: Pending. Reference: ${order.reference}`;
	ordersLink.hidden = false;
	customizationForm.querySelector("button[type=submit]").disabled = true;
});
