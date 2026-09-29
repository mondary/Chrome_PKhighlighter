# Media kit — capture et régénération

Tout le kit média est produit depuis l'interface **réelle** de l'extension (content script
`src/keyword-highlighter.js`) exécutée sur une page de démonstration à texte fictif.

## Flux

```bash
# 1. Serveur local (file:// casse les assets relatifs)
python3 -m http.server 4176 --bind 127.0.0.1   # à la racine du repo

# 2. Captures PNG (screenshots 05–08, panneau, 7 styles, contrôles Save/Clear/Ko-fi)
ego-browser nodejs -e 'const {capture}=await import("file://<repo>/store/media-kit/capture.mjs"); await capture({taskSpace});'

# 3. Boucle vidéo (44 frames déterministes : before → panneau → activation → style Candy)
ego-browser nodejs -e 'const {film}=await import("file://<repo>/store/media-kit/film.mjs"); await film({taskSpace});'

# 4. Assemblage MP4 + GIFs + dérivés web (wallpaper, webp, bannière, carte)
ffmpeg -y -v error -framerate 5 -i media-kit/frames/01-before-%02d.png \
  -framerate 5 -i media-kit/frames/02-panel-%02d.png \
  -framerate 5 -i media-kit/frames/03-highlight-%02d.png \
  -framerate 5 -i media-kit/frames/04-style-%02d.png \
  -filter_complex "[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[v]" -map "[v]" \
  -pix_fmt yuv420p -r 10 -movflags +faststart videos/demo.mp4
python3 media-kit/prepare.py          # dérivés webp + bannière + carte (Pillow)
python3 media-kit/prepare.py --vendor # (re)télécharge GSAP/Three.js versions figées

# 5. Vérification complète de la landing
ego-browser nodejs -e 'const {verify}=await import("file://<repo>/store/media-kit/verify.mjs"); await verify({taskSpace});'
```

`taskSpace` : espace ego-browser existant (page `p2` = fixtures, `p1` = landing).

## Sources et provenance

- **Page de démonstration** : `demo.html` — texte éditorial 100 % fictif. Le pont
  `chrome.runtime.onMessage` est un no-op hors extension installée ; les captures montrent donc
  le rendu du content script, pas la toolbar installée. Paramètres : `?before`, `?style=…`,
  `?sample` (mot isolé pour les aperçus de styles).
- **Wallpaper hero** : voir `assets/provenance.json` (id SHA-256, origine appWall, cadrage).
  Catalogue complet : skill `premium-promo-media` du hub (`assets/wallpapers/index.html`).
- **Bibliothèques** : GSAP 3.15.0 (licence standard GreenSock), Three.js 0.180.0 (MIT) —
  fichiers locaux dans `store/vendor/`, checksums dans `vendor/sources.json`. Elles ne servent
  que la page promo, jamais l'extension.

## Limites connues

- Les captures du panneau montrent l'UI française du produit (langue du navigateur de capture) ;
  le lien Ko-fi, lui, est localisé FR/EN.
- `frames/` (intermédiaires PNG) est ignoré par git — régénérable à tout moment.
- La bannière et la carte réseaux sociaux sont composées en Python (texte FR figé) : régénérer
  via `prepare.py` après toute changement de capture ou de titre.
