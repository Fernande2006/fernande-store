import { useEffect, useMemo, useState } from "react";
import { getProducts, getCategories } from "../services/productService";
import ProductCard from "./ProductCard";

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("Tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(["Tous", ...c]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => (active === "Tous" ? products : products.filter((p) => p.category === active)),
    [products, active]
  );

  return (
    <section id="catalogue" className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-route uppercase mb-2">
            Disponible maintenant
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Le catalogue</h2>
        </div>
        <p className="text-sm text-ink-soft max-w-sm">
          Articles immédiatement disponibles, prêts à être livrés. Rien ne vous convient ?
          Faites une demande personnalisée plus bas.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-9">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-xs font-mono tracking-[0.05em] px-3.5 py-2 rounded-sm border transition-colors ${
                active === cat
                  ? "bg-ink text-paper border-ink"
                  : "border-ink/20 text-ink-soft hover:border-ink/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-soft">Chargement du catalogue…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
