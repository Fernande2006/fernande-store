import { Link } from "react-router-dom";
import { siteConfig } from "../config";
import { getProductOrderLink } from "../services/orderService";

export default function ProductCard({ product }) {
  return (
    <article className="group bg-paper border border-ink/10 rounded-sm overflow-hidden flex flex-col hover:border-ink/25 transition-colors">
      <Link to={`/produit/${product.id}`} className="block">
        <div className="aspect-[4/5] bg-kraft/40 flex items-center justify-center relative overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <span className="font-mono text-[11px] tracking-[0.15em] text-ink-soft/60 uppercase">
              Photo à venir
            </span>
          )}
          {!product.inStock && (
            <span className="absolute top-3 left-3 bg-ink text-paper text-[10px] font-mono tracking-[0.1em] uppercase px-2 py-1 rounded-sm">
              Sur commande
            </span>
          )}
          <span className="absolute top-3 right-3 bg-cream/90 text-ink-soft text-[10px] font-mono tracking-[0.1em] uppercase px-2 py-1 rounded-sm">
            {product.origin}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-mono tracking-[0.1em] text-sage uppercase mb-1">
          {product.category}
        </p>
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-display text-lg text-ink leading-snug hover:text-route transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-ink-soft leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display text-lg text-ink">
            {product.price.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-body text-ink-soft">{siteConfig.currency}</span>
          </span>
          <a
            href={getProductOrderLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium bg-ink text-paper px-3.5 py-2 rounded-sm hover:bg-route transition-colors whitespace-nowrap"
          >
            Commander
          </a>
        </div>
      </div>
    </article>
  );
}
