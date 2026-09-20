// ─────────────────────────────────────────────────────────────
// Couche d'accès aux données produits.
//
// V1 : les produits viennent d'un fichier JSON local (aucun coût,
// aucun backend). Les composants n'importent JAMAIS products.json
// directement — ils passent par ce service. Ainsi, le jour où l'on
// branche une vraie base de données / API, seule CETTE fonction
// change (ex: remplacer par un fetch('/api/products')), et tout
// le reste de l'application continue de fonctionner à l'identique.
// ─────────────────────────────────────────────────────────────

import productsData from "../data/products.json";

/**
 * Uniformise une variante : chaque option devient { label, image }.
 * Écrire juste une chaîne ("Noir") reste possible — elle devient
 * simplement { label: "Noir", image: null }, sans photo associée.
 */
function normalizeVariant(variant) {
  return {
    name: variant.name,
    options: (variant.options || []).map((opt) =>
      typeof opt === "string" ? { label: opt, image: null } : { label: opt.label, image: opt.image || null }
    ),
  };
}

/**
 * Uniformise un produit tel qu'écrit dans products.json, pour rester
 * tolérant aux petites variations d'écriture :
 *  - "images": [...]  OU  "image": [...]  OU  "image": "une-seule-url"
 *  - "variants" absent  ->  []
 *  - options de variante : chaînes simples OU { label, image }
 */
function normalizeProduct(raw) {
  const rawImages = raw.images ?? raw.image ?? [];
  const images = Array.isArray(rawImages) ? rawImages : [rawImages];

  return {
    ...raw,
    images: images.filter(Boolean),
    variants: (raw.variants ?? []).map(normalizeVariant),
  };
}

/** @returns {Promise<Array>} tous les produits */
export async function getProducts() {
  // Simule une opération asynchrone pour rester compatible
  // avec un futur appel réseau (fetch/axios) sans changer l'API.
  return Promise.resolve(productsData.map(normalizeProduct));
}

/** @returns {Promise<Array<string>>} liste unique des catégories */
export async function getCategories() {
  const products = await getProducts();
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

/** @param {string} id
 * @returns {Promise<Object|undefined>} */
export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}