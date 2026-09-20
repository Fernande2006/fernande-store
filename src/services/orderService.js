// ─────────────────────────────────────────────────────────────
// Logique de commande.
//
// V1 : pas de backend. Deux façons de commander :
//  1) WhatsApp — message pré-rempli (gratuit, instantané).
//  2) Mobile Money — via paymentService.js (Kkiapay), avec un
//     message de confirmation envoyé sur WhatsApp après paiement.
//
// ÉVOLUTION FUTURE : le jour où un vrai suivi de commande existera,
// ces fonctions resteront le SEUL endroit à modifier (ajouter un
// appel POST /api/orders), sans toucher aux composants.
// ─────────────────────────────────────────────────────────────

import { siteConfig } from "../config";

function buildWhatsAppUrl(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

/** Formate les variantes choisies, ex: "Couleur: Noir, Taille: M" */
export function formatVariants(selectedVariants = {}) {
  return Object.entries(selectedVariants)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

function formatPrice(amount) {
  return `${amount.toLocaleString("fr-FR")} ${siteConfig.currency}`;
}

/**
 * Lien WhatsApp pour commander un seul produit (avec variantes/quantité).
 * @param {Object} product
 * @param {Object} [selectedVariants]
 * @param {number} [quantity]
 */
export function getProductOrderLink(product, selectedVariants = {}, quantity = 1) {
  const variantLine = formatVariants(selectedVariants);
  const message =
    `Bonjour ${siteConfig.name} 👋\n` +
    `Je souhaite commander :\n` +
    `• ${product.name}${variantLine ? ` (${variantLine})` : ""} × ${quantity} — ` +
    `${formatPrice(product.price * quantity)}\n\n` +
    `Merci de me confirmer la disponibilité et les modalités de livraison.`;
  return buildWhatsAppUrl(message);
}

/**
 * Lien WhatsApp pour commander tout le contenu du panier.
 * @param {Array} items - items du CartContext
 * @param {number} totalPrice
 */
export function getCartOrderLink(items, totalPrice) {
  const lines = [
    `Bonjour ${siteConfig.name} 👋`,
    `Je souhaite commander :`,
    ``,
    ...items.map((it) => {
      const variantLine = formatVariants(it.selectedVariants);
      return `• ${it.name}${variantLine ? ` (${variantLine})` : ""} × ${it.quantity} — ${formatPrice(
        it.price * it.quantity
      )}`;
    }),
    ``,
    `Total : ${formatPrice(totalPrice)}`,
    ``,
    `Merci de me confirmer la disponibilité et les modalités de livraison.`,
  ];
  return buildWhatsAppUrl(lines.join("\n"));
}

/**
 * Lien WhatsApp de demande de commande personnalisée
 * (Shein, Temu, 1688, Pinduoduo...).
 */
export function getCustomOrderLink(form) {
  const lines = [
    `Bonjour ${siteConfig.name} 👋`,
    `Je souhaite une commande personnalisée :`,
    ``,
    `• Plateforme : ${form.platform}`,
    form.link ? `• Lien produit : ${form.link}` : null,
    `• Description : ${form.description}`,
    `• Quantité : ${form.quantity}`,
    form.budget ? `• Budget indicatif : ${form.budget} ${siteConfig.currency}` : null,
    `• Nom : ${form.name}`,
    `• Ville : ${form.city}`,
    ``,
    `Merci de me faire un devis avec les frais d'importation.`,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}

/**
 * Lien WhatsApp envoyé après un paiement Mobile Money réussi (ou en
 * remplacement du paiement si Kkiapay n'est pas encore configuré) :
 * sert de justificatif à recouper avec le tableau de bord Kkiapay.
 */
export function getPaymentConfirmationLink({ items, totalPrice, transactionId, customerName }) {
  const lines = [
    `Bonjour ${siteConfig.name} 👋`,
    transactionId
      ? `Je viens de payer ma commande par Mobile Money (réf. ${transactionId}) :`
      : `Je souhaite payer ma commande par Mobile Money :`,
    ``,
    ...items.map((it) => {
      const variantLine = formatVariants(it.selectedVariants);
      return `• ${it.name}${variantLine ? ` (${variantLine})` : ""} × ${it.quantity}`;
    }),
    ``,
    `Total : ${formatPrice(totalPrice)}`,
    customerName ? `Nom : ${customerName}` : null,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}
