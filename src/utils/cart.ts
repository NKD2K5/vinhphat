export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceText: string;
  image: string;
  quantity: number;
  addedAt: number;
}

const CART_KEY = 'vinhphat_cart';
const CART_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function readCartFromStorage(): CartItem[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function removeExpiredItems(items: CartItem[]): CartItem[] {
  const now = Date.now();
  return items.filter((item) => now - item.addedAt < CART_EXPIRY_MS);
}

export function getCart(): CartItem[] {
  const items = removeExpiredItems(readCartFromStorage());
  if (isBrowser()) {
    writeCartToStorage(items);
  }
  return items;
}

export function saveCart(items: CartItem[]): void {
  const cleaned = removeExpiredItems(items);
  writeCartToStorage(cleaned);
}

export function clearCart(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(CART_KEY);
  } catch {
    // ignore
  }
}

export function addItemToCart(
  item: Omit<CartItem, 'addedAt' | 'quantity'>,
  quantity: number = 1,
): void {
  if (quantity <= 0) return;

  const current = getCart();
  const existingIndex = current.findIndex((x) => x.productId === item.productId);
  const now = Date.now();

  if (existingIndex >= 0) {
    const existing = current[existingIndex];
    current[existingIndex] = {
      ...existing,
      quantity: existing.quantity + quantity,
      addedAt: now,
    };
  } else {
    current.push({
      ...item,
      quantity,
      addedAt: now,
    });
  }

  saveCart(current);
}

export function updateItemQuantity(productId: string, quantity: number): void {
  const current = getCart();
  const idx = current.findIndex((x) => x.productId === productId);
  if (idx === -1) return;

  if (quantity <= 0) {
    current.splice(idx, 1);
  } else {
    current[idx] = {
      ...current[idx],
      quantity,
    };
  }

  saveCart(current);
}

export function removeItemFromCart(productId: string): void {
  const current = getCart().filter((x) => x.productId !== productId);
  saveCart(current);
}

export function getCartSummary() {
  const items = getCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    totalItems,
    items,
  };
}
