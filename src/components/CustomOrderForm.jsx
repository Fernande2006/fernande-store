import { useState } from "react";
import { siteConfig } from "../config";
import { getCustomOrderLink } from "../services/orderService";

const initialForm = {
  platform: siteConfig.platforms[0].label,
  link: "",
  description: "",
  quantity: "1",
  budget: "",
  name: "",
  city: siteConfig.city,
};

export default function CustomOrderForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.name.trim()) {
      setError("Merci de préciser au minimum votre nom et la description de l'article.");
      return;
    }
    setError("");
    const url = getCustomOrderLink(form);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="commande-personnalisee"
      className="bg-ink text-cream"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-route uppercase mb-2">
            Faites votre demande
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mb-5">
            Vous avez vu un article ailleurs ?
          </h2>
          <p className="text-cream/75 leading-relaxed mb-8 max-w-md">
            Envoyez-nous le lien ou la description d'un article trouvé sur
            l'une de ces plateformes. Nous vous revenons avec un devis complet,
            frais d'importation inclus.
          </p>

          <div className="flex flex-wrap gap-2">
            {siteConfig.platforms.map((p) => (
              <span
                key={p.id}
                className="font-mono text-xs tracking-[0.08em] uppercase border border-cream/25 text-cream/80 px-3 py-1.5 rounded-sm"
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper text-ink rounded-sm p-6 sm:p-8">
          <div className="grid gap-5">
            <div>
              <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                Plateforme
              </label>
              <select
                value={form.platform}
                onChange={update("platform")}
                className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none"
              >
                {siteConfig.platforms.map((p) => (
                  <option key={p.id} value={p.label}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                Lien du produit
              </label>
              <input
                type="url"
                value={form.link}
                onChange={update("link")}
                placeholder="https://..."
                className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                Description de l'article *
              </label>
              <textarea
                value={form.description}
                onChange={update("description")}
                placeholder="Couleur, taille, modèle, particularités..."
                rows={3}
                className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={update("quantity")}
                  className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                  Prix indiqué
                </label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={update("budget")}
                  placeholder={siteConfig.currency}
                  className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-[0.08em] uppercase text-ink-soft mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  className="w-full border border-ink/20 rounded-sm px-3.5 py-2.5 bg-cream text-sm focus:border-route outline-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-route">{error}</p>}

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center gap-2 bg-route text-paper px-6 py-3.5 rounded-sm text-sm font-medium hover:bg-route-dark transition-colors"
            >
              Envoyer la demande sur WhatsApp
            </button>
            <p className="text-xs text-ink-soft">
              En cliquant, WhatsApp s'ouvre avec votre demande déjà rédigée —
              vous n'avez plus qu'à l'envoyer.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
