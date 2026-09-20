// ─────────────────────────────────────────────────────────────
// Paiement Mobile Money.
//
// V1 : utilise le widget Kkiapay (script chargé dans index.html),
// qui gère MTN Mobile Money, Moov Money et carte bancaire pour le
// Bénin, sans backend ni frais fixes. Tant que `siteConfig.kkiapay
// .publicKey` est vide, isPaymentConfigured() renvoie false et les
// boutons de paiement basculent automatiquement sur une demande de
// paiement envoyée par WhatsApp — le site reste pleinement
// fonctionnel avant même d'avoir un compte Kkiapay.
//
// LIMITE V1 (à noter honnêtement) : sans backend, la confirmation
// de paiement n'est pas vérifiée côté serveur. Le message WhatsApp
// envoyé après paiement sert de justificatif à recouper avec le
// tableau de bord Kkiapay. Voir le README pour l'étape suivante
// (vérification serveur) une fois qu'un compte gratuit type
// Supabase Functions sera en place.
// ─────────────────────────────────────────────────────────────

import { siteConfig } from "../config";

export function isPaymentConfigured() {
  return Boolean(siteConfig.kkiapay.publicKey);
}

/**
 * Ouvre le widget Kkiapay pour encaisser un montant.
 * @param {Object} params
 * @param {number} params.amount
 * @param {string} params.name - nom du client
 * @param {string} params.phone - numéro de téléphone du client (format local)
 * @param {(response: any) => void} params.onSuccess
 * @param {() => void} [params.onFailed]
 */
export function openMobileMoneyPayment({ amount, name, phone, onSuccess, onFailed }) {
  if (!isPaymentConfigured()) {
    console.warn(
      "Kkiapay non configuré : ajoutez votre clé publique dans src/config.js pour activer le paiement Mobile Money."
    );
    return;
  }
  if (typeof window.openKkiapayWidget !== "function") {
    console.error("Le script Kkiapay n'a pas pu se charger (vérifiez la connexion internet).");
    return;
  }

  window.openKkiapayWidget({
    amount: Math.round(amount),
    key: siteConfig.kkiapay.publicKey,
    sandbox: siteConfig.kkiapay.sandbox,
    name,
    phone,
    data: JSON.stringify({ store: siteConfig.name }),
  });

  const successHandler = (response) => {
    window.removeEventListener("kkiapay.success", successHandler);
    onSuccess?.(response.detail);
  };
  const failedHandler = () => {
    window.removeEventListener("kkiapay.failed", failedHandler);
    onFailed?.();
  };
  window.addEventListener("kkiapay.success", successHandler);
  window.addEventListener("kkiapay.failed", failedHandler);
}
