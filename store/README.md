# store/ — Carte du dossier

Matériel de présentation et de publication de PK Highlighter.
Détail du dossier de la fiche : [listing/description.md](listing/description.md).

## 🌍 Fichiers publiés — ne pas déplacer

Ces fichiers sont servis par GitHub Pages et leurs URLs sont déclarées dans la fiche
Chrome Web Store. Les déplacer casserait des liens publics.

| Fichier | Rôle | URL publique |
|---|---|---|
| `index.html` | Landing promo bilingue FR/EN | `https://pkhighlighter.mondary.design/store/` |
| `privacy-policy-pk-highlighter.html` | Politique de confidentialité (URL déclarée chez CWS) | `…/store/privacy-policy-pk-highlighter.html` |
| `icon-128.png` | Icône de la fiche CWS + logo de la page confidentialité | — (référencé par la page) |

La landing référence `assets/`, `vendor/` et les GIF/vidéos en chemins relatifs :
leur emplacement est donc également figé.

## 📁 Dossiers

| Dossier | Contenu | Utilisé par |
|---|---|---|
| `listing/` | **Fiche Chrome Web Store** : description, captures numérotées 01–08, images promo (440×280, 1400×560) | Upload manuel dans le dashboard CWS |
| `assets/` | Assets web de la landing (icône, wallpapers, captures lecture, aperçus des 7 styles, bannière, carte) + `provenance.json` | `index.html` |
| `gifs/` | Démos animées (`demo-wide.gif`, `demo-compact.gif`) | READMEs, réseaux |
| `videos/` | Vidéo de démo (`demo.mp4`) | READMEs, réseaux |
| `vendor/` | GSAP + Three.js locaux, versions figées, checksums dans `sources.json` | `index.html` uniquement — jamais l'extension |
| `media-kit/` | Outillage de régénération (captures, film, dérivés web) — voir son [README](media-kit/README.md) | Travail local, `frames/` ignoré par git |

## 📄 Fichiers de travail

| Fichier | Rôle |
|---|---|
| `PLAN.md` | Direction approuvée de la landing — source de vérité pour toute régénération |
| `README.md` | Cette carte |

## 🔄 Régénérer le média

Tout le kit (captures, vidéo, GIF, bannière) est produit depuis l'UI réelle de
l'extension : suivre le flux documenté dans [`media-kit/README.md`](media-kit/README.md).

## Historique

- 2026-10 : refacto — dossier `listing/` créé (ex-captures et promos en racine),
  doublons PNG et docs obsolètes supprimés, README carte ajouté.
