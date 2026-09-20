import { siteConfig } from "../config";
import RouteLine from "./RouteLine";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 sm:pt-20 pb-10">
      <p className="font-mono text-xs tracking-[0.2em] text-route uppercase mb-5">
        Import sur demande — {siteConfig.city}
      </p>
      <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.03] max-w-3xl text-ink">
        Vos envies du monde,
        <br />
        livrées jusqu'à vous.
      </h1>
      <p className="mt-6 max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed">
        {siteConfig.name} sélectionne et importe pour vous depuis Shein, Temu,
        1688 et Pinduoduo. Parcourez le catalogue prêt à commander, ou
        décrivez-nous exactement ce que vous cherchez.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <a
          href="#catalogue"
          className="inline-flex items-center justify-center bg-ink text-paper px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Voir le catalogue
        </a>
        <a
          href="#commande-personnalisee"
          className="inline-flex items-center justify-center border border-ink/25 text-ink px-6 py-3.5 rounded-sm text-sm font-medium hover:border-route hover:text-route transition-colors"
        >
          Demander un devis
        </a>
      </div>

      <div className="mt-14 sm:mt-16">
        <RouteLine stops={["France", "Chine", "Benin"]} />
      </div>
    </section>
  );
}
