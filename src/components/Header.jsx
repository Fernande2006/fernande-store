import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { href: "/#catalogue", label: "Catalogue" },
  { href: "/#commande-personnalisee", label: "Demander un devis" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-cream/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_var(--color-ink)]/10 border-b border-ink/10" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl sm:text-2xl tracking-tight text-ink">
            {siteConfig.name.toUpperCase()}
          </span>
          <span className="hidden sm:inline-flex items-center bg-ink text-paper text-[10px] font-mono tracking-[0.15em] px-2 py-0.5 rounded-sm">
            {siteConfig.sourcingCountries.join(" · ").toUpperCase()}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft hover:text-route transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#commande-personnalisee"
            className="text-sm font-medium bg-route text-paper px-4 py-2 rounded-sm hover:bg-route-dark transition-colors"
          >
            Commander
          </a>
          <CartButton totalItems={totalItems} onClick={openCart} />
        </nav>

        <div className="md:hidden flex items-center gap-1">
          <CartButton totalItems={totalItems} onClick={openCart} />
          <button
            className="p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 bg-cream px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function CartButton({ totalItems, onClick }) {
  return (
    <button onClick={onClick} className="relative p-2 text-ink" aria-label="Ouvrir le panier">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6L4.5 3H2" />
        <circle cx="9.5" cy="19" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="19" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-route text-paper text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}
