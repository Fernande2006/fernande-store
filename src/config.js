// ─────────────────────────────────────────────────────────────
// Configuration du site — TOUT ce qui doit être modifiable
// rapidement (numéro WhatsApp, ville, réseaux) est ici.
// Rien d'autre dans le code ne doit contenir ces valeurs en dur.
// ─────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "Fernande Store",
  tagline: "Vos envies du monde, livrées jusqu'à vous",
  city: "Cotonou, Bénin",
  sourcingCountries: ["FR", "CN", "Bénin"],

  // Numéro WhatsApp au format international, SANS "+", SANS espaces.
  // Exemple Bénin : 22997000000
  whatsappNumber: "22994591781",

  // Adresse e-mail affichée en secours (optionnel, peut être vide)
  email: "fernandetogbe04@gmail.com",

  instagram: "https://www.instagram.com/fernandetogbe18?igsh=YzgzNDh5aWRobGVp&utm_source=qr",
  tiktok: "https://www.tiktok.com/@fernande_store?_r=1&_t=ZS-98kWroxp7Bp",
  facebook: "https://www.facebook.com/share/197ctfjpHb/?mibextid=wwXIfr",

  currency: "FCFA",

  // Paiement Mobile Money (MTN MoMo, Moov Money) via Kkiapay — gratuit à
  // intégrer, aucun serveur requis pour la V1. Créez un compte gratuit sur
  // https://kkiapay.me, récupérez votre clé PUBLIQUE (jamais la clé privée
  // ici) et collez-la ci-dessous. Tant que la clé reste vide, le bouton
  // "Payer par Mobile Money" propose automatiquement le paiement via
  // WhatsApp à la place — le site fonctionne dans les deux cas.
  kkiapay: {
    publicKey: "11e3375b38d2f936b994374e682279362f960239", // ex: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    sandbox: false, // passer à false une fois le compte Kkiapay validé
  },

  platforms: [
    { id: "shein", label: "Shein" },
    { id: "temu", label: "Temu" },
    { id: "1688", label: "1688" },
    { id: "pinduoduo", label: "Pinduoduo" },
  ],
};
