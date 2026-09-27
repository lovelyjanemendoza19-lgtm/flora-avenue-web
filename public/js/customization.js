(function () {
	const customizationForm = document.getElementById("customizationForm");
	const customStatus = document.getElementById("customStatus");
	const ordersLink = document.getElementById("ordersLink");
	const inquiriesLink = document.getElementById("inquiriesLink");
	const orderStore = window.floraAvenueCustomerOrders;
	const inquiryStore = window.floraAvenueInquiryStore;
	const params = new URLSearchParams(window.location.search);
	const sourceInquiryReference = params.get("sourceInquiry") || "";

	if (!orderStore.requireSignIn()) {
		customizationForm.hidden = true;
		return;
	}

	const customerEmail = orderStore.getCustomerEmail();
	let sourceInquiry = null;
	if (sourceInquiryReference) {
		sourceInquiry = inquiryStore.load().find(function (inquiry) {
			return inquiry.reference === sourceInquiryReference
				&& inquiry.customerEmail?.toLowerCase() === customerEmail;
		});
		if (!sourceInquiry) {
			alert("The related inquiry is unavailable for this account.");
			window.location.href = "../inquiries/inquiries.html";
			customizationForm.hidden = true;
			return;
		}
	}

	function renderCustomizationProduct() {
		const name = params.get("product") || "";
		const imageName = params.get("image") || "";
		const recap = document.getElementById("customProduct");
		if (!recap || !name) return;

		const image = document.createElement("img");
		image.className = "product-summary-image";
		image.src = `../../public/images/${encodeURIComponent(imageName || "banner-flower.png")}`;
		image.alt = name;
		const label = document.createElement("strong");
		label.textContent = name;
		recap.replaceChildren(image, label);
	}

	renderCustomizationProduct();
	document.getElementById("design").value =
		params.get("design") || params.get("product") || "";
	document.getElementById("color").value = params.get("color") || "";
	document.getElementById("items").value =
		params.get("items") || params.get("quantity") || "";
	document.getElementById("addons").value = params.get("addons") || "";
	document.getElementById("notes").value = [
		params.get("notes") || "",
		params.get("message") ? `Inquiry: ${params.get("message")}` : "",
		params.get("response") ? `Seller response: ${params.get("response")}` : ""
	].filter(Boolean).join("\n\n");

	function createReference() {
		return `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
	}

	function getCustomizationOrder() {
		const referenceImage = document.getElementById("reference").files[0]?.name || "";
		const design = document.getElementById("design").value.trim();
		const color = document.getElementById("color").value.trim();
		const items = document.getElementById("items").value.trim();
		const budget = Number(document.getElementById("budget").value) || 0;
		const addons = document.getElementById("addons").value.trim();
		const occasion = document.getElementById("occasion").value.trim();
		const notes = document.getElementById("notes").value.trim();
		const customerName = orderStore.getCustomerName(customerEmail);
		const detailNotes = [
			occasion && `Occasion: ${occasion}`,
			notes,
			referenceImage && `Reference image: ${referenceImage}`
		].filter(Boolean).join("\n");

		return {
			reference: createReference(),
			createdAt: new Date().toISOString(),
			customerEmail,
			customerName,
			productId: params.get("id") || "customization-request",
			style: design,
			image: params.get("image") || "banner-flower.png",
			size: params.get("variant") || "Customized",
			qty: Number(items) || 1,
			colors: color,
			addons,
			notes: detailNotes,
			sourceInquiryReference,
			contactName: customerName,
			contactNumber: "",
			contactEmail: customerEmail,
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

		if (!customizationForm.reportValidity()) return;

		const order = getCustomizationOrder();
		try {
			orderStore.save(order);
		} catch (error) {
			customStatus.textContent = "Unable to save your request. Please try again.";
			return;
		}

		let inquiryLinkSaved = true;
		if (sourceInquiry) {
			const inquiries = inquiryStore.load().map(function (inquiry) {
				return inquiry.reference === sourceInquiryReference
					? { ...inquiry, orderReference: order.reference, orderPlacedAt: order.createdAt }
					: inquiry;
			});
			try {
				inquiryStore.save(inquiries);
			} catch (error) {
				inquiryLinkSaved = false;
				console.error("Unable to link the customization request to its inquiry.", error);
			}
		}

		customStatus.textContent = inquiryLinkSaved
			? `Customization request submitted. Status: Pending. Reference: ${order.reference}`
			: `Your request was saved as ${order.reference}, but we couldn't link it to your inquiry. You can still view it in My Orders.`;
		ordersLink.href = `../orders/order%20details.html?order=${encodeURIComponent(order.reference)}`;
		ordersLink.textContent = "View My Order";
		ordersLink.hidden = false;
		if (sourceInquiry) {
			inquiriesLink.href = `../inquiries/inquiries.html?reference=${encodeURIComponent(sourceInquiryReference)}`;
			inquiriesLink.hidden = false;
		}
		customizationForm.querySelector("button[type=submit]").disabled = true;
	});
})();
