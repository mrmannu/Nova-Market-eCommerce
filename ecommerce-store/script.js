// ========================================
// NOVA MARKET — E-COMMERCE DEMO
// ========================================

// Product information lives in one array.
// In a real app, a backend/API would usually provide this data.
const products = [
  {
    id: 1, name: "Studio Headphones", category: "Tech", price: 2499,
    tag: "BESTSELLER", description: "Your own little world of sound.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2, name: "Everyday Bottle", category: "Lifestyle", price: 799,
    tag: "EVERYDAY PICK", description: "Hydration, without the fuss.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3, name: "Soft Glow Lamp", category: "Home", price: 1899,
    tag: "NEW", description: "A softer kind of evening.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4, name: "Daily Carry Tote", category: "Lifestyle", price: 999,
    tag: "COMMUNITY FAV", description: "Room for all the little things.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5, name: "Minimal Desk Clock", category: "Home", price: 1299,
    tag: "DESK ESSENTIAL", description: "Make time for what matters.",
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6, name: "Wireless Speaker", category: "Tech", price: 2199,
    tag: "GOOD SOUND", description: "Small speaker. Big mood.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
  }
];

// ========================================
// SELECT HTML ELEMENTS
// ========================================
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const clearFiltersBtn = document.getElementById("clearFilters");
const resetSearchBtn = document.getElementById("resetSearch");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const subtotal = document.getElementById("subtotal");
const cartEmpty = document.getElementById("cartEmpty");
const drawerFooter = document.getElementById("drawerFooter");
const continueShoppingBtn = document.getElementById("continueShopping");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const formError = document.getElementById("formError");
const successState = document.getElementById("successState");
const successMessage = document.getElementById("successMessage");
const finishOrderBtn = document.getElementById("finishOrder");
const toast = document.getElementById("toast");

// Restore saved cart safely. localStorage stores strings, so JSON.parse
// converts the saved string back into JavaScript data.
function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("nova-market-cart")) || [];
    if (!Array.isArray(savedCart)) return [];

    // Only restore products that still exist and have a valid quantity.
    return savedCart
      .filter(item => products.some(product => product.id === item.id)
        && Number.isInteger(item.quantity) && item.quantity > 0)
      .map(item => ({ id: item.id, quantity: item.quantity }));
  } catch (error) {
    return [];
  }
}

let cart = loadCart();
let toastTimer;

// ========================================
// HELPER FUNCTIONS
// ========================================
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function saveCart() {
  localStorage.setItem("nova-market-cart", JSON.stringify(cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

// ========================================
// RENDER PRODUCTS
// ========================================
function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortMode = sortSelect.value;

  // filter() makes a new array containing only matching products.
  let visibleProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort a copied array so the original products order stays unchanged.
  if (sortMode === "price-low") {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (sortMode === "price-high") {
    visibleProducts.sort((a, b) => b.price - a.price);
  } else if (sortMode === "name") {
    visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  resultsCount.textContent =
    `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"}`;
  productGrid.classList.toggle("hidden", visibleProducts.length === 0);
  emptyState.classList.toggle("hidden", visibleProducts.length !== 0);

  productGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
        <button class="add-btn" type="button" data-add-id="${product.id}"
          aria-label="Add ${product.name} to cart" title="Add to bag">+</button>
      </div>
      <div class="product-meta">
        <div>
          <p class="product-category">${product.category}</p>
          <h3 class="product-name">${product.name}</h3>
        </div>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
      <p class="product-description">${product.description}</p>
    </article>
  `).join("");
}

// Event delegation: one listener on the product grid handles clicks on
// any current or future Add buttons inside it.
productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add-id]");
  if (!addButton) return;

  const productId = Number(addButton.dataset.addId);
  addToCart(productId);
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  sortSelect.value = "featured";
  renderProducts();
}
clearFiltersBtn.addEventListener("click", resetFilters);
resetSearchBtn.addEventListener("click", resetFilters);

// ========================================
// CART LOGIC
// ========================================
function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  // Keep each product only once in the cart array; increase its quantity.
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  updateCart();
  showToast(`${product.name} added to your bag`);
}

function changeQuantity(productId, change) {
  const item = cart.find(cartItem => cartItem.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== productId);
  }
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showToast("Item removed from your bag");
}

function updateCart() {
  saveCart();

  // Total count includes quantities, not just the number of distinct products.
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalQuantity;
  drawerCount.textContent = `(${totalQuantity})`;
  subtotal.textContent = formatPrice(totalPrice);

  const isEmpty = cart.length === 0;
  cartEmpty.classList.toggle("hidden", !isEmpty);
  drawerFooter.classList.toggle("hidden", isEmpty);
  cartItems.classList.toggle("hidden", isEmpty);

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    if (!product) return "";
    return `
      <article class="cart-row">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p class="cart-unit-price">${formatPrice(product.price)} each</p>
          <div class="quantity-control" aria-label="Quantity for ${product.name}">
            <button type="button" data-quantity-id="${product.id}" data-change="-1"
              aria-label="Decrease ${product.name} quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-quantity-id="${product.id}" data-change="1"
              aria-label="Increase ${product.name} quantity">+</button>
          </div>
          <button class="remove-btn" type="button" data-remove-id="${product.id}">Remove</button>
        </div>
        <span class="cart-row-total">${formatPrice(product.price * item.quantity)}</span>
      </article>
    `;
  }).join("");
}

// Cart buttons are handled by one listener instead of many separate listeners.
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity-id]");
  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantityId),
      Number(quantityButton.dataset.change)
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove-id]");
  if (removeButton) removeFromCart(Number(removeButton.dataset.removeId));
});

// ========================================
// OPEN / CLOSE CART
// ========================================
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  closeCartBtn.focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
continueShoppingBtn.addEventListener("click", () => {
  closeCart();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

// ========================================
// DEMO CHECKOUT
// ========================================
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  checkoutForm.classList.remove("hidden");
  successState.classList.add("hidden");
  formError.textContent = "";
  document.getElementById("customerName").focus();
}

function closeCheckout() {
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

checkoutBtn.addEventListener("click", openCheckout);
closeCheckoutBtn.addEventListener("click", closeCheckout);
checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) closeCheckout();
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();
  formError.textContent = "";

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (name.length < 2) {
    formError.textContent = "Please enter your full name (at least 2 characters).";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formError.textContent = "Please enter a valid email address.";
    return;
  }
  if (address.length < 8) {
    formError.textContent = "Please enter a more complete delivery address.";
    return;
  }
  if (cart.length === 0) {
    formError.textContent = "Your bag is empty. Add a product before checkout.";
    return;
  }

  const orderTotal = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  checkoutForm.classList.add("hidden");
  successState.classList.remove("hidden");
  successMessage.textContent =
    `Thanks, ${name}! Your demo order for ${formatPrice(orderTotal)} has been created locally. No payment or real order was sent.`;

  // This is only a front-end demonstration, not a real payment/order system.
  cart = [];
  updateCart();
});

finishOrderBtn.addEventListener("click", () => {
  closeCheckout();
  checkoutForm.reset();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  showToast("Thanks for trying the Nova Market demo!");
});

// ========================================
// INITIAL PAGE RENDER
// ========================================
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
updateCart();
