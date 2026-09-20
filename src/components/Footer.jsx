import { siteConfig } from "../config";
import RouteLine from "./RouteLine";

export default function Footer() {
  const year = new Date().getFullYear();
  const waUrl = `https://wa.me/${siteConfig.whatsappNumber}`;

  return (
    <footer id="contact" className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-8">
        <RouteLine stops={siteConfig.sourcingCountries} />

        <div className="mt-14 grid gap-10 sm:grid-cols-3 text-center">
          <div>
            <h4 className="font-display text-xl text-ink mb-2">{siteConfig.name}</h4>
            <p className="text-sm text-ink-soft leading-relaxed">
              Boutique en ligne — import sur commande depuis Shein, Temu, 1688
              et Pinduoduo, livré au Bénin.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.15em] text-sage uppercase mb-3">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-route">
                  WhatsApp
                </a>
              </li>
              {siteConfig.email && (
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-route">
                    {siteConfig.email}
                  </a>
                </li>
              )}
              <li>{siteConfig.city}</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs tracking-[0.15em] text-sage uppercase mb-3">
              Suivre
            </p>
            <ul className="space-y-2 text-sm text-ink-soft">
              {siteConfig.instagram && (
                <li>
                  <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-route">
                    Instagram
                  </a>
                </li>
              )}
              {siteConfig.facebook && (
                <li>
                  <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-route">
                    Facebook
                  </a>
                </li>
              )}
              {siteConfig.tiktok && (
                <li>
                  <a href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-route">
                    Tiktok
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-ink/10 text-xs text-ink-soft/70 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {year} {siteConfig.name}</span>
          <span className="font-mono tracking-[0.1em]">
            {siteConfig.sourcingCountries.join(" · ").toUpperCase()}
          </span>
        </div>
      </div>
    </footer>
  );
}
