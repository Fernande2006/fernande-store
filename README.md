# Fernande Store — Site vitrine (V1)

Site vitrine e-commerce pour Fernande Store : catalogue consultable sans
compte, demande de commande personnalisée (Shein, Temu, 1688, Pinduoduo),
commande envoyée via WhatsApp. Aucun backend, hébergement 100% gratuit.

## Stack

- **React + Vite** — build statique, rapide, sans serveur à maintenir.
- **Tailwind CSS v4** — styles.
- Aucune base de données : le catalogue est un fichier JSON
  (`src/data/products.json`).
- Aucun paiement intégré : les commandes partent en message WhatsApp
  pré-rempli (`wa.me`).

## Lancer le site en local

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`.

## Nouveautés : fiche produit, variantes, panier, Mobile Money

- **Chaque article a sa propre page** (`/produit/:id`), accessible en
  cliquant sur l'image ou le nom dans le catalogue.
- **Plusieurs photos par article, en défilement** : dans
  `src/data/products.json`, chaque produit a un tableau `"images"` (plutôt
  qu'une seule photo). Sur la fiche produit, le visiteur peut naviguer
  entre les photos avec les flèches, les points, en swipant au doigt
  sur mobile, ou en cliquant les miniatures sur desktop — comme sur Shein.

  ```json
  "images": [
    "https://.../photo-1.jpg",
    "https://.../photo-2.jpg",
    "https://.../photo-3.jpg"
  ]
  ```

  Un tableau vide `[]` affiche l'espace réservé "Photo à venir". Une seule
  image dans le tableau désactive simplement les flèches/points (pas
  besoin de naviguer s'il n'y a qu'une photo).
- **Variantes personnalisées** : dans `src/data/products.json`, chaque
  produit a un tableau `"variants"`. C'est vous qui définissez les
  catégories directement dans ce fichier, par exemple :

  ```json
  "variants": [
    { "name": "Couleur", "options": ["Noir", "Beige", "Bordeaux"] },
    { "name": "Type", "options": ["Avocat", "Papaye", "Karité"] }
  ]
  ```

  Autant de groupes de variantes que nécessaire, avec les libellés et
  options de votre choix. Un produit sans variante garde `"variants": []`.
- **Panier** : icône en haut à droite, quantités modifiables, persiste
  dans le navigateur du visiteur (pas de compte requis). Depuis la fiche
  produit : "Ajouter au panier" ou "Payer maintenant" pour un achat direct.
- **Paiement Mobile Money** : voir la section dédiée ci-dessous.

### Activer le paiement Mobile Money (MTN MoMo / Moov Money)

Le site utilise [Kkiapay](https://kkiapay.me), une passerelle pensée pour
l'Afrique de l'Ouest, gratuite à intégrer (pas d'abonnement, juste une
commission par transaction réussie).

1. Créez un compte gratuit sur kkiapay.me.
2. Récupérez votre **clé publique** (Public API Key) dans le tableau de
   bord — jamais la clé privée, elle ne doit jamais apparaître dans le
   code du site.
3. Collez-la dans `src/config.js` :
   ```js
   kkiapay: {
     publicKey: "votre-clé-publique",
     sandbox: true, // passez à false une fois le compte validé par Kkiapay
   },
   ```
4. Tant que cette clé est vide, les boutons "Payer maintenant" /
   "Payer par Mobile Money" ouvrent automatiquement une demande de
   paiement par WhatsApp à la place — le site reste utilisable avant
   même d'avoir activé Kkiapay.

**Limite à connaître pour la V1** : sans backend, la confirmation de
paiement n'est pas vérifiée automatiquement côté serveur — le message
WhatsApp envoyé après paiement sert de justificatif, à recouper avec le
tableau de bord Kkiapay avant d'expédier la commande. La vérification
serveur automatique est indiquée dans la feuille de route plus bas.

## Ce qu'il faut modifier avant la mise en ligne

### 1. Numéro WhatsApp et informations de la boutique
Tout est centralisé dans **`src/config.js`** :

```js
whatsappNumber: "22900000000", // à remplacer par le vrai numéro
email: "contact@fernande-store.com",
instagram: "https://instagram.com/fernande.store",
```

### 2. Le catalogue
Éditez **`src/data/products.json`** : un objet par produit
(nom, catégorie, prix, origine, disponibilité, description, variantes,
images). Le tableau `"images"` peut rester vide `[]` (un espace réservé
s'affiche), ou contenir une ou plusieurs URL d'images hébergées.

### 3. Les images produits
Pas de backend = pas d'upload de fichiers pour l'instant. Deux options
gratuites simples :
- Héberger les photos sur un compte Cloudinary ou ImgBB gratuit et
  coller les URL dans `"images"` (plusieurs photos = plusieurs entrées
  dans le tableau, elles deviennent défilables sur la fiche produit).
- Ou déposer les fichiers dans `public/products/` (créez le dossier) et
  utiliser `"images": ["/products/mon-produit-1.jpg", "/products/mon-produit-2.jpg"]`.

## Déploiement gratuit

Le site est 100% statique après `npm run build` (dossier `dist/`).

**Option recommandée : Vercel**
1. Poussez ce projet sur un dépôt GitHub.
2. Sur vercel.com, "Add New Project" → importez le dépôt. Vercel détecte
   Vite automatiquement.
3. Déployez — vous obtenez une URL gratuite (ex. `fernande-store.vercel.app`).
   Un domaine personnalisé peut être branché plus tard, gratuitement aussi.

**Alternative : Netlify**
Même principe : connecter le dépôt GitHub, build command `npm run build`,
dossier de publication `dist`.

**Alternative sans GitHub : glisser-déposer**
`npm run build` en local, puis glissez le dossier `dist/` sur
app.netlify.com/drop.

## Architecture (pensée pour évoluer)

```
src/
  config.js               -> réglages globaux (whatsapp, devise, Kkiapay)
  data/products.json      -> catalogue + variantes (remplacera une vraie API plus tard)
  services/
    productService.js     -> seul point d'accès aux produits
    orderService.js       -> seul point de construction des messages de commande
    paymentService.js     -> paiement Mobile Money (Kkiapay) + repli WhatsApp
  context/
    CartContext.jsx       -> état du panier (localStorage), via useCart()
  pages/
    HomePage.jsx           -> accueil (hero, catalogue, commande personnalisée)
    ProductPage.jsx         -> fiche produit (variantes, ajout panier, paiement)
  components/              -> un composant = une responsabilité visuelle
  App.jsx                  -> routes + assemblage
