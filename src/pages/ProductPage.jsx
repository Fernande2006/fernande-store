import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { siteConfig } from "../config";
import { getProductById } from "../services/productService";
import { getProductOrderLink, getPaymentConfirmationLink } from "../services/orderService";
import { isPaymentConfigured, openMobileMoneyPayment } from "../services/paymentService";
import { useCart } from "../context/CartContext";
import ImageGallery from "../components/ImageGallery";

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    getProductById(id).then((p) => {
      setProduct(p || null);
      setSelectedVariants(
        p ? Object.fromEntries(p.variants.map((v) => [v.name, v.options[0]?.label])) : {}
      );
      setQuantity(1);
      setLoading(false);
    });
  }, [id]);

  const missingVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => !selectedVariants[v.name]);
  }, [product, selectedVariants]);

  // Si l'option choisie (ex: une couleur) a une photo associée dans
  // products.json, la galerie doit sauter dessus.
  const activeVariantImage = useMemo(() => {
    if (!product) return null;
    for (const variant of product.variants) {
      const option = variant.options.find((o) => o.label === selectedVariants[variant.name]);
      if (option?.image) return option.image;
    }
    return null;
  }, [product, selectedVariants]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24">
        <p className="text-sm text-ink-soft">Chargement…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24 text-center">
        <p className="font-display text-2xl text-ink mb-3">Article introuvable</p>
        <Link to="/" className="text-sm text-route hover:underline">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedVariants, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handlePayNow = () => {
    const total = product.price * quantity;
    const items = [{ name: product.name, price: product.price, quantity, selectedVariants }];

    if (!isPaymentConfigured()) {
      // Pas encore de compte Kkiapay configuré : on ouvre directement
      // la demande de paiement sur WhatsApp.
      window.open(getPaymentConfirmationLink({ items, totalPrice: total }), "_blank", "noopener,noreferrer");
      return;
    }

    setPaying(true);
    openMobileMoneyPayment({
      amount: total,
      name: product.name,
      phone: "",
      onSuccess: (response) => {
        setPaying(false);
        const url = getPaymentConfirmationLink({
          items,
          totalPrice: total,
          transactionId: response?.transactionId,
        });
        window.open(url, "_blank", "noopener,noreferrer");
      },
      onFailed: () => setPaying(false),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
      <Link to="/" className="text-xs font-mono tracking-[0.1em] text-ink-soft hover:text-route uppercase">
        ← Retour au catalogue
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <ImageGallery images={product.images} alt={product.name} selectedImage={activeVariantImage} />
          {!product.inStock && (
            <span className="absolute top-4 left-4 bg-ink text-paper text-[10px] font-mono tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm z-10">
              Sur commande
            </span>
          )}
        </div>

        <div>
          <p className="text-[11px] font-mono tracking-[0.1em] text-sage uppercase mb-2">
            {product.category} · {product.origin}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-2xl text-ink">
            {product.price.toLocaleString("fr-FR")}{" "}
            <span className="text-sm font-body text-ink-soft">{siteConfig.currency}</span>
          </p>
          <p className="mt-4 text-sm text-ink-soft leading-relaxed">{product.description}</p>

          {product.variants.map((variant) => (
            <div key={variant.name} className="mt-6">
              <p className="text-xs font-mono tracking-[0.1em] uppercase text-ink-soft mb-2">
                {variant.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => {
                  const active = selectedVariants[variant.name] === option.label;
                  return (
                    <button
                      key={option.label}
                      onClick={() =>
                        setSelectedVariants((v) => ({ ...v, [variant.name]: option.label }))
                      }
                      className={`text-sm px-3.5 py-2 rounded-sm border transition-colors ${
                        active
                          ? "bg-ink text-paper border-ink"
                          : "border-ink/20 text-ink-soft hover:border-ink/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-6">
            <p className="text-xs font-mono tracking-[0.1em] uppercase text-ink-soft mb-2">
              Quantité
            </p>
            <div className="inline-flex items-center border border-ink/20 rounded-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-kraft/30"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-kraft/30"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!!missingVariant}
              className="inline-flex items-center justify-center border border-ink text-ink px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-ink hover:text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {added ? "Ajouté ✓" : "Ajouter au panier"}
            </button>
            <button
              onClick={handlePayNow}
              disabled={!!missingVariant || paying}
              className="inline-flex items-center justify-center bg-route text-paper px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-route-dark transition-colors disabled:opacity-40"
            >
              {paying ? "Ouverture du paiement…" : "Payer maintenant"}
            </button>
          </div>

          <a
            href={getProductOrderLink(product, selectedVariants, quantity)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-ink-soft hover:text-route underline underline-offset-4"
          >
            Ou commander directement via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}