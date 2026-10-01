# Plan de la landing PK Highlighter

Direction approuvée le 29 septembre 2026 — source de vérité pour toute régénération.

## Direction

- **Promesse** : « Surlignez l'essentiel. Barrez le reste. »
- **Registre** : grand public, clair et aéré (inspiration Apple par le cadrage, la typo et le
  rythme — pas par le clonage). Fond `#f5f5f7`, encre `#171719`, un accent surligneur `#d3ee73`.
- **Longueur** : 4 sections, ~200 mots par langue. Une idée par section.
- **Vrai produit** : toutes les captures viennent du content script réel exécuté sur
  `media-kit/demo.html` (texte éditorial fictif). Aucune maquette inventée.

## Structure

1. **Hero** — thèse + CTA « Ajouter à Chrome » / « Voir la démo ». Fenêtre navigateur posée sur
   le wallpaper sélectionné (paysage doré, id `8de42736e150`, voir `website/assets/provenance.json`).
   Ruban Three.js discret derrière la fenêtre (parallaxe limitée, arrêté hors écran).
2. **Avant / Après** — comparateur à boutons (clavier), mêmes cadrages, exclusion barrée visible.
3. **Styles & réglages** — sélecteur des 7 styles avec vrais aperçus + panneau réel + 3 étapes.
4. **Installation & soutien** — Chrome Web Store, GitHub, Ko-fi (https://ko-fi.com/pouark).

Navigation collante : ancre démo, GitHub, bouton Ko-fi, bascule FR/EN, CTA. Pied de page : confidentialité,
PK-Labs, Ko-fi via section soutien, bouton « réduire les animations ».

## Animations

- GSAP + ScrollTrigger (locaux, `website/vendor/`, versions figées) : entrée hero, redressement
  `rotationX` de la fenêtre, parallaxe du wallpaper, révélations de titres. `transform`/`opacity`
  uniquement.
- Three.js (local) : un seul ruban `TubeGeometry`-like, `MeshStandardMaterial`, pixelRatio ≤ 1,5 ;
  chargé après le contenu, desktop uniquement, détruit au déchargement.
- Fallbacks vérifiés : `prefers-reduced-motion` (statique), bouton manuel, sans WebGL (image
  seule), `file://` (page complète sans 3D), localStorage bloqué (détection langue sans mémoire).

## Critères de réception (vérifiés par `media-kit/verify.mjs`)

- 390 / 768 / 1440 / 1920 px × FR/EN : zéro débordement horizontal, zéro erreur runtime.
- LCP et CLS mesurés dans le contexte local ; payload initial < 1,5 Mo (mesuré ~224 Ko).
- Liens sûrs (`noopener noreferrer`), noms accessibles, focus visibles, alt FR/EN synchronisés.
- CWS `nnmkffkeilpnimdbiifhphpnflilhmno`, GitHub, Ko-fi : destinations réelles testées.

## Ne pas faire

- Pas de faux chiffres, pas de logo wall, pas de dégradés décoratifs, pas de texte en WebGL,
- pas de capture retouchée, pas d'icône Finder sur les dossiers, pas de CDN runtime.
