# store/ — Carte du dossier

Matériel de présentation et de publication de PK Highlighter.
Détail du dossier de la fiche : [listing/description.md](listing/description.md).

## 🌍 `website/` — Le site complet, autoporté

**Tout ce qui constitue le site web tient dans ce dossier** : c'est lui qu'on uploade
tel quel sur l'hébergement (FTP). Aucun fichier du site ne vit en dehors.

| Fichier / dossier | Rôle |
|---|---|
| `website/index.html` | Landing promo bilingue FR/EN (page d'entrée) |
| `website/privacy-policy-pk-highlighter.html` | Politique de confidentialité (URL déclarée chez CWS) |
| `website/hero-scene.js` | Scène Three.js du hero (chargé dynamiquement, fallback sans WebGL) |
| `website/icon-128.png` | Icône produit (logo de la page confidentialité, upload CWS) |
| `website/assets/` | Assets web : icônes, wallpapers, captures lecture, aperçus des 7 styles, bannière, carte + `provenance.json` |
| `website/vendor/` | GSAP + Three.js locaux, versions figées, checksums dans `sources.json` — jamais utilisés par l'extension |

Règle : pour déployer ou mettre à jour le site, synchroniser ce dossier, rien d'autre.
`index.html` n'est **pas** autonome seul — il référence `assets/`, `vendor/`, `hero-scene.js`
et la page confidentialité en chemins relatifs.

## 📁 Le reste du dossier

| Dossier / fichier | Contenu | Utilisé par |
|---|---|---|
| `listing/` | **Fiche Chrome Web Store** : description, captures numérotées 01–08, images promo (440×280, 1400×560) | Upload manuel dans le dashboard CWS |
| `gifs/` | Démos animées (`demo-wide.gif`, `demo-compact.gif`) | READMEs, réseaux |
| `videos/` | Vidéo de démo (`demo.mp4`) | READMEs, réseaux |
| `media-kit/` | Outillage de régénération (captures, film, vérification, `demo.html`) — voir son [README](media-kit/README.md) | Travail local, `frames/` ignoré par git |
| `PLAN.md` | Direction approuvée de la landing — source de vérité pour toute régénération |
| `README.md` | Cette carte |

## 🔄 Régénérer le média

Tout le kit (captures, vidéo, GIF, bannière) est produit depuis l'UI réelle de
l'extension : suivre le flux documenté dans [`media-kit/README.md`](media-kit/README.md).

## Historique

- 2026-10 : refacto — dossier `website/` autoporté créé (site complet déployable tel quel),
  `hero-scene.js` relogé depuis `media-kit/` (il est requis au runtime), dossier `listing/`
  pour la fiche CWS, doublons PNG et docs obsolètes supprimés, README carte ajouté.
