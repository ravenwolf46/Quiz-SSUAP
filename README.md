# Quiz visuel hors ligne

Application monopage permettant de reconstituer des séquences de gestes en replaçant des images dans l’ordre chronologique.

## Démarrage

1. Clone ou télécharge le dépôt.
2. Ouvre directement `index.html` dans ton navigateur : aucune installation n’est nécessaire.

## Fonctionnement

- Chaque quiz correspond à une série d’images partageant un préfixe de fichier.
- Les cartes sont mélangées : glisse-dépose pour les réordonner ou utilise les flèches clavier.
- Le bouton **« Vérifier l’ordre »** indique combien de cartes sont bien placées et colore les cadres en conséquence.
- **Réinitialiser** ou **Mélanger** relance la séquence avec un nouvel ordre aléatoire.

## Accessibilité

- Navigation clavier complète (Tab pour cibler une carte, flèches ou boutons pour la déplacer).
- Zone d’annonce dynamique en français pour signaler la progression.
- Contrastes renforcés et indicateurs visuels de validation.

## Ajout d’un quiz

1. Ajoute les nouvelles images à la racine ou dans le dossier de ton choix.
2. Référence-les dans `quizzes.js` en respectant la structure `{ src, step }`.
3. Le **`step`** doit correspondre au rang chronologique (tri numérique croissant du suffixe).
