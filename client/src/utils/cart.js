const CART_KEY = 'cart';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors (e.g. private browsing)
  }
}

export function getCart() {
  return readCart();
}

export function addToCart(productId, quantity = 1) {
  const items = readCart();
  const existing = items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }

  writeCart(items);
  return items;
}

export function setQuantity(productId, quantity) {
  let items = readCart();

  if (quantity <= 0) {
    items = items.filter((item) => item.productId !== productId);
  } else {
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity = quantity;
    }
  }

  writeCart(items);
  return items;
}

export function removeFromCart(productId) {
  const items = readCart().filter((item) => item.productId !== productId);
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
}
