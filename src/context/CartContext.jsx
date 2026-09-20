import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Panier.
//
// V1 : le panier vit uniquement côté navigateur (localStorage).
// Pas de compte, pas de backend. Un article du panier a la forme :
// { cartItemId, productId, name, price, quantity, image, selectedVariants }
//
// ÉVOLUTION FUTURE : quand un compte client existera, ce Context
// pourra synchroniser avec une vraie base au lieu de localStorage,
// sans que les composants qui l'utilisent (useCart()) ne changent.
// ─────────────────────────────────────────────────────────────

const CartContext = createContext(null);
const STORAGE_KEY = "fernande-store-cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function makeCartItemId(productId, selectedVariants) {
  const variantKey = Object.entries(selectedVariants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${productId}__${variantKey}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, selectedVariants = {}, quantity = 1) => {
    const cartItemId = makeCartItemId(product.id, selectedVariants);
    setItems((prev) => {
      const existing = prev.find((it) => it.cartItemId === cartItemId);
      if (existing) {
        return prev.map((it) =>
          it.cartItemId === cartItemId ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          selectedVariants,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (cartItemId) =>
    setItems((prev) => prev.filter((it) => it.cartItemId !== cartItemId));

  const updateQuantity = (cartItemId, quantity) =>
    setItems((prev) =>
      quantity < 1
        ? prev.filter((it) => it.cartItemId !== cartItemId)
        : prev.map((it) => (it.cartItemId === cartItemId ? { ...it, quantity } : it))
    );

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