```

La règle centrale : **les composants ne touchent jamais directement
`products.json`** — ils passent par `productService.js`. Ainsi, brancher
une vraie base de données plus tard ne change qu'un seul fichier.

## Feuille de route (V2 et après)

| Fonctionnalité | Ce qu'il faudra faire |
|---|---|
| **Comptes clients** | Ajouter un service d'authentification (ex. Supabase Auth, gratuit) + de nouvelles routes `/compte`. Aucune page actuelle n'a besoin d'être réécrite. |
| **Calcul automatique des prix avec marge** | Étendre `productService.js` : stocker un `costPrice` par produit et une règle de marge dans `config.js`, calculer `price` à l'affichage plutôt que de le coder en dur dans le JSON. |
| **Suivi des commandes** | Remplacer `products.json` par une vraie base (Supabase / Firebase, offres gratuites) ; ajouter une table `orders` et une page `/suivi/:id`. `orderService.js` gagnera une fonction `submitOrder()` qui écrit en base au lieu d'ouvrir seulement WhatsApp. |
| **Vérification serveur du paiement** | Ajouter une fonction serverless gratuite (Supabase Edge Function / Vercel Function) qui vérifie chaque transaction Kkiapay via leur API avant de confirmer la commande automatiquement, au lieu de la confirmation manuelle actuelle. |

Ces évolutions s'ajoutent sans casser la V1 : le site reste utilisable à
chaque étape.
