const ITEMS = [
  {
    title: "Sans compte à créer",
    desc: "Parcourez le catalogue et commandez librement, en quelques messages.",
  },
  {
    title: "Commande via WhatsApp",
    desc: "Chaque demande part directement dans une conversation avec la boutique.",
  },
  {
    title: "Sourcing FR · CN",
    desc: "Sélection sur Shein, Temu, 1688 et Pinduoduo, livrée jusqu'au Bénin.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-ink/10 bg-paper/60 text-center">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 grid gap-8 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item.title}>
            <h3 className="font-display text-lg text-ink mb-1.5">{item.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
