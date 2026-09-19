const params = new URLSearchParams(location.search);
const product = params.get('product') || 'Customized Creation';
const image = params.get('image') || 'custom-bouquet.jpeg';
const productId = params.get('id') || '';
document.getElementById('customProduct').innerHTML = `<img class="product-summary-image" src="../../public/images/${encodeURIComponent(image)}" alt="${product}"><dl><dt>Product</dt><dd>${product}</dd></dl>`;
if (productId) document.getElementById('backToProduct').href = `product-details.html?id=${encodeURIComponent(productId)}`;
document.getElementById('customizationForm').addEventListener('submit', event => {
  event.preventDefault();
  const requests = JSON.parse(localStorage.getItem('floraAvenueOrders') || '[]');
  const id = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const request = {
    reference: id, type: 'customized', productId, style: product, image,
    design: document.getElementById('design').value.trim(),
    colors: document.getElementById('color').value.trim(),
    qty: document.getElementById('items').value.trim(),
    budget: document.getElementById('budget').value,
    occasion: document.getElementById('occasion').value.trim(),
    addons: document.getElementById('addons').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    status: 'Pending', sellerProposal: null, payment: { total: 0, requiredDownPayment: 0, amountPaid: 0, proof: null },
    createdAt: new Date().toISOString()
  };
  requests.unshift(request);
  localStorage.setItem('floraAvenueOrders', JSON.stringify(requests));
  const savedRequests = JSON.parse(localStorage.getItem('floraAvenueCustomizationRequests') || '[]');
  savedRequests.unshift(request);
  localStorage.setItem('floraAvenueCustomizationRequests', JSON.stringify(savedRequests));
  document.getElementById('customStatus').textContent = `Customization request submitted. Status: Pending. Reference: ${id}`;
  const ordersLink = document.getElementById('ordersLink');
  ordersLink.hidden = false;
  ordersLink.textContent = 'Proceed to My Orders';
  event.target.reset();
});
