const form = document.getElementById('orderForm');

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// The bouquet was already chosen elsewhere (e.g. a product page that links here
// with details in the URL). Fall back to a sample order if none is present.
function loadBouquetOrder(){
  const params = new URLSearchParams(window.location.search);
  return {
    style: params.get('style') || 'Classic Rose Bouquet',
    image: params.get('image') || '',
    size: params.get('size') || 'Standard',
    qty: params.get('qty') || '1',
    colors: params.get('colors') || 'Not specified',
    cardMsg: params.get('cardMsg') || '',
    notes: [params.get('notes'), params.get('addons')].filter(Boolean).join(', '),
    contactName: params.get('contactName') || '',
    contactNumber: params.get('contactNumber') || '',
    contactEmail: params.get('contactEmail') || '',
    fulfil: params.get('fulfil') || '',
    date: params.get('date') || '',
    address: params.get('address') || ''
  };
}
const bouquetOrder = loadBouquetOrder();

const productId = new URLSearchParams(window.location.search).get('id');
if (productId) {
  document.getElementById('backToProduct').href =
    `../products/product-details.html?id=${encodeURIComponent(productId)}`;
}

function renderBouquetRecap(o){
  const rows = [
    ['Bouquet', `${o.style} (${o.size}) × ${o.qty}`],
    ['Colors', o.colors]
  ];
  if(o.cardMsg) rows.push(['Card message', '"' + o.cardMsg + '"']);
  if(o.notes) rows.push(['Notes', o.notes]);
  if(o.contactName) rows.push(['Contact Name', o.contactName]);
  if(o.contactNumber) rows.push(['Contact Number', o.contactNumber]);
  if(o.contactEmail) rows.push(['Email Address', o.contactEmail]);
  if(o.fulfil) rows.push(['Method', o.fulfil]);
  if(o.address) rows.push(['Delivery Address', o.address]);
  const image = o.image
    ? `<img class="product-summary-image" src="../../public/images/${encodeURIComponent(o.image)}" alt="${escapeHtml(o.style)}">`
    : '';
  document.getElementById('bouquetRecap').innerHTML =
    image + '<dl>' + rows.map(([k,v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('') + '</dl>';
}
renderBouquetRecap(bouquetOrder);

['contactName', 'contactNumber', 'contactEmail', 'fulfil', 'date', 'address'].forEach(field => {
  const element = document.getElementById(field);
  if (element && bouquetOrder[field]) element.value = bouquetOrder[field];
});
if (document.getElementById('orderNotes')) {
  document.getElementById('orderNotes').value = bouquetOrder.notes || '';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const address = document.getElementById('address').value.trim();
  const fulfil = document.getElementById('fulfil').value;
  const error = document.getElementById('formError');
  if (!form.reportValidity()) return;
  if (fulfil === 'Delivery' && !address) {
    const addressInput = document.getElementById('address');
    addressInput.setCustomValidity('Please enter a delivery address.');
    addressInput.reportValidity();
    return;
  }
  document.getElementById('address').setCustomValidity('');

  const reference = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const order = {
    reference,
    createdAt: new Date().toISOString(),
    productId: productId || bouquetOrder.style,
    style: bouquetOrder.style,
    image: bouquetOrder.image,
    size: bouquetOrder.size,
    qty: Number(bouquetOrder.qty) || 1,
    colors: bouquetOrder.colors,
    addons: new URLSearchParams(window.location.search).get('addons') || '',
    notes: document.getElementById('orderNotes').value.trim(),
    contactName: document.getElementById('contactName').value.trim(),
    contactNumber: document.getElementById('contactNumber').value.trim(),
    contactEmail: document.getElementById('contactEmail').value.trim(),
    fulfil,
    date: document.getElementById('date').value,
    address,
    amount: Number(new URLSearchParams(window.location.search).get('amount')) || null,
    status: 'Pending',
    payment: { total: Number(new URLSearchParams(window.location.search).get('amount')) || 0, requiredDownPayment: 0, amountPaid: 0, proof: null }
  };
  const orders = JSON.parse(localStorage.getItem('floraAvenueOrders') || '[]');
  orders.unshift(order);
  localStorage.setItem('floraAvenueOrders', JSON.stringify(orders));

  const completionParams = new URLSearchParams({
    reference,
    style: bouquetOrder.style,
    image: bouquetOrder.image
  });
  window.location.href = `Order%20completed.html?${completionParams.toString()}`;
});