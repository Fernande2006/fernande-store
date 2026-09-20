import { useState } from "react";
import { siteConfig } from "../config";
import { useCart } from "../context/CartContext";
import { formatVariants, getCartOrderLink, getPaymentConfirmationLink } from "../services/orderService";
import { isPaymentConfigured, openMobileMoneyPayment } from "../services/paymentService";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, closeCart, clearCart } =
    useCart();
  const [paying, setPaying] = useState(false);

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    window.open(getCartOrderLink(items, totalPrice), "_blank", "noopener,noreferrer");
  };

  const handlePayNow = () => {
    if (!isPaymentConfigured()) {
      window.open(
        getPaymentConfirmationLink({ items, totalPrice }),
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    setPaying(true);
    openMobileMoneyPayment({
      amount: totalPrice,
      name: siteConfig.name,
      phone: "",
      onSuccess: (response) => {
        setPaying(false);
        const url = getPaymentConfirmationLink({
          items,
          totalPrice,
          transactionId: response?.transactionId,
        });
        window.open(url, "_blank", "noopener,noreferrer");
        clearCart();
      },
      onFailed: () => setPaying(false),
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        className="absolute inset-0 bg-ink/50"
        onClick={closeCart}
        aria-label="Fermer le panier"
      />
      <aside className="relative w-full max-w-md h-full bg-cream flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-ink/10">
          <h2 className="font-display text-xl text-ink">
            Panier {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button onClick={closeCart} aria-label="Fermer" className="p-2 text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {items.length === 0 ? (
            <p className="text-sm text-ink-soft mt-10 text-center">
              Votre panier est vide pour l'instant.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((it) => {
                const variantLine = formatVariants(it.selectedVariants);
                return (
                  <li key={it.cartItemId} className="flex gap-3">
                    <div className="w-16 h-20 bg-kraft/40 rounded-sm flex-shrink-0 overflow-hidden">
                      {it.image && (
                        <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base text-ink leading-snug truncate">{it.name}</p>
                      {variantLine && (
                        <p className="text-xs text-ink-soft mt-0.5">{variantLine}</p>
                      )}
                      <p className="text-sm text-ink-soft mt-1">
                        {it.price.toLocaleString("fr-FR")} {siteConfig.currency}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="inline-flex items-center border border-ink/20 rounded-sm">
                          <button
                            onClick={() => updateQuantity(it.cartItemId, it.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink text-sm hover:bg-kraft/30"
                            aria-label="Diminuer"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs">{it.quantity}</span>
                          <button
                            onClick={() => updateQuantity(it.cartItemId, it.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-ink text-sm hover:bg-kraft/30"
                            aria-label="Augmenter"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(it.cartItemId)}
                          className="text-xs text-ink-soft hover:text-route underline underline-offset-2"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 px-5 sm:px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="font-display text-xl text-ink">
                {totalPrice.toLocaleString("fr-FR")} {siteConfig.currency}
              </span>
            </div>
            <button
              onClick={handlePayNow}
              disabled={paying}
              className="w-full inline-flex items-center justify-center bg-route text-paper px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-route-dark transition-colors disabled:opacity-40"
            >
              {paying ? "Ouverture du paiement…" : "Payer par Mobile Money"}
            </button>
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full inline-flex items-center justify-center border border-ink text-ink px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Commander via WhatsApp
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
