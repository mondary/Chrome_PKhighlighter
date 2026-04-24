# PK Keyword Highlighter 🖍️

![Project icon](icon.png)

[🇫🇷 FR](README.md) · [🇬🇧 EN](README_en.md)

✨ Un userscript qui surligne des mots-clés et barre ceux que vous excluez, avec plusieurs styles visuels.

## ✅ Fonctionnalités
- **Surlignage automatique** : Mise en évidence immédiate des mots-clés.
- **Exclusion intelligente** : Barre les phrases exclues en rouge pour éviter les faux positifs.
- **Styles visuels** : Choix entre Normal, Bold, Origami, Candy et Sticker.
- **Persistance locale** : Paramètres enregistrés par site via le stockage local.

## 🧠 Utilisation
1. Installez un gestionnaire de userscripts (Tampermonkey, Violentmonkey).
2. Ajoutez le script `keyword-highlighter.user.js`.
3. Cliquez sur le bouton **HL** sur votre page pour ouvrir le panneau de configuration.
4. Configurez vos listes :
   - **Highlight** : mots/phrases à surligner (séparés par des virgules).
   - **Exclude** : mots/phrases à barrer (séparés par des virgules).
   - **Style** : choisissez le rendu visuel.
5. Cliquez sur **Save** pour appliquer.

## ⚙️ Réglages
- Les exclusions sont appliquées avant le surlignage.
- Le script ignore les champs de saisie et son propre panneau d'interface.

## 🧾 Changelog
- 1.0.0 : Initial release.

## 🔗 Liens
- EN README : README_en.md
- Fichier principal : `keyword-highlighter.user.js`
- Historique : `CHANGELOG.md`
